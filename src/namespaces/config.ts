import * as app from "#app"


export enum BaseLgGuildInfosChannels {

    WELCOME_CHANNEL = "👋-welcome",
    //RULES_CHANNEL = "📜-rules",
    //ANNOUNCEMENT_CHANNEL = "📢-announcement",
    PRESENTATION_CHANNEL = "🖋-presentation",
    ROLES_CHANNEL = "👤-roles",

}

export type BaseLgGuildInfosChannel = keyof typeof BaseLgGuildInfosChannels


export enum BaseLgGuildChatChannels {

    GENERAL_CHAT_CHANNEL = "💬-general",

}

export type BaseLgGuildChatChannel = keyof typeof BaseLgGuildChatChannels


export enum BaseLgGuildVoiceChannels {

    ENGLISH_CHAT_CHANNEL = "🇬🇧-eng-chat",
    FRENCH_CHAT_CHANNEL = "🇫🇷-fr-chat"

}

export type BaseLgGuildVoiceChannel = keyof typeof BaseLgGuildVoiceChannels

export enum BaseLgGuildCommandsChannels {

    COMMANDS_CHAT_CHANNEL = "🤖-commands"

}

export type BaseLgGuildCommandsChannel = keyof typeof BaseLgGuildCommandsChannels


export enum BaseLgGuildHelpChannels {

    HELP_CHAT_CHANNEL = "💬-help",
    //FAQ_FORUM_CHANNEL = "🆘-faq",
    TICKET_CHAT_CHANNEL = "🎫-ticket",

}

export type BaseLgGuildHelpChannel = keyof typeof BaseLgGuildHelpChannels



export enum BaseLgGuildCategories {

    INFOS_CATEGORY = "INFORMATIONS",
    CHAT_CATEGORY = "TEXT CHAT",
    COMMANDS_CATEGORY = "COMMANDS CHAT",
    HELP_CATEGORY = "HELP CHAT",
    VOICE_CATEGORY = "VOICE CHAT",

}

export type BaseLgGuildCategory = keyof typeof BaseLgGuildCategories


export interface BaseChannelProps {
    NAME: string
    TYPE: app.ChannelType.GuildText | app.ChannelType.GuildVoice | app.ChannelType.GuildCategory | app.ChannelType.GuildAnnouncement | app.ChannelType.GuildStageVoice | app.ChannelType.GuildForum | app.ChannelType.GuildMedia
    CATEGORY: string
}

export const FAQ_FORUM: BaseChannelProps = {

    NAME: "🆘-faq",
    TYPE: app.ChannelType.GuildForum,
    CATEGORY: BaseLgGuildCategories.HELP_CATEGORY

}

export const ANNOUNCEMENT_CHANNEL: BaseChannelProps = {

        NAME: "📢-announcement",
        TYPE: app.ChannelType.GuildAnnouncement,
        CATEGORY: BaseLgGuildCategories.INFOS_CATEGORY

}


export async function fetchAndDeleteGuild(guild: app.Guild) {
    await guild.channels.fetch()
        .then((channels) => {

            app.fetchLogger.success(`Fetched channels in "${guild.name}" (${guild.id})`)

            channels.each(async (channel) => {
                await channel?.delete()
                    .then((channel) => {
                        app.deleteLogger.success(`Deleted "${channel.name}" in "${guild.name}" (${guild.id})`)
                    })
                    .catch((e) => {

                        const err = e as app.DiscordAPIError

                        if (err.code === 50074) {

                            return app.deleteLogger.log(`${err.name} : ${err.message} in "${guild.name}" (${guild.id})`)

                        }

                        app.deleteLogger.error(`Failed to delete channel in "${guild.name}" (${guild.id})`)
                        return console.error(err)
                    })
            })
        })
        .catch((e) => {

            const err = e as app.DiscordAPIError

            app.fetchLogger.error(`Failed to fetch channels in "${guild.name}" (${guild.id})`)
            return console.error(err)
        })
}

export async function createCategories(guild: app.Guild): Promise<app.CategoryChannel[]> {

    const categoriesAcc: app.CategoryChannel[] = []

    Object.entries(BaseLgGuildCategories).forEach(async ([key, value]) => {
        await guild.channels.create({
            name: value,
            type: app.ChannelType.GuildCategory
        })
            .then((category) => {
                app.createLogger.success(`Created ${key} named "${category.name}" in "${guild.name}" (${guild.id})`)

                return categoriesAcc.push(category)
            })
            .catch((err) => {
                app.createLogger.error(`Failed to create ${key} in "${guild.name}" (${guild.id})`)
                return console.error(err)
            })
    })

    return categoriesAcc

}

export async function createChannels(guild: app.Guild, categories: app.CategoryChannel[]) {

    const textChannels = [BaseLgGuildInfosChannels, BaseLgGuildChatChannels, BaseLgGuildCommandsChannels, BaseLgGuildHelpChannels]

    const voiceChannels = BaseLgGuildVoiceChannels

    const customChannels = [FAQ_FORUM, ANNOUNCEMENT_CHANNEL]

    Object.values(textChannels).forEach(async (v, index) => {

        Object.entries(v).forEach(async ([key, value]) => {
            
            await guild.channels.create({
                name: value,
                type: app.ChannelType.GuildText
            })
                .then(async (channel) => {

                    await channel.setParent(categories[index].id)

                    app.createLogger.success(`Created ${key} named "${channel.name}" in "${guild.name}" (${guild.id})`)
                })
                .catch((err) => {
                    app.createLogger.error(`Failed to create ${key} in "${guild.name}" (${guild.id})`)
                    return console.error(err)
                })
        })

    })

    Object.entries(voiceChannels).forEach(async ([key, value]) => {
        await guild.channels.create({
            name: value,
            type: app.ChannelType.GuildVoice
        })
            .then(async (channel) => {

                await channel.setParent(categories[4].id)

                app.createLogger.success(`Created ${key} named "${channel.name}" in "${guild.name}" (${guild.id})`)
            })
            .catch((err) => {
                app.createLogger.error(`Failed to create ${key} in "${guild.name}" (${guild.id})`)
                return console.error(err)
            })
    })

    Object.values(customChannels).forEach(async (value) => {
        await guild.channels.create({
            name: value.NAME,
            type: value.TYPE
        })
            .then(async (channel) => {

                
                const catId = Object.values(categories).filter((category) => category.name === value.CATEGORY)

                await channel.setParent(catId[0].id)

                app.createLogger.success(`Created CUSTOM_CHANNEL named "${channel.name}" in "${guild.name}" (${guild.id})`)
            })
            .catch((err) => {
                app.createLogger.error(`Failed to create CUSTOM_CHANNEL in "${guild.name}" (${guild.id})`)
                return console.error(err)
            })
    })

}

export async function configServ(message: app.Message<true>) {

    const guild = message.guild

    await fetchAndDeleteGuild(guild)

    const categories = await createCategories(guild)

    await createChannels(guild, categories)


}