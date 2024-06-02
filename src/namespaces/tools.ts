import * as app from "#app"

import guildTable from "#tables/guild.js"

export async function getGuildPrefix(guild?: app.Guild | null): Promise<string> {
  let prefix = process.env.BOT_PREFIX as string
  
  if (guild) {
    const guildData = await guildTable.query
      .where("id", guild.id)
      .select("prefix")
      .first()
      
    if (guildData) return guildData.prefix ?? prefix
  }
  
  return prefix
}