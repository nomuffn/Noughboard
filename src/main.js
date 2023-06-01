import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueTimers from 'vue-timers'

// buefy
import 'buefy/dist/buefy.css'
import { ToastProgrammatic, Dialog, Modal, Timepicker } from 'buefy'

// primevue
import PrimeVue from 'primevue/config'
import Tree from 'primevue/tree'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Textarea from 'primevue/textarea'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Tooltip from 'primevue/tooltip'
import Editor from 'primevue/editor'
import ProgressSpinner from 'primevue/progressspinner'

import ConfirmationService from 'primevue/confirmationservice'

import '@/components/index.js'

Vue.config.productionTip = false

const main = new Vue({
    router,
    store,
    render: function (h) {
        return h(App)
    },
}).$mount('#app')

Vue.use(VueAxios, axios)
Vue.use(VueTimers)

Vue.use(Dialog)
Vue.use(Modal)
Vue.use(Timepicker)

Vue.use(PrimeVue)
Vue.use(ConfirmationService)
Vue.directive('tooltip', Tooltip)
Vue.component('Tree', Tree)
Vue.component('Button', Button)
Vue.component('Textarea', Textarea)
Vue.component('InputNumber', InputNumber)
Vue.component('Dropdown', Dropdown)
Vue.component('PCheckbox', Checkbox)
Vue.component('PInputText', InputText)
Vue.component('Editor', Editor)
Vue.component('ProgressSpinner', ProgressSpinner)

Vue.prototype.$toast = ToastProgrammatic

export default main
