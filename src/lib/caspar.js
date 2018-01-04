import { parseString as parseXML } from 'xml2js'
import parseString from 'auto-parse'

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
      args[0] = fromCGParams(args[0])
    } catch (err) {
      emit('error', err)
      return
    }
  }

  for (const fn of listener) {
    fn(...args)
  }
}

function fromCGParams (xml) {
  let params
  parseXML(xml, (err, result) => {
    if (err) {
      throw err
    } else {
      params = result
    }
  })
  return params.templateData.componentData.reduce((obj, val) => Object.assign(obj, { [val.$.id]: val.data.map(val => parseString(val.$)) }), {})
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

const isProduction = !window.location.pathname.endsWith('dist/index.html') && !window.location.host

module.exports = {
  isProduction,
  emit,
  on,
  off
}
