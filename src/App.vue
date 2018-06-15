<template>
  <div id="app">
    <app-title v-if="loggedIn"></app-title>
    <app-note v-if="loggedIn" />
    <app-login v-else-if="!checkStorage()"/>
  </div>
</template>

<script>
import Note from './components/Note'
import Login from './components/Login'
import Title from './components/Title'

export default {
  name: 'App',
  components: {
    appLogin: Login,
    appNote: Note,
    appTitle: Title
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
  display: grid;
  grid-template-rows: 8vh 90vh;
  grid-row-gap: 1vh;
}

@font-face
{
  font-family: purisa;
  src: url("./font/Purisa.ttf");
}
body * {
  font-family: purisa;
  src: url("./font/Purisa.ttf");
}

body
{
  background: url("./images/desk.jpg");
  background-size: cover;
  margin: 0;
}

body::after
{
  display: block;
  content: "";
  opacity: 0.2;
  background: white;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}

</style>
