// Initial version of this file was mostly based on https://github.com/mattdesl/penplot
// The MIT License (MIT) Copyright (c) 2016 Matt DesLauriers
import seedRandom from 'seed-random'
import SimplexNoise from 'simplex-noise'

class Rnd {
  constructor (seed, opt) {
    if (typeof seed === 'number' || typeof seed === 'string') {
      this.seed = seed
      this.random = seedRandom(seed, opt)
    } else {
      this.random = () => Math.random()
    }
    this.simplex = new SimplexNoise(this.random)
  }

  noise2D (x, y) {
    return this.simplex.noise2D(x, y)
  }

  noise3D (x, y, z) {
    return this.simplex.noise3D(x, y, z)
  }

  noise4D (x, y, z, w) {
    return this.simplex.noise4D(x, y, z, w)
  }

  shuffle (arr) {
    if (!Array.isArray(arr)) {
      throw new TypeError('Expected Array, got ' + typeof arr)
    }

    var rand
    var tmp
    var len = arr.length
    var ret = arr.slice()
    while (len) {
      rand = Math.floor(this.random() * len--)
      tmp = ret[len]
      ret[len] = ret[rand]
      ret[rand] = tmp
    }
    return ret
  }

  random () {
    return this.random()
  }

  randomAngle (limit) {
    // non-linear distribution
    const nonUniformNorm = Math.pow(Math.abs(limit), 3)
    let val = 0
    while ((val === 0) || (this.random() < (Math.pow(Math.abs(val), 3) / nonUniformNorm))) {
      val = this.randomFloat(-limit, +limit)
    }
    return val
  }

  randomSign () {
    return this.random() > 0.5 ? 1 : -1
  }

  randomBool () {
    return this.random() > 0.5
  }

  randomFloat (min, max) {
    if (typeof max === 'undefined') {
      max = min
      min = 0
    }

    if (typeof min !== 'number' || typeof max !== 'number') {
      if (typeof max === 'undefined') {
        throw new TypeError('Expected min to be a number')
      }
      throw new TypeError('Expected all arguments to be numbers')
    }

    return this.random() * (max - min) + min
  }

  randomInt (min, max) {
    if (typeof max === 'undefined') {
      max = min
      min = 0
    }

    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new TypeError('Expected all arguments to be numbers')
    }

    return Math.floor(this.randomFloat(min, max))
  }

  // uniform distribution in a 2D circle
  randomCircle (out, scale = 1) {
    var r = this.random() * 2.0 * Math.PI
    out[0] = Math.cos(r) * scale
    out[1] = Math.sin(r) * scale
    return out
  }

  // uniform distribution in a 3D sphere
  randomSphere (out, scale = 1) {
    var r = this.random() * 2.0 * Math.PI
    var z = (this.random() * 2.0) - 1.0
    var zScale = Math.sqrt(1.0 - z * z) * scale
    out[0] = Math.cos(r) * zScale
    out[1] = Math.sin(r) * zScale
    out[2] = z * scale
    return out
  }

  // uniform distribution of quaternion rotations
  randomQuaternion (out) {
    const u1 = this.random()
    const u2 = this.random()
    const u3 = this.random()

    const sq1 = Math.sqrt(1 - u1)
    const sq2 = Math.sqrt(u1)

    const theta1 = Math.PI * 2 * u2
    const theta2 = Math.PI * 2 * u3

    const x = Math.sin(theta1) * sq1
    const y = Math.cos(theta1) * sq1
    const z = Math.sin(theta2) * sq2
    const w = Math.cos(theta2) * sq2
    out[0] = x
    out[1] = y
    out[2] = z
    out[3] = w
    return out
  }
}

export default Rnd
