import React from 'react'
import { TweenLite } from 'gsap'
import { parseString as parseXML } from 'xml2js'

const isProduction = (window.location.pathname.indexOf('/Users/') === -1 && !window.location.host) || window.caspar

const listeners = new Map()

function emit (name, ...args) {
  const listener = listeners.get(name)

  if (!listener && name === 'error') {
    throw args[0]
  } else if (!listener) {
    return
  }

  if (name === 'update' && typeof args[0] === 'string') {
    try {
      args[0] = args[0] && parse(args[0])
    } catch (err) {
      emit('error', err)
      return
    }
  }

  for (const fn of listener) {
    fn(...args)
  }
}

function parse (xml) {
  let params
  parseXML(xml, (err, result) => {
    if (err) {
      throw err
    } else {
      params = result
    }
  })

  const result = {}

  for (const val of params.templateData.componentData || []) {
    let componentData = {}

    for (const val2 of val.data || []) {
      componentData[val2.$.id] = val2.$.value
    }

    result[val.$.id] = componentData
  }

  return result
}

function on (name, callback) {
  const listener = listeners.get(name) || []
  listener.push(callback)

  if (!window[name] || !window[name].cg) {
    const fn = (...args) => emit(name, ...args)
    fn.cg = true
    window[name] = fn
    listeners.set(name, listener)
  } else if (!listeners.has(name)) {
    throw new Error(`invalid name ${name}`)
  }
}

function off (name, callback) {
  let listener = listeners.get(name)
  if (!listener) {
    return false
  }

  if (callback) {
    const idx = listener.indexOf(callback)
    if (idx === -1) {
      return
    }
    listener.splice(idx, 1)
  } else {
    listener.length = 0
  }

  if (listener.length === 0) {
    listener.delete(name)
    delete window[name]
  }
}

function xml (strings, ...args) {
  let res = ''
  for (let n = 0; n < strings.length; ++n) {
    res += strings[n] + (n < args.length ? String(args[n]) : '')
  }
  return parse(res)
}

const CG_TEMPLATE_METHODS = [
  'play',
  'stop',
  'update',
  'remove'
]

const REQUIRED_TEMPLATE_METHODS = [
  'play',
  'stop',
  'update'
]

class Template extends React.Component {
  constructor () {
    super()

    REQUIRED_TEMPLATE_METHODS.forEach(x => {
      if (!this[x]) {
        throw new Error(`Missing template method "${x}"`)
      }
    })

    CG_TEMPLATE_METHODS.forEach(x => {
      if (this[x]) {
        on(x, this[x].bind(this))
      }
    })

    this._gsap = {}
    TweenLite.ticker.addEventListener('tick', () => this.setState(this._gsap))
  }

  componentDidMount () {
    if (!isProduction && this.preview) {
      this.isPreview = true
      setTimeout(this.preview.bind(this), 1)
    }
  }
}

export default {
  Template,
  emit,
  isProduction,
  off,
  on,
  parse,
  xml
}
