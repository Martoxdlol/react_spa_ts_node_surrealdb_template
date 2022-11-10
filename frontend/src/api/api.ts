import * as config from '../../client_config'
import { AppError, NetworkError } from 'shared/errors/errors'

export async function fetchApi<T>(endpoint: string, method: string = 'get', query?: { [key: string]: any }, body?: any) {
    try {
        const url = new URL(endpoint, config.appUrl)
        for (const key in query) {
            url.searchParams.set(key, query[key])
        }
        const response = await fetch(url, { method: method, body: JSON.stringify(body) })
        const data = await response.json()

        if (!response.ok) {
            throw new AppError(data.error || AppError.unknownError, { status: response.status })
        }

        return data as T
    } catch (error) {
        console.log(error)
        if (error instanceof AppError) {
            throw error
        } else {
            throw new NetworkError()
        }
    }
}

export async function fetchApiGET<T>(endpoint: string, query?: any, body?: any) {
    return fetchApi<T>(endpoint, 'GET', query, undefined)
}

export async function fetchApiPOST<T>(endpoint: string, query?: any, body?: any) {
    return fetchApi<T>(endpoint, 'POST', query, body)
}