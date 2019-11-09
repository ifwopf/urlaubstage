<template>
  <div v-if="$store.state.catEditBox" class="centerBox">
    <span class="nameDisplay" v-if="!editName" :style="{backgroundColor: catColor}">
          {{ $store.getters.getCatByID(this.$store.state.clickedCatCounter).name }}
        </span>
    <input class="nameDisplay input" v-model="catNameInit" @change="" @click.stop="" type="text"
           :style="{backgroundColor: catColor}" v-if="editName"/>
    <i class="material-icons" @click="reset" v-if="editName || editColor">arrow_back</i>
    <i class="material-icons" @click="changeName" v-if="editName">save</i>
    <i class="material-icons catEdits md-48" v-if="!editName && !editColor" @click.stop="deleteCat" id="deleteCat">delete</i>
    <i class="material-icons catEdits md-48" v-if="!editName && !editColor" @click.stop="showColorEdit" id="editCatColor">color_lens</i>
    <i class="material-icons catEdits md-48" v-if="!editName && !editColor" @click.stop="showNameEdit" id="editCatName">edit</i>
    <i class="material-icons" v-if="editColor" @click="changeColor">save</i>
    <i class="material-icons md-48" @click.stop="closeCatEditBox">clear</i>



    <div v-if="editColor" class="gridContainer">
      <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(255, 255, 255)' }"
           @click="setColor" style="grid-column: 1; grid-row: 1; background-color: rgb(255, 255, 255)"></div>
      <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(255, 255, 153)' }"
           @click="setColor" style="grid-column: 2; grid-row: 1; background-color: rgb(255, 255, 153)"></div>
      <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(255, 255, 0)' }"
           @click="setColor" style="grid-column: 3; grid-row: 1; background-color: rgb(255, 255, 0)"></div>
      <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(255, 153, 0)' }"
           @click="setColor" style="grid-column: 4; grid-row: 1; background-color: rgb(255, 153, 0)"></div>
      <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(204, 255, 51)' }"
           @click="setColor" style="grid-column: 1; grid-row: 2; background-color: rgb(204, 255, 51)"></div>
      <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(102, 255, 51)' }"
           @click="setColor" style="grid-column: 2; grid-row: 2; background-color: rgb(102, 255, 51)"></div>
      <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(51, 204, 51)' }"
           @click="setColor" style="grid-column: 3; grid-row: 2; background-color: rgb(51, 204, 51)"></div>
      <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(0, 255, 255)' }"
           @click="setColor" style="grid-column: 4; grid-row: 2; background-color: rgb(0, 255, 255)"></div>
      <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(51, 204, 255)' }"
           @click="setColor" style="grid-column: 1; grid-row: 3; background-color: rgb(51, 204, 255)"></div>
      <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(102, 153, 255)' }"
           @click="setColor" style="grid-column: 2; grid-row: 3; background-color: rgb(102, 153, 255)"></div>
      <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(0, 102, 255)' }"
           @click="setColor" style="grid-column: 3; grid-row: 3; background-color: rgb(0, 102, 255)"></div>
      <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(153, 102, 0)' }"
           @click="setColor" style="grid-column: 4; grid-row: 3; background-color: rgb(153, 102, 0)"></div>
      <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(255, 204, 255)' }"
           @click="setColor" style="grid-column: 1; grid-row: 4; background-color: rgb(255, 204, 255)"></div>
      <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(255, 102, 204)' }"
           @click="setColor" style="grid-column: 2; grid-row: 4; background-color: rgb(255, 102, 204)"></div>
      <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(255, 102, 102)' }"
           @click="setColor" style="grid-column: 3; grid-row: 4; background-color: rgb(255, 102, 102)"></div>
      <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(255, 0, 0)' }"
           @click="setColor" style="grid-column: 4; grid-row: 4; background-color: rgb(255, 0, 0)"></div>
    </div>
  </div>
</template>
<script>


  import axios from 'axios'
  import {mapActions} from 'vuex'
  import {mapGetters} from 'vuex'

  export default {
    name: 'catEditBox',
    data () {
      return {
        catName: null,
        catColor: this.$store.state.cats[this.$store.state.clickedCatCounter].style['background-color'],
        editName: false,
        editColor: false,
        edit: false,
        colors: [{'background-color': '#b4b9cc'}, {'background-color': '#7387b0'}, {'background-color': '#ffca62'},
          {'background-color': '#ee5f82'}, {'background-color': '#f986a2'}, {'background-color': '#E0B3E6'},
          {'background-color': 'aquamarine'}]
      }
    },
    computed: {
      ...mapGetters([
        'getCatByID',
        'getInfo',
        'getCats',
        'getCatCount'
      ]),
      catNameInit:
        {
          get () {
            return this.$store.state.clickedCatName
          },
          set (val) {
            this.catName = val
          }
        }
    },
    methods: {
      deleteCat () {
        this.$store.commit('hideCatEdit')
        this.$store.dispatch('deleteCat', this.$store.state.clickedCatCounter)
      },
      changeName () {
        console.log(this.$store.state.clickedCatCounter)
        var payload = {'name': this.catName, 'id': this.$store.state.clickedCatCounter}
        this.$store.dispatch('changeCatName', payload)
        this.editName = false
      },
      changeColor () {
        var payload = {'catColor': this.catColor, 'id': this.$store.state.clickedCatCounter}
        this.$store.dispatch('changeCatColor', payload)
        this.editColor = false
      },
      showColorEdit () {
        this.editColor = true
        this.editName = false
        this.catColor = this.$store.state.cats[this.$store.state.clickedCatCounter].style['background-color']
      },
      showNameEdit () {
        this.editName = true
        this.editColor = false
      },
      closeCatEditBox () {
        this.catColor = this.$store.state.cats[this.$store.state.clickedCatCounter].style['background-color']
        this.$store.commit('hideCatEdit')
        this.editName = false
        this.editColor = false
      },
      reset() {
        this.editName = false
        this.editColor = false
        this.catColor = this.$store.state.cats[this.$store.state.clickedCatCounter].style['background-color']
      },
      setColor(e){
        this.catColor = e.target.style['background-color']
      }
    }
  }
</script>

<style scoped>
  .centerBox {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    box-shadow: 5px 2.5px 2.5px grey;
    border: solid;
    border-width: 0.5px;
    font-size: 24px;
    padding: 5px;
    text-align: center;
  }

  .material-icons {
    cursor: pointer;
  }

  .nameDisplay {
    display: block;
    width: 100%;
    text-align: center;
    font-size: 24px;
  }

  .gridContainer {
    display: grid;
  }
  .colorField {
    margin: 3px;
    cursor: pointer;
    width: 24px;
    height: 24px;
    border: 1px solid white;
  }
  .bordered{
    border: 1px solid black !important;
  }

</style>
