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

import { memo, useContext } from 'react'
import { Redirect } from 'react-router'

import { Routes, Endpoints } from '@constants'
import Container from './Container'
import UserContext from './UserContext'

function AuthBoundary ({ children, staff }) {
  const user = useContext(UserContext)

  if (!user) {
    return (
      <Container>
        <h1>You must be authenticated to see this</h1>
        <a href={Endpoints.LOGIN}>Login</a>
      </Container>
    )
  }

  if (staff && !user?.badges?.staff) {
    return (
      <Redirect to='/'/>
    )
  }

  if (staff && !user.badges.staff) {
    return (
      <Container>
        <h1>Go away. Right now.</h1>
        <a href={Routes.HOME}>go away</a>
      </Container>
    )
  }

  return children
}

AuthBoundary.displayName = 'AuthBoundary'
export default memo(AuthBoundary)
