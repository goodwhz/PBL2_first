# 诗词赏析平台

一个集古典美学与现代交互于一体的诗词赏析平台，采用 Vue 3 + Vite 技术栈开发。

## 功能特性

- 🎨 **新中式设计风格** - 融合传统元素与现代简约风格
- 📱 **响应式设计** - 完美适配移动端、平板端和桌面端
- ⚡ **现代化技术栈** - Vue 3 + Vite + Tailwind CSS
- 🔍 **智能搜索** - 支持诗词、作者、标签多维度搜索
- 📖 **沉浸式阅读** - 专注阅读模式，支持字体大小调整
- 🏷️ **标签分类** - 按主题、朝代、作者等多维度分类

## 快速开始

### 环境要求

- Node.js 16.0 或更高版本
- npm 或 pnpm 包管理器

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000 查看网站。

### 构建生产版本

```bash
pnpm build
```

## 项目结构

```
src/
├── components/          # 可复用组件
│   ├── NavBar.vue      # 导航栏组件
│   ├── Footer.vue      # 页脚组件
│   └── PoemCard.vue    # 诗词卡片组件
├── views/              # 页面视图
│   ├── Home.vue        # 首页
│   ├── PoemDetail.vue  # 诗词详情页
│   └── AuthorDetail.vue # 作者详情页
├── stores/             # 状态管理
│   └── poemStore.js   # 诗词数据管理
├── App.vue            # 根组件
├── main.js            # 入口文件
└── style.css          # 全局样式
```

## 设计系统

### 色彩体系

- **主色**: #8B4513 (古典棕)
- **辅助色**: #D2B48C (米色)  
- **强调色**: #CD5C5C (朱红)
- **背景色**: #FAF9F6 (纸张白)

### 字体系统

- **标题字体**: STKaiti, 楷体
- **正文字体**: SimSun, 宋体
- **界面字体**: PingFang SC, Microsoft YaHei

## 开发规范

- 使用 Composition API 进行组件开发
- 遵循 Vue 3 官方代码风格
- 使用 ESLint + Prettier 进行代码格式化
- 组件采用单文件组件 (SFC) 格式

## 部署说明

项目支持多种部署方式：

### Docker 部署

```bash
docker build -t poetry-platform .
docker run -p 3000:3000 poetry-platform
```

### 静态文件部署

构建后可将 `dist` 目录部署到任何静态文件服务器。

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进项目。

## 许可证

MIT License