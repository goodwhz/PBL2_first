// Dify连接问题诊断
import fs from 'fs';

// 读取环境变量
const envContent = fs.readFileSync('.env', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2];
});

const API_KEY = envVars.VITE_DIFY_API_KEY;

console.log('🔍 Dify连接问题诊断');
console.log('==================');
console.log('API Key:', API_KEY ? '已配置' : '未配置');

if (!API_KEY) {
  console.log('❌ 请先配置Dify API密钥');
  process.exit(1);
}

console.log('\n📋 诊断步骤:');
console.log('1. 检查API密钥格式');
console.log('2. 测试不同端点');
console.log('3. 验证应用状态');

// 检查API密钥格式
console.log('\n1. 🔑 检查API密钥格式...');
if (API_KEY.startsWith('app-')) {
  console.log('✅ API密钥格式正确 (app-前缀)');
} else {
  console.log('⚠️ API密钥格式可能不正确，应以"app-"开头');
}

// 测试不同端点
const endpoints = [
  {
    name: 'Chat端点',
    url: 'https://dify.aipfuture.com/v1/chat-messages',
    body: {
      inputs: {},
      query: '测试消息',
      response_mode: 'blocking',
      user: 'test-user'
    }
  },
  {
    name: 'Completion端点', 
    url: 'https://dify.aipfuture.com/v1/completion-messages',
    body: {
      inputs: {},
      query: '测试消息',
      response_mode: 'blocking',
      user: 'test-user'
    }
  },
  {
    name: '基础端点测试',
    url: 'https://dify.aipfuture.com/v1',
    body: null
  }
];

async function testEndpoints() {
  for (const endpoint of endpoints) {
    console.log(`\n2. 🔗 测试${endpoint.name}...`);
    console.log('   端点:', endpoint.url);
    
    try {
      if (endpoint.body) {
        const response = await fetch(endpoint.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          },
          body: JSON.stringify(endpoint.body)
        });
        
        console.log('   状态:', response.status, response.statusText);
        
        if (response.ok) {
          const data = await response.json();
          console.log('   ✅ 连接成功！');
          console.log('   响应类型:', Object.keys(data).join(', '));
        } else {
          const errorText = await response.text();
          const errorData = JSON.parse(errorText);
          console.log('   ❌ 错误:', errorData.message);
          console.log('   错误代码:', errorData.code);
        }
      } else {
        // 测试基础端点
        const response = await fetch(endpoint.url, {
          method: 'OPTIONS'
        });
        console.log('   基础连接状态:', response.status);
      }
    } catch (error) {
      console.log('   ❌ 连接错误:', error.message);
    }
  }
}

// 提供解决方案
function provideSolutions() {
  console.log('\n💡 可能的解决方案:');
  console.log('1. 检查Dify应用是否已正确配置和发布');
  console.log('2. 确认API密钥是否对应正确的应用');
  console.log('3. 检查应用的工作流配置是否正确');
  console.log('4. 在Dify控制台测试应用是否正常工作');
  console.log('5. 暂时使用降级回复功能');
  
  console.log('\n🔧 当前配置的降级方案:');
  console.log('- 支持李白诗歌介绍');
  console.log('- 支持唐诗特点说明'); 
  console.log('- 支持宋词介绍');
  console.log('- 支持古诗欣赏指南');
}

testEndpoints().then(() => {
  provideSolutions();
});