# Dify AI助手配置指南

## 配置步骤

### 1. 获取Dify API密钥
1. 登录您的Dify平台账户
2. 创建一个新的应用或使用现有应用
3. 在应用设置中找到API密钥
4. 复制API密钥

### 2. 配置环境变量
1. 复制`.env.example`文件为`.env`
2. 编辑`.env`文件，填入您的Dify配置：

```env
# Dify AI平台配置
VITE_DIFY_API_URL=https://api.dify.ai/v1/chat-messages
VITE_DIFY_API_KEY=您的Dify_API密钥

# Supabase配置（如果使用）
VITE_SUPABASE_URL=您的Supabase项目URL
VITE_SUPABASE_ANON_KEY=您的Supabase匿名密钥
```

### 3. 部署配置
对于Vercel/Netlify部署，需要在平台的环境变量设置中添加：
- `VITE_DIFY_API_URL`
- `VITE_DIFY_API_KEY`

## Dify API响应格式

当前配置支持以下Dify响应格式：
- 直接返回`data.answer`
- 或返回`data.data.answer`
- 支持流式(`streaming`)和阻塞式(`blocking`)响应模式

## 降级处理

如果Dify API不可用或未配置，系统会自动使用本地降级回复，包含：
- 李白诗歌介绍
- 唐诗特点
- 宋词介绍
- 古诗欣赏指南

## 测试方法

1. 启动开发服务器：`npm run dev`
2. 点击右下角AI助手按钮
3. 尝试发送消息测试连接