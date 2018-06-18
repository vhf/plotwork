import Rnd from '@/lib/random'
import paper from 'paper'

export const tweak = {seed: ''}
export const dimensions = [100, 100]

export function generate (context, tweak) {
  const r = new Rnd(tweak.seed)

  const points1 = {pos: [], neg: []}
  const points2 = {pos: [], neg: []}
  for (let i = 0; i < 5000; i++) {
    const p1 = r.randomAngle(100)
    if (p1 < 0) points1.neg.push(p1)
    else points1.pos.push(p1)

    const p2 = r.randomFloat(-100, 100)
    if (p2 < 0) points2.neg.push(p2)
    else points2.pos.push(p2)
  }
  points1.pos.sort((a, b) => b - a)
  points1.neg.sort((a, b) => b - a)
  points2.pos.sort((a, b) => b - a)
  points2.neg.sort((a, b) => b - a)

  const p1 = [...points1.neg, ...points1.pos.map(x => -x)]
  const p2 = [...points2.neg, ...points2.pos.map(x => -x)]

  return function render ({disableAnimation, step}) {
    paper.setup(context.canvas)

    for (let i = 0; i < 5000; i++) {
      const reference = new paper.Path(new paper.Point(50, 0), new paper.Point(100, 100))
      reference.strokeColor = 'blue'
      reference.strokeWidth = 0.2
      reference.addSegments([new paper.Point(0, 100), new paper.Point(50, 0)])

      const path1 = new paper.Path.Line(
        new paper.Point(i * 0.02 + 0.02, 100),
        new paper.Point(i * 0.02 + 0.02, 100 + p1[i])
      )
      path1.strokeColor = 'yellow'
      path1.strokeWidth = 0.1

      const path2 = new paper.Path.Line(
        new paper.Point(i * 0.02 + 0.02, 100),
        new paper.Point(i * 0.02 + 0.02, 100 + p2[i])
      )
      path2.strokeColor = 'black'
      path2.strokeWidth = 0.1
      path1.bringToFront()
    }

    paper.view.draw()
  }
}
