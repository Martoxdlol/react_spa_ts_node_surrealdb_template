let env: { [key: string]: string } = {}

if (typeof process === 'undefined') {
    env = (import.meta as any).env
} else {
    env = process.env as any
}


const stringsLanguage = env.LANGUAGE || 'es'
const serverHost = env.APP_URL || 'localhost'
const isDevelopment = env.MODE === 'development'
const isProduction = !isDevelopment

const serverScheme = env.SERVER_SCHEME || isDevelopment ? 'http' : 'https'

export {
    isDevelopment,
    isProduction,
    stringsLanguage,
    serverHost,
    serverScheme,
    env,
}