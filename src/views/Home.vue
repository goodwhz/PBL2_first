<template>
  <div class="min-h-screen">
    <!-- 英雄区域 -->
    <section class="text-center py-16 mb-12">
      <h1 class="text-5xl font-title text-primary mb-4 animate-fade-in">
        诗词赏析平台
      </h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
        传承千年文脉，品味古典诗词之美。在这里，与李白对饮，与杜甫论诗，感受中华文化的博大精深。
      </p>
    </section>

    <!-- 诗词网格 -->
    <section>
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-title text-primary">精选诗词</h2>
        <div class="flex space-x-2">
          <button 
            v-for="tag in popularTags" 
            :key="tag"
            @click="filterByTag(tag)"
            :class="['px-4 py-2 rounded-full text-sm transition-colors', 
                     activeTag === tag ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <div class="poem-grid">
        <PoemCard 
          v-for="poem in filteredPoems" 
          :key="poem.id" 
          :poem="poem"
          class="animate-slide-up"
        />
      </div>

      <!-- 加载更多 -->
      <div class="text-center mt-12">
        <button 
          @click="loadMore"
          class="px-8 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          v-if="hasMore"
        >
          加载更多诗词
        </button>
        <p v-else class="text-gray-500">已经展示所有诗词</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePoemStore } from '../stores/poemStore'
import PoemCard from '../components/PoemCard.vue'

const poemStore = usePoemStore()
const activeTag = ref('')
const itemsPerPage = 6
const currentPage = ref(1)

const popularTags = ['全部', '思乡', '春天', '爱情', '自然', '哲理']

const filteredPoems = computed(() => {
  let poems = poemStore.poems
  if (activeTag.value && activeTag.value !== '全部') {
    poems = poemStore.getPoemsByTag(activeTag.value)
  }
  return poems.slice(0, currentPage.value * itemsPerPage)
})

const hasMore = computed(() => {
  let totalPoems = poemStore.poems.length
  if (activeTag.value && activeTag.value !== '全部') {
    totalPoems = poemStore.getPoemsByTag(activeTag.value).length
  }
  return filteredPoems.value.length < totalPoems
})

const filterByTag = (tag) => {
  activeTag.value = tag
  currentPage.value = 1
}

const loadMore = () => {
  currentPage.value += 1
}

onMounted(() => {
  // 可以在这里添加数据加载逻辑
})
</script>

<style scoped>
.poem-grid {
  display: grid;
  gap: 2rem;
}

@media (max-width: 768px) {
  .poem-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .poem-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1025px) {
  .poem-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>