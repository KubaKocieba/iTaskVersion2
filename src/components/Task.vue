<template>
  <div>
    <span>
      <span v-if="!edit" @click="edit = !edit">{{task.shortDesc}}</span>
      <span v-else>
        <input
          autofocus
          onfocus="this.select()"
          v-model="editTask.shortDesc"
          @keydown.enter="updateTask"
          @keydown.esc="edit = !edit;editTask.shortDesc = task.shortDesc;"
          />
          <button @click="updateTask">OK</button>
      </span>
      <button @click="details = !details">>></button>
      <button @click="removeTask">Throw out</button>
      <transition name="detailsAppear" mode="out-in" type="animation">
      <div class="tDetails" v-if="details">
        <div>{{ task.completed }}</div>
        <div>
          <span v-if="!descEdit" @click="editDescription">{{ task.description }}</span>
          <span v-else>
            <textarea
              v-model="editTask.description"
              @keydown.esc="exitEditDesc"
              @keydown.enter="updateTask"
            ></textarea></span>
        </div>
      </div>
    </transition>
    </span>

  </div>
</template>

<script>
  export default {
    props: ['task'],
    data(){
      return {
        edit: false,
        descEdit: false,
        details: false,
        editTask: {
          ...this.task
        }
      }
    },
    created(){
      console.log(...this.task);
    },
    methods: {
      removeTask(){
        this.$store.dispatch('removeTask',this.task.id);
      },
      updateTask(){
        let edited = this.editTask;

        Object.keys(edited).forEach(key=>{
          if (edited[key] !== this.task[key]){
            this.$store.dispatch('updateTask',
              {
               id: edited.id,
               target: key,
               value: edited[key]
             });
          }
        })

        if (this.edit){
          this.edit = false;
        }
        else if (this.descEdit)
        {
          this.descEdit = false;
        }
      },
      editDescription()
      {
        this.descEdit = !this.descEdit;
      },
      exitEditDesc(){
        this.descEdit = !this.descEdit;
      }
    }
  }

</script>

<style scoped>


  .detailsAppear-enter{
    opacity: 0;
  }

  .detailsAppear-enter-to{
    /*opacity: 1;*/
    animation: slideIn .6s forwards;
    /*transition: opacity 1s;*/
  }

  .detailsAppear-leave{
    /*opacity: 1;*/
  }

  .detailsAppear-leave-to{
    /*opacity: 0;*/
    animation: slideOut .6s forwards;
  }

  @keyframes slideIn{
    0%{
      opacity: 0;
      transform: translateY(-50px);
    }
    50%{
      opactiy: 0.2;
      transform: translateY(0px);
    }
    75%{
      opacity: 1;
    }
    100%{
      opacity:1;
    }
  }

  @keyframes slideOut{
    0%{
      opacity:1;
      transform: translateY(0);
    }
    20%
    {
      opacity: 0;
    }
    75%{
      opacity:0;
    }
    100%{
      opacity: 0;
      position: absolute;
      transform: translateY(-50px);
    }
  }

</style>