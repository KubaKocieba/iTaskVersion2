<template>
  <div id="main">
   <span id="title"><h1>iTask</h1></span>
    <div id="login">
      <div><h1>Hello!</h1> <p> Please login or signup for an account </p></div>
        <form>
        <div>
        <label for="userinp">Email:</label>
        <input type="text"
          v-model="user" id="userinp"
          placeholder="Login with email"
          />
        </div>
        <div>
           <label for="userpass">Password:</label>
           <input
           @keydown.enter="signUp ? (user.length && passRetype.length ? signUpUser() : '') : loginUser()" type="password"
           v-model="pass" id="userpass"
           placeholder="Password goes here"
           />
        </div>
          <div v-if="signUp">
            <label for="retypeuserpass">Re-type password:</label>
            <input type="password"
            @keydown.enter="signUp ? (user.length && pass.length ? signUpUser() : '') : loginUser()"
            v-model="passRetype"
            id="retypeuserpass"
            placeholder="Re-type password here" /></div>
        </form>
          </div>
        <button @click.prevent="signUp? signUpUser() : loginUser()">GO!</button>
        <div id="userType" @click="signUp = !signUp">{{!signUp ? 'I want to create a new user' : 'I already have an account'}}</div>
      <div id="errorBox">{{errorMessage}}</div>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'

export default {
  data(){
    return {
      user: '',
      pass: '',
      passRetype: '',
      signUp: false,
    }
  },
  computed:{
    errorMessage(){
      return this.$store.getters.authError;
    }
  },
  methods: {
    ...mapActions({
      sign: 'signUp',
      log: 'login'
    }),
    signUpUser(){
      this.sign({email: this.user, password: this.pass});
    },
    loginUser(){
      this.log({email: this.user, password: this.pass});
    }
  }
}

</script>