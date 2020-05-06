<template>
  <div v-if="$store.state.showCalSettingsBox" class="infobox">
    <h2>Einstellungen</h2>
    <h3 class="text">
      Namen ändern
    </h3>
    <input class="inputName" :value="calName" @input="updateName"/>
    <div class="button" @click="saveNewCalName">
      <i class="material-icons" id="save">
        save
      </i>
    </div>
    <br/><br/>
    <div class="button" @click="showFeiertage">
      Feiertage hinzufügen
    </div>
    <br/><br/>
    <div class="button" @click="removeCalSettingsBox">
      Fertig
    </div>
  </div>
</template>

<script>
  import { saveCalName } from '@/api'
  export default {
    name: 'calSettingsBox',
    props: ['calName', 'calID'],
    data() {
      return {
      }
    },
    created () {

    },
    methods: {
      removeCalSettingsBox () {
        this.$store.commit('removeCalSettingsBox')
      },
      showFeiertage () {
        this.$store.commit('showFeiertage')
        this.$store.commit('removeCalSettingsBox')
      },
      saveNewCalName () {
        var payload = {'name': this.newName, 'calID': this.calID}
        return saveCalName(payload, this.$store.state.jwt.token)
          .then(response => {
            this.$emit('input', this.newName);
            this.$store.commit('removeCalSettingsBox')
          })
          .catch(error => {
            console.log('Error Authenticating: ', error)
          })
      },
      updateName(e) {
        this.newName = e.target.value
      }
    }
  }
</script>

<style scoped>
  .infobox {
    position:absolute;
    top:50%;
    left:50%;
    width:400px;  /* adjust as per your needs */
    /* adjust as per your needs */
    margin-left:-200px;   /* negative half of width above */
    margin-top:-200px;
    background-color: white;
    text-align: center;
    box-shadow: 10px 5px 5px grey;
    border: 1px solid #000;
  }
  .button {
    border: solid;
    border-width: 1px;
    padding: 10px 24px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    background-color: #0bd3d3;
    margin-bottom: 10px;
    cursor: pointer;
  }
  .noteButton {
    background-color: inherit;
    border: none;
    cursor: pointer;
    vertical-align: top;
  }
  .inputName{
    background-color: #0bd3d3;
    border: none;
    line-height: 24px;
    height: 24px;
    font-size: 18px;
    font-weight: bold;
    vertical-align: top;
    text-align: center;
    padding: 24px 10px;
  }
  .text {
    top: 10%;
    font-size: 16px;
    padding: 10px 24px;
    margin-top: 10px;
  }
</style>
