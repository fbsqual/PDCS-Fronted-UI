# PDCS-Fronted-UI API 参考文档

## 📋 目录

1. [UI组件API](#ui组件api)
2. [工具函数API](#工具函数api)
3. [数据库API](#数据库api)
4. [国际化API](#国际化api)
5. [主题API](#主题api)
6. [图表API](#图表api)

---

## 🎨 UI组件API

### Button 按钮组件

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

// 使用示例
<Button variant="default" size="lg" onClick={handleClick}>
  点击按钮
</Button>
```

### Card 卡片组件

```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

// 使用示例
<Card className="w-96">
  <CardHeader>
    <CardTitle>卡片标题</CardTitle>
    <CardDescription>卡片描述</CardDescription>
  </CardHeader>
  <CardContent>
    <p>卡片内容</p>
  </CardContent>
  <CardFooter>
    <Button>操作按钮</Button>
  </CardFooter>
</Card>
```

### Badge 徽章组件

```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

// 使用示例
<Badge variant="default">新功能</Badge>
<Badge variant="secondary">次要</Badge>
<Badge variant="destructive">错误</Badge>
<Badge variant="outline">轮廓</Badge>
```

### Progress 进度条组件

```typescript
interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
}

// 使用示例
<Progress value={75} max={100} className="w-full" />
```

### Tabs 标签页组件

```typescript
interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

// 使用示例
<Tabs defaultValue="tab1" onValueChange={handleTabChange}>
  <TabsList>
    <TabsTrigger value="tab1">标签1</TabsTrigger>
    <TabsTrigger value="tab2">标签2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    <p>标签1的内容</p>
  </TabsContent>
  <TabsContent value="tab2">
    <p>标签2的内容</p>
  </TabsContent>
</Tabs>
```

### Alert 警告组件

```typescript
interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive'
}

interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

// 使用示例
<Alert variant="default">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>提示</AlertTitle>
  <AlertDescription>
    这是一个重要的提示信息。
  </AlertDescription>
</Alert>
```

### Input 输入框组件

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

// 使用示例
<Input
  type="text"
  placeholder="请输入内容"
  value={value}
  onChange={handleChange}
  className="w-full"
/>
```

---

## 🛠️ 工具函数API

### cn 类名合并函数

```typescript
function cn(...inputs: ClassValue[]): string

// 使用示例
import { cn } from '@/lib/utils'

const className = cn(
  'base-class',
  condition && 'conditional-class',
  {
    'active': isActive,
    'disabled': isDisabled
  }
)
```

### formatDate 日期格式化

```typescript
function formatDate(date: Date | string, format?: string): string

// 使用示例
import { formatDate } from '@/lib/utils'

const formatted = formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
// 输出: "2024-01-01 12:00:00"
```

### debounce 防抖函数

```typescript
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void

// 使用示例
import { debounce } from '@/lib/utils'

const debouncedSearch = debounce((query: string) => {
  // 执行搜索
}, 300)
```

### throttle 节流函数

```typescript
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void

// 使用示例
import { throttle } from '@/lib/utils'

const throttledScroll = throttle(() => {
  // 处理滚动事件
}, 100)
```

---

## 🗄️ 数据库API

### DatabaseManager 类

```typescript
class DatabaseManager {
  constructor(dbPath?: string)
  
  // 连接数据库
  async connect(): Promise<void>
  
  // 断开连接
  async disconnect(): Promise<void>
  
  // 测试连接
  async testConnection(): Promise<boolean>
  
  // 创建表
  async createTable(tableName: string, schema: Record<string, string>): Promise<void>
  
  // 插入数据
  async insert(tableName: string, data: Record<string, any>): Promise<number>
  
  // 查询数据
  async select(
    tableName: string, 
    options?: {
      where?: string
      params?: any[]
      orderBy?: string
      limit?: number
      offset?: number
    }
  ): Promise<any[]>
  
  // 更新数据
  async update(
    tableName: string,
    data: Record<string, any>,
    where: string,
    params?: any[]
  ): Promise<number>
  
  // 删除数据
  async delete(
    tableName: string,
    where: string,
    params?: any[]
  ): Promise<number>
  
  // 执行原始SQL
  async execute(sql: string, params?: any[]): Promise<any>
}

// 使用示例
import { DatabaseManager } from '@/lib/database'

const db = new DatabaseManager()

// 创建用户表
await db.createTable('users', {
  id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
  name: 'TEXT NOT NULL',
  email: 'TEXT UNIQUE',
  created_at: 'DATETIME DEFAULT CURRENT_TIMESTAMP'
})

// 插入用户
const userId = await db.insert('users', {
  name: '张三',
  email: 'zhangsan@example.com'
})

// 查询用户
const users = await db.select('users', {
  where: 'name LIKE ?',
  params: ['张%'],
  orderBy: 'created_at DESC',
  limit: 10
})

// 更新用户
await db.update('users', 
  { name: '张三丰' },
  'id = ?',
  [userId]
)

// 删除用户
await db.delete('users', 'id = ?', [userId])
```

---

## 🌍 国际化API

### useTranslation Hook

```typescript
interface UseTranslationResult {
  t: (key: string, options?: any) => string
  i18n: {
    language: string
    changeLanguage: (lng: string) => Promise<void>
    languages: string[]
  }
  ready: boolean
}

function useTranslation(): UseTranslationResult

// 使用示例
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t, i18n } = useTranslation()
  
  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <p>{t('welcome.description', { name: '用户' })}</p>
      <button onClick={() => i18n.changeLanguage('en-US')}>
        {t('common.switchLanguage')}
      </button>
    </div>
  )
}
```

### 翻译文件结构

```json
// src/lib/i18n/locales/zh-CN.json
{
  "common": {
    "save": "保存",
    "cancel": "取消",
    "delete": "删除",
    "edit": "编辑",
    "switchLanguage": "切换语言"
  },
  "welcome": {
    "title": "欢迎使用PDCS-UI",
    "description": "你好，{{name}}！"
  },
  "navigation": {
    "home": "首页",
    "about": "关于",
    "contact": "联系我们"
  }
}
```

### LanguageToggle 组件

```typescript
interface LanguageToggleProps {
  className?: string
}

// 使用示例
import { LanguageToggle } from '@/components/language-toggle'

<LanguageToggle className="ml-4" />
```

---

## 🎨 主题API

### ThemeProvider 组件

```typescript
interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: 'light' | 'dark' | 'system'
  storageKey?: string
}

// 使用示例
import { ThemeProvider } from '@/components/theme-provider'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      {/* 应用内容 */}
    </ThemeProvider>
  )
}
```

### useTheme Hook

```typescript
interface UseThemeResult {
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  systemTheme: 'light' | 'dark'
  resolvedTheme: 'light' | 'dark'
}

function useTheme(): UseThemeResult

// 使用示例
import { useTheme } from '@/components/theme-provider'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      切换主题
    </button>
  )
}
```

### ThemeToggle 组件

```typescript
interface ThemeToggleProps {
  className?: string
}

// 使用示例
import { ThemeToggle } from '@/components/theme-toggle'

<ThemeToggle className="ml-4" />
```

---

## 📊 图表API

### LineChart 折线图

```typescript
interface LineChartProps {
  data: ChartData<'line'>
  options?: ChartOptions<'line'>
  width?: number
  height?: number
  className?: string
}

// 使用示例
import { LineChart } from '@/components/charts'

const data = {
  labels: ['1月', '2月', '3月', '4月', '5月'],
  datasets: [{
    label: '销售额',
    data: [12, 19, 3, 5, 2],
    borderColor: 'rgb(75, 192, 192)',
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
  }]
}

<LineChart 
  data={data}
  options={{
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: '月度销售趋势'
      }
    }
  }}
/>
```

### BarChart 柱状图

```typescript
interface BarChartProps {
  data: ChartData<'bar'>
  options?: ChartOptions<'bar'>
  width?: number
  height?: number
  className?: string
}

// 使用示例
import { BarChart } from '@/components/charts'

const data = {
  labels: ['产品A', '产品B', '产品C', '产品D'],
  datasets: [{
    label: '销量',
    data: [65, 59, 80, 81],
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
    ],
  }]
}

<BarChart data={data} />
```

### PieChart 饼图

```typescript
interface PieChartProps {
  data: ChartData<'pie'>
  options?: ChartOptions<'pie'>
  width?: number
  height?: number
  className?: string
}

// 使用示例
import { PieChart } from '@/components/charts'

const data = {
  labels: ['桌面端', '移动端', '平板端'],
  datasets: [{
    data: [300, 50, 100],
    backgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56'
    ],
  }]
}

<PieChart 
  data={data}
  options={{
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }}
/>
```

---

## 🔧 调试API

### DebugPanel 调试面板

```typescript
interface DebugPanelProps {
  className?: string
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

// 使用示例
import { DebugPanel } from '@/components/debug-panel'

function App() {
  return (
    <div>
      {/* 应用内容 */}
      {process.env.NODE_ENV === 'development' && (
        <DebugPanel position="bottom-right" />
      )}
    </div>
  )
}
```

### 调试工具函数

```typescript
// 性能监控
function measurePerformance(name: string, fn: () => void): number

// 内存使用监控
function getMemoryUsage(): {
  used: number
  total: number
  percentage: number
}

// 组件渲染次数统计
function useRenderCount(componentName: string): number

// 使用示例
import { measurePerformance, getMemoryUsage, useRenderCount } from '@/lib/debug'

function MyComponent() {
  const renderCount = useRenderCount('MyComponent')
  
  const handleClick = () => {
    const duration = measurePerformance('expensive-operation', () => {
      // 执行耗时操作
    })
    console.log(`操作耗时: ${duration}ms`)
    
    const memory = getMemoryUsage()
    console.log(`内存使用: ${memory.percentage}%`)
  }
  
  return (
    <div>
      <p>渲染次数: {renderCount}</p>
      <button onClick={handleClick}>执行操作</button>
    </div>
  )
}
```

---

## 📱 PWA API

### Service Worker 注册

```typescript
// 注册Service Worker
function registerServiceWorker(): Promise<ServiceWorkerRegistration>

// 检查更新
function checkForUpdates(): Promise<boolean>

// 使用示例
import { registerServiceWorker, checkForUpdates } from '@/lib/pwa'

// 在应用启动时注册
useEffect(() => {
  if ('serviceWorker' in navigator) {
    registerServiceWorker()
      .then(registration => {
        console.log('SW registered:', registration)
      })
      .catch(error => {
        console.log('SW registration failed:', error)
      })
  }
}, [])

// 检查更新
const handleCheckUpdates = async () => {
  const hasUpdate = await checkForUpdates()
  if (hasUpdate) {
    // 提示用户更新
  }
}
```

---

## 🔒 类型定义

### 通用类型

```typescript
// 基础类型
type Theme = 'light' | 'dark' | 'system'
type Language = 'zh-CN' | 'en-US' | 'ja-JP'
type Size = 'sm' | 'md' | 'lg'
type Variant = 'default' | 'secondary' | 'destructive' | 'outline'

// 组件Props基础类型
interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// 数据库记录类型
interface DatabaseRecord {
  id: number
  created_at: string
  updated_at: string
  [key: string]: any
}

// API响应类型
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 图表数据类型
interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  [key: string]: any
}

interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}
```

---

## 📚 更多信息

- **完整使用指南**: [COMPLETE_USAGE_GUIDE.md](./COMPLETE_USAGE_GUIDE.md)
- **组件示例**: http://localhost:3001/demo
- **GitHub仓库**: https://github.com/fbsqual/PDCS-Fronted-UI
- **更新日志**: [CHANGELOG.md](../CHANGELOG.md)

---

**PDCS-Fronted-UI API Reference** - 完整的API参考文档 📖
