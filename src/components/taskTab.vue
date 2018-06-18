<template>
  <div class="tab"><input type="text" v-model="tabName" @keydown.enter="addTab"></input><span class="closeTab" @click="closeTab">x</span></div>
</template>


<script>
  export default{
    props: ['name'],
    data(){
      return {
        tab: this.name
      }
    },
    computed:{
      tabName:{
        get(){
          return this.tab
        },
        set(value){
          return value;
        }
      }
    },
    methods:{
      addTab(event){
        this.$store.dispatch('createNewTab', event.target.value);
      },
      closeTab(){

      }
    }
  }
</script>

<style scoped>
  .tab{
    background-color: #ec9adb;
    border-top-left-radius: 20px;
    box-shadow: 1px 0px 8px -1px #000;
  }

  .tab input{
    background: none;
    border: 0;
    otuline: none;
    width: 75%;
  }

  .closeTab{
    cursor: pointer;
  }

</style>