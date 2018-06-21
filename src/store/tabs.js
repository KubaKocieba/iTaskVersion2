import firebaseConfig from '../firebaseConfig'
import axios from 'axios'
import store from './store'
import Vue from 'vue'

const db = axios.create({
  baseURL: firebaseConfig.databaseURL
});

const state = {
  tasks: {},
  tabs: {},
  loaded: false
};

const getters = {
  tabs: state => {
    return state.tabs
  },
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
  newTab(state){
    var userId = store.getters.user.userId,
        tabInit = {
                name: 'New tab',
                tasks: [{init:true}]
              };

    state.loaded = false;

    db.post('users/' + userId + '/tabs.json?auth=' + store.getters.user.idToken, tabInit)
    .then(resp=>{
      store.dispatch('fetchTabs');
      localStorage.setItem('activeTab', resp.data.name);
      store.dispatch('fetchList' ,resp.data.name);
    });
  },
  editTabName(state, tab){
    var userId = store.getters.user.userId;

    db.patch('users/' + userId + '/tabs/' + tab.key + '.json?auth=' + store.getters.user.idToken, {name: tab.name})
      .then(resp=>{
        //Vue.set(state.tabs, 'tab' + Object.keys(state.tabs).length, tabInit);
        document.activeElement.blur();
        //localStorage.setItem('activeTab', tab.key);
      });
  },
  getTabs(state){
    var userId = store.getters.user.userId;

    db.get('users/' + userId + '/tabs.json?auth=' + store.getters.user.idToken).then(resp =>{
      let tabs = resp.data;

      if(tabs){
        Object.keys(tabs).forEach(tab => {
          Vue.set(state['tabs'], tab , {'name' : tabs[tab]['name']});
        });
      }
    });
  },
  closeTab(state, tabObj){
    var userId = store.getters.user.userId;

    db.delete('users/' + userId + '/tabs/' + tabObj.key + '.json?auth=' + store.getters.user.idToken).then(resp=> {
      Vue.delete(state.tabs, tabObj.key);

      const lastExisting = Object.keys(state['tabs'])[Object.keys(state['tabs']).length-1];


      if (tabObj.key === localStorage.getItem('activeTab'))
      {
        store.dispatch('fetchList', lastExisting);
        tabObj.tabToEmit.$emit('makeActive', lastExisting);
      }

      localStorage.setItem('activeTab', lastExisting);
    });
  },
  receiveList(state, tab){
    var userId = store.getters.user.userId;

    state.loaded = false;

    db.get('users/' + userId + '.json?auth=' + store.getters.user.idToken)
      .then(resp =>{

        //no list was created (new user)
        if(!resp.data)
        {
          db.put('users/' + userId + '.json?auth=' + store.getters.user.idToken,
            {
              tabs: [
              {
                name:'First list',
                tasks: [{init:true}]
              }]
            }).then(msg => {
                console.log('dupsko');
              }
            );

          state.loaded = true;
        }
        else
        {
          db.get('users/' + userId + '/tabs/' + tab + '/tasks.json?auth=' + store.getters.user.idToken)
            .then(resp => {
              let listObj = resp.data,
                  init;

              ({init,...state.tasks} = listObj);

              state.loaded = true;
              localStorage.setItem('activeTab', tab);
            });
        }
      })
      .catch(error => {
        console.log(error);
      })
  },
  'ADD_TASK'(state, task){
    var userId = store.getters.user.userId;

    db.post('users/' + userId + '/tabs/' + localStorage.getItem('activeTab') + '/tasks.json?auth=' + store.getters.user.idToken, task)
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

    db.delete('users/' + userId + '/tabs/' + localStorage.getItem('activeTab') + '/tasks.json?auth=' + store.getters.user.idToken);
  },
  'REMOVE_TASK'(state, id){
    let listObj = state.tasks;

    Object.keys(listObj).forEach((task) => {
      let userId = store.getters.user.userId;

      if(!listObj[task]['init'] && listObj[task]['id'] === id)
      {
        db.delete('users/' + userId + '/tabs/' + localStorage.getItem('activeTab') + '/tasks/' + task + '.json?auth=' + store.getters.user.idToken)
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
          db.patch('users/' + userId + '/tabs/' + localStorage.getItem('activeTab') +'/tasks/' + key + '.json?auth=' + store.getters.user.idToken, state.tasks[key]).then(resp => {
            document.activeElement.blur();
          });
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
  createNewTab({commit}){
    commit('newTab');
  },
  fetchTabs({commit}){
    commit('getTabs');
  },
  editTab({commit}, tab){
    commit('editTabName', tab);
  },
  deleteTab({commit}, tab){
    commit('closeTab', tab);
  }
};

export default {
  state,
  mutations,
  actions,
  getters
}