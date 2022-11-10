import * as React from 'react'
import Landing from "./routes/landing"

export interface Routes {
    [key: string]: any
}

const routes: Routes = {
    '/': <Landing />
}


export default routes