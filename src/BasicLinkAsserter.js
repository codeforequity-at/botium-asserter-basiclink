const linkify = require('linkifyjs')
const util = require('util')
const debug = require('debug')('botium-asserter-basiclink')

class BasicLinkAsserter {
  constructor (context, caps = {}) {
    this.context = context
    this.caps = caps
  }

  assertConvoStep ({convoStep, args, botMsg}) {
    const uniqueArgs = Array.from(new Set(args))
    let linksSet = new Set(linkify.find(botMsg.messageText)
      .map(u => u.href))
    if (botMsg.buttons) {
      botMsg.buttons.forEach(b => linksSet.add(b.imageUri))
    }
    if (botMsg.media) {
      botMsg.media.forEach(m => linksSet.add(m.imageUri))
    }
    debug(`all found links : ${util.inspect(linksSet)}`)

    const links = Array.from(linksSet)
    const notFoundLinks = uniqueArgs
      .map(requiredLinks => this.hasSubStringOfEntry(links, requiredLinks))
      .filter(a => a != null)

    if (notFoundLinks.length > 0) {
      return Promise.reject(new Error(`${convoStep.stepTag}: Expected links with text ${notFoundLinks}, but got ${util.inspect(linksSet)} "`))
    }
    return Promise.resolve()
  }

  hasSubStringOfEntry (list, requiredEntry) {
    return !list.some(u => u.includes(requiredEntry)) ? requiredEntry : null
  }
}

module.exports = BasicLinkAsserter
