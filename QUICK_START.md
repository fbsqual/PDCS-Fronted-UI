# PDCS Frontend 快速启动指南

## 🚀 快速开始

### 1. 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm
pnpm install
```

**Windows 用户可以直接运行：**
```bash
install.bat
```

### 2. 启动开发服务器

```bash
npm run dev
```

项目将在 http://localhost:3000 启动

### 3. 查看组件展示页面

访问 http://localhost:3000/demo 查看完整的组件展示页面

## 📁 项目结构

```
PDCS-Frontend/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── demo/              # 组件展示页面
│   │   ├── globals.css        # 全局样式
│   │   ├── layout.tsx         # 根布局
│   │   └── page.tsx           # 首页
│   ├── components/            # React 组件
│   │   ├── ui/               # 基础 UI 组件
│   │   ├── charts/           # 图表组件
│   │   └── layout/           # 布局组件
│   ├── lib/                  # 工具库
│   │   ├── api/              # API 客户端
│   │   ├── database/         # 数据库管理
│   │   ├── i18n/             # 国际化配置
│   │   └── theme/            # 主题系统
│   ├── locales/              # 翻译文件
│   └── styles/               # 样式文件
├── docs/                     # 项目文档
├── public/                   # 静态资源
└── tests/                    # 测试文件
```

## 🎨 主要功能

### 1. UI 组件库
- **Button**: 多种变体和尺寸
- **Card**: 卡片容器组件
- **Input**: 表单输入组件
- **Dialog**: 对话框组件
- **Toast**: 消息提示组件

### 2. 图表组件
- **LineChart**: 折线图
- **BarChart**: 柱状图
- **PieChart**: 饼图
- **AreaChart**: 面积图

### 3. 国际化系统
- 支持中文、英文、日文
- 动态语言切换
- 命名空间管理

### 4. 主题系统
- 亮色/暗色主题
- CSS 变量动态切换
- 系统主题自动检测

### 5. 数据库管理
- SQLite 客户端数据库
- CRUD 操作封装
- 本地存储集成

### 6. API 客户端
- 统一的 HTTP 请求封装
- 请求/响应拦截器
- 错误处理机制

### 7. PWA 功能
- Service Worker 支持
- 离线缓存策略
- 应用安装提示

### 8. 调试工具
- 浮动调试面板
- API 请求日志
- 性能监控

## 🛠️ 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 运行测试
npm run test

# 代码检查
npm run lint

# 类型检查
npm run type-check

# 格式化代码
npm run format
```

## 📖 文档

- [API 文档](docs/api.md)
- [组件文档](docs/components.md)
- [部署指南](docs/deployment.md)
- [贡献指南](docs/contributing.md)

## 🌐 在线演示

访问组件展示页面查看所有功能：
- 首页: http://localhost:3000
- 组件展示: http://localhost:3000/demo

## 🔧 配置

### 环境变量

创建 `.env.local` 文件：

```env
# API 基础 URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# 调试模式
NEXT_PUBLIC_DEBUG_MODE=true

# API 版本
NEXT_PUBLIC_API_VERSION=v1
```

### 主题配置

在 `tailwind.config.js` 中自定义主题：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
    },
  },
}
```

## 🚨 故障排除

### 常见问题

1. **依赖安装失败**
   ```bash
   # 清除缓存
   npm cache clean --force
   
   # 删除 node_modules 重新安装
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **端口被占用**
   ```bash
   # 使用不同端口
   npm run dev -- -p 3001
   ```

3. **构建失败**
   ```bash
   # 清除 Next.js 缓存
   rm -rf .next
   npm run build
   ```

### 获取帮助

- 查看 [Issues](https://github.com/your-repo/issues)
- 阅读 [文档](docs/)
- 联系维护者

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

**开始探索 PDCS Frontend 的强大功能吧！** 🎉
