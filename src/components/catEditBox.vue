<template>
  <div v-if="$store.state.catEditBox" class="centerBox">
      <i class="material-icons catEdits md-48" @click.stop="deleteCat" id="deleteCat">delete</i>
      <i class="material-icons catEdits md-48" @click.stop="showColorEdit" id="editCatColor">color_lens</i>
      <i class="material-icons catEdits md-48" @click.stop="showNameEdit" id="editCatName">edit</i>
      <i class="material-icons md-48" @click.stop="closeCatEditBox">clear</i>
    <span v-if="!editName">
          {{ $store.getters.getCatByID(this.$store.state.clickedCatCounter).name }}
        </span>
    <input v-model="catNameInit" @change="" @click.stop="" type="text"
           v-autowidth="{maxWidth: '960px', minWidth: '20px', comfortZone: 20}"
           v-if="editName" class="input"/>
    <i class="material-icons" @click="changeName" v-if="editName">save</i>

    <select v-if="editColor" @click.stop=""
            :style="catColor" v-model="catColor">
      <option v-if="editColor">Select Color</option>
      <option v-for="color in colors" :style="color" :value="color"></option>
    </select>
    <i class="material-icons" v-if="editColor" @click="changeColor">save</i>
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
        catColor: null,
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
          get() {
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
        var payload = {'color': this.catColor, 'id': this.$store.state.clickedCatCounter}
        this.$store.dispatch('changeCatColor', payload)
        this.editColor = false
      },
      showColorEdit () {
        this.editColor = true
        this.editName = false
      },
      showNameEdit () {
        this.editName = true
        this.editColor = false
      },
      closeCatEditBox () {
        this.$store.commit('hideCatEdit')
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
    background-color: mistyrose;
  }
</style>
