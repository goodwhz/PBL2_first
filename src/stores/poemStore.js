import { defineStore } from 'pinia'
import { PoemService } from '../services/poemService.js'

export const usePoemStore = defineStore('poem', {
  state: () => ({
    poems: [],
    currentPoem: null,
    tags: [],
    authors: [],
    dynasties: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0
    }
  }),
  
  getters: {
    getPoemById: (state) => (id) => {
      return state.poems.find(poem => poem.id === id)
    },
    
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null
  },
  
  actions: {
    // 设置当前诗歌
    setCurrentPoem(poem) {
      this.currentPoem = poem
    },
    
    // 清除错误
    clearError() {
      this.error = null
    },
    
    // 获取所有诗歌
    async fetchPoems(page = 1, pageSize = 10) {
      this.loading = true
      this.error = null
      
      try {
        const result = await PoemService.getPoems(page, pageSize)
        this.poems = result.poems
        this.pagination = {
          page: result.page,
          pageSize: result.pageSize,
          total: result.total,
          totalPages: result.totalPages
        }
      } catch (error) {
        this.error = error.message
        console.error('获取诗歌列表失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 根据ID获取诗歌详情
    async fetchPoemById(id) {
      this.loading = true
      this.error = null
      
      try {
        const poem = await PoemService.getPoemById(id)
        this.currentPoem = poem
        return poem
      } catch (error) {
        this.error = error.message
        console.error('获取诗歌详情失败:', error)
        return null
      } finally {
        this.loading = false
      }
    },
    
    // 搜索诗歌
    async searchPoems(keyword, page = 1, pageSize = 10) {
      this.loading = true
      this.error = null
      
      try {
        const result = await PoemService.searchPoems(keyword, page, pageSize)
        this.poems = result.poems
        this.pagination = {
          page: result.page,
          pageSize: result.pageSize,
          total: result.total,
          totalPages: result.totalPages
        }
        return result.poems
      } catch (error) {
        this.error = error.message
        console.error('搜索诗歌失败:', error)
        return []
      } finally {
        this.loading = false
      }
    },
    
    // 根据作者获取诗歌
    async fetchPoemsByAuthor(authorId, page = 1, pageSize = 10) {
      this.loading = true
      this.error = null
      
      try {
        const result = await PoemService.getPoemsByAuthor(authorId, page, pageSize)
        this.poems = result.poems
        this.pagination = {
          page: result.page,
          pageSize: result.pageSize,
          total: result.total,
          totalPages: result.totalPages
        }
      } catch (error) {
        this.error = error.message
        console.error('获取作者诗歌失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 根据朝代获取诗歌
    async fetchPoemsByDynasty(dynastyId, page = 1, pageSize = 10) {
      this.loading = true
      this.error = null
      
      try {
        const result = await PoemService.getPoemsByDynasty(dynastyId, page, pageSize)
        this.poems = result.poems
        this.pagination = {
          page: result.page,
          pageSize: result.pageSize,
          total: result.total,
          totalPages: result.totalPages
        }
      } catch (error) {
        this.error = error.message
        console.error('获取朝代诗歌失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 根据标签获取诗歌
    async fetchPoemsByTag(tagId, page = 1, pageSize = 10) {
      this.loading = true
      this.error = null
      
      try {
        const result = await PoemService.getPoemsByTag(tagId, page, pageSize)
        this.poems = result.poems
        this.pagination = {
          page: result.page,
          pageSize: result.pageSize,
          total: result.total,
          totalPages: result.totalPages
        }
      } catch (error) {
        this.error = error.message
        console.error('获取标签诗歌失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 添加新诗歌
    async addPoem(poemData) {
      this.loading = true
      this.error = null
      
      try {
        const newPoem = await PoemService.addPoem(poemData)
        this.poems.unshift(newPoem)
        return newPoem
      } catch (error) {
        this.error = error.message
        console.error('添加诗歌失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 更新诗歌
    async updatePoem(id, poemData) {
      this.loading = true
      this.error = null
      
      try {
        const updatedPoem = await PoemService.updatePoem(id, poemData)
        const index = this.poems.findIndex(poem => poem.id === id)
        if (index !== -1) {
          this.poems[index] = updatedPoem
        }
        if (this.currentPoem && this.currentPoem.id === id) {
          this.currentPoem = updatedPoem
        }
        return updatedPoem
      } catch (error) {
        this.error = error.message
        console.error('更新诗歌失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 删除诗歌
    async deletePoem(id) {
      this.loading = true
      this.error = null
      
      try {
        await PoemService.deletePoem(id)
        this.poems = this.poems.filter(poem => poem.id !== id)
        if (this.currentPoem && this.currentPoem.id === id) {
          this.currentPoem = null
        }
        return true
      } catch (error) {
        this.error = error.message
        console.error('删除诗歌失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 获取所有标签
    async fetchAllTags() {
      this.loading = true
      this.error = null
      
      try {
        this.tags = await PoemService.getAllTags()
      } catch (error) {
        this.error = error.message
        console.error('获取标签失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 获取所有作者
    async fetchAllAuthors() {
      this.loading = true
      this.error = null
      
      try {
        this.authors = await PoemService.getAllAuthors()
      } catch (error) {
        this.error = error.message
        console.error('获取作者失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 获取所有朝代
    async fetchAllDynasties() {
      this.loading = true
      this.error = null
      
      try {
        this.dynasties = await PoemService.getAllDynasties()
      } catch (error) {
        this.error = error.message
        console.error('获取朝代失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 初始化数据
    async initializeData() {
      await Promise.all([
        this.fetchAllTags(),
        this.fetchAllAuthors(),
        this.fetchAllDynasties(),
        this.fetchPoems()
      ])
    }
  }
})