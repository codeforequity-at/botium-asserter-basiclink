const linkify = require('linkifyjs')
const util = require('util')
const debug = require('debug')('botium-asserter-basiclink')

class BasicLinkAsserter {
  constructor (context, caps = {}) {
    this.context = context
    this.caps = caps
  }

  assertConvoStep ({convoStep, args, botMsg}) {
    let links = new Set(linkify.find(botMsg.messageText)
      .map(u => u.href))
    if (botMsg.buttons) {
      links.add(botMsg.buttons.map(b => b.imageUri))
    }
    if (botMsg.media) {
      links.add(botMsg.media.map(m => m.mediaUri))
    }
    debug(`all found links : ${util.inspect(links)}`)

    const notFoundLinks = args
      .map(a => {
        if (!links.has(u => u.includes(a))) {
          return a
        }
        return null
      })
      .filter(a => a != null)

    if (notFoundLinks.length > 0) {
      return Promise.reject(new Error(`${convoStep.stepTag}: Expected links with text ${notFoundLinks}, but got ${util.inspect(links)} "`))
    }
    return Promise.resolve()
  }
}

module.exports = BasicLinkAsserter
