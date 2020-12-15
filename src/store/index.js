import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueInputAutowidth from 'vue-input-autowidth'

// imports of AJAX functions will go here
import {authenticate, register, addUnreg, deleteUser, removeUserFromShared, changePassword} from '@/api'
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
      info: {},
      cats: {},
      mergeCats: {},
      cals: null,
      currentCal: null,
      cat_count: {},
      element_map: {},
      dataReady: false,
      calDataReady: false,
      sharedDataReady: false,
      dayBox: false,
      catEditBox: false,
      clicked: [],
      catColor: 'rgb(255, 255, 255)',
      clickedCatCounter: null,
      clickedCatCal: null,
      clickedCatName: '',
      clickedCat: [],
      checkedCalenders: [],
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
      sharedUsers: [],
      personalCats: {},
      infotext: '',
      showinfo: false,
      showFeiertage: false,
      showCalSettingsBox: false,
      showDeleteBox: false,
      deleteText: "",
      mergeReady: false,
      mergedCals: {},
      activeCal: -1
    },
    mutations: {
      /*
      mapElement (state, payload) {

        state.element_map[payload.id] = state.info[payload.month][payload.day]
      },*/
      set_info (state, payload) {
        var calID = payload.calID
        Vue.set(state.info, calID, payload.days)
        Vue.set(state.element_map,calID, {})
        for (var i = 0; i < 12; i++) {
          var row = 2
          var count = 1
          state.info[calID][i].sort(compare)
          for (var day in state.info[calID][i]) {
            if (state.info[calID][i][day].day === 1) {
              count = state.weekday[state.info[calID][i][day].weekday]
            }
            Vue.set(state.info[calID][i][day], 'clicked', false)
            Vue.set(state.info[calID][i][day], 'style',  {
              'grid-column-start': state.weekday[state.info[calID][i][day].weekday],
              'grid-row-start': row,
              'border-style': 'solid',
            })
            if (count % 7 === 0) {
              row += 1
            }
            count += 1
            Vue.set(state.element_map[calID],state.info[calID][i][day].id,  state.info[calID][i][day])
            state.cat_count[calID][state.info[calID][i][day].cat_id] += 1
          }
        }
      },
      set_cats (state, payload) {
        var calID = payload.calID
        Vue.set(state.cats, calID, payload.cats)
        Vue.set(state.cats[calID],[0], {
          'id': 0,
          'name': 'default',
          'value': 1,
          'style': {'background-color': '#fff'}
        })
        state.cat_count[calID] = {}
        for (var key in state.cats[calID]) {
          state.cat_count[calID][key] = 0
        }
      },
      set_mergeCats (state, data) {
        for (var cal of data) {
          Vue.set(state.cats, cal["cal"], cal["cats"])
          Vue.set(state.cats[cal["cal"]], 0 , {
            'id': 0,
            'name': 'default',
            'value': 1,
            'style': {'background-color': '#fff'},
            'calID': cal["cal"]
          })
          state.cat_count[cal["cal"]] = {}
          for (var key in state.cats[cal["cal"]]) {
            state.cat_count[cal["cal"]][key] = 0
          }
        }
      },
      setCals (state, cals) {
        state.cals = cals
      },
      setSharedInfo (state, payload) {
        Vue.set(state.info, payload.calID, payload.calData)
        state.info[payload.calID].forEach(function (monat, index) {
          monat.forEach(function (user, jindex) {
            user.forEach(function (day, kindex) {
              Vue.set(day, 'clicked', false)
              Vue.set(state.element_map[payload.calID][day.userID], day.id, day)
              state.cat_count[payload.calID][day.cat_id] += 1
            })
          })
        })
      },
      set_mergeData (state, data) {
        for (var cal of data) {
          Vue.set(state.element_map, cal["cal"], {})
          Vue.set(state.info, cal['cal'],cal["days"])
          for (var monat of cal["days"]) {
            for (var day of monat) {
              Vue.set(day, 'clicked', false)
              Vue.set(state.element_map[cal["cal"]],[day.id] , day)
              state.cat_count[cal['cal']][day.cat_id] += 1
            }
          }
        }
      },

      setCurrentUser (state, userID) {
        state.currentUser = userID
      },
      setSharedName (state, sharedName) {
        state.sharedName = sharedName
      },
      setSharedUsers (state, payload) {
        state.sharedUsers = []
        Vue.set(state.element_map, payload.calID, {})
        for (var user in payload.users) {
          Vue.set(state.sharedUsers, user, payload.users[user])
          Vue.set(state.element_map[payload.calID], state.sharedUsers[user][0] , {})
        }
      },
      set_sharedDataReady (state, toggle) {
        state.sharedDataReady = toggle
      },
      set_dataReady (state, toggle) {
        state.dataReady = toggle
      },
      set_mergeReady( state, toggle){
        state.mergeReady = toggle
      },
      setCalDataReady (state, toggle) {
        state.calDataReady = toggle
      },
      setCurrentCal (state, calID) {
        state.currentCal = calID
      },
      setClicked (state, payload) {
        Vue.set(state.element_map[payload.calID][payload.dayID], 'clicked', true)
        state.clicked.push(state.element_map[payload.calID][payload.dayID])
      },
      setSharedClicked(state, payload) {
        Vue.set(state.element_map[payload.calID][payload.userID][payload.dayID], 'clicked', true)
        state.clicked.push(state.element_map[payload.calID][payload.userID][payload.dayID])
      },
      setActiveCal (state, payload) {
        state.activeCal = parseInt(payload)
      },
      resetClicked (state) {
        state.clickedCat = []
        state.border = false
        state.edit = false
        state.dayBox = false
        for (var index = 0; index < state.clicked.length; index++) {
          state.clicked[index].clicked = false
        }
        state.clicked = []
      },
      removeAllClicked (state) {
        state.clickedCat = []
        for (var index = 0; index < state.clicked.length; index++) {
          state.clicked[index].clicked = false
        }
        state.clicked = []
      },
      removeClicked (state, payload) {
        state.clicked[payload['index']].clicked = false
        state.clicked.splice(payload['index'], 1)
        state.clickedCat.splice(payload['index'], 1)
      },
      removeMergedClicked (state, payload) {
        Vue.set(state.element_map[payload['cID']][payload['id']], 'clicked', false)
        state.clicked.splice(payload['index'], 1)
        state.clickedCat.splice(payload['index'], 1)
        Vue.set(state.element_map[payload['cID']][payload['id']], 'id', 0)
        Vue.set(state.element_map[payload['cID']][payload['id']], 'id', payload['id'])
      },
      setClickedCat (state, payload) {
        state.clickedCat.push(state.cats[payload.calID][state.element_map[payload.calID][payload.dayID].cat_id])
      },
      setSharedClickedCat (state, payload) {
        state.clickedCat.push(state.cats[payload.calID][state.element_map[payload.calID][payload.userID][payload.dayID].cat_id])
      },
      setClickedCatCounter (state, data) {
        state.clickedCatCounter = data.catID
        state.clickedCatCal = data.calID
        state.catColor = state.cats[data.calID][data.catID].style['background-color']
      },
      setCatColor (state, color) {
        state.catColor = color
      },
      setClickedCatName (state, catName) {
        state.clickedCatName = catName
      },
      changeClickedCat (state, payload) {
        var calID = payload.calID
        var cat = payload.cat
        var count = state.clickedCat.length
        for (var i = 0; i < count; i++) {
          state.cat_count[calID][state.clickedCat[i].id] -= 1
          Vue.set(state.clickedCat, i, cat)
          state.cat_count[calID][cat.id] += 1
          state.clicked[i].cat_id = cat.id
        }
      },
      resetClickedCat (state, days) {
        var count = days.length
        for (var i = 0; i < count; i++) {
          state.cat_count[state.element_map[state.currentUser][days[i]['id']].cat_id] -= 1
          state.cat_count[days[i]['cat_id']] += 1
          Vue.set(state.element_map[state.currentUser][days[i]['id']], 'cat_id', days[i]['cat_id'])
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
        state.cats[payload.calID][payload.id].style['background-color'] = payload.catColor
      },
      editCatName (state, payload) {
        state.cats[payload.calID][payload.id]['name'] = payload.name
      },

      addCat (state, payload) {
        const newCat = payload.cat
        const calID = payload.calID
        state.cat_count[calID][newCat.id] = 0
        Vue.set(state.cats[calID], newCat.id, newCat)
        for (var i = 0; i < state.clicked.length; i++) {
          state.cat_count[calID][state.clicked[i].cat_id] -= 1
          state.cat_count[calID][newCat.id] += 1
          state.clicked[i].cat_id = newCat.id
          state.clickedCat[i] = newCat
        }
        state.border = false
      },
      alterCatRefs (state, payload) {
        state.info[payload.month][payload.day]['cat_id'] = 0
        state.cat_count[0] += 1
      },
      setToDefaultCat (state, payload) {
        var calID = payload.calID
        Vue.set(state.element_map[calID][payload.dayID], 'cat_id', 0)
        Vue.set(state.cat_count[calID], 0, state.cat_count[calID][0] + 1)
      },
      setSharedDaysToDefaultCat (state, payload){
        var calID = payload.calID
        Vue.set(state.element_map[calID][payload.userID][payload.dayID], 'cat_id', 0)
        Vue.set(state.cat_count[calID], 0, state.cat_count[calID][0] + 1)
      },
      deleteCat (state, payload) {
        var calID = payload.calID
        var catID = payload.catID
        Vue.delete(state.cat_count[calID], catID)
        Vue.delete(state.cats[calID], catID)
        state.clickedCat[0] = state.cats[calID][1]
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
          state.element_map[payload[key].calID][key].userdayID = payload[key].userdayID
        })
      },
      replaceSharedUserdayID (state, payload) {
        Object.keys(payload).forEach(function (key) {
          state.element_map[payload[key].calID][payload[key].userID][key].userdayID = payload[key].userdayID
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
      },
      reorderShared (state, payload) {
        for (var m = 0; m<12 ; m++){
          var newOrder = []
          for(var entry of payload.order){
            newOrder.push(state.info[payload.calID][m][entry[0]])
          }
          var i = 0
          for (var en of newOrder){
            Vue.set(state.info[payload.calID][m], i, en)
            i++
          }
        }
      },
      reorderUsers (state, order) {
        var jindex = 0
        const temp = Array.from(state.sharedUsers)
        for(var i=0; i<order.length;i++){
          Vue.set(state.sharedUsers, jindex, temp[parseInt(order[i][0])])
          jindex++
        }
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
      changePassword (context, userData) {
        //context.commit('setUserData', {userData})
        return changePassword(userData, context.state.jwt.token)
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
                          router.push('/calOverview')
                          location.reload()
                          return "ok"
                          })
                        .catch(error => {
                          console.log('Error Login: ', error)
                        })
                    }
                    else{
                      router.push('/calOverview')
                      location.reload()
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
            var payloadCats = {cats: response.data['cats'], calID: data[0]}
            commit('set_cats', payloadCats)
            var payloadDays = {days: response.data['days'], calID: data[0]}
            commit('set_info', payloadDays)
            commit('set_dataReady', true)
            commit('setCurrentCal', data[0])
          })
      },
      mergeReady ({commit, state, jwt}, data) {
        console.log(data)
        if (data === undefined) {
          data = '2020'
        }
        var yearstring = backendURL + '/urlaub/api/v1.0/mergeDays/' + data
        axios.post(yearstring,{
            cals: state.checkedCalenders
            },
          {headers: {Authorization: `Bearer: ${state.jwt.token}`}})
        //.then(response => response.json())
          .then((response) => {
            commit('setCurrentUser', response.data[0]['user'])
            commit('set_mergeCats', response.data)
            commit('set_mergeData', response.data)
            commit('set_mergeReady', true)
            //commit('setCurrentCal', data[0])
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
            commit('setSharedUsers', {calID: payload[0], users: response.data[1]})
            commit('setCurrentCal', payload[0])
            commit('setCurrentUser', response.data[4])
            commit('setSharedName', response.data[0])
            commit('set_cats', {calID: payload[0], cats: response.data[3]})

            commit('setSharedInfo', {calID: payload[0], calData: response.data[2]})
            commit('set_sharedDataReady', true)
          })
      },
      editCatDisplay ({commit, dispatch, state}) {
        commit('setBorder', true)
      },
      changeCatDropDown ({commit, state}, data) {
        var payload = {cat: state.cats[data.calID][data.catID], calID: data.calID}
        commit('changeClickedCat', payload)
        axios.post(backendURL + '/urlaub/api/v1.0/change_cat', {
          cat_id: data.catID,
          days: state.clicked,
          calID: data.calID
        }, {headers: {Authorization: `Bearer: ${state.jwt.token}`}})
          .then(function (response) {
            commit('replaceUserdayID', response.data)
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      changeCatShared ({commit, state}, data) {
        var payload = {cat: state.cats[data.calID][data.catID], calID: data.calID}
        commit('changeClickedCat', payload)
        axios.post(backendURL + '/urlaub/api/v1.0/change_cat', {
          cat_id: data.catID,
          days: state.clicked,
          calID: data.calID
        }, {headers: {Authorization: `Bearer: ${state.jwt.token}`}})
          .then(function (response) {
            commit('replaceSharedUserdayID', response.data)
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
          calID: state.clicked[0].calID
        }, {headers: {Authorization: `Bearer: ${state.jwt.token}`}})
          .then(function (response) {
            commit('replaceUserdayID', response.data)
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      addSharedNote({commit, state}, note) {
        commit('addNotes', note)
        axios.post(backendURL + '/urlaub/api/v1.0/addNote', {
          note: note,
          days: state.clicked,
          calID: state.clicked[0].calID
        }, {headers: {Authorization: `Bearer: ${state.jwt.token}`}})
          .then(function (response) {
            commit('replaceSharedUserdayID', response.data)
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
      setSharedClicked ({commit, state}, payload) {
        commit('setSharedClicked', payload)
        commit('setSharedClickedCat', payload)
        commit('setDayBox')
      },
      resetClicked ({commit, state}) {
        commit('resetClicked')
      },
      resetMergedClicked ({commit, state}) {
        commit('resetMergedClicked')
        commit('setActiveCal', -1)
      },
      removeClicked ({commit, state}, payload) {
        if (state.clicked.length === 1) {
          commit('resetClicked')
        }
        else {
          var pay2 = {}
          pay2['index'] = state.clicked.indexOf(state.element_map[payload.calID][payload.dayID])
          commit('removeClicked', pay2)
        }
      },
      removeSharedClicked ({commit, state}, payload) {
        if (state.clicked.length === 1) {
          commit('resetClicked')
        }
        else {
          var pay2 = {}
          pay2['index'] = state.clicked.indexOf(state.element_map[payload.cID][payload.uID][payload.dayID])
          commit('removeClicked', pay2)
        }
      },
      addCat ({commit, state}, payload) {
        axios.post(backendURL + '/urlaub/api/v1.0/add_cat', {
          cat_name: payload.catName,
          cat_color: payload.catColor,
          calID: payload.calID,
          clicked: state.clicked
        }, {headers: {Authorization: `Bearer: ${state.jwt.token}`}})
          .then(function (response) {
            var payload2 = {cat: response.data[0], calID: state.currentCal}
            commit('addCat', payload2)
            commit('replaceUserdayID', response.data[1])
            commit('setBorder', false)
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      addSharedCat ({commit, state}, payload) {
        axios.post(backendURL + '/urlaub/api/v1.0/add_cat', {
          cat_name: payload.catName,
          cat_color: payload.catColor,
          calID: payload.calID,
          clicked: state.clicked
        }, {headers: {Authorization: `Bearer: ${state.jwt.token}`}})
          .then(function (response) {
            var payload2 = {cat: response.data[0], calID: state.currentCal}
            commit('addCat', payload2)
            commit('replaceSharedUserdayID', response.data[1])
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
            var payload2 = {catID: catID, calID: state.currentCal}
            commit('deleteCat', payload2)
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      deleteSharedCat ({commit, state}, catID) {
        axios.post(backendURL + '/urlaub/api/v1.0/deleteCat', {
          catID: catID
        }, {headers: {Authorization: `Bearer: ${state.jwt.token}`}})
          .then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
              commit('setSharedDaysToDefaultCat', response.data[i])
            }
            var payload2 = {catID: catID, calID: state.currentCal}
            commit('deleteCat', payload2)
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
            router.push({name: 'calOverview'})
            location.reload()
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      removeUserFromShared ({state}, calID) {
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
            commit('setPersonalCats', response.data[0])
            commit('setSharedCats', response.data[1])
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
      getCalByID: (state) => (id) => {
        return state.cals[id]
      },
      getCatByID: (state) => (id, calID) => {
        return state.cats[calID][id]
      },
      getCats: (state) => (calID) =>  {
        return state.cats[calID]
      },
      getMergedCats: (state) => {
        return state.mergeCats
      },
      getMergedCals: (state) => {
        return state.checkedCalenders
      },
      getCatCount: (state) => (id, calID) => {
        return state.cat_count[calID][id]
      },
      getInfo: (state) => (calID) => {
        return state.info[calID]
      },
      getSharedInfo: (state, calID) => {
        return state.info[calID]
      },
      getMergedData: (state) => {
        return state.mergedUserDays
      },
      getSharedUsers: (state) => {
        return state.sharedUsers
      },
      getElementMapByIDStyle: (state) => (id, calID) => {
        return state.element_map[calID][id].style
      },
      getSharedElement: (state) => (id, userID, calID) => {
        return state.element_map[calID][userID][id].style
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

