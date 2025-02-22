// next-logger.config.js
const pino = require('pino')

const logger = defaultConfig =>
    pino({
        ...defaultConfig,
        transport: {
            target: process.env.NODE_ENV === 'production' ? 'pino' : 'pino-pretty',
            options: {
                colorize: true,
            },
        },
        messageKey: 'message',
        mixin: () => ({ name: 'ttap-app' }),
    })

module.exports = {
    logger,
}