import * as app from "#app"
import ShortUniqueId from "short-unique-id"
import gameTable, { Game } from "#tables/game.ts"
import playerTable, { Player } from "#tables/player.ts"


export function genId(char: number): string {
    const id = new ShortUniqueId({ length: char })

    return id.rnd()
}

export async function createPlayer(user: app.User): Promise<string> {

    const data = await playerTable.query.insert({
        _id: genId(12),
        discordId: parseInt(user.id)
    })
        .returning('_id')
        .onConflict("discordId")
        .ignore()
        .returning('_id')

    console.log(data)

    const newPlayer = data.map(player => player._id).join(', ')

    return newPlayer
}

export async function createGame(user: app.User): Promise<[string, string]> {

    const author = await createPlayer(user)

    const data = await gameTable.query.insert({
        _id: genId(12),
        gameId: genId(5),
        created_at: Date.now(),
    }).returning('_id')

    console.log(data)

    const newGame= data.map(game => game._id).join(', ')

    return [newGame, author]
}
