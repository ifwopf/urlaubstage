import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

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
      info: null,
      cats: null,
      cat_count: {},
      catMap: [],
      element_map: {},
      dataReady: false,
      dayBox: false,
      clicked: [],
      clickedCat: [],
      border: false,
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
        // console.log(state.element_map[id])
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
      setBorder (state, border) {
        state.border = border
      }
    },
    actions: {
      ready ({ commit, state }) {
        fetch('http://127.0.0.1:5000/urlaub/api/v1.0/days/2019')
          .then(response => response.json())
          .then((data) => {
            commit('set_cats', data['cats'])
            commit('set_info', data['days'])
            commit('set_dataReady', true)
          })
      },
      toTheLeft ({commit, dispatch, state}) {
        var index = state.catMap.indexOf(state.clickedCat[0].id)
        if (index === 0) {
          if (!state.border) {
            commit('setBorder', true)
          } else {
            index = state.catMap.length - 1
            commit('setBorder', false)
            dispatch('changeCat', index)
          }
        } else {
          index -= 1
          commit('setBorder', false)
          dispatch('changeCat', index)
        }
      },
      toTheRight ({commit, dispatch, state}) {
        var index = state.catMap.indexOf(state.clickedCat[0].id)
        if (index === state.catMap.length - 1) {
          if (!state.border) {
            commit('setBorder', true)
          } else {
            index = 0
            commit('setBorder', false)
            dispatch('changeCat', index)
          }
        } else {
          index += 1
          commit('setBorder', false)
          dispatch('changeCat', index)
        }
      },
      editCatDisplay ({commit, dispatch, state}){
        commit('setBorder', true)
      },
      changeCat ({commit, state}, index) {
        commit('changeClickedCat', state.cats[state.catMap[index]])
        axios.post('http://127.0.0.1:5000/urlaub/api/v1.0/change_cat', {
          cat_id: state.clickedCat[0].id,
          days: state.clicked
        })
          .then(function (response) {
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      changeCatDropDown ({commit, state}, catID) {
        commit('changeClickedCat', state.cats[catID])
        axios.post('http://127.0.0.1:5000/urlaub/api/v1.0/change_cat', {
          cat_id: catID,
          days: state.clicked
        })
          .then(function (response) {
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      editCat ({commit, state}, payload) {
        commit('editCat', payload)
        axios.post('http://127.0.0.1:5000/urlaub/api/v1.0/editCat', {
          catId: state.clickedCat[0].id,
          catColor: payload.color,
          catName: payload.name
        })
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
      addCat ({commit, state}, catName) {
        axios.post('http://127.0.0.1:5000/urlaub/api/v1.0/add_cat', {
          cat_name: catName,
          cat_color: '#0959E2',
          clicked: state.clicked
        })
          .then(function (response) {
            commit('addCat', response.data)
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      deleteCat ({commit, state}) {
        axios.post('http://127.0.0.1:5000/urlaub/api/v1.0/deleteCat', {
          catID: state.clickedCat[0].id
        })
          .then(function (response) {
            for (var i = 0; i < 11; i++) {
              for (var j = 0; j < state.info[i].length; j++) {
                if (state.info[i][j]['cat_id'] === state.clickedCat[0].id) {
                  var payload = {'month': i, 'day': j}
                  commit('alterCatRefs', payload)
                }
              }
            }
            commit('deleteCat', state.clickedCat[0].id)
          })
          .catch(function (error) {
            console.log(error)
          })
      }

    },
    getters: {
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

