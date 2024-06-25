import * as app from "#app"

export default new app.Command({
  name: "config",
  botOwnerOnly: true,
  description: "Start config on a new server",
  channelType: "guild",
  async run(message) {

    const msg = message as app.Message<true>

    await app.fetchGuild(msg)

  }
})