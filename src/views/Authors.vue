<template>
  <div class="min-h-screen">
    <!-- 页面标题 -->
    <div class="text-center py-12 mb-8">
      <h1 class="text-4xl font-title text-primary mb-4">诗人名录</h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        探索历代诗词大家的创作风采，感受不同诗人的独特魅力
      </p>
    </div>

    <!-- 诗人筛选 -->
    <div class="flex flex-wrap gap-4 justify-center mb-8">
      <button 
        v-for="dynasty in dynasties" 
        :key="dynasty"
        @click="filterByDynasty(dynasty)"
        :class="['px-4 py-2 rounded-full transition-colors', 
                 activeDynasty === dynasty ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
      >
        {{ dynasty }}
      </button>
    </div>

    <!-- 诗人网格 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div 
        v-for="author in filteredAuthors" 
        :key="author.name"
        @click="goToAuthor(author.name)"
        class="bg-white rounded-lg shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-all duration-300 group"
      >
        <!-- 作者头像 -->
        <div class="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center">
          <span class="text-white text-2xl font-title">{{ author.name.charAt(0) }}</span>
        </div>

        <!-- 作者信息 -->
        <div class="text-center">
          <h3 class="text-xl font-title text-primary mb-2">{{ author.name }}</h3>
          <p class="text-gray-600 mb-3">{{ author.dynasty }} · {{ author.lifespan }}</p>
          <p class="text-sm text-gray-500 line-clamp-2">{{ author.biography }}</p>
        </div>

        <!-- 统计信息 -->
        <div class="flex justify-between mt-4 text-xs text-gray-500">
          <span>{{ author.poemCount }} 首诗词</span>
          <span>{{ author.tagCount }} 个主题</span>
        </div>

        <!-- 悬浮效果 -->
        <div class="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredAuthors.length === 0" class="text-center py-16">
      <div class="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
        </svg>
      </div>
      <p class="text-gray-500">暂无相关诗人数据</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePoemStore } from '../stores/poemStore'

const router = useRouter()
const poemStore = usePoemStore()
const activeDynasty = ref('全部')

const dynasties = ['全部', '唐', '宋', '元', '明', '清']

// 模拟作者数据
const authorsData = [
  {
    name: '李白',
    dynasty: '唐',
    lifespan: '701年-762年',
    biography: '唐代伟大的浪漫主义诗人，被后人誉为「诗仙」。其诗想象丰富，风格豪放。',
    poemCount: 50,
    tagCount: 12
  },
  {
    name: '杜甫',
    dynasty: '唐',
    lifespan: '712年-770年',
    biography: '唐代伟大的现实主义诗人，被尊为「诗圣」。其诗沉郁顿挫，反映社会现实。',
    poemCount: 45,
    tagCount: 15
  },
  {
    name: '苏轼',
    dynasty: '宋',
    lifespan: '1037年-1101年',
    biography: '宋代文学巨匠，诗、词、文、书、画俱佳，豪放派词人代表。',
    poemCount: 38,
    tagCount: 10
  },
  {
    name: '李清照',
    dynasty: '宋',
    lifespan: '1084年-1155年',
    biography: '宋代著名女词人，婉约派代表，词风清丽，情感细腻。',
    poemCount: 25,
    tagCount: 8
  },
  {
    name: '白居易',
    dynasty: '唐',
    lifespan: '772年-846年',
    biography: '唐代现实主义诗人，主张「文章合为时而著，歌诗合为事而作」。',
    poemCount: 42,
    tagCount: 11
  },
  {
    name: '王维',
    dynasty: '唐',
    lifespan: '701年-761年',
    biography: '唐代诗人、画家，被誉为「诗佛」。其诗多写山水田园，充满禅意。',
    poemCount: 30,
    tagCount: 9
  },
  {
    name: '孟浩然',
    dynasty: '唐',
    lifespan: '689年-740年',
    biography: '唐代山水田园派诗人，与王维并称「王孟」。其诗风格清淡自然。',
    poemCount: 22,
    tagCount: 7
  },
  {
    name: '辛弃疾',
    dynasty: '宋',
    lifespan: '1140年-1207年',
    biography: '南宋豪放派词人，与苏轼合称「苏辛」。词风豪放，气势雄浑。',
    poemCount: 35,
    tagCount: 13
  }
]

const filteredAuthors = computed(() => {
  if (activeDynasty.value === '全部') {
    return authorsData
  }
  return authorsData.filter(author => author.dynasty === activeDynasty.value)
})

const filterByDynasty = (dynasty) => {
  activeDynasty.value = dynasty
}

const goToAuthor = (authorName) => {
  router.push(`/author/${authorName}`)
}

onMounted(() => {
  // 可以在这里添加数据加载逻辑
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>