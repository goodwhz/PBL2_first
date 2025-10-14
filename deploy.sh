#!/bin/bash

# 诗词赏析平台部署脚本
# 使用方法: ./deploy.sh [环境]

set -e

ENVIRONMENT=${1:-production}
TIMESTAMP=$(date +%Y%m%d%H%M%S)
BACKUP_DIR="backups/${TIMESTAMP}"

echo "🚀 开始部署诗词赏析平台..."
echo "环境: $ENVIRONMENT"
echo "时间戳: $TIMESTAMP"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份现有构建
if [ -d "dist" ]; then
    echo "📦 备份现有构建文件..."
    cp -r dist $BACKUP_DIR/
fi

# 安装依赖
echo "📚 安装依赖..."
npm install

if [ "$ENVIRONMENT" = "development" ]; then
    # 开发环境构建
    echo "🔨 开发环境构建..."
    npm run build:dev
else
    # 生产环境构建
    echo "🏗️ 生产环境构建..."
    npm run build
fi

# 检查构建是否成功
if [ ! -d "dist" ]; then
    echo "❌ 构建失败: dist目录不存在"
    exit 1
fi

echo "✅ 构建完成!"

# 如果是生产环境，进行额外优化
if [ "$ENVIRONMENT" = "production" ]; then
    echo "⚡ 生产环境优化..."
    
    # 压缩静态资源
    if command -v gzip &> /dev/null; then
        find dist -name "*.js" -exec gzip -k {} \;
        find dist -name "*.css" -exec gzip -k {} \;
        find dist -name "*.html" -exec gzip -k {} \;
    fi
    
    # 生成构建报告
    npm run build -- --report
fi

# 部署到服务器（这里需要根据实际情况修改）
echo "🌐 准备部署..."
echo "📁 构建文件已生成在 dist 目录"

# 健康检查
echo "🔍 进行健康检查..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ 应用运行正常"
else
    echo "⚠️ 应用可能未运行，请手动检查"
fi

echo "🎉 部署完成!"
echo "📊 备份位置: $BACKUP_DIR"
echo "⏰ 部署时间: $(date)"