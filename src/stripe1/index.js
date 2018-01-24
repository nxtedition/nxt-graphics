import 'babel-polyfill'
import '../fonts/open-sans.css'
import CG from '../lib/caspar'
import { TweenLite, Power4 } from 'gsap'
import ReactDOM from 'react-dom'
import React from 'react'
import nxtPic from '../images/nxt-logo.jpg'
import bbb from '../video/big-buck-bunny_trailer.webm'
import vmd from '../video/1linie.webm'
import Measure from 'react-measure'

class Template extends CG.Template {
  constructor () {
    super()

    this._gsap = { opacity: 0.0, left: '-10000000px' }
    this.state = Object.assign({}, this._gsap)
  }

  preview () {
    // as JS Object
    this.update({
      title: {
        text: 'Herp Derp 2'
      },
      subtitle: {
        text: 'Derptaherp' // 'Caspar Web Template Developer at NXTedition'
      }
      // info: {
      //   text: 'Portfolio: asdfasdf'
      // }
    })

    const run = () => {
      setTimeout(() => this.play(), 100)

      setTimeout(() => this.stop(), 4900)
    }

    run()

    setInterval(run, 7000)
  }

  onInnerDimensionsChanged (dimensions) {
    const left = `${-dimensions.width}px`
    if (!this.isPlaying) {
      this._gsap.left = left
    }
    this.setState({ dimensions, left })
  }

  play () {
    this.isPlaying = true
    TweenLite.to(this._gsap, 2, { ease: Power4.easeInOut, opacity: 1.0, left: '99px' })
  }

  update (data) {
    this.setState({
      title: data.title && data.title.text,
      subtitle: data.subtitle && data.subtitle.text,
      info: data.info && data.info.text
    })
  }

  stop () {
    TweenLite.to(this._gsap, 2, { ease: Power4.easeInOut, opacity: 1.0, left: `${-this.state.dimensions.width}px` })
    setTimeout(() => {
      this.isPlaying = false
    }, 2000)
  }

  render () {
    const { left, opacity, title, subtitle, info } = this.state

    const styles = {
      outer: {
        backgroundColor: this.isPreview && 'gray',
        fontFamily: 'Open Sans'
      },
      overlayVideo: {
        position: 'absolute',
        left: '0px',
        transformOrigin: 'top left',
        transform: 'scale(0.667)'
      },
      backgroundVideo: {
        height: '720px',
        width: '1280px'
      },
      pic: {
        borderRight: '1px solid white',
        height: '74px',
        opacity,
        width: '74px'
      },
      inner: {
        border: '1px solid white',
        color: 'white',
        height: '74px',
        left,
        lineHeight: 1,
        maxWidth: '1093px',
        opacity,
        overflow: 'hidden',
        position: 'absolute',
        textTransform: 'uppercase',
        top: '540px',
        whiteSpace: 'nowrap',
        display: 'flex',
        flexDirection: 'row'
      },
      lines: {
        display: 'flex',
        flexDirection: 'column'
      },
      line1: {
        background: 'rgba(0,0,0,0.4)',
        flex: '1 0 0',
        fontSize: '31px',
        fontWeight: '700',
        margin: '0px',
        paddingBottom: '4px',
        paddingLeft: '15px',
        paddingRight: '15px',
        paddingTop: '5px'
      },
      line2: {
        background: '#EC2B8C',
        flex: '1 0 0',
        fontSize: '23px',
        fontWeight: '600',
        letterSpacing: '1px',
        margin: '0px',
        paddingBottom: '6px',
        paddingLeft: '15px',
        paddingRight: '15px',
        paddingTop: '5px'
      }
    }

    return (
      <div style={styles.outer}>
        <video muted autoPlay loop src={bbb} style={styles.backgroundVideo} />
        <video muted autoPlay loop src={vmd} style={styles.overlayVideo} />
        <Measure bounds onResize={(contentRect) => this.onInnerDimensionsChanged(contentRect.bounds)}>
          {({ measureRef }) =>
            <div ref={measureRef} style={styles.inner}>
              <img style={styles.pic} src={nxtPic} />
              <div style={styles.lines}>
                <p style={styles.line1}>{title}</p>
                <p style={styles.line2}>{subtitle}</p>
              </div>
            </div>
          }
        </Measure>
      </div>
    )
  }
}

ReactDOM.render(<Template />, document.getElementById('app'))
