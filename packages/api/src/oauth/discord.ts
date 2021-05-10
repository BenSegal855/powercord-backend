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

import type { DiscordUser } from '../types.js'
import OAuth from './oauth.js'
import { fetchCurrentUser } from '../utils/discord.js'
import config from '../config.js'

class Discord extends OAuth<DiscordUser> {
  constructor () {
    super(
      config.discord.clientID,
      config.discord.clientSecret,
      'https://discord.com/oauth2/authorize',
      'https://discord.com/api/v6/oauth2/token'
    )
  }

  // eslint-disable-next-line class-methods-use-this
  get scopes () {
    return [ 'identify' ]
  }

  // eslint-disable-next-line class-methods-use-this
  async getCurrentUser (token: string) {
    return fetchCurrentUser(token)
  }
}

export default new Discord()
