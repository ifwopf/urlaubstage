import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueInputAutowidth from 'vue-input-autowidth'

// imports of AJAX functions will go here
import { authenticate, register } from '@/api'
import { isValidJwt, EventBus } from '@/utils'
import router from '@/router'

Vue.use(Vuex)
Vue.use(VueInputAutowidth)
//const backendURL = "http://127.0.0.1:5000tztr"
const backendURL = "https://urlaubskalender.herokuapp.com"

function compare (a, b) {
  if (a.day < b.day) {
    return -1
  }
  if (a.day > b.day) {
    return 1
  }
  return 0
}

export default new Vuex.Store(
  {
    state: {
      user: {},
      jwt: {'token': localStorage.getItem('token')},
      info: null,
      cats: null,
      cat_count: {},
      catMap: [],
      element_map: {},
      dataReady: false,
      dayBox: false,
      catEditBox: false,
      clicked: [],
      catColor: 'rgb(255, 255, 255)',
      clickedCatCounter: null,
      clickedCatName: '',
      border: false,
      locked: false,
      weekday: {
        'Montag': 1,
        'Dienstag': 2,
        'Mittwoch': 3,
        'Donnerstag': 4,
        'Freitag': 5,
        'Samstag': 6,
        'Sonntag': 7
      }
    },
    mutations: {
      mapElement (state, payload) {
        state.element_map[payload.id] = state.info[payload.month][payload.day]
      },
      set_info (state, infoed) {
        state.info = infoed
        for (var i = 0; i < 12; i++) {
          var row = 2
          var count = 1
          state.info[i].sort(compare)
          for (var day in state.info[i]) {
            if (state.info[i][day].day === 1) {
              count = state.weekday[state.info[i][day].weekday]
            }
            state.element_map[state.info[i][day].id] = state.info[i][day]
            state.info[i][day].clicked = false
            state.info[i][day].style = {
              'grid-column-start': state.weekday[state.info[i][day].weekday],
              'grid-row-start': row,
              'border-style': 'solid',
            }
            if (count % 7 === 0) {
              row += 1
            }
            count += 1
            state.cat_count[state.info[i][day].cat_id] += 1
          }
        }
      },
      set_cats (state, catsed) {
        state.cats = catsed
        var count = 0
        for (var key in state.cats) {
          state.cat_count[key] = 0
          state.catMap[count] = parseInt(key)
          count += 1
        }
      },
      set_dataReady (state, toggle) {
        state.dataReady = toggle
      },
      setClicked (state, dayID) {
        Vue.set(state.element_map[dayID], 'clicked', true);
        Vue.set(state.element_map[dayID],'id', 0)
        Vue.set(state.element_map[dayID],'id', dayID)
        state.clicked.push(state.element_map[dayID])
      },
      resetClicked (state) {
        for (var index = 0; index < state.clicked.length; index++) {
          var id  = state.clicked[index].id
          Vue.set(state.element_map[id], 'clicked', false);
          Vue.set(state.element_map[id],'id', 0)
          Vue.set(state.element_map[id],'id', id)
        }
        state.clicked = []
        //state.clickedCatCounter = null
        state.clickedCat = []
        state.border = false
        state.edit = false
        state.dayBox = false
      },
      removeClicked (state, payload){
        Vue.set(state.element_map[payload['id']], 'clicked', false);
        state.clicked.splice(payload['index'], 1)
        state.clickedCat.splice(payload['indey'], 1)
        Vue.set(state.element_map[payload['id']],'id', 0)
        Vue.set(state.element_map[payload['id']],'id', payload['id'])
      },
      setClickedCat (state, dayID) {
        state.clickedCat.push(state.cats[state.element_map[dayID].cat_id])
      },
      setClickedCatCounter (state, catID){
        state.clickedCatCounter = catID
        state.catColor = state.cats[catID].style['background-color']
      },
      setCatColor (state, color){
        state.catColor = color
      },
      setClickedCatName (state, catName) {
        state.clickedCatName = catName
      },
      changeClickedCat (state, cat) {
        var count = state.clickedCat.length;
        for(var i = 0; i < count; i++) {
          state.cat_count[state.clickedCat[i].id] -= 1
          Vue.set(state.clickedCat, i, cat)
          state.cat_count[cat.id] += 1
          state.clicked[i].cat_id = cat.id
        }
      },
      editCat (state, payload) {
        state.cats[state.clickedCat[0].id].style['background-color'] = payload.color
        state.cats[state.clickedCat[0].id].name = payload.name
      },
      editCatColor (state, payload) {
        state.cats[payload.id].style['background-color'] = payload.catColor
      },
      editCatName (state, payload) {
        state.cats[payload.id].name = payload.name
      },
      addCat (state, newCat) {
        state.cat_count[newCat.id] = 0
        state.cats[newCat.id] = newCat
        for(var i = 0; i< state.clicked.length; i++){
          state.cat_count[state.clicked[i].cat_id] -= 1
          state.cat_count[newCat.id] += 1
          state.clicked[i].cat_id = newCat.id
          state.clickedCat[i] = newCat
        }
        state.catMap[state.catMap.length] = newCat.id
        state.border = false
      },
      alterCatRefs (state, payload) {
        state.info[payload.month][payload.day]['cat_id'] = 1
        state.cat_count[1] += 1
      },
      deleteCat (state, catID) {
        Vue.delete(state.cat_count, catID)
        Vue.delete(state.cats, catID)
        var index = state.catMap.indexOf(catID)
        if (index > -1) {
          state.catMap.splice(index, 1)
        }
        state.clickedCat[0] = state.cats[1]
      },
      setDayBox (state) {
        state.dayBox = true
      },
      showCatEdit (state) {
        state.catEditBox = true
      },
      hideCatEdit (state) {
        state.catEditBox = false
        state.border = false
      },
      setBorder (state, border) {
        state.border = border
      },
      setUserData (state, payload) {
        state.userData = payload.userData
      },
      setJwtToken (state, payload) {
        localStorage.token = payload.jwt.token
        state.jwt = payload.jwt
      },
      toggleLock(state) {
        if(state.locked){
          state.locked = false
        }
        else{
          state.locked = true
        }
      }
    },
    actions: {
      login (context, userData) {
        context.commit('setUserData', { userData })
        return authenticate(userData)
          .then(response => context.commit('setJwtToken', { jwt: response.data }))
          .catch(error => {
            console.log('Error Authenticating: ', error)
            EventBus.$emit('failedAuthentication', error)
          })
      },
      logout (context) {
        context.commit('setJwtToken', { jwt: {token: null} })
        router.go('/')
      },
      register (context, userData) {
        context.commit('setUserData', { userData })
        return register(userData)
          .then(context.dispatch('login', userData))
          .catch(error => {
            console.log('Error Registering: ', error)
            EventBus.$emit('failedRegistering: ', error)
          })
      },
      ready ({ commit, state, jwt }, year) {
        console.log(year)
        if(year === undefined){
          year = "2020"
        }
        var yearstring = backendURL + '/urlaub/api/v1.0/days/' + year
        axios.get(yearstring, { headers: { Authorization: `Bearer: ${state.jwt.token}` } })
          //.then(response => response.json())
          .then((response) => {
            commit('set_cats', response.data['cats'])
            commit('set_info', response.data['days'])
            commit('set_dataReady', true)
          })
      },
      editCatDisplay ({commit, dispatch, state}){
        commit('setBorder', true)
      },
      changeCat ({commit, state}, index) {
        commit('changeClickedCat', state.cats[state.catMap[index]])
        axios.post(backendURL + 'urlaub/api/v1.0/change_cat', {
          cat_id: state.clickedCat[0].id,
          days: state.clicked
        },{headers: { Authorization: `Bearer: ${state.jwt.token}` }})
          .then(function (response) {
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      changeCatDropDown ({commit, state}, catID) {
        commit('changeClickedCat', state.cats[catID])
        axios.post(backendURL + '/urlaub/api/v1.0/change_cat',  {
          cat_id: catID,
          days: state.clicked,

        }, {headers: { Authorization: `Bearer: ${state.jwt.token}` }})
          .then(function (response) {
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      editCat ({commit, state}, payload) {
        commit('editCat', payload)
        axios.post(backendURL + '/urlaub/api/v1.0/editCat', {
          catId: state.clickedCat[0].id,
          catColor: payload.color,
          catName: payload.name
        },{headers: { Authorization: `Bearer: ${state.jwt.token}` }})
          .then(function (response) {
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      changeCatName({commit, state}, payload) {
        commit('editCatName', payload)
        axios.post(backendURL + '/urlaub/api/v1.0/editCatName', {
          catId: payload.id,
          catName: payload.name
        },{headers: { Authorization: `Bearer: ${state.jwt.token}` }})
          .then(function (response) {

          })
          .catch(function (error) {
            console.log(error)
          })
      },
      changeCatColor({commit, state}, payload) {
        commit('editCatColor', payload)
        axios.post(backendURL + '/urlaub/api/v1.0/editCatColor', {
          catId: payload.id,
          catColor: payload.catColor
        },{headers: { Authorization: `Bearer: ${state.jwt.token}` }})
          .then(function (response) {

          })
          .catch(function (error) {
            console.log(error)
          })
      },
      setClicked({commit, state}, dayID){
        commit('setClicked', dayID)
        commit('setClickedCat', dayID)
        commit('setDayBox')
      },
      resetClicked({commit, state}){
        commit('resetClicked')
      },
      removeClicked({commit, state}, dayID){
        var index = state.clicked.indexOf(state.element_map[dayID])
        if(state.clicked.length === 1){
          commit('resetClicked')
        }
        else{
          var payload = {}
          payload['index'] = index
          payload['id'] = dayID
          commit('removeClicked', payload)
        }
      },
      addCat ({commit, state}, payload) {
        axios.post(backendURL + '/urlaub/api/v1.0/add_cat', {
          cat_name: payload.catName,
          cat_color: payload.catColor,
          clicked: state.clicked
        },{headers: { Authorization: `Bearer: ${state.jwt.token}` }})
          .then(function (response) {
            commit('addCat', response.data)
            commit('setBorder', false)
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      deleteCat ({commit, state}, catID) {
        axios.post(backendURL + '/urlaub/api/v1.0/deleteCat', {
          catID: catID
        },{headers: { Authorization: `Bearer: ${state.jwt.token}` }})
          .then(function (response) {
            for (var i = 0; i < 11; i++) {
              for (var j = 0; j < state.info[i].length; j++) {
                if (state.info[i][j]['cat_id'] === catID) {
                  var payload = {'month': i, 'day': j}
                  commit('alterCatRefs', payload)
                }
              }
            }
            commit('deleteCat', catID)
          })
          .catch(function (error) {
            console.log(error)
          })
      },

    },
    getters: {
      isAuthenticated (state) {
        return isValidJwt(state.jwt.token)
      },
      getCatByID: (state) => (id) => {
        return state.cats[id]
      },
      getCats: (state) => {
        return state.cats
      },
      getCatCount: (state) => (id) => {
        return state.cat_count[id]
      },
      getInfo: (state) => {
        return state.info
      },
      getElementMapByIDStyle: (state) => (id) => {
        return state.element_map[id].style
      },
      getDayBox: (state) => {
        return state.dayBox
      },
      getClicked: (state) => {
        return state.clicked.id
      },
      getClickedCat: (state) => {
        return state.clickedCat
      }
    }
  }
)

