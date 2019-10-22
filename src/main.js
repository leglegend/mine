import Vue from 'vue'
import App from './App'
import mpvueToastRegistry from 'mptoast/src/registry'
mpvueToastRegistry(Vue)

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
