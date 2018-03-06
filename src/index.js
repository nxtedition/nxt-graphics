import 'babel-polyfill'
import './fonts/tw-cen.css'
import CG from './caspar'
import { TimelineLite } from 'gsap'
import ReactDOM from 'react-dom'
import React from 'react'
import bg1 from './images/bg1-1080p.jpg'
import bg2 from './images/bg2-1080p.jpg'

const HALF_TRANSITION_TIME = 1

const COLORS = [
  '#769691',
  '#587F79',
  '#5BA095',
  '#619272',
  '#547760',
  '#607467',
  '#7E8E84',
  '#898F67',
  '#757D45',
  '#7D806D'
]

const IMAGES = [
  bg1,
  bg2
]

const MOCK = [
  { day: { text: 'Test A' }, clock: { text: '19.00' }, title: { text: 'Test 1' } },
  { day: { text: 'Test B' }, clock: { text: '20.30' }, title: { text: 'Test 2' } },
  { day: { text: 'Test C' }, clock: { text: '21.00' }, title: { text: 'Test 3' } },
  { day: { text: 'Test D' }, clock: { text: '22.30' }, title: { text: 'Test 4' } },
  { day: { text: 'Test E' }, clock: { text: '23.00' }, title: { text: 'Test 5' } },
  { day: { text: 'Test F' }, clock: { text: '23.15' }, title: { text: 'Test 6' } }
]

class Template extends CG.Template {
  constructor () {
    super()

    this._gsap = {
      clip: 0,
      colorIndex: 0,
      imageIndex: 0,
      opacity: 1,
      fadeout: 0
    }
    this.state = { ...this._gsap }

    const swapBackground = () =>
      Object.assign(this._gsap, {
        clip: 0,
        colorIndex: (this.state.colorIndex + 1) % COLORS.length,
        imageIndex: (this.state.imageIndex + 1) % IMAGES.length
      })

    const swapData = () => this.state.next && this.setState({ ...this.state.next, next: null })

    this.tl = new TimelineLite({ paused: true })
      .to(this._gsap, HALF_TRANSITION_TIME * 2, { clip: 1080, onComplete: swapBackground })
      .to(this._gsap, HALF_TRANSITION_TIME, { opacity: 0, onComplete: swapData }, 0)
      .to(this._gsap, HALF_TRANSITION_TIME, { opacity: 1 })
  }

  load () {
    this.tl.pause(0)
  }

  preview () {
    let i = 0

    const performUpdate = () => {
      this.update(MOCK[i])
      i = (i + 1) % MOCK.length
    }

    setInterval(performUpdate, 5e3)
    performUpdate()
  }

  play () {
    this.tl.play()
  }

  pause () {
    this.tl.pause()
  }

  update (data) {
    if (this.state.stopped) {
      return
    }
    const next = {
      day: data.day && data.day.text,
      clock: data.clock && data.clock.text,
      title: data.title && data.title.text
    }
    if (!this.state.day || !this.state.clock || !this.state.title) {
      this.setState(next)
    } else {
      this.setState({ next })
      this.tl.restart()
    }
  }

  stop () {
    this.setState({ stopped: true })
    this.tl.to(this._gsap, 1, { fadeout: 1, onComplete: () => this.remove() })
  }

  render () {
    const {
      clip,
      clock,
      colorIndex,
      day,
      imageIndex,
      opacity,
      title,
      fadeout
    } = this.state

    const colorBack = COLORS[(colorIndex + 1) % COLORS.length]
    const colorFront = COLORS[colorIndex]

    const bgBack = IMAGES[(imageIndex + 1) % IMAGES.length]
    const bgFront = IMAGES[imageIndex]

    const styles = {
      outer: {
        backgroundColor: this.isPreview && '#6495ED',
        fontFamily: 'Tw Cen',
        opacity: 1 - fadeout
      },
      bgBack: {
        position: 'absolute'
      },
      bgFront: {
        position: 'absolute',
        clipPath: `inset(${clip}px 0px 0px 0px)`
      },
      solidBack: {
        position: 'absolute',
        height: '1080px',
        width: '1920px',
        transform: 'translate(-50%) skew(-15deg)',
        backgroundColor: colorBack
      },
      solidFront: {
        position: 'absolute',
        height: '1080px',
        width: '1920px',
        transform: 'translate(-50%) skew(-15deg)',
        backgroundColor: colorFront,
        clipPath: `inset(0px 0px ${clip}px 0px)`
      },
      content: {
        color: 'white',
        left: '425px',
        position: 'absolute',
        filter: 'drop-shadow(0px 0px 14px rgba(70, 70, 70, 0.95))',
        top: '150px'
      },
      logo: {
        width: '470px',
        marginLeft: '-37px'
      },
      f0: {
        fontSize: '70px',
        marginTop: '-55px'
      },
      f1: {
        fontSize: '170px'
      },
      f2: {
        fontSize: '110px',
        marginTop: '18px',
        opacity
      }
    }

    const onClick = this.isPreview ? () => this.tl.paused() ? this.play() : this.pause() : undefined
    const onContextMenu = this.isPreview
      ? evt => {
        evt.preventDefault()
        this.stop()
      }
      : undefined

    return (
      <div
        style={styles.outer}
        onClick={onClick}
        onContextMenu={onContextMenu}
      >
        <img src={bgBack} style={styles.bgBack} />
        <img src={bgFront} style={styles.bgFront} />
        <div style={styles.solidBack} />
        <div style={styles.solidFront} />
        <div style={styles.content}>
          <div style={styles.f0}>{ day }</div>
          <div style={styles.f1}>{ clock }</div>
          <div style={styles.f2}>{ title }</div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Template />, document.getElementById('app'))
