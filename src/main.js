// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

// <div class="tag" v-for="day in month" :month_id="day.month-1" v-bind:key="day.id" ref="tag" v-bind:id="day['id']"
// v-bind:style="cats[day.cat_id].style"
// @click='mouse_on_day'>
//  {{ day['day'] }} {{ day['weekday'].substring(0,2) }} {{ day['name']}}
// </div>
