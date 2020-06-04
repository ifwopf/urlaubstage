<template>
  <div v-if="$store.state.showDeleteBox" class="infobox">
    <div class="text">
      {{$store.state.deleteText}}
    </div>
    <div class="button" @click="removeBox">
      Abbrechen
    </div>
    <div class="button" @click="deleteCal">
      OK
    </div>
  </div>
</template>

<script>
  export default {
    name: 'deleteBox',
    props: ['actionName', 'ID'],
    methods: {
      removeBox() {
        this.$store.commit('removeDeleteBox')
      },
      deleteCal(){
        console.log(this.ID)
        this.$store.dispatch(this.actionName, this.ID)
      },
    }
  }
</script>

<style scoped>
  .infobox {
    position:fixed;
    top:50%;
    left:50%;
    width:400px;
    margin-left:-200px;
    margin-top:-200px;
    background-color: white;
    text-align: center;
    box-shadow: 10px 5px 5px grey;
    border: 1px solid #000;
    max-width: 95%;
  }
  @media only screen and (min-width: 1200px) {
    .infobox{
      left: 600px;
    }
  }
  @media only screen and (max-width: 380px) {
    .infobox{
      margin-left:-47.5%;
      margin-top:-10px;
    }
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
