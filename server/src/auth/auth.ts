import { Request, Response, NextFunction } from 'express'
import { db } from '../database/database'
import { Client, Issuer, generators, TokenSet } from 'openid-client';
import { clientId, clientSecret, devAppUrl, openidIssuerUrl, openidScopes, serverUrl } from 'shared/server_config';
import { Router } from 'express'
import { useRequestResolver, useSession, UserInfo } from '../util/util';
import { AppError, AuthError } from 'shared/errors/errors';
import { LOGIN_CALLBACK_ENDPOINT, LOGIN_ENDPOINT, SIGNOUT_ENDPOINT, USER_INFO_ENDPOINT} from 'shared/api'

let issuer: Issuer
let client: Client

/// Express auth router
const authRouter = Router()

/// Oauth callback url base on config
const callbackUrl = serverUrl + LOGIN_CALLBACK_ENDPOINT

/// Opend id related stuff
const codeVerifier = generators.codeVerifier();
const codeChallenge = generators.codeChallenge(codeVerifier);

/// Do auth related stuff
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!issuer) {
        // Configure issuer using env OPENID_ISSUER example: https://accounts.google.com => (https://accounts.google.com/.well-known/openid-configuration)
        // Don't put the .well-known/openid-configuration part, only https://accounts.google.com
        issuer = await Issuer.discover(openidIssuerUrl);
        client = new issuer.Client({
            client_id: clientId, // REQUIRED env OPENID_CLIENT_ID
            client_secret: clientSecret, // REQUIRED env OPENID_CLIENT_SECRET
            redirect_uris: [callbackUrl],
            response_type: 'code',
        })
    }
    authRouter(req, res, next)
}

/// Generate auth login url and redirect to it
authRouter.get(LOGIN_ENDPOINT, useRequestResolver((req, res) => {
    // Generate and redirect to openid auth url
    res.redirect(client.authorizationUrl({
        scope: ('openid email profile ' + openidScopes.join(' ')).trim(),
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
    }))
}))

/// Destory session and try to revoke token
authRouter.get(SIGNOUT_ENDPOINT, useRequestResolver((req, res) => {
    const session = useSession(req)
    if (session.tokenSet?.access_token) {
        client.revoke(session.tokenSet?.access_token).catch(err => {
            console.error("Cannot revoke token")
            console.error(err)
        })
        req.session.destroy(err => {
            if(err) {
                console.error("Error destorying session")
                console.error(err)
            }
            res.redirect('/')
        })
    } else {
        res.redirect('/')
    }
}))

/// Retuns user info
authRouter.get(USER_INFO_ENDPOINT, useRequestResolver(async (req, res) => {
    const session = useSession(req)
    if (!session.tokenSet) throw new AuthError()
    res.json(session.userInfo)
}))

/// Oauth callback handler
authRouter.get(LOGIN_CALLBACK_ENDPOINT, useRequestResolver(async (req, res) => {
    const params = client.callbackParams(req);
    const tokenSet = await client.callback(callbackUrl, params, { code_verifier: codeVerifier })

    // const result = tokenSet.claims()
    // const accessToken = tokenSet.access_token

    const userInfo = await fetchUserInfo(tokenSet)
    const session = useSession(req)

    // Set data to session
    session.userInfo = userInfo as UserInfo
    session.tokenSet = tokenSet as TokenSet
    session.lastUpdateFromServer = new Date()

    req.session.save(() => {
        console.log("New session saved", userInfo.email)
        console.log("Session id", session.id)

        if (session.loginRedirect) {
            res.redirect(session.loginRedirect)
        } else {
            res.redirect('/')
        }
    })
}))

export function fetchUserInfo(tokenSet: TokenSet) {
    return client.userinfo(tokenSet.access_token!)
}