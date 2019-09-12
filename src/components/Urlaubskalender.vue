<template>
  <div v-if="$store.state.dataReady">
    <h1 class="jahrtitel">2019</h1>
    <div class="counters">
      <span class="count" v-if="cat.id!==1" v-for="cat in $store.getters.getCats" v-bind:id="cat['id']" v-bind:key="cat.id"
            :style="cat.style">{{ cat['name']}} : {{ $store.getters.getCatCount(cat.id)}}</span>
    </div><br/>

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
        <div class="tagrahmen" v-bind:id="day.id" v-for="day in month" v-bind:style="[$store.getters.getElementMapByIDStyle(day.id), $store.getters.getCatByID(day.cat_id).style,
        day.clicked ? {'border-color': 'red'} : {'border-color': 'white'}]" v-bind:key="day.id">
          <div class="tag" v-if="day['weekday']=== 'Samstag' && day.cat_id === 1" :month_id="day.month-1" v-bind:key="day.id" ref="tag"
               v-bind:id="day['id']"
               style="color: darkgrey"
               >
            {{ day['day'] }}
          </div>
          <div class="tag" v-else-if="day['weekday']=== 'Sonntag' && day.cat_id === 1" :month_id="day.month-1" v-bind:key="day.id" ref="tag"
               v-bind:id="day['id']"
               style="color: darkred"
               >
            {{ day['day'] }}
          </div>
          <div class="tag" v-else-if="true" :month_id="day.month-1" v-bind:key="day.id" ref="tag" v-bind:id="day['id']"
               v-bind:style=""
               >
            {{ day['day'] }}
          </div>
        </div>
      </div>
    </div>
    <div class="edit_box_shadow">&nbsp;</div>
    <day-box/>
  </div>
</template>

<script>
  import axios from 'axios'
  import {mapGetters} from 'vuex'
  import * as Selection from "@simonwep/selection-js";
  import dayBox from '@/components/dayBox'

  export default {
    name: 'Urlaubskalender',
    components: {dayBox},
    created () {
      // fetch the data when the view is created and the data is
      // already being observed
      this.$store.dispatch('ready')
    },
    data () {
      return {
        cat_box: false,
        edit_box: false,
        top: 0,
        left: 0,
        cat_name: '',
        in_cat_name: '',
        in_cat_color: '',
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
        }
      }
    },
    computed: {
      ...mapGetters([
        'getCatByID',
        'getInfo',
        'getCats',
        'getCatCount',
      ])
    },
    methods: {
      ...mapGetters([
        'getElementMapByIDStyle'
      ]),
      mouse_on_day (event) {
        if(!this.containsObject(this.$store.state.element_map[event.target.id], this.$store.state.clicked)){
          this.$store.dispatch('setClicked', event.target.id)
        }
        else{
          this.$store.dispatch('removeClicked', event.target.id)
        }
      },
      open_edit (event) {
        this.clicked_cat = event.target.id
        this.in_cat_name = this.cats[this.clicked_cat].name
        this.in_cat_color = this.cats[this.clicked_cat].style['background-color']
        this.edit_box = !this.edit_box
      },
      containsObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
          if (list[i] === obj) {
            return true;
          }
        }
        return false;
      }
    },
    mounted() {
      Selection.create({

        // Class for the selection-area-element
        class: 'selection-area',

        // px, how many pixels the point should move before starting the selection
        startThreshold: 10,

        // Disable the selection functionality for touch devices
        disableTouch: false,

        // On which point an element should be selected.
        // Available modes are cover (cover the entire element), center (touch the center) or
        // the default mode is touch (just touching it).
        mode: 'touch',

        // Enable single-click selection (Also disables range-selection via shift + ctrl)
        singleClick: true,

        // Query selectors from elements which can be selected
        selectables: [".tagrahmen"],

        // Query selectors for elements from where a selection can be start
        startareas: ['html'],

        // Query selectors for elements which will be used as boundaries for the selection
        boundaries: ['html'],

        // Query selector or dom node to set up container for selection-area-element
        selectionAreaContainer: 'body',

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
        if (!evt.oe.ctrlKey && !evt.oe.metaKey) {
          // clearClicked
          this.$store.dispatch('resetClicked')
          // Unselect all elements
          for (const el of evt.selected) {
            el.classList.remove('selected');
            evt.inst.removeFromSelection(el);
          }
          // Clear previous selection
          evt.inst.clearSelection();
        }

      }).on('move', evt => {
        for (const el of evt.selected) {
          if (this.containsObject(this.$store.state.element_map[el.id], this.$store.state.clicked)){
          }
          else {
            //console.log(el)
            //console.log(el.id)
            this.$store.dispatch('setClicked', el.id)
          }
          el.classList.remove('selected');
          evt.inst.removeFromSelection(el);
        }
        //console.log('move', evt);
      }).on('stop', evt => {
        //console.log('stop', evt);
      });
    }
  }
</script>


<style>
  .selection-area {
    outline: 1px solid rgba(0, 128, 255, 0.6);
    background-color: rgba(0, 128, 255, 0.2);
  }
</style>
<style scoped>
  .grid {
    display: grid;
    grid-template-columns: 14% 14% 14% 14% 14% 14% 14%;
    grid-template-rows: 25px 25px 25px 25px 25px 25px;
    text-align:center;

  }

  .monat {
    flex: 1;
    width: 100%;
  }

  @media only screen and (min-width: 451px) {
    .monat {
      max-width: 450px;
      display: inline-block;
      vertical-align: top;
      margin-right: 10px;
    }
  }

  @media only screen and (max-width: 450px) {
    .monat {
      margin: auto;
    }
  }


  .tag {
    padding: 1px;
    border: none;

  }
  .tagrahmen{
    border-radius: 15%;
    margin: 1px;
    cursor: pointer;
  }

  .cat_box {
    background-color: beige;
    display: inline-block;
    text-align: center;
    height: 30%;
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100%;
    opacity: 1;
  }

  .edit_box {
    background-color: beige;
    display: inline-block;
    text-align: center;
    height: 30%;
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100%;
    opacity: 1;
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

  .count {
    margin: 5px;
    display:block;
    float:left;
    border-radius: 15%;
    padding: 3px;
  }
  .wochentag, .monatstitel, .jahrtitel{
    color: #426BC0;
    background-color: ivory;
    text-align: center;
    width: inherit;
  }
  .counters{
    display:flow-root;
  }
</style>
