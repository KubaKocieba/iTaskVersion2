import firebaseConfig from '../firebaseConfig'
import axios from 'axios'
import store from './store'
import Vue from 'vue'

const db = axios.create({
  baseURL: firebaseConfig.databaseURL
});

const state = {
  tasks: {},
  loaded: false
};

const getters = {
  tasks: state => {
    return state.tasks
  },
  tasksLoaded: state => {
    return state.loaded
  }
};

const mutations = {
  resetData(state){
    state.tasks = {};
    state.loaded = false;
  },
  receiveList(state){
    var userId = store.getters.user.userId;

    db.get('users/' + userId + '.json?auth=' + store.getters.user.idToken)
      .then(resp =>{

        if(!resp.data)
        {
          db.put('users/' + userId + '.json?auth=' + store.getters.user.idToken, {tasks: [{init:true}]}).then(msg => console.log('success'));

          state.loaded = true;
        }
        else
        {
          db.get('users/' + userId + '.json?auth=' + store.getters.user.idToken)
            .then(resp => {
              let listObj = resp.data.tasks,
                  init;

              ({init, ...state.tasks} = listObj);

              state.loaded = true;
            });
        }
      })
      .catch(error => {
        console.log(error);
      })
  },
  'ADD_TASK'(state, task){
    var userId = store.getters.user.userId;

    db.post('users/' + userId + '/tasks.json?auth=' + store.getters.user.idToken, task)
      .then(resp=>{
        Vue.set(state.tasks, resp.data.name, task);
      /*store.dispatch('fetchList');*/
    });

  },
  'CLEAR_LIST'(state){
    state.tasks = {};
    var userId = store.getters.user.userId;

    db.delete('users/' + userId + '/tasks.json?auth=' + store.getters.user.idToken);
  },
  'REMOVE_TASK'(state, id){
    let listObj = state.tasks;

    Object.keys(listObj).forEach((task) => {
      let userId = store.getters.user.userId;

      if(!listObj[task]['init'] && listObj[task]['id'] === id)
      {
        db.delete('users/' + userId + '/tasks/' + task + '.json?auth=' + store.getters.user.idToken)
          .then(()=> {/*store.dispatch('fetchList');*/})
          .catch(error=>console.log(error));

        Vue.delete(state.tasks, task);
      }
    })
  },
  'UPDATE_TASK'(state, {...task}){
    let userId = store.getters.user.userId,
        listObj = state.tasks;

    for (let key in listObj)
    {
      if (task.id === listObj[key].id)
      {
          Vue.set(state.tasks[key], task.target, task.value);
          db.patch('users/' + userId + '/tasks/' + key + '.json?auth=' + store.getters.user.idToken, state.tasks[key]);
          break;
      }
    }
  }
};

const actions = {
  addTask({commit}, payload){
    commit('ADD_TASK', payload);
  },
  clearList({commit}){
    commit('CLEAR_LIST');

    db.put('users/' + store.getters.user.userId + '.json?auth=' + store.getters.user.idToken, {tasks: [{init:true}]}).then(msg => console.log('success'));
  },
  removeTask({commit}, payload){
    commit('REMOVE_TASK', payload);
  },
  updateTask({commit}, {...payload}){
    commit('UPDATE_TASK', payload);
  },
  fetchList({commit}) {
    commit('receiveList');
  },
  clearStore({commit}){
    commit('resetData');
  }
};

export default {
  state,
  mutations,
  actions,
  getters
}