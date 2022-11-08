import express from 'express'
import cors from 'cors'
import * as config from 'shared/server_config'
import { configure as configureDatabase } from './src/database/database'
import { formatDate } from './src/util/util'
import { sessionMiddleware } from './src/auth/session'
import { authMiddleware } from './src/auth/auth'
import { createProxyMiddleware } from 'http-proxy-middleware'
import path from 'path'
import { type } from 'os'

const app = express()

// Development only, reverse proxy for accessing frontend and backend on the same url
const appProxy = createProxyMiddleware({ target: config.devAppUrl, changeOrigin: true, ws: true })
// Needed to use websockets
app.on('upgrade', appProxy.upgrade as any); 

async function main() {
    // Initialize database
    await configureDatabase()

    app.use(cors())
    app.use(sessionMiddleware)
    app.use(authMiddleware)

    if (config.isDevelopment) {
        // If is dev, use proxy
        app.use(appProxy)
    } else {
        // Otherwise serve static files for build fontend
        app.use(config.mainAppPath, express.static(path.resolve('../frontend/build')))
    }

    app.listen(config.serverPort, listenCallback)
}

function listenCallback() {
    console.log(formatDate(new Date()))
    console.log(`Listening on port ${config.serverPort}`)
    console.log(`Server url: ${config.serverUrl}`)
}

main()
