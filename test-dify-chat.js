// 测试Dify Chat API端点 - 使用原生fetch
const testDifyAPI = async () => {
  const DIFY_API_URL = 'https://dify.aipfuture.com/v1/completion-messages'
  const DIFY_API_KEY = 'app-K1PqjN2MV3LIgZo4lflVRj6r'
  
  console.log('测试Dify Completion API端点...')
  
  try {
    const response = await fetch(DIFY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DIFY_API_KEY}`
      },
      body: JSON.stringify({
        inputs: {},
        query: '你好，请介绍一下唐诗',
        response_mode: 'blocking',
        user: 'test-user'
      })
    })
    
    console.log('响应状态:', response.status)
    
    if (!response.ok) {
      console.log('响应失败:', response.statusText)
      const errorText = await response.text()
      console.log('错误详情:', errorText)
      return
    }
    
    const data = await response.json()
    console.log('响应数据:', JSON.stringify(data, null, 2))
    
    if (data.answer) {
      console.log('✅ Dify API连接成功！')
      console.log('AI回复:', data.answer)
    } else {
      console.log('⚠️ API响应格式异常')
    }
    
  } catch (error) {
    console.error('测试失败:', error.message)
  }
}

testDifyAPI()