const fs = require('fs')
const path = require('path')
const BotDriver = require('botium-core').BotDriver

const driver = new BotDriver()

const scriptBuffer = fs.readFileSync(path.join(__dirname, 'convos/txt/restaurant.convo.txt'))

driver.BuildFluent()
  .Compile(scriptBuffer, 'SCRIPTING_FORMAT_TXT')
  .RunScripts()
  .Exec()
  .then(() => {
    console.log('READY')
  })
  .catch((err) => {
    console.log('ERROR: ', err)
  })

