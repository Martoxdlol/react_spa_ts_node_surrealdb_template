import * as React from 'react'
import { HistoryProRouter, Route, Routes } from "react-router-history-pro"
import { fetchApiGET } from './api/api'
import { USER_INFO_ENDPOINT } from 'shared/api'
import { UserInfo } from 'shared/util'
import { historyPro } from './history'
import routes from './routes'


export default function() {
    return (
        <div className="App">
            <HistoryProRouter history={historyPro}>
                <Routes>
                    {Object.keys(routes).map(key => {
                        return <Route key={key} path={key} element={routes[key]} />
                    })}
                </Routes>
            </HistoryProRouter>
        </div>
    )

}