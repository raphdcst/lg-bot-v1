import * as app from "#app"
import { Game } from "#tables/game.ts"

export interface Player {
  _id: string
  discordId: number
  // role: number | undefined
  alive: boolean
  games: Object
}

export default new app.Table<Player>({
  name: "player",
  setup: (table) => {
    table.string("_id").primary()
    table.bigInteger("discordId").unique().notNullable()
    // table.integer("role").references("id").inTable("role")
    table.boolean("alive").defaultTo(true)
    table.jsonb("games").defaultTo({})
  },
})