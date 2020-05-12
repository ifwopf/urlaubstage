<!-- components/Login.vue -->
<template>
  <div class="wrapper">
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="titlebox">
          <h2 class="title">Login or Register</h2>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="field">
          <label class="label is-large" for="email">Email</label>
          <div class="control">
            <input type="email" class="input" id="email" v-model="email">
          </div>
        </div>
        <div class="field">
          <label class="label is-large" for="password">Password</label>
          <div class="control">
            <input type="password" class="input" id="password" v-model="password">
          </div>
        </div>

        <div class="control">
          <a class="button is-large is-primary" @click="authenticate">Login</a>
          <a class="button is-large is-success" @click="register">Register</a>
        </div>

      </div>
    </section>
    <infobox/>
  </div>
</template>

<script>
  import { isValidJwt, EventBus } from '@/utils'
  import infobox from '@/components/infobox'
  export default {
    name: 'login',
    components: {infobox},
    data () {
      return {
        email: '',
        password: ''
      }
    },
    methods: {
      authenticate () {
        this.$store.dispatch('login', { email: this.email, password: this.password })
          .then(() => this.$router.push('/calOverview'))
      },
      register () {
        this.$store.dispatch('register', { email: this.email, password: this.password })
          .then(() => this.$router.push('/calOverview'))
      }
    },
    mounted () {
      EventBus.$on('failedRegistering', (msg) => {
        this.$store.commit("setInfoText", "Registrierung fehlgeschlagen")
      })
      EventBus.$on('failedAuthentication', (msg) => {
        console.log("herwrtret")
        this.$store.commit("setInfoText", "Falsche Anmeldedaten")
      })
    },
    beforeDestroy () {
      EventBus.$off('failedRegistering')
      EventBus.$off('failedAuthentication')
    }
  }
</script>

<style scoped>
  h2 {
    display:inline-block;
    background-color: #f1f1f1;
    padding: 5px;
  }
  .container {

    position: sticky;
    top: 5px;
    background-color: #fff;
    box-shadow: 5px 2.5px 2.5px grey;
    border: solid;
    border-width: 1px;
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
    border: solid;
    border-width: 1px;
    padding: 10px 24px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    background-color: #fff;
    cursor: pointer;
  }
  .button:hover{
    background-color: lightgrey;
  }

  .input {
    border: solid;
    border-width: 1px;
    padding: 10px 24px;
    display: inline-block;
    width: 90%;
    font-size: 16px;
    background-color: #0bd3d3;
  }
  .titlebox {
    text-align: center;
  }
  .wrapper{
    max-width: 1200px;
    margin: 5px;
  }
</style>
