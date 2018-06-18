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
  newTab(state, tab){
    var userId = store.getters.user.userId,
        tabInit = {
                name: tab,
                tasks: [{init:true}]
              };

    console.log(tab);

    db.post('users/' + userId + '/tabs.json?auth=' + store.getters.user.idToken, tabInit)
      .then(resp=>{ console.log(resp);});
  },
  receiveList(state, tab){
    var userId = store.getters.user.userId;

    db.get('users/' + userId + '.json?auth=' + store.getters.user.idToken)
      .then(resp =>{
        console.log(resp);

        if(!resp.data)
        {
          db.put('users/' + userId + '.json?auth=' + store.getters.user.idToken,
            {
              tabs: [
              {
                name:'First list',
                tasks: [{init:true}]
              }]
            }).then(msg => console.log('success'));

          state.loaded = true;
        }
        else
        {
          db.get('users/' + userId +'/' + tab + '.json?auth=' + store.getters.user.idToken)
            .then(resp => {
              let listObj = resp.data.tasks,
                  init;

              ({name, ...state.tasks} = listObj);

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
        let nextSlot = 'taskInput' + (Number(task.slot.split('taskInput')[1]) + 1),
            nextInput = document.getElementById(nextSlot);

        Vue.set(state.tasks, resp.data.name, task);

        document.getElementById(task.slot).blur();


        //store.dispatch('fetchList');
    });

  },
  'CLEAR_LIST'(state){
    state.tasks = {};
    var userId = store.getters.user.userId,
        taskInputs = document.getElementsByClassName('addingTask');

    db.delete('users/' + userId + '/tasks.json?auth=' + store.getters.user.idToken);
  },
  'REMOVE_TASK'(state, id){
    let listObj = state.tasks;

    Object.keys(listObj).forEach((task) => {
      let userId = store.getters.user.userId;

      if(!listObj[task]['init'] && listObj[task]['id'] === id)
      {
        db.delete('users/' + userId + '/tasks/' + task + '.json?auth=' + store.getters.user.idToken)
          .then(()=> {})
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
  fetchList({commit}, tab) {
    commit('receiveList', tab);
  },
  clearStore({commit}){
    commit('resetData');
  },
  createNewTab({commit}, tab){
    commit('newTab', tab);
  }
};

export default {
  state,
  mutations,
  actions,
  getters
}