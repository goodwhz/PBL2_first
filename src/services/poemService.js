import { supabase, TABLES } from '../config/supabase.js'

export class PoemService {
  // 获取所有诗歌（带分页）
  static async getPoems(page = 1, pageSize = 10) {
    try {
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

      if (error) {
        console.warn('Supabase获取诗歌列表失败，使用本地数据:', error.message)
        return this.getLocalPoems(page, pageSize)
      }
      
      // 格式化数据，确保显示正确
      const formattedPoems = (data || []).map(poem => ({
        ...poem,
        author_name: poem.author?.name || poem.author,
        dynasty_name: poem.dynasty?.name || poem.dynasty
      }))
      
      return {
        poems: formattedPoems,
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
      }
    } catch (error) {
      console.error('获取诗歌列表异常:', error)
      return this.getLocalPoems(page, pageSize)
    }
  }

  // 获取本地诗词列表
  static getLocalPoems(page = 1, pageSize = 10) {
    const localPoems = [
      {
        id: 1,
        title: '静夜思',
        content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
        author: { name: '李白' },
        author_name: '李白',
        dynasty: { name: '唐' },
        dynasty_name: '唐',
        tags: ['思乡', '明月', '夜晚']
      },
      {
        id: 2,
        title: '春晓',
        content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
        author: { name: '孟浩然' },
        author_name: '孟浩然',
        dynasty: { name: '唐' },
        dynasty_name: '唐',
        tags: ['春天', '早晨', '自然']
      },
      {
        id: 3,
        title: '登鹳雀楼',
        content: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。',
        author: { name: '王之涣' },
        author_name: '王之涣',
        dynasty: { name: '唐' },
        dynasty_name: '唐',
        tags: ['登高', '进取', '景色']
      },
      {
        id: 4,
        title: '相思',
        content: '红豆生南国，春来发几枝。愿君多采撷，此物最相思。',
        author: { name: '王维' },
        author_name: '王维',
        dynasty: { name: '唐' },
        dynasty_name: '唐',
        tags: ['相思', '爱情', '红豆']
      },
      {
        id: 5,
        title: '江雪',
        content: '千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓寒江雪。',
        author: { name: '柳宗元' },
        author_name: '柳宗元',
        dynasty: { name: '唐' },
        dynasty_name: '唐',
        tags: ['冬天', '孤独', '雪景']
      },
      {
        id: 6,
        title: '悯农',
        content: '锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。',
        author: { name: '李绅' },
        author_name: '李绅',
        dynasty: { name: '唐' },
        dynasty_name: '唐',
        tags: ['农民', '劳动', '节俭']
      },
      {
        id: 58,
        title: '水调歌头',
        content: '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。转朱阁，低绮户，照无眠。不应有恨，何事长向别时圆？人有悲欢离合，月有阴晴圆缺，此事古难全。但愿人长久，千里共婵娟。',
        author: { name: '苏轼' },
        author_name: '苏轼',
        dynasty: { name: '宋' },
        dynasty_name: '宋',
        tags: ['中秋', '思念', '月亮']
      }
    ]
    
    // 分页处理
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedPoems = localPoems.slice(startIndex, endIndex)
    
    return {
      poems: paginatedPoems,
      total: localPoems.length,
      page,
      pageSize,
      totalPages: Math.ceil(localPoems.length / pageSize)
    }
  }

  // 根据ID获取诗歌详情
  static async getPoemById(id) {
    try {
      // 首先尝试通过numeric_id查询
      const { data: dataByNumericId, error: numericError } = await supabase
        .from(TABLES.POEMS)
        .select(`
          *,
          author:author_id(*),
          dynasty:dynasty_id(*),
          tags:poem_tags(tag:tag_id(*))
        `)
        .eq('numeric_id', id)
        .single()

      if (!numericError && dataByNumericId) {
        dataByNumericId.tags = dataByNumericId.tags.map(pt => pt.tag)
        return dataByNumericId
      }

      // 如果numeric_id查询失败，尝试通过UUID查询
      const { data: dataById, error: idError } = await supabase
        .from(TABLES.POEMS)
        .select(`
          *,
          author:author_id(*),
          dynasty:dynasty_id(*),
          tags:poem_tags(tag:tag_id(*))
        `)
        .eq('id', id)
        .single()

      if (!idError && dataById) {
        dataById.tags = dataById.tags.map(pt => pt.tag)
        return dataById
      }

      // 如果都失败，尝试通过标题映射
      const titleMapping = {
        1: '静夜思',
        2: '春晓', 
        3: '登鹳雀楼',
        4: '相思',
        5: '江雪',
        6: '悯农',
        7: '望庐山瀑布',
        8: '黄鹤楼送孟浩然之广陵',
        9: '枫桥夜泊',
        10: '游子吟',
        58: '水调歌头'
      }

      const title = titleMapping[id]
      if (title) {
        const { data: dataByTitle, error: titleError } = await supabase
          .from(TABLES.POEMS)
          .select(`
            *,
            author:author_id(*),
            dynasty:dynasty_id(*),
            tags:poem_tags(tag:tag_id(*))
          `)
          .eq('title', title)
          .single()

        if (!titleError && dataByTitle) {
          dataByTitle.tags = dataByTitle.tags.map(pt => pt.tag)
          return dataByTitle
        }
      }

      console.warn('Supabase查询失败，使用本地数据:', numericError?.message || idError?.message)
      return this.getLocalPoemData(id)
    } catch (error) {
      console.error('获取诗歌详情异常:', error)
      return this.getLocalPoemData(id)
    }
  }

  // 获取本地诗词数据
  static getLocalPoemData(id) {
    const localPoems = {
      1: {
        id: 1,
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
        id: 2,
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
        id: 3,
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
        id: 4,
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
        id: 5,
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
        id: 6,
        title: '悯农',
        content: '锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。',
        author: { name: '李绅' },
        author_name: '李绅',
        dynasty: { name: '唐' },
        dynasty_name: '唐',
        tags: ['农民', '劳动', '节俭'],
        background: '反映农民劳作的艰辛，语言朴实感人。'
      },
      58: {
        id: 58,
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
    
    // 返回请求的诗词或默认诗词
    return localPoems[id] || {
      id: id,
      title: `诗词 #${id}`,
      content: '这首诗词的内容暂时无法加载。请检查网络连接或配置Supabase数据库。',
      author: { name: '未知作者' },
      author_name: '未知作者',
      dynasty: { name: '未知朝代' },
      dynasty_name: '未知朝代',
      tags: ['诗词'],
      background: '诗词信息暂时无法加载，请确保Supabase连接配置正确。'
    }
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
    
    // 格式化数据，确保显示正确
    const formattedPoems = (data || []).map(poem => ({
      ...poem,
      author_name: poem.author?.name || poem.author,
      dynasty_name: poem.dynasty?.name || poem.dynasty
    }))
    
    return {
      poems: formattedPoems,
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
    
    // 格式化数据，确保显示正确
    const formattedPoems = (data || []).map(poem => ({
      ...poem,
      author_name: poem.author?.name || poem.author,
      dynasty_name: poem.dynasty?.name || poem.dynasty
    }))
    
    return {
      poems: formattedPoems,
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
    
    // 格式化数据，确保显示正确
    const formattedPoems = (data || []).map(poem => ({
      ...poem,
      author_name: poem.author?.name || poem.author,
      dynasty_name: poem.dynasty?.name || poem.dynasty
    }))
    
    return {
      poems: formattedPoems,
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
    
    // 格式化数据，确保显示正确
    const formattedPoems = poems.map(poem => ({
      ...poem,
      author_name: poem.author?.name || poem.author,
      dynasty_name: poem.dynasty?.name || poem.dynasty
    }))
    
    return {
      poems: formattedPoems,
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