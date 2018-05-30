<template>
  <div id="taskList">
    <ul v-if="tasksLoaded">
      <transition-group appear leave-active-class="animated fadeOut" enter-active-class="animated fadeIn">
        <Task
          v-for="(task,index) in tasks"
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          mode="out-in"
          v-if="!task.init"
          :task="task"
          :key="index"
          tag="li"
          ></Task>
      </transition-group>
    </ul>
    <div v-else>Loading</div>
    <div v-for="task in inputs">
      <input class="addingTask" :tag="`taskInput${task}`" type="text" style="{width: 100px}" @keydown.esc="event => {blur(event)}" @keydown.enter="event=>{addTask(event)}">
    </div>

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
    created(){
      this.$store.dispatch('fetchList');
    },
    methods:{
      addTask(event){
        if(event.target.value.length)
        {
          this.$store.dispatch('addTask', {
            shortDesc: event.target.value,
            description: 'No info',
            completed: false,
            id: new Date().getTime(),
            slot: event.target.attributes.tag.value
           });
        }
      },
      blur(event){
        event.target.value = '';
        event.target.blur();
      }
    },
    computed:{
      inputs(){
        return 10 - Object.keys(this.$store.getters.tasks).length-1;
      },
      tasks(){
          return this.$store.getters.tasks;
      },
      tasksLoaded(){
        return this.$store.getters.tasksLoaded;
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

.addingTask{
  border:0;
  border-bottom: 1px solid rgba(0,0,0,0.3);
}

.addingTask:focus{
  background-color: rgba(255,64,32,0.3);
  outline: none;
}



</style>

