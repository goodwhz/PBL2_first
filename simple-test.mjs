// 简单的Dify连接测试
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

console.log('测试Dify连接...');
console.log('URL:', API_URL);
console.log('Key:', API_KEY ? '已配置' : '未配置');

// 简单测试：检查URL是否可达
try {
  const response = await fetch(API_URL, {
    method: 'HEAD',
    headers: { 'Authorization': `Bearer ${API_KEY}` }
  });
  console.log('HTTP状态:', response.status);
} catch (error) {
  console.log('连接错误:', error.message);
}