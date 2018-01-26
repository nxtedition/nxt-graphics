#!/usr/local/bin/node

const fs = require('fs')
const path = require('path')
const { exec, execSync } = require('child_process')

execSync('npm run build')

const templates = fs
  .readdirSync('./src')
  .filter(x => x !== 'lib' && !x.includes('.') && fs
    .readdirSync(path.join('./src', x))
    .some(y => y === 'index.js')
  )
  .map(name => path.resolve(`./templates/${name}/index.html`))
  .map(file => 'file://' + file)
  .join(' ')

exec('open -a Google\\ Chrome\\ Canary --args --disable-web-security --user-data-dir ' + templates)
