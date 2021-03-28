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

import fastifyFactory from 'fastify'
import fastifyAuth from 'fastify-auth'
import fastifyCookie from 'fastify-cookie'
import fastifyRawBody from 'fastify-raw-body'
import fastifyMongodb from 'fastify-mongodb'
import fastifyTokenize from 'fastify-tokenize'

import apiModule from './api/index.js'
import webModule from './web.js'
import config from './config.js'

const fastify = fastifyFactory({ logger: { level: process.env.NODE_ENV === 'production' ? 'warn' : 'info' } })
fastify.register(fastifyAuth)
fastify.register(fastifyCookie)
fastify.register(fastifyRawBody, { global: false })
fastify.register(fastifyMongodb, { url: config.mango })
fastify.register(fastifyTokenize, {
  secret: config.secret,
  fastifyAuth: true,
  cookieSigned: true,
  fetchAccount: async (id: string) => {
    const user = await fastify.mongo.db!.collection('users').findOne({ _id: id })
    if (user) user.lastTokenReset = 0
    return user
  }
})

fastify.register(apiModule, { prefix: '/api' })
fastify.register(webModule)

fastify.ready()
  .then(
    () => fastify.listen(config.port, config.bind),
    (e) => {
      fastify.log.error(e)
      process.exit(1)
    }
  )
