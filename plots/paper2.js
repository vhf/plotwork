import p from 'paper'

export const tweak = {
  seed: '',
  Bx: 55,
  By: 40
}
export const tweakMetadata = {
  Bx: {
    min: 0,
    max: 100
  },
  By: {
    min: 0,
    max: 100
  }
}
export const dimensions = [100, 100]

export function generate (context, tweak) {
  return function render ({disableAnimation, step}) {
    p.setup(context.canvas)
    const A = new p.Point(30, 30)
    const B = new p.Point(tweak.Bx, tweak.By)
    const P = new p.Point(10, 70)
    const circle = new p.Path.Circle(P, 1)
    circle.strokeColor = 'black'
    const AB = new p.Path.Line(A, B)
    AB.strokeColor = 'black'
    const AB2 = B.subtract(A)
    const AP2 = P.subtract(A)

    const dot = AP2.dot(AB2)
    const distance = dot / A.getDistance(B, true)

    const AD2 = AB2.multiply(distance)
    const Z = A.add(AD2)

    const projectPontoA = new p.Path.Line(P, Z)
    projectPontoA.strokeColor = 'red'

    const x = new p.Path.Line(A, B)
    x.scale(20)
    x.strokeColor = 'grey'
    x.sendToBack()

    const tA = new p.PointText(A)
    tA.content = 'A'
    tA.fontSize = 2
    tA.bringToFront()
    tA.fillColor = 'blue'
    const tB = new p.PointText(B)
    tB.content = `B: (${B.x}, ${B.y})`
    tB.fontSize = 2
    tB.fillColor = 'blue'
    tB.bringToFront()
    const tP = new p.PointText(P)
    tP.content = 'P'
    tP.fontSize = 2
    tP.fillColor = 'blue'
    tP.bringToFront()

    const tZ = new p.PointText(Z)
    tZ.content = `(${Math.round(Z.x)}, ${Math.round(Z.y)})`
    tZ.fontSize = 2
    tZ.bringToFront()
    tZ.fillColor = 'green'

    return function exportSVG () {
      return p.project.exportSVG({asString: true})
    }
  }
}
