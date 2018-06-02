// this lib has utilities to generate seeded random numbers. Using it instead of
// Math.random() has the great benefit of reproducible drawings!
import Rnd from '@/lib/random'

// use the `tweak` object to export things you want to tweak from the frontend,
// it can be modified by the frontend. It must contain a `seed` key with string value.
// When `tweak.seed` is the empty string, it will be assigned a random seed.
export const tweak = {seed: ''}

export const dimensions = [40, 40]

// generate() always gets called with:
// `context`, the canvas context, see how I use it in `render()`
// `tweak`, the above `tweak` object
export function generate (context, tweak) {
  const r = new Rnd(tweak.seed)
  const shapes = [...Array(10)] // create 10 shapes
    .map((_, NthShape) => { // each shape
      let shape = []
      for (let i = 0; i < 3; i++) { // will be made of 3 points
        if (i === 0) { // the first point is always [1, 1]
          shape.push([1, 1])
          continue
        }
        // next points are wherever, not outside of the plot dimensions though
        // and not within 1 from the plot edge
        shape.push([r.randomFloat(1, dimensions[0] - 1), r.randomFloat(1, dimensions[0] - 1)])
      }
      shape.push(shape[0]) // last point closes the shape because I want triangles
      return shape
    })

  // generate() always needs to return a "render" function that will be called to actually
  // render the generated plot.
  // This "render" function always gets called with:
  // `disableAnimation` (bool, default: false), the frontend can tell you not to draw step by step
  // `step` (int), which step to render, starts at 0 and increments on requestAnimationFrame, use it to animate the drawing
  return function render ({disableAnimation, step}) {
    shapes.forEach((shape) => { // for each shape
      context.beginPath() // start drawing a Path…
      shape.forEach(([x, y]) => context.lineTo(x, y)) // connecting each point of the shape
      context.stroke() // strike this line and move on!
    })
  }
}
