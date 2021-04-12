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

import { createHash } from 'crypto'
import { CommandClient, GuildTextableChannel, Message } from 'eris'
import config from '../config.js'
import { ban, softBan } from '../mod.js'

// Any new members who send more than THRESHOLD messages with the same content, will be kicked
const THRESHOLD = 2
const raiderBuffer = new Map<string, number>()
const DAY_MS = 24 * 36e5

async function process(this: CommandClient, msg: Message<GuildTextableChannel>) {
  if (msg.guildID !== config.discord.ids.serverId || !msg.member
      || msg.member.joinedAt < Date.now() - DAY_MS
      || msg.member.createdAt > Date.now() - 5 * DAY_MS) return

  if (isRaider(msg.author.id, msg.content)) {
    if (await this.mongo.collection('raiders').countDocuments({ userId: msg.author.id }) > 0) {
      ban(msg.channel.guild, msg.author.id, this.user, 'Repeat raider', 0, 1)
    } else {
      softBan(msg.channel.guild, msg.author.id, this.user, 'Detected raid spam', 1)
      this.mongo.collection('raiders').insertOne({ userId: msg.author.id })
    }
  }
}

function isRaider(user: string, message: string): boolean {
  const raiderHash = createHash('sha1').update(`${user}${message}`).digest('base64').toString()
  let count = raiderBuffer.get(raiderHash) ?? 0

  if (count >= THRESHOLD) return true

  count++
  raiderBuffer.set(raiderHash, count)
  setTimeout(() => removeRaider(raiderHash), 10e3)
  return false
}

function removeRaider(hash: string) {
  let count = raiderBuffer.get(hash)

  if (count === undefined) return

  count--

  if (count === 0) {
    raiderBuffer.delete(hash)
  } else {
    raiderBuffer.set(hash, count)
  }
}

export default function (bot: CommandClient) {
  bot.on('messageCreate', process)
}