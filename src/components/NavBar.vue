<template>
  <nav class="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span class="text-white font-title text-lg">诗</span>
          </div>
          <span class="text-xl font-title text-primary">诗词赏析</span>
        </router-link>

        <!-- 搜索框 -->
        <div class="flex-1 max-w-md mx-8">
          <div class="relative">
            <input 
              v-model="searchQuery"
              @input="handleSearch"
              type="text" 
              placeholder="搜索诗词、作者、标签..."
              class="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-primary transition-colors"
            >
            <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- 导航菜单 -->
        <div class="flex items-center space-x-6">
          <router-link to="/" class="text-gray-600 hover:text-primary transition-colors">首页</router-link>
          <router-link to="/authors" class="text-gray-600 hover:text-primary transition-colors">诗人</router-link>
          <router-link to="/dynasties" class="text-gray-600 hover:text-primary transition-colors">朝代</router-link>
          <router-link to="/tags" class="text-gray-600 hover:text-primary transition-colors">主题</router-link>
          
          <!-- 主题切换 -->
          <button @click="toggleTheme" class="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { usePoemStore } from '../stores/poemStore'

const searchQuery = ref('')
const poemStore = usePoemStore()

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}

const toggleTheme = () => {
  // 主题切换逻辑
  document.documentElement.classList.toggle('dark')
}
</script>

<style scoped>
.router-link-active {
  @apply text-primary font-medium;
}
</style>