<template>
  <div id="noteHead">
    <span><h1>iTask</h1>
      <h4>{{user}}<button @click="logout"></button></h4>
      <button title="Cleart the task list" id="clearList" @click="removeAll" >X</button>
    </span>
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
    computed: {
      user(){
        return this.$store.getters.user.email;
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

<style scoped>
  #noteHead {
/*    display: grid;
    grid-template-columns: 2fr 2fr;*/
    align-content: center;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.9);
    height: 15%;
    font-size: 2vh;
    grid-column-gap: 20vw;
    opacity: 1;
  }

  h4{
    justify-content: center;
    display: grid;
    grid-template-columns: minmax(30vw, 30vh) 3vw;
    text-align:center;
  }

  h4 button{
    align-self: center;
    border: 0;
    background: center / contain no-repeat url('../images/logout.png') ;
    width: 2vh;
    height: 2vh;
    opacity: 0.4;
  }

  h4 button:hover{
    opacity: 1;
    cursor: pointer;
  }

  #clearList{
    font-size: 2.5vh;
    position: absolute;
    right: 3%;
    bottom: 3%;
    border: 0;
    background: none;
  }

  #clearList:hover{
    color: red;
    cursor: pointer;
  }



</style>