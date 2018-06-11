import axios from 'axios'
import firebaseConfig from '../firebaseConfig'
import store from './store'
import firebase from 'firebase'

var ax = axios.create({
  baseURL: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty'
});

const state = {
  user: {
    userId: '',
    email: '',
    loggedIn: false,
    idToken: ''
  },
  error: ''
}

const dataKey = '?key=' + firebaseConfig.apiKey;

const loginFail = (state, err) =>{
  state.error = err.message.replace(/_/g, ' ');
};

const mutations = {
  authUser(state, userData){
    let auth = userData.data;

    state.user.userId = auth.localId || auth.user_id;
    state.user.idToken = auth.idToken || auth.id_token;
    state.user.loggedIn = true;

    if (!localStorage.getItem('refreshToken'))
    {
      localStorage.setItem('refreshToken',  auth.refreshToken);
      localStorage.setItem('userId', state.user.userId);
    }

    state.user.email = localStorage.getItem('user');

    console.log(state.user);
  },
  'LOGOUT'(state){
    state.user.loggedIn = false;
    localStorage.clear();
    state.user.userId = '';
    state.user.idToken = '';
    store.dispatch('clearStore');
  }
}

const actions = {
  signUp({commit}, user){
    let requestTarget = '/signupNewUser' + dataKey,
        formData = {...user, returnSecureToken: true};

    ax.post(requestTarget, formData)
      .then(resp => {
        localStorage.setItem('user', user.email);
        commit('authUser', resp);
      })
      .catch(error => {loginFail(state,error)});
  },
  login({commit}, user){
    let requestTarget = '/verifyPassword' + dataKey,
        formData = {...user, returnSecureToken: true};

    ax.post(requestTarget, formData)
      .then(resp => {
        localStorage.setItem('user', user.email);
        commit('authUser', resp);
      })
      .catch(error => {loginFail(state,error)});
  },
  logout({commit}){
    commit('LOGOUT');
  },
  refreshLogin({commit}, userData){
    var req = axios.create({
        baseURL:'https://securetoken.googleapis.com/v1/token',
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
      });

    var params = 'grant_type=refresh_token&refresh_token=' + userData.refreshToken;

    req.post(dataKey, params)
    .then(resp=>{
      commit('authUser', resp);
    })
    .catch(error=>console.log(error));
  }
}

const getters = {
  user: state => {
    return state.user;
  },
  authError: state => {
    return state.error
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
