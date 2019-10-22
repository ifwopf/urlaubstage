<template>
  <div v-if="catEdit" class="centerBox">
      <i class="material-icons catEdits md-48" @click.stop="deleteCat" id="deleteCat">delete</i>
      <i class="material-icons catEdits md-48" @click.stop="showColorEdit" id="editCatColor">color_lens</i>
      <i class="material-icons catEdits md-48" @click.stop="showNameEdit" id="editCatName">edit</i>
      <i class="material-icons md-48">clear</i>
    <span v-if="!editName">
          {{ catName }}
        </span>
    <input v-model="catName" @change="" @click.stop="" type="text"
           v-autowidth="{maxWidth: '960px', minWidth: '20px', comfortZone: 20}"
           v-if="editName" class="input"/>
    <i class="material-icons" @click="changeName" v-if="editName">save</i>

    <select v-if="editColor" @click.stop="" @change.stop="updateColor($event)"
            :style="catColor" v-model="catColor">
      <option v-if="editColor && parseInt(selectedCat)===cat.id">Select Color</option>
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
    name: 'dayBox',
    data () {
      return {
        catName: $store.getters.getCatByID($store.clickedCatCounter).name,
        editName: false,
        editColor: false,
        edit: false,
        colors: [{'background-color': '#b4b9cc'}, {'background-color': '#7387b0'}, {'background-color': '#ffca62'},
          {'background-color': '#ee5f82'}, {'background-color': '#f986a2'}, {'background-color': '#E0B3E6'},
          {'background-color': 'aquamarine'}]
      }
    },
    computed: {
    },
    methods: {
      deleteCat () {
        this.$store.dispatch('deleteCat', this.selectedCat)
      },
      changeName () {
        var payload = {'name': this.catName, 'id': this.selectedCat}
        this.$store.dispatch('changeCatName', payload)
        this.editName = false
      },
      changeColor () {
        var payload = {'color': this.catColor, 'id': this.selectedCat}
        this.$store.dispatch('changeCatColor', payload)
        this.editColor = false
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
  }
</style>
