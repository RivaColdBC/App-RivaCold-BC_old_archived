import { createApp } from 'vue/dist/vue.esm-bundler'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './app.vue'
//import Main from './main/main.vue'
//import FichaTecnica from './app/FichaTecnica/main.vue'

const routes = [
  { path: '/', component: () => import('./main/main.vue') },
  { path: '/fichaTecnica', component: () => import('./app/FichaTecnica/main.vue') },
  { path: '/undefined', component: () => import('./main/main.vue') }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
