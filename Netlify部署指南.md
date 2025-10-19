# Netlify 部署指南

## Netlify部署问题诊断

### 1. 主要问题
- **缺少netlify.toml配置文件**
- **Supabase环境变量未在Netlify中配置**
- **CORS配置问题** - Netlify域名可能不在Supabase允许列表中

### 2. 解决方案

#### 步骤1: 在Netlify中配置环境变量
在Netlify项目设置中配置以下环境变量：

```
VITE_SUPABASE_URL=你的Supabase项目URL
VITE_SUPABASE_ANON_KEY=你的Supabase匿名密钥
```

#### 步骤2: 配置Supabase CORS
在Supabase项目设置中，添加Netlify域名到允许的CORS源：
```
https://your-project.netlify.app
http://localhost:3000
http://localhost:5173
```

#### 步骤3: 部署检查清单
1. ✅ 已添加netlify.toml配置文件
2. ✅ 已更新Supabase配置适配Netlify
3. ⚠️ 检查Netlify环境变量配置
4. ⚠️ 检查Supabase CORS配置

### 3. 故障排除

#### 如果网站显示空白页面：
1. 打开浏览器开发者工具，查看Console中的错误信息
2. 检查是否有Supabase连接错误
3. 确认环境变量是否正确配置

#### 如果显示降级内容（"暂时无法获取诗词内容"）：
1. 检查Netlify环境变量中的Supabase配置
2. 验证Supabase项目的CORS设置
3. 确认数据库表结构和数据存在

#### 调试步骤：
1. 在Netlify部署后，打开网站
2. 按F12打开开发者工具
3. 查看Console标签页中的错误信息
4. 查看Network标签页中的API请求状态

### 4. 本地测试Netlify构建
```bash
# 模拟Netlify构建环境
npm run build
npx serve dist
```

访问 http://localhost:3000 测试生产构建。

### 5. 常见错误及解决方案

#### 错误: "Missing Supabase environment variables"
- 原因: Netlify环境变量未正确配置
- 解决: 在Netlify项目设置中添加VITE_SUPABASE_URL和VITE_SUPABASE_ANON_KEY

#### 错误: "CORS policy" 相关错误
- 原因: Netlify域名不在Supabase的CORS允许列表中
- 解决: 在Supabase项目设置中添加Netlify域名

#### 错误: "Failed to fetch"
- 原因: 网络连接问题或API端点错误
- 解决: 检查Supabase项目URL是否正确