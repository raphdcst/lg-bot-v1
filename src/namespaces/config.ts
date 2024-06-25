import * as app from "#app"

export enum BaseLgGuildCategories {

    INFOS_CATEGORY = "INFORMATIONS",
    CHAT_CATEGORY = "TEXT CHAT",
    VOICE_CATEGORY = "VOICE CHAT",
    COMMANDS_CATEGORY = "COMMANDS",
    HELP_CATEGORY = "HELP",

}

export type BaseLgGuildCategory = keyof typeof BaseLgGuildCategories


export enum BaseLgGuildInfosChannels {

    WELCOME_CHANNEL = "👋-welcome",
    RULES_CHANNEL = "📜-rules",
    PRESENTATION_CHANNEL = "🖋-presentation",
    ANNOUNCEMENT_CHANNEL = "📢-announcement",
    ROLES_CHANNEL = "👤-roles",

}

export type BaseLgGuildInfosChannel = keyof typeof BaseLgGuildInfosChannels


export enum BaseLgGuildChatChannels {

    GENERAL_CHAT_CHANNEL = "💬-general",

}

export async function createCategories(guild: app.Guild): Promise<string[]> {

    const categoriesAcc: string[] = []

    Object.values(BaseLgGuildCategories).forEach(async (value) => {
        await guild.channels.create({
            name: value,
            type: app.ChannelType.GuildCategory
        })
            .then((category) => {
                app.createLogger.success(`Succesfully created "${category.name}" in "${guild.name}" (${guild.id})`)

                return categoriesAcc.push(category.id)
            })
            .catch((err) => {
                app.createLogger.error(`Failed to create channel in "${guild.name}" (${guild.id})`)
                return console.error(err)
            })
    })

    return categoriesAcc

}

export async function fetchGuild(message: app.Message<true>) {

    const guild = message.guild
    await guild.channels.fetch()
        .then((channels) => {

            app.fetchLogger.success(`Successfully fetched channels in "${guild.name}" (${guild.id})`)

            channels.each(async (channel) => {
                await channel?.delete()
                    .then((channel) => {
                        app.deleteLogger.success(`Succesfully deleted "${channel.name}" in "${guild.name}" (${guild.id})`)
                    })
                    .catch((err) => {
                        app.deleteLogger.error(`Failed to delete channel in "${guild.name}" (${guild.id})`)
                        return console.error(err)
                    })
            })
        })
        .catch((err) => {
            app.fetchLogger.error(`Failed to fetch channels in "${guild.name}" (${guild.id})`)
            return console.error(err)
        })

    const categoriesId = await createCategories(guild)

    const infosChannels = Object.values(BaseLgGuildInfosChannels).forEach(async (value) => {
        await guild.channels.create({
            name: value,
            type: app.ChannelType.GuildText
        })
            .then(async (channel) => {

                await channel.setParent(categoriesId[0])

                app.createLogger.success(`Succesfully created "${channel.name}" in "${guild.name}" (${guild.id})`)
            })
            .catch((err) => {
                app.createLogger.error(`Failed to create channel in "${guild.name}" (${guild.id})`)
                return console.error(err)
            })
    })

    const chatChannels = Object.values(BaseLgGuildChatChannels).forEach(async (value) => {
        await guild.channels.create({
            name: value,
            type: app.ChannelType.GuildText
        })
            .then(async (channel) => {

                await channel.setParent(categoriesId[1])

                app.createLogger.success(`Succesfully created "${channel.name}" in "${guild.name}" (${guild.id})`)
            })
            .catch((err) => {
                app.createLogger.error(`Failed to create channel in "${guild.name}" (${guild.id})`)
                return console.error(err)
            })
    })

}