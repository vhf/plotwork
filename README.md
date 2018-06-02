# plotwork

**plotwork** -- an experimental generative art framework enabling generative art experiments.

(The idea isn't new and I'm probably doing it wrong. I don't know the space, I didn't know what existed before building this. It works for me though.)

## Goal

This project is an interactive web interface to plot canvas drawings and control their variables dynamically.

## Features

* An overview of all plots, displaying them as thumbnails.
* Creating a new plot is as simple as dropping a JS file into a specific directory; plotwork automatically detects it and reloads.
* Displaying a single plot automatically renders a "control panel" allowing the user to change parameters and see the resulting plot in real-time.

## Creating a plot

Check out the source of the demo plot [`demo.js`](/plots/demo.js), or the minimal plot [`minimal.js`](/plots/minimal.js).

### Mandatory elements any plot should export

Taking a look at the [minimal example, `minimal.js`](/plots/minimal.js) might help. It only exports what needs to be exported, nothing else.

#### a. `tweak` object

```js
export const tweak = {seed: ''}
```

The `tweak` object is the "magical" part of this project. Nothing special in there, it leverages the fact that JavaScript object are passed by reference (they are in fact one of the [Reference types](https://www.ecma-international.org/ecma-262/5.1/#sec-8.7), aka *complex types* or *container types*).


to export things you want to tweak from the frontend,
// it can be modified by the frontend. It must contain a `seed` key with string value.
// When `tweak.seed` is the empty string, it will be assigned a random seed.


#### b. `dimensions` array

```js
export const dimensions = [40, 40]
```

#### c. `generate` function

```js
// generate() always gets call with:
// `context` is the canvas context, see how I use it in `render()`
// `tweak` is the above `tweak` object
export function generate (context, tweak) {
  return function render ({disableAnimation, step}) {}
}
```

## Running the project

``` bash
# install dependencies
yarn

# serve with hot reload at localhost:8080
npm run dev
```
