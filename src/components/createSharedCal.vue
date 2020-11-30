<template>
  <div>
    <div class="header">
      <h1 class="jahrtitel">
        <i class="material-icons" id="home" @click="redirect('/#/calOverview')">
          home
        </i>
        Team-Kalender erstellen
      </h1>
    </div>
    <div class="box">
      <h3>Name</h3>
      <input class="nameDisplay input" v-model="sharedCalName"  type="text"/>
    </div>
    <div class="box">
      <h3>Users</h3>
      <input class="user input" v-model="currentUser"  type="text"/> <div  class="miniButton" @click="addUser">add User</div>
      <div class="userbox">
        <div class="user" v-for="(admin, user) in users" v-bind:key="user">{{ user }}
          <button :key="admin" @click="toggleAdmin(user)" :class="[admin ? 'admin' : 'nonAdmin']">Admin</button>
          <span v-if="user != creator" @click="removeUser(user)">
            <i class="material-icons" id="delete">delete</i>
          </span>
        </div>
      </div>
    </div>

    <div class="button" @click="addSharedCal">Erstelle Kalender</div>
    <infobox/>
  </div>

</template>

<script>
  import ColorSelect from './colorSelect'
  import axios from 'axios'
  import infobox from '@/components/infobox'
  import {backendURL} from '@/store'
  //const backendURL = "http://127.0.0.1:5000"
  export default {
    name: 'createSharedCal',
    components: {ColorSelect, infobox},

    data () {
      return {
        sharedCalName: '',
        users: {},
        currentUser: null,
        currentCatName: null,
        creator: ''
      }
    },
    created () {
      // fetch the data when the view is created and the data is
      // already being observed
      //$(".second_div").css({'width': ($(".first_div").width() + 'px')});
      this.getCurrentUser()
    },
    methods: {
      redirect (link) {
        window.location.href = link
      },
      addUser () {
        if (this.currentUser)
        axios.get(backendURL + '/urlaub/api/v1.0/checkMail/' +  this.currentUser,
          { headers: { Authorization: `Bearer: ${this.$store.state.jwt.token}` } })
          .then(response => {

            if (response.data){
              Vue.set(this.users, this.currentUser, false)
              this.currentUser = ""
            }
            else{
              this.$store.dispatch("setInfoText", "No such Mail")
            }
          })
      },
      removeUser(user) {
        if (user != this.getCurrentUser()){
          Vue.delete(this.users, user)
        }
        else {
          this.$store.dispatch("setInfoText", "Du kannst dich als Ersteller nicht entfernen!")
        }

      },
      addSharedCal () {
        if (this.sharedCalName != "") {
          var stuff = {"name": this.sharedCalName, "addedUsers": this.users}
          this.$store.dispatch("createShared", stuff)
        }
        else {
          this.$store.dispatch("setInfoText", "Bitte gebe einen Namen ein!")
        }
      },
      toggleAdmin (user) {
        //event.target.classList.toggle("nonAdmin")
        //event.target.classList.toggle("admin")
        Vue.set(this.users, user, !this.users[user])
        var tmp = this.currentUser
        this.currentUser = " "
        this.currentUser = tmp
      },
      getCurrentUser () {
        axios.get(backendURL + '/urlaub/api/v1.0/getCurrentUser', { headers: { Authorization: `Bearer: ${this.$store.state.jwt.token}` } })
          .then(response => {
            Vue.set(this.users, response.data, true)
            this.currentUser = ""
            this.creator = response.data
          })
          .catch(function (error) {
            console.log(error)
          })
      },
    }
  }
</script>
<style>
  body{
    background-color: aliceblue;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently supported by Chrome, Opera and Firefox */
  }
</style>
<style scoped>
  .box {
    background-color: #fff;
    box-shadow: 5px 2.5px 2.5px grey;
    border: solid;
    border-width: 1px;
    font-size: 20px;
    padding: 10px;
    max-width: 400px;
    text-align: center;
    margin: 10px auto;

  }

  .nonAdmin, .admin {
    border: solid;
    border-width: 1px;
    padding: 4px 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    cursor: pointer;
  }
  .nonAdmin {
    background-color: lightcoral;
  }
  .admin {
    background-color: lawngreen;
  }
  .button, .miniButton{
    border: solid;
    border-width: 1px;
    text-align: center;
    text-decoration: none;
    font-size: 16px;
    background-color: aliceblue;
    margin: 5px auto;
    max-width: 400px;
    cursor: pointer;
  }
  .miniButton{
    display: inline-block;
    padding: 7px 18px;
  }

  .button{
    box-shadow: 5px 2.5px 2.5px grey;
    padding: 10px;
  }
  .input {
    border: solid;
    border-width: 1px;
    padding: 7px 18px;
    display: inline-block;
    font-size: 16px;
    background-color: aliceblue;
  }
  .jahrtitel {
    background-color: #fff;
    display: inline-block;
    padding: 10px;
    margin: 10px;
    color: #000;
    text-align: center;
  }
  #home {
    margin: 5px;
    display: block;
    float: left;
    cursor: pointer;
    border: 1px solid #000;
  }
  #delete {
    float: right;
    cursor: pointer;
    border: 1px solid #000;
    background-color: inherit;
  }
  .header{
    text-align: center;
  }
  .userbox{
    margin: 10px auto;
    border: solid;
    border-width: 1px;
    text-align: left;
  }
  .user{
    margin: 5px;
  }
</style>
