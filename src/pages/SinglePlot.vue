<template>
  <div>
    <button
      class="controls-opener button button--small block-mobile"
      @click="controls = !controls">
      &#xF00D;
    </button>
    <div class="row">
      <div
        :class="{
          'col-sm-9': controls,
          'canvas-controls-open': controls,
          'col-sm-12': !controls
        }"
        class="canvas-container">
        <canvas id="canvas"/>
      </div>

      <div
        v-if="controls"
        class="controls-container col-sm-3">

        <p>
          <button
            class="button button--small block-mobile export-button"
            @click="svg">
            <span>
              SVG
            </span>
          </button>
        </p>

        <p v-show="plot.animate">
          <bool
            v-model="drawArgs.disableAnimation"
            :invert="Boolean(true)"
            label="animate"
            @change="renderer.animationToggle()"/>
          <bool
            v-model="renderer.running"
            label="running"/>
          <button
            :disabled="Boolean(renderer.disableAnimation && !renderer.running)"
            class="button block-mobile"
            @click="step">
            step
          </button>
        </p>

        <Json v-model="tweak"/>

        <div
          v-for="(value, name) of tweak"
          :key="name">
          <div v-if="isRange(name)">
            <p
              v-if="tweakMetadata[name] && tweakMetadata[name].range">
              {{ getLabel(name) }}
              <VueSlider
                v-model="tweak[name]"
                :min="tweakMetadata[name].range[0]"
                :max="tweakMetadata[name].range[1]"
                tooltip-dir="bottom"/>
            </p>
            <p
              v-else>
              {{ getLabel(name) }}
              <VueSlider
                v-model="tweak[name]"
                :min="0"
                :max="Math.max(100, tweak[name])"
                tooltip-dir="bottom"/>
            </p>
          </div>
          <div v-else-if="isBoolean(name)">
            <bool
              v-model="tweak[name]"
              :label="getLabel(name)"/>
          </div>
          <div v-else-if="isString(name)">
            <label>
              {{ getLabel(name) }}
            </label>
            <p class="input">
              <input
                v-model="tweak[name]"
                type="text">
            </p>
            <button
              v-if="name === 'seed' && plot.animate"
              class="button block-mobile"
              @click="restart()">
              <span>
                restart!
              </span>
            </button>
          </div>
          <div v-else-if="isNumber(name)">
            <p>
              {{ getLabel(name) }}

              <VueSlider
                v-if="tweakMetadata && tweakMetadata[name] && tweakMetadata[name].max"
                v-model="tweak[name]"
                :min="tweakMetadata[name].min"
                :max="tweakMetadata[name].max"
                tooltip-dir="bottom"/>
              <input
                v-else
                v-model="tweak[name]"
                type="number">

              <button
                v-if="name === 'seed' && plot.animate"
                @click="restart()">
                restart!
              </button>
            </p>
          </div>
          <div v-else>
            No control:
            {{ name }}: {{ value }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'cash-dom'
import is from '@sindresorhus/is'
import VueSlider from 'vue-slider-component'
import _find from 'lodash/find'
import Bool from '@/components/controls/Bool.vue'
import Json from '@/components/controls/Json.vue'
import Renderer from '@/lib/renderer'
import {plots} from '@/main.js'

export default {
  name: 'SinglePlot',
  components: {
    VueSlider,
    Bool,
    Json
  },
  props: {
    filename: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      drawArgs: {},
      renderer: {plot: {}},
      canvas: null,
      context: null,
      plot: {},
      seed: null,
      tweak: {},
      tweakMetadata: {},
      controls: true
    }
  },
  watch: {
    filename () {
      this.init()
    },
    tweak: {
      handler () {
        Object.assign(this.plot.tweak, this.tweak)
        this.restart()
      },
      deep: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const plot = _find(plots, {filename: this.filename})
      if (!plot) return this.$router.push('/404')
      this.plot = plot.exported
      this.canvas = document.getElementById('canvas')
      this.renderer = new Renderer({
        plot: this.plot,
        canvas: this.canvas,
        name: this.filename,
        width: 900,
        height: 900
      })
      this.tweak = this.plot.tweak
      this.tweakMetadata = this.plot.tweakMetadata || {}
      this.tweak.seed = this.tweak.seed || (Math.floor(Date.now() * Math.random())).toString(16)
      this.$nextTick(() => {
        this.resize(true)
        window.addEventListener('resize', this.resize)
      })
    },
    render () {
      this.drawArgs = this.renderer.drawArgs
      this.renderer.clear()
      this.renderer.render()
    },
    restart () {
      this.renderer.clear()
      this.renderer.drawArgs.step = 0
      this.renderer.start()
      this.renderer.render()
    },
    step () {
      this.renderer.step()
    },
    svg () {
      this.renderer.svg()
    },
    resize (force = false) {
      if (!force && this.renderer.running) return

      const offset = $('.export-button').offset() || {}
      $('.controls-opener').css({top: `${offset.top}px`})

      const windowHeight = window.innerHeight
      const windowWidth = window.innerWidth
      const windowAspect = windowWidth / windowHeight
      const displayPadding = 40
      const aspect = 1
      let width, height
      if (windowAspect > aspect) {
        height = windowHeight - displayPadding * 2
        width = height * aspect
      } else {
        width = windowWidth - displayPadding * 2
        height = width / aspect
      }
      this.renderer.height = height
      this.renderer.width = width
      this.restart()
    },
    isRange (name) {
      if (Array.isArray(this.tweak[name]) && this.tweak[name].length === 2) return true
      if (!this.tweakMetadata[name]) return false
      if (!Array.isArray(this.tweakMetadata[name].range)) return false
      if (this.tweakMetadata[name].range.length !== 2) return false
      return true
    },
    isBoolean (name) {
      if (is.boolean(this.tweak[name])) return true
      if (!this.tweakMetadata[name]) return false
      if (is.boolean(this.tweakMetadata[name])) return true
      return false
    },
    isString (name) {
      if (is.string(this.tweak[name])) return true
      if (!this.tweakMetadata[name]) return false
      if (is.string(this.tweakMetadata[name])) return true
      return false
    },
    isNumber (name) {
      if (is.number(this.tweak[name])) return true
      if (!this.tweakMetadata[name]) return false
      if (is.number(this.tweakMetadata[name])) return true
      return false
    },
    getLabel (name) {
      if (name === 'seed' && !this.tweakMetadata['seed']) {
        return 'Seed: '
      }
      if (this.tweakMetadata[name] && this.tweakMetadata[name].label) {
        return this.tweakMetadata[name].label
      }
      return name
    }
  }
}
</script>

<style lang="scss" scoped>
.canvas-container {
  text-align: center;
  height: 100%;
  vertical-align: bottom;
  margin: 2em auto 0 auto;
  overflow: hidden;
}
// .canvas-controls-open {
//   text-align: right;
//   padding-right: 0;
// }

.controls-container {
  background-color: rgba(52, 73, 94, 1);
  padding: 2em 40px 20px 20px;
  min-height: 100vh;
}

.controls-container p {
  margin-bottom: 40px;
}

.controls-opener {
  z-index: 100;
  position: fixed;
  right: 20px;
  font-family: FontAwesome;
}
</style>
