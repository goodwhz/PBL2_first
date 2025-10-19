import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 生产环境下的安全检查
const isProduction = import.meta.env.PROD

let supabaseClient

if (isProduction && (!supabaseUrl || !supabaseAnonKey)) {
  console.error('缺少Supabase环境变量配置，请检查Netlify/Vercel环境变量设置')
  // 生产环境下不抛出错误，而是创建降级客户端
  supabaseClient = createClient('https://fallback.supabase.co', 'fallback-key', {
    auth: {
      persistSession: false
    }
  })
} else if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('缺少Supabase环境变量配置，请检查.env文件')
  // 开发环境下创建降级客户端
  supabaseClient = createClient('https://fallback.supabase.co', 'fallback-key', {
    auth: {
      persistSession: false
    }
  })
} else {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  })
}

export const supabase = supabaseClient

// 数据库表名常量
export const TABLES = {
  POEMS: 'poems',
  AUTHORS: 'authors',
  DYNASTIES: 'dynasties',
  TAGS: 'tags',
  POEM_TAGS: 'poem_tags'
}