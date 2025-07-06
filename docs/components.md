# 组件库文档

本文档详细介绍了项目中所有可用的组件及其使用方法。

## 🎨 基础 UI 组件

### Button 按钮

通用按钮组件，支持多种样式和尺寸。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| variant | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` | 按钮样式变体 |
| size | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'default'` | 按钮尺寸 |
| asChild | `boolean` | `false` | 是否作为子元素渲染 |
| disabled | `boolean` | `false` | 是否禁用 |

#### 使用示例

```tsx
import { Button } from '@/components/ui/button'

// 基础用法
<Button>点击我</Button>

// 不同变体
<Button variant="destructive">删除</Button>
<Button variant="outline">取消</Button>
<Button variant="ghost">幽灵按钮</Button>

// 不同尺寸
<Button size="sm">小按钮</Button>
<Button size="lg">大按钮</Button>
<Button size="icon">🔍</Button>

// 作为链接使用
<Button asChild>
  <a href="/about">关于我们</a>
</Button>
```

### Card 卡片

用于展示内容的卡片容器。

#### 组件

- `Card` - 卡片容器
- `CardHeader` - 卡片头部
- `CardTitle` - 卡片标题
- `CardDescription` - 卡片描述
- `CardContent` - 卡片内容
- `CardFooter` - 卡片底部

#### 使用示例

```tsx
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>卡片标题</CardTitle>
    <CardDescription>卡片描述信息</CardDescription>
  </CardHeader>
  <CardContent>
    <p>卡片内容</p>
  </CardContent>
  <CardFooter>
    <Button>操作按钮</Button>
  </CardFooter>
</Card>
```

### Input 输入框

通用输入框组件。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| type | `string` | `'text'` | 输入框类型 |
| placeholder | `string` | - | 占位符文本 |
| disabled | `boolean` | `false` | 是否禁用 |
| className | `string` | - | 自定义样式类 |

#### 使用示例

```tsx
import { Input } from '@/components/ui/input'

<Input placeholder="请输入用户名" />
<Input type="password" placeholder="请输入密码" />
<Input type="email" placeholder="请输入邮箱" disabled />
```

## 📊 图表组件

### LineChart 折线图

用于展示数据趋势的折线图组件。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| data | `any[]` | - | 图表数据 |
| xKey | `string` | - | X轴数据键名 |
| yKeys | `YAxisConfig[]` | - | Y轴数据配置 |
| height | `number` | `400` | 图表高度 |
| showGrid | `boolean` | `true` | 是否显示网格 |
| showLegend | `boolean` | `true` | 是否显示图例 |
| smooth | `boolean` | `true` | 是否平滑曲线 |

#### 使用示例

```tsx
import { LineChart } from '@/components/charts/line-chart'

const data = [
  { month: '1月', 销售额: 1000, 利润: 300 },
  { month: '2月', 销售额: 1200, 利润: 400 },
  { month: '3月', 销售额: 900, 利润: 200 },
]

<LineChart
  data={data}
  xKey="month"
  yKeys={[
    { key: '销售额', name: '销售额', color: '#3b82f6' },
    { key: '利润', name: '利润', color: '#22c55e' }
  ]}
  height={300}
  smooth={true}
/>
```

### BarChart 柱状图

用于比较不同类别数据的柱状图组件。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| data | `any[]` | - | 图表数据 |
| xKey | `string` | - | X轴数据键名 |
| yKeys | `YAxisConfig[]` | - | Y轴数据配置 |
| height | `number` | `400` | 图表高度 |
| horizontal | `boolean` | `false` | 是否水平显示 |
| radius | `number` | `4` | 柱子圆角 |

#### 使用示例

```tsx
import { BarChart } from '@/components/charts/bar-chart'

<BarChart
  data={data}
  xKey="category"
  yKeys={[
    { key: 'value', name: '数值', color: '#8884d8' }
  ]}
  horizontal={false}
  radius={8}
/>
```

### PieChart 饼图

用于展示数据占比的饼图组件。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| data | `any[]` | - | 图表数据 |
| valueKey | `string` | - | 数值字段键名 |
| nameKey | `string` | - | 名称字段键名 |
| height | `number` | `400` | 图表高度 |
| innerRadius | `number` | `0` | 内半径（甜甜圈图） |
| colors | `string[]` | - | 自定义颜色数组 |

#### 使用示例

```tsx
import { PieChart } from '@/components/charts/pie-chart'

const data = [
  { name: '产品A', value: 400 },
  { name: '产品B', value: 300 },
  { name: '产品C', value: 200 },
]

<PieChart
  data={data}
  valueKey="value"
  nameKey="name"
  innerRadius={60} // 甜甜圈图
  colors={['#0088FE', '#00C49F', '#FFBB28']}
/>
```

### AreaChart 面积图

用于展示数据变化趋势的面积图组件。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| data | `any[]` | - | 图表数据 |
| xKey | `string` | - | X轴数据键名 |
| yKeys | `YAxisConfig[]` | - | Y轴数据配置 |
| height | `number` | `400` | 图表高度 |
| stacked | `boolean` | `false` | 是否堆叠显示 |
| fillOpacity | `number` | `0.6` | 填充透明度 |

#### 使用示例

```tsx
import { AreaChart } from '@/components/charts/area-chart'

<AreaChart
  data={data}
  xKey="month"
  yKeys={[
    { key: '销售额', name: '销售额', color: '#3b82f6' },
    { key: '利润', name: '利润', color: '#22c55e' }
  ]}
  stacked={true}
  fillOpacity={0.8}
/>
```

## 🌍 国际化组件

### LanguageToggle 语言切换

用于切换应用语言的下拉菜单组件。

#### 使用示例

```tsx
import { LanguageToggle } from '@/components/language-toggle'

<LanguageToggle />
```

## 🌙 主题组件

### ThemeToggle 主题切换

用于切换应用主题的下拉菜单组件。

#### 使用示例

```tsx
import { ThemeToggle } from '@/components/theme-toggle'

<ThemeToggle />
```

## 💾 数据组件

### DatabaseDemo 数据库演示

展示 SQLite 数据库功能的演示组件。

#### 使用示例

```tsx
import { DatabaseDemo } from '@/components/database-demo'

<DatabaseDemo />
```

## 🔌 API 组件

### ApiDemo API 演示

展示 API 客户端功能的演示组件。

#### 使用示例

```tsx
import { ApiDemo } from '@/components/api-demo'

<ApiDemo />
```

## 🐛 调试组件

### DebugPanel 调试面板

开发环境下的调试面板组件，自动显示。

#### 特性

- API 请求监控
- 错误日志收集
- 性能指标显示
- 系统状态监控
- 可拖拽浮动窗口

## 🎨 样式指南

### 颜色系统

项目使用 Tailwind CSS 的颜色系统，支持主题切换：

```css
/* 主要颜色 */
--primary: 222.2 84% 4.9%;
--primary-foreground: 210 40% 98%;

/* 次要颜色 */
--secondary: 210 40% 96%;
--secondary-foreground: 222.2 84% 4.9%;

/* 强调色 */
--accent: 210 40% 96%;
--accent-foreground: 222.2 84% 4.9%;

/* 边框和输入框 */
--border: 214.3 31.8% 91.4%;
--input: 214.3 31.8% 91.4%;
```

### 响应式设计

所有组件都支持响应式设计，使用 Tailwind CSS 的断点系统：

- `sm`: 640px+
- `md`: 768px+
- `lg`: 1024px+
- `xl`: 1280px+
- `2xl`: 1536px+

### 无障碍支持

所有组件都遵循 WCAG 2.1 无障碍标准：

- 键盘导航支持
- 屏幕阅读器友好
- 适当的 ARIA 属性
- 高对比度支持

## 🔧 自定义组件

### 创建新组件

1. 在 `src/components/` 目录下创建组件文件
2. 使用 TypeScript 定义属性接口
3. 添加适当的样式和变体
4. 编写单元测试
5. 更新文档

### 组件模板

```tsx
import React from 'react'
import { cn } from '@/lib/utils'

interface MyComponentProps {
  children: React.ReactNode
  variant?: 'default' | 'secondary'
  className?: string
}

export function MyComponent({ 
  children, 
  variant = 'default', 
  className 
}: MyComponentProps) {
  return (
    <div 
      className={cn(
        'base-styles',
        {
          'default-variant': variant === 'default',
          'secondary-variant': variant === 'secondary',
        },
        className
      )}
    >
      {children}
    </div>
  )
}
```
