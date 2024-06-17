import * as app from "#app"
import ShortUniqueId from "short-unique-id"
import gameTable from "#tables/game.ts"
import lgUserTable from "#tables/lgUser.ts"


const createLogger = new app.Logger({ section: "create" })

export function genId(char: number): string {
    const id = new ShortUniqueId({ length: char })

    return id.rnd()
}

export async function findOrCreatePlayer(user: app.User): Promise<string> {

    const data = await lgUserTable.query.where('discordId', parseInt(user.id)).returning('*')

    console.log(data)

    if (data[0]) {

        const existing = data[0]._id

        app.log(`Player "${existing}" already exists in db`)

        return existing

    }

    else {

        createLogger.log(`Creating player in db...`)

        return createPlayer(user)
    }

}

export async function createPlayer(user: app.User): Promise<string> {

    try {
        const data = await lgUserTable.query.insert({
            _id: genId(12),
            discordId: parseInt(user.id),
            username: user.username,
            created_at: Date.now()
        })
            .returning('_id')
            .onConflict("discordId")
            .merge(['discordId', 'games', 'created_at', 'friends', 'guild', 'hated', 'is_admin', 'level', 'nickname', 'username', 'wallet'])
            .returning('*')

        console.log(data)

        const newPlayer = data[0]._id

        createLogger.success(`Created new player : ${newPlayer}`)

        return newPlayer
    } catch (err: any) {
        createLogger.error(`An error occured during the player insertion : `, err)

        return err
    }

}

export async function createGame(user: app.User, max_players: number, lap_duration?: number): Promise<[string, string]> {

    try {

        const author: string | void = await findOrCreatePlayer(user)

        const data = await gameTable.query.insert({
            _id: genId(12),
            gameId: genId(5),
            created_at: Date.now(),
            max_players: max_players,
            lap_duration: lap_duration ? lap_duration : 120,
            players: { 1: author }
        }).returning('*')

        console.log(data)

        const newGame = data[0].gameId

        createLogger.success(`Created new game : ${newGame}`)

        return [newGame, author]

    } catch (err: any) {

        createLogger.error(`An error occured during the game insertion : `, err)
        return err
    }
}
