import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './index.css'
import { routes } from './router'  
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import VueTurnstile from 'vue-turnstile'

const app = createApp(App)

const newRouter = createRouter({
  history: createWebHistory(),
  routes
})

app.use(newRouter)  
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-right'
})
app.component('vue-turnstile', VueTurnstile)
app.mount('#app')
