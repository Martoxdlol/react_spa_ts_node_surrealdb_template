import * as config from './config'
export * from './config'

const proxyPort = process.env.PORT || 3300

const appUrl = config.serverScheme + '://' + config.serverHost + ':' + proxyPort

export {
    proxyPort,
    appUrl,
}