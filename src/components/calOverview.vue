<template>
  <div class="wrapper">
    <div class="personal">
      <div class="titlebox">
        <h2 class="title">Deine Kalender</h2>
      </div>
      <div class="kalender" v-if="!cal.shared" v-for="cal in $store.state.cals" @click="redirect('#/calender/' + cal.id + '/2020')">
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
      <div class="kalender" v-if="cal.shared" v-for="cal in $store.state.cals" @click="redirect('#/shared/' + cal.id)">
        <span >{{cal.name}}</span>
      </div>
      <div class="kalender" @click="redirect('#/createSharedCal')">
        <span>Neuer Teamkalender</span> <div class="button">+</div>
      </div>
    </div>
    <div class="settings">
      <div class="titlebox">
        <h2 class="title">Einstellungen</h2>
      </div>
      <div class="kalender" @click="redirect('#/calSync')">
        <span >Kalender synchronisieren</span>
      </div>
      <div class="kalender" @click="logout">
        <span >Passwort ändern</span>
      </div>
      <div class="kalender" @click="logout">
        <span >Logout</span>
      </div>
    </div>
  </div>
</template>

<script>
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
      redirect (link) {
        window.location.href = link
      },
      logout() {
        this.$store.dispatch('logout')
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
  .wrapper {
    width: 100%;
    overflow: hidden; /* add this to contain floated children */
  }
  .personal, .shared, .settings {
    margin: 10px 20px;
    min-width: 300px;
    float:left; /* add this */
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
