import Vue from 'vue'
import Router from 'vue-router'
const Home = require('@/views/Home').default
const ShortestPath = require('@/views/ShortestPath').default
const MST = require('@/views/MST').default
const MaxMatch = require('@/views/MaxMatch').default

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/ShortestPath',
      name: 'ShortestPath',
      component: ShortestPath
    },
    {
      path: '/MST',
      name: 'MST',
      component: MST
    },
    {
      path: '/MaxMatch',
      name: 'MaxMatch',
      component: MaxMatch
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
