const path = require('path')
const fs = require('fs')
/** @type {import('@variousjs/registry').Packages} */
const registry = require('@variousjs/registry')

const components = fs
  .readdirSync(path.resolve(__dirname, './src/components'))
  .reduce((prev, cur) => {
    return {
      ...prev,
      [cur]: path.join(__dirname, `./src/components/${cur}`),
    }
  }, {})

const depsComponents = Object.keys(components).reduce((prev, cur) => {
  return {
    ...prev,
    [cur]: `./dist/${cur}.js`,
  }
}, {})

const externals = []

/**
 * @param {keyof typeof registry} name
 */
const getPackageSrc = (name) => {
  const package = registry[name]
  const version = package['dist-tags'].latest
  const { dist, dependencies } = package.versions[version]

  if (dependencies) {
    return {
      ...Object.keys(dependencies)
        .reduce((prev, cur) => ({ ...prev, ...getPackageSrc(cur) }), {}),
      [name]: dist,
    }
  }
  return { [name]: dist }
}

/** @type {import('@variousjs/various').Config} */
const config = {
  env: 'development',
  dependencies: {
    ...getPackageSrc('react'),
    ...getPackageSrc('react-dom'),
    ...depsComponents,
  },
}

module.exports = {
  config,
  components,
  externals,
}
