import * as app from "#app"

export enum EmbedColors {
    SUCCESS = 0x14b714,
    INFO = 0x081a49,
    WARN = 0xf74100,
    ERROR = 0xc60800
  }
  
  
  export type EmbedColor = keyof typeof EmbedColors
  
  
  export async function sendSmallEmbed(description: string, bot?: app.ClientUser, c?: EmbedColor): Promise<object> {
  
    const smallEmbed = {
      color: c || EmbedColors.INFO,
      description: description,
      footer: {
        text: bot?.username || '',
        icon_url: bot?.avatarURL() || undefined
      }
    }
  
    return smallEmbed
  }
  
  export async function sendErrorEmbed(err: Error, bot?: app.ClientUser,): Promise<object> {
  
    const cancelEmbed = {
      color: EmbedColors.ERROR,
      title: 'Something went wrong, cancelling !',
      description: 'Error description below',
      fields: [
        {
          name: 'Name',
          value: err.name
        },
        {
          name: 'Message',
          value: err.message
        },
      ],
      footer: {
        text: bot?.username || '',
        icon_url: bot?.avatarURL() || undefined
      },
    }
  
    return cancelEmbed
  }