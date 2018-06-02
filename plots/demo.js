import newArray from 'new-array'
import Rnd from '@/lib/random'

export const animate = true

export const tweak = {
  seed: '',
  shapesAmount: 350,
  segments: [3, 8],
  gimmeAngles: true,
  sometext: 'hello'
}
export const tweakMetadata = {
  shapesAmount: {
    label: 'How many shapes',
    min: 1,
    max: 920
  },
  segments: {
    label: 'Between x and y segments per shape',
    range: [0, 20]
  }
}

export const dimensions = [30, 30]

export function generate (context, tweak) {
  const r = new Rnd(tweak.seed)
  const segments = () => r.randomInt(...tweak.segments.map(x => x + 1))
  const moveX = [0.3, 0.6]
  const moveY = [0.3, 0.7]
  const unlikelyMove = [0.03, 0.5]

  const lines = newArray(tweak.shapesAmount).map((_, shape) => {
    const point = {x: 0, y: 0}
    let lastX
    let lastY
    return newArray(segments()).map((_, i) => {
      if (i) {
        if (r.randomBool()) {
          if (lastX === 'r') {
            point.x -= r.randomFloat(...moveX)
            if (tweak.gimmeAngles && r.randomInt(0, 10) > 7) point.y += r.randomFloat(...unlikelyMove)
            lastX = 'l'
          } else {
            point.x += r.randomFloat(...moveX)
            if (tweak.gimmeAngles && r.randomInt(0, 10) > 7) point.y += r.randomFloat(...unlikelyMove)
            lastX = 'r'
          }
        } else if (r.randomBool()) {
          if (lastY === 'd') {
            point.y -= r.randomFloat(...moveY)
            if (tweak.gimmeAngles && r.randomInt(0, 10) > 7) point.x += r.randomFloat(...unlikelyMove)
            lastY = 'u'
          } else {
            point.y += r.randomFloat(...moveY)
            if (tweak.gimmeAngles && r.randomInt(0, 10) > 7) point.x += r.randomFloat(...unlikelyMove)
            lastY = 'd'
          }
        } else if (tweak.gimmeAngles && r.randomInt(0, 10) > 4) {
          if (lastX === 'r') {
            point.x -= r.randomFloat(...moveX)
            if (tweak.gimmeAngles && r.randomInt(0, 10) > 7) point.y += r.randomFloat(...unlikelyMove)
            lastX = 'l'
          } else {
            point.x += r.randomFloat(...moveX)
            if (tweak.gimmeAngles && r.randomInt(0, 10) > 7) point.y += r.randomFloat(...unlikelyMove)
            lastX = 'r'
          }

          if (lastY === 'd') {
            point.y -= r.randomFloat(...moveY)
            if (tweak.gimmeAngles && r.randomInt(0, 10) > 7) point.x += r.randomFloat(...unlikelyMove)
            lastY = 'u'
          } else {
            point.y += r.randomFloat(...moveY)
            if (tweak.gimmeAngles && r.randomInt(0, 10) > 7) point.x += r.randomFloat(...unlikelyMove)
            lastY = 'd'
          }
        }
      }
      return [point.x, point.y]
    })
  }).map(asGrid)

  return function render ({disableAnimation, step}) {
    if (step === 0) {
      context.font = '1px serif'
      context.fillText(tweak.sometext, 15, 15)
    }
    if (animate && !disableAnimation) {
      if (step >= lines.length) return
      const points = lines[step % lines.length]

      context.beginPath()
      points.forEach(([x, y]) => context.lineTo(x, y))
      context.stroke()
    } else {
      lines.forEach(points => {
        context.beginPath()
        points.forEach(([x, y]) => context.lineTo(x, y))
        context.stroke()
      })
    }
  }
}

const shapePerRow = 46
function asGrid (shape, shapeN) {
  let canvasX = 1 + (shapeN % shapePerRow * 0.6)
  let canvasY = 1 + Math.floor(shapeN / shapePerRow) * 1.43
  shape.forEach((point, pointN) => {
    point[0] += canvasX
    point[1] += canvasY
  })
  return shape
}
