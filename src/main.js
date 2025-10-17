import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')

// 初始化数据
import { usePoemStore } from './stores/poemStore.js'
const poemStore = usePoemStore()
poemStore.initializeData().catch(error => {
  console.error('初始化数据失败:', error)
})