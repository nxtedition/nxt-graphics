import CG from '../lib/caspar'
import { TweenLite } from 'gsap'
import ReactDOM from 'react-dom'
import React from 'react'

class Template extends React.Component {
  constructor () {
    super()

    CG.on('play', this.play.bind(this))
    CG.on('update', this.update.bind(this))
    CG.on('stop', this.stop.bind(this))

    if (!CG.isProduction) {
      setTimeout(this.preview.bind(this), 1)
    }

    TweenLite.ticker.addEventListener('tick', () => this.setState(this.gsap))

    this.gsap = { opacity: 0.0 }
    this.state = { opacity: 0 }
  }

  preview () {
    this.isPreview = true

    // as CCG XML
    this.update(CG.xml`
      <templateData>
        <componentData id="f0">
          <data id="text" value="Adam Leah" />
        </componentData>
        <componentData id="f1">
          <data id="text" value="Graphics Designer" />
        </componentData>
        <componentData id="customParameter1">
          <data id="data" value="true" />
        </componentData>
      </templateData>
    `)

    // as JS Object
    this.update({
      f0: {
        text: 'Adam Leah'
      },
      f1: {
        text: 'Graphics Designer'
      },
      customParameter1: {
        data: 'true'
      }
    })

    this.play()
    setTimeout(() => this.stop(), 4000)
  }

  play () {
    TweenLite.to(this.gsap, 1, { opacity: 1.0 })
  }

  update (data) {
    this.setState({
      f0: data.f0 && data.f0.text,
      f1: data.f1 && data.f1.text
    })
  }

  stop () {
    TweenLite.to(this.gsap, 1, { opacity: 0.0 })
  }

  render () {
    const { opacity, f0, f1 } = this.state

    const styles = {
      outer: {
        width: '1280px',
        height: '720px',
        backgroundColor: this.isPreview && 'grey'
      },
      inner: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        position: 'absolute',
        maxWidth: '1093px',
        height: '74px',
        top: '540px',
        left: '99px',
        color: 'white',
        lineHeight: 1,
        // TODO import font
        fontFamily: 'openSans',
        textTransform: 'uppercase',
        opacity
      },
      line1: {
        margin: '0px',
        background: 'rgba(0,0,0,0.4)',
        fontSize: '31px',
        fontWeight: '700',
        paddingTop: '5px',
        paddingBottom: '4px',
        paddingLeft: '15px',
        paddingRight: '15px'
      },
      line2: {
        margin: '0px',
        background: '#EC2B8C',
        fontSize: '23px',
        fontWeight: '600',
        letterSpacing: '1px',
        paddingTop: '5px',
        paddingBottom: '6px',
        paddingLeft: '15px',
        paddingRight: '15px'
      }
    }

    return (
      <div style={styles.outer}>
        <div style={styles.inner}>
          <p style={styles.line1}>{f0}</p>
          <p style={styles.line2}>{f1}</p>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Template />, document.getElementById('app'))
