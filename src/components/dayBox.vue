<template>
  <div v-show='$store.getters.getDayBox' class="dayBox">
    <button id="x" @click="resetDayBox"><i class="material-icons md-48">clear</i></button>
    <button id="lock" @click="toggleLock">
      <i v-if="!$store.state.locked" class="material-icons md-48">lock_open</i>
      <i v-else class="material-icons md-48">lock</i>
    </button>
    <span id="selectedDaysText">
    {{ selectedDaysString }}
    </span>
    <div class="notebox">
      <div class="note">
        <div v-if="!editNote">
          <span v-if="$store.state.clicked.length == 1">
          {{ note }}
            </span>
          <button class="noteButton" v-if="!editNote" @click="editNoteToggle">
            <i class="material-icons md-48 noteButton">edit</i>
          </button>
        </div>
        <div v-if="editNote">
          <button class="noteButton" @click="editNoteToggle">
            <i class="material-icons md-48">close</i>
          </button>
          <input class="inputNote" v-model="note"/>
          <button class="noteButton" @click="addNote"><i class="material-icons md-48">save</i></button>
        </div>
      </div>
    </div>
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
      editNote: false,
      tmpNote: '',
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
    note:  {
      get: function () {
        return this.$store.state.clicked[0].note
      },
      // setter
      set: function (newValue) {
        Vue.set(this.$store.state.clicked[0], 'note', newValue)
      }
    },
    selectedDaysString: function() {
      function compare (a, b) {
        if (a.month < b.month)
          return -1;
        else if (a.month === b.month){
          if (a.day < b.day)
            return -1;
        }
        else
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
    addNote() {
      this.$store.dispatch("addNote", this.note)
      this.editNote = !this.editNote
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
      this.$store.commit('setBorder', false)
      this.$store.dispatch('resetClicked')
      //this.$store.dispatch('resetCatClicked')
    },
    toggleLock () {
      this.$store.commit('toggleLock')
    },
    editNoteToggle () {
      this.editNote = !this.editNote
      if (this.editNote) {
        this.tmpNote = this.note
      }
      else {
        this.note = this.tmpNote
      }
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
    background-color: #ffffff;
    text-align: center;
    height: 15%;
    position: sticky;
    bottom: 20px;
    box-shadow: 5px 2.5px 2.5px grey;
    border: solid;
    border-width: 0.5px;
    margin: auto;
    font-size: 20px;
    width: 95%;
    max-width: 800px;
    display: grid;
    grid-template-columns: 15% 85%;
    grid-template-rows: 60% 40%;
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
    cursor: pointer;
    margin: 1px;
  }
  #lock {
    grid-row: 2;
    grid-column: 1;
  }
  #x {
    grid-row: 1;
    grid-column: 1;
    align-self: baseline;
    margin-top: 10px;
  }
  #selectedDaysText{
    display: block;
    margin-top: 10px;
  }
  .notebox {
    width: fit-content;
    float: right;
    grid-column: 2;
    grid-row: 2;
    text-align: center;
    margin: auto;
  }
  .note {
    position: relative;
    vertical-align: top;
  }
  .noteButton {
    background-color: inherit;
    border: none;
    cursor: pointer;
    vertical-align: top;
  }
  .inputNote{
    background-color: aliceblue;
    border: none;
    line-height: 24px;
    height: 24px;
    font-size: 18px;
    vertical-align: top;
  }
</style>
