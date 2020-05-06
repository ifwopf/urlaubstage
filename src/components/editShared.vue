<template>
  <div>
    <div class="header">
      <h1 class="jahrtitel">
        <i class="material-icons" id="home" @click="redirect('/#/calOverview')">
          home
        </i>
        Kalender bearbeiten
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
        <div class="user" v-for="(user, id) in users">{{ user.email }}
          <button  @click="toggleAdmin(id)" :class="[user.admin ? 'admin' : 'nonAdmin']">Admin</button>
          <button  @click="removeFromUsers(id)">delete</button>
        </div>
      </div>
    </div>

    <div class="button" @click="saveChanges">Save Changes</div>
    <infobox/>
  </div>

</template>

<script>
  import ColorSelect from './colorSelect'
  import axios from 'axios'
  import infobox from '@/components/infobox'
  import {backendURL} from '@/store'
  import { getSharedInfo, saveSharedChanges } from '@/api'
  export default {
    name: 'editShared',
    props: ['calID'],
    components: {ColorSelect, infobox},

    data () {
      return {
        sharedCalName: null,
        users: {},
        currentUser: null,
        currentCatName: null,
      }
    },
    created () {
      // fetch the data when the view is created and the data is
      // already being observed
      //$(".second_div").css({'width': ($(".first_div").width() + 'px')});
      this.getSharedInfos(this.calID, this.$store.state.jwt.token)
      //this.getCurrentUser()
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
                console.log(response.data)
                Vue.set(this.users, this.currentUser, {'admin': false, 'email': this.currentUser})
                this.currentUser = ""
              }
              else{
                this.$store.dispatch("setInfoText", "No such Mail")
              }
            })
      },
      addSharedCal () {
        var stuff = {"name": this.sharedCalName, "addedUsers": this.users}
        this.$store.dispatch("createShared", stuff)
      },
      toggleAdmin (user) {
        //event.target.classList.toggle("nonAdmin")
        //event.target.classList.toggle("admin")
        Vue.set(this.users[user], 'admin', !this.users[user].admin)
        var tmp = this.currentUser
        this.currentUser = " "
        this.currentUser = tmp
        console.log(this.users[user])
      },
      getCurrentUser () {
        axios.get(backendURL + '/urlaub/api/v1.0/getCurrentUser', { headers: { Authorization: `Bearer: ${this.$store.state.jwt.token}` } })
          .then(response => {
            //Vue.set(this.users, response.data, true)
            this.currentUser = ""
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      getSharedInfos (calID, token) {
        return getSharedInfo(calID, token)
          .then(response => {
            this.users = response.data[0];
            this.sharedCalName = response.data[1];
          })
          .catch(error => {
            console.log('Error Authenticating: ', error)
          })
      },
      saveChanges () {
        var payload = {'name': this.sharedCalName, 'users': this.users, 'calID': this.calID}
        return saveSharedChanges(payload, this.$store.state.jwt.token)
          .then(response => {
        })
          .catch(error => {
            console.log('Error Authenticating: ', error)
          })
      },
      removeFromUsers (id) {
        this.$delete(this.users, id)
      }

    }
  }
</script>

<style scoped>
  h2 {
    display:inline-block;
    background-color: #f890e7;
    padding: 5px;
  }
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
    background-color: #0bd3d3;
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
    background-color: #0bd3d3;
  }
  .jahrtitel {
    background-color: #f1f1f1;
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
