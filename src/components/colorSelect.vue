<template>
  <div class="gridContainer">
    <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(255, 255, 255)' }"
         @click="setColor" style="grid-column: 1; grid-row: 1; background-color: rgb(255, 255, 255)"></div>
    <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(255, 255, 153)' }"
         @click="setColor" style="grid-column: 2; grid-row: 1; background-color: rgb(255, 255, 153)"></div>
    <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(255, 255, 0)' }"
         @click="setColor" style="grid-column: 3; grid-row: 1; background-color: rgb(255, 255, 0)"></div>
    <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(255, 153, 0)' }"
         @click="setColor" style="grid-column: 4; grid-row: 1; background-color: rgb(255, 153, 0)"></div>
    <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(204, 255, 51)' }"
         @click="setColor" style="grid-column: 1; grid-row: 2; background-color: rgb(204, 255, 51)"></div>
    <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(102, 255, 51)' }"
         @click="setColor" style="grid-column: 2; grid-row: 2; background-color: rgb(102, 255, 51)"></div>
    <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(51, 204, 51)' }"
         @click="setColor" style="grid-column: 3; grid-row: 2; background-color: rgb(51, 204, 51)"></div>
    <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(0, 255, 255)' }"
         @click="setColor" style="grid-column: 4; grid-row: 2; background-color: rgb(0, 255, 255)"></div>
    <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(51, 204, 255)' }"
         @click="setColor" style="grid-column: 1; grid-row: 3; background-color: rgb(51, 204, 255)"></div>
    <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(102, 153, 255)' }"
         @click="setColor" style="grid-column: 2; grid-row: 3; background-color: rgb(102, 153, 255)"></div>
    <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(0, 102, 255)' }"
         @click="setColor" style="grid-column: 3; grid-row: 3; background-color: rgb(0, 102, 255)"></div>
    <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(153, 102, 0)' }"
         @click="setColor" style="grid-column: 4; grid-row: 3; background-color: rgb(153, 102, 0)"></div>
    <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(255, 204, 255)' }"
         @click="setColor" style="grid-column: 1; grid-row: 4; background-color: rgb(255, 204, 255)"></div>
    <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(255, 102, 204)' }"
         @click="setColor" style="grid-column: 2; grid-row: 4; background-color: rgb(255, 102, 204)"></div>
    <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(255, 102, 102)' }"
         @click="setColor" style="grid-column: 3; grid-row: 4; background-color: rgb(255, 102, 102)"></div>
    <div class="colorField" v-bind:class="{ bordered: catColor === 'rgb(255, 0, 0)' }"
         @click="setColor" style="grid-column: 4; grid-row: 4; background-color: rgb(255, 0, 0)"></div>
  </div>
</template>

<script>
  export default {
    name: 'colorSelect',
    computed: {
      catColor:
        {
          get () {
            return this.$store.state.catColor;
          },
          set (val) {
            this.$store.state.commit('setCatColor', val)
          },
        },
    },
    methods: {
      setColor(e){
        this.$store.commit('setCatColor', e.target.style['background-color'])
      },
    }

  }
</script>

<style scoped>
  .gridContainer {
    display: grid;
    max-width: 300px;
  }
  .colorField {
    margin: 3px;
    cursor: pointer;
    width: 24px;
    height: 24px;
    border: 1px solid white;
  }
  .bordered{
    border: 1px solid black !important;
  }
</style>
