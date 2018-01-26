import 'babel-polyfill'
import '../fonts/tw-cen.css'
import CG from 'lib/caspar'
import { TimelineLite } from 'gsap'
import ReactDOM from 'react-dom'
import React from 'react'
import nxtPic from '../images/knr_logo_hvid.png'
import bg1 from '../images/bg1-1080p.jpg'
import bg2 from '../images/bg2-1080p.jpg'

const HALF_TRANSITION_TIME = 1

// TODO are these the final colors?
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

// TODO how to get images???
const IMAGES = [
  bg1,
  bg2
]

const MOCK = [
  { day: { text: 'Ataasinngorneq' }, clock: { text: '20.00' }, title: { text: 'Sikusimasoq alakkarparput' } },
  { day: { text: 'Ataasinngorneq' }, clock: { text: '20.30' }, title: { text: 'Meeqqat kakkilertasut' } },
  { day: { text: 'Tallimanngorneq' }, clock: { text: '20.00' }, title: { text: 'Asilipé toqqaannartoq' } },
  { day: { text: 'Ataasinngorneq' }, clock: { text: '20.00' }, title: { text: 'Inatsisartut ataatsimiinnerat' } },
  { day: { text: 'Sisamanngorneq' }, clock: { text: '19.00' }, title: { text: 'Toqqorsivimmiit' } },
  { day: { text: 'Ataasinngorneq' }, clock: { text: '20.00' }, title: { text: 'Sermersuaq nungulerpoq' } }
]

class Template extends CG.Template {
  constructor () {
    super()

    this._gsap = {
      clip: 0,
      colorIndex: 0,
      imageIndex: 0,
      opacity: 1
    }
    this.state = Object.assign({}, this._gsap)
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
    this.isPlaying = true
  }

  update (data) {
    if (!this.state.day || !this.state.clock || !this.state.title) {
      // handle initial state

      this.setState({
        day: data.day && data.day.text,
        clock: data.clock && data.clock.text,
        title: data.title && data.title.text
      })
    } else {
      // create animation

      new TimelineLite()
        .to(this._gsap, HALF_TRANSITION_TIME * 2, { clip: 1080 })
        .to(this._gsap, 0, {
          clip: 0,
          colorIndex: (this.state.colorIndex + 1) % COLORS.length,
          imageIndex: (this.state.imageIndex + 1) % IMAGES.length
        })

      new TimelineLite()
        .to(this._gsap, HALF_TRANSITION_TIME, { opacity: 0 })
        .to(this._gsap, HALF_TRANSITION_TIME, { opacity: 1 })

      setTimeout(() => {
        this.setState({
          day: data.day && data.day.text,
          clock: data.clock && data.clock.text,
          title: data.title && data.title.text
        })
      }, HALF_TRANSITION_TIME * 1e3)
    }
  }

  stop () {
    this.isPlaying = false
  }

  render () {
    const {
      clip,
      clock,
      colorIndex,
      day,
      imageIndex,
      opacity,
      title
    } = this.state

    const colorBack = COLORS[(colorIndex + 1) % COLORS.length]
    const colorFront = COLORS[colorIndex]

    const bgBack = IMAGES[(imageIndex + 1) % IMAGES.length]
    const bgFront = IMAGES[imageIndex]

    const styles = {
      outer: {
        backgroundColor: this.isPreview && '#6495ED',
        fontFamily: 'Tw Cen'
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

    return (
      <div style={styles.outer}>
        <img src={bgBack} style={styles.bgBack} />
        <img src={bgFront} style={styles.bgFront} />
        <div style={styles.solidBack} />
        <div style={styles.solidFront} />
        <div style={styles.content}>
          <img src={nxtPic} style={styles.logo} />
          <div style={styles.f0}>{ day }</div>
          <div style={styles.f1}>{ clock }</div>
          <div style={styles.f2}>{ title }</div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Template />, document.getElementById('app'))
