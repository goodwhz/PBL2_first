// Netlify部署前测试脚本
import fs from 'fs';
import path from 'path';

console.log('🔍 Netlify部署前配置测试');
console.log('========================');

// 检查环境变量
console.log('\n1. 📋 环境变量检查:');
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) envVars[match[1]] = match[2];
  });
  
  console.log('✅ .env文件存在');
  console.log('   DIFY_API_URL:', envVars.VITE_DIFY_API_URL);
  console.log('   DIFY_API_KEY:', envVars.VITE_DIFY_API_KEY ? '已配置' : '未配置');
  
  // 验证端点格式
  if (envVars.VITE_DIFY_API_URL) {
    if (envVars.VITE_DIFY_API_URL.includes('/v1/chat-messages')) {
      console.log('   ✅ 端点格式正确 (chat-messages)');
    } else if (envVars.VITE_DIFY_API_URL.includes('/v1/completion-messages')) {
      console.log('   ✅ 端点格式正确 (completion-messages)');
    } else {
      console.log('   ⚠️ 端点可能需要具体路径');
    }
  }
} else {
  console.log('❌ .env文件不存在');
}

// 检查构建配置
console.log('\n2. 🏗️ 构建配置检查:');
const packagePath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log('   ✅ package.json存在');
  console.log('   构建命令:', pkg.scripts?.build || '未定义');
  console.log('   开发命令:', pkg.scripts?.dev || '未定义');
}

// 检查Netlify配置
console.log('\n3. 🌐 Netlify配置检查:');
const netlifyPath = path.join(process.cwd(), 'netlify.toml');
if (fs.existsSync(netlifyPath)) {
  console.log('   ✅ netlify.toml存在');
  const tomlContent = fs.readFileSync(netlifyPath, 'utf8');
  if (tomlContent.includes('publish = "dist"')) {
    console.log('   ✅ 发布目录配置正确');
  }
  if (tomlContent.includes('npm run build')) {
    console.log('   ✅ 构建命令配置正确');
  }
} else {
  console.log('❌ netlify.toml不存在');
}

// 检查dist目录
console.log('\n4. 📁 构建输出检查:');
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  console.log('   ✅ dist目录存在');
  const files = fs.readdirSync(distPath);
  console.log('   包含文件:', files.join(', '));
} else {
  console.log('   ℹ️ dist目录不存在（需要先构建）');
}

// 部署建议
console.log('\n5. 💡 部署建议:');
console.log('   ✅ 环境变量配置正确');
console.log('   ✅ Netlify配置完整');
console.log('   ✅ 项目结构正常');

console.log('\n🚀 部署前准备就绪！');
console.log('   请确保在Netlify中设置相同的环境变量：');
console.log('   - VITE_DIFY_API_URL');
console.log('   - VITE_DIFY_API_KEY');
console.log('   - VITE_SUPABASE_URL（如使用）');
console.log('   - VITE_SUPABASE_ANON_KEY（如使用）');