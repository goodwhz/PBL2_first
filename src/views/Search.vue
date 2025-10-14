<template>
  <div class="min-h-screen">
    <!-- 搜索头部 -->
    <div class="bg-gradient-to-r from-primary/10 to-accent/10 py-12 mb-8">
      <div class="max-w-4xl mx-auto px-4">
        <h1 class="text-3xl font-title text-primary mb-4">搜索诗词</h1>
        
        <!-- 搜索框 -->
        <div class="relative max-w-2xl">
          <input 
            v-model="searchQuery"
            @input="performSearch"
            type="text" 
            placeholder="输入诗词标题、作者、内容或标签..."
            class="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 focus:outline-none focus:border-primary transition-colors text-lg"
          >
          <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>

        <!-- 搜索统计 -->
        <div class="mt-4 text-sm text-gray-600">
          找到 {{ searchResults.length }} 个结果
          <span v-if="searchQuery" class="ml-2">搜索词: "{{ searchQuery }}"</span>
        </div>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div class="max-w-4xl mx-auto px-4">
      <!-- 空状态 -->
      <div v-if="searchResults.length === 0 && searchQuery" class="text-center py-16">
        <div class="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <p class="text-gray-500 text-lg mb-2">未找到相关诗词</p>
        <p class="text-gray-400">尝试使用不同的关键词或检查拼写</p>
      </div>

      <!-- 结果列表 -->
      <div v-else-if="searchResults.length > 0" class="space-y-6">
        <div 
          v-for="result in searchResults" 
          :key="result.id"
          @click="goToPoem(result.id)"
          class="bg-white rounded-lg shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-all duration-300"
        >
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-xl font-title text-primary mb-2">{{ result.title }}</h3>
              <div class="flex items-center space-x-3 text-sm text-gray-600">
                <span class="author-badge">{{ result.author }}</span>
                <span class="dynasty-tag">{{ result.dynasty }}</span>
              </div>
            </div>
            <div class="text-right">
              <div class="text-xs text-gray-400 mb-1">匹配度</div>
              <div class="text-lg font-semibold text-accent">{{ calculateMatchScore(result) }}%</div>
            </div>
          </div>

          <!-- 诗词内容预览 -->
          <div class="poem-content text-gray-700 mb-4">
            <p class="leading-7">{{ highlightMatches(result.content) }}</p>
          </div>

          <!-- 标签和匹配信息 -->
          <div class="flex items-center justify-between">
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="tag in result.tags" 
                :key="tag"
                class="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600"
              >
                {{ tag }}
              </span>
            </div>
            <div class="text-xs text-gray-400">
              {{ getMatchType(result) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 初始状态 -->
      <div v-else class="text-center py-16">
        <div class="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <p class="text-gray-500 text-lg mb-2">开始搜索诗词</p>
        <p class="text-gray-400">输入关键词查找您感兴趣的诗词作品</p>
        
        <!-- 热门搜索建议 -->
        <div class="mt-8">
          <p class="text-sm text-gray-500 mb-3">热门搜索:</p>
          <div class="flex flex-wrap gap-2 justify-center">
            <button 
              v-for="suggestion in searchSuggestions" 
              :key="suggestion"
              @click="setSearchQuery(suggestion)"
              class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePoemStore } from '../stores/poemStore'

const route = useRoute()
const router = useRouter()
const poemStore = usePoemStore()

const searchQuery = ref(route.query.q || '')
const searchResults = ref([])

const searchSuggestions = ['李白', '春天', '思乡', '爱情', '山水', '月亮']

const performSearch = () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  const results = poemStore.searchPoems(searchQuery.value)
  searchResults.value = results
}

const calculateMatchScore = (poem) => {
  const query = searchQuery.value.toLowerCase()
  let score = 0

  if (poem.title.toLowerCase().includes(query)) score += 40
  if (poem.author.toLowerCase().includes(query)) score += 30
  if (poem.content.toLowerCase().includes(query)) score += 20
  if (poem.tags.some(tag => tag.includes(query))) score += 10

  return Math.min(score, 100)
}

const getMatchType = (poem) => {
  const query = searchQuery.value.toLowerCase()
  if (poem.title.toLowerCase().includes(query)) return '标题匹配'
  if (poem.author.toLowerCase().includes(query)) return '作者匹配'
  if (poem.content.toLowerCase().includes(query)) return '内容匹配'
  if (poem.tags.some(tag => tag.includes(query))) return '标签匹配'
  return '相关匹配'
}

const highlightMatches = (content) => {
  if (!searchQuery.value) return content
  
  const regex = new RegExp(`(${searchQuery.value})`, 'gi')
  return content.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
}

const setSearchQuery = (query) => {
  searchQuery.value = query
  performSearch()
}

const goToPoem = (poemId) => {
  router.push(`/poem/${poemId}`)
}

onMounted(() => {
  if (searchQuery.value) {
    performSearch()
  }
})
</script>

<style scoped>
</style>