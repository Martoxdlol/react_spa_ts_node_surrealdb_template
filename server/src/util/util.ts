import moment from 'moment'
import express from 'express'
import ExpressSession from 'express-session'
import { AppError } from 'shared/errors/errors.js'
import { TokenSet } from 'openid-client';
export * from 'shared/util.js'
import { UserInfo } from 'shared/util.js';

export function formatDate(date: Date) {
    return moment(date).format('YYYY/MM/DD hh/mm/ss Z')
}

export interface SessionData extends ExpressSession.SessionData {
    userInfo?: UserInfo
    tokenSet?: TokenSet
    lastUpdateFromServer?: Date
    [key: string]: any
}

export function useSession(req: express.Request): SessionData {
    return req.session as SessionData
}

export function useUserInfo(req: express.Request): UserInfo | undefined {
    const session = useSession(req)
    return session.userInfo
}

type RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => void | Promise<void>

/// Catch error when handling request
export function useRequestResolver(handler: RequestHandler, errorHandler?: RequestHandler): RequestHandler {
    return async (req, res, next) => {
        try {
            await handler(req, res, next)
        } catch (e) {
            if (e instanceof AppError) {
                if (e.isInternal) e.logFromRequest(req)
            } else {
                console.error(AppError.unknownError)
                AppError.logFromRequest(req, e as Error)
            }

            if (errorHandler) {
                errorHandler(req, res, next)
            } else {
                const status = (e instanceof AppError) ? e.status : 500
                const code = (e instanceof AppError) ? e.code : AppError.internalErrorCode
                const message = (e instanceof Error) ? e.message : (e || '') + ''
                
                res.status(status).json({
                    error: code,
                    status,
                    message,
                })
            }
        }
    }
}