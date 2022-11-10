import * as React from 'react'
import { USER_INFO_ENDPOINT } from 'shared/api'
import { AppError, AuthError } from 'shared/errors/errors'
import { AppStrings } from 'shared/internationalization'
import { UserInfo } from 'shared/util'
import { fetchApiGET } from '../api/api'
import Container from '../components/container'
import Route from '../components/route'
import { useFetchCycle } from '../util/hooks'
import { appStrings } from 'shared/strings/app_strings'

export default function () {

    const userInfoRequest = useFetchCycle<UserInfo>(async () => {
        try {
            return await fetchApiGET(USER_INFO_ENDPOINT)
        } catch (error) {
            if (error instanceof AppError && error.code == AuthError.CODE) {
                return null
            } else {
                throw error
            }
        }
    })

    return <Route>
        <Container>
            <h1>Landing</h1>
            {userInfoRequest.loading && <p>Loading user information...</p>}
            {userInfoRequest.completed && <>
                {userInfoRequest.data && <>
                    <p>{userInfoRequest.data.name}</p>
                    <p><a href='/signout'>{appStrings.get('signout')}</a></p>
                </>}
                {userInfoRequest.data == null && <p><a href='/login'>Login</a></p>}
            </>}
            {userInfoRequest.error && <p style={{ color: 'red' }}>
                {userInfoRequest.error.message}
            </p>}
        </Container>
    </Route>
}
