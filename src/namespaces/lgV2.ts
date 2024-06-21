import * as app from "#app"
import ShortUniqueId from "short-unique-id"
import { toUSVString } from "util"

export function genId(char: number): string {
    const id = new ShortUniqueId({ length: char })

    return id.rnd()
}

export async function createGame(message: app.Message) {

    const author = message.author
    const bot = message.client.user
    const gameId = genId(5)

    const StartButton = new app.ButtonBuilder()
        .setCustomId('start')
        .setLabel('➡ Start config')
        .setStyle(app.ButtonStyle.Success);

    const createGameRow = new app.ActionRowBuilder<app.ButtonBuilder>()
        .addComponents(StartButton);

    const createGameEmbed = {
        color: 0x0099ff,
        title: `Hello ${author.username} ! Welcome in the game configuration !`,
        description: `Your game id will be \`${gameId}\` !`,
        thumbnail: {
            url: 'https://cdn.discordapp.com/avatars/1246848582745723024/394fa5d5f4fac0d07cfad06440f98293.webp?size=1024&format=webp&width=0&height=128',
        },
        fields: [
            {
                name: 'Explanation : ',
                value: `In the following steps, you will create your own game of LG with the help of our amazing bot, ${bot.username}. 
                \n Please follow all the steps and **do not quit the config before the end !!**. If it's okay to you, you can click on the button below. Enjoy !`
            }
        ],
        footer: {
            text: bot.username,
            icon_url: bot.avatarURL() || undefined
        },
    }

    const startConfigResponse = await author.send({ embeds: [createGameEmbed], components: [createGameRow] })

    await message.reply('Your received a DM to start the config of your game !')

    const configModal = new app.ModalBuilder()
        .setCustomId('config')
        .setTitle('Config Modal');

    const maxPlayersInput = new app.TextInputBuilder()
        .setCustomId('maxPlayers')
        .setLabel("What's the max amount of players ?")
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(2)

    const maxPlayersRow = new app.ActionRowBuilder<app.ModalActionRowComponentBuilder>().addComponents(maxPlayersInput);

    configModal.addComponents(maxPlayersRow);


    try {
        // const startConfigCollector: app.InteractionCollector<app.ButtonInteraction> = await startConfigResponse.awaitMessageComponent<app.ComponentType.Button>({ time: 30_000 });


        const startConfigCollector = startConfigResponse.createMessageComponentCollector({
            componentType: app.ComponentType.Button,
            time: 15_000
        })

        startConfigCollector.on('collect', async (interaction) => {
            if (interaction.customId === 'start') {

                await author.send(`Starting config for the following id game : \`${gameId}\`...`)

                await interaction.showModal(configModal)
                
            }
        })

        startConfigCollector.on('end', () => {
            StartButton.setDisabled(true)
        })


    } catch (e: any) {

        const cancelEmbed = {
            color: 0xd42424,
            title: 'Confirmation not received within 10s, cancelling !',
            description: toUSVString(e),
            footer: {
                text: bot.username,
                icon_url: bot.avatarURL() || undefined
            },
        }

        return await author.send({ embeds: [cancelEmbed] });
    }
}
