<template>
  <div id="app">
    <app-note v-if="loggedIn" />
    <app-login v-else-if="!checkStorage()"/>
  </div>
</template>

<script>
import Note from './components/Note'
import Login from './components/Login'

export default {
  name: 'App',
  components: {
    appLogin: Login,
    appNote: Note
  },
  computed: {
    loggedIn(){
      return this.$store.getters.user.loggedIn;
    }
  },
  created(){
    var loginInfo = this.$store.getters.user;

    if (this.checkStorage() && !loginInfo.idToken){
      const userData = {
          refreshToken: localStorage.getItem('refreshToken'),
          localId: localStorage.getItem('userId')
      }

      this.$store.dispatch('refreshLogin', userData);
    }
  },
  methods:{
    checkStorage(){
      return !!localStorage.getItem('refreshToken');
    }
  }
}

</script>

<style>
#app {
  font-family: 'Purisa', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
