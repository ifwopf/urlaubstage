<template>
  <div class="wrapper" v-show="$store.state.dataReady">
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
      <i v-if="changed!=null" class="material-icons" id="reset" @click="resetCats">
        restore
      </i>
    </h1>
    <div class="counters">
      <div class="count" v-for="cat in $store.state.cats[calID]" v-bind:id="cat['id']"
            v-bind:key="cat.id"
            :style="cat.style" @click="click_on_cat(cat.id)">
        <span>{{ cat['name']}}: {{ $store.getters.getCatCount(cat.id, calID)}}</span>
        <i class="material-icons" v-show="parseInt(selectedCat)===cat.id" @click="showCatEdit">settings_applications</i>
      </div>
      <span v-if="!$store.state.border" @click="openAddCat"> <i id="plus" class="material-icons">add</i></span>
    </div>

    <div class="monat" v-for="(month, index) in $store.getters.getInfo(calID)" :key="index">
      <h3 class="monatstitel">{{ months_en[index] }}</h3>
      <div class="grid">
        <div class="wochentag" style="grid-row: 1; grid-column: 1">Mo</div>
        <div class="wochentag" style="grid-row: 1; grid-column: 2">Di</div>
        <div class="wochentag" style="grid-row: 1; grid-column: 3">Mi</div>
        <div class="wochentag" style="grid-row: 1; grid-column: 4">Do</div>
        <div class="wochentag" style="grid-row: 1; grid-column: 5">Fr</div>
        <div class="wochentag" style="grid-row: 1; grid-column: 6">Sa</div>
        <div class="wochentag" style="grid-row: 1; grid-column: 7">So</div>
        <div class="tagrahmen" @click="mouse_on_day" v-on:mouseenter="selectDays"
             :id="day.id" v-for="day in month"
             :class="{ 'currentDay': (day.month == currentMonth && day.day == currentDay && year == currentYear)}"
             :style="[$store.getters.getElementMapByIDStyle(day.id, calID),
             $store.getters.getCatByID(day.cat_id, calID).style,
             day.clicked ? {'border-color': 'black  !important'} : {'border-color': '#f1f1f1'}]">
          <div class="tag" v-if="day['weekday']=== 'Samstag'" :month_id="day.month-1"
               v-bind:key="day.id" ref="tag" v-bind:id="day['id']" style="color: 	#800000">
            {{ day['day'] }}<span :id="day['id']" v-if="day.note!=null && day.note !==''">*</span>
          </div>
          <div class="tag" v-else-if="day['weekday'] === 'Sonntag'" :month_id="day.month-1"
               v-bind:key="day.id" ref="tag" v-bind:id="day['id']" :blub="day['weekday']"
               style="color: 	#400000">
            {{ day['day'] }}<span v-if="day.note!=null && day.note !==''" :id="day['id']">*</span>
          </div>
          <div class="tag" v-else :month_id="day.month-1" v-bind:key="day.id" ref="tag" v-bind:id="day['id']"
               v-bind:style=""
          >
            {{ day['day'] }}<span v-if="day.note!=null && day.note !==''" :id="day['id']">*</span>
          </div>
        </div>
      </div>
    </div>
    <div class="edit_box_shadow">&nbsp;</div>
    <day-box :unreg="0"/>
    <cat-edit-box :unreg="0" :calID="calID"/>
    <Feiertage/>
    <cal-settings-box :calName="calName" v-model="calName" :calID="calID"/>
    <infobox/>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import { getCalName, resetCats } from '@/api'
  import dayBox from '@/components/dayBox'
  import catEditBox from '@/components/catEditBox'
  import Feiertage from '@/components/Feiertage'
  import calSettingsBox from '@/components/calSettingsBox'
  import Infobox from './infobox'


  export default {
    name: 'Urlaubskalender',
    components: {Infobox, Feiertage, dayBox, catEditBox, calSettingsBox},
    props: ['year', 'calID', 'Feiertage'],
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
        changed: null,
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
          this.$store.commit('removeAllClicked')
          this.selectedCat = null
          this.$store.dispatch('setClicked', {"dayID": event.target.id, "calID": this.calID})
        }
        else if (!this.containsObject(this.$store.state.element_map[this.calID][event.target.id], this.$store.state.clicked)) {
          this.$store.dispatch('setClicked', {"dayID": event.target.id, "calID": this.calID})
        }
        else {
          this.$store.dispatch('removeClicked', {"dayID": event.target.id, "calID": this.calID})
        }
      },
      selectDays(event) {
        if(event.buttons === 1 || event.buttons === 3){
          if (!event.ctrlKey && !event.metaKey && ! this.$store.state.locked) {
            this.$store.commit('removeAllClicked')
            this.selectedCat = null
            this.$store.dispatch('setClicked', {"dayID": event.target.id, "calID": this.calID})
          }
          else if (!this.containsObject(this.$store.state.element_map[this.calID][event.target.id], this.$store.state.clicked)) {
            this.$store.dispatch('setClicked', {"dayID": event.target.id, "calID": this.calID})
          }
          else {
            this.$store.dispatch('removeClicked', {"dayID": event.target.id, "calID": this.calID})
          }
        }
      },
      click_on_cat (catID) {
        if(this.$store.state.clicked.length > 0){
          //this.changed = JSON.parse(JSON.stringify(this.$store.state.clicked))
          this.$store.dispatch('changeCatDropDown', {catID: catID, calID: this.calID})
        }
        else{
          if(catID !== this.selectedCat && parseInt(catID) !==  0){
            this.selectedCat = catID //to be deleted
            this.$store.commit('setClickedCatCounter', {catID: catID, calID: this.calID})
            this.$store.commit('setClickedCatName', this.$store.getters.getCats(this.calID)[catID].name)
            this.catName = this.$store.getters.getCats(this.calID)[this.selectedCat].name
            this.catColor = this.$store.getters.getCats(this.calID)[this.selectedCat].style
          }
        }
      },
      resetCats(){
        var payload = {
          days: this.changed,
          calID: this.calID
        }
        this.$store.commit('resetClickedCat', this.changed)
        return resetCats(payload, this.$store.state.jwt.token)
          .then(response => {
            this.$store.commit('replaceUserdayID', response.data)
            this.changed = null
        })
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
        this.$nextTick(() => {
          document.getElementById("newCat").focus();
          document.getElementById("newCat").select();
        });
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
      this.$store.commit('setCurrentCal', this.calID)
      this.$store.dispatch('ready', [this.calID, this.year])
      this.getCal(this.calID, this.$store.state.jwt.token)
      var currentTime = new Date();
      this.currentMonth = currentTime.getMonth() + 1;
      this.currentDay = currentTime.getDate();
      this.currentYear = currentTime.getFullYear()
    }
  }
</script>


<style>
  .selection-area {
    outline: 1px solid rgba(0, 128, 255, 0.6);
    background-color: rgba(0, 128, 255, 0.2);
  }
  body{
    background-color: #fff;
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
    background: #f0f8ff;
    margin-top: 20px;
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
      margin-right: 1%;
    }
  }
  @media only screen and (max-width: 600px) {
    .monat {
      margin: auto;
      margin-top: 20px;
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
    background-color: aliceblue !important;
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
  #home, #settings, #reset {
    margin: 5px;
    display: block;
    float: left;
    cursor: pointer;
  }
  .wochentag, .monatstitel {
    background-color: #d9f0ff;
    text-align: center;
    margin-top: 0;
  }
  .jahrtitel {
    display: inline-block;
    padding: 10px;
    margin: 10px;
  }
  .year{
    display: inline-block;
  }
  .monatstitel {
    padding: 3px 10px 3px 10px;
    margin-bottom: 5px
  }
  .wochentag {
    margin-bottom: 3px
  }
  .counters {
    display: flow-root;
    position: sticky;
    top: 5px;
    background-color: #f0f8ff;
    box-shadow: 5px 2.5px 2.5px grey;
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
