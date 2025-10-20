# Vercel 部署故障排除指南

## 问题：Vercel上无法正确显示页面

### 1. 立即检查步骤

#### 步骤1: 检查Vercel环境变量
在Vercel项目设置中确认以下环境变量已正确配置：
```
VITE_SUPABASE_URL=https://duyfvvbgadrwaonvlrun.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1eWZ2dmJnYWRyd2FvbnZscnVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyODM2MjAsImV4cCI6MjA3NTg1OTYyMH0.3wExEYQ0PcdEqcML9WsvM36A74gBBXjfmmtbilwsUZ0
```

#### 步骤2: 检查Supabase CORS配置
在Supabase项目设置中，确保添加了Vercel域名：
- 登录Supabase Dashboard → Settings → API
- 在"Additional Configuration"的CORS设置中添加您的Vercel域名
- 格式：`https://your-project-name.vercel.app`（替换为实际域名）

#### 步骤3: 查看浏览器控制台错误
1. 打开部署的Vercel网站
2. 按F12打开开发者工具
3. 查看Console标签页中的错误信息
4. 查看Network标签页中的API请求状态

### 2. 常见问题及解决方案

#### 问题1: 空白页面
**可能原因**: JavaScript加载失败或路由配置问题
**解决方案**:
- 检查vercel.json中的路由配置
- 确认Vite构建输出正确

#### 问题2: "Supabase连接失败"错误
**可能原因**: 环境变量未正确传递到客户端
**解决方案**:
- 确认Vercel环境变量前缀为`VITE_`
- 检查构建日志中是否有环境变量错误

#### 问题3: CORS错误
**可能原因**: Vercel域名不在Supabase允许列表中
**解决方案**:
- 在Supabase仪表板中添加Vercel域名到CORS配置

### 3. 调试步骤

#### 方法1: 本地测试生产构建
```bash
npm run build
npm run preview
```

访问 http://localhost:3000 测试生产版本。

#### 方法2: 检查构建日志
在Vercel部署日志中检查：
- 构建是否成功完成
- 是否有环境变量警告
- 是否有依赖安装错误

#### 方法3: 添加调试信息
在浏览器控制台中查看Supabase配置信息：
```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('环境:', import.meta.env.MODE)
```

### 4. 紧急修复方案

如果问题持续存在，可以尝试：

#### 方案1: 强制重新部署
在Vercel中触发重新部署，确保最新配置生效。

#### 方案2: 检查数据库权限
确认Supabase数据库的RLS（行级安全）策略允许匿名访问。

#### 方案3: 验证API端点
直接测试Supabase API端点：
```
https://duyfvvbgadrwaonvlrun.supabase.co/rest/v1/poems?select=*
```

### 5. 联系支持

如果以上步骤都无法解决问题：
1. 提供Vercel部署URL
2. 提供浏览器控制台错误截图
3. 提供Vercel构建日志截图