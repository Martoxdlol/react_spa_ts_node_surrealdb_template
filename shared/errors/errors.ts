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
    public static CODE = 'auth_error'
    constructor() {
        super(AuthError.CODE, { isInternal: false, status: 401 })
    }
}

export class PermissionError extends AppError {
    public static CODE = 'permission_error'
    constructor() {
        super(PermissionError.CODE, { isInternal: false, status: 403 })
    }
}

// Client side mostly
export class NetworkError extends AppError {
    public static CODE = 'network_error'
    constructor() {
        super(NetworkError.CODE, { isInternal: false, status: 0 })
    }
}

export class UnknownError extends AppError {
    public static CODE = 'unknown_error'
    constructor() {
        super(UnknownError.CODE, { isInternal: false, status: 0 })
    }
}