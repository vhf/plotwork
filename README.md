# plotwork

**plotwork** -- an experimental generative art framework enabling generative art experiments.

[DEMO](https://draft.li/plotwork/)

(The idea isn't new and I'm probably doing it wrong. I don't know the space, I didn't know what existed before building this. It works for me though.)

## Goal

This project is an interactive web interface to plot canvas drawings and control their variable parts dynamically.

## Features

* An overview of all plots, displaying them as thumbnails.
* Creating a new plot is as simple as dropping a JS file into a specific directory; plotwork automatically detects it and reloads.
* Displaying a single plot automatically renders a "control panel" allowing the user to change parameters and see the resulting plot in real-time.

## Creating a plot

Check out the source of the [demo](https://draft.li/plotwork/#/plots/demo.js) plot [`demo.js`](/plots/demo.js), or the [minimal](https://draft.li/plotwork/#/plots/minimal.js) plot [`minimal.js`](/plots/minimal.js).

### Mandatory elements any plot should export

Taking a look at the [minimal example, `minimal.js`](/plots/minimal.js) might help. It only exports what needs to be exported, nothing else.

#### a. `tweak` object

```js
export const tweak = {
  seed: ''
}
```

The `tweak` object is the "magical" part of this project. Nothing special in there, it leverages the fact that JavaScript objects are references (they are one of the [Reference types](https://www.ecma-international.org/ecma-262/5.1/#sec-8.7), aka *complex types* or *container types*).

It must contain a `seed` key with string value. When `tweak.seed` is the empty string, it will be assigned a random seed.

To export a variable you want to tweak from the frontend, add a property with a default value to the `tweak` object and use it with `tweak.myProperty` in your [`generate()` function](#c-generate-function).

##### a. 1. `tweak` variable types

Although any variable type can be tweaked because the interface exposes the tweak object as an editable JSON field, some variable types provide a nicer tweak interface:

* strings

      legend: 'hello'

* numbers

      quantity: 11.98

* boolean

      flag: true

* ranges

      between: [1, 10]

You can see most of them in use in the [demo](https://draft.li/plotwork/#/plots/demo.js) plot [`demo.js`](/plots/demo.js).

##### a. 2. `tweakMetadata` object

As we have seen in [a. 1. `tweak` variable types](#a-1-tweak-variable-types), some variable types generate user-friendly knobs. These can be made more helpful by providing some metadata.

For instance let's export the seed, a range and a number:
```js
export const tweak = {
  seed: '',
  sides: [3, 8],
  depth: 3
}
```

* `seed` being a string, it will be rendered as a text input (remember that [you have to export the seed](#a-tweak-object))
* `sides` being a list of two numbers, it will be rendered as a range slider
* `depth` being a number, it will rendered as a slider

We have default values for these, let's be a bit more specific by exporting the following `tweakMetadata` object:

```js
export const tweakMetadata = {
  sides: {
    label: 'Each shape will have between x and y sides',
    range: [0, 20]
  },
  depth: {
    label: 'How deep this shape is',
    min: 1,
    max: 10
  },
}
```

That way the frontend will have better information on how to render more useful tweak sliders.

Try it for yourself or take a closer at the [demo](https://draft.li/plotwork/#/plots/demo.js) plot [`demo.js`](/plots/demo.js).

#### b. `dimensions` array

```js
export const dimensions = [40, 40]
```

#### c. `generate` function

```js
export function generate (context, tweak) {
  return function render ({disableAnimation, step}) {}
}
```

* `generate(context, tweak)` gets called with:
  * `context`, the canvas context, use it in `render()`
  * `tweak`, the `tweak` object
* `render({disableAnimation, step})` gets called with:
  * `disableAnimation` (bool, default: false), the frontend can tell you not to draw step by step
  * `step` (int), which step to render, starts at 0 and increments on requestAnimationFrame, use it to animate the drawing

Take a look at the code and comments in the [minimal](https://draft.li/plotwork/#/plots/minimal.js) plot example, [`minimal.js`](/plots/minimal.js).

## Future Plans

* Presets: a way of exporting the `tweak` object and to quickly recall it. It would be something like "saving" the result of having tweaked things.
* Full export: I'm thinking about writing the full source of the `.js` file together with the tweaked chosen values right into the exported SVG file, in a big `<!--XML comment-->`. It might be interesting for archival/reproducibility.
* Try to add examples using [Paper.js](http://paperjs.org/) and other libs.
* Go back to actually create some generative/procedural art instead of building this, that's been enough of yak shaving for now.

## How to use this

Clone this repo.

## Running the project

``` bash
# install dependencies
yarn

# serve with hot reload at localhost:8080
npm run dev
```

## Inspiration / Thanks

* My main inspiration for this software is [penplot](https://github.com/mattdesl/penplot) by [@mattdesl](https://github.com/mattdesl) ([website](https://www.mattdesl.com/)). I wanted a tweakable version of his amazingly fun tool.
* I discovered [apparatus.generated.space](http://apparatus.generated.space/) by [@kgolid](https://github.com/kgolid) a few days before releasing this project. If only I knew about [dat.gui](https://github.com/dataarts/dat.gui) before creating this…
* Shout out to [@inconvergent](https://github.com/inconvergent/), whose [work](https://inconvergent.net/) keeps my inspired.

## License

[![AGPLv3 License](https://img.shields.io/badge/license-AGPLv3-blue.svg?style=flat-square)](http://www.fsf.org)
 This project is licensed under AGPLv3. You can read it in the [LICENSE](/LICENSE) file.
