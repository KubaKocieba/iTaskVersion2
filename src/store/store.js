import Vue from 'vue'
import Vuex from 'vuex'
import tasks from './tasks'
import users from './users'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    tasks,
    users
  }
});



