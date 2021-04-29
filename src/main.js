import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './assets/tailwind.css'

Vue.config.productionTip = false

import VueObserveVisibility from 'vue-observe-visibility'

Vue.use(VueObserveVisibility)

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
