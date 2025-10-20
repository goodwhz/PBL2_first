# Supabase诗词数据修复指南

## 问题描述
当前项目中的Supabase诗词表没有实际数据，应用依赖本地降级数据。

## 解决方案

### 1. 配置Supabase环境变量
复制 `.env.example` 为 `.env.local` 并填入正确的Supabase配置：

```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑.env.local文件，填入您的Supabase项目信息
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. 执行数据库迁移和种子数据

#### 方法一：使用Supabase Dashboard
1. 登录您的Supabase项目控制台
2. 进入 SQL Editor
3. 依次执行以下SQL文件：
   - `supabase/migrations/001_initial_schema.sql` - 创建表结构
   - `supabase/seed_data.sql` - 插入示例诗词数据

#### 方法二：使用Supabase CLI
```bash
# 安装Supabase CLI
npm install -g supabase

# 链接到您的Supabase项目
supabase link --project-ref your-project-ref

# 推送迁移和种子数据
supabase db push
```

### 3. 验证数据插入
执行以下SQL验证数据是否正确插入：

```sql
-- 检查诗词数据
SELECT COUNT(*) as poem_count FROM poems;

-- 查看诗词详情
SELECT 
  p.title as "诗歌标题",
  a.name as "作者", 
  d.name as "朝代",
  p.content as "诗句内容"
FROM poems p
LEFT JOIN authors a ON p.author_id = a.id
LEFT JOIN dynasties d ON p.dynasty_id = d.id
LIMIT 5;
```

### 4. 测试应用连接
运行调试脚本来验证Supabase连接：

```bash
node debug-supabase.js
```

## 故障排除

### 常见问题1：CORS错误
如果遇到CORS错误，请在Supabase Dashboard中配置：
1. 进入 Settings > API
2. 在 "Additional Configuration" 中添加您的域名到CORS配置
3. 保存更改

### 常见问题2：RLS策略错误
确保行级安全策略正确配置：
```sql
-- 检查RLS策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

### 常见问题3：环境变量不生效
确保环境变量文件正确命名：
- 开发环境：`.env.local`
- 生产环境：在部署平台设置环境变量

## 数据备份和恢复

### 导出现有数据
```sql
-- 导出诗词数据
COPY poems TO '/tmp/poems_backup.csv' WITH (FORMAT csv, HEADER true);
```

### 导入数据
```sql
-- 从CSV导入诗词数据
COPY poems FROM '/tmp/poems_backup.csv' WITH (FORMAT csv, HEADER true);
```

## 后续维护

### 添加新诗词数据
编辑 `supabase/seed_data.sql` 文件，添加新的INSERT语句：

```sql
-- 示例：添加新诗词
INSERT INTO poems (title, author_id, dynasty_id, content, background, analysis) VALUES
('新诗词标题', 
 (SELECT id FROM authors WHERE name = '作者名'),
 (SELECT id FROM dynasties WHERE name = '朝代名'),
 '诗词内容...',
 '创作背景...',
 '诗词赏析...')
ON CONFLICT DO NOTHING;
```

### 定期数据备份
建议定期备份Supabase数据：
1. 使用Supabase的自动备份功能
2. 或手动导出重要数据表

## 联系支持
如果遇到问题，请参考：
- [Supabase官方文档](https://supabase.com/docs)
- 项目README文件
- 部署指南文档