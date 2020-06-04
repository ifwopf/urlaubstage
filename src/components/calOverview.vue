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
      <div class="kalender" @click="showDeleteBox">
        <span >Alles löschen</span>
      </div>
      <div class="kalender" @click="logout">
        <span >Logout</span>
      </div>
    </div>
    <delete-box :actionName="'deleteUser'" :calID="0"/>
  </div>
</template>

<script>
  import { deleteUser } from '@/api'
  import deleteBox from '@/components/deleteBox'
  export default {
    name: 'calOverview',
    components: {deleteBox},
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
      showDeleteBox() {
        this.$store.commit('setDeleteBox', "Wollen Sie Ihren Account wirklich löschen?")
      }

    }
  }
</script>
<style>
  body{
    background-color: aliceblue;
    width: 100%;
    margin:0;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currentlysupported by Chrome, Opera and Firefox */
  }
</style>

<style scoped>
  h2 {
    display:inline-block;
    background-color: #fff;
    padding: 5px;
  }
  .kalender {
    background-color: #fff;
    box-shadow: 5px 3px 3px grey;
    font-size: 20px;
    padding: 10px;
    width: 300px;
    text-align: center;
    margin: 8px auto;
    cursor: pointer;
  }
  .kalender:hover {
    background-color: aliceblue;
  }
  .wrapper {
    width: 100%;
    overflow: hidden; /* add this to contain floated children */
    max-width: 1200px;
    text-align: center;
  }
  .personal, .shared, .settings {
    margin: 10px 20px;
    min-width: 300px;
    text-align: center;
    vertical-align: top;
    display: inline-block;

  }

  .button {
    border: solid;
    border-width: 1px;
    padding: 7px 18px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    background-color: aliceblue;
  }
  .input {
    border: solid;
    border-width: 1px;
    padding: 7px 18px;
    display: inline-block;
    font-size: 16px;
    background-color: aliceblue;
  }
</style>
