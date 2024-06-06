import * as app from "#app"
import ShortUniqueId from "short-unique-id"
import gameTable, { Game } from "#tables/game.ts"
import playerTable, { Player } from "#tables/player.ts"
import { randomUUID } from "crypto"

export function genId(char: number): string {
    const id = new ShortUniqueId({ length: char})

    return id.rnd()
}

export async function createPlayer(user: app.User): Promise<Player> {

    const newPlayer = await playerTable.query.insert({
        _id: randomUUID(),
        discordId: parseInt(user.id)
    }).returning(['_id', 'discordId', 'alive']) as Player

    return newPlayer
}

export async function createGame(user: app.User): Promise<Game<Player>> {

    const newGame = await gameTable.query.insert({
        _id: randomUUID(),
        gameId: genId(5),
        created_at: Date.now(),
        players: [await createPlayer(user)]
    }).returning(['_id', 'gameId', 'running', 'lap', 'created_date', 'players']) as Game<Player>

    return newGame
}
