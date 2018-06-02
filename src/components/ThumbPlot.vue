<template>
  <router-link :to="{ name: 'SinglePlot', params: { filename: plot.filename }}">
    <h2>
      {{ plot.filename }}
    </h2>
    <canvas/>
  </router-link>
</template>

<script>
import Renderer from '@/lib/renderer'

export default {
  name: 'ThumbPlot',
  props: {
    plot: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      canvas: null,
      context: null
    }
  },
  created () {},
  mounted () {
    this.canvas = Array.from(this.$el.querySelectorAll('canvas')).filter(x => x.nodeName === 'CANVAS')[0]
    const renderer = new Renderer({
      plot: this.plot.exported,
      canvas: this.canvas,
      width: 125,
      height: 125
    })
    renderer.drawArgs.disableAnimation = true
    renderer.render()
  }
}
</script>
