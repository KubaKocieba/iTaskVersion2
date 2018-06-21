import Vue from 'vue'
import Vuex from 'vuex'
import tasks from './tasks'
import users from './users'
import tabs from  './tabs'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    tasks,
    users,
    tabs
  }
});



