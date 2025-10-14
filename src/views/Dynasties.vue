<template>
  <div class="min-h-screen">
    <!-- 页面标题 -->
    <div class="text-center py-12 mb-8">
      <h1 class="text-4xl font-title text-primary mb-4">朝代分类</h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        纵观中华诗词发展历程，品味不同时代的文学风貌
      </p>
    </div>

    <!-- 朝代时间轴 -->
    <div class="max-w-6xl mx-auto">
      <div class="relative">
        <!-- 时间轴线 -->
        <div class="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-200 h-full"></div>
        
        <!-- 朝代卡片 -->
        <div 
          v-for="(dynasty, index) in dynasties" 
          :key="dynasty.name"
          :class="['relative mb-12', index % 2 === 0 ? 'pr-1/2 pl-8' : 'pl-1/2 pr-8']"
        >
          <!-- 连接点 -->
          <div class="absolute top-8 w-4 h-4 bg-primary rounded-full border-4 border-white" 
               :class="index % 2 === 0 ? 'left-1/2 -ml-2' : 'right-1/2 -mr-2'"></div>
          
          <!-- 朝代卡片 -->
          <div 
            @click="viewDynastyPoems(dynasty.name)"
            :class="['bg-white rounded-lg shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-all duration-300', 
                     index % 2 === 0 ? 'text-right' : 'text-left']"
          >
            <div class="flex items-center justify-between mb-4" :class="index % 2 === 0 ? 'flex-row-reverse' : ''">
              <h3 class="text-2xl font-title text-primary">{{ dynasty.name }}</h3>
              <span class="px-3 py-1 bg-secondary text-primary rounded-full text-sm">{{ dynasty.period }}</span>
            </div>
            
            <p class="text-gray-600 mb-4 leading-relaxed">{{ dynasty.description }}</p>
            
            <div class="flex items-center justify-between text-sm text-gray-500">
              <span>{{ dynasty.poemCount }} 首诗词</span>
              <span>{{ dynasty.authorCount }} 位诗人</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePoemStore } from '../stores/poemStore'

const router = useRouter()
const poemStore = usePoemStore()

const dynasties = ref([
  {
    name: '唐代',
    period: '618-907',
    description: '诗歌发展的黄金时代，涌现出李白、杜甫、白居易等伟大诗人，诗歌题材广泛，风格多样。',
    poemCount: 1280,
    authorCount: 56
  },
  {
    name: '宋代',
    period: '960-1279', 
    description: '词的发展达到顶峰，苏轼、李清照、辛弃疾等词人各领风骚，文学创作更加注重意境和情感。',
    poemCount: 980,
    authorCount: 42
  },
  {
    name: '元代',
    period: '1271-1368',
    description: '散曲兴起，诗歌创作受到戏曲影响，风格更加通俗化、民间化。',
    poemCount: 320,
    authorCount: 28
  },
  {
    name: '明代',
    period: '1368-1644',
    description: '诗歌创作承前启后，前后七子、公安派等文学流派纷呈，文学批评理论得到发展。',
    poemCount: 450,
    authorCount: 35
  },
  {
    name: '清代',
    period: '1644-1912',
    description: '诗词创作延续传统，同时出现新的文学思潮，纳兰性德、龚自珍等诗人独具特色。',
    poemCount: 620,
    authorCount: 48
  }
])

const viewDynastyPoems = (dynastyName) => {
  // 这里可以跳转到该朝代的诗词列表页
  // 暂时使用搜索功能
  router.push(`/search?q=${dynastyName}`)
}

onMounted(() => {
  // 可以在这里添加数据加载逻辑
})
</script>

<style scoped>
</style>