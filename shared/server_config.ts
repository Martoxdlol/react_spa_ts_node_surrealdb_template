import dotenv from 'dotenv'
import * as config from './config'
import { isProduction, isDevelopment, serverScheme } from './config'
export * from './config'

const env = config.env

dotenv.config({
    path: '../.env'
})

const serverPort = env.PORT || 3000
const devAppUrl = env.DEV_APP_URL || 'http://localhost:1234'
const surrealDbUri = env.SURREAL_DB_URI || 'http://127.0.0.1:8000/rpc'
const surrealDbUser = env.SURREAL_DB_USER || 'root'
const surrealDbPass = env.SURREAL_DB_PASS || 'root'
const surrealDbNamespace = env.SURREAL_DB_NAMESPACE || ('app_db_' + (isProduction ? 'production' : 'development'))
const surrealDbDatabase = env.SURREAL_DB_DATABASE || 'app_db'
const openidIssuerUrl = env.OPENID_ISSUER as string
const clientId = env.OPENID_CLIENT_ID as string
const clientSecret = env.OPENID_CLIENT_SECRET as string
const openidScopes = (env.OPENID_SCOPES || '').split(/[\,\ ]/gi).map<string>(scope => scope.trim())
const mainAppPath = env.MAIN_PATH || '/'
const refreshUserInfoFromProviderTime = (parseInt(env.REFRESH_USERINFO_MAX_TIME || 'NaN') || (60 * 60 * 5)) * 1000

const serverUrl = serverScheme + '://' + config.serverHost + ':' + serverPort

if (!openidIssuerUrl) {
    throw Error("Open ID connect issuer [OPENID_ISSUER] must be defined as env var or in .env file")
}

if (!clientId) {
    throw Error("Open ID connect clientId [OPENID_CLIENT_ID] must be defined as env var or in .env file")
}

if (!clientSecret) {
    throw Error("Open ID connect clientSecret [OPENID_CLIENT_SECRET] must be defined as env var or in .env file")
}


export {
    isDevelopment,
    isProduction,
    serverPort,
    serverUrl,
    serverScheme,
    devAppUrl,
    surrealDbUri,
    surrealDbUser,
    surrealDbPass,
    surrealDbNamespace,
    surrealDbDatabase,
    openidIssuerUrl,
    clientId,
    clientSecret,
    openidScopes,
    mainAppPath,
    refreshUserInfoFromProviderTime,
}