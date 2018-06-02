import Vue from 'vue'
import Router from 'vue-router'
import NotFound from '@/pages/NotFound'
import Plots from '@/pages/Plots'
import SinglePlot from '@/pages/SinglePlot'

Vue.use(Router)

const routes = [{
  path: '/',
  name: 'Plots',
  component: Plots
}, {
  path: '/plots/:filename',
  name: 'SinglePlot',
  component: SinglePlot
}, {
  path: '/plots/*',
  redirect: '/'
}, {
  path: '/404',
  component: NotFound
}, {
  path: '*',
  redirect: '/404'
}]

routes.forEach((route) => {
  route.props = true
})

export default new Router({routes})
