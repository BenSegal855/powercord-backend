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

import { Message, GuildTextableChannel } from 'eris'
import { enterRaidMode, getRaidStatus } from '../../raidMode.js'
import { isStaff, parseDuration } from '../../util.js'
import config from '../../config.js'

const USAGE_STR = `Usage: ${config.discord.prefix}raid <duration>`

export function executor (msg: Message<GuildTextableChannel>, [ rawDuration ]: [ string ]): void {
  if (!msg.member) return // ???
  if (!isStaff(msg.member)) {
    msg.channel.createMessage('no')
    return
  }

  if (getRaidStatus()) {
    msg.channel.createMessage('Raid mode is currently active.')
    return
  }

  if (!rawDuration) {
    msg.channel.createMessage(USAGE_STR)
    return
  }

  const duration = parseDuration(rawDuration)
  if (!duration) {
    msg.channel.createMessage('Invalid duration')
    return
  }

  enterRaidMode(msg.channel.guild, msg.author, duration)
  msg.channel.createMessage('Raid mode activated.')
}
