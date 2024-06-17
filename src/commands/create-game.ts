import * as app from "#app"

export default new app.Command({
  name: "start",
  description: "Start a new LG game, with the provided settings",
  channelType: "guild",
  positional: [
    {
      name: "max_players",
      type: "number",
      description: "The max number of players",
    },
    {
      name: "lap_duration",
      type: "number",
      description: "The duration of a lap, in seconds",
    },
    {
      name: "template",
      type: "string",
      description: "An existing template of roles",
    },
  ],
  async run(message) {

    const author = message.client.user
    const lap_duration: number = message.args.lap_duration
    const max_players: number = message.args.max_players

    const [game, player] = await app.createGame(author, max_players, lap_duration)

    return message.channel.send(`New game created (\`${game}\`) by player \`${player}\`, with the following parameters : \n Max number of players : ${max_players} \n Lap duration : ${lap_duration}s`)
    // return message.channel.send(`New game created (\`${id}\`) with the following options : ${message.args.lap} mins and ${message.args.template}`)
  }
})