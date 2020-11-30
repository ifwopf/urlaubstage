<template>
  <div class="counters">
    <div v-for="calender in $store.getters.getMergedCals" class="calCats"
         v-if="$store.state.activeCal === -1 || $store.state.activeCal === calender.id" :id="calender.id">
      <span class="calTitle">{{calender.name}}</span>
      <span class="count" v-for="cat in $store.getters.getCats(calender.id)" :id="cat['id']"
            :key="cat.id"
            :style="cat.style" @click="click_on_cat(cat.id, calender.id)">
        {{ cat.name }}
        <i class="material-icons" v-show="parseInt(selectedCat)===cat.id" @click="showCatEdit">settings_applications</i>
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'mergedCatBox',
    props: ['admin'],
    data () {
      return {
        cat_box: false,
        edit_box: false,
        catName: '',
        catColor: '',
        selectedCat: null,
      }
    },
    methods: {
      selectAll (catID) {
        this.selectedCat = null
        if (!event.ctrlKey && !this.$store.state.locked) {
          // clearClicked
          this.$store.dispatch('resetClicked')
        }
        for (var i = 0; i < 12; i++) {
          for (var j = 0; j < this.$store.getters.getInfo[i].length; j++) {
            var day = this.$store.getters.getInfo[i][j]
            if (parseInt(day.cat_id) === parseInt(catID)) {
              if (this.containsObject(this.$store.state.element_map[day.id], this.$store.state.clicked)) {

              }
              else {
                this.$store.dispatch('setClicked', day.id)
              }
            }
          }
        }
      },
      click_on_cat (catID, calID) {
        if(this.$store.state.clicked.length > 0){
          var payload = {"calID" : calID, "catID": catID }
          this.$store.dispatch('changeCatDropDown', payload)
        }
        else{
          if(catID !== this.selectedCat && this.admin){
            this.selectedCat = catID
            this.$store.commit('setClickedCatCounter', {catID: parseInt(catID), calID: calID})
            this.$store.commit('setClickedCatName', this.$store.getters.getCats(calID)[catID].name)
            this.catName = this.$store.getters.getCats(calID)[this.selectedCat].name
            this.catColor = this.$store.getters.getCats(calID)[this.selectedCat].style
          }
        }
      },
      showCatEdit () {
        this.$store.commit('showCatEdit')
      },
      openAddCat () {
        this.$store.commit('setClickedCatName', '')
        this.$store.commit('setCatColor', 'rgb(255, 255, 255)')
        this.$store.dispatch('editCatDisplay')
      }
    },
  }
</script>

<style scoped>

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
  .count{
    margin: 5px;
    display: block;
    float: left;
    padding: 3px 6px;
    cursor: pointer;
    height: 24px;
    line-height: 24px;
    font-weight: bold;
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
    min-height: 10%;
  }

  .material-icons {
    cursor: pointer;
    vertical-align: middle;
  }
  #plus {
    padding: 3px;
    margin: 5px;
    float: left;
  }

  .calCats{
    display: flex;
  }

</style>
