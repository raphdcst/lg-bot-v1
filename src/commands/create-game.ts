import * as app from "#app"

export default new app.Command({
  name: "start",
  description: "Start a new LG game, with the provided settings",
  channelType: "all",
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

    await app.createGame(message)

    // if (!message.args.max_players) return message.reply("Please provide a max number of players in your command...");

    // const user = message.author
    // const lap_duration: number = message.args.lap_duration
    // const max_players: number = message.args.max_players

    // const result = await app.createGame(message, max_players, lap_duration)

    // if (result instanceof Error) return;

    // const [game, gameId, author] = result

    // return await app.createGameEmbed(message, game, user)

    // return message.channel.send(`New game created (\`${gameId}\`) by player \`${author}\`, with the following parameters : \n Max number of players : ${max_players} \n Lap duration : ${lap_duration ? lap_duration : 120}s`)
  }
})