<template>
  <div>
    <span><input
      type="text"
      placeholder="Fill me with a new task"
      v-model="newTask"
      @keydown.enter="addTask"
      ></input>
      <button @click="addTask">Add To List</button></span>
  </div>
</template>

<script>
import {mapActions} from 'vuex'

export default {
    data(){
      return {
        newTask: ''
      }
    },
    methods:{
      ...mapActions({
        pushTask: 'addTask'
      }),
      addTask(){
        this.pushTask({
          shortDesc: this.newTask,
          description: 'No info',
          completed: false,
          id: new Date().getTime()
        });

        this.newTask = '';
      }
    }
  }
</script>