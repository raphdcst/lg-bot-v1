import * as app from "#app"
import ShortUniqueId from "short-unique-id"
import gameTable, { Game } from "#tables/game.ts"
import lgUserTable, { LGUser } from "#tables/lgUser.ts"


const createLogger = new app.Logger({ section: "create" })

export function genId(char: number): string {
    const id = new ShortUniqueId({ length: char })

    return id.rnd()
}

export async function findOrCreatePlayer(message: app.Message): Promise<[LGUser[], string] | Error> {

    const user = message.client.user

    const data = await lgUserTable.query.where('discordId', parseInt(user.id)).returning('*')

    console.log(data)

    if (data[0]) {

        const existing = data[0]._id

        app.log(`Player "${existing}" already exists in db`)

        return [data, existing]

    }

    else {

        createLogger.log(`Creating player in db...`)

        return createPlayer(message)
    }

}

export async function createPlayer(message: app.Message): Promise<[LGUser[], string] | Error> {

    try {

        const user = message.client.user

        const data = await lgUserTable.query.insert({
            _id: genId(12),
            discordId: parseInt(user.id),
            username: user.username,
            created_at: Date.now()
        })
            .returning('*')
            .onConflict("discordId")
            .merge(['discordId', 'games', 'created_at', 'friends', 'guild', 'hated', 'is_admin', 'level', 'nickname', 'username', 'wallet'])
            .returning('*')

        console.log(data)

        const newPlayer = data[0]._id

        createLogger.success(`Created new player : ${newPlayer}`)

        return [data, newPlayer]
    } catch (err: any) {
        createLogger.error(`An error occured during the player insertion : ${err}`)

        await message.reply(`An error occured during the player insertion : ${err}`)

        return err as Error
    }

}

export async function createGame(message: app.Message, max_players: number, lap_duration?: number): Promise<[Game[], string, string] | Error> {

    try {

        const author = await findOrCreatePlayer(message)

        if (author instanceof Error) {

            const err = author as Error

            createLogger.error(`An error occured during the game insertion : ${err}`)

            await message.reply(`An error occured during the game insertion : ${err}`)

            return author
        }

        const data = await gameTable.query.insert({
            _id: genId(12),
            gameId: genId(5),
            created_at: Date.now(),
            max_players: max_players,
            lap_duration: lap_duration ? lap_duration : 120,
            players: { 1: author[1] }
        }).returning('*')

        console.log(data)

        const newGame = data[0].gameId

        createLogger.success(`Created new game : ${newGame}`)

        return [data, newGame, author[1]]

    } catch (err: any) {

        createLogger.error(`An error occured during the game insertion : ${err}`)

        await message.reply(`An error occured during the game insertion : ${err}`)

        return err as Error
    }
}
