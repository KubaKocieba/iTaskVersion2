<template>
  <div id="note">
    <app-heading></app-heading>
    <app-task-list></app-task-list>
    <app-task-add-footer></app-task-add-footer>
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
      appTaskAddFooter: Footer
    },
    methods:{

    }
  }
</script>