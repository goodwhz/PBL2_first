import { supabase, TABLES } from '../config/supabase.js'

export class PoemService {
  // 获取所有诗歌（带分页）
  static async getPoems(page = 1, pageSize = 10) {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    
    const { data, error, count } = await supabase
      .from(TABLES.POEMS)
      .select(`
        *,
        author:author_id(name),
        dynasty:dynasty_id(name)
      `, { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`获取诗歌列表失败: ${error.message}`)
    
    return {
      poems: data || [],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize)
    }
  }

  // 根据ID获取诗歌详情
  static async getPoemById(id) {
    const { data, error } = await supabase
      .from(TABLES.POEMS)
      .select(`
        *,
        author:author_id(*),
        dynasty:dynasty_id(*),
        tags:poem_tags(tag:tag_id(*))
      `)
      .eq('id', id)
      .single()

    if (error) throw new Error(`获取诗歌详情失败: ${error.message}`)
    
    if (data) {
      data.tags = data.tags.map(pt => pt.tag)
    }
    
    return data
  }

  // 搜索诗歌
  static async searchPoems(keyword, page = 1, pageSize = 10) {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    
    const { data, error, count } = await supabase
      .from(TABLES.POEMS)
      .select(`
        *,
        author:author_id(name),
        dynasty:dynasty_id(name)
      `, { count: 'exact' })
      .or(`title.ilike.%${keyword}%,content.ilike.%${keyword}%`)
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`搜索诗歌失败: ${error.message}`)
    
    return {
      poems: data || [],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize)
    }
  }

  // 根据作者获取诗歌
  static async getPoemsByAuthor(authorId, page = 1, pageSize = 10) {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    
    const { data, error, count } = await supabase
      .from(TABLES.POEMS)
      .select(`
        *,
        author:author_id(name),
        dynasty:dynasty_id(name)
      `, { count: 'exact' })
      .eq('author_id', authorId)
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`获取作者诗歌失败: ${error.message}`)
    
    return {
      poems: data || [],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize)
    }
  }

  // 根据朝代获取诗歌
  static async getPoemsByDynasty(dynastyId, page = 1, pageSize = 10) {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    
    const { data, error, count } = await supabase
      .from(TABLES.POEMS)
      .select(`
        *,
        author:author_id(name),
        dynasty:dynasty_id(name)
      `, { count: 'exact' })
      .eq('dynasty_id', dynastyId)
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`获取朝代诗歌失败: ${error.message}`)
    
    return {
      poems: data || [],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize)
    }
  }

  // 根据标签获取诗歌
  static async getPoemsByTag(tagId, page = 1, pageSize = 10) {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    
    const { data, error, count } = await supabase
      .from(TABLES.POEM_TAGS)
      .select(`
        poem:poem_id(
          *,
          author:author_id(name),
          dynasty:dynasty_id(name)
        )
      `, { count: 'exact' })
      .eq('tag_id', tagId)
      .range(from, to)

    if (error) throw new Error(`获取标签诗歌失败: ${error.message}`)
    
    const poems = data ? data.map(item => item.poem) : []
    
    return {
      poems,
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize)
    }
  }

  // 添加新诗歌
  static async addPoem(poemData) {
    const { data, error } = await supabase
      .from(TABLES.POEMS)
      .insert([poemData])
      .select()
      .single()

    if (error) throw new Error(`添加诗歌失败: ${error.message}`)
    return data
  }

  // 更新诗歌
  static async updatePoem(id, poemData) {
    const { data, error } = await supabase
      .from(TABLES.POEMS)
      .update(poemData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(`更新诗歌失败: ${error.message}`)
    return data
  }

  // 删除诗歌
  static async deletePoem(id) {
    const { error } = await supabase
      .from(TABLES.POEMS)
      .delete()
      .eq('id', id)

    if (error) throw new Error(`删除诗歌失败: ${error.message}`)
    return true
  }

  // 获取所有标签
  static async getAllTags() {
    const { data, error } = await supabase
      .from(TABLES.TAGS)
      .select('*')
      .order('name')

    if (error) throw new Error(`获取标签失败: ${error.message}`)
    return data || []
  }

  // 获取所有作者
  static async getAllAuthors() {
    const { data, error } = await supabase
      .from(TABLES.AUTHORS)
      .select(`
        *,
        dynasty:dynasty_id(name)
      `)
      .order('name')

    if (error) throw new Error(`获取作者失败: ${error.message}`)
    return data || []
  }

  // 获取所有朝代
  static async getAllDynasties() {
    const { data, error } = await supabase
      .from(TABLES.DYNASTIES)
      .select('*')
      .order('name')

    if (error) throw new Error(`获取朝代失败: ${error.message}`)
    return data || []
  }
}