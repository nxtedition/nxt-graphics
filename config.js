const fs = require('fs')
const path = require('path')

const raw = fs.existsSync('./config.json')
  ? require('./config.json')
  : {}

if (!raw.workDirectory) {
  throw new Error('Please specify workDirectory in config.json.')
}

const workDirectory = path.resolve(raw.workDirectory)
const sourceDirectory = path.join(workDirectory, 'src')
const templatesDirectory = path.join(workDirectory, 'templates')

module.exports = {
  workDirectory,
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
