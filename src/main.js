// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import {basename} from 'path'

import App from '@/App'
import router from '@/router'

require('@fortawesome/fontawesome')
require('sierra-library')
require('@/assets/generic.scss')

Vue.use(VueResource)

Vue.config.productionTip = false

const context = [
  require.context('../_plots/', false, /\.js$/),
  require.context('../plots/', false, /\.js$/)
]
export const plots = context
  .map(ctx =>
    ctx.keys()
      .map((filename) => ({
        filename: basename(filename),
        exported: ctx(filename)
      }))
      .filter(plot => plot.exported.DISABLED !== true))
  .reduce((acc, plot) => acc.concat(plot), [])

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
