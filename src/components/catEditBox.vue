<template>
  <div v-if="$store.state.catEditBox || $store.state.border" class="centerBox">
    <span class="nameDisplay" v-if="!editName & !$store.state.border" :style="{backgroundColor: catColor}">
          {{ $store.getters.getCatByID(this.$store.state.clickedCatCounter, calID).name }}
        </span>
    <input class="nameDisplay input" v-model="catNameInit" @change="" @click.stop="" type="text" id="newCat" ref="newCat"
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
  import { saveToIndexedDB, removeFromIndexedDB, loadFromIndexedDB } from '@/indexedDB'
  import ColorSelect from './colorSelect'

  export default {
    name: 'catEditBox',
    components: {ColorSelect},
    props: ["unreg", "year", "calID", "shared"],
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
        if (this.unreg == "1") {
          this.$store.dispatch('deleteCatUnreg', this.$store.state.clickedCatCounter)
          removeFromIndexedDB("MeineDatenbank", "cats", this.$store.state.clickedCatCounter)
          saveToIndexedDB("MeineDatenbank", "months", this.$store.state.info, this.year)
        }
        if (this.shared){
          this.$store.dispatch('deleteSharedCat', this.$store.state.clickedCatCounter)
        }
        else {
          this.$store.dispatch('deleteCat', this.$store.state.clickedCatCounter)
        }
      },
      changeName () {
        if (this.unreg == "1") {
          const catID = this.$store.state.clickedCatCounter
          this.$store.commit('editCatName', {'name': this.catNameInit, 'id': catID})
          loadFromIndexedDB("MeineDatenbank", "cats", catID).then(response => {
            response["name"] = this.catNameInit
            saveToIndexedDB("MeineDatenbank", "cats", response, catID)
          }).catch(error => {
            console.log(error)
          })
          this.editName = false
        }
        else {
          var payload = {'name': this.catNameInit, 'id': this.$store.state.clickedCatCounter, 'calID': this.calID}
          this.$store.dispatch('changeCatName', payload)
          this.editName = false
        }
      },
      changeColor () {
        if (this.unreg == "1") {
          const catID = this.$store.state.clickedCatCounter
          this.$store.commit('editCatColor', {'catColor': this.catColor, 'id': catID})
          loadFromIndexedDB("MeineDatenbank", "cats", catID).then(response => {
            response["style"]["background-color"] = this.catColor
            saveToIndexedDB("MeineDatenbank", "cats", response, catID)
          }).catch(error => {
            console.log(error)
          })
          this.editColor = false
        }
        else {
          var payload = {'catColor': this.catColor, 'id': this.$store.state.clickedCatCounter, 'calID': this.calID}
          this.$store.dispatch('changeCatColor', payload)
          this.editColor = false
        }
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
        this.$store.commit('setCatColor', this.$store.state.cats[this.calID][this.$store.state.clickedCatCounter].style['background-color'])
      },
      setColor(e){
        this.$store.commit('setCatColor', e.target.style['background-color'])
      },
      addNewCat () {
        var doppelt = false
        if (this.unreg === 1) {
          var newCat = {"name": this.catNameInit, "style": {"background-color": this.catColor}}
          this.$store.dispatch('addCatUnreg', newCat).then(response => {
            saveToIndexedDB("MeineDatenbank", "cats", response, response.id)
            if(this.$store.state.clicked.length > 0){
              this.$store.dispatch('changeCat', response.id).then(res => {
                saveToIndexedDB("MeineDatenbank", "months", this.$store.state.info, this.year)
              })
                .catch(error => {
                  console.log('Error Authenticating: ', error)
                })
            }
          })
            .catch(error => {
              console.log('Error Authenticating: ', error)
            })
        }
        else {
          for (var i = 0; i < this.$store.state.cats.length; i++) {
            if (this.catName === this.$store.state.cats[this.catID][i].name) {
              doppelt = true
            }
          }
          if (!doppelt) {
            if (this.shared){
              this.$store.dispatch('addSharedCat', {catName: this.catNameInit, catColor: this.catColor, calID: this.calID})
            }
            else {
              this.$store.dispatch('addCat', {catName: this.catNameInit, catColor: this.catColor, calID: this.calID})
            }
            this.catName = ''
          }
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
    box-shadow: 10px 5px 5px grey;
    font-size: 24px;
    padding: 5px;
    text-align: center;
    min-width: 220px;
    background: #f0f8ff;
  }

  .material-icons {
    cursor: pointer;
    background-color: aliceblue;
    margin: 10px;
  }

  .material-icons:hover{
    background-color: #fff;
  }
  .nameDisplay {
    display: block;
    width: 100%;
    text-align: center;
    font-size: 24px;
  }

  input{
    background-color: #fff;
    border: none
  }

</style>
