import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// 路由配置
const routes = [
  { path: '/', component: () => import('./views/Home.vue') },
  { path: '/poem/:id', component: () => import('./views/PoemDetail.vue') },
  { path: '/author/:id', component: () => import('./views/AuthorDetail.vue') },
  { path: '/authors', component: () => import('./views/Authors.vue') },
  { path: '/dynasties', component: () => import('./views/Dynasties.vue') },
  { path: '/tags', component: () => import('./views/Tags.vue') },
  { path: '/search', component: () => import('./views/Search.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')