<template>
  <div class="max-w-4xl mx-auto" v-if="author">
    <!-- 作者信息头部 -->
    <div class="text-center mb-12">
      <div class="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-6 flex items-center justify-center">
        <span class="text-white text-3xl font-title">{{ author.name.charAt(0) }}</span>
      </div>
      <h1 class="text-4xl font-title text-primary mb-2">{{ author.name }}</h1>
      <p class="text-xl text-gray-600">{{ author.dynasty }} · {{ author.lifespan }}</p>
      <p class="text-gray-700 mt-4 max-w-2xl mx-auto leading-relaxed">{{ author.biography }}</p>
    </div>

    <!-- 代表作 -->
    <div class="mb-12">
      <h2 class="text-3xl font-title text-primary mb-6">代表作</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="poem in authorPoems" 
          :key="poem.id"
          @click="goToPoem(poem.id)"
          class="poem-card p-6 cursor-pointer"
        >
          <h3 class="poem-title text-xl mb-3">{{ poem.title }}</h3>
          <p class="poem-content text-gray-700 leading-7">{{ poem.content.substring(0, 40) }}...</p>
          <div class="flex flex-wrap gap-2 mt-4">
            <span 
              v-for="tag in poem.tags.slice(0, 2)" 
              :key="tag"
              class="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 诗词统计 -->
    <div class="bg-white/50 rounded-2xl p-8 mb-8">
      <h3 class="text-2xl font-title text-primary mb-6">创作统计</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="text-center">
          <div class="text-3xl font-bold text-primary mb-2">{{ authorPoems.length }}</div>
          <div class="text-gray-600">收录诗词</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-accent mb-2">{{ uniqueTags.length }}</div>
          <div class="text-gray-600">创作主题</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-secondary mb-2">{{ totalCharacters }}</div>
          <div class="text-gray-600">总字数</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-green-500 mb-2">{{ averageLength }}</div>
          <div class="text-gray-600">平均长度</div>
        </div>
      </div>
    </div>

    <!-- 标签云 -->
    <div class="mb-12">
      <h3 class="text-2xl font-title text-primary mb-6">创作主题</h3>
      <div class="flex flex-wrap gap-3">
        <span 
          v-for="tag in uniqueTags" 
          :key="tag"
          class="px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full text-primary border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-16">
    <p class="text-gray-500 text-lg">作者信息不存在</p>
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

const author = ref(null)

// 模拟作者数据
const authorsData = {
  '李白': {
    name: '李白',
    dynasty: '唐',
    lifespan: '701年-762年',
    biography: '唐代伟大的浪漫主义诗人，被后人誉为「诗仙」。其诗想象丰富，风格豪放，语言清新自然。'
  },
  '孟浩然': {
    name: '孟浩然',
    dynasty: '唐', 
    lifespan: '689年-740年',
    biography: '唐代著名的山水田园派诗人，与王维并称「王孟」。其诗风格清淡，多写山水田园和隐居生活。'
  },
  '王之涣': {
    name: '王之涣',
    dynasty: '唐',
    lifespan: '688年-742年',
    biography: '唐代边塞诗人，其诗以描写边塞风光著称，意境开阔，气势恢宏。'
  },
  '王维': {
    name: '王维',
    dynasty: '唐',
    lifespan: '701年-761年', 
    biography: '唐代著名诗人、画家，被誉为「诗佛」。其诗多写山水田园，充满禅意。'
  },
  '柳宗元': {
    name: '柳宗元',
    dynasty: '唐',
    lifespan: '773年-819年',
    biography: '唐代文学家、哲学家，「唐宋八大家」之一。其诗多反映社会现实，风格峻洁。'
  },
  '李绅': {
    name: '李绅', 
    dynasty: '唐',
    lifespan: '772年-846年',
    biography: '唐代诗人，新乐府运动的参与者。其诗语言朴实，多反映民生疾苦。'
  }
}

const authorPoems = computed(() => {
  if (!author.value) return []
  return poemStore.getPoemsByAuthor(author.value.name)
})

const uniqueTags = computed(() => {
  const allTags = authorPoems.value.flatMap(poem => poem.tags)
  return [...new Set(allTags)]
})

const totalCharacters = computed(() => {
  return authorPoems.value.reduce((total, poem) => {
    return total + poem.content.replace(/[^\u4e00-\u9fa5]/g, '').length
  }, 0)
})

const averageLength = computed(() => {
  if (authorPoems.value.length === 0) return 0
  return Math.round(totalCharacters.value / authorPoems.value.length)
})

const goToPoem = (poemId) => {
  router.push(`/poem/${poemId}`)
}

onMounted(() => {
  const authorName = route.params.id
  author.value = authorsData[authorName]
})
</script>

<style scoped>
</style>