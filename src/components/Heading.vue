<template>
  <div id="noteHead">
    <span><h1>iTask</h1><button @click="removeAll">Clear list</button><button @click="logout">Logout</button></span>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'

  export default {
    data(){
      return {
        actualDate: 0
      }
    },
    methods:{
      ...mapActions([
        'clearList',
        'logout'
      ]),
      removeAll(){
        this.clearList();
      },
      logoutUser(){
        this.logout();
      }
    }
  }
</script>