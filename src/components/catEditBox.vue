<template>
  <div v-show='$store.getters.getDayBox' class="dayBox">
    <div v-if="$store.state.clickedCat.length !== 0" v-bind:key="$store.state.clickedCat[0].id">
      <button id="x" @click="resetDayBox">X</button>
      <span id="selectedDaysText">
      {{ selectedDaysString }}
      </span>
      <input v-if="$store.state.border" id="new_category" v-model="catName" placeholder="cat name">
      <button v-if="!$store.state.border && !edit" class="edit_button" v-bind:id="$store.state.clickedCat[0].id" @click="open_edit">edit</button>
      <button v-if="!$store.state.border && !edit" @click="deleteCat">delete Category</button>
      <button v-if="$store.state.border" @click="addNewCat">send</button>
      <input v-if="edit" id="editCatName" v-model="catEditName">
      <select v-if="edit" :style="" v-model="catEditColor">
        <option v-if="edit">Select Color</option>
        <option v-for="color in this.colors" :style="color" :value="color"></option>
      </select>
      <button v-if="edit" @click="editCat">save</button>
      <select v-if="!edit" :style="$store.state.clickedCat[0].style" @change="catDropChange($event)">
        <option v-if="!edit">Select Cat</option>
        <option v-for="cat in this.$store.state.cats" v-bind:style="cat.style" :value="cat.id">{{ cat.name}}</option>
        <option v-if="!edit" value="new">new</option>
      </select>
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
        this.catEditName = this.$store.state.clickedCat[0].name
        this.catEditColor = this.$store.state.clickedCat[0].style['background-color']
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
        console.log(payload)
        this.$store.dispatch('editCat', payload)
        this.edit = !this.edit
      },
      deleteCat () {
        this.$store.dispatch('deleteCat')
      },
      resetDayBox () {
        this.edit = false
        this.$store.dispatch('resetClicked')
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
    background-color: gold;
    display: inline-block;
    text-align: center;
    height: 10%;
    position: fixed;
    bottom: 20px;
    right: 10%;
    width: 80%;
    opacity: 1;
    border-radius: 25px;
    margin: auto;
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
  #x {
    float: left;
    margin-left: 10px;
    margin-top: 10px;
    border: none;
    background-color: inherit;
  }
  #selectedDaysText{
    display: block;
    margin-top: 10px;
  }
</style>
