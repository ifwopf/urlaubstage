<!-- components/Login.vue -->
<template>
  <div class="wrapper">
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="titlebox">
          <h2 class="title">
            <button class="button" :class="{active: login}" @click="showLogin">Login</button>
            <button class="button" :class="{active: !login}" @click="showRegister">Register</button>
          </h2>
        </div>
      </div>
    </section>
    <section v-if="login" class="section">
      <form class="container">
        <div class="field">
          <label class="label is-large" for="email">Email</label>
          <div class="control">
            <input type="email" class="input" id="email" v-model="email" autocomplete="on">
          </div>
        </div>
        <div class="field">
          <label class="label is-large" for="password">Passwort</label>
          <div class="control">
            <input type="password" class="input" id="password" v-model="password" autocomplete="on">
          </div>
        </div>

        <div class="control">
          <a class="button reglog is-large is-primary" @click="authenticate">Login</a>
        </div>

      </form>
    </section>
    <section v-if="!login" class="section">
      <form class="container">
        <div class="field">
          <label class="label is-large" for="email">Email</label>
          <div class="control">
            <input type="email" class="input" id="emailReg" v-model="email">
          </div>
        </div>
        <div class="field">
          <label class="label is-large" for="password">Passwort</label>
          <div class="control">
            <input type="password" class="input" v-model="password">
          </div>
          <label class="label is-large" for="password">Passwort bestätigen</label>
          <div class="control">
            <input type="password" class="input" v-model="passwordConfirm">
          </div>
        </div>

        <div class="control">
          <a class="button reglog is-large is-success" @click="register">Register</a>
        </div>

      </form>
    </section>
    <infobox/>
  </div>
</template>

<script>
  import { isValidJwt, EventBus } from '@/utils'
  import infobox from '@/components/infobox'
  import { loadAllRowsFromIndexedDB } from '@/indexedDB'

  export default {
    name: 'login',
    components: {infobox},
    data () {
      return {
        email: '',
        password: '',
        passwordConfirm: '',
        login: true,
      }
    },
    methods: {
      authenticate () {
        this.$store.dispatch('login', { email: this.email, password: this.password })
          .then(() => this.$router.push('/calOverview'))
      },
      register () {
        if (this.password === this.passwordConfirm) {
          this.$store.dispatch('register', { email: this.email, password: this.password, years:null, cats:null })
        }
        else {
          this.$store.commit("setInfoText", "Password stimmt nicht überein!")
        }
      },
      showLogin () {
        this.login = true
      },
      showRegister () {
        this.login = false
      }
    },
    mounted () {
      EventBus.$on('failedRegistering', (msg) => {
        this.$store.commit("setInfoText", "Registrierung fehlgeschlagen")
      })
      EventBus.$on('failedAuthentication', (msg) => {
        this.$store.commit("setInfoText", "Falsche Anmeldedaten")
      })
    },
    beforeDestroy () {
      EventBus.$off('failedRegistering')
      EventBus.$off('failedAuthentication')
    }
  }
</script>
<style>
  body{
    background-color: #fff;
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
  .container {

    position: sticky;
    top: 5px;
    background-color: #d9f0ff;
    box-shadow: 5px 3px 5px grey;
    font-size: 20px;
    padding: 5px;
    width: auto;
    text-align: center;
    max-width: 400px;
    margin: 5px auto;
  }
  .field, .control {
    margin: 10px;
  }
  .button {
    padding: 10px 24px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    background-color: #fff;
    cursor: pointer;
    border: none
  }
  .button:hover{
    background-color: #d9f0ff;
  }

  .input {
    border: solid;
    border-width: 1px;
    padding: 10px 24px;
    display: inline-block;
    width: 90%;
    font-size: 16px;
    background-color: #fff;
  }
  .active{
    background-color: #d9f0ff;
  }
  .titlebox {
    text-align: center;
  }
  .wrapper{
    max-width: 1200px;
    margin: 5px;
  }
  .reglog{
    background-color: aliceblue;
  }
</style>
