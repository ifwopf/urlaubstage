<template>
  <div v-show='$store.getters.getDayBox && !multipleUsers' class="dayBox">
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
  import { saveToIndexedDB } from '@/indexedDB'
  import {mapActions} from 'vuex'
  import {mapGetters} from 'vuex'
  export default {
    name: 'mergedDayBox',
    props: ["unreg", "year"],
    data () {
      return {
        catName: '',
        catEditName: '',
        catEditColor: '',
        edit: false,
        locked: false,
        editNote: false,
        multipleUsers: false,
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
        var users = {}
        for(var key in sorted){
          var userInClicked = sorted[key].userID
          users[userInClicked] = true
          if(Object.keys(users).length > 1){
            this.multipleUsers = true
          }
          else {
            this.multipleUsers = false
          }
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
      addNote() {
        this.$store.dispatch("addMergedNote", this.note)
        this.editNote = !this.editNote
      },
      resetDayBox () {
        this.editNote = false
        this.edit = false
        this.$store.commit('setBorder', false)
        this.$store.dispatch('resetMergedClicked')
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
