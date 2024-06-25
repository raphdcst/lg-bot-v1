import * as app from "#app"

export async function createDashboard(message: app.Message<true>, channelName: string) {

    const bot = message.client.user

    const dashboardEmbed: app.APIEmbed = {
        color: app.EmbedColors.INFO,
        title: "Here's the dashboard to control LG Bot !",
        description: "Be carefull, some commands are only allowed to owner and/or admins.",
        timestamp: new Date().toISOString(),
        footer: {
            text: bot.username,
            icon_url: bot.avatarURL() || undefined
        }
    }

    const StartButton = new app.ButtonBuilder()
        .setCustomId('start')
        .setLabel('➡ Create a new game')
        .setStyle(app.ButtonStyle.Success);

    const LeaveButton = new app.ButtonBuilder()
        .setCustomId('leave')
        .setLabel('➡ Leave')
        .setStyle(app.ButtonStyle.Danger)
        .setDisabled(true)

    const dashboardRow = new app.ActionRowBuilder<app.ButtonBuilder>()
        .addComponents(StartButton, LeaveButton);


    try {
        
        const channel = await message.guild.channels.create({ name: channelName, type: app.ChannelType.GuildText })

        const dashboardResponse = await channel.send({ embeds: [dashboardEmbed], components: [dashboardRow] })

        await message.reply({ content: 'The dashboard has been sent !' })
        

        const dashboardCollector = dashboardResponse.createMessageComponentCollector({ componentType: app.ComponentType.Button })

        dashboardCollector
        .on('collect', async (i) => {

            app.interactionLogger.success(`Interaction collected : ${i.id}`)

            return await app.createGameWithInteraction(i)
        })

    } catch (e) {

        const err = e as Error

        return app.interactionLogger.error(err)

    }

}