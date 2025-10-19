// Supabase连接调试脚本
console.log('=== Supabase连接调试 ===')

// 模拟浏览器环境的环境变量
const env = {
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || 'https://duyfvvbgadrwaonvlrun.supabase.co',
  VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1eWZ2dmJnYWRyd2FvbnZscnVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyODM2MjAsImV4cCI6MjA3NTg1OTYyMH0.3wExEYQ0PcdEqcML9WsvM36A74gBBXjfmmtbilwsUZ0'
}

console.log('环境变量检查:')
console.log('- VITE_SUPABASE_URL:', env.VITE_SUPABASE_URL ? '✅ 已配置' : '❌ 未配置')
console.log('- VITE_SUPABASE_ANON_KEY:', env.VITE_SUPABASE_ANON_KEY ? '✅ 已配置' : '❌ 未配置')

// 测试Supabase连接
async function testSupabaseConnection() {
  const { createClient } = await import('@supabase/supabase-js')
  
  try {
    const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
      auth: { persistSession: false }
    })
    
    console.log('\\n测试Supabase连接...')
    
    // 测试简单的查询
    const { data, error } = await supabase
      .from('poems')
      .select('id, title')
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase连接失败:', error.message)
      console.log('可能的原因:')
      console.log('- CORS配置问题')
      console.log('- 项目URL或密钥错误')
      console.log('- 网络连接问题')
      return false
    }
    
    console.log('✅ Supabase连接成功')
    console.log('测试数据:', data)
    return true
    
  } catch (error) {
    console.error('❌ 连接测试异常:', error.message)
    return false
  }
}

// 运行测试
testSupabaseConnection().then(success => {
  console.log('\\n=== 调试完成 ===')
  if (!success) {
    console.log('请检查:')
    console.log('1. Supabase项目URL和密钥是否正确')
    console.log('2. Supabase CORS配置（添加Vercel域名）')
    console.log('3. 网络连接和防火墙设置')
  }
})