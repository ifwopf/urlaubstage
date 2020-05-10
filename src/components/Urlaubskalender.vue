<template>
  <div class="wrapper" v-if="$store.state.dataReady">
    <h1 class="jahrtitel">
      <i class="material-icons" id="home" @click="redirect('/#/calOverview')">
        home
      </i>
      {{calName}}
      <span class="year">
      <i v-if="year != borderyears[0]" class="material-icons" @click="changeYear(false)">keyboard_arrow_left</i> {{ year }}
      <i v-if="year != borderyears[1]" class="material-icons" @click="changeYear(true)">keyboard_arrow_right</i>
        </span>
      <i class="material-icons" id="settings" @click="showCalSettingsBox">
        settings
      </i>
    </h1>
    <div class="counters">
      <div class="count" v-for="cat in $store.getters.getCats" v-bind:id="cat['id']"
            v-bind:key="cat.id"
            :style="cat.style" @click="click_on_cat(cat.id)">
        <span>{{ cat['name']}}: {{ $store.getters.getCatCount(cat.id)}}</span>
        <i class="material-icons" v-show="parseInt(selectedCat)===cat.id" @click="showCatEdit">settings_applications</i>
      </div>
      <span v-if="!$store.state.border" @click="openAddCat"> <i id="plus" class="material-icons">add</i></span>
    </div>

    <div class="monat" v-for="(month, index) in $store.getters.getInfo" :key="index">
      <h3 class="monatstitel">{{ months_en[index] }}</h3>
      <div class="grid">
        <div class="wochentag" style="grid-row: 1; grid-column: 1">Mo</div>
        <div class="wochentag" style="grid-row: 1; grid-column: 2">Di</div>
        <div class="wochentag" style="grid-row: 1; grid-column: 3">Mi</div>
        <div class="wochentag" style="grid-row: 1; grid-column: 4">Do</div>
        <div class="wochentag" style="grid-row: 1; grid-column: 5">Fr</div>
        <div class="wochentag" style="grid-row: 1; grid-column: 6">Sa</div>
        <div class="wochentag" style="grid-row: 1; grid-column: 7">So</div>
        <div class="tagrahmen" @click="mouse_on_day" :id="day.id" v-for="day in month"
             :class="{ 'currentDay': (day.month == currentMonth && day.day == currentDay)}"
             :style="[$store.getters.getElementMapByIDStyle($store.state.currentUser,day.id),
             $store.getters.getCatByID(day.cat_id).style,
             day.clicked ? {'border-color': 'black  !important'} : {'border-color': '#f1f1f1'}]">
          <div class="tag" v-if="day['weekday']=== 'Samstag'" :month_id="day.month-1"
               v-bind:key="day.id" ref="tag" v-bind:id="day['id']" style="color: 	#800000">
            {{ day['day'] }}<span :id="day['id']" v-if="day.note!=null">*</span>
          </div>
          <div class="tag" v-else-if="day['weekday'] === 'Sonntag'" :month_id="day.month-1"
               v-bind:key="day.id" ref="tag" v-bind:id="day['id']" :blub="day['weekday']"
               style="color: 	#400000">
            {{ day['day'] }}<span v-if="day.note!=null" :id="day['id']">*</span>
          </div>
          <div class="tag" v-else :month_id="day.month-1" v-bind:key="day.id" ref="tag" v-bind:id="day['id']"
               v-bind:style=""
          >
            {{ day['day'] }}<span v-if="day.note!=null" :id="day['id']">*</span>
          </div>
        </div>
      </div>
    </div>
    <div class="edit_box_shadow">&nbsp;</div>
    <day-box/>
    <cat-edit-box/>
    <Feiertage/>
    <cal-settings-box :calName="calName" v-model="calName" :calID="calID"/>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import { getCalName } from '@/api'
  import * as Selection from '@simonwep/selection-js'
  import dayBox from '@/components/dayBox'
  import catEditBox from '@/components/catEditBox'
  import Feiertage from '@/components/Feiertage'
  import calSettingsBox from '@/components/calSettingsBox'


  export default {
    name: 'Urlaubskalender',
    components: {Feiertage, dayBox, catEditBox, calSettingsBox},
    props: ['year', 'calID', 'Feiertage'],
    created () {
      // fetch the data when the view is created and the data is
      // already being observed
      //$(".second_div").css({'width': ($(".first_div").width() + 'px')});
      this.$store.commit('setCurrentCal', this.calID)
      this.$store.dispatch('ready', [this.calID, this.year])
      this.getCal(this.calID, this.$store.state.jwt.token)
      var currentTime = new Date();
      this.currentMonth = currentTime.getMonth() + 1;
      this.currentDay = currentTime.getDate();
    },
    data () {
      return {
        calName: '',
        cat_box: false,
        edit_box: false,
        catName: '',
        catColor: '',
        selectedCat: null,
        borderyears: [2020,2022],
        currentDay: null,
        currentMonth: null,
        months_en: {
          0: 'Januar',
          1: 'Februar',
          2: 'März',
          3: 'April',
          4: 'Mai',
          5: 'Juni',
          6: 'Juli',
          7: 'August',
          8: 'September',
          9: 'Oktober',
          10: 'November',
          11: 'Dezember'
        },
        colors: [{'background-color': '#b4b9cc'}, {'background-color': '#7387b0'}, {'background-color': '#ffca62'},
          {'background-color': '#ee5f82'}, {'background-color': '#f986a2'}, {'background-color': '#E0B3E6'},
          {'background-color': 'aquamarine'}]
      }
    },
    computed: {
      ...mapGetters([
        'getCatByID',
        'getCats',
        'getCatCount',
      ])
    },
    methods: {
      ...mapGetters([
        'getElementMapByIDStyle'
      ]),
      redirect (link) {
        window.location.href = link
      },
      changeYear (direction) {
        if(direction){
          var yearString = String(parseInt(this.year) + 1)
          this.$router.push({name: 'Urlaubskalender2', params: {calID: this.calID, year: yearString}})
        }
        else {
          var yearString = String(parseInt(this.year) - 1)
          this.$router.push({name: 'Urlaubskalender2', params: {calID: this.calID, year: yearString}})
        }
        location.reload()
      },
      mouse_on_day (event) {
        if (!event.ctrlKey && !event.metaKey && ! this.$store.state.locked) {
          // clearClicked
          this.$store.dispatch('resetClicked')
          this.selectedCat = null
        }
        if (!this.containsObject(this.$store.state.element_map[this.$store.state.currentUser][event.target.id], this.$store.state.clicked)) {
          var payload = {"dayID": event.target.id, "uID": this.$store.state.currentUser}
          this.$store.dispatch('setClicked', payload)
        }
        else {
          var payload = {"dayID": event.target.id, "uID": this.$store.state.currentUser}
          this.$store.dispatch('removeClicked', payload)
        }
      },
      click_on_cat (catID) {
        if(this.$store.state.clicked.length > 0){
          this.$store.dispatch('changeCatDropDown', catID)
        }
        else{
          if(catID !== this.selectedCat && int(catID) !==  0){
            this.selectedCat = catID //to be deleted
            this.$store.commit('setClickedCatCounter', parseInt(catID))
            this.$store.commit('setClickedCatName', this.$store.getters.getCats[catID].name)
            this.catName = this.$store.getters.getCats[this.selectedCat].name
            this.catColor = this.$store.getters.getCats[this.selectedCat].style

          }
        }
      },
      selectAll(catID) {
        this.selectedCat = null
        if (!event.ctrlKey && !this.$store.state.locked) {
          // clearClicked
          this.$store.dispatch('resetClicked')
        }
        for (var i = 0; i < 12; i++) {
          for (var j = 0; j < this.$store.getters.getInfo[i].length; j++) {
            var day = this.$store.getters.getInfo[i][j]
            if (parseInt(day.cat_id) === parseInt(catID)) {
              if (this.containsObject(this.$store.state.element_map[this.$store.state.currentUser][day.id], this.$store.state.clicked)) {

              }
              else {
                this.$store.dispatch('setClicked', day.id)
              }
            }
          }
        }
      },
      containsObject (obj, list) {
        var i
        for (i = 0; i < list.length; i++) {
          if (list[i] === obj) {
            return true
          }
        }
        return false
      },
      showCatEdit () {
        this.$store.commit('showCatEdit')
      },
      showFeiertage () {
        this.$store.commit('showFeiertage')
      },
      showCalSettingsBox () {
        this.$store.commit('showCalSettingsBox')
      },
      openAddCat () {
        this.$store.commit('setClickedCatName', '')
        this.$store.commit('setCatColor', 'rgb(255, 255, 255)')
        this.$store.dispatch('editCatDisplay')
      },
      closeAddCat () {
        this.$store.commit('setBorder', false)
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
      getCal (calID, token) {
        return getCalName(calID, token)
          .then(response => {
            this.calName = response.data;
          })
          .catch(error => {
            console.log('Error Authenticating: ', error)
          })
      }

    },
    mounted () {
      Selection.create({
        // Class for the selection-area-element
        class: 'selection-area',

        // px, how many pixels the point should move before starting the selection
        startThreshold: 10,

        // Disable the selection functionality for touch devices
        disableTouch: true,

        // On which point an element should be selected.
        // Available modes are cover (cover the entire element), center (touch the center) or
        // the default mode is touch (just touching it).
        mode: 'touch',

        // Enable single-click selection (Also disables range-selection via shift + ctrl)
        singleClick: false,

        // Query selectors from elements which can be selected
        selectables: ['.tagrahmen'],

        // Query selectors for elements from where a selection can be start
        startareas: ['.monat'],

        // Query selectors for elements which will be used as boundaries for the selection
        boundaries: ['html'],

        // Query selector or dom node to set up container for selection-area-element
        selectionAreaContainer: '.monat',

        // On scrollable areas the number on px per frame is devided by this amount.
        // Default is 10 to provide a enjoyable scroll experience.
        scrollSpeedDivider: 10,
      }).on('beforestart', evt => {
        // This function can return "false" to abort the selection
        //console.log('beforestart', evt);
      }).on('start', evt => {
        //const selected = this.containsObject(this.$store.state.element_map[evt.target.id], this.$store.state.clicked);
        //console.log('start', evt);

        // Remove class if user don't press the control key or ⌘ key
        if (!evt.oe.ctrlKey && !evt.oe.metaKey && !this.$store.state.locked) {
          // clearClicked
          this.$store.dispatch('resetClicked')
          // Unselect all elements
          for (const el of evt.selected) {
            el.classList.remove('selected')
            evt.inst.removeFromSelection(el)
          }
          // Clear previous selection
          evt.inst.clearSelection()
        }

      }).on('move', evt => {
        for (const el of evt.selected) {
          if (this.containsObject(this.$store.state.element_map[this.$store.state.currentUser][el.id], this.$store.state.clicked)) {
            //this.$store.dispatch('removeClicked', el.id)
          }
          else {

            var payload = {"dayID": el.id, "uID": this.$store.state.currentUser}
            this.$store.dispatch('setClicked', payload)
          }
          el.classList.remove('selected')
          evt.inst.removeFromSelection(el)
        }
      }).on('stop', evt => {
      })
    }
  }
</script>


<style>
  .selection-area {
    outline: 1px solid rgba(0, 128, 255, 0.6);
    background-color: rgba(0, 128, 255, 0.2);
  }
  body{
    width: 100%;
    margin:0;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently


                                  supported by Chrome, Opera and Firefox */
  }
</style>
<style scoped>
  .grid {
    display: grid;
    text-align: center;
    line-height: 1.3;
  }
  .monat {
    flex: 1;
    width: 100%;
  }
  @media only screen and (min-width: 961px) {
    .monat {
      max-width: 450px;
      display: inline-block;
      vertical-align: top;
      margin-right: 1%;
    }
  }
  @media only screen and (min-width: 601px) and (max-width: 960px) {
    .monat {
      width: 49%;
      display: inline-block;
      vertical-align: top;
      margin: 0 0.5%;
    }
  }
  @media only screen and (max-width: 600px) {
    .monat {
      margin: auto;
    }
  }
  .tag {
    border: none;
  }
  .tagrahmen {
    cursor: pointer;
    margin: 1px;
    border-width: 1px;
    line-height: 2;
  }
  .tagrahmen:hover{
    background-color: lightgrey !important;
  }
  .edit_box_shadow {
    width: 100%;
    min-height: 10%;
    display: inline-flex;
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
  .count{
    margin: 5px;
    display: block;
    float: left;
    padding: 3px 6px;
    cursor: pointer;
    height: 24px;
    line-height: 24px;
    font-weight: bold;
    vertical-align: middle;
  }
  #home, #settings {
    margin: 5px;
    display: block;
    float: left;
    cursor: pointer;
    border: 1px solid #000;
  }
  .wochentag, .monatstitel, .jahrtitel {
    color: #000;
    background-color: #f1f1f1;
    text-align: center;
  }
  .jahrtitel {
    background-color: #f1f1f1;
    display: inline-block;
    padding: 10px;
    margin: 10px;
  }
  .year{
    display: inline-block;
  }
  .monatstitel {
    background-color: #f1f1f1;
    padding: 3px 10px 3px 10px
  }
  .wochentag {
    background-color: #f1f1f1;
  }
  .counters {
    display: flow-root;
    position: sticky;
    top: 5px;
    background-color: #fff;
    box-shadow: 5px 2.5px 2.5px grey;
    border: solid;
    border-width: 1px;
    font-size: inherit;
    width: 90%;
    margin: 0 auto;
  }
  .catEdits {
  }
  .input {
    background-color: aliceblue;
    border: none;
    font-size: inherit;
    opacity: 0.5;
  }
  .material-icons {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
  }
  #plus, #cancel, #send {
    padding: 3px;
    margin: 5px;
    float: left;
  }
  .inputName {
    font-size: 24px;
    margin: 5px;
  }

  body{
    margin: 0;
  }
  .wrapper {
    width: 100%;
    max-width: 2000px;
    text-align: center;
  }
  .currentDay {
    border-color: red !important;
  }
</style>
