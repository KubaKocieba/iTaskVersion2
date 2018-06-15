<template>
  <div id="taskList">
    <ul v-if="tasksLoaded">
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
          tag="li"
          ></Task>
      </transition-group>
    </ul>
    <div v-else id="loading">Loading</div>


  </div>
</template>

<script>

  import taskTools from './taskTools'
  import Task from './Task'
  import obj from './Title'

  export default {
    components:{
      taskTools,
      Task
    },
    data(){
      return {
        generic: {
          shortDesc: '',
          description: 'No info',
          completed: false,
          id: '',
          slot: ''
        },
        status: false
      }
    },
    mounted(){
      console.log('zamontowano i fetchujemy listę');
      this.$store.dispatch('fetchList');
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
        if (this.tasksAmount >= 11)
        {
          setTimeout(function(){
            document.querySelectorAll('.addingTask')[document.querySelectorAll('.addingTask').length-1].focus()}
            , 0);

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

</style>

