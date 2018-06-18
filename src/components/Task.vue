<template>
  <div class="taskDiv" v-show="filter === null || task.completed === filter">
    <span>
      <input class="addingTask"
          @click="edit = !edit"
          :class="{completed : task.completed}"
          :placeholder="task.shortDesc"
          onfocus="this.select()"
          v-model="editTask.shortDesc"
          @keydown.enter="event => {task.id ? updateTask() : addTask(event)}"
          @keydown.esc="event => {edit = !edit;editTask.shortDesc = task.shortDesc;blurInput(event)}"
          :id="name"
        />
      </span>

        <span>
          <button class="showDetailsBtn" v-if="task.id" @click="details = !details" title="Details">>></button>
        </span>

      <transition name="detailsAppear" mode="out-in" type="animation">
      <div class="tDetails" v-if="details && task.id">
        <div class="leftCol">
            <span v-if="!descEdit" @click="editDescription">{{ task.description }}</span>
            <textarea v-else
                class="taskDetailsInfo"
                v-model="editTask.description"
                @keydown.esc="exitEditDesc"
                @keydown.enter="updateTask"
            ></textarea>
        </div>
        <div class="rightCol">
          <button title="Click to change status" class="changeStatus" :class="{un: task.completed}" v-if="task.id" @click="changeStatus"></button>
          <button title="Remove the task" class="removeTask" v-if="task.id" @click="removeTask"></button>
        </div>
      </div>
    </transition>
    </span>

  </div>
</template>

<script>
  export default {
    props: ['task', 'name', 'filter'],
    data(){
      return {
        edit: false,
        descEdit: false,
        details: false
      }
    },
    computed: {
      editTask:{
        get(){
          return {...this.task};
        },
        set(newValue){
          return {...newValue};
        }
      }
    },
    methods: {
      addTask(event){
        if(event.target.value.length)
        {
          var newTaskObj = {
            shortDesc: event.target.value,
            description: 'No info',
            completed: false,
            id: new Date().getTime(),
            slot: event.target.attributes.id.value
           };

          this.$store.dispatch('addTask', newTaskObj);
        }
      },
      resetInputParams(){
        this.edit = false;
        this.descEdit = false;
        this.details = false;
      },
      removeTask(){
        this.resetInputParams();
        this.editTask = {};
        this.$store.dispatch('removeTask',this.task.id);
      },
      updateTask(){
        let edited = this.editTask;

        Object.keys(edited).forEach(key =>{
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
      },
      blurInput(event){
        event.target.blur();
      },
      changeStatus(){
        this.editTask.completed = !this.editTask.completed;
        this.updateTask();
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

  .addingTask{
    width: 70vw;
    font-size: 2vh;
    margin-bottom: 2vh;
    margin-top: 1.8vh;
    background: none;
    border:0;
    border-bottom: 1px solid rgba(0,0,0,0.3);
  }

  .addingTask:focus{
    background-color: rgba(255,64,32,0.3);
    outline: none;
  }

  .tDetails{
    display: grid;
    grid-template-columns: 55vw 15vw;
    align-items: center;
    justify-content: center;
  }

  .removeTask,
  .changeStatus
  {
    border: 0;
    width: 5vw;
    height: 5vw;
  }
  .removeTask{
    background: no-repeat center / 70% 70% url("../images/erase.png");
  }

  .taskDetailsInfo{
    resize: none;
    width: 70%;
    height: 6vh;
    border-radius: 8px;
    background-color: #e6e471;
  }

  .showDetailsBtn{
    border: 0;
    background: none;
    font-weight: bolder
  }

  .completed{
    color: #2b9e08;
  }

  .changeStatus
  {
    outline: none;
    background: no-repeat center/ contain url('../images/check.png');
  }

  .changeStatus.un{
    background-image: url('../images/uncheck.png');
  }

  .showDetailsBtn{
    border: 1px solid black;
    border-radius: 5px;
    font-size: 0.6em;
    outline: 0;
  }

  .showDetailsBtn:hover{
    background-color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
  }

    @media screen and (min-width: 1100px)
  {
    .addingTask{
      width: 70%;
    }

   .tDetails{
    margin: 0 5vw 0 12vw;
    grid-template-columns: 4fr 2fr;
    grid-column-gap: 2vw;
    justify-items: stretch;
    align-items: stretch;
   }

    .removeTask{
      background-size: 35% 35%;
    }

    .changeStatus{
      background-size: 65% 30%;
    }

    .taskDetailsInfo
    {
      width: 100%;
      height: 100%;
    }

  }

</style>