import * as app from "#app"

export default new app.Command({
  name: "embedTest",
  botOwnerOnly: true,
  description: "The embedTest command",
  aliases: ["et"],
  channelType: "all",
  positional: [
    {
      name: "embedFuction",
      type: "string",
      description: "An embed function",
    },
    {
      name: "color",
      type: "string",
      description: "A associated color : INFO, SUCCESS, WARN, ERROR",
    }
  ],
  async run(message) {

    const func = message.args.embedFuction
    const color = message.args.color as app.EmbedColor

    if (!func) return message.reply({ content: `Please select an option...`})

    if (func == 'error') {

      const err = new Error("Here's a fake error")

      const embed = app.createErrorEmbed({err: err, color: color})

      return await message.reply({ embeds: [embed] })
    }

    if (func == 'small') {

      const desc = "Here's a fake description"

      const embed = app.createSmallEmbed({description: desc, color: color})

      return await message.reply({ embeds: [embed] })

    }

  }
})