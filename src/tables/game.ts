import * as app from "#app"
import { Player } from "#tables/player.ts"

export interface Game {
  _id: string
  gameId: string
  running: boolean
  lap: number
  "created_at": number
  players: Pick<Player, "_id">[]
}

export default new app.Table<Game>({
  name: "game",
  setup: (table) => {
    table.string("_id").primary()
    table.string("gameId").notNullable()
    table.boolean("running").defaultTo(true)
    table.integer("lap").defaultTo(1)
    table.bigInteger('created_at')
    table.jsonb("players").defaultTo([])
  },
})