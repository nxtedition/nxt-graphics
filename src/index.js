import CG from './lib/caspar-react'
import { TweenLite } from 'gsap'

CG.register({
  preview () {
    // as CCG XML
    this.update(CG.parse(`
      <templateData>
        <componentData id="instance1">
          <data id="text" value="Text displayed in a CasparTextField" />
        </componentData>
        <componentData id="instance2">
          <data id="imagePath" value="d:/caspar/_TEMPLATEMEDIA/myImage.png" />
          <data id="alpha" value="0.6" />
        </componentData>
        <componentData id="customParameter1">
          <data id="data" value="true" />
        </componentData>
      </templateData>
    `))

    // as JS Object
    this.update({
      instance1: {
        text: 'Text displayed in a CasparTextField'
      },
      instance2: {
        imagePath: 'd:/caspar/_TEMPLATEMEDIA/myImage.png',
        alpha: '0.6'
      },
      customParameter1: {
        data: 'true'
      }
    })

    this.play()
    setTimeout(() => this.stop(), 2000)
  },

  load () {
    this.gsap = {
      opacity: 0.0
    }
    TweenLite.ticker.addEventListener('tick', () => this.setState(this.gsap))
  },

  play () {
    TweenLite.to(this.gsap, 1, { opacity: 1.0 })
  },

  update (data) {
    this.setState({
      text: data.instance1 && data.instance1.text
    })
  },

  stop () {
    TweenLite.to(this.gsap, 1, { opacity: 0.0 })
  },

  remove () {

  },

  render () {
    return (
      <div style={{
        opacity: this.state.opacity
      }}>
        Hello {this.state.text}
      </div>
    )
  }
})
