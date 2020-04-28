<template>
  <div style="text-align: center" v-if="$store.state.sharedDataReady">
    <h1 class="jahrtitel">
      <i class="material-icons" id="home" @click="redirect('/#/calOverview')">
        home
      </i>
      {{calName}} {{year}}
    </h1>
    <cat-box/>

    <div class="grid" v-for="(month,index) in $store.getters.getSharedInfo">
      <div class="monatstitel" :id="index" v-bind:style="{ 'grid-row': 1, 'grid-column':'1/9'}"
           :class="{ 'currentDate': index == currentMonth}" @click="toggleActive(index)">
        {{months_en[index]}}
      </div>

      <div v-if="activeMonths.includes(index)" class="wochentag" style="grid-row: 2; grid-column: 2">Mo</div>
      <div v-if="activeMonths.includes(index)" class="wochentag" style="grid-row: 2; grid-column: 3">Di</div>
      <div v-if="activeMonths.includes(index)" class="wochentag" style="grid-row: 2; grid-column: 4">Mi</div>
      <div v-if="activeMonths.includes(index)" class="wochentag" style="grid-row: 2; grid-column: 5">Do</div>
      <div v-if="activeMonths.includes(index)" class="wochentag" style="grid-row: 2; grid-column: 6">Fr</div>
      <div v-if="activeMonths.includes(index)" class="wochentag" style="grid-row: 2; grid-column: 7">Sa</div>
      <div v-if="activeMonths.includes(index)" class="wochentag" style="grid-row: 2; grid-column: 8">So</div>
      <template v-for="(userCal, jindex) in month">
        <template v-if="jindex==0 && activeMonths.includes(index)" v-for="day in userCal">
          <div  class="datum" :class="{ 'currentDate': (day.day==currentDay && day.month-1 == currentMonth)}"
                v-if="activeMonths.includes(index)"
                 :style="{'grid-column': weekday[day.weekday], 'grid-row': getRow(weekday[day.weekday], day.day, month.length)+(3)}">
            {{ day.day }}
          </div>
          <div class="kw"
               v-if="activeMonths.includes(index) && (weekday[day.weekday]==2 || day.day == 1)"
               :style="{'grid-column': 1, 'grid-row': getRow(weekday[day.weekday], day.day, month.length)+(3)}">
            KW{{getKW(day.year, day.month, day.day)}}
          </div>
        </template>
        <div v-for="j in getWeekAmount(month[0])" class="user" v-if="activeMonths.includes(index)"
             v-bind:style="[{'grid-row': 4+jindex+(($store.getters.getSharedUsers.length+1)*(j-1)), 'grid-column': 1}]">
          {{$store.getters.getSharedUsers[jindex][1].split("@")[0]}}
        </div>
        <div  class="tagrahmen"
              v-for="day in userCal" :id="'d'+day.id+'u'+day.userID" v-if="activeMonths.includes(day.month-1)"
              :dayID="day.id" :userID="day.userID" :key="day.id+'u'+day.userID"
              @click="mouse_on_day" :style="[$store.getters.getElementMapByIDStyle(day.userID, day.id),
             $store.getters.getCatByID(day.cat_id).style,
             day.clicked ? {'border-color': 'black'} : {'border-color': 'lightgrey'},
             {'grid-column': weekday[day.weekday], 'grid-row': getRow(weekday[day.weekday], day.day, month.length)+4+jindex}]">
        </div>

      </template>
    </div>
    <div class="edit_box_shadow">&nbsp;</div>
    <day-box/>
    <cat-edit-box/>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import dayBox from '@/components/dayBox'
  import catEditBox from '@/components/catEditBox'
  import catBox from '@/components/catBox'
  import { getCalName } from '@/api'
  Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
      - 3 + (week1.getDay() + 6) % 7) / 7);
  }
  export default {
    name: 'sharedCal',
    props: ['calID'],
    components: {dayBox, catEditBox, catBox},
    data() {
      return {
        calName: '',
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
        currentMonth: null,
        currentDay: null,
        year: '2020',
      }
    },

    created () {
      // fetch the data when the view is created and the data is
      // already being observed
      //$(".second_div").css({'width': ($(".first_div").width() + 'px')});
      this.$store.dispatch('sharedReady', this.calID);
      var currentTime = new Date();
      this.activeMonths.push(currentTime.getMonth())
      this.currentMonth = currentTime.getMonth()
      this.currentDay = currentTime.getDate()
      this.getCal(this.calID, this.$store.state.jwt.token)
    },
    computed: {
      ...mapGetters([
        'getCatByID',
        'getInfo',
        'getCats',
        'getCatCount',
        'getSharedInfo'
      ])
    },
    methods: {
      redirect (link) {
        window.location.href = link
      },
      mouse_on_day (event) {
        if (!event.ctrlKey && !event.metaKey && !this.$store.state.locked) {
          // clearClicked
          this.$store.dispatch('resetClicked')
          this.selectedCat = null
          this.dummy = "fdsasdfds"
        }
        if (!this.containsObject(this.$store.state.element_map[event.target.getAttribute('userid')][event.target.getAttribute('dayid')]
          , this.$store.state.clicked)) {
          var payload = {"dayID": event.target.getAttribute('dayid'), "uID": event.target.getAttribute('userid')}
          this.$store.dispatch('setClicked', payload)
          this.$store.state.currentUser = "fdsfddass"
        }
        else {
          var payload = {"dayID": event.target.getAttribute('dayid'), "uID": event.target.getAttribute('userid')}
          this.$store.dispatch('removeClicked', payload)
          this.dummy = "fdsfdasd"
        }
        this.$forceUpdate();
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
        if (this.activeMonths.includes(id)){
          const index = this.activeMonths.indexOf(id);
          this.activeMonths.splice(index, 1)
        }
        else{
          this.activeMonths.push(id)
        }
      },
      getRow(weekday, date, userAmount) {
        var row = Math.floor((date) / 7)
        var modulo = (date) % 7
        var tag = weekday-1
        if (modulo>tag){
          row++
        }
        if(modulo == 0 && tag == 7) {
          row--
        }
        row = row * (1 + userAmount)
        return row
      },
      getWeekAmount(month) {
        var lastDay = month[month.length - 1]
        var row = Math.ceil((lastDay.day) / 7)
        var modulo = (lastDay.day-1) % 7
        var tag = (this.weekday[lastDay.weekday]- 1)
        if (modulo>=tag){
          row++
        }
        return row
      },
      getKW (year, month, day) {
        var datum = new Date(year,month-1,day);
        const kw = datum.getWeek();
        return(kw);
      },
      getCal (calID, token) {
        return getCalName(calID, token)
          .then(response => {
            this.calName = response.data;
          })
          .catch(error => {
            console.log('Error Authenticating: ', error)
            EventBus.$emit('failedAuthentication', error)
          })
      }
    },

  }
</script>

<style scoped>
  .sticky{
    position: sticky;
  }
  .grid {
    display: grid;
    text-align: center;
    line-height: 1.3;
    grid-auto-flow: column;
    min-width: 800px;
    grid-template-columns: auto;
  }
  .tagrahmen {
    cursor: pointer;
    margin: 1px;
    border-width: 1px;
    border-style: solid;
    border-color: lightgrey;
    height: 20px
  }
  .monatstitel {
    background-color: #f1f1f1;
    margin-top: 10px;
    padding: 3px;
    font-size: 18px;
    cursor: pointer;
  }

  .jahrtitel {
    background-color: #f1f1f1;
    display: inline-block;
    padding: 10px;
    margin: 10px;
    color: #000;
    background-color: #f1f1f1;
    text-align: center;
  }
  #home {
    margin: 5px;
    display: block;
    float: left;
    cursor: pointer;
    border: 1px solid #000;
  }

  .user {
    background-color: ghostwhite;
  }
  .currentDate{
    background-color: lightgoldenrodyellow !important;
  }
</style>
