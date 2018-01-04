import CG from './lib/caspar-react'

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

  },

  play () {
    this.setState({
      isPlaying: true
    })
  },

  update (data) {
    this.setState({
      text: data.instance1 && data.instance1.text
    })
  },

  stop () {
    this.setState({
      isPlaying: false
    })
  },

  remove () {

  },

  render () {
    return this.state.isPlaying ? (
      <div>
        Hello {this.state.text}
      </div>
    ) : null
  }
})
