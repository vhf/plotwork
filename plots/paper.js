import paper from 'paper'

export const tweak = {seed: ''}
export const dimensions = [10, 10]

export function generate (context, tweak) {
  return function render ({disableAnimation, step}) {
    // Example taken from http://paperjs.org/tutorials/getting-started/using-javascript-directly/
    paper.setup(context.canvas)
    // Create a Paper.js Path to draw a line into it:
    var path = new paper.Path()
    // Give the stroke a color
    path.strokeColor = 'black'
    var start = new paper.Point(0, 0)
    // Move to start and draw a line from there
    path.moveTo(start)
    // Note that the plus operator on Point objects does not work
    // in JavaScript. Instead, we need to call the add() function:
    path.lineTo(start.add([ 5, 5 ]))
    // Draw the view now:
    paper.view.draw()
  }
}
