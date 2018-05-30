// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import store from './store/store'
import VueResource from 'vue-resource'

Vue.use(VueResource)

Vue.http.options.root = 'https://itask-88baf.firebaseio.com/'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})
