import * as app from "#app"
import { UUID } from "crypto"

export interface Guild {
  _id: UUID
  guildId: string
  prefix: string | null
}

export default new app.Table<Guild>({
  name: "guild",
  setup: (table) => {
    table.uuid("_id", { primaryKey: true })
    table.string("guildId").unique().notNullable()
    table.string("prefix")
  },
})