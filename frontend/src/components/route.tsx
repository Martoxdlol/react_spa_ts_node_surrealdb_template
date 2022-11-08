import * as React from 'react'

export interface RouteOptions {
    children: any
}

export default function Route({ children }: RouteOptions) {
    return <div>
        {children}
    </div>
}