import * as app from "#app"

export const interactionLogger = new app.Logger({ section: 'interaction'})
export const createLogger = new app.Logger({ section: 'create'})
export const fetchLogger = new app.Logger({ section: 'fetch'})