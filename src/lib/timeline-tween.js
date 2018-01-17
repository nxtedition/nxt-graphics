import { Component } from 'react'
import { TimelineLite, TweenLite } from 'gsap'

export default class TimelineTween extends Component {
  componentDidMount () {
    const { timeline } = this.props

    if (!timeline || !this.el) {
      return
    }

    const tl = new TimelineLite()
    timeline.forEach(t => {
      tl.add(TweenLite.to(this.el, t[0], t[1]))
    })
  }

  handleRef = (el) => {
    this.el = el
  }

  render () {
    return (
      this.props.render(this.handleRef)
    )
  }
}
