<template>
  <div class="max-w-4xl mx-auto" v-if="poem">
    <!-- 头部区域 -->
    <div class="text-center mb-12">
      <h1 class="poem-title text-4xl mb-4">{{ poem.title }}</h1>
      <div class="flex items-center justify-center space-x-6 text-lg text-gray-600">
        <span class="author-badge text-base">{{ poem.author?.name || poem.author_name || '未知作者' }}</span>
        <span class="dynasty-tag text-base">{{ poem.dynasty?.name || poem.dynasty_name || '未知朝代' }}</span>
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
          <p class="text-gray-600 text-sm">{{ relatedPoem.author?.name || relatedPoem.author_name || '未知作者' }} · {{ relatedPoem.dynasty?.name || relatedPoem.dynasty_name || '未知朝代' }}</p>
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
    .filter(p => p.id !== poem.value.id && p.author?.name === poem.value.author?.name)
    .slice(0, 4)
})

const getPoemAnalysis = (poemId) => {
  // 通用诗词分析，适用于所有诗词
  const genericAnalyses = [
    '这首诗词意境优美，语言精炼，展现了作者深厚的文学功底。',
    '诗词通过生动的意象和优美的韵律，表达了丰富的情感内涵。',
    '作品结构严谨，对仗工整，体现了古典诗词的艺术魅力。',
    '诗词语言凝练，意境深远，给人以美的享受和思想启迪。',
    '通过巧妙的比喻和象征手法，诗词传达了深刻的人生哲理。'
  ]
  
  // 根据诗词ID生成一致的随机分析（确保同一诗词总是显示相同分析）
  const randomIndex = (poemId * 13) % genericAnalyses.length
  return genericAnalyses[randomIndex]
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
  const text = `${poem.value.title}\n${poem.value.author?.name || poem.value.author_name || '未知作者'} · ${poem.value.dynasty?.name || poem.value.dynasty_name || '未知朝代'}\n\n${poem.value.content}`
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

onMounted(async () => {
  const poemId = parseInt(route.params.id)
  try {
    poem.value = await poemStore.fetchPoemById(poemId)
    
    // 检查是否为降级数据或空数据
    if (!poem.value || poem.value.content.includes('暂时无法获取诗词内容')) {
      console.warn('诗词数据加载异常，使用本地示例数据')
      // 提供更好的降级体验
      poem.value = getFallbackPoemData(poemId)
    }
  } catch (error) {
    console.error('获取诗词详情失败:', error)
    poem.value = getFallbackPoemData(poemId)
  }
})

// 改进的降级数据函数
const getFallbackPoemData = (poemId) => {
  const fallbackPoems = {
    1: {
      id: poemId,
      title: '静夜思',
      content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
      author: { name: '李白' },
      author_name: '李白',
      dynasty: { name: '唐' },
      dynasty_name: '唐',
      tags: ['思乡', '明月', '夜晚'],
      background: '这首诗是李白在异乡思念故乡时所作，通过明月意象表达思乡之情。'
    },
    2: {
      id: poemId,
      title: '春晓',
      content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
      author: { name: '孟浩然' },
      author_name: '孟浩然',
      dynasty: { name: '唐' },
      dynasty_name: '唐',
      tags: ['春天', '早晨', '自然'],
      background: '描绘春天早晨的景色，语言清新自然，充满生活情趣。'
    },
    3: {
      id: poemId,
      title: '登鹳雀楼',
      content: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。',
      author: { name: '王之涣' },
      author_name: '王之涣',
      dynasty: { name: '唐' },
      dynasty_name: '唐',
      tags: ['登高', '进取', '景色'],
      background: '通过登高望远，表达了积极向上的进取精神。'
    },
    4: {
      id: poemId,
      title: '相思',
      content: '红豆生南国，春来发几枝。愿君多采撷，此物最相思。',
      author: { name: '王维' },
      author_name: '王维',
      dynasty: { name: '唐' },
      dynasty_name: '唐',
      tags: ['相思', '爱情', '红豆'],
      background: '借红豆寄托相思之情，语言含蓄优美。'
    },
    5: {
      id: poemId,
      title: '江雪',
      content: '千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓寒江雪。',
      author: { name: '柳宗元' },
      author_name: '柳宗元',
      dynasty: { name: '唐' },
      dynasty_name: '唐',
      tags: ['冬天', '孤独', '雪景'],
      background: '描绘江雪独钓的孤寂景象，意境清冷高远。'
    },
    6: {
      id: poemId,
      title: '悯农',
      content: '锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。',
      author: { name: '李绅' },
      author_name: '李绅',
      dynasty: { name: '唐' },
      dynasty_name: '唐',
      tags: ['农民', '劳动', '节俭'],
      background: '反映农民劳作的艰辛，语言朴实感人。'
    },
    7: {
      id: poemId,
      title: '望庐山瀑布',
      content: '日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。',
      author: { name: '李白' },
      author_name: '李白',
      dynasty: { name: '唐' },
      dynasty_name: '唐',
      tags: ['瀑布', '庐山', '壮观'],
      background: '描绘庐山瀑布的壮丽景色，想象奇特，气势磅礴。'
    },
    8: {
      id: poemId,
      title: '黄鹤楼送孟浩然之广陵',
      content: '故人西辞黄鹤楼，烟花三月下扬州。孤帆远影碧空尽，唯见长江天际流。',
      author: { name: '李白' },
      author_name: '李白',
      dynasty: { name: '唐' },
      dynasty_name: '唐',
      tags: ['送别', '友情', '长江'],
      background: '送别友人时的深情厚谊，意境开阔，情感真挚。'
    },
    9: {
      id: poemId,
      title: '枫桥夜泊',
      content: '月落乌啼霜满天，江枫渔火对愁眠。姑苏城外寒山寺，夜半钟声到客船。',
      author: { name: '张继' },
      author_name: '张继',
      dynasty: { name: '唐' },
      dynasty_name: '唐',
      tags: ['夜晚', '愁思', '枫桥'],
      background: '描绘枫桥夜泊的愁思，意境深远，富有画面感。'
    },
    10: {
      id: poemId,
      title: '游子吟',
      content: '慈母手中线，游子身上衣。临行密密缝，意恐迟迟归。谁言寸草心，报得三春晖。',
      author: { name: '孟郊' },
      author_name: '孟郊',
      dynasty: { name: '唐' },
      dynasty_name: '唐',
      tags: ['母爱', '游子', '感恩'],
      background: '歌颂母爱的伟大，语言质朴，情感真挚动人。'
    },
    58: {
      id: poemId,
      title: '水调歌头',
      content: '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。转朱阁，低绮户，照无眠。不应有恨，何事长向别时圆？人有悲欢离合，月有阴晴圆缺，此事古难全。但愿人长久，千里共婵娟。',
      author: { name: '苏轼' },
      author_name: '苏轼',
      dynasty: { name: '宋' },
      dynasty_name: '宋',
      tags: ['中秋', '思念', '月亮'],
      background: '中秋望月怀人之作，表达了对胞弟苏辙的无限怀念。'
    }
  }
  
  // 如果请求的ID不在预设范围内，返回通用降级数据
  return fallbackPoems[poemId] || {
    id: poemId,
    title: `诗词 #${poemId}`,
    content: '这首诗词的内容暂时无法加载。请检查网络连接或配置Supabase数据库。',
    author: { name: '未知作者' },
    author_name: '未知作者',
    dynasty: { name: '未知朝代' },
    dynasty_name: '未知朝代',
    tags: ['诗词'],
    background: '诗词信息暂时无法加载，请确保Supabase连接配置正确。'
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>