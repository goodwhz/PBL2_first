<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-bg-primary to-bg-paper">
    <NavBar />
    <main class="container mx-auto px-4 py-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer />
    <AIAssistant />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
import AIAssistant from './components/AIAssistant.vue'

// 调试信息
onMounted(() => {
  console.log('=== 应用启动调试信息 ===')
  console.log('环境模式:', import.meta.env.MODE)
  console.log('Supabase URL配置:', import.meta.env.VITE_SUPABASE_URL ? '已配置' : '未配置')
  console.log('Supabase Key配置:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '已配置' : '未配置')
  console.log('N8N Webhook配置:', import.meta.env.VITE_N8N_WEBHOOK_URL ? '已配置' : '未配置')
  console.log('应用版本:', import.meta.env.VITE_APP_VERSION || '未知')
})
</script>

<style>
.container {
  max-width: 1200px;
}
</style>