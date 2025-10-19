<template>
  <div class="poem-card p-6 cursor-pointer group" @click="goToDetail">
    <!-- 标题和作者 -->
    <div class="mb-4">
      <h3 class="poem-title mb-2">{{ poem.title }}</h3>
      <div class="flex items-center space-x-3 text-sm text-gray-600">
        <span class="author-badge">{{ poem.author?.name || poem.author_name || '未知作者' }}</span>
        <span class="dynasty-tag">{{ poem.dynasty?.name || poem.dynasty_name || '未知朝代' }}</span>
      </div>
    </div>

    <!-- 诗词内容 -->
    <div class="poem-content mb-4">
      <p class="leading-8 text-gray-700">{{ formatContent(poem.content) }}</p>
    </div>

    <!-- 标签 -->
    <div class="flex flex-wrap gap-2">
      <span 
        v-for="tag in poem.tags" 
        :key="tag"
        class="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600"
      >
        {{ tag }}
      </span>
    </div>

    <!-- 悬浮效果 -->
    <div class="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  poem: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const formatContent = (content) => {
  return content.replace(/。/g, '。\n').replace(/？/g, '？\n').replace(/！/g, '！\n')
}

const goToDetail = () => {
  router.push(`/poem/${props.poem.id}`)
}
</script>

<style scoped>
.poem-card {
  position: relative;
  overflow: hidden;
}

.poem-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(139, 69, 19, 0.1), transparent);
  transition: left 0.5s;
}

.poem-card:hover::before {
  left: 100%;
}
</style>