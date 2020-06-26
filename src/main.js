import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import AxiosClient from "./repositories/clients/axios";
import ElementUI from "element-ui";
import locale from "element-ui/lib/locale/lang/en";
import VueSocketIO from "vue-socket.io";

import "element-ui/lib/theme-chalk/index.css";
import 'element-theme-dark';
import "./global.scss";

Vue.use(ElementUI, { locale });

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
