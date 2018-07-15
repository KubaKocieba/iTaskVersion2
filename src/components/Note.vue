<template>
  <div id="note">
    <app-heading></app-heading>
    <div id="tabsSection">
      <div id="addTab" @click="newTab">+</div>
      <div id="tabs">
        <app-task-tab v-for="(tab, tabKey) in allTabs" :name="tab.name" :key="tabKey" :tabKey="tabKey" @makeActive="activateTab" :isActive="activeTab"></app-task-tab>
      </div>
    </div>
    <app-task-list :taskListTab="activeTab"></app-task-list>
  </div>
</template>

<script>
  import Heading from './Heading'
  import TaskList from './TaskList'
  import Footer from './Footer'
  import TaskTab from './taskTab'

  export default {
    components:{
      appHeading: Heading,
      appTaskList: TaskList,
      appTaskTab: TaskTab
    },
    data(){
      return {
        activeTab: localStorage.getItem('activeTab') || 0,
        tabs: this.$store.getters.tabs
      }
    },
    mounted(){
      this.$store.dispatch('fetchTabs');
    },
    computed: {
      allTabs(){
        return this.tabs;
      }
    },
    methods:{
      newTab(){
        this.$store.dispatch('createNewTab');
      },
      activateTab(tab){
        this.activeTab = tab;
      }
    }
  }
</script>

<style scoped>

#note
{
  height: 100%%;
  background-color: rgba(245, 240, 55, 0.9);
  border-bottom-right-radius: 15px;
  width: 95%;
  margin: 0 auto;
  display: grid;
  grid-template-rows: 10% 3% 87%;
}

::-webkit-scrollbar{
  background-color: rgba(0, 0, 0, 0.0);
}

::-webkit-scrollbar-thumb{
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  border: 3px solid transparent;
  background-clip: content-box;
}

::-webkit-scrollbar-button{
  background-size: cover;
  background-position: -15px 0;
  height: 10px;
  width: 10px;
}

#tabsSection{
  background-color: white;
  display: grid;
  grid-template-columns: 1fr 9fr;
  border-bottom: 0.5px solid black;
  justify-self: stretch;
}

#tabs{
  overflow-y: scroll;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18vw,20vw));
  background-color: white;
  justify-items: stretch;
  justify-content: start;
}

#addTab
{
  font-weight: bolder;
  background-color: #dedbdb;
  border-top-right-radius: 20px;
  cursor: pointer;
}

/*::-webkit-scrollbar-button:increment{
  background-image: url("../images/arrow-down.png");
  background-position: -15px -18px;
}

::-webkit-scrollbar-button:decrement{
  background-image: url("../images/arrow-up.png");
}*/

</style>