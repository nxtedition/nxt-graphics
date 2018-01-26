const fs = require('fs')
const path = require('path')

const raw = fs.existsSync(path.resolve('./wt-config.json'))
  ? require('../wt-config.json')
  : {}

if (!raw.project) {
  throw new Error('Please specify project in config.json.')
}

const projectDirectory = path.resolve('.')
const sourceDirectory = path.join(projectDirectory, 'src')
const templatesDirectory = path.join(projectDirectory, 'templates')

module.exports = {
  projectDirectory,
  sourceDirectory,
  templatesDirectory,
  postBuild: {
    copyTo: (raw.postBuild && raw.postBuild.copyTo) || []
  },
  templateNames: fs
    .readdirSync(sourceDirectory)
    .filter(x => !x.includes('.') && fs
      .readdirSync(path.join(sourceDirectory, x))
      .some(y => y === 'index.js')
    )
}
