# Vercel 部署指南

## 问题诊断与解决方案

### 1. 主要问题
- 缺少 `vercel.json` 配置文件
- 路由配置需要适配SPA部署
- 环境变量需要在Vercel中配置

### 2. 已修复的配置

#### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

#### 路由配置更新
- 使用 `createWebHistory(import.meta.env.BASE_URL)` 适配生产环境

### 3. Vercel环境变量配置

在Vercel项目设置中配置以下环境变量：

```
VITE_SUPABASE_URL=你的Supabase项目URL
VITE_SUPABASE_ANON_KEY=你的Supabase匿名密钥
VITE_APP_TITLE=诗歌鉴赏平台
VITE_APP_VERSION=1.0.0
```

### 4. 部署步骤

1. 将代码推送到GitHub
2. 在Vercel中导入GitHub仓库
3. 配置环境变量
4. 部署项目

### 5. 常见问题排查

#### 如果仍然无法访问：
1. 检查Vercel构建日志中的错误信息
2. 确认Supabase环境变量是否正确
3. 验证Supabase项目是否已正确配置CORS
4. 检查浏览器控制台是否有JavaScript错误

#### Supabase CORS配置
在Supabase项目设置中，添加Vercel域名到允许的CORS源：
```
https://your-project.vercel.app
```

### 6. 部署测试
运行测试脚本验证配置：
```bash
node test-deployment.js
```

### 7. 本地测试生产构建
```bash
npm run build
npm run preview
```

这将模拟生产环境，帮助发现潜在问题。

### 8. 关键修复说明

#### 错误处理改进
- **Supabase连接降级**: 当Supabase连接失败时，应用不会崩溃，而是显示友好的降级内容
- **环境变量安全检查**: 生产环境下对环境变量进行更严格的检查
- **错误边界**: 所有数据获取操作都有错误处理和降级方案

#### 配置优化
- **Vercel SPA配置**: 正确的路由重定向规则
- **构建路径配置**: 适配Vercel的静态文件部署
- **基础路径设置**: 确保路由在生产环境下正常工作

### 9. 故障排除

#### 如果网站显示空白页面：
1. 检查浏览器控制台是否有JavaScript错误
2. 确认Supabase环境变量是否正确配置
3. 验证Vercel构建日志是否有错误

#### 如果数据无法加载：
1. 检查Supabase项目的CORS配置
2. 确认数据库表结构和权限设置正确
3. 验证网络连接和API端点

#### 如果路由无法正常工作：
1. 检查vercel.json中的路由配置
2. 确认Vite的基础路径设置
3. 验证路由器的history模式配置