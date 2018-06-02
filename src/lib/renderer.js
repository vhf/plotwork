import C2S from '../../vendor/canvas2svg'
import is from '@sindresorhus/is'
const pixelRatio = window.devicePixelRatio

class Renderer {
  constructor ({
    canvas,
    name,
    plot,
    width,
    height,
    background,
    tweak
  } = {}) {
    this.name = name
    this.canvas = canvas
    this.context = this.canvas.getContext('2d')
    this.plot = plot
    this.width = width
    this.height = height
    this.running = this.plot.animate
    this.delay = 25
    this.drawArgs = {
      step: 0,
      disableAnimation: false
    }
    this.tweak = plot.tweak

    /* "friendly" alerts for newcomers */
    if (!is.array(this.plot.dimensions)) {
      alert('Your plot needs to export its dimensions, e.g. `export const dimensions = [30, 30]`')
    }
    if (!is.object(this.plot.tweak)) {
      alert('Your plot needs to export a "tweak" object, e.g. `export const tweak = {}`')
    }
    if (!is.function(this.plot.generate)) {
      alert('Your plot needs to export a "generate" function, e.g. `export function generate (context, tweak) {}`')
    }
  }

  clear () {
    clearTimeout(this._animateDelay)
    this.drawArgs.step = 0
    if (this.plot.background) {
      this.context.save()
      this.context.globalAlpha = 1
      this.context.fillStyle = this.plot.background
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
      this.context.restore()
    } else {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
  }

  setSize () {
    this.canvas.width = this.width * pixelRatio
    this.canvas.height = this.height * pixelRatio
    this.canvas.style.width = `${this.width}px`
    this.canvas.style.height = `${this.height}px`
  }
  start () {
    this.running = true
  }
  stop () {
    this.running = false
  }
  runToggle () {
    this.running = !this.running
  }
  step () {
    this.draw()
    this.drawArgs.step += 1
  }
  animationToggle () {
    this.drawArgs.disableAnimation = !this.drawArgs.disableAnimation
    this.clear()
    this.render()
  }

  render () {
    this.setSize()
    if (this.plot.animate && this.drawArgs.disableAnimation !== true) {
      return this.animate()
    }
    this.draw()
  }

  animate () {
    const step = () => {
      if (this.running) {
        this.draw()
        this.drawArgs.step += 1
      }
      if (this.delay) {
        this._animateDelay = setTimeout(() => requestAnimationFrame(step), this.delay)
      } else {
        requestAnimationFrame(step)
      }
    }

    step()
  }

  draw () {
    this.context.save()

    this.context.scale(
      pixelRatio * (this.width / this.plot.dimensions[0]),
      pixelRatio * (this.height / this.plot.dimensions[1])
    )

    this.context.lineJoin = 'round'
    this.context.lineCap = 'round'
    this.context.globalAlpha = 1
    this.context.lineWidth = 0.03
    this.context.fillStyle = 'black'
    this.context.strokeStyle = 'black'

    const render = this.plot.generate(this.context, this.tweak)

    if (!is.function(render)) {
      alert("Your plot's exported 'generate' function needs to return an object with a render method.")
    }
    render(this.drawArgs)
    this.context.restore()
  }

  svg (filename) {
    const animated = this.animate
    this.animate = false
    const context = this.context
    this.context = new C2S(this.canvas.width, this.canvas.height)
    this.clear()
    this.draw()
    const svg = this.context.getSerializedSvg(true)
    const a = window.document.createElement('a')
    a.href = window.URL.createObjectURL(new Blob([svg], {type: 'image/svg+xml'}))
    a.download = `${this.name}-${this.tweak.seed}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    this.animate = animated
    this.context = context
  }
}

export default Renderer
