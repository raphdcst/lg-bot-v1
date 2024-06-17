import * as app from "#app"

export interface Game {
  _id: string
  gameId: string
  created_at: number
  ended_at: number
  min_players: number
  max_players: number
  lap_duration: number
  roles: object
  has_started: boolean
  is_running: boolean
  lap: number
  players: object
  living: object
  dead: object
  logs: object
}

export default new app.Table<Game>({
  name: "game",
  setup: (table) => {
    table.string("_id").primary()
    table.string("gameId").notNullable()
    table.bigInteger("created_at")
    table.bigInteger("ended_at").nullable()
    table.integer("min_players").defaultTo(2)
    table.integer("max_players").notNullable()
    table.integer("lap_duration").defaultTo(120)
    table.jsonb("roles").defaultTo({})
    table.boolean("has_started").defaultTo(false)
    table.boolean("is_running").defaultTo(false)
    table.integer("lap").defaultTo(0)
    table.jsonb("players").defaultTo({})
    table.jsonb("living").defaultTo({})
    table.jsonb("dead").defaultTo({})
    table.jsonb("logs").defaultTo({})
  },
})