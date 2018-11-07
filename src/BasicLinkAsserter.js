const linkify = require('linkifyjs');
const util = require('util')
const debug = require('debug')('basicLink-asserter')

class BasicLinkAsserter {
  constructor (context, caps = {}) {
    this.context = context
    this.caps = caps
  }

  assertConvoStep(convo, convoStep, args, botMsg) {
    let links = linkify.find(botMsg.messageText);
    if (botMsg.buttons) {
      links.add(botMsg.buttons.map(b => b.imageUri))
    }
    if (botMsg.media) {
      links.add(botMsg.media.map(m => m.mediaUri))
    }
    debug(`all found links : ${util.inspect(links)}`)
    const urls = links
      .map(u => u.href)

    const notFoundLinks = args
      .map(a => {
        if(!urls.some(u => this.context.Match(a, u))) {
          return a
        }
      })
      .filter(a => a != null)

    if(notFoundLinks.length > 0) {
      return Promise.reject(new Error(`${convoStep.stepTag}: Expected links with text ${notFoundLinks}, but got ${util.inspect(urls)} "`))
    }
    return Promise.resolve()
  };
}

module.exports = BasicLinkAsserter
