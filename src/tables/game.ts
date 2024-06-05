import * as app from "#app"
import { UUID } from "crypto"
import { Player } from "#tables/player"

export interface Game<Player> {
  _id: UUID | undefined
  gameId: string
  running: boolean
  lap: number
  "created_at": number
  players: Player[]
}

export default new app.Table<Game<Player>>({
  name: "game",
  setup: (table) => {
    table.uuid("_id", { primaryKey: true })
    table.string("gameId").notNullable()
    table.boolean("running").defaultTo(true)
    table.integer("lap").defaultTo(1)
    table.integer('created_at')
    table.jsonb("players").notNullable()
  },
})