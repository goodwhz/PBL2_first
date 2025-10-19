// 部署测试脚本
console.log('=== Vercel 部署测试 ===')

// 检查环境变量
console.log('检查环境变量配置...')
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
]

let missingVars = []
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    missingVars.push(envVar)
  }
}

if (missingVars.length > 0) {
  console.error('❌ 缺少必需的环境变量:', missingVars.join(', '))
  console.log('请在 Vercel 项目设置中配置以下环境变量:')
  console.log('- VITE_SUPABASE_URL: 你的 Supabase 项目 URL')
  console.log('- VITE_SUPABASE_ANON_KEY: 你的 Supabase 匿名密钥')
  process.exit(1)
} else {
  console.log('✅ 环境变量配置正确')
}

// 检查构建配置
console.log('检查构建配置...')
const fs = require('fs')
const path = require('path')

const requiredFiles = [
  'package.json',
  'vercel.json',
  'vite.config.js'
]

let missingFiles = []
for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(__dirname, file))) {
    missingFiles.push(file)
  }
}

if (missingFiles.length > 0) {
  console.error('❌ 缺少必需的文件:', missingFiles.join(', '))
  process.exit(1)
} else {
  console.log('✅ 构建配置文件完整')
}

// 检查路由配置
console.log('检查路由配置...')
try {
  const routerConfig = fs.readFileSync(path.join(__dirname, 'src/router/index.js'), 'utf8')
  if (routerConfig.includes('createWebHistory(import.meta.env.BASE_URL)')) {
    console.log('✅ 路由配置正确')
  } else {
    console.error('❌ 路由配置需要更新')
  }
} catch (error) {
  console.error('❌ 无法读取路由配置文件')
}

console.log('')
console.log('=== 部署检查完成 ===')
console.log('如果所有检查都通过 ✅，项目应该可以在 Vercel 上正常部署。')
console.log('')
console.log('部署步骤:')
console.log('1. 将代码推送到 GitHub')
console.log('2. 在 Vercel 中导入仓库')
console.log('3. 配置环境变量')
console.log('4. 部署项目')
console.log('')
console.log('如果部署后仍有问题，请检查:')
console.log('- Vercel 构建日志中的错误信息')
console.log('- 浏览器控制台的 JavaScript 错误')
console.log('- Supabase CORS 配置（添加 Vercel 域名到允许的源）')