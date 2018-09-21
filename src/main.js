// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
import router from './router/router.js';
import axios from 'axios';
import '../static/css/commen.css';
import VueClipboard from 'vue-clipboard2';

Vue.config.debug = true;
Vue.config.productionTip = false;
axios.defaults.withCredentials = true;
Vue.prototype.$preix = process.env.API_ROOT;
Vue.prototype.$ajax = axios;
axios.interceptors.response.use(res=>{
  switch (res.data.code){
    case 401 :
      //this.$router.push({ path: '/login'})
      location.href='#/login'
      break
    case 403 :
      //this.$router.push({ path: '/login'})
      location.href='#/login'
      break
    case 530 :
      //alert(res.data.message);
      //this.$router.push({ path: '/login'})
      location.href='#/login?error_type=1'
      break
  }
  return res;
})

Vue.use(ElementUI);
Vue.use(VueClipboard);
window.eventBus=new Vue();
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
