// 详细的Dify连接测试
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

console.log('🔍 Dify连接详细测试');
console.log('==================');
console.log('API URL:', API_URL);
console.log('API Key:', API_KEY ? '已配置' : '未配置');

async function testConnection() {
  console.log('\n1. 测试基础连接...');
  try {
    // 测试基础连接
    const testResponse = await fetch(API_URL, {
      method: 'OPTIONS'
    });
    console.log('✅ 基础连接正常');
    console.log('允许的方法:', testResponse.headers.get('allow'));
  } catch (error) {
    console.log('❌ 基础连接失败:', error.message);
    return;
  }

  console.log('\n2. 测试API请求...');
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        inputs: {},
        query: '测试连接',
        response_mode: 'blocking',
        user: 'test-user'
      })
    });

    console.log('📊 响应状态:', response.status, response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API请求成功！');
      console.log('响应数据:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('❌ API请求失败');
      console.log('错误详情:', errorText.substring(0, 500)); // 限制输出长度
    }
  } catch (error) {
    console.log('❌ 请求异常:', error.message);
  }

  console.log('\n3. 检查可能的端点格式...');
  const possibleEndpoints = [
    'https://dify.aipfuture.com/v1/chat-messages',
    'https://dify.aipfuture.com/v1/completion-messages',
    'https://dify.aipfuture.com/api/v1/chat-messages',
    'https://dify.aipfuture.com/api/v1/completion-messages'
  ];

  for (const endpoint of possibleEndpoints) {
    console.log(`\n🔍 测试端点: ${endpoint}`);
    try {
      const testResp = await fetch(endpoint, { method: 'OPTIONS' });
      console.log(`  状态: ${testResp.status}, 方法: ${testResp.headers.get('allow')}`);
    } catch (error) {
      console.log(`  错误: ${error.message}`);
    }
  }
}

testConnection();