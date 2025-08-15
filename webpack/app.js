const base = require('./base')

const { app } = base.entry
const config = {
  ...base,
  entry: { app },
}

module.exports = config
