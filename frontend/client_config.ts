type Env = { [key: string]: string }

const env = (import.meta as any).env as Env

const isDevelopment = env.MODE === 'development'
const isProduction = !isDevelopment

const appUrl = new URL(env.BASE_URL, window.location.href)

export {
    isDevelopment,
    isProduction,
    appUrl,
}