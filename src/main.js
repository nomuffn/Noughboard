import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import '@mdi/font/css/materialdesignicons.css'
import './assets/bulmatheme.css'

import { ToastProgrammatic } from 'buefy'

import '@/components/index.js'

Vue.config.productionTip = false

const main = new Vue({
    router,
    store,
    render: function (h) {
        return h(App)
    },
}).$mount('#app')

Vue.use(Buefy)
Vue.use(VueAxios, axios)

Vue.prototype.$toast = ToastProgrammatic

export default main
