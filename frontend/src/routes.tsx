import Home from "./routes/home"
import * as React from 'react'

export interface Routes {
    [key: string]: any
}

const routes: Routes = {
    '/': <Home />
}


export default routes