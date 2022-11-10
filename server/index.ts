import express from 'express'
import cors from 'cors'
import * as config from 'shared/server_config'
import { configure as configureDatabase } from './src/database/database.js'
import { formatDate } from './src/util/util.js'
import { sessionMiddleware } from './src/auth/session.js'
import { authMiddleware } from './src/auth/auth.js'
import { createProxyMiddleware } from 'http-proxy-middleware'
import path from 'path'

const app = express()

// Development only, reverse proxy for accessing frontend and backend on the same url
const appProxy = createProxyMiddleware({ target: config.devAppUrl, changeOrigin: true, ws: true })
// Needed to use websockets
app.on('upgrade', appProxy.upgrade as any); 

async function main() {
    // Initialize database
    await configureDatabase()


    if(config.isProduction) {
        app.use(config.mainAppPath, express.static(path.resolve('../frontend/build')))
    }

    app.use(cors())
    app.use(sessionMiddleware)
    app.use(authMiddleware)

    if (config.isDevelopment) {
        // If is dev, use proxy
        app.use(appProxy)
    }

    app.listen(config.serverPort, listenCallback)
}

function listenCallback() {
    console.log(formatDate(new Date()))
    console.log(`Listening on port ${config.serverPort}`)
    console.log(`Server url: ${config.serverUrl}`)
}

main()
