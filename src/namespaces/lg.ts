import * as app from "#app"
import ShortUniqueId from "short-unique-id"
import gameTable from "#tables/game.ts"
import playerTable from "#tables/player.ts"


export function genId(char: number): string {
    const id = new ShortUniqueId({ length: char })

    return id.rnd()
}

export async function findOrCreatePlayer(user: app.User): Promise<string> {

    const data = await playerTable.query.where('discordId', parseInt(user.id)).returning('*')

    console.log(data)

    if (data) {



        const existing = data[0]?._id

        console.log(`Player "${existing}" already exists in db`)

        return existing

    }

    else {

        console.log(`Creating player in db...`)

        return createPlayer(user)
    }

}

export async function createPlayer(user: app.User): Promise<string> {

    const data = await playerTable.query.insert({
        _id: genId(12),
        discordId: parseInt(user.id)
    })
        .returning('_id')
        .onConflict("discordId")
        .merge(['discordId', 'alive', 'games'])
        .returning('*')

    console.log(data)

    const newPlayer = data[0]._id

    console.log(`Created new player : ${newPlayer}`)

    return newPlayer
}

export async function createGame(user: app.User): Promise<[string, string]> {

    const author: string = await findOrCreatePlayer(user)

    const data = await gameTable.query.insert({
        _id: genId(12),
        gameId: genId(5),
        created_at: Date.now(),
        players: { 1: author }
    }).returning('*')

    console.log(data)

    const newGame = data[0].gameId

    console.log(`Created new game : ${newGame}`)

    return [newGame, author]
}
