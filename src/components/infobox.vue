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
    position:absolute;
    top:50%;
    left:50%;
    width:400px;  /* adjust as per your needs */
   /* adjust as per your needs */
    margin-left:-200px;   /* negative half of width above */
    margin-top:-200px;
    background-color: white;
    text-align: center;
    box-shadow: 10px 5px 5px grey;
    border: 1px solid #000;
  }
  .button {
    border: solid;
    border-width: 1px;
    padding: 10px 24px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    background-color: #0bd3d3;
    margin-bottom: 10px;
    cursor: pointer;
  }
  .text {
    top: 10%;
    font-size: 16px;
    padding: 10px 24px;
    margin-top: 10px;
  }
</style>
