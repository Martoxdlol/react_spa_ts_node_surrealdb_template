const stringsLanguage = process.env.LANGUAGE || 'es'
const serverHost = process.env.APP_URL || 'localhost'
const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = !isDevelopment

const serverScheme = process.env.SERVER_SCHEME || isDevelopment ? 'http' : 'https'

export {
    isDevelopment,
    isProduction,
    stringsLanguage,
    serverHost,
    serverScheme,
}