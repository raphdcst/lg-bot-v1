import * as app from "#app"

export interface LGUser {
  _id: string
  discordId: number
  username: string
  created_at: number
  nickname: string
  wallet: object
  level: number
  games: object
  friends: object
  guild: object
  hated: object
  is_admin: boolean
}

export default new app.Table<LGUser>({
  name: "player",
  setup: (table) => {
    table.string("_id").primary()
    table.bigInteger("discordId").unique().notNullable()
    table.string("username").defaultTo("")
    table.bigInteger("created_at").notNullable()
    table.string("nickname").defaultTo("")
    table.jsonb("wallet").defaultTo({})
    table.integer("level").defaultTo(0)
    table.jsonb("games").defaultTo({})
    table.jsonb("friends").defaultTo({})
    table.jsonb("guild").defaultTo({})
    table.jsonb("hated").defaultTo({})
    table.boolean("is_admin").defaultTo(false)
  },
})