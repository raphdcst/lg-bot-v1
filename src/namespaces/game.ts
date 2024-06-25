import * as app from "#app"

export async function createGameWithInteraction(interaction: app.Interaction) {

    const author = interaction.user
    const bot = interaction.client.user
    const gameId = app.genId(5)

    const StartButton = new app.ButtonBuilder()
        .setCustomId('start')
        .setLabel('➡ Start config')
        .setStyle(app.ButtonStyle.Success);

    const LeaveButton = new app.ButtonBuilder()
        .setCustomId('leave')
        .setLabel('➡ Leave config')
        .setStyle(app.ButtonStyle.Danger);

    const createGameRow = new app.ActionRowBuilder<app.ButtonBuilder>()
        .addComponents(StartButton, LeaveButton);

    const createGameEmbed = {
        color: app.EmbedColors.INFO,
        title: `Hello ${author.username} ! Welcome in the game configuration !`,
        description: `Your game id will be \`${gameId}\` !`,
        thumbnail: {
            url: 'https://cdn.discordapp.com/avatars/1246848582745723024/394fa5d5f4fac0d07cfad06440f98293.webp?size=1024&format=webp&width=0&height=128',
        },
        fields: [
            {
                name: 'Explanation : ',
                value: `In the following steps, you will create your own game of LG with the help of our amazing bot, ${bot.username}. 
                \n Please follow all the steps and **do not leave the config before the end !!**. If it's okay to you, you can click on the button below. Enjoy !`
            }
        ],
        footer: {
            text: bot.username,
            icon_url: bot.avatarURL() || undefined
        },
    }

    const configModal = new app.ModalBuilder()
        .setCustomId('config')
        .setTitle('Config Modal');

    const maxPlayersInput = new app.TextInputBuilder()
        .setCustomId('maxPlayers')
        .setLabel("What's the max amount of players ?")
        .setRequired(true)
        .setStyle(app.TextInputStyle.Short)

    const lapDurationInput = new app.TextInputBuilder()
        .setCustomId('lapDuration')
        .setLabel("What's the duration of one lap (in secs) ?")
        .setRequired(true)
        .setStyle(app.TextInputStyle.Short)

    const templateInput = new app.TextInputBuilder()
        .setCustomId('template')
        .setLabel("Use a preset of roles ? (yes/no)")
        .setRequired(true)
        .setStyle(app.TextInputStyle.Short)

    const maxPlayersRow = new app.ActionRowBuilder<app.ModalActionRowComponentBuilder>().addComponents(maxPlayersInput);
    const lapDurationRow = new app.ActionRowBuilder<app.ModalActionRowComponentBuilder>().addComponents(lapDurationInput);
    const templateRow = new app.ActionRowBuilder<app.ModalActionRowComponentBuilder>().addComponents(templateInput);

    configModal.addComponents(maxPlayersRow, lapDurationRow, templateRow);

    try {

        const startConfigResponse = await author.send({ embeds: [createGameEmbed], components: [createGameRow] })

        const startConfigCollector = startConfigResponse.createMessageComponentCollector({ componentType: app.ComponentType.Button, time: 120_000 })

        startConfigCollector.on('collect', async i => {

            if (!i.isButton()) return;

            app.interactionLogger.success(`Interaction collected : ${i.id}`)

            if (i.customId === 'leave') {

                const leaveEmbed = app.createSmallEmbed({ description: 'Leaving game config !', bot: bot })

                await i.reply({ embeds: [leaveEmbed] })

                return startConfigCollector.stop()
            }

            else if (i.customId === 'start') {

                await i.showModal(configModal)

                await i
                    .awaitModalSubmit({ time: 60_000 })
                    .then(async (modalInteraction) => {

                        const maxPlayers = modalInteraction.fields.getTextInputValue('maxPlayers')
                        const lapDuration = modalInteraction.fields.getTextInputValue('lapDuration')
                        const template = modalInteraction.fields.getTextInputValue('template')

                        const modalDataEmbed = {
                            color: app.EmbedColors.SUCCESS,
                            title: `Form submitted !`,
                            description: `Here's the data you entered for the following game id : ${gameId}`,
                            thumbnail: {
                                url: 'https://cdn.discordapp.com/avatars/1246848582745723024/394fa5d5f4fac0d07cfad06440f98293.webp?size=1024&format=webp&width=0&height=128',
                            },
                            fields: [
                                {
                                    name: 'Max total of players',
                                    value: `${maxPlayers}`,
                                    inline: true
                                },
                                {
                                    name: 'Lap duration',
                                    value: `${lapDuration}`,
                                    inline: true
                                },
                                {
                                    name: 'Template ?',
                                    value: `${template}`,
                                    inline: true
                                },
                            ],
                            footer: {
                                text: bot.username,
                                icon_url: bot.avatarURL() || undefined
                            },
                        }

                        return await modalInteraction.reply({ embeds: [modalDataEmbed] })

                    })
                    .catch(async (e) => {

                        const err = e as Error

                        app.interactionLogger.error(e)

                        const errorEmbed = app.createErrorEmbed({ err: err, bot: bot })

                        return await author.send({ embeds: [errorEmbed] })
                    })
            }

        });

        startConfigCollector.on('end', async (collected) => {

            const endEmbed = app.createSmallEmbed({ description: `Collected ${collected.size} interactions.`, bot: bot })

            await author.send({ embeds: [endEmbed] })

            return app.interactionLogger.log(`Collected ${collected.size} interactions.`);

        })
    } catch (e) {

        const err = e as Error

        const errorEmbed = app.createErrorEmbed({ err: err, bot: bot })

        return await author.send({ embeds: [errorEmbed] })
    }
}
