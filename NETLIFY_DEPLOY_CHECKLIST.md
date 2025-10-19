# Netlify部署检查清单

## ✅ 已完成的配置

### 1. 环境变量配置
- ✅ `VITE_DIFY_API_URL=https://dify.aipfuture.com/v1/chat-messages`
- ✅ `VITE_DIFY_API_KEY=app-K1PqjN2MV3LIgZo4lflVRj6r`
- ✅ 已在Netlify项目设置中配置环境变量

### 2. Netlify配置
- ✅ `netlify.toml` 配置文件正确
- ✅ 构建命令：`npm run build`
- ✅ 发布目录：`dist`
- ✅ SPA路由重定向配置正确

### 3. 项目构建
- ✅ 本地构建成功
- ✅ 依赖安装正常

## 🔧 需要检查的问题

### 1. Dify API端点问题
**当前配置：** `https://dify.aipfuture.com/v1/chat-messages`

**可能的问题：**
- 如果返回 `not_chat_app` 错误，说明应用模式不匹配
- 需要确认Dify应用是Chat模式还是Completion模式

**备用端点：**
```env
# 如果是Completion模式
VITE_DIFY_API_URL=https://dify.aipfuture.com/v1/completion-messages
```

### 2. 环境变量验证
在Netlify部署后，检查环境变量是否正确注入：
```javascript
// 在浏览器控制台检查
console.log('Dify URL:', import.meta.env.VITE_DIFY_API_URL)
console.log('Dify Key:', import.meta.env.VITE_DIFY_API_KEY ? '已配置' : '未配置')
```

### 3. 降级功能测试
如果Dify连接失败，AI助手应该自动使用降级回复：
- 测试发送："推荐一首李白的诗"
- 应该收到本地智能回复

## 🚀 部署步骤

1. **推送代码到GitHub**
2. **在Netlify连接GitHub仓库**
3. **设置环境变量**（确保与本地.env一致）
4. **触发部署**
5. **测试功能**

## 📋 故障排除

### 如果部署后仍无法使用：

1. **检查浏览器控制台错误**
   - 打开开发者工具 → Console
   - 查看是否有JavaScript错误

2. **验证环境变量**
   ```javascript
   // 在网站控制台运行
   console.log('环境变量:', import.meta.env)
   ```

3. **测试Dify连接**
   - 检查网络请求是否发送到正确端点
   - 查看响应状态码

4. **降级功能测试**
   - 断开网络连接测试本地回复
   - 验证基本功能是否正常

### 紧急解决方案：
如果Dify持续不可用，可以暂时禁用Dify连接，完全使用本地降级回复：
```javascript
// 在AIAssistant.vue中临时修改
const useDify = false // 强制使用本地回复
```

## 📞 技术支持

如果问题持续存在，请提供：
1. Netlify部署日志
2. 浏览器控制台错误信息
3. 网络请求截图