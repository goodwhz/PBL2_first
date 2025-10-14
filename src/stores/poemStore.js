import { defineStore } from 'pinia'

export const usePoemStore = defineStore('poem', {
  state: () => ({
    poems: [
      {
        id: 1,
        title: '静夜思',
        author: '李白',
        dynasty: '唐',
        content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
        tags: ['思乡', '月亮'],
        background: '这首诗写于开元十四年（726年）九月十五日的扬州旅舍，时李白26岁。'
      },
      {
        id: 2,
        title: '春晓',
        author: '孟浩然',
        dynasty: '唐',
        content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
        tags: ['春天', '自然'],
        background: '这首诗是诗人隐居在鹿门山时所作，意境十分优美。'
      },
      {
        id: 3,
        title: '登鹳雀楼',
        author: '王之涣',
        dynasty: '唐',
        content: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。',
        tags: ['登高', '哲理'],
        background: '此诗不仅刻画了祖国的壮丽山河，而且蕴含着登高才能望远的哲理。'
      },
      {
        id: 4,
        title: '相思',
        author: '王维',
        dynasty: '唐',
        content: '红豆生南国，春来发几枝。愿君多采撷，此物最相思。',
        tags: ['爱情', '思念'],
        background: '这是借咏物而寄相思的诗，是眷怀友人之作。'
      },
      {
        id: 5,
        title: '江雪',
        author: '柳宗元',
        dynasty: '唐',
        content: '千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓寒江雪。',
        tags: ['冬天', '孤独'],
        background: '此诗作于柳宗元谪居永州期间，寄托诗人清高孤傲的情感。'
      },
      {
        id: 6,
        title: '悯农',
        author: '李绅',
        dynasty: '唐',
        content: '锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。',
        tags: ['劳动', '节俭'],
        background: '这首诗反映了中国封建时代农民的生存状态，表达了诗人对农民的同情。'
      }
    ],
    currentPoem: null
  }),
  
  getters: {
    getPoemById: (state) => (id) => {
      return state.poems.find(poem => poem.id === parseInt(id))
    },
    
    getPoemsByAuthor: (state) => (author) => {
      return state.poems.filter(poem => poem.author === author)
    },
    
    getPoemsByTag: (state) => (tag) => {
      return state.poems.filter(poem => poem.tags.includes(tag))
    }
  },
  
  actions: {
    setCurrentPoem(poem) {
      this.currentPoem = poem
    },
    
    searchPoems(keyword) {
      const lowerKeyword = keyword.toLowerCase()
      return this.poems.filter(poem => 
        poem.title.toLowerCase().includes(lowerKeyword) || 
        poem.author.toLowerCase().includes(lowerKeyword) ||
        poem.content.toLowerCase().includes(lowerKeyword) ||
        poem.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
      )
    },
    
    getPoemsByDynasty(dynasty) {
      return this.poems.filter(poem => poem.dynasty === dynasty)
    },
    
    getAllTags() {
      const allTags = this.poems.flatMap(poem => poem.tags)
      return [...new Set(allTags)]
    },
    
    getPoemsByTag(tag) {
      return this.poems.filter(poem => poem.tags.includes(tag))
    },
    
    getAllAuthors() {
      const authors = this.poems.map(poem => poem.author)
      return [...new Set(authors)]
    }
  }
})