import * as app from "#app"
import { UUID } from "crypto"

export interface Player {
  _id: UUID
  discordId: number
  // role: number | undefined
  alive: boolean
}

export default new app.Table<Player>({
  name: "player",
  setup: (table) => {
    table.uuid("_id", { primaryKey: true })
    table.bigInteger("discordId").unique().notNullable()
    // table.integer("role").references("id").inTable("role")
    table.boolean("alive").defaultTo(true)
  },
})