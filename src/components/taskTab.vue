<template>
  <div class="tab" :class="{active: isItActive}">
    <input v-focus v-if="edit" @blur="edit = false" type="text" v-model="tabName" @keydown.enter="editTab"></input>
    <span v-else class="nameDisplay" @click="displayTab" @contextmenu.prevent="edit = true">{{this.tab}}</span>
    <span class="closeTab" @click="closeTab">x</span>
  </div>
</template>


<script>
  const focus = {
    inserted(el) {
      el.focus();
    }
  }

  export default{
    props: ['name','tabKey', 'isActive'],
    data(){
      return {
        tab: this.name,
        tabActive: false,
        edit: false
      }
    },
    directives: {
      focus
    },
    computed:{
      tabName:{
        get(){
          return this.tab
        },
        set(value){
          return value;
        }
      },
      isItActive(){
        return this.tabKey === this.isActive;
      }
    },
    created(){
      this.$emit('makeActive', this.tabKey);
    },
    methods:{
      editTab(event){
        const inputTxt = event.target.value;

        if (inputTxt.length && inputTxt !== this.tab)
        {
          this.tab = inputTxt;
          this.$store.dispatch('editTab', {name: inputTxt, key: this.tabKey});
        }
      },
      closeTab(){
        let vm = this;

        if (Object.keys(this.$store.getters.tabs).length > 1)
        {
          this.$store.dispatch('deleteTab', {name: this.tab, key: this.tabKey, tabToEmit: vm});
        }
      },
      displayTab(){
        if(!this.isItActive)
        {
          this.$store.dispatch('fetchList', this.tabKey);
          this.$emit('makeActive', this.tabKey);
        }
      }
    }
  }
</script>

<style scoped>
  .tab{
    display: grid;
    grid-template-columns: 80% 20%;
    background-color: #ec9adb;
    border-top-left-radius: 20px;
    box-shadow: 1px 0px 8px -1px #000;
  }

  .tab input,
  .tab .nameDisplay {
    background: none;
    border: 0;
    outline: none;
    width: 90%;
    cursor: pointer;
    font-size: 0.65em;
    align-self: center;
    justify-self: end;
  }

  @media screen and (min-width: 1100px)
  {
    .tab input,
    .tab .nameDisplay {
      font-size: 0.85em;
    }
  }

  .tab .nameDisplay {
    align-self: center;
    justify-self: center;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .closeTab{
    display: inline-block;
    cursor: pointer;
  }

  .tab input:focus{
    background-color: #fdd2f4;
    border-radius: 2px;
    outline:none;
  }

  .active
  {
    background-color: #ea4fca;
  }

  .active .closeTab,
  .active .nameDisplay{
    font-weight: bolder;
    color: black;
  }

</style>