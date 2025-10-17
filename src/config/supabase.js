import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('缺少Supabase环境变量配置，请检查.env文件')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

// 数据库表名常量
export const TABLES = {
  POEMS: 'poems',
  AUTHORS: 'authors',
  DYNASTIES: 'dynasties',
  TAGS: 'tags',
  POEM_TAGS: 'poem_tags'
}