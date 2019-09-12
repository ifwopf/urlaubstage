import Vue from 'vue'
import Router from 'vue-router'
import Urlaubskalender from '@/components/Urlaubskalender'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Urlaubskalender',
      component: Urlaubskalender
    }
  ]
})
