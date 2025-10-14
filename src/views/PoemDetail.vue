<template>
  <div class="max-w-4xl mx-auto" v-if="poem">
    <!-- 头部区域 -->
    <div class="text-center mb-12">
      <h1 class="poem-title text-4xl mb-4">{{ poem.title }}</h1>
      <div class="flex items-center justify-center space-x-6 text-lg text-gray-600">
        <span class="author-badge text-base">{{ poem.author }}</span>
        <span class="dynasty-tag text-base">{{ poem.dynasty }}</span>
      </div>
    </div>

    <!-- 诗词内容区域 -->
    <div class="bg-white/50 rounded-2xl p-8 mb-8 shadow-sm">
      <div class="poem-content text-2xl leading-loose text-center mb-8">
        <p v-for="(line, index) in formattedContent" :key="index" class="mb-4">
          {{ line }}
        </p>
      </div>

      <!-- 交互功能 -->
      <div class="flex justify-center space-x-4 mb-8">
        <button @click="toggleAnnotations" class="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
          {{ showAnnotations ? '隐藏注释' : '显示注释' }}
        </button>
        <button @click="toggleFontSize" class="px-6 py-2 bg-secondary text-primary rounded-full hover:bg-secondary/90 transition-colors">
          字体大小
        </button>
        <button @click="copyToClipboard" class="px-6 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
          复制诗词
        </button>
      </div>

      <!-- 注释区域 -->
      <div v-if="showAnnotations" class="bg-yellow-50/50 rounded-lg p-6 border-l-4 border-yellow-400">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">创作背景</h3>
        <p class="text-gray-700 leading-relaxed">{{ poem.background }}</p>
        
        <div class="mt-4">
          <h4 class="font-medium text-gray-900 mb-2">诗词赏析</h4>
          <p class="text-gray-700 leading-relaxed">{{ getPoemAnalysis(poem.id) }}</p>
        </div>
      </div>
    </div>

    <!-- 标签和分享 -->
    <div class="flex items-center justify-between">
      <div class="flex flex-wrap gap-2">
        <span 
          v-for="tag in poem.tags" 
          :key="tag"
          class="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
        >
          #{{ tag }}
        </span>
      </div>
      
      <div class="flex space-x-3">
        <button class="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
          <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 相关诗词 -->
    <div class="mt-12">
      <h3 class="text-2xl font-title text-primary mb-6">相关诗词</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="relatedPoem in relatedPoems" 
          :key="relatedPoem.id"
          @click="goToPoem(relatedPoem.id)"
          class="poem-card p-4 cursor-pointer"
        >
          <h4 class="font-title text-lg text-primary mb-2">{{ relatedPoem.title }}</h4>
          <p class="text-gray-600 text-sm">{{ relatedPoem.author }} · {{ relatedPoem.dynasty }}</p>
          <p class="text-gray-700 mt-2 line-clamp-2">{{ relatedPoem.content.substring(0, 30) }}...</p>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-16">
    <p class="text-gray-500 text-lg">诗词不存在或已被删除</p>
    <router-link to="/" class="text-primary hover:underline mt-4 inline-block">返回首页</router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePoemStore } from '../stores/poemStore'

const route = useRoute()
const router = useRouter()
const poemStore = usePoemStore()

const poem = ref(null)
const showAnnotations = ref(false)
const currentFontSize = ref('normal')

const formattedContent = computed(() => {
  if (!poem.value) return []
  return poem.value.content.split(/[。？！]/).filter(line => line.trim())
})

const relatedPoems = computed(() => {
  if (!poem.value) return []
  return poemStore.poems
    .filter(p => p.id !== poem.value.id && p.author === poem.value.author)
    .slice(0, 4)
})

const getPoemAnalysis = (poemId) => {
  const analyses = {
    1: '这首诗通过明月、地上霜的意象，表达了游子思乡之情。语言朴素自然，意境深远。',
    2: '描绘春天早晨的景色，语言清新自然，充满生活情趣。',
    3: '通过登高望远，表达了积极向上的进取精神。',
    4: '借红豆寄托相思之情，语言含蓄优美。',
    5: '描绘江雪独钓的孤寂景象，意境清冷高远。',
    6: '反映农民劳作的艰辛，语言朴实感人。'
  }
  return analyses[poemId] || '这首诗词意境优美，值得细细品味。'
}

const toggleAnnotations = () => {
  showAnnotations.value = !showAnnotations.value
}

const toggleFontSize = () => {
  const sizes = ['small', 'normal', 'large']
  const currentIndex = sizes.indexOf(currentFontSize.value)
  currentFontSize.value = sizes[(currentIndex + 1) % sizes.length]
  
  // 应用字体大小
  document.documentElement.style.fontSize = 
    currentFontSize.value === 'small' ? '14px' :
    currentFontSize.value === 'large' ? '18px' : '16px'
}

const copyToClipboard = async () => {
  const text = `${poem.value.title}\n${poem.value.author} · ${poem.value.dynasty}\n\n${poem.value.content}`
  try {
    await navigator.clipboard.writeText(text)
    alert('诗词已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
  }
}

const goToPoem = (poemId) => {
  router.push(`/poem/${poemId}`)
}

onMounted(() => {
  const poemId = parseInt(route.params.id)
  poem.value = poemStore.getPoemById(poemId)
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