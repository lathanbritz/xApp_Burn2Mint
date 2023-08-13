import { createApp } from 'vue'

import 'bootstrap/scss/bootstrap.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'

import App from './App.vue'
import router from './router'
import VueAxios from 'vue-axios'
import VueNumerals from 'vue-numerals'
import VueSpinners from 'vue-spinners'
import { createStore } from 'vuex'
import axios from 'axios'
import { AppStore } from './store/app_store.js'

const app = createApp(App)

const store = createStore({
    modules: {
        AppStore
    }
})


app.use(router)
app.use(store)
app.use(VueNumerals)
app.use(VueAxios, axios)
app.use(VueSpinners)
app.mount('#app')