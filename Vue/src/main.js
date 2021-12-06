import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//Element UI
import ElementUI from 'element-ui';
Vue.use(ElementUI);

//工具函数
import util from './common/util.vue'
Vue.use(util);

Vue.config.productionTip = true

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
