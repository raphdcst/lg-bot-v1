import * as app from "#app"
import { UUID } from "crypto"

export interface Role {
  _id: UUID
  title: string
  description: string
  side: string
  aura: number
}

export default new app.Table<Role>({
  name: "role",
  setup: (table) => {
    table.increments("_id", { primaryKey: true }).unsigned()
    table.string("title")
    table.text("description")
    table.string("side")
    table.integer("aura")
  },
})