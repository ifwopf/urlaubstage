<template>
  <div class="wrapper">
    <div class="personal">
      <div class="titlebox">
        <h2 class="title">Deine Kalender</h2>
      </div>
      <div class="kalender" v-if="!cal.shared" v-for="cal in $store.state.cals"
           @click="redirect('Urlaubskalender2', {calID: cal.id, year: '2020'})">
        <span>{{cal.name}}</span>
      </div>
      <div class="kalender">
        <input class="input" v-model="newCalender">
        <div class="button" @click="addCal">+</div>
      </div>
    </div>
    <div class="shared">
      <div class="titlebox">
        <h2 class="title">Team-Kalender</h2>
      </div>
      <div class="kalender" v-if="cal.shared" v-for="cal in $store.state.cals"
           @click="redirect('sharedCal', {calID: cal.id, year: '2020'})">
        <span >{{cal.name}}</span>
      </div>
      <div class="kalender" @click="redirect('createSharedCal', {})">
        <span>Neuer Teamkalender</span> <div class="button">+</div>
      </div>
    </div>
    <div class="settings">
      <div class="titlebox">
        <h2 class="title">Einstellungen</h2>
      </div>
      <div class="kalender" @click="redirect('calSync', {})">
        <span >Kalender synchronisieren</span>
      </div>
      <div class="kalender" @click="logout">
        <span >Passwort ändern</span>
      </div>
      <div class="kalender" @click="deleteUser2">
        <span >Alles löschen</span>
      </div>
      <div class="kalender" @click="logout">
        <span >Logout</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { deleteUser } from '@/api'
  export default {
    name: 'calOverview',
    data () {
      return {
        newCalender: 'Urlaubskalender'
      }
    },
    created () {
      // fetch the data when the view is created and the data is
      // already being observed
      //$(".second_div").css({'width': ($(".first_div").width() + 'px')});
      this.$store.dispatch('calReady')
    },
    methods: {
      addCal () {
        this.$store.dispatch('addCal', this.newCalender)
      },
      redirect (comp, parameters) {
        this.$store.dispatch('resetClicked')
        this.$router.push({name: comp, params: parameters})
        location.reload()
      },
      logout() {
        this.$store.dispatch('logout')
      },
      deleteUser2() {
        console.log(this.$store.state.jwt.token)
        return deleteUser(this.$store.state.jwt.token)
          .then(response => {
            this.redirect("login", null)
          })
          .catch(error => {
            console.log('Error Authenticating: ', error)
          })
      }

    }
  }
</script>

<style scoped>
  h2 {
    display:inline-block;
    background-color: #f1f1f1;
    padding: 5px;
  }
  .kalender {
    background-color: #fff;
    box-shadow: 5px 2.5px 2.5px grey;
    border: solid;
    border-width: 1px;
    font-size: 20px;
    padding: 10px;
    width: 300px;
    text-align: center;
    margin: 5px auto;
    cursor: pointer;
  }
  .kalender:hover {
    background-color: lightgrey;
  }
  .wrapper {
    width: 100%;
    overflow: hidden; /* add this to contain floated children */
    max-width: 1200px;
  }
  .personal, .shared, .settings {
    margin: 10px 20px;
    min-width: 300px;
    text-align: center;

  }

  .button {
    border: solid;
    border-width: 1px;
    padding: 7px 18px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    background-color: #0bd3d3;
  }
  .input {
    border: solid;
    border-width: 1px;
    padding: 7px 18px;
    display: inline-block;
    font-size: 16px;
    background-color: #0bd3d3;
  }
</style>
