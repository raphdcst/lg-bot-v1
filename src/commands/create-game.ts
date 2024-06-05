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
    // todo: code here
    return message.channel.send(`Provided options : ${message.args.lap} mins and ${message.args.template}`)
  }
})