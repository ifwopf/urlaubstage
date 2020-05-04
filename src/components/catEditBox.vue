<template>
  <div v-if="$store.state.catEditBox || $store.state.border" class="centerBox">
    <span class="nameDisplay" v-if="!editName & !$store.state.border" :style="{backgroundColor: catColor}">
          {{ $store.getters.getCatByID(this.$store.state.clickedCatCounter).name }}
        </span>
    <input class="nameDisplay input" v-model="catNameInit" @change="" @click.stop="" type="text"
           :style="{backgroundColor: catColor}" v-if="editName || $store.state.border"/>
    <i class="material-icons" @click="reset" v-if="editName || editColor">arrow_back</i>
    <i class="material-icons" @click="changeName" v-if="editName">save</i>
    <i class="material-icons catEdits md-48" v-if="!editName && !editColor && !$store.state.border" @click.stop="deleteCat" id="deleteCat">delete</i>
    <i class="material-icons catEdits md-48" v-if="!editName && !editColor && !$store.state.border" @click.stop="showColorEdit" id="editCatColor">color_lens</i>
    <i class="material-icons catEdits md-48" v-if="!editName && !editColor && !$store.state.border" @click.stop="showNameEdit" id="editCatName">edit</i>
    <i class="material-icons" v-if="editColor" @click="changeColor">save</i>
    <i class="material-icons" v-if="$store.state.border" @click="addNewCat">save</i>
    <i class="material-icons md-48" @click.stop="closeCatEditBox">clear</i>




    <color-select v-if="editColor || $store.state.border"/>
  </div>
</template>
<script>


  import axios from 'axios'
  import {mapActions} from 'vuex'
  import {mapGetters} from 'vuex'
  import ColorSelect from './colorSelect'

  export default {
    name: 'catEditBox',
    components: {ColorSelect},
    data () {
      return {
        catName: null,
        editColor: false,
        editName: false,
        edit: false,
      }
    },
    computed: {
      ...mapGetters([
        'getCatByID',
        'getInfo',
        'getCats',
        'getCatCount'
      ]),
      catColor:
        {
          get() {
              return this.$store.state.catColor;
          },
          set(val){
            this.$store.state.commit('setCatColor', val)
          },
      },
      catNameInit:
        {
          get () {
            return this.$store.state.clickedCatName
          },
          set (val) {
            this.$store.commit('setClickedCatName', val)
          }
        }
    },
    methods: {
      deleteCat () {
        this.$store.commit('hideCatEdit')
        this.$store.dispatch('deleteCat', this.$store.state.clickedCatCounter)
      },
      changeName () {
        console.log(this.catNameInit)
        var payload = {'name': this.catNameInit, 'id': this.$store.state.clickedCatCounter}
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
        //this.catColor.set(this.$store.state.cats[this.$store.state.clickedCatCounter].style['background-color'])
      },
      showNameEdit () {
        this.editName = true
        this.editColor = false
      },
      closeCatEditBox () {
        //this.catColor = this.$store.state.cats[this.$store.state.clickedCatCounter].style['background-color']
        this.$store.commit('hideCatEdit')
        this.editName = false
        this.editColor = false
      },
      reset() {
        this.editName = false
        this.editColor = false
        this.$store.commit('setCatColor', this.$store.state.cats[this.$store.state.clickedCatCounter].style['background-color'])
      },
      setColor(e){
        this.$store.commit('setCatColor', e.target.style['background-color'])
      },
      addNewCat () {
        var doppelt = false
        for (var i = 0; i < this.$store.state.cats.length; i++) {
          if (this.catName === this.$store.state.cats[i].name) {
            doppelt = true
          }
        }
        if (!doppelt) {
          this.$store.dispatch('addCat', {catName: this.catNameInit, catColor: this.catColor})
          this.catName = ''

        }
      },
    }
  }
</script>

<style scoped>
  .centerBox {
    position: fixed;
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
