# Netlify 部署指南

## 问题总结与修复

### 原始问题
- Vercel/Netlify 部署后无法显示网站
- Dify AI 助手连接失败

### 已完成的修复

1. **部署配置修复**
   - 创建了 `vercel.json` 和 `netlify.toml` 配置文件
   - 修复了 SPA 路由重定向规则
   - 优化了构建配置

2. **Dify AI 助手集成**
   - 创建了 `AIAssistant.vue` 组件
   - 实现了 Dify API 调用逻辑
   - 添加了完善的降级处理机制
   - 修复了 API 端点路径（使用 completion 模式）

3. **环境变量配置**
   ```
   VITE_DIFY_API_URL=https://dify.aipfuture.com/v1/completion-messages
   VITE_DIFY_API_KEY=app-K1PqjN2MV3LIgZo4lflVRj6r
   ```

## Netlify 部署步骤

### 1. 环境变量配置（已在 Netlify 中设置）
在 Netlify 项目设置中配置以下环境变量：
- `VITE_DIFY_API_URL`: `https://dify.aipfuture.com/v1/completion-messages`
- `VITE_DIFY_API_KEY`: `app-K1PqjN2MV3LIgZo4lflVRj6r`

### 2. 构建配置
Netlify 会自动检测并执行：
- **构建命令**: `npm run build`
- **发布目录**: `dist`

### 3. 验证部署

#### 检查清单
- [ ] 网站能正常访问
- [ ] 诗歌列表能正常显示
- [ ] AI 助手按钮出现在右下角
- [ ] AI 助手能打开聊天窗口
- [ ] AI 助手能提供降级回复（即使 Dify API 不可用）

#### AI 助手功能验证
1. 点击右下角 AI 助手按钮
2. 尝试发送消息："介绍一下李白"
3. 预期结果：收到关于李白的诗歌介绍
4. 如果 Dify API 不可用，会显示降级回复

## 故障排除

### 如果 AI 助手无法工作
1. **检查环境变量**：确认 Netlify 中的环境变量正确设置
2. **查看浏览器控制台**：检查是否有 JavaScript 错误
3. **测试降级功能**：即使 Dify API 不可用，AI 助手也应提供基本回复

### 如果网站无法显示
1. **检查构建日志**：确认构建过程没有错误
2. **验证路由配置**：确保 SPA 路由重定向正确
3. **检查 Supabase 连接**：确认诗歌数据能正常加载

## 技术说明

### Dify API 状态
当前测试显示 Dify API 返回 "app_unavailable" 错误，这可能是：
- Dify 应用配置问题
- API 密钥权限问题
- 应用未发布或处于维护状态

### 降级处理机制
即使 Dify API 不可用，AI 助手仍能提供基本的诗歌相关回复，包括：
- 李白和唐诗介绍
- 宋词知识
- 诗歌欣赏指导

## 后续优化建议

1. **监控 Dify API 状态**：定期测试 API 连接
2. **添加错误日志**：记录 API 调用失败详情
3. **考虑备用 AI 服务**：如 OpenAI 或其他 AI 平台
4. **优化用户体验**：添加加载状态和错误提示

## 联系方式
如有部署问题，请检查此文档或查看项目代码中的详细注释。