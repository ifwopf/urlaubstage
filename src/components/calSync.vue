<template>
  <div class="wrapper">
    <div class="header">
      <h1 class="jahrtitel">
        <i class="material-icons" id="home" @click="redirect('/#/calOverview')">
          home
        </i>
        Kalender synchronisieren
      </h1>
      <div class="infobox">
        {{ infotext }}
      </div>

    </div>
    <div class="" v-if="clickedPersonalCal != null || clickedSharedCal != null">
      <div class="button save" @click="reset">Reset</div>
    </div>
    <div class="personal" @drop="dropback" @dragover="allowDrop">
      <div class="titlebox">
        <h2 class="title">Deine Kalender</h2>
      </div>
      <div v-if="!cal.shared" v-for="cal in $store.state.cals">
        <div  class="calendar" :id="cal.id" v-if="cal.id == clickedPersonalCal || clickedPersonalCal == null"
              @click="getCats(cal.id, false)">
          {{cal.name}}
        </div>
      </div>
      <div class="personalCats" >
        <div class="personalCat" v-for="cat in personalCats" @click="showOptions(cat.id)"
             :draggable="true" @dragstart="drag" :style="cat.style" :id="cat.id">
          {{cat.name}}
          <div v-if="showOption == cat.id">
            Verschieben nach:
            <div class="sharedOptions" v-for="catShared in $store.getters.getSharedCats"
                 :style="catShared.style" @click="moveTo(false, catShared.id)">
              {{catShared.name}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="shared">
      <div class="titlebox">
        <h2 class="title">Team-Kalender</h2>
      </div>
      <div v-if="cal.shared" v-for="cal in $store.state.cals">
        <div class="calendar" v-if="cal.id == clickedSharedCal || clickedSharedCal == null"
              :id="cal.id" @click="getCats(cal.id, true)">
          {{cal.name}}
        </div>
      </div>
      <div class="sharedCats">
        <div v-for="cat in $store.getters.getSharedCats" :id="cat.id"
             @drop="drop" @dragover="allowDrop" :style="cat.style" class="sharedCat">
          {{cat.name}}
          <div v-for="personalCat in sharedCats[cat.id]" class="personalCat" :style="personalCat.style"
               @click="showOptions(personalCat.id)"
               :draggable="true" @dragstart="dragback" :id="personalCat.id">
            {{personalCat.name}}
            <div v-if="showOption == personalCat.id">
              Verschieben nach:
              <div class="sharedOptions" v-for="catShared in $store.getters.getSharedCats" v-if="catShared.id != cat.id"
                   :style="catShared.style" @click="moveTo(cat.id, catShared.id)">
                {{catShared.name}}
              </div>
              <div class="sharedOptions" @click="moveTo(cat.id, false)">
                No Sync
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="clickedPersonalCal != null && clickedSharedCal != null">
      <div class="button save" @click="saveSyncPair">SAVE</div>
    </div>


  </div>
</template>
<script>

  export default {
    name: 'calSync',
    data () {
      return {
        newCalender : "Urlaubskalender",
        personalCats: {},
        sharedCats: {},
        clickedPersonalCal: null,
        clickedSharedCal: null,
        showOption: 0
      }
    },
    created () {
      this.$store.dispatch('calReady')
    },
    computed: {
      // a computed getter
      infotext: function () {
        // `this` points to the vm instance
        var text = ""
        if (this.clickedSharedCal == null && this.clickedPersonalCal == null) {
          text = "Wähle einen deiner Kalender und einen Teamkalender aus"
        }
        else if (this.clickedSharedCal == null) {
          text = "Wähle noch einen Teamkalender aus"
        }
        else if (this.clickedPersonalCal == null) {
          text = "Wähle noch einen deiner Kalender aus"
        }
        else {
          text = "Ziehe die Kategorien deines persönlichen Kalenders in die Felder der Kategorien der Team-Kalender oder wieder zurück"
        }
        return text
      }
    },
    methods: {
      getCats (calID, shared) {
        if(shared){
          this.clickedSharedCal = calID
        }
        else {
          this.clickedPersonalCal = calID
        }
        if (this.clickedPersonalCal != null && this.clickedSharedCal != null){
          var payload = {"uCalID": this.clickedPersonalCal, "sCalID": this.clickedSharedCal}
          this.$store.dispatch('getCats', payload).then(() => {
            this.personalCats = JSON.parse(JSON.stringify(this.$store.getters.getPersonalCats));
            for (var key of Object.keys(this.$store.getters.getSharedCats)) {
              this.$set(this.sharedCats, key, [])
              for ( var index in this.$store.getters.getSharedCats[key]['syncList']) {
                var data = this.$store.getters.getPersonalCats[this.$store.getters.getSharedCats[key]['syncList'][index]]
                this.sharedCats[key].push(data)
                this.$delete(this.personalCats, this.$store.getters.getSharedCats[key]['syncList'][index])
              }
            }

          });
        }
      },
      saveSyncPair() {
        var listnosync = []
        for (var nosync in this.personalCats) {
          listnosync.push(nosync)
        }
        var payload = {"syncDict": this.sharedCats, "nosync": listnosync}
        this.$store.dispatch('saveSyncPair', payload)
        this.$router.push({name: 'calOverview'})
        location.reload()

      },
      allowDrop(event) {
        event.preventDefault();
      },
      drag(event) {
        event.dataTransfer.setData("personalCat", event.target.id);
      },
      dragback(event) {
        event.dataTransfer.setData("personalCat", event.target.id);
        event.dataTransfer.setData("parentID", event.target.closest('.sharedCat').id)
      },
      drop(event) {
        event.preventDefault();
        event.stopPropagation();
        var data = event.dataTransfer.getData("personalCat");
        this.sharedCats[event.target.closest('.sharedCat').id].push(this.$store.getters.getPersonalCats[data])
        this.$delete(this.personalCats, data)
        if(event.dataTransfer.getData("parentID")){
          var sharedCatID = event.dataTransfer.getData("parentID")
          this.sharedCats[sharedCatID].splice(this.sharedCats[sharedCatID].indexOf(this.$store.getters.getPersonalCats[data]), 1)
        }
      },
      dropback(event) {
        event.preventDefault();
        event.stopPropagation();
        var personalCatID = parseInt(event.dataTransfer.getData("personalCat"));
        var sharedCatID = parseInt(event.dataTransfer.getData("parentID"));
        if (this.sharedCats[sharedCatID] !== undefined) {
          this.sharedCats[sharedCatID].splice(this.sharedCats[sharedCatID].indexOf(this.$store.getters.getPersonalCats[personalCatID]), 1)
          this.$set(this.personalCats, personalCatID, this.$store.getters.getPersonalCats[personalCatID])
        }
      },
      redirect (link) {
        window.location.href = link
      },
      showOptions(catID) {
        if(this.showOption != catID){
          this.showOption = catID;
        }
        else {
          this.showOption = 0;
        }

      },
      moveTo(origin, sharedCatID) {
        if(!origin) {
          this.sharedCats[sharedCatID].push(this.$store.getters.getPersonalCats[this.showOption])
          this.$delete(this.personalCats, this.showOption)
        }
        else {
          if(!sharedCatID) {
            this.sharedCats[origin].splice(this.sharedCats[origin].indexOf(this.$store.getters.getPersonalCats[this.showOption]), 1)
            this.$set(this.personalCats, this.showOption, this.$store.getters.getPersonalCats[this.showOption])
          }
          else {
            this.sharedCats[sharedCatID].push(this.$store.getters.getPersonalCats[this.showOption])
            this.sharedCats[origin].splice(this.sharedCats[origin].indexOf(this.$store.getters.getPersonalCats[this.showOption]), 1)
          }
        }
      },
      reset() {
        this.$store.commit("setSharedCats", {})
        for (var key in this.sharedCats){
          if (this.sharedCats.hasOwnProperty(key)) {
            Vue.delete(this.sharedCats, key)
          }
        }
        for (var key2 in this.personalCats){
          if (this.personalCats.hasOwnProperty(key2)) {
            Vue.delete(this.personalCats, key2)
          }
        }
        this.sharedCats = {}
        this.clickedPersonalCal = null
        this.clickedSharedCal = null
      }
    }
  }
</script>
<style>
  body {
    background-color: aliceblue;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently supported by Chrome, Opera and Firefox */
    text-align: center;
  }
  html,body{margin:0;padding:0}
</style>
<style scoped>
  .wrapper{
    max-width: 1200px;
  }
  .shared, .personal {
    border: 1px solid #000;
    padding: 5px;
    min-width: 300px;
    width: 90%;
    max-width: 450px;
    text-align: center;
    display: inline-block;
    margin: 10px;
    background-color: #fff;
    vertical-align: top;
  }
  .calendar {
    background-color: #fff;
    box-shadow: 5px 2.5px 2.5px grey;
    border: solid;
    border-width: 1px;
    font-size: 20px;
    padding: 10px;
    text-align: center;
    margin: 10px;
    cursor: pointer;
  }
  .sharedCats,.personalCats {
    margin: 5px;
  }
  .personalCat {
    box-shadow: 5px 2.5px 2.5px grey;
    margin: 5px;
    cursor: grab;
    padding: 5px;
    border: 1px solid #000;
  }
  .sharedCat {
    border: 1px solid #000;
    margin: 20px 10px;
    padding: 10px;
  }
  .button {
    border: solid;
    border-width: 1px;
    padding: 10px 24px;
    text-align: center;
    text-decoration: none;
    font-size: 16px;
    margin: 10px auto;
    cursor: pointer;
    display: inline-block;
  }
  .jahrtitel {
    background-color: #fff;
    display: inline-block;
    padding: 10px;
    margin: 10px;
    color: #000;
    text-align: center;
  }
  #home {
    margin: 5px;
    display: block;
    float: left;
    cursor: pointer;
    border: 1px solid #000;
  }
  .header{
    text-align: center;
  }
  h2 {
    display:inline-block;
    background-color: #fff;
    padding: 5px;
  }
  .infobox, .save {
    padding: 10px 5px;
    width: 90%;
    text-align: center;
    margin: 10px auto;
    background-color: #fff;
    max-width: 930px;
  }
  .save:hover {
    background-color: aliceblue;
  }
  .save{
    box-shadow: 5px 2.5px 2.5px grey;

  }
  .sharedOptions {
    border: 1px solid #000;
    margin: 3px;
  }
</style>

