import * as app from "#app"
import ShortUniqueId from "short-unique-id"
import gameTable, { Game } from "#app/tables/game.js"
import playerTable, { Player } from "#app/tables/player.js"

export function genId(char: number): string {
    const id = new ShortUniqueId({ length: char})

    return id.rnd()
}

export async function createPlayer(user: app.User): Promise<Player> {

    const newPlayer = await playerTable.query.insert({
        discordId: parseInt(user.id)
    }).returning(['_id', 'discordId', 'role', 'alive']) as Player

    return newPlayer
}

export async function createGame(user: app.User): Promise<Game<Player>> {

    const newGame = await gameTable.query.insert({
        gameId: genId(5),
        created_at: Date.now(),
        players: [await createPlayer(user)]
    }).returning(['_id', 'gameId', 'running', 'lap', 'created_date', 'players']) as Game<Player>

    return newGame
}
