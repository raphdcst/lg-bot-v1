import * as app from "#app"

export default new app.Command({
  name: "start",
  description: "Start a new LG game, with the provided settings",
  channelType: "guild",
  positional: [
    {
      name: "lap",
      type: "number",
      description: "The duration of a lap, in minutes",
    },
    {
      name: "template",
      type: "string",
      description: "An existing template of roles",
    },
  ],
  async run(message) {

    const author = message.client.user

    const [game, player] = await app.createGame(author)

    return message.channel.send(`New game created (${game}) by player ${player}`)
    // return message.channel.send(`New game created (\`${id}\`) with the following options : ${message.args.lap} mins and ${message.args.template}`)
  }
})