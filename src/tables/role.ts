import * as app from "#app"

export interface Role {
  _id: number
  title: string
  description: string | null
  side: string | null
  aura: number | null
}

export default new app.Table<Role>({
  name: "role",
  setup: (table) => {
    table.increments("_id", { primaryKey: true }).unsigned()
    table.string("title").notNullable()
    table.text("description")
    table.string("side")
    table.integer("aura")
  },
})