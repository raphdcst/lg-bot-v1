import * as app from "#app"

export default new app.Command({
  name: "roles",
  description: "Return details of the selected role, or details for all roles",
  channelType: "guild",
  positional: [
    {
      name: "role",
      type: "string",
      description: "The target command name.",
    },
  ],
  async run(message) {
    if (message.args.role) {
      const cmd = message.args.role
    }
  }
})