# Supabase 集成指南

## 1. 环境配置

### 1.1 创建 Supabase 项目
1. 访问 [Supabase官网](https://supabase.com) 并注册账号
2. 创建新项目，选择合适的地域
3. 获取项目 URL 和匿名密钥

### 1.2 配置环境变量
复制 `.env.example` 为 `.env.local` 并填入实际值：

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 2. 数据库设置

### 2.1 执行数据库迁移
在 Supabase Dashboard 的 SQL 编辑器中执行 `supabase/migrations/001_initial_schema.sql` 文件。

### 2.2 验证表结构
确保以下表已正确创建：
- `poems` - 诗歌表
- `authors` - 作者表  
- `dynasties` - 朝代表
- `tags` - 标签表
- `poem_tags` - 诗歌标签关联表

## 3. 安全配置

### 3.1 行级安全策略
系统已自动配置允许匿名读取的策略，确保数据公开可访问。

### 3.2 索引优化
所有常用查询字段都已创建索引，确保查询性能。

## 4. 功能特性

### 4.1 完整的 CRUD 操作
- ✅ 诗歌的增删改查
- ✅ 作者信息管理
- ✅ 朝代分类
- ✅ 标签系统
- ✅ 高级搜索功能

### 4.2 性能优化
- ✅ 分页查询
- ✅ 关联查询优化
- ✅ 错误处理机制
- ✅ 加载状态管理

## 5. 开发指南

### 5.1 安装依赖
```bash
cd poem/PBL2_first
npm install
```

### 5.2 启动开发服务器
```bash
npm run dev
```

### 5.3 构建生产版本
```bash
npm run build
```

## 6. API 接口说明

### 6.1 诗歌相关接口
- `PoemService.getPoems()` - 获取诗歌列表（分页）
- `PoemService.getPoemById()` - 根据ID获取诗歌详情
- `PoemService.searchPoems()` - 搜索诗歌
- `PoemService.addPoem()` - 添加新诗歌
- `PoemService.updatePoem()` - 更新诗歌
- `PoemService.deletePoem()` - 删除诗歌

### 6.2 分类接口
- `PoemService.getAllTags()` - 获取所有标签
- `PoemService.getAllAuthors()` - 获取所有作者
- `PoemService.getAllDynasties()` - 获取所有朝代

## 7. 数据模型

### 7.1 诗歌表 (poems)
```sql
id: UUID (主键)
title: VARCHAR(200) NOT NULL
author_id: UUID (外键关联authors)
dynasty_id: UUID (外键关联dynasties)
content: TEXT NOT NULL
background: TEXT
analysis: TEXT
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### 7.2 作者表 (authors)
```sql
id: UUID (主键)
name: VARCHAR(100) NOT NULL
dynasty_id: UUID (外键关联dynasties)
birth_year: INTEGER
death_year: INTEGER
biography: TEXT
```

### 7.3 标签系统
支持多对多关系，一首诗歌可以有多个标签。

## 8. 故障排除

### 8.1 常见问题
1. **环境变量未设置**: 检查 `.env.local` 文件是否存在且格式正确
2. **数据库连接失败**: 验证 Supabase 项目 URL 和密钥是否正确
3. **表不存在**: 确保已执行数据库迁移脚本

### 8.2 调试技巧
- 打开浏览器开发者工具查看网络请求
- 检查控制台错误信息
- 使用 Supabase Dashboard 的日志功能

## 9. 扩展建议

### 9.1 功能扩展
- 用户认证系统
- 收藏功能
- 评论系统
- 数据导入导出

### 9.2 性能优化
- 缓存策略
- 图片懒加载
- 服务端渲染