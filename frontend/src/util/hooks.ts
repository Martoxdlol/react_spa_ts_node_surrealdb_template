import { useEffect, useRef, useState } from "react";
import { AppError, UnknownError } from "shared/errors/errors";

export function useDidMounted(callback: Function): void {
    const resultRef = useRef(null as any)
    const didMounted = useRef(false)

    useEffect(() => {
        didMounted.current = true


        if (didMounted.current) {
            callAsync(callback).then(r => {
                if (r && typeof r === 'function') {
                    resultRef.current = r
                }
            })
        }

        return () => {
            if (didMounted.current) {
                typeof resultRef.current === 'function' && resultRef.current()
            }
        }
    }, [])
}

interface FetchState<T> {
    data: T | null
    completed: boolean
    loading: boolean
    error: AppError | null
    retry: (options: RetryParams) => void
}

interface RetryParams {
    ignoreErrorResult: boolean
}

export function useFetchCycle<T>(handler: () => Promise<any> | any): FetchState<T> {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<AppError | null>(null)


    function call(ignoreErrorResult = false) {
        callAsync(handler).then(r => {
            setData(r)
            setLoading(false)
        }).catch(err => {
            setLoading(false)
            if(ignoreErrorResult) return
            if (err instanceof AppError) {
                setError(err)
            } else {
                setError(new UnknownError())
            }
        })
    }

    useDidMounted(() => {
        call()
    })

    function retry({ ignoreErrorResult }: RetryParams = { ignoreErrorResult: false }) {
        call()
    }

    return { data, loading, error, completed: !loading && !error, retry }
}

async function callAsync(f: any) {
    return await f()
}