# 🚀 PDCS-Fronted-UI Framework

[![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

一个现代化的 Next.js 前端UI框架，集成了完整的UI组件库、主题系统、国际化、图表组件、数据库操作和PWA功能。

## 📸 预览

![PDCS-Fronted-UI Preview](https://via.placeholder.com/800x400/1f2937/ffffff?text=PDCS-Fronted-UI+Framework)

> 🌟 **在线演示**: [https://your-demo-url.vercel.app](https://your-demo-url.vercel.app)

## 🚀 特性

- ⚡ **Next.js 14** - 使用 App Router 和 TypeScript
- 🎨 **Tailwind CSS** - 现代化的 CSS 框架
- 🌍 **国际化** - 支持中文、英文、日文
- 🌙 **主题系统** - 支持浅色/深色/系统主题
- 📱 **PWA 支持** - 渐进式 Web 应用
- 💾 **本地存储** - SQLite 和 LocalForage 集成
- 📊 **图表组件** - 基于 Recharts 的响应式图表
- 🔌 **API 客户端** - 统一的 HTTP 请求管理
- 🐛 **调试面板** - 开发环境下的调试工具
- 🧪 **单元测试** - Jest 和 React Testing Library
- 📚 **组件库** - 基于 Radix UI 的可复用组件

## 📦 技术栈

### 核心框架
- **Next.js 14** - React 全栈框架
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS** - 实用优先的 CSS 框架

### UI 组件
- **Radix UI** - 无样式的可访问组件
- **Lucide React** - 现代化图标库
- **Class Variance Authority** - 组件变体管理

### 数据可视化
- **Recharts** - React 图表库

### 国际化和主题
- **react-i18next** - 国际化解决方案
- **next-themes** - 主题切换

### 数据存储
- **sql.js** - 浏览器端 SQLite
- **LocalForage** - 增强的本地存储

### 开发工具
- **Jest** - JavaScript 测试框架
- **React Testing Library** - React 组件测试
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化

## 🛠️ 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm 或 yarn 或 pnpm

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 开发环境

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm run start
```

### 运行测试

```bash
# 运行所有测试
npm run test

# 监听模式
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router 页面
├── components/             # React 组件
│   ├── ui/                # 基础 UI 组件
│   ├── charts/            # 图表组件
│   └── __tests__/         # 组件测试
├── lib/                   # 工具库
│   ├── api/               # API 客户端
│   ├── database/          # 数据库管理
│   ├── i18n/              # 国际化配置
│   ├── pwa/               # PWA 功能
│   └── __tests__/         # 工具测试
├── locales/               # 翻译文件
├── styles/                # 样式文件
└── types/                 # TypeScript 类型定义
```

## 🌍 国际化

项目支持多语言，默认支持：

- 🇨🇳 中文 (zh-CN)
- 🇺🇸 英文 (en-US)  
- 🇯🇵 日文 (ja-JP)

### 添加新语言

1. 在 `src/locales/` 目录下创建新的语言文件
2. 在 `src/lib/i18n/index.ts` 中添加语言配置
3. 更新语言切换组件

### 使用翻译

```tsx
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t } = useTranslation()
  
  return <h1>{t('welcome.title')}</h1>
}
```

## 🎨 主题系统

项目支持三种主题模式：

- 🌞 浅色模式
- 🌙 深色模式  
- 🖥️ 系统模式（跟随系统设置）

### 使用主题

```tsx
import { useTheme } from 'next-themes'

function ThemeExample() {
  const { theme, setTheme } = useTheme()
  
  return (
    <button onClick={() => setTheme('dark')}>
      切换到深色模式
    </button>
  )
}
```

## 📊 图表组件

项目提供了多种图表组件：

- 📈 **LineChart** - 折线图
- 📊 **BarChart** - 柱状图
- 🥧 **PieChart** - 饼图
- 📈 **AreaChart** - 面积图

### 使用示例

```tsx
import { LineChart } from '@/components/charts/line-chart'

const data = [
  { month: '1月', 销售额: 1000, 利润: 300 },
  { month: '2月', 销售额: 1200, 利润: 400 },
]

function ChartExample() {
  return (
    <LineChart
      data={data}
      xKey="month"
      yKeys={[
        { key: '销售额', name: '销售额', color: '#3b82f6' },
        { key: '利润', name: '利润', color: '#22c55e' }
      ]}
      height={300}
    />
  )
}
```

## 🔌 API 客户端

统一的 HTTP 请求客户端，支持：

- ✅ 请求/响应拦截
- ✅ 错误处理
- ✅ 缓存机制
- ✅ 重试机制
- ✅ 文件上传

### 使用示例

```tsx
import { apiClient } from '@/lib/api/client'

// GET 请求
const users = await apiClient.get('/users')

// POST 请求
const newUser = await apiClient.post('/users', {
  name: '张三',
  email: 'zhangsan@example.com'
})

// 文件上传
const result = await apiClient.upload('/upload', file)
```

## 💾 数据存储

项目集成了两种本地存储方案：

### SQLite 数据库

```tsx
import { SQLiteManager } from '@/lib/database/sqlite'

const db = SQLiteManager.getInstance()
await db.initialize()

// 执行查询
const users = await db.query('SELECT * FROM users')

// 插入数据
await db.insert('users', { name: '张三', email: 'zhangsan@example.com' })
```

### 文件管理

```tsx
import { FileManager } from '@/lib/pwa/file-manager'

const fileManager = FileManager.getInstance()

// 上传文件
await fileManager.uploadFile(file, 'documents')

// 获取文件
const files = await fileManager.getFiles()
```

## 🧪 测试

项目使用 Jest 和 React Testing Library 进行测试。

### 运行测试

```bash
# 运行所有测试
npm run test

# 监听模式
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

### 编写测试

```tsx
import { render, screen } from '@/lib/test-utils'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Test Button</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

## 🐛 调试工具

开发环境下提供了调试面板，可以监控：

- 📊 API 请求和响应
- ⚠️ 错误日志
- 📈 性能指标
- ⚙️ 系统状态

调试面板会在开发环境下自动显示在右下角。

## 📚 更多文档

### 🚀 快速开始
- [项目脚手架文档](./docs/PROJECT_SCAFFOLDING.md) - 详细的项目生成和管理指南
- [组件库文档](./docs/components.md) - 组件使用指南
- [API 文档](./docs/api.md) - 完整的 API 参考

### 🧪 测试和质量保证
- [测试指南](./docs/TESTING_AND_QUALITY.md) - 完整的测试和质量保证体系
- [配置管理](./docs/CONFIGURATION_MANAGEMENT.md) - 配置管理和环境隔离

### 🔄 升级和迁移
- [升级指南](./docs/UPGRADE_GUIDE.md) - 版本升级详细指南
- [迁移指南](./docs/MIGRATION_GUIDE.md) - 项目迁移完整流程
- [API变更](./docs/API_CHANGES.md) - API变更记录和说明

### 📦 部署和开发
- [部署指南](./docs/deployment.md) - 生产环境部署
- [贡献指南](./docs/contributing.md) - 如何参与项目开发

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
