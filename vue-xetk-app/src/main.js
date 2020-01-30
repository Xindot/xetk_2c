import Vue from 'vue'
import VConsole from 'vconsole'

import preview from 'vue-photo-preview';
import 'vue-photo-preview/dist/skin.css';

import App from './App.vue'
import router from './router'
import store from './store'

const option = {
  fullscreenEl: false,
};
Vue.use(preview, option);

// 全局路由映射
Vue.prototype.routesMatch = router.options.routesMatch
// 全局变量
Vue.prototype._GD_ = {
  // 
}

if (process.env.NODE_ENV == 'development') {
  Vue.config.devtools = true
}

if (!window.location.href.includes('h5.gushitech.com') || window.location.href.includes('debug=1')) {
  new VConsole();
  window.onerror = (message) => {
    alert(message)
  }
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')