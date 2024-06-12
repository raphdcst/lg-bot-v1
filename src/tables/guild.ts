import * as app from "#app"

export interface Guild {
  _id: string
  id: number
  prefix: string | null
}

export default new app.Table<Guild>({
  name: "guild",
  setup: (table) => {
    table.string("_id").primary()
    table.bigInteger("id").unique().notNullable()
    table.string("prefix")
  },
})