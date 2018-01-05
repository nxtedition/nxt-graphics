import { on, parse, xml, isProduction } from './caspar'
import ReactDOM from 'react-dom'
import React from 'react'

function register (obj) {
  class Template extends React.Component {
    constructor () {
      super()
      this.render = (...args) => !this.state ? null : obj.render.call(this)

      for (const name of ['play', 'update', 'stop']) {
        if (obj[name]) {
          this[name] = obj[name].bind(this)
          on(name, this[name])
        }
      }

      if (!isProduction && obj.preview) {
        setTimeout(() => obj.preview.call(this), 1)
      }

      if (obj.load) {
        obj.load.call(this)
      }
    }
  }
  ReactDOM.render(<Template />, document.getElementById('app'))
}

module.exports = {
  parse,
  xml,
  register
}
