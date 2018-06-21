<template>
  <div id="taskList">
    <small>
      <div class="filters">
      <label for="filters"> Filter by
      <select  v-if="tasksLoaded && tasks" v-model="status">
        <option v-for="option in filterOptions" :value="option.value" @click="status = option.value">{{option.text}}</option>
      </select></label>
    </div>
    </small>
    <div id="list" v-if="tasksLoaded">
      <transition-group appear leave-active-class="animated fadeOut">
        <Task
          v-for="(task, index) in areEnoughInputs"
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          mode="in-out"
          v-if="!task.init"
          :name="`taskInput${index}`"
          :task="populateInputs(tasks, index)"
          :key="index"
          :filter="status"
          tag="div"
          ></Task>
      </transition-group>
    </div>
    <div v-else id="loading">Loading</div>


  </div>
</template>

<script>

  import taskTools from './taskTools'
  import Task from './Task'

  export default {
    components:{
      taskTools,
      Task
    },
    props: ['taskListTab'],
    data(){
      return ({
        generic: {
          shortDesc: '',
          description: 'No info',
          completed: null,
          id: '',
          slot: '',
          listTab: this.taskListTab
        },
        status: null,
        filterOptions: [
          { text: 'Completed', value: true },
          { text: 'Inompleted', value: false },
          { text: 'Clear filter', value: null }
        ]
      });
    },
    mounted(){
      this.$store.dispatch('fetchList', this.taskListTab);
    },
    methods:{
      blur(event){
        event.target.value = '';
        event.target.blur();
      },
      populateInputs(tasks, ind){
        var search;

        if (tasks)
        {
          let arr = [];

          Object.keys(tasks).forEach(task => {
            arr.push(tasks[task]);
          });

          search = arr.find((task) => {
            return task.slot === 'taskInput' + ind;
          });
        }

        return search || this.generic;
      }
    },
    computed:{
      inputs(){
        return 11 - this.tasksAmount;
      },
      tasksAmount(){
        return Object.keys(this.$store.getters.tasks).length + 1;
      },
      tasks(){
        let tasks = this.$store.getters.tasks;

        return tasks;
      },
      tasksLoaded(){
        return this.$store.getters.tasksLoaded;
      },
      areEnoughInputs(){
        if (this.tasksAmount >= 12)
        {
          setTimeout(()=> {
            document.getElementById('taskInput10').focus();
            document.getElementById('taskInput10').blur();
          },0);

          return this.tasksAmount-1;
        }
        else{
          return 10;
        }
      }
    }
  }
</script>

<style scoped>

.v-leave-after{
  position:absolute;
}

.v-leave-to,
.v-enter-to{
  animation-duration: .5s;
}

#loading{
  color: black;
  margin-top: 5vh;
  font-size: 2.5em;
}

#taskList{
  overflow-y: scroll;
}

.filters{
  position: absolute;
  top: 1vh;
  right: 3vw;
  color: white;
  z-index: 32000;
}

.filters select{
  background: rgba(255,255,255,0.4);
  border-radius: 8px;
  color: white;
  width: 35vw;
}

.filters select:focus{
  color: black;
  outline: none;
}

.filters select:not(:focus){
  color: white;
}


.statusChange{
  padding: 0 1vw;
}

.statusChange:hover{
  border: 1px solid white;
  margin: 0 -1px;
  border-radius: 8px;
  box-sizing: border-box;
  cursor: pointer;
}

#list{
  -webkit-margin-before: 0;
    -webkit-margin-after: 0;
    -webkit-margin-start: 0;
    -webkit-margin-end: 0;
    -webkit-padding-start: 0;
}

@media screen and (min-width: 1100px)
{
  #list span
  {
    width: 100%;
    display: grid;
    justify-content: center;
    grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
    grid-gap: 2vw;
  }
}

</style>

