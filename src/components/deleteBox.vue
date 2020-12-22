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
        this.$store.dispatch(this.actionName, this.ID)
      },
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
