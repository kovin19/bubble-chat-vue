import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './assets/css/main.css'

import App from './App.vue'
import router from './router'
import axiosInstance from './axios'

const app = createApp(App)

app.use(createPinia())
app.config.globalProperties.$axios = axiosInstance;
app.use(router)

app.mount('#app')
