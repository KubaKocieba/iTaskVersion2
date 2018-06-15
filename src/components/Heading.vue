<template>
  <div id="noteHead">
      <h3 id="dateDiv"><small>{{date}}</small></h3>
      <h4 id="clockDiv">
        <button id="clockImg" @click="toggleClock" title="Toggle clock"></button>
        <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
          <span id="clock" v-show="showClock">{{ clock }}
          </span>
        </transition>
      </h4>
      <h5>{{ user }}<button @click="logout" title="Logout"></button></h5>
      <button title="Cleart the task list" id="clearList" @click="removeAll" >X</button>
    </span>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'

  export default {
    created(){
      setInterval( () => {this.time = new Date()},1000)
    },
    data(){
      return {
        actualDate: new Date(),
        time: new Date(),
        showClock: true
      }
    },
    computed: {
      user(){
        return this.$store.getters.user.email;
      },
      clock(){
        let h = this.time.getHours().toString(),
            m = this.time.getMinutes().toString(),
            s = this.time.getSeconds().toString();

        h = h.length === 1 ? ("0" + h) : h;
        m = m.length === 1 ? ("0" + m) : m;
        s = s.length === 1 ? ("0" + s) : s;

        return `${h} : ${m} : ${s}`;
      },
      date(){
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            day = days[this.actualDate.getDay()],
            m = (this.actualDate.getMonth()+1).toString(),
            d = this.actualDate.getDate().toString(),
            y = this.actualDate.getFullYear().toString();

        m = m.length === 1 ? ("0" + m) : m;
        d = d.length === 1 ? ("0" + d) : d;

        return `${day} ${d} / ${m} / ${y}`;
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
      },
      toggleClock(){
        this.showClock = !this.showClock;
      }
    }
  }
</script>

<style scoped>
  #noteHead {
    width: 100%;
    background-color: rgba(255, 255, 255, 1);
    font-size: 2vh;
  }

  h5{
    position: absolute;
    right: 5%;
    top: 12%;
    justify-content: center;
    display: grid;
    grid-template-columns: minmax(30vw, 30vh) 3vw;
    text-align:center;
  }

  h5 button{
    align-self: center;
    border: 0;
    background: center / contain no-repeat url('../images/logout.png') ;
    width: 2vh;
    height: 2vh;
    opacity: 0.4;
  }

  h5 button:hover{
    opacity: 1;
    cursor: pointer;
  }

  #dateDiv{
    position: absolute;
    top: 8%;
    left: 5%;
  }

  #clockDiv{
    position: absolute;
    left: 5%;
    top: 12%;
  }

  #clockImg{
    border:0;
    height: 2vh;
    width: 2vh;
    background: center / contain no-repeat url('../images/clock.png') ;
    outline: 0;
  }

  #clock{
    margin-left: 2vw;
  }

  #clearList{
    font-size: 2vh;
    position: absolute;
    right: 3.5%;
    bottom: 1.5%;
    border: 1px solid black;
    border-radius: 50%;
    background: none;
    width: 4vh;
    height: 4vh;
  }

  #clearList:hover{
    color: red;
    cursor: pointer;
    border: 1px solid red;
  }



</style>