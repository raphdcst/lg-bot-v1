import type { Config } from "#app"
import { Options } from "discord.js"
import env from "#env"

const config: Config = {
  logger: {},
  ignoreBots: true,
  getPrefix() {
    return env.BOT_PREFIX!
  },
  client: {
    intents: [
      "Guilds",
      "GuildMembers",
      "GuildModeration",
      "GuildEmojisAndStickers",
      "GuildIntegrations",
      "GuildWebhooks",
      "GuildInvites",
      "GuildVoiceStates",
      "GuildPresences",
      "GuildMessages",
      "GuildMessageReactions",
      "GuildMessageTyping",
      "DirectMessages",
      "DirectMessageReactions",
      "DirectMessageTyping",
      "MessageContent",
    ],
    makeCache: Options.cacheWithLimits({
      ...Options.DefaultMakeCacheSettings,

      // don't cache reactions
      ReactionManager: 0,
    }),
    sweepers: {
      ...Options.DefaultSweeperSettings,
      messages: {
        // every day
        interval: 1000 * 60 * 60 * 24,

        // 3 days
        lifetime: 1000 * 60 * 60 * 24 * 3,
      },
    },
  },
}

export default config
