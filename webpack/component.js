const base = require('./base')

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { app, ...rest } = base.entry
const config = {
  ...base,
  // 监听变化，重新构建
  watch: true,

  // 只构建除主 app 外所有 component
  entry: rest,
}

module.exports = config
