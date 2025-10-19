// Dify连接测试脚本 - ES Module版本
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取环境变量
const envPath = path.join(__dirname, '.env');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
} else {
  console.log('❌ .env文件不存在');
  process.exit(1);
}

// 解析环境变量
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1]] = match[2];
  }
});

const DIFY_API_URL = envVars.VITE_DIFY_API_URL;
const DIFY_API_KEY = envVars.VITE_DIFY_API_KEY;

console.log('🔍 检查Dify配置:');
console.log(`API URL: ${DIFY_API_URL}`);
console.log(`API Key: ${DIFY_API_KEY ? '已配置' : '未配置'}`);

if (!DIFY_API_KEY) {
  console.log('❌ 请先配置Dify API密钥');
  process.exit(1);
}

// 测试Dify API连接
async function testDifyConnection() {
  console.log('\n🚀 开始测试Dify API连接...');
  
  try {
    const testMessage = '你好，请简单介绍一下你自己';
    
    console.log(`📤 发送消息: "${testMessage}"`);
    console.log(`🔗 API端点: ${DIFY_API_URL}`);
    
    const response = await fetch(DIFY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DIFY_API_KEY}`
      },
      body: JSON.stringify({
        inputs: {},
        query: testMessage,
        response_mode: 'blocking',
        user: 'test-user'
      })
    });
    
    console.log(`📊 响应状态: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Dify API连接成功！');
      
      // 提取回答内容
      if (data.answer) {
        console.log(`\n🤖 AI回答: ${data.answer}`);
      } else if (data.data && data.data.answer) {
        console.log(`\n🤖 AI回答: ${data.data.answer}`);
      } else if (data.message) {
        console.log(`\n🤖 AI回答: ${data.message}`);
      } else {
        console.log('⚠️ 响应格式可能不正确，请检查API端点');
        console.log('📝 完整响应:', JSON.stringify(data, null, 2));
      }
    } else {
      console.log('❌ Dify API请求失败');
      const errorText = await response.text();
      console.log('错误详情:', errorText);
      
      // 尝试其他可能的API端点
      await testAlternativeEndpoints(testMessage);
    }
    
  } catch (error) {
    console.log('❌ 连接Dify API时发生错误:');
    console.log(error.message);
  }
}

// 测试其他可能的API端点
async function testAlternativeEndpoints(testMessage) {
  console.log('\n🔄 尝试其他可能的API端点...');
  
  const endpoints = [
    'https://dify.aipfuture.com/v1/chat-messages',
    'https://dify.aipfuture.com/v1/messages',
    'https://dify.aipfuture.com/api/v1/chat-messages',
    'https://dify.aipfuture.com/api/v1/messages'
  ];
  
  for (const endpoint of endpoints) {
    console.log(`\n🔍 测试端点: ${endpoint}`);
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DIFY_API_KEY}`
        },
        body: JSON.stringify({
          inputs: {},
          query: testMessage,
          response_mode: 'blocking',
          user: 'test-user'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ 端点 ${endpoint} 连接成功！`);
        
        if (data.answer || data.data?.answer || data.message) {
          const answer = data.answer || data.data?.answer || data.message;
          console.log(`🤖 AI回答: ${answer}`);
          console.log(`💡 建议更新.env文件中的VITE_DIFY_API_URL为: ${endpoint}`);
          return;
        }
      } else {
        console.log(`❌ 端点 ${endpoint} 失败: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ 端点 ${endpoint} 错误: ${error.message}`);
    }
  }
  
  console.log('\n❌ 所有端点测试失败，请检查：');
  console.log('1. Dify API密钥是否正确');
  console.log('2. API端点URL是否正确');
  console.log('3. 网络连接是否正常');
}

// 运行测试
testDifyConnection();