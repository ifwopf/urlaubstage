<!-- components/Login.vue -->
<template>
  <div class="wrapper">
    <section class="section">
      <form class="container">
        <div class="field">
          <label class="label is-large">Altes Passwort</label>
          <div class="control">
            <input type="password" class="input" v-model="password">
          </div>
        </div>
        <div class="field">
          <label class="label is-large">Neues Passwort</label>
          <div class="control">
            <input type="password" class="input" v-model="passwordNew">
          </div>
          <label class="label is-large" >Passwort bestätigen</label>
          <div class="control">
            <input type="password" class="input" v-model="passwordConfirm">
          </div>
        </div>
        <div class="buttonBox">
          <button class="button reglog is-large is-success" @click="redirect2('/#/calOverview')">Abbrechen</button>
        </div>
        <div class="buttonBox">
          <button class="button reglog is-large is-success" @click="changePassword">Ändern</button>
        </div>

      </form>
    </section>
    <infobox/>
  </div>
</template>

<script>
  import { EventBus } from '@/utils'
  import infobox from '@/components/infobox'

  export default {
    name: 'changePassword',
    components: {infobox},
    data () {
      return {
        email: '',
        password: '',
        passwordNew: '',
        passwordConfirm: '',
      }
    },
    methods: {
      redirect2 (link) {
        window.location.href = link
      },
      changePassword () {
        if (this.passwordNew === this.passwordConfirm) {
          this.$store.dispatch('changePassword', { oldPassword: this.password, newPassword: this.passwordNew })
            .then(() => this.$router.push('/calOverview'))
        }
        else {
          this.$store.commit("setInfoText", "Passwort stimmt nicht überein!")
        }
      },
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
  .buttonBox {
    display: inline-block;
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
