import * as app from "#app"

export interface Game {
  _id: string
  gameId: string
  running: boolean
  lap: number
  created_at: number
  players: Object
}

export default new app.Table<Game>({
  name: "game",
  setup: (table) => {
    table.string("_id").primary()
    table.string("gameId").notNullable()
    table.boolean("running").defaultTo(true)
    table.integer("lap").defaultTo(1)
    table.bigInteger("created_at")
    table.jsonb("players").defaultTo({})
  },
})