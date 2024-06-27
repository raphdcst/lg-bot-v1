import * as app from "#app"

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

export type BaseLgGuildChatChannel = keyof typeof BaseLgGuildChatChannels


export enum BaseLgGuildVoiceChannels {

    BASE_VOICE_CHAT = "BASE_VOICE"

}

export type BaseLgGuildVoiceChannel = keyof typeof BaseLgGuildVoiceChannels

export enum BaseLgGuildCommandsChannels {

    BASE_COMMANDS_CHAT = "BASE_COMMANDS"

}

export type BaseLgGuildCommandsChannel = keyof typeof BaseLgGuildCommandsChannels


export enum BaseLgGuildHelpChannels {

    BASE_HELP_CHAT = "BASE_HELP"

}

export type BaseLgGuildHelpChannel = keyof typeof BaseLgGuildHelpChannels



export enum BaseLgGuildCategories {

    INFOS_CATEGORY = "INFORMATIONS",
    CHAT_CATEGORY = "TEXT CHAT",
    VOICE_CATEGORY = "VOICE CHAT",
    COMMANDS_CATEGORY = "COMMANDS CHAT",
    HELP_CATEGORY = "HELP CHAT",

}

export type BaseLgGuildCategory = keyof typeof BaseLgGuildCategories




export async function fetchAndDeleteGuild(guild: app.Guild) {
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
}

export async function createCategories(guild: app.Guild): Promise<app.CategoryChannel[]> {

    const categoriesAcc: app.CategoryChannel[] = []

    Object.values(BaseLgGuildCategories).forEach(async (value) => {
        await guild.channels.create({
            name: value,
            type: app.ChannelType.GuildCategory
        })
            .then((category) => {
                app.createLogger.success(`Succesfully created "${category.name}" in "${guild.name}" (${guild.id})`)

                return categoriesAcc.push(category)
            })
            .catch((err) => {
                app.createLogger.error(`Failed to create channel in "${guild.name}" (${guild.id})`)
                return console.error(err)
            })
    })

    return categoriesAcc

}

export async function createChannels(guild: app.Guild, categories: app.CategoryChannel[]) {

    const channels = [BaseLgGuildInfosChannels, BaseLgGuildChatChannels, BaseLgGuildVoiceChannels, BaseLgGuildCommandsChannels, BaseLgGuildHelpChannels]

    Object.values(channels).forEach(async (v, index) => {

        Object.values(v).forEach(async (value) => {
            await guild.channels.create({
                name: value,
                type: app.ChannelType.GuildText
            })
                .then(async (channel) => {
    
                    await channel.setParent(categories[index].id)
    
                    app.createLogger.success(`Succesfully created "${channel.name}" in "${guild.name}" (${guild.id})`)
                })
                .catch((err) => {
                    app.createLogger.error(`Failed to create channel in "${guild.name}" (${guild.id})`)
                    return console.error(err)
                })
        })

    })
    
}

export async function configServ(message: app.Message<true>) {

    const guild = message.guild

    await fetchAndDeleteGuild(guild)

    const categories = await createCategories(guild)

    await createChannels(guild, categories)
    

}