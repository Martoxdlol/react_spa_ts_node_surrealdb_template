import * as React from 'react'
import { USER_INFO_ENDPOINT } from 'shared/api'
import { UserInfo } from 'shared/util'
import { fetchApiGET } from '../../api/api'
import Route from '../components/route'

export default function () {
    return <Route>
        <button onClick={() => {
            fetchApiGET<UserInfo>(USER_INFO_ENDPOINT).then(userinfo => {
                alert(userinfo.name)
            }).catch(error => {
                alert(error.message)
            })

        }}>Userinfo</button>
        <p><a href='/login'>Login</a></p>
        <p><a href='/signout'>Log out</a></p>
    </Route>
}