import Vue from 'vue'
import Router from 'vue-router'
import Urlaubskalender from '@/components/Urlaubskalender'
import login from '@/components/login'
import sharedCal from '@/components/sharedCal'
import createSharedCal from '@/components/createSharedCal'
import calOverview from '@/components/calOverview'
import calSync from '@/components/calSync'
import editShared from '@/components/editShared'
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
        if (!store.getters.isAuthenticated) {
          next('/login')
        } else {
          next('/calOverview')
        }
      }
    },
    { path: '/calender/:calID/:year',
      name: 'Urlaubskalender2',
      component: Urlaubskalender,
      props: true,
      beforeEnter (to, from, next) {
        console.log("hey")
        next()
        if (!store.getters.isAuthenticated) {
          next('/login')
        } else {
          next()
        }
      }
    },
    { path: '/shared/:calID',
      name: 'sharedCal',
      component: sharedCal,
      props: true,
      beforeEnter (to, from, next) {
        console.log("hey")
        next()
        if (!store.getters.isAuthenticated) {
          next('/login')
        } else {
          next()
        }
      }
    },
    { path: '/editShared/:calID',
      name: 'editShared',
      component: editShared,
      props: true,
      beforeEnter (to, from, next) {
        next()
        if (!store.getters.isAuthenticated) {
          next('/login')
        } else {
          next()
        }
      }
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/createSharedCal',
      name: 'createSharedCal',
      component: createSharedCal,
      props: true,
      beforeEnter (to, from, next) {
        next()
        if (!store.getters.isAuthenticated) {
          next('/login')
        } else {
          next()
        }
      }
    },
    { path: '/calOverview',
      name: 'calOverview',
      component: calOverview,
      beforeEnter (to, from, next) {
        next()
        if (!store.getters.isAuthenticated) {
          next('/login')
        } else {
          next()
        }
      }
    },
    { path: '/calSync',
      name: 'calSync',
      component: calSync,
      beforeEnter (to, from, next) {
        next()
        if (!store.getters.isAuthenticated) {
          next('/login')
        } else {
          next()
        }
      }
    },

  ]
})
