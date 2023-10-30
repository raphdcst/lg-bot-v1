// system file, please don't modify it

import axios from "axios"
import dayjs from "dayjs"
import chalk from "chalk"
import utc from "dayjs/plugin/utc.js"
import relative from "dayjs/plugin/relativeTime.js"
import timezone from "dayjs/plugin/timezone.js"
import toObject from "dayjs/plugin/toObject.js"
import discord from "discord.js"
import EventEmitter from "events"

import * as logger from "./logger.js"
import * as util from "./util.js"

export async function checkUpdates() {
  // fetch latest bot.ts codebase
  const remoteJSON = await axios
    .get(
      "https://raw.githubusercontent.com/bot-ts/framework/master/package.json",
    )
    .then((res) => res.data)

  const versionValue = (version: string): number => {
    const [, major, minor, patch] = /(\d+)\.(\d+)\.(\d+)/
      .exec(version)!
      .map(Number)

    return (major << 16) + (minor << 8) + patch
  }

  const isOlder = (localVersion: string, remoteVersion: string) =>
    localVersion !== remoteVersion &&
    versionValue(localVersion) <= versionValue(remoteVersion)

  if (isOlder(util.packageJSON.version, remoteJSON.version)) {
    logger.warn(
      `a new major version of ${chalk.blue(
        "bot.ts",
      )} is available: ${chalk.magenta(
        util.packageJSON.version,
      )} => ${chalk.magenta(remoteJSON.version)}`,
    )
    logger.warn(
      `you can update ${chalk.blue("bot.ts")} by running ${chalk.bgWhite.black(
        `gulp update`,
      )}`,
    )
    logger.warn(chalk.bold(`this update may break your bot!`))
  } else if (
    isOlder(
      util.packageJSON.devDependencies["@ghom/bot.ts-cli"],
      remoteJSON.devDependencies["@ghom/bot.ts-cli"],
    )
  ) {
    logger.warn(
      `a new version of ${chalk.blue("@ghom/bot.ts-cli")} is available: ${
        util.packageJSON.devDependencies["@ghom/bot.ts-cli"]
      } => ${chalk.blue(remoteJSON.devDependencies["@ghom/bot.ts-cli"])}`,
    )
    logger.warn(
      `you can update ${chalk.blue(
        "@ghom/bot.ts-cli",
      )} by running ${chalk.bgWhite.black(`gulp update`)}`,
    )
    logger.warn(chalk.bold(`this update may break your bot!`))
  } else {
    logger.log(
      `you are using the latest version of ${chalk.blue(
        "bot.ts",
      )} and ${chalk.blue("@ghom/bot.ts-cli")}`,
    )
  }
}

const locale = process.env.BOT_LOCALE

import(`dayjs/locale/${locale ?? "en"}.js`)
  .then(() => dayjs.locale(locale ?? "en"))
  .catch(() =>
    logger.warn(
      `The ${chalk.bold(
        locale,
      )} locale is incorrect, please use an existing locale code.`,
    ),
  )

dayjs.extend(utc)
dayjs.extend(relative)
dayjs.extend(timezone)
dayjs.extend(toObject)
dayjs.utc(1)

if (process.env.BOT_TIMEZONE) dayjs.tz.setDefault(process.env.BOT_TIMEZONE)

export { dayjs }

export interface EventEmitters {
  messageCreate:
    | discord.TextBasedChannel
    | discord.User
    | discord.GuildMember
    | discord.Guild
}

export const messageEmitter = new EventEmitter()
