// 测试Dify completion端点
import fs from 'fs';

// 读取环境变量
const envContent = fs.readFileSync('.env', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2];
});

const API_URL = envVars.VITE_DIFY_API_URL;
const API_KEY = envVars.VITE_DIFY_API_KEY;

console.log('🔍 测试Dify Completion端点');
console.log('API URL:', API_URL);
console.log('API Key:', API_KEY ? '已配置' : '未配置');

async function testCompletion() {
  console.log('\n🚀 开始测试Completion端点...');
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        inputs: {},
        query: '请介绍一下李白的诗歌风格',
        response_mode: 'blocking',
        user: 'test-user'
      })
    });

    console.log('📊 响应状态:', response.status, response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Completion端点测试成功！');
      console.log('完整响应:', JSON.stringify(data, null, 2));
      
      // 尝试提取回答
      if (data.answer) {
        console.log('\n🤖 AI回答:', data.answer);
      } else if (data.data && data.data.answer) {
        console.log('\n🤖 AI回答:', data.data.answer);
      } else if (data.message) {
        console.log('\n🤖 AI回答:', data.message);
      } else {
        console.log('⚠️ 未找到标准回答字段，请检查响应格式');
      }
    } else {
      const errorText = await response.text();
      console.log('❌ 请求失败');
      console.log('错误详情:', errorText);
    }
  } catch (error) {
    console.log('❌ 请求异常:', error.message);
  }
}

testCompletion();