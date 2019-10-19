import Vue from 'vue'
import Router from 'vue-router'
import Urlaubskalender from '@/components/Urlaubskalender'
import login from '@/components/login'
import store from '@/store'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Urlaubskalender',
      component: Urlaubskalender,

      beforeEnter (to, from, next) {
        console.log("hey")
        next()
        /*if (!store.getters.isAuthenticated) {
          next('/login')
        } else {
          next()
        }*/
      }
    },
    { path: '/year/:year',
      name: 'Urlaubskalender2',
      component: Urlaubskalender,
      props: true
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
  ]
})
