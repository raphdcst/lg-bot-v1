import * as app from "#app"

export default new app.Command({
  name: "dashboard",
  description: "Create the LG Bot dashboard in a specific channel",
  channelType: "guild",
  positional: [
    {
      name: 'channel',
      type: 'string',
      description: 'The channel name'
    }
  ],
  async run(message) {

    const msg = message as app.Message<true>

    const channelName = message.args.channel

    await app.createDashboard(msg, channelName)

  }
})