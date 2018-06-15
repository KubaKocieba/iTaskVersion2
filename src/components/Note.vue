<template>
  <div id="note">
    <app-heading></app-heading>
    <app-task-list></app-task-list>
  </div>
</template>

<script>
  import Heading from './Heading'
  import TaskList from './TaskList'
  import Footer from './Footer'

  export default {
    components:{
      appHeading: Heading,
      appTaskList: TaskList,
    },
    methods:{

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
  grid-template-rows: 10% 90%;
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

/*::-webkit-scrollbar-button:increment{
  background-image: url("../images/arrow-down.png");
  background-position: -15px -18px;
}

::-webkit-scrollbar-button:decrement{
  background-image: url("../images/arrow-up.png");
}*/

</style>