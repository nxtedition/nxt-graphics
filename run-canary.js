#! /usr/bin/env node

const path = require('path')
const { exec } = require('child_process')
const config = require('./config.js')

const templates = config.templateNames
  .map(templateName => path.join(config.templatesDirectory, templateName, 'index.html'))
  .map(file => 'file://' + file)
  .join(' ')

exec('open -a Google\\ Chrome\\ Canary --args --disable-web-security --user-data-dir ' + templates)
