import 'babel-polyfill'
import '../fonts/tw-cen.css'
import CG from '../lib/caspar'
import { TweenLite, TimelineLite } from 'gsap'
import ReactDOM from 'react-dom'
import React from 'react'
import nxtPic from '../images/knr_logo_hvid.png'
import previewHD from '../images/preview_HD.jpg'

const HALF_TRANSITION_TIME = 1

// TODO use
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

    this._state = { opacity: 1.0, colorIndex: 0 }
    this.state = Object.assign({}, this._state)
  }

  preview () {
    this.isPreview = true

    let runningIndex = 0

    const performUpdate = () => {
      this.update(MOCK[runningIndex])
      runningIndex = (runningIndex + 1) % MOCK.length
    }

    setInterval(performUpdate, 5e3)
    performUpdate()
  }

  onInnerDimensionsChanged (dimensions) {
    const left = `${-dimensions.width}px`
    if (!this.isPlaying) {
      this._state.left = left
    }
    this.setState({ dimensions, left })
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

      const tl = new TimelineLite()

      tl.add(TweenLite.to(this._state, HALF_TRANSITION_TIME, { opacity: 0.0 }))

      setTimeout(() => {
        this.setState({
          day: data.day && data.day.text,
          clock: data.clock && data.clock.text,
          title: data.title && data.title.text
        })
      }, HALF_TRANSITION_TIME * 1e3) // milliseconds

      tl.add(TweenLite.to(this._state, HALF_TRANSITION_TIME, { opacity: 1.0 }))
    }

    // TODO tween "clip", "colorIndex"
  }

  stop () {
    this.isPlaying = false
  }

  render () {
    const { day, clock, title, clip, opacity } = this.state

    const styles = {
      outer: {
        backgroundColor: this.isPreview && '#0f0',
        fontFamily: 'Tw Cen',
        height: '1080px',
        overflow: 'hidden',
        width: '1920px'
      },
      background: {
        position: 'absolute',
      },
      // TODO how to sync background transition if KNR provides images???
      left: {
        position: 'absolute',
        height: '1080px',
        width: '1920px',
        transform: 'translate(-50%) skew(-15deg)',
        backgroundColor: '#769691',
        clipPath: `inset(0px 0px ${clip}px 0px)`
      },
      content: {
        color: 'white',
        left: '425px',
        position: 'absolute',
        textShadow: 'rgba(90, 90, 90, 0.95) 0px 0px 50px',
        top: '150px'
      },
      logo: {
        // TODO there should be a shadow on the logo, like for the text! These shadows should use the same parameters! Sync up with KNR
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
        {this.isPreview && <img src={previewHD} style={styles.background} />}
        <div style={styles.left} />
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
