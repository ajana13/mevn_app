import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from 'axios'

Vue.config.productionTip = false

// Setting up default Vue's http modules for api calls 
Vue.prototype.$http = axios;
// load token from the local storage
const token = localStorage.getItem("token");
// if there exists a token already, simply defalut axios authorization headers
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token;
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
