import * as app from "#app"

export interface Guild {
  _id: number
  id: string
  prefix: string | null
}

export default new app.Table<Guild>({
  name: "guild",
  setup: (table) => {
    table.increments("_id", { primaryKey: true }).unsigned()
    table.string("id").unique().notNullable()
    table.string("prefix")
  },
})