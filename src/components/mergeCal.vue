<template>
  <div class="wrapper" v-if="$store.state.mergeReady">
    <h1 class="jahrtitel">
      <i class="material-icons" id="home" @click="redirect2('/#/calOverview')">
        home
      </i>
      <div id="view" @click="changeView"><span v-if="weekView">M</span><span v-else>W</span></div>
      <span class="year">
          <i v-if="year != borderyears[0]" class="material-icons arrow"
             @click="changeYear(false)">keyboard_arrow_left</i>
          {{ year }}
          <i v-if="year != borderyears[1]" class="material-icons arrow"
             @click="changeYear(true)">keyboard_arrow_right</i>
      </span>

    </h1>
    <merged-cat-box :admin="true"/>

    <div v-if="weekView">
      <div class="grid" v-for="(month,index) in months_en">
        <div class="monatstitel" :id="index" v-bind:style="{ 'grid-row': 1, 'grid-column':'1/9'}"
             :class="{ 'currentDate': index == currentMonth && year == currentYear}" @click="toggleActive(index)">
          {{month}}
        </div>
        <div v-if="activeMonths.includes(index)" class="wochentag" style="grid-row: 2; grid-column: 2">Mo</div>
        <div v-if="activeMonths.includes(index)" class="wochentag" style="grid-row: 2; grid-column: 3">Di</div>
        <div v-if="activeMonths.includes(index)" class="wochentag" style="grid-row: 2; grid-column: 4">Mi</div>
        <div v-if="activeMonths.includes(index)" class="wochentag" style="grid-row: 2; grid-column: 5">Do</div>
        <div v-if="activeMonths.includes(index)" class="wochentag" style="grid-row: 2; grid-column: 6">Fr</div>
        <div v-if="activeMonths.includes(index)" class="wochentag" style="grid-row: 2; grid-column: 7">Sa</div>
        <div v-if="activeMonths.includes(index)" class="wochentag" style="grid-row: 2; grid-column: 8">So</div>
        <template v-for="(calender, jindex) in $store.getters.getMergedCals" v-if="$store.getters.getInfo(calender.id) !== undefined">
          <template v-if="jindex==0 && activeMonths.includes(index)"
                    v-for="day in $store.getters.getInfo(calender.id)[index]">
            <div class="datum"
                 :class="{ 'currentDate': (day.day==currentDay && day.month-1 == currentMonth && year == currentYear)}"
                 v-if="activeMonths.includes(index)"
                 :style="{'grid-column': weekday[day.weekday], 'grid-row': getRow(weekday[day.weekday],
                 day.day, $store.getters.getMergedCals.length)+(3)}">
              {{ day.day }}
            </div>
            <div class="kw" @click="toggleActiveWeeks(getKW(day.year, day.month, day.day))"
                 v-if="activeMonths.includes(index) && (weekday[day.weekday]==2 || day.day == 1)"
                 :style="{'grid-column': 1, 'grid-row': getRow(weekday[day.weekday], day.day, $store.getters.getMergedCals.length)+(3)}">
              KW{{getKW(day.year, day.month, day.day)}}
            </div>
          </template>
          <div v-for="j in getWeekAmount($store.getters.getInfo(calender.id)[index])" class="calender"
               v-if="activeMonths.includes(index) && activeWeeks.includes(getWeekNr(j, $store.getters.getInfo(calender.id)[index]))"
               v-bind:style="[{'grid-row': 4+jindex+(($store.state.checkedCalenders.length+1)*(j-1)), 'grid-column': 1}]">
            {{calender.name}}
          </div>
          <div class="tagrahmen"
               v-for="day in $store.getters.getInfo(calender.id)[index]" :id="'d'+day.id+'u'+jindex"
               v-if="activeMonths.includes(day.month-1) &&
                activeWeeks.includes(getKW(day.year, day.month, day.day))"
               :dayID="day.id" :calID="day.calID" :key="day.id+'u'+jindex"
               @click="mouse_on_day($event)"  v-on:mouseenter="selectDays"
               :style="[$store.getters.getElementMapByIDStyle(day.id, day.calID),
               $store.getters.getCatByID(day.cat_id, day.calID).style,
               day.clicked ? {'border-color': 'black'} : {'border-color': 'lightgrey'},
               {'grid-column': weekday[day.weekday], 'grid-row': getRow(weekday[day.weekday], day.day,
               $store.state.checkedCalenders.length)+4+jindex}]">
          </div>

        </template>

      </div>
    </div>
    <div v-if="!weekView">
      <div class="gridMonth" v-for="(month,index) in this.months_en">
        <div class="monatstitel" :id="index" v-bind:style="{ 'grid-row': 1}"
             :class="{ 'currentDate': index == currentMonth}" @click="toggleActive(index)">
          {{month}}
        </div>
        <template v-for="(calender, jindex) in $store.getters.getMergedCals" >
          <template v-if="jindex==0 && activeMonths.includes(index)" v-for="day in $store.getters.getInfo(calender.id)[index]">
            <div  class="datum" :class="{ 'currentDate': (day.day==currentDay && day.month-1 == currentMonth)}"
                  :style="{'grid-column': day.day +1, 'grid-row': jindex+1}">
              {{ day.day }}
            </div>
            <div  class="weekday" :class="{ 'currentDate': (day.day==currentDay && day.month-1 == currentMonth)}"
                  :style="{'grid-column': day.day +1, 'grid-row': jindex+2}">
              {{ day.weekday.substring(0,1) }}
            </div>
          </template>
          <div  v-if="activeMonths.includes(index)"
               class="calender"
               v-bind:style="[{'grid-row': jindex+3, 'grid-column': 1}]">
            {{calender.name}}
          </div>
          <div class="tagrahmen"
               v-for="day in $store.getters.getInfo(calender.id)[index]" :id="'d'+day.id+'u'+jindex"
               v-if="activeMonths.includes(day.month-1)"
               :dayID="day.id" :calID="day.calID" :key="day.id+'u'+jindex"
               @click="mouse_on_day($event)" v-on:mouseenter="selectDays"
               :style="[
               $store.getters.getElementMapByIDStyle(day.id, day.calID),
               $store.getters.getCatByID(day.cat_id, day.calID).style,
               day.clicked ? {'border-color': 'black'} : {'border-color': 'lightgrey'},
               {'grid-column': day.day+1, 'grid-row': jindex+3}]">
          </div>

        </template>

      </div>
    </div>

    <div class="edit_box_shadow">&nbsp;</div>
    <day-box :unreg="0" :shared="false"/>
    <cat-edit-box :unreg="0" :calID="$store.state.clickedCatCal"/>
    <infobox/>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import dayBox from '@/components/dayBox'
  import catEditBox from '@/components/catEditBox'
  import mergedCatBox from '@/components/mergedCatBox'
  import infobox from '@/components/infobox'
  import deleteBox from '@/components/deleteBox'
  import {getCalName, getUserRole} from '@/api'
  import MergedCatBox from './mergedCatBox'

  Date.prototype.getWeek = function () {
    var date = new Date(this.getTime())
    date.setHours(0, 0, 0, 0)
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7)
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4)
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
      - 3 + (week1.getDay() + 6) % 7) / 7)
  }
  export default {
    name: 'mergeCal',
    props: ['calID', 'calID2', 'year'],
    components: {MergedCatBox, infobox, dayBox, catEditBox, deleteBox},
    data () {
      return {
        calName: '',
        borderyears: [2020, 2022],
        months_en: [
          'Januar',
          'Februar',
          'März',
          'April',
          'Mai',
          'Juni',
          'Juli',
          'August',
          'September',
          'Oktober',
          'November',
          'Dezember'
        ],
        weekday: {
          'Montag': 2,
          'Dienstag': 3,
          'Mittwoch': 4,
          'Donnerstag': 5,
          'Freitag': 6,
          'Samstag': 7,
          'Sonntag': 8
        },
        activeMonths: [],
        activeWeeks: [],
        currentMonth: null,
        currentDay: null,
        weekView: true,
      }

    },

    created () {
      var currentTime = new Date()
      this.activeMonths.push(currentTime.getMonth())
      this.currentMonth = currentTime.getMonth()
      this.currentDay = currentTime.getDate()
      this.currentYear = currentTime.getFullYear()
      this.activeWeeks.push(currentTime.getWeek())
      this.$store.dispatch('mergeReady', this.year)
      //this.getCal(this.calID, this.$store.state.jwt.token)
    },
    computed: {
      ...mapGetters([
        'getCatByID',
        'getInfo',
        'getCats',
        'getCatCount',
        'getMergedData'
      ])
    },
    methods: {
      redirect (comp, parameters) {
        this.$store.dispatch('resetClicked')
        this.$router.push({name: comp, params: parameters})
        this.$store.dispatch('mergeReady', parameters.year)
        //location.reload()
      },
      redirect2 (link) {
        window.location.href = link
      },
      changeYear (direction) {
        if (direction) {
          var yearString = String(parseInt(this.year) + 1)
          this.redirect('mergeCal', {year: yearString})
        }
        else {
          var yearString = String(parseInt(this.year) - 1)
          this.redirect('mergeCal', {year: yearString})
        }
      },
      mouse_on_day (event) {
        if (!event.ctrlKey && !event.metaKey && !this.$store.state.locked) {
          this.$store.commit('removeAllClicked')
        }
        if (this.$store.state.clicked.length > 0) {
          const calID = event.target.getAttribute('calID')
          if (this.$store.state.clicked[0].calID == calID){
            const dayID = event.target.getAttribute('dayid')
            if (!this.containsObject(this.$store.state.element_map[calID][dayID], this.$store.state.clicked)) {
              this.$store.dispatch('setClicked', {'dayID': dayID, 'calID': calID})
              this.$store.commit('setActiveCal', calID)
            }
            else {
              this.$store.dispatch('removeClicked', {'dayID': dayID, 'calID': calID})
            }
          }
          else {
            this.$store.commit('setInfoText', 'Du kannst nur jeweils Tage eines Kalenders wählen!')
          }
        }
        else {
          this.$store.dispatch('setClicked', {'dayID': event.target.getAttribute('dayid'),
            'calID': event.target.getAttribute('calid')})
          this.$store.commit('setActiveCal', event.target.getAttribute('calid'))
        }
      },
      selectDays(event) {
        if(event.buttons === 1 || event.buttons === 3){
          if (!event.ctrlKey && !event.metaKey && !this.$store.state.locked) {
            this.$store.commit('removeAllClicked')
          }
          if (this.$store.state.clicked.length > 0) {
            const calID = event.target.getAttribute('calID')
            if (this.$store.state.clicked[0].calID == calID){
              const dayID = event.target.getAttribute('dayid')
              if (!this.containsObject(this.$store.state.element_map[calID][dayID], this.$store.state.clicked)) {
                this.$store.dispatch('setClicked', {'dayID': dayID, 'calID': calID})
                this.$store.commit('setActiveCal', calID)
              }
              else {
                this.$store.dispatch('removeClicked', {'dayID': dayID, 'calID': calID})
              }
            }
            else {
              this.$store.commit('setInfoText', 'Du kannst nur jeweils Tage eines Kalenders wählen!')
            }
          }
          else {
            this.$store.dispatch('setClicked', {'dayID': event.target.getAttribute('dayid'),
              'calID': event.target.getAttribute('calid')})
            this.$store.commit('setActiveCal', event.target.getAttribute('calid'))
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
      toggleActive (id) {
        if (this.activeMonths.includes(id)) {
          const index = this.activeMonths.indexOf(id)
          this.activeMonths.splice(index, 1)
        }
        else {
          this.activeMonths.push(id)
        }
      },
      toggleActiveWeeks (kw) {
        if (this.activeWeeks.includes(kw)) {
          const index = this.activeWeeks.indexOf(kw)
          this.activeWeeks.splice(index, 1)
        }
        else {
          this.activeWeeks.push(kw)
        }
      },
      getRow (weekday, date, userAmount) {
        var row = Math.floor((date) / 7)
        var modulo = (date) % 7
        var tag = weekday - 1
        if (modulo > tag) {
          row++
        }
        if (modulo == 0 && tag == 7) {
          row--
        }
        row = row * (1 + userAmount)
        return row
      },
      getWeekNr (j, month) {
        //getKW(userCal[getFirstIndexOfWeek(j,userCal[0])].year,userCal[getFirstIndexOfWeek(j,userCal[0])].month,
        // userCal[getFirstIndexOfWeek(j,userCal[0])].day))"
        const firstDayOfMonth = month.reduce((prev, current) => (+prev.day < +current.day) ? prev : current)
        const firstDayOfWeek = this.getFirstIndexOfWeek(j, firstDayOfMonth)
        const day = month.find(x => x.day === firstDayOfWeek + 1)
        return this.getKW(day.year, day.month, day.day)
      },
      getFirstIndexOfWeek (j, firstdayMonth) {
        var distanceToMonday = this.weekday[firstdayMonth.weekday] - 2
        if (j - 1 == 0) {
          return 0
        }
        else {
          return (j - 1) * 7 - distanceToMonday
        }
      },
      getWeekAmount (month) {
        var lastDay = month.reduce((prev, current) => (+prev.day > +current.day) ? prev : current)
        var row = Math.ceil((lastDay.day) / 7)
        var modulo = (lastDay.day - 1) % 7
        var tag = (this.weekday[lastDay.weekday] - 1)
        if (modulo >= tag) {
          row++
        }
        return row
      },
      getKW (year, month, day) {
        var datum = new Date(year, month - 1, day)
        var kw = datum.getWeek()
        return (kw)
      },
      getCal (calID, token) {
        return getCalName(calID, token)
          .then(response => {
            this.calName = response.data
          })
          .catch(error => {
            console.log('Error Authenticating: ', error)
          })
      },
      getCurrentUserRole (calID, token) {
        return getUserRole(calID, token)
          .then(response => {
            this.user = response.data
          })
          .catch(error => {
            console.log('Error Authenticating: ', error)
          })
      },
      changeView () {
        this.weekView = !this.weekView
      },
      showDeleteBox () {
        this.$store.commit('setDeleteBox', 'Willst du wirklich aus diesem Team-Kalender austreten?')
      }
    },

  }
</script>
<style>
  body {
    background-color: #fff;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently supported by Chrome, Opera and Firefox */
  }

  .selection-area {
    outline: 1px solid rgba(0, 128, 255, 0.6);
    background-color: rgba(0, 128, 255, 0.2);
  }
</style>
<style scoped>
  .sticky {
    position: sticky;
  }

  .grid {
    display: grid;
    text-align: center;
    line-height: 1.3;
    grid-auto-flow: column;
    grid-template-columns: 30% 10% 10% 10% 10% 10% 10% 10%;
    margin-top: 10px;
    border: 1px solid aliceblue;
    background: aliceblue;
  }

  .gridMonth {
    display: grid;
    text-align: center;
    line-height: 1.3;
    grid-auto-flow: column;
    grid-template-columns: 20% repeat(31, 1fr);
    margin-top: 20px;
    background: #f0f8ff;
  }

  .tagrahmen {
    cursor: pointer;
    margin: 1px;
    border: 1px solid;
    line-height: 2;
  }

  .tagrahmen:hover, .monatstitel:hover {
    background-color: aliceblue !important;
  }

  .wochentag {

    margin-top: 5px;
    margin-bottom: 5px;
  }


  .monatstitel {
    background-color: #d9f0ff;
    padding: 3px;
    font-size: 18px;
    cursor: pointer;
  }

  .jahrtitel {
    display: inline-block;
    padding: 10px;
    margin: 10px;
    color: #000;
    text-align: center;
  }

  #home, #settings, .arrow, #view, #leave {
    cursor: pointer;
  }

  #home, #settings, #view, #leave {
    border: none;
    float: left;
    display: block;
    margin: 5px;
  }

  #view {
    line-height: 1;
    font-size: 24px;
  }

  @media only screen and (max-width: 700px) {
    #view  {
      display: none;
    }
  }

  .calender {
    line-height: 2;
    font-weight: bold;
  }


  .currentDate {
    background-color: #b7e1fc !important;
  }

  .kw, .datum {
    line-height: 2;
    background-color: #d9f0ff;
  }

  .kw {
    cursor: pointer;
    min-width: 100px;

  }

  .kw:hover {
    background-color: aliceblue;
  }

  .wrapper {
    max-width: 1200px;
    text-align: center;
    padding: 8px;
    margin: auto;
  }

  .year {
    display: inline-block;
  }

</style>

