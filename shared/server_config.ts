import dotenv from 'dotenv'
import * as config from './config'
import { isProduction, isDevelopment, serverScheme } from './config'
export * from './config'

dotenv.config({
    path: '../.env'
})

const serverPort = process.env.PORT || 3300
const devAppUrl = process.env.DEV_APP_URL || 'http://localhost:1234'
const surrealDbUri = process.env.SURREAL_DB_URI || 'http://127.0.0.1:8000/rpc'
const surrealDbUser = process.env.SURREAL_DB_USER || 'root'
const surrealDbPass = process.env.SURREAL_DB_PASS || 'root'
const surrealDbNamespace = process.env.SURREAL_DB_NAMESPACE || ('app_db_' + (isProduction ? 'production' : 'development'))
const surrealDbDatabase = process.env.SURREAL_DB_DATABASE || 'app_db'
const openidIssuerUrl = process.env.OPENID_ISSUER as string
const clientId = process.env.OPENID_CLIENT_ID as string
const clientSecret = process.env.OPENID_CLIENT_SECRET as string
const openidScopes = (process.env.OPENID_SCOPES || '').split(/[\,\ ]/gi).map<string>(scope => scope.trim())
const mainAppPath = process.env.MAIN_PATH || '/'
const refreshUserInfoFromProviderTime = (parseInt(process.env.REFRESH_USERINFO_MAX_TIME || 'NaN') || (60 * 60 * 5)) * 1000

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