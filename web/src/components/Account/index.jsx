/*
 * Copyright (c) 2018-2021 aetheryx & Cynthia K. Rey
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { memo, useContext, useCallback } from 'react'
import Helmet from 'react-helmet'

import { Endpoints } from '@constants'
import UserContext from '@components/UserContext'
import Container from '@components/Container'
import Cutie from './Cutie'

import style from '@styles/account.scss'

function Account () {
  const user = useContext(UserContext)
  const yeetAccount = useCallback(() => {
    if (confirm('Are you sure? This action is irreversible.')) {
      location.pathname = Endpoints.YEET_ACCOUNT
    }
  }, [])

  return (
    <Container>
      <Helmet>
        <title>My Account</title>
      </Helmet>
      <h1>Welcome back, {user.username}#{user.discriminator}</h1>
      {!!user.patronTier && <Cutie tier={user.patronTier}/>}
      <h3>Linked Spotify account</h3>
      {typeof user.accounts?.spotify === 'string'
        ? <p>{user.accounts.spotify} - <a href={Endpoints.UNLINK_SPOTIFY}>Unlink</a></p>
        : <p>No account linked. <a href={Endpoints.LINK_SPOTIFY}>Link it now!</a></p>}
      <p>
        Linking your Spotify account gives you an enhanced experience with the Spotify plugin. It'll let you add songs
        to your Liked Songs, add songs to playlists, see private playlists and more.
      </p>
      <h3>Delete my Powercord account</h3>
      <p>
        You can choose to permanently delete your Powercord account. This action is irreversible and will be in effect
        immediately. We'll drop any data we have about you, and you'll no longer be able to benefit from features
        requiring a Powercord account (such as enhanced Spotify plugin, settings sync, and more).
      </p>
      <p>
        <a role='button' href='#' className={style.danger} onClick={yeetAccount}>Delete my account</a>
      </p>
    </Container>
  )
}

Account.displayName = 'Account'
export default memo(Account)
