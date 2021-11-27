import Vue from 'vue'
import Router from 'vue-router'
const Home = require('@/views/Home').default
const ShortestPath = require('@/views/ShortestPath').default

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/ShortestPath',
      name: 'ShortestPath',
      component: ShortestPath
    }
  ]
})
