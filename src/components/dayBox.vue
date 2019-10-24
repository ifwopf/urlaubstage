<template>
  <div v-show='$store.getters.getDayBox' class="dayBox">
    <div id="buttonBox">
      <button id="x" @click="resetDayBox"><i class="material-icons md-48">clear</i></button>
      <button id="lock" @click="toggleLock">
        <i v-if="!$store.state.locked" class="material-icons md-48">lock_open</i>
        <i v-else class="material-icons md-48">lock</i>
      </button>
    </div>
    <span id="selectedDaysText">
    {{ selectedDaysString }}
    </span>
  </div>
</template>
<script>


import axios from 'axios'
import {mapActions} from 'vuex'
import {mapGetters} from 'vuex'
export default {
  name: 'dayBox',
  data () {
    return {
      catName: '',
      catEditName: '',
      catEditColor: '',
      edit: false,
      locked: false,
      colors: [{'background-color': '#b4b9cc'}, {'background-color': '#7387b0'}, {'background-color': '#ffca62'},
        {'background-color': '#ee5f82'}, {'background-color': '#f986a2'}, {'background-color': '#E0B3E6'},
        {'background-color': 'aquamarine'} ]
    }
  },
  computed: {
    ...mapGetters([
      'getDayBox'
    ]),
    ...mapActions([
      'toTheLeft'
    ]),
    selectedDaysString: function() {
      function compare (a, b) {
        if (a.id < b.id)
          return -1;
        if (a.id > b.id)
          return 1;
        return 0;
      }
      var sorted = this.$store.state.clicked.sort(compare);
      var selectedDaysString = ""
      var lastKey = -2
      var chain = false;
      for(var key in sorted){
        var currentDay = sorted[key]
        if (lastKey === -2){
          selectedDaysString += currentDay.day + "." + currentDay.month + " "
        }
        else {
          if (parseInt(sorted[lastKey].id) === parseInt(currentDay.id) - 1) {
            chain = true;
          }
          else {
            if(chain){
              selectedDaysString += "- " + sorted[lastKey].day + "." + sorted[lastKey].month + " "
              chain = false;
            }
            selectedDaysString += ", " + currentDay.day + "." + currentDay.month + " "
          }
        }
        lastKey = key
      }
      if(chain){
        selectedDaysString += "- " + sorted[lastKey].day + "." + sorted[lastKey].month
        chain = false;
      }
      return selectedDaysString;
    }
  },
  methods: {
    open_edit () {
      //this.catEditName = this.$store.state.clickedCat[0].name
      //this.catEditColor = this.$store.state.clickedCat[0].style['background-color']
      this.edit = true
    },
    addNewCat () {
      var doppelt = false
      for (var i = 0; i < this.$store.state.cats.length; i++) {
        if (this.catName === this.$store.state.cats[i].name) {
          doppelt = true
        }
      }
      if (!doppelt) {
        this.$store.dispatch('addCat', this.catName)
        this.catName = ''
      }
    },
    change_cat (event) {
      var oldCat = this.element_map[this.clicked[0].id].cat_id
      axios.post('http://127.0.0.1:5000/urlaub/api/v1.0/change_cat', {
        cat_id: event.target.id,
        id: this.clicked[0].id
      })
        .then(function (response) {
          console.log(response.data)
        })
        .catch(function (error) {
          console.log(error)
        })
      this.element_map[this.clicked[0].id].cat_id = event.target.id
      this.cat_count[oldCat] -= 1
      this.cat_count[event.target.id] += 1
      // console.log(this.element_map[this.clicked.id].style_object['background-color'])
    },
    editCat () {
      var payload = {'color': this.catEditColor['background-color'], 'name': this.catEditName}
      this.$store.dispatch('editCat', payload)
      this.edit = !this.edit
    },
    resetDayBox () {
      this.edit = false
      this.$store.dispatch('resetClicked')
      //this.$store.dispatch('resetCatClicked')
    },
    toggleLock () {
      this.$store.commit('toggleLock')
    },
    catDropChange(event) {
      if(event.target.value !== "new"){
        this.$store.dispatch('changeCatDropDown', event.target.value)
      }
      else{
        this.$store.dispatch('editCatDisplay')
      }
    },
    selectedColor: function(color){
      return "background:color: " + color
    }
  }
}
</script>

<style scoped>
  .dayBox {
    color: black;
    background-color: mistyrose;
    text-align: center;
    height: 15%;
    position: sticky;
    bottom: 10px;
    border-radius: 10px;
    margin: auto;
    font-size: 20px;
  }

  #buttonBox{
    width: 20%;
    float: left;
  }

  .cat_button {
    width: 200px;
    margin-bottom: 3px;
    margin-top: 2px;
    margin-left: auto;
    margin-right: auto;
    min-height: 20px;
  }

  .edit_button {
    margin-bottom: 3px;
    margin-top: 2px;
    margin-left: auto;
    margin-right: auto;
    min-height: 20px;
  }
  #x, #lock {
    width: 100%;
    border: none;
    background-color: inherit;
    font-size: 40px !important;
  }
  #selectedDaysText{
    display: block;
    margin-top: 10px;
  }
  #selectCat {
    width: 75%;
    font-size: inherit;
  }
</style>
