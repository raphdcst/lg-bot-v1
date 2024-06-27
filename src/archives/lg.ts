import * as app from "#app"
import ShortUniqueId from "short-unique-id"
import gameTable, { Game } from "#tables/game.ts"
import lgUserTable, { LGUser } from "#tables/lgUser.ts"
import { APIEmbedField } from "discord-api-types/v10"
import { ActionRowBuilder, ButtonBuilder, ButtonComponent, ButtonStyle } from "discord.js"


const createLogger = new app.Logger({ section: "create" })
const fetchLogger = new app.Logger({ section: "fetch" })

export function genId(char: number): string {
    const id = new ShortUniqueId({ length: char })

    return id.rnd()
}

export async function findOrCreatePlayer(message: app.Message): Promise<[LGUser[], string] | Error> {

    const user = message.author

    const data = await lgUserTable.query.where('discordId', parseInt(user.id)).returning('*')

    console.log(data)

    if (data[0]) {

        const existing = data[0]._id

        app.log(`Player "${existing}" already exists in db`)

        return [data, existing]

    }

    else {

        createLogger.log(`Creating player in db...`)

        return createPlayer(message)
    }

}

export async function createPlayer(message: app.Message): Promise<[LGUser[], string] | Error> {

    try {

        const user = message.author

        const data = await lgUserTable.query.insert({
            _id: genId(12),
            discordId: parseInt(user.id),
            username: user.username,
            created_at: Date.now()
        })
            .returning('*')
            .onConflict("discordId")
            .merge(['discordId', 'games', 'created_at', 'friends', 'guild', 'hated', 'is_admin', 'level', 'nickname', 'username', 'wallet'])
            .returning('*')

        console.log(data)

        const newPlayer = data[0]._id

        createLogger.success(`Created new player : ${newPlayer}`)

        return [data, newPlayer]
    } catch (err: any) {
        createLogger.error(`An error occured during the player insertion : ${err}`)

        await message.reply(`An error occured during the player insertion : ${err}`)

        return err as Error
    }

}

export async function createGame(message: app.Message, max_players: number, lap_duration?: number): Promise<[Game[], string, string] | Error> {

    try {

        const author = await findOrCreatePlayer(message)

        if (author instanceof Error) {

            const err = author as Error

            createLogger.error(`An error occured during the game insertion : ${err}`)

            await message.reply(`An error occured during the game insertion : ${err}`)

            return author
        }

        const data = await gameTable.query.insert({
            _id: genId(12),
            gameId: genId(5),
            created_at: Date.now(),
            max_players: max_players,
            lap_duration: lap_duration ? lap_duration : 120,
            players: { 1: author[1] }
        }).returning('*')

        console.log(data)

        const newGame = data[0].gameId

        createLogger.success(`Created new game : ${newGame}`)

        return [data, newGame, author[1]]

    } catch (err: any) {

        createLogger.error(`An error occured during the game insertion : ${err}`)

        await message.reply(`An error occured during the game insertion : ${err}`)

        return err as Error
    }
}

export async function playersToFields(game: any): Promise<APIEmbedField[]> {

    const playersField: APIEmbedField[] = await Object.entries(game.players).reduce<Promise<APIEmbedField[]>>(async (accPromise, [key, value]) => {

        const acc = await accPromise;

        try {

            const data = await lgUserTable.query
                .select('username', 'nickname', 'discordId')
                .where('_id', value as string)
                .first();

            if (data) {
                const { username, nickname, discordId } = data;

                const name: string = nickname ? nickname : 'No nickname founded'

                acc.push({

                    name: `${username} : <@${discordId}>`,
                    value: `Player Id : \`${value}\` \n Nickname : ${name}`

                });
            }

            fetchLogger.success(`Succesfully fetched the following id : "${value}"`)

        } catch (err) {

            fetchLogger.error(`An error occured during fetch of the following id : "${value}" => ${err}`);

        }

        return acc;

    }, Promise.resolve([]));

    return playersField;
}


export async function createGameEmbed(message: app.Message, currentGame: Game[], author: app.User): Promise<void> {

    const game = currentGame[0] as Game

    const playersField: APIEmbedField[] = await playersToFields(game)

    const joinButton = new ButtonBuilder()
        .setCustomId('join')
        .setLabel('➡ Join')
        .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(joinButton);

    const embed = {
        color: 0x0099ff,
        title: 'New game created !',
        footer: {
            text: author.username,
            icon_url: author.avatarURL({ size: 64 }) || undefined
        },
        description: `\`${game.gameId}\``,
        thumbnail: {
            url: 'https://cdn.discordapp.com/avatars/1246848582745723024/394fa5d5f4fac0d07cfad06440f98293.webp?size=1024&format=webp&width=0&height=128',
        },
        fields: playersField
    }

    const response = await message.channel.send({ embeds: [embed], components: [row] })

    try {
        const confirmation = await response.awaitMessageComponent({ time: 30_000 });

        if (confirmation.customId === 'join') {
            await message.reply(`You will join the game with the following id : ${game.gameId}`)
        }

        return;

    } catch (e) {
        await message.reply({ content: 'Confirmation not received within 30s minute, cancelling', components: [] });
    }

}
