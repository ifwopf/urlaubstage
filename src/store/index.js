import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueInputAutowidth from 'vue-input-autowidth'

// imports of AJAX functions will go here
import {authenticate, register, addUnreg, deleteUser, removeUserFromShared} from '@/api'
import {isValidJwt, EventBus} from '@/utils'
import router from '@/router'

Vue.use(Vuex)
Vue.use(VueInputAutowidth)

//export const backendURL = 'http://127.0.0.1:5000'

export const backendURL = "https://urlaubskalender.herokuapp.com"

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
      currentUser: {},
      jwt: {'token': localStorage.getItem('token')},
      info: null,
      cats: null,
      cals: null,
      currentCal: null,
      cat_count: {},
      catMap: [],
      element_map: {},
      dataReady: false,
      calDataReady: false,
      sharedDataReady: false,
      dayBox: false,
      catEditBox: false,
      clicked: [],
      catColor: 'rgb(255, 255, 255)',
      clickedCatCounter: null,
      clickedCatName: '',
      clickedCat: [],
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
      },
      //sync
      sharedCats: {},
      personalCats: {},
      infotext: '',
      showinfo: false,
      showFeiertage: false,
      showCalSettingsBox: false,
      showDeleteBox: false,
      deleteText: "",
    },
    mutations: {
      /*
      mapElement (state, payload) {

        state.element_map[payload.id] = state.info[payload.month][payload.day]
      },*/
      set_info (state, infoed) {

        state.info = infoed
        state.element_map[state.currentUser] = {}
        for (var i = 0; i < 12; i++) {
          var row = 2
          var count = 1
          state.info[i].sort(compare)
          for (var day in state.info[i]) {
            if (state.info[i][day].day === 1) {
              count = state.weekday[state.info[i][day].weekday]
            }
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
            state.element_map[state.currentUser][state.info[i][day].id] = state.info[i][day]

            state.cat_count[state.info[i][day].cat_id] += 1
          }
        }
      },
      set_cats (state, catsed) {
        state.cats = catsed
        state.cats[0] = {
          'id': 0,
          'name': 'default',
          'value': 1,
          'style': {'background-color': '#fff'}
        }
        var count = 0
        for (var key in state.cats) {
          state.cat_count[key] = 0
          state.catMap[count] = parseInt(key)
          count += 1
        }
      },
      setCals (state, cals) {
        state.cals = cals
      },
      setSharedInfo (state, days) {
        state.sharedUserDays = days
        state.sharedUserDays.forEach(function (monat, index) {
          monat.forEach(function (user, jindex) {
            user.forEach(function (day, kindex) {
              Vue.set(day, 'clicked', false)
              Vue.set(state.element_map[day.userID], day.id, day)
              state.cat_count[day.cat_id] += 1
            })
          })
        })
      },
      setCurrentUser (state, userID) {
        state.currentUser = userID
      },
      setSharedName (state, sharedName) {
        state.sharedName = sharedName
      },
      setSharedUsers (state, users) {
        state.sharedUsers = users
        for (var user in state.sharedUsers) {
          state.element_map[state.sharedUsers[user][0]] = {}
        }
      },
      set_sharedDataReady (state, toggle) {
        state.sharedDataReady = toggle
      },
      set_dataReady (state, toggle) {
        state.dataReady = toggle
      },
      setCalDataReady (state, toggle) {
        state.calDataReady = toggle
      },
      setCurrentCal (state, calID) {
        state.currentCal = calID
      },
      setClicked (state, payload) {
        Vue.set(state.element_map[payload.uID][payload.dayID], 'clicked', true)
        Vue.set(state.element_map[payload.uID][payload.dayID], 'id', 0)
        Vue.set(state.element_map[payload.uID][payload.dayID], 'id', parseInt(payload.dayID))
        state.clicked.push(state.element_map[payload.uID][payload.dayID])
      },
      resetClicked (state) {
        for (var index = 0; index < state.clicked.length; index++) {
          var id = state.clicked[index].id
          var userID = state.clicked[index].userID
          Vue.set(state.element_map[userID][id], 'clicked', false)
          Vue.set(state.element_map[userID][id], 'id', 0)
          Vue.set(state.element_map[userID][id], 'id', id)
        }
        state.clicked = []
        //state.clickedCatCounter = null
        state.clickedCat = []
        state.border = false
        state.edit = false
        state.dayBox = false
      },
      removeClicked (state, payload) {
        Vue.set(state.element_map[payload['userID']][payload['id']], 'clicked', false)
        state.clicked.splice(payload['index'], 1)
        state.clickedCat.splice(payload['index'], 1)
        Vue.set(state.element_map[payload['userID']][payload['id']], 'id', 0)
        Vue.set(state.element_map[payload['userID']][payload['id']], 'id', payload['id'])
      },
      setClickedCat (state, payload) {
        state.clickedCat.push(state.cats[state.element_map[payload.uID][payload.dayID].cat_id])
      },
      setClickedCatCounter (state, catID) {
        state.clickedCatCounter = catID
        state.catColor = state.cats[catID].style['background-color']
      },
      setCatColor (state, color) {
        state.catColor = color
      },
      setClickedCatName (state, catName) {
        state.clickedCatName = catName
      },
      changeClickedCat (state, cat) {
        var count = state.clickedCat.length
        for (var i = 0; i < count; i++) {
          state.cat_count[state.clickedCat[i].id] -= 1
          Vue.set(state.clickedCat, i, cat)
          state.cat_count[cat.id] += 1
          state.clicked[i].cat_id = cat.id
        }
      },
      addNotes (state, note) {
        for (var i = 0; i < state.clicked.length; i++) {
          Vue.set(state.clicked[i], 'note', note)
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
        for (var i = 0; i < state.clicked.length; i++) {
          state.cat_count[state.clicked[i].cat_id] -= 1
          state.cat_count[newCat.id] += 1
          state.clicked[i].cat_id = newCat.id
          state.clickedCat[i] = newCat
        }
        state.catMap[state.catMap.length] = newCat.id
        state.border = false
      },
      alterCatRefs (state, payload) {
        state.info[payload.month][payload.day]['cat_id'] = 0
        state.cat_count[0] += 1
      },
      setToDefaultCat (state, payload) {
        Vue.set(state.element_map[state.currentUser][payload], 'cat_id', 0)
        Vue.set(state.cat_count, 0, state.cat_count[0] + 1)
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
      toggleLock (state) {
        if (state.locked) {
          state.locked = false
        }
        else {
          state.locked = true
        }
      },
      replaceUserdayID (state, payload) {
        Object.keys(payload).forEach(function (key) {
          state.element_map[payload[key].userID][key].userdayID = payload[key].userdayID
        })
      },
      //SHARED
      //sync
      setPersonalCats (state, cats) {
        state.personalCats = cats
      },
      setSharedCats (state, cats) {
        state.sharedCats = cats
      },
      setInfoText (state, text) {
        state.infotext = text
        state.showinfo = true
      },
      removeInfo (state) {
        state.showinfo = false
      },
      setDeleteBox (state, text) {
        state.deleteText = text
        state.showDeleteBox = true
      },
      removeDeleteBox (state) {
        state.deleteText = ""
        state.showDeleteBox = false
      },
      showFeiertage (state) {
        state.showFeiertage = true
      },
      removeFeiertage (state) {
        state.showFeiertage = false
      },
      showCalSettingsBox (state) {
        state.showCalSettingsBox = true
      },
      removeCalSettingsBox (state) {
        state.showCalSettingsBox = false
      }

    },
    actions: {
      login (context, userData) {
        context.commit('setUserData', {userData})
        return authenticate(userData)
          .then(response => context.commit('setJwtToken', {jwt: response.data}))
          .catch(error => {
            console.log('Error Authenticating: ', error)
            EventBus.$emit('failedAuthentication', error)
          })
      },
      logout (context) {
        context.commit('setJwtToken', {jwt: {token: null}})
        router.go('/')
      },
      register ({commit, dispatch, state}, data) {
        var userData = {email: data['email'], password: data['password']}
        commit('setUserData', userData)
        return register(userData)
          .then(res => {
            if (res.data === 999) {
              commit('setInfoText', 'Email bereits vorhanden')
            }
            else {
              dispatch('login', userData)
                .then(res => {
                    if (data['years'] != null) {
                      return addUnreg({years: data['years'], cats: data['cats']}, state.jwt.token)
                        .then(res => {
                          console.log("222hererewdsfdsf")
                          return "ok"
                          })
                        .catch(error => {
                          console.log('Error Login: ', error)
                        })
                    }
                    else{
                      console.log("hererew")
                      return "ok"
                    }
                  }
                ).catch(error => {
                console.log('Error Login: ', error)
              })
                .catch(error => {
                  console.log('Error Registering: ', error)
                  EventBus.$emit('failedRegistering: ', error)
                })
            }
          })
      },
      ready ({commit, state, jwt}, data) {
        if (data[1] === undefined) {
          data[1] = '2020'
        }
        var yearstring = backendURL + '/urlaub/api/v1.0/days/' + data[0] + '/' + data[1]
        axios.get(yearstring, {headers: {Authorization: `Bearer: ${state.jwt.token}`}})
        //.then(response => response.json())
          .then((response) => {
            commit('setCurrentUser', response.data['user'])
            commit('set_cats', response.data['cats'])
            commit('set_info', response.data['days'])
            commit('set_dataReady', true)
            commit('setCurrentCal', data[0])
          })
      },
      readyUnreg ({commit, state, jwt}, data) {
        if (data === undefined) {
          data = '2020'
        }
        var yearstring = backendURL + '/urlaub/api/v1.0/daysUnreg/' + data
        axios.get(yearstring, {headers: {Authorization: `Bearer: ${state.jwt.token}`}})
        //.then(response => response.json())
          .then((response) => {
            //commit('setCurrentUser', response.data['user'])
            commit('set_cats', response.data['cats'])
            commit('set_info', response.data['days'])
            commit('set_dataReady', true)
            //commit('setCurrentCal', data[0])
          })
      },
      calReady ({commit, state, jwt}) {
        var calstring = backendURL + '/urlaub/api/v1.0/cal'
        axios.get(calstring, {headers: {Authorization: `Bearer: ${state.jwt.token}`}})
        //.then(response => response.json())
          .then((response) => {
            commit('setCals', response.data)
            commit('setCalDataReady', true)
          })
      },
      sharedReady ({commit, state, jwt}, payload) {
        if (payload[1] === undefined) {
          payload[1] = '2020'
        }
        var yearstring = backendURL + '/urlaub/api/v1.0/shared/' + payload[0] + '/' + payload[1]
        axios.get(yearstring, {headers: {Authorization: `Bearer: ${state.jwt.token}`}})
        //.then(response => response.json())
          .then((response) => {
            commit('setCurrentCal', payload[0])
            commit('setCurrentUser', response.data[4])
            commit('setSharedName', response.data[0])
            commit('setSharedUsers', response.data[1])
            commit('setSharedInfo', response.data[2])
            commit('set_cats', response.data[3])
            commit('set_sharedDataReady', true)
          })
      },
      editCatDisplay ({commit, dispatch, state}) {
        commit('setBorder', true)
      },
      changeCatDropDown ({commit, state}, catID) {
        commit('changeClickedCat', state.cats[catID])
        axios.post(backendURL + '/urlaub/api/v1.0/change_cat', {
          cat_id: catID,
          days: state.clicked,
          calID: state.currentCal
        }, {headers: {Authorization: `Bearer: ${state.jwt.token}`}})
          .then(function (response) {
            commit('replaceUserdayID', response.data)
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      changeCat ({commit, state}, catID) {
        commit('changeClickedCat', state.cats[catID])
        return 'Yeah'
      },
      addNote ({commit, state}, note) {
        commit('addNotes', note)
        axios.post(backendURL + '/urlaub/api/v1.0/addNote', {
          note: note,
          days: state.clicked,
          calID: state.currentCal
        }, {headers: {Authorization: `Bearer: ${state.jwt.token}`}})
          .then(function (response) {
            commit('replaceUserdayID', response.data)
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
        }, {headers: {Authorization: `Bearer: ${state.jwt.token}`}})
          .then(function (response) {
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      changeCatName ({commit, state}, payload) {
        commit('editCatName', payload)
        axios.post(backendURL + '/urlaub/api/v1.0/editCatName', {
          catId: payload.id,
          catName: payload.name
        }, {headers: {Authorization: `Bearer: ${state.jwt.token}`}})
          .then(function (response) {

          })
          .catch(function (error) {
            console.log(error)
          })
      },
      changeCatColor ({commit, state}, payload) {
        commit('editCatColor', payload)
        axios.post(backendURL + '/urlaub/api/v1.0/editCatColor', {
          catId: payload.id,
          catColor: payload.catColor
        }, {headers: {Authorization: `Bearer: ${state.jwt.token}`}})
          .then(function (response) {

          })
          .catch(function (error) {
            console.log(error)
          })
      },
      setClicked ({commit, state}, payload) {
        commit('setClicked', payload)
        commit('setClickedCat', payload)
        commit('setDayBox')
      },
      resetClicked ({commit, state}) {
        commit('resetClicked')
      },
      removeClicked ({commit, state}, payload) {
        var index = state.clicked.indexOf(state.element_map[payload.uID][payload.dayID])
        if (state.clicked.length === 1) {
          commit('resetClicked')
        }
        else {
          var pay2 = {}
          pay2['index'] = index
          pay2['userID'] = payload.uID
          pay2['id'] = payload.dayID
          commit('removeClicked', pay2)
        }
      },
      addCat ({commit, state}, payload) {
        axios.post(backendURL + '/urlaub/api/v1.0/add_cat', {
          cat_name: payload.catName,
          cat_color: payload.catColor,
          calID: state.currentCal,
          clicked: state.clicked
        }, {headers: {Authorization: `Bearer: ${state.jwt.token}`}})
          .then(function (response) {
            commit('addCat', response.data[0])
            commit('replaceUserdayID', response.data[1])
            commit('setBorder', false)
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      addCatUnreg ({commit, state}, payload) {
        var findID = true
        var newCatID = Object.keys(state.cats).length
        while (findID) {
          if (!(newCatID in state.cats)) {
            payload.id = newCatID
            findID = false
          }
          else {
            newCatID++
          }
        }
        commit('addCat', payload)
        commit('setBorder', false)
        return payload
      },
      deleteCal ({commit, state}, calID) {
        axios.post(backendURL + '/urlaub/api/v1.0/deleteCal', {
          calID: calID
        }, {headers: {Authorization: `Bearer: ${state.jwt.token}`}})
          .then(function (response) {
            router.push({name: 'calOverview'})
            location.reload()
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      deleteCat ({commit, state}, catID) {
        axios.post(backendURL + '/urlaub/api/v1.0/deleteCat', {
          catID: catID
        }, {headers: {Authorization: `Bearer: ${state.jwt.token}`}})
          .then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
              commit('setToDefaultCat', response.data[i])
            }
            commit('deleteCat', catID)
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      deleteCatUnreg ({commit, state}, catID) {
        for (var i = 0; i < 11; i++) {
          for (var j = 0; j < state.info[i].length; j++) {
            if (state.info[i][j]['cat_id'] === catID) {
              var payload = {'month': i, 'day': j}
              commit('alterCatRefs', payload)
            }
          }
        }
        commit('deleteCat', catID)
        return 'DeletedCat'
      },
      addCal ({commit, state}, calName) {
        axios.post(backendURL + '/urlaub/api/v1.0/addCal', {
          calName: calName
        }, {headers: {Authorization: `Bearer: ${state.jwt.token}`}})
          .then(function (response) {
            router.go('/calOverview')
          })
          .catch(function (error) {
            console.log(error)
          })
      },

      //SHARED
      createShared ({commit, state, jwt}, sharedValues) {
        axios.post(backendURL + '/urlaub/api/v1.0/createShared', {
          named: sharedValues.name,
          addedUsers: sharedValues.addedUsers
        }, {headers: {Authorization: `Bearer: ${state.jwt.token}`}})
          .then(function (response) {
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      removeUserFromShared ({state}, calID) {
        console.log(calID)
        return removeUserFromShared({"calID": calID}, state.jwt.token)
          .then(response => {
            router.push({name: 'calOverview'})
            location.reload()
          })
          .catch(error => {
            console.log('Error Authenticating: ', error)
          })
      },
      //sync
      getCats ({commit, state, jwt}, payload) {
        return axios.get(backendURL + '/urlaub/api/v1.0/getCats/' + payload.uCalID + '/' + payload.sCalID,
          {headers: {Authorization: `Bearer: ${state.jwt.token}`}})
          .then(function (response) {
            commit('setSharedCats', response.data[1])
            commit('setPersonalCats', response.data[0])

          })
          .catch(function (error) {
            console.log(error)
          })
      },
      saveSyncPair ({commit, state, jwt}, payload) {
        axios.post(backendURL + '/urlaub/api/v1.0/setSyncPair', payload,
          {headers: {Authorization: `Bearer: ${state.jwt.token}`}})
          .then(function (response) {
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      setInfoText ({commit, state}, payload) {
        commit('setInfoText', payload)
      },
      removeInfo ({commit, state}) {
        commit('removeInfo')
      },
      showFeiertage ({commit}) {
        commit('showFeiertage')
      },
      removeFeiertage ({commit}) {
        commit('removeFeiertage')
      },
      addFeiertage ({commit, state}, payload) {
        axios.post(backendURL + '/urlaub/api/v1.0/addFeiertage', {
          region: payload.region,
          catID: payload.catID,
          calID: state.currentCal
        }, {headers: {Authorization: `Bearer: ${state.jwt.token}`}})
          .then(function (response) {
            location.reload()
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      showCalSettingsBox ({commit}) {
        commit('showCalSettingsBox')
      },
      removeCalSettingsBox ({commit}) {
        commit('removeCalSettingsBox')
      },
      deleteUser({state, dispatch}) {
        return deleteUser(state.jwt.token)
          .then(response => {
            dispatch('logout')
          })
          .catch(error => {
            console.log('Error Authenticating: ', error)
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
      getSharedInfo: (state) => {
        return state.sharedUserDays
      },
      getSharedUsers: (state) => {
        return state.sharedUsers
      },
      getElementMapByIDStyle: (state) => (uID, id) => {
        return state.element_map[uID][id].style
      },
      getDayBox: (state) => {
        return state.dayBox
      },
      getClicked: (state) => {
        return state.clicked.id
      },
      getClickedCat: (state) => {
        return state.clickedCat
      },
      getElementMap: (state) => {
        return state.element_map
      },
      getSharedCats: (state) => {
        return state.sharedCats
      },
      getPersonalCats: (state) => {
        return state.personalCats
      }
    }
  }
)

