<template>
  <div>
    <a href="https://github.com/vhf/plotwork"><img
      style="position: absolute; top: 0; left: 0; border: 0;"
      src="https://s3.amazonaws.com/github/ribbons/forkme_left_darkblue_121621.png"
      alt="Fork me on GitHub"></a>
    <div class="container">
      <div class="row">
        <div
          v-for="(plot, idx) in plots"
          :key="idx"
          class="col-xs-6 col-md-3 col-lg-2 align-center thumb-plot">
          <thumb-plot :plot="plot"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ThumbPlot from '@/components/ThumbPlot'
import {plots} from '@/main.js'

export default {
  name: 'Plots',
  components: {
    ThumbPlot
  },
  data () {
    return {
      plots: []
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.plots = plots
    }
  }
}
</script>

<style lang="scss">
.thumb-plot {
  margin-top: 30px;
}
</style>
