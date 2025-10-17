#!/bin/bash

# Supabase 部署脚本
# 用于一键部署诗歌网站到Supabase

echo "🚀 开始部署诗歌网站到 Supabase..."

# 检查环境变量
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "❌ 错误: 请先设置环境变量 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY"
    echo "请复制 .env.example 为 .env.local 并填入正确的值"
    exit 1
fi

# 安装依赖
echo "📦 安装项目依赖..."
npm install

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查构建是否成功
if [ $? -ne 0 ]; then
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi

echo "✅ 项目构建成功！"

# 数据库部署提示
echo ""
echo "📊 数据库部署指南:"
echo "1. 访问您的 Supabase 项目控制台"
echo "2. 在 SQL 编辑器中执行以下文件:"
echo "   - supabase/migrations/001_initial_schema.sql"
echo "   - supabase/seed_data.sql (可选，用于添加示例数据)"
echo ""
echo "3. 验证表结构和数据是否正确创建"
echo "4. 检查行级安全策略是否生效"

# 本地开发服务器启动提示
echo ""
echo "🖥️  启动本地开发服务器:"
echo "npm run dev"

# 生产部署提示
echo ""
echo "🌐 生产部署建议:"
echo "1. 使用 Vercel、Netlify 或您喜欢的平台部署 dist 文件夹"
echo "2. 确保设置正确的环境变量"
echo "3. 配置自定义域名（可选）"

echo ""
echo "🎉 部署完成！现在您可以:"
echo "- 访问网站查看效果"
echo "- 在 Supabase 控制台中管理数据"
echo "- 根据需要扩展功能"

# 显示环境检查
echo ""
echo "🔍 环境检查:"
echo "Supabase URL: $VITE_SUPABASE_URL"
echo "项目路径: $(pwd)"
echo "构建输出: dist/ 文件夹"