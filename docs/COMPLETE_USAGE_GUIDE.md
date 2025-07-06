# PDCS-Fronted-UI 完整使用指南

## 📋 目录

1. [快速开始](#快速开始)
2. [项目架构](#项目架构)
3. [核心功能模块](#核心功能模块)
4. [开发指南](#开发指南)
5. [部署指南](#部署指南)
6. [最佳实践](#最佳实践)
7. [故障排除](#故障排除)

---

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0 或 **yarn**: >= 1.22.0
- **Git**: >= 2.30.0

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/fbsqual/PDCS-Fronted-UI.git
cd PDCS-Fronted-UI

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 访问应用
# 浏览器打开: http://localhost:3000
```

### 项目初始化

```bash
# 运行初始化脚本
npm run setup

# 检查项目状态
npm run health-check

# 运行测试
npm test
```

---

## 🏗️ 项目架构

### 目录结构

```
PDCS-Fronted-UI/
├── 📁 src/                    # 源代码目录
│   ├── 📁 app/                # Next.js App Router
│   │   ├── 📁 demo/           # Demo展示页面
│   │   ├── 📁 globals.css     # 全局样式
│   │   └── 📁 layout.tsx      # 根布局
│   ├── 📁 components/         # 组件库
│   │   ├── 📁 ui/             # 基础UI组件
│   │   ├── 📁 charts/         # 图表组件
│   │   ├── 📁 database-demo/  # 数据库演示
│   │   └── 📁 debug-panel/    # 调试面板
│   ├── 📁 lib/                # 工具库
│   │   ├── 📁 i18n/           # 国际化
│   │   ├── 📁 database/       # 数据库操作
│   │   └── 📁 utils.ts        # 通用工具
│   └── 📁 styles/             # 样式文件
├── 📁 docs/                   # 文档目录
├── 📁 scripts/                # 自动化脚本
├── 📁 public/                 # 静态资源
└── 📁 tests/                  # 测试文件
```

### 核心技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **Next.js** | 14.0.4 | React全栈框架 |
| **React** | 18+ | 前端UI库 |
| **TypeScript** | 5+ | 类型安全 |
| **Tailwind CSS** | 3+ | 样式框架 |
| **Chart.js** | 4.4.0 | 数据可视化 |
| **i18next** | 23.7.0 | 国际化 |
| **SQLite** | - | 本地数据库 |

---

## 🎯 核心功能模块

### 1. UI组件库

#### 基础组件
```typescript
// 按钮组件
import { Button } from '@/components/ui/button'

<Button variant="default" size="md">
  点击按钮
</Button>

// 卡片组件
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>卡片标题</CardTitle>
  </CardHeader>
  <CardContent>
    卡片内容
  </CardContent>
</Card>
```

#### 高级组件
```typescript
// 徽章组件
import { Badge } from '@/components/ui/badge'

<Badge variant="default">新功能</Badge>
<Badge variant="secondary">次要</Badge>
<Badge variant="outline">轮廓</Badge>

// 进度条
import { Progress } from '@/components/ui/progress'

<Progress value={75} max={100} />

// 标签页
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">标签1</TabsTrigger>
    <TabsTrigger value="tab2">标签2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">内容1</TabsContent>
  <TabsContent value="tab2">内容2</TabsContent>
</Tabs>
```

### 2. 图表系统

```typescript
import { LineChart, BarChart, PieChart } from '@/components/charts'

// 折线图
<LineChart
  data={chartData}
  options={{
    responsive: true,
    plugins: {
      title: { display: true, text: '数据趋势' }
    }
  }}
/>

// 柱状图
<BarChart
  data={barData}
  options={{ maintainAspectRatio: false }}
/>

// 饼图
<PieChart
  data={pieData}
  options={{
    plugins: {
      legend: { position: 'bottom' }
    }
  }}
/>
```

### 3. 国际化系统

```typescript
// 使用翻译
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t, i18n } = useTranslation()
  
  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <button onClick={() => i18n.changeLanguage('en-US')}>
        English
      </button>
    </div>
  )
}

// 添加翻译文件
// src/lib/i18n/locales/zh-CN.json
{
  "welcome": {
    "title": "欢迎使用PDCS-UI"
  }
}
```

### 4. 主题系统

```typescript
// 主题切换
import { ThemeToggle } from '@/components/theme-toggle'

<ThemeToggle />

// 自定义主题
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    }
  }
}
```

### 5. 数据库操作

```typescript
import { DatabaseManager } from '@/lib/database'

// 初始化数据库
const db = new DatabaseManager()

// 创建表
await db.createTable('users', {
  id: 'INTEGER PRIMARY KEY',
  name: 'TEXT NOT NULL',
  email: 'TEXT UNIQUE'
})

// 插入数据
await db.insert('users', {
  name: '张三',
  email: 'zhangsan@example.com'
})

// 查询数据
const users = await db.select('users', {
  where: 'name LIKE ?',
  params: ['张%']
})
```

---

## 💻 开发指南

### 创建新页面

```bash
# 1. 创建页面文件
mkdir src/app/my-page
touch src/app/my-page/page.tsx

# 2. 页面模板
```

```typescript
// src/app/my-page/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '我的页面 - PDCS-UI',
  description: '页面描述'
}

export default function MyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">我的页面</h1>
      {/* 页面内容 */}
    </div>
  )
}
```

### 创建新组件

```bash
# 1. 创建组件文件
touch src/components/my-component.tsx
```

```typescript
// src/components/my-component.tsx
import React from 'react'
import { cn } from '@/lib/utils'

interface MyComponentProps {
  title: string
  children?: React.ReactNode
  className?: string
}

export function MyComponent({ 
  title, 
  children, 
  className 
}: MyComponentProps) {
  return (
    <div className={cn('p-4 border rounded-lg', className)}>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      {children}
    </div>
  )
}
```

### 添加API路由

```typescript
// src/app/api/my-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 处理GET请求
    const data = { message: 'Hello from API' }
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // 处理POST请求
    return NextResponse.json({ success: true, data: body })
  } catch (error) {
    return NextResponse.json(
      { error: 'Bad Request' },
      { status: 400 }
    )
  }
}
```

### 编写测试

```typescript
// tests/components/my-component.test.tsx
import { render, screen } from '@testing-library/react'
import { MyComponent } from '@/components/my-component'

describe('MyComponent', () => {
  it('renders with title', () => {
    render(<MyComponent title="测试标题" />)
    expect(screen.getByText('测试标题')).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(
      <MyComponent title="标题">
        <p>子内容</p>
      </MyComponent>
    )
    expect(screen.getByText('子内容')).toBeInTheDocument()
  })
})
```

---

## 🚀 部署指南

### 本地构建

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 预览构建结果
npm run preview
```

### Vercel部署

```bash
# 1. 安装Vercel CLI
npm i -g vercel

# 2. 登录Vercel
vercel login

# 3. 部署项目
vercel --prod
```

### Docker部署

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# 安装依赖
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# 构建应用
FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# 运行应用
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

```bash
# 构建Docker镜像
docker build -t pdcs-ui .

# 运行容器
docker run -p 3000:3000 pdcs-ui
```

---

## 📝 最佳实践

### 1. 代码规范

```typescript
// ✅ 好的实践
interface UserProps {
  id: string
  name: string
  email?: string
}

function UserCard({ id, name, email }: UserProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      {email && (
        <CardContent>
          <p className="text-sm text-muted-foreground">{email}</p>
        </CardContent>
      )}
    </Card>
  )
}

// ❌ 避免的实践
function BadComponent(props: any) {
  return <div style={{color: 'red'}}>{props.data}</div>
}
```

### 2. 性能优化

```typescript
// 使用React.memo优化组件
import React from 'react'

export const OptimizedComponent = React.memo(function OptimizedComponent({
  data
}: {
  data: string[]
}) {
  return (
    <ul>
      {data.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  )
})

// 使用useMemo优化计算
import { useMemo } from 'react'

function ExpensiveComponent({ items }: { items: Item[] }) {
  const expensiveValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.value, 0)
  }, [items])

  return <div>总计: {expensiveValue}</div>
}
```

### 3. 错误处理

```typescript
// 错误边界组件
'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            出现错误
          </h2>
          <p className="text-red-600">
            {this.state.error?.message || '未知错误'}
          </p>
        </div>
      )
    }

    return this.props.children
  }
}
```

### 4. 状态管理

```typescript
// 使用Context进行状态管理
import React, { createContext, useContext, useReducer } from 'react'

interface AppState {
  user: User | null
  theme: 'light' | 'dark'
  language: string
}

type AppAction = 
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_LANGUAGE'; payload: string }

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload }
    default:
      return state
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, {
    user: null,
    theme: 'light',
    language: 'zh-CN'
  })

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
```

---

## 🔧 故障排除

### 常见问题

#### 1. 依赖安装失败

```bash
# 清理缓存
npm cache clean --force
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

#### 2. 构建失败

```bash
# 检查TypeScript错误
npm run type-check

# 检查ESLint错误
npm run lint

# 修复可自动修复的问题
npm run lint:fix
```

#### 3. 样式不生效

```bash
# 重新构建Tailwind CSS
npm run build:css

# 检查Tailwind配置
npx tailwindcss --help
```

#### 4. 数据库连接问题

```typescript
// 检查数据库连接
import { DatabaseManager } from '@/lib/database'

async function checkDatabase() {
  try {
    const db = new DatabaseManager()
    await db.testConnection()
    console.log('数据库连接正常')
  } catch (error) {
    console.error('数据库连接失败:', error)
  }
}
```

### 调试工具

```typescript
// 使用调试面板
import { DebugPanel } from '@/components/debug-panel'

export default function MyPage() {
  return (
    <div>
      {/* 页面内容 */}
      {process.env.NODE_ENV === 'development' && <DebugPanel />}
    </div>
  )
}
```

---

## 📚 更多资源

- **GitHub仓库**: https://github.com/fbsqual/PDCS-Fronted-UI
- **在线Demo**: http://localhost:3001/demo
- **API文档**: [API_REFERENCE.md](./API_REFERENCE.md)
- **更新日志**: [CHANGELOG.md](../CHANGELOG.md)
- **贡献指南**: [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 🤝 支持与反馈

如果您在使用过程中遇到问题或有改进建议，请：

1. 查看[故障排除](#故障排除)部分
2. 搜索[GitHub Issues](https://github.com/fbsqual/PDCS-Fronted-UI/issues)
3. 创建新的Issue描述问题
4. 参与[Discussions](https://github.com/fbsqual/PDCS-Fronted-UI/discussions)

---

**PDCS-Fronted-UI** - 企业级前端开发框架 🚀
