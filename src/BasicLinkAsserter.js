const util = require('util')
const _ = require('lodash')
const urlRegex = require('url-regex')
const { BotiumError } = require('botium-core')
const debug = require('debug')('botium-asserter-basiclink')

module.exports = class BasicLinkAsserter {
  constructor (context, caps = {}, args = {}) {
    this.context = context
    this.caps = caps
  }

  extractLinks (botMsg) {
    let links = []
    let texts = []

    if (botMsg.media) {
      links = links.concat(botMsg.media.filter(m => m.mediaUri).map(m => m.mediaUri))
      texts = texts.concat(botMsg.media.filter(m => m.altText).map(m => m.altText))
    }
    if (botMsg.buttons) {
      links = links.concat(botMsg.buttons.filter(b => b.imageUri).map(b => b.imageUri))
      texts = texts.concat(botMsg.buttons.filter(b => b.text).map(b => b.text))
      texts = texts.concat(botMsg.buttons.filter(b => b.payload).map(b => _.isObject(b.payload) ? JSON.stringify(b.payload) : b.payload))
    }
    if (botMsg.cards) {
      botMsg.cards.forEach((card) => {
        if (card.text) texts.push(card.text)
        if (card.image && card.image.mediaUri) links.push(card.image.mediaUri)
        if (card.image && card.image.altText) texts.push(card.image.altText)
        if (card.buttons) {
          links = links.concat(card.buttons.filter(b => b.imageUri).map(b => b.imageUri))
          texts = texts.concat(card.buttons.filter(b => b.text).map(b => b.text))
          texts = texts.concat(card.buttons.filter(b => b.payload).map(b => _.isObject(b.payload) ? JSON.stringify(b.payload) : b.payload))
        }
      })
    }
    if (botMsg.messageText) texts.push(botMsg.messageText)

    const regex = urlRegex()

    texts = texts.filter(t => t && _.isString(t))
    links = links.filter(l => l && _.isString(l))

    texts.forEach((text) => {
      text = text.replace(/[[\]()']/g, ' ')
      links = links.concat((text.match(regex) || []))
    })

    links = _.uniq(links)

    return links
  }

  assertConvoStep ({ convoStep, args, botMsg }) {
    const uniqueArgs = _.uniq(args || [])
    const links = this.extractLinks(botMsg)
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
