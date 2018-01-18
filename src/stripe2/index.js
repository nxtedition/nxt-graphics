import 'babel-polyfill'
import '../fonts/index.css'
import CG from '../lib/caspar'
import { TweenLite, Power4 } from 'gsap'
import ReactDOM from 'react-dom'
import React from 'react'
import nxtPic from '../images/nxt-logo.jpg'
import bbb from '../video/big-buck-bunny_trailer.webm'
import Measure from 'react-measure'

class Template extends CG.Template {
  constructor () {
    super()

    this._state = { opacity: 0.0, left: '-10000000px' }
    this.state = Object.assign({}, this._state)
  }

  preview () {
    this.isPreview = true

    // as CCG XML
    // this.update(CG.xml`
    //   <templateData>
    //     <componentData id="f0">
    //       <data id="text" value="Martin G" />
    //     </componentData>
    //     <componentData id="f1">
    //       <data id="text" value="Web Developer" />
    //     </componentData>
    //     <componentData id="customParameter1">
    //       <data id="data" value="true" />
    //     </componentData>
    //   </templateData>
    // `)

    // as JS Object
    this.update({
      title: {
        text: 'Martin'
      },
      subtitle: {
        text: 'Caspar Web Template Developer at NXTedition'
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
      this._state.left = left
    }
    this.setState({ dimensions, left })
  }

  play () {
    this.isPlaying = true
    TweenLite.to(this._state, 2, { ease: Power4.easeInOut, opacity: 1.0, left: '99px' })
  }

  update (data) {
    this.setState({
      title: data.title && data.title.text,
      subtitle: data.subtitle && data.subtitle.text,
      info: data.info && data.info.text
    })
  }

  stop () {
    TweenLite.to(this._state, 2, { ease: Power4.easeInOut, opacity: 1.0, left: `${-this.state.dimensions.width}px` })
    setTimeout(() => {
      this.isPlaying = false
    }, 2000)
  }

  render () {
    const { left, opacity, title, subtitle, info } = this.state

    const styles = {
      outer: {
        backgroundColor: this.isPreview && '#0f0',
        height: '720px',
        width: '1280px',
        overflow: 'hidden'
      },
      videos: {
        width: '1280px',
        height: '720px',
        overflow: 'hidden'
      },
      overlayVideo: {
        position: 'absolute',
        left: '0px',
        top: '564px',
        transformOrigin: 'bottom left',
        transform: 'scale(0.666)'
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
        fontFamily: 'Open Sans',
        height: '74px',
        left,
        // left: '99px',
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
        <div style={styles.videos}>
          <video muted autoPlay loop src={bbb} style={styles.backgroundVideo} />
        </div>
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
