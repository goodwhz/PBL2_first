// 测试基础连接和降级处理
console.log('=== 测试Dify API连接和降级处理 ===')

// 测试环境变量读取
console.log('环境变量测试:')
console.log('- VITE_DIFY_API_URL:', process.env.VITE_DIFY_API_URL || '未设置')
console.log('- VITE_DIFY_API_KEY:', process.env.VITE_DIFY_API_KEY ? '已设置' : '未设置')

// 测试降级回复逻辑
function getFallbackResponse(message) {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('李白') || lowerMessage.includes('诗仙')) {
    return '李白是唐代伟大的浪漫主义诗人，被誉为"诗仙"。他的《静夜思》非常经典："床前明月光，疑是地上霜。举头望明月，低头思故乡。"'
  }
  
  if (lowerMessage.includes('唐诗') || lowerMessage.includes('唐代')) {
    return '唐诗是中国古典诗歌的巅峰，特点是格律严谨、意境深远。代表诗人有李白、杜甫、白居易等。'
  }
  
  if (lowerMessage.includes('宋词')) {
    return '宋词是宋代流行的诗歌形式，比唐诗更注重音乐性和抒情性。代表词人有苏轼、李清照、辛弃疾等。'
  }
  
  return '感谢您的提问！我是诗歌AI助手，可以帮您解答关于古诗词的问题。您可以问我关于特定诗人、诗歌赏析或文学知识的问题。'
}

// 测试降级回复
console.log('\n=== 降级回复测试 ===')
const testMessages = [
  '介绍一下李白',
  '唐诗的特点',
  '你好',
  '宋词和唐诗的区别'
]

testMessages.forEach(msg => {
  console.log(`问题: "${msg}"`)
  console.log(`回复: "${getFallbackResponse(msg)}"`)
  console.log('---')
})

console.log('✅ 降级回复逻辑测试完成')
console.log('📝 说明: 即使Dify API不可用，AI助手也能提供基本的诗歌相关回复')