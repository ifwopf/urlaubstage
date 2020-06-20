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
    <h3 class="text">
      Kalender löschen
    </h3>
    <div class="button" @click="showDeleteBox">
      <i class="material-icons" id="delete">
        delete
      </i>
    </div>
    <h3 class="text">
      Feiertage hinzufügen
    </h3>
    <div class="button" @click="showFeiertage">
      Feiertage hinzufügen
    </div>
    <h3 class="text">
      Besitzer verwalten
    </h3>
    <input class="user input" v-model="currentUser"  type="text"/> <div  class="miniButton" @click="addUser">add User</div>
    <div class="userbox">
      <div class="user" v-for="(user, id) in users">{{ user.email }}
        <span @click="deleteOwner(id)">
            <i class="material-icons" id="deleteUser">delete</i>
          </span>
      </div>
    </div>
    <br/><br/>
    <div class="button" @click="removeCalSettingsBox">
      Fertig
    </div>
    <delete-box :actionName="'deleteCal'" :ID="calID"/>
  </div>
</template>

<script>
  import { saveCalName, getOwners, addOwner, deleteOwner, checkMail } from '@/api'
  import deleteBox from '@/components/deleteBox'
  export default {
    name: 'calSettingsBox',
    components: {deleteBox},
    props: ['calName', 'calID'],
    data() {
      return {
        users: {},
        currentUser: "",
      }
    },
    created () {
      return getOwners(this.calID, this.$store.state.jwt.token)
        .then(response => {
          this.users = response.data;
          console.log(this.users)
        })
        .catch(error => {
          console.log('Error Authenticating: ', error)
        })
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
      },
      showDeleteBox() {
        this.$store.commit('setDeleteBox', "Wollen Sie diesen Kalender wirklich löschen? Alle zugehörigen Daten gehen verloren")
      },
      addUser () {
        if (this.currentUser)
          return checkMail(this.currentUser, this.$store.state.jwt.token)
            .then(response => {
              console.log(response.data)
              if (response.data){
                return addOwner({"email": this.currentUser, "calID": this.calID}, this.$store.state.jwt.token)
                  .then(response => {
                    console.log(response.data)
                    Vue.set(this.users, response.data["id"], response.data)
                  })
              }
              else{
                this.$store.dispatch("setInfoText", "No such Mail")
              }
            })
      },
      deleteOwner(id) {
        return deleteOwner({"userID": id, "calID": this.calID}, this.$store.state.jwt.token)
          .then(response => {
            console.log(response.data)
            if (response.data){
              this.$delete(this.users, id)
            }
            else{
              this.$store.dispatch("setInfoText", "Konnte nicht gelöscht werden")
            }
          })
      }
    }
  }
</script>
<style scoped>
  .infobox {
    position:fixed;
    top:50%;
    left:50%;
    width:400px;
    margin-left:-200px;
    margin-top:-300px;
    background-color: white;
    text-align: center;
    box-shadow: 10px 5px 5px grey;
    border: none;
    max-width: 95%;
  }
  @media only screen and (min-width: 1200px) {
    .infobox{
    }
  }
  @media only screen and (max-width: 380px) {
    .infobox{
      margin-left:-47.5%;
    }
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
  .noteButton {
    background-color: inherit;
    border: none;
    cursor: pointer;
    vertical-align: top;
  }
  .inputName{
    background-color: aliceblue;
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
  .miniButton{
    border: none;
    text-align: center;
    text-decoration: none;
    font-size: 16px;
    background-color: aliceblue;
    margin: 5px auto;
    max-width: 400px;
    cursor: pointer;
    display: inline-block;
    padding: 7px 18px;
  }
  .input {
    border: none;
    padding: 7px 18px;
    display: inline-block;
    font-size: 16px;
    background-color: aliceblue;
  }
  .userbox{
    margin: 5px 32px;
    line-height: 24px;
    vertical-align: middle;
  }
</style>
