import * as app from '#app'
import guildTable from "#tables/guild.ts"
import { randomUUID } from 'crypto'

export default new app.Command({
  name: "prefix",
  description: "Edit if option provided, or show the bot prefix",
  guildOwnerOnly: true,
  channelType: "guild",
  positional: [
    {
      name: "prefix",
      description: "The new prefix",
      type: "string",
      validate: (value) => value.length < 10 && /^\S/.test(value),
    },
  ],
  async run(message) {
    const prefix = message.args.prefix

    if (!prefix)
      return message.channel.send(
        `My current prefix for "**${message.guild}**" is \`${await app.getGuildPrefix(message.guild)
        }\``,
      )

    await guildTable.query
      .insert({
        _id: randomUUID(),
        id: parseInt(message.guild.id),
        prefix: prefix,
      })
      .onConflict("id")
      .merge()

    await message.channel.send(
      `My new prefix for "**${message.guild}**" is \`${prefix}\``,
    )

  }
})