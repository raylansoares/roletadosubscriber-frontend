import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import AxiosClient from './repositories/clients/axios'
import {
  MdButton,
  MdCard,
  MdContent,
  MdIcon,
  MdField,
  MdProgress,
  MdSnackbar,
  MdToolbar,
  MdDrawer,
  MdList
} from 'vue-material/dist/components'

import VueSocketIO from 'vue-socket.io'

import 'vue-material/dist/vue-material.min.css'
import './assets/theme/custom.css'
import './global.scss'

Vue.use(MdButton)
Vue.use(MdCard)
Vue.use(MdContent)
Vue.use(MdIcon)
Vue.use(MdField)
Vue.use(MdProgress)
Vue.use(MdSnackbar)
Vue.use(MdToolbar)
Vue.use(MdDrawer)
Vue.use(MdList)

Vue.use(new VueSocketIO({
  debug: false,
  connection: `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}`
}))

Vue.config.productionTip = false

Vue.prototype.$http = AxiosClient

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
