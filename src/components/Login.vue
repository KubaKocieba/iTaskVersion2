<template>
  <div id="main">
   <span id="title"><h1>iTask</h1></span>
    <div id="login">
        <div><h1>Hello!</h1>
          <span class="userType" :class="{selected : returnSingUp()}" id="userTypeNew" @click="signUp = true">New user</span>
          <span class="userType" :class="{selected : !returnSingUp()}" id="userTypeExisting" @click="signUp = false">Already an user</span>
        </div>
        <form>
          <p> Please provide {{signUp? 'new user' : 'login'}} data</p>
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
          <button @click.prevent="signUp? signUpUser() : loginUser()">GO!</button>
      <div id="errorBox">{{errorMessage}}</div>
        </form>
          </div>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'

export default {
  data(){
    return {
      signUp: false,
      user: '',
      pass: '',
      passRetype: ''
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
    },
    returnSingUp(){
      return this.signUp;
    }
  }
}

</script>

<style scoped>
  #title {
    background: #000;
    position: fixed;
    top: 0;
    display: block;
    color: #fff;
    width: 100%;
    height: 8vh;
  }

  #title h1
  {
    float: left;
    margin-left: 10vw;
    margin-top: 0.5vh;
    font-size: 4vh;
  }

  #login
  {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -45%);
    width: 90vw;
    height: 70vh;
    background-color: #fff;
    border-radius: 10px;
    -webkit-box-shadow: 8px 8px 5px 0px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 8px 8px 5px 0px rgba(0, 0, 0, 0.75);
    box-shadow: 8px 8px 5px 0px rgba(0, 0, 0, 0.75);
  }

  @media screen and (max-width: 1024px) and (orientation: landscape) {
    #login {
      font-size: 0.8rem;
    }
    #login h1 {
      font-size: 1rem;
    }
  }
  @media screen and (min-width: 1024px) and (orientation: landscape) {
    #login {
      width: 50vw;
      font-size: 2.5vh;
    }

    #login > * {
      margin-top: 5vh; }
    }

    #login input{
      border : 0;
    }

    #login button {
      border: 0;
      border-radius: 8px;
      background: lightgrey;
      margin-top: 10vh;
      width: 15vw;
      height: 6vh;
    }

    #login button:hover
    {
      background: #94b990;
    }

    #errorBox {
      color: red;
      font-weight: bold;
    }

    .userType{
      padding: 0.2em .5em;
      background-color: #f9ff00;
      border-radius: 8px;
      font-weight: bolder;
      margin-bottom: 2em;
      cursor: pointer;
    }

    .userType:hover{
      /*background-color: #ff4d9e;*/

      box-shadow: 0 0 10px #ff4d9e;
    }

    .userType.selected{
      background-color: #31ff00;
    }

    form>div{
      margin: 0 0 0 35%;
      text-align: left;
    }

</style>