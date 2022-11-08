import internal from "stream";
import { errorStrings } from "./error_strings";
import { Request } from 'express'

export class AppError extends Error {
    isInternal: boolean
    name: string
    status: number

    static internalErrorCode = 'internal_error'
    static unknownError = 'unknown_error'

    public get code(): string {
        return this.isInternal ? AppError.internalErrorCode : this.name
    }

    constructor(name: string, options?: { isInternal?: boolean, status?: number }) {
        super(errorStrings.get(name))
        this.name = name
        this.status = options?.status || 400

        let isInternal = !!options?.isInternal

        if (options?.isInternal == undefined && name == AppError.internalErrorCode) {
            isInternal = true
        }

        this.isInternal = isInternal
        if (isInternal) {
            this.status = options?.status || 500
        }
    }

    logFromRequest(req: Request) {
        AppError.logFromRequest(req, this)
    }

    static logFromRequest(req: Request, error: Error) {
        console.error("Error accesing with method", req.method, "at", req.url)
        console.error("Session info", JSON.stringify((req as any).session))
        console.error("Body content", JSON.stringify(req.body))
        console.error(error)
    }
}

export class AuthError extends AppError {
    constructor() {
        super('auth_error', { isInternal: false, status: 401 })
    }
}

export class PermissionError extends AppError {
    constructor() {
        super('permission_error', { isInternal: false, status: 403 })
    }
}

// Client side mostly
export class NetworkError extends AppError {
    constructor() {
        super('network_error', { isInternal: false, status: 0 })
    }
}

export class UnknownError extends AppError {
    constructor() {
        super('unknown_error', { isInternal: false, status: 0 })
    }
}