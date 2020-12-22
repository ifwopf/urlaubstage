<template>
  <div class="wrapper">
    <div class="personal">
      <div class="titlebox">
        <h2 class="title">Deine Kalender</h2>
      </div>
      <div class="kalender" v-if="!cal.shared" v-for="cal in $store.state.cals"
           @click="redirect('Urlaubskalender2', {calID: cal.id, year: '2021'})">
        <span>{{cal.name}}</span>
        <input :label="cal.id" :value="cal" class="merge" v-model="$store.state.checkedCalenders" onclick="event.stopPropagation()"
               type="checkbox"/>
      </div>
      <div class="kalender">
        <input class="input" v-on:keyup="enterAddCal($event)" v-model="newCalender">
        <div class="button"  @click="addCal">+</div>
      </div>
      <div v-if="$store.state.checkedCalenders.length > 1" class="kalender"
           @click="redirect('mergeCal', {year: '2021'})">
        <div class="headMixed">Mixed View</div>
        <div v-for="calender in $store.state.checkedCalenders">{{calender.name}}</div>
        <div class="button" @click="redirect('mergeCal', {year: '2021'})">Ansehen</div>
      </div>
    </div>
    <div class="shared">
      <div class="titlebox">
        <h2 class="title">Team-Kalender</h2>
      </div>
      <div class="kalender" v-if="cal.shared" v-for="cal in $store.state.cals"
           @click="redirect('sharedCal', {calID: cal.id, year: '2021'})">
        <span>{{cal.name}}</span>
      </div>
      <div class="kalender" @click="redirect('createSharedCal', {})">
        <span>Neuer Teamkalender</span>
        <div class="button">+</div>
      </div>
    </div>
    <div class="settings">
      <div class="titlebox">
        <h2 class="title">Einstellungen</h2>
      </div>
      <div class="kalender" @click="redirect('calSync', {})">
        <span>Kalender synchronisieren</span>
      </div>
      <div class="kalender" @click="redirect('changePassword', {})">
        <span>Passwort ändern</span>
      </div>
      <div class="kalender" @click="showDeleteBox">
        <span>Account löschen</span>
      </div>
      <div class="kalender" @click="logout">
        <span>Logout</span>
      </div>
    </div>
    <delete-box :actionName="'deleteUser'" :calID="0"/>
  </div>
</template>

<script>
  import {deleteUser} from '@/api'
  import deleteBox from '@/components/deleteBox'

  export default {
    name: 'calOverview',
    components: {deleteBox},
    data () {
      return {
        newCalender: 'Urlaubskalender',
      }
    },
    created () {
      // fetch the data when the view is created and the data is
      // already being observed
      //$(".second_div").css({'width': ($(".first_div").width() + 'px')});
      if (this.$store.state.cals === null) {
        this.$store.dispatch('calReady')
      }


    },
    methods: {
      addCal () {
        this.$store.dispatch('addCal', this.newCalender)
      },
      enterAddCal (event) {
        var key = event.key || event.keyCode;
        if (key === 13 || key === "Enter") {
          event.preventDefault();
          this.addCal();
        }
      },
      redirect (comp, parameters) {
        this.$store.dispatch('resetClicked')
        this.$router.push({name: comp, params: parameters})
        //location.reload()
      },
      logout () {
        this.$store.dispatch('logout')
      },
      showDeleteBox () {
        this.$store.commit('setDeleteBox', 'Wollen Sie Ihren Account wirklich löschen?')
      }

    }
  }
</script>
<style>
  body {
    background-color: #fff;
    width: 100%;
    margin: 0;
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
    display: inline-block;
    padding: 5px;
  }

  .kalender {
    background-color: #d9f0ff;
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
    margin: auto;
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

  .button:hover {
    background: #d9f0ff;
  }

  .input {
    border: solid;
    border-width: 1px;
    padding: 7px 18px;
    display: inline-block;
    font-size: 16px;
    background-color: aliceblue;
  }

  .merge {
    float: right;
    font-size: 55px;
    padding: 10px;
  }

  input[type='checkbox'] {
    width: 20px;
    height: 20px;
  }

  .headMixed {
    font-weight: bold;
    margin: 10px;
  }

</style>
