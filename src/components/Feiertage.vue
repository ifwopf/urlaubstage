<template>
  <div v-if="$store.state.showFeiertage" class="infobox">
    <div class="text">
      Welche Feiertage sollen hinzugefügt werden?
    </div>
    <select v-model="region">
      <option v-for="(feiertage, state) in feiertage">{{state}}</option>
    </select>
    <div class="text">
      Welcher Kategorie sollen die Feiertage hinzugefügt werden?
    </div>
    <select v-model="catID">
      <option :value="-1">Neue Kategorie</option>
      <option v-for="cat in $store.getters.getCats($store.state.currentCal)" :value="cat.id">{{cat.name}}</option>
    </select>
    <br/><br/>
    <div class="button" @click="removeFeiertage">
      Abbrechen
    </div>
    <div class="button" @click="addFeiertage">
      Hinzufügen
    </div>
  </div>
</template>

<script>
  import { getFeiertage } from '@/api'
  export default {
    name: 'Feiertage',
    data() {
      return {
        feiertage: [],
        catID: null,
        region: ''
      }
    },
    created () {
      // fetch the data when the view is created and the data is
      // already being observed
      this.getFeiertage(this.$store.state.jwt.token)
    },
    methods: {
      removeFeiertage() {
        this.$store.commit('removeFeiertage')
      },
      getFeiertage (token) {
        return getFeiertage(token)
          .then(response => {
            this.feiertage = response.data;
          })
          .catch(error => {
            console.log('Error Authenticating: ', error)
          })
      },
      addFeiertage() {
        if (this.catID != null && this.region !== ''){
          var payload = {'region': this.region, 'catID': this.catID}
          this.$store.dispatch('addFeiertage', payload)
        }
      }
    }
  }
</script>

<style scoped>
  .infobox {
    position:fixed;
    top:50%;
    left:50%;
    width:400px;  /* adjust as per your needs */
    /* adjust as per your needs */
    margin-left:-200px;   /* negative half of width above */
    margin-top:-200px;
    background-color: white;
    text-align: center;
    box-shadow: 10px 5px 5px grey;
    border: none;
  }
  .button {
    border: none;
    padding: 10px 24px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    background-color: aliceblue;
    margin-bottom: 10px;
    cursor: pointer;
  }
  .text {
    top: 10%;
    font-size: 16px;
    padding: 10px 24px;
    margin-top: 10px;
  }
  select{background-color: aliceblue}
</style>
