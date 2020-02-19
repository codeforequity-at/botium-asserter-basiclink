const util = require('util')
const linkify = require('linkifyjs')
const _ = require('lodash')
const { BotiumError } = require('botium-core')
const debug = require('debug')('botium-asserter-basiclink')

module.exports = class BasicLinkAsserter {
  constructor (context, caps = {}, args = {}) {
    this.context = context
    this.caps = caps
  }

  assertConvoStep ({ convoStep, args, botMsg }) {
    const uniqueArgs = _.uniq(args || [])

    let links = (linkify.find(botMsg.messageText) || []).map(u => u.href)
    if (botMsg.buttons) {
      botMsg.buttons.forEach(b => {
        links.push(b.payload)
        links.push(b.imageUri)
      })
    }
    if (botMsg.media) {
      botMsg.media.forEach(m => {
        links.push(m.mediaUri)
      })
    }
    links = links.filter(s => s && _.isString(s))
    debug(`all found links : ${util.inspect(links)}`)

    if (!args || args.length === 0) {
      if (links.length) {
        return Promise.resolve()
      }
      return Promise.reject(new BotiumError(`${convoStep.stepTag}: Some link(s) expected`,
        {
          type: 'asserter',
          source: 'BasicLinkAsserter',
          context: {
            constructor: {},
            params: {
              args
            }
          },
          cause: {
            expected: uniqueArgs,
            actual: links
          }
        }
      ))
    }

    const notFoundLinks = uniqueArgs.reduce((acc, requiredLink) => {
      if (links.findIndex(u => u.includes(requiredLink)) < 0) {
        acc.push(requiredLink)
      }
      return acc
    }, [])

    if (notFoundLinks.length > 0) {
      return Promise.reject(new BotiumError(`${convoStep.stepTag}: Expected link(s) "${notFoundLinks}", but only found link(s) "${links}"`,
        {
          type: 'asserter',
          source: 'BasicLinkAsserter',
          context: {
            constructor: {},
            params: {
              args
            }
          },
          cause: {
            expected: uniqueArgs,
            actual: links,
            diff: notFoundLinks
          }
        }
      ))
    }
    return Promise.resolve()
  }
}
