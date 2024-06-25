import * as app from "#app"

export enum EmbedColors {
  SUCCESS = 0x14b714,
  INFO = 0x081a49,
  WARN = 0xf74100,
  ERROR = 0xc60800
}

export type smallEmbedOptions = {
  description: string
  bot?: app.ClientUser
  color?: EmbedColor
}

export type errorEmbedOptions = {
  err: Error
  bot?: app.ClientUser
  color?: EmbedColor
}


export type EmbedColor = keyof typeof EmbedColors


export function createSmallEmbed(options: smallEmbedOptions): app.APIEmbed {

  const smallEmbed = {
    color: EmbedColors[options?.color || 'INFO'],
    description: options.description,
    timeStamp: new Date().toISOString(),
    footer: {
      text: options.bot?.username || '',
      icon_url: options.bot?.avatarURL() || undefined
    }
  }

  return smallEmbed
}

export function createErrorEmbed(options: errorEmbedOptions): app.APIEmbed {

  const cancelEmbed = {
    color: EmbedColors[options?.color || 'ERROR'],
    title: 'Something went wrong, cancelling !',
    description: 'Error description below',
    timeStamp: new Date().toISOString(),
    fields: [
      {
        name: 'Name',
        value: options.err.name
      },
      {
        name: 'Message',
        value: options.err.message
      },
    ],
    footer: {
      text: options.bot?.username || '',
      icon_url: options.bot?.avatarURL() || undefined
    },
  }

  return cancelEmbed
}