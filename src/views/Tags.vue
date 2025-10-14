<template>
  <div class="min-h-screen">
    <!-- 页面标题 -->
    <div class="text-center py-12 mb-8">
      <h1 class="text-4xl font-title text-primary mb-4">主题标签</h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        按主题探索诗词世界，发现相同情感下的不同表达
      </p>
    </div>

    <!-- 标签分类 -->
    <div class="mb-8">
      <div class="flex flex-wrap gap-4 justify-center">
        <button 
          v-for="category in categories" 
          :key="category"
          @click="filterByCategory(category)"
          :class="['px-4 py-2 rounded-full transition-colors', 
                   activeCategory === category ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- 标签云 -->
    <div class="max-w-4xl mx-auto">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div 
          v-for="tag in filteredTags" 
          :key="tag.name"
          @click="viewTagPoems(tag.name)"
          class="text-center group cursor-pointer"
        >
          <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
            <!-- 标签图标 -->
            <div class="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full" 
                 :class="getTagColor(tag.name)">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            
            <h3 class="font-semibold text-gray-900 mb-2">{{ tag.name }}</h3>
            <p class="text-sm text-gray-500 mb-3">{{ tag.poemCount }} 首诗词</p>
            <p class="text-xs text-gray-400">{{ tag.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredTags.length === 0" class="text-center py-16">
      <div class="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
        </svg>
      </div>
      <p class="text-gray-500">暂无相关标签数据</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePoemStore } from '../stores/poemStore'

const router = useRouter()
const poemStore = usePoemStore()
const activeCategory = ref('全部')

const categories = ['全部', '情感', '自然', '人生', '季节', '节日', '哲理']

// 标签数据
const tagsData = [
  // 情感类
  { name: '思乡', category: '情感', poemCount: 156, description: '游子思乡之情' },
  { name: '爱情', category: '情感', poemCount: 89, description: '男女情爱之作' },
  { name: '友情', category: '情感', poemCount: 67, description: '朋友情谊表达' },
  { name: '离别', category: '情感', poemCount: 78, description: '离别伤感之情' },
  
  // 自然类
  { name: '山水', category: '自然', poemCount: 234, description: '山水风光描写' },
  { name: '花鸟', category: '自然', poemCount: 145, description: '花鸟虫鱼咏物' },
  { name: '月亮', category: '自然', poemCount: 98, description: '月亮意象诗词' },
  { name: '风雨', category: '自然', poemCount: 76, description: '风雨气象描写' },
  
  // 人生类
  { name: '怀古', category: '人生', poemCount: 112, description: '怀古伤今之作' },
  { name: '抒怀', category: '人生', poemCount: 134, description: '抒发个人情怀' },
  { name: '励志', category: '人生', poemCount: 67, description: '励志向上诗词' },
  { name: '隐逸', category: '人生', poemCount: 89, description: '隐逸生活描写' },
  
  // 季节类
  { name: '春天', category: '季节', poemCount: 123, description: '春日风光诗词' },
  { name: '夏天', category: '季节', poemCount: 56, description: '夏日炎炎描写' },
  { name: '秋天', category: '季节', poemCount: 145, description: '秋日感怀之作' },
  { name: '冬天', category: '季节', poemCount: 78, description: '冬日雪景诗词' },
  
  // 节日类
  { name: '春节', category: '节日', poemCount: 34, description: '春节喜庆诗词' },
  { name: '中秋', category: '节日', poemCount: 45, description: '中秋赏月之作' },
  { name: '重阳', category: '节日', poemCount: 23, description: '重阳登高诗词' },
  { name: '清明', category: '节日', poemCount: 28, description: '清明时节感怀' },
  
  // 哲理类
  { name: '人生哲理', category: '哲理', poemCount: 89, description: '人生感悟哲理' },
  { name: '自然哲理', category: '哲理', poemCount: 67, description: '自然规律感悟' },
  { name: '社会哲理', category: '哲理', poemCount: 45, description: '社会现象思考' }
]

const filteredTags = computed(() => {
  if (activeCategory.value === '全部') {
    return tagsData
  }
  return tagsData.filter(tag => tag.category === activeCategory.value)
})

const filterByCategory = (category) => {
  activeCategory.value = category
}

const getTagColor = (tagName) => {
  const colors = {
    '思乡': 'bg-blue-500', '爱情': 'bg-pink-500', '友情': 'bg-green-500', '离别': 'bg-purple-500',
    '山水': 'bg-teal-500', '花鸟': 'bg-yellow-500', '月亮': 'bg-indigo-500', '风雨': 'bg-gray-500',
    '怀古': 'bg-orange-500', '抒怀': 'bg-red-500', '励志': 'bg-cyan-500', '隐逸': 'bg-lime-500',
    '春天': 'bg-emerald-500', '夏天': 'bg-rose-500', '秋天': 'bg-amber-500', '冬天': 'bg-sky-500',
    '春节': 'bg-red-500', '中秋': 'bg-yellow-500', '重阳': 'bg-orange-500', '清明': 'bg-green-500',
    '人生哲理': 'bg-purple-500', '自然哲理': 'bg-blue-500', '社会哲理': 'bg-gray-600'
  }
  return colors[tagName] || 'bg-primary'
}

const viewTagPoems = (tagName) => {
  router.push(`/search?q=${tagName}`)
}

onMounted(() => {
  // 可以在这里添加数据加载逻辑
})
</script>

<style scoped>
</style>