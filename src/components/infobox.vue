<template>
  <div v-if="$store.state.showinfo" class="infobox">
    <div class="text">
      {{$store.state.infotext}}
    </div>
    <div class="button" @click="removeInfo">
      OK
    </div>
  </div>
</template>

<script>
  export default {
    name: 'infobox',
    methods: {
      removeInfo() {
        this.$store.commit('removeInfo')
      }
    }
  }
</script>

<style scoped>
  .infobox {
    background-color: white;
    text-align: center;
    box-shadow: 10px 5px 5px grey;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .button {
    padding: 10px 24px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    background-color: #d9f0ff;
    margin-bottom: 10px;
    cursor: pointer;
  }
  .button:hover {
    background: #f0f8ff;
  }
  .text {
    top: 10%;
    font-size: 16px;
    padding: 10px 24px;
    margin-top: 10px;
  }
</style>
