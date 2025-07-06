# PDCS-Fronted-UI 常见问题

本文档收集了使用 PDCS-Fronted-UI 框架时的常见问题和解决方案。

## 目录

1. [安装和设置](#安装和设置)
2. [组件使用](#组件使用)
3. [样式和主题](#样式和主题)
4. [数据管理](#数据管理)
5. [性能优化](#性能优化)
6. [部署问题](#部署问题)
7. [开发工具](#开发工具)

---

## 安装和设置

### Q: 如何开始一个新的 PDCS-Fronted-UI 项目？

**A:** 有几种方式可以开始：

```bash
# 方式1: 克隆框架仓库
git clone https://github.com/fbsqual/PDCS-Fronted-UI.git my-project
cd my-project
npm install
npm run dev

# 方式2: 使用脚手架工具（如果可用）
npx create-pdcs-app my-project

# 方式3: 手动设置
mkdir my-project
cd my-project
npm init -y
npm install next react react-dom typescript tailwindcss
# 然后复制必要的配置文件
```

### Q: 安装依赖时遇到版本冲突怎么办？

**A:** 检查并解决版本冲突：

```bash
# 1. 清理缓存
npm cache clean --force
rm -rf node_modules package-lock.json

# 2. 检查 Node.js 版本
node --version  # 需要 >= 18.0.0

# 3. 使用正确的包管理器
npm install
# 或者
yarn install

# 4. 如果仍有问题，检查 package.json 中的版本约束
```

### Q: TypeScript 配置错误如何解决？

**A:** 确保 TypeScript 配置正确：

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 组件使用

### Q: 如何自定义组件样式？

**A:** 有多种方式自定义样式：

```typescript
// 方式1: 使用 className
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

<Button className={cn('bg-blue-500 hover:bg-blue-600', 'my-custom-class')}>
  自定义按钮
</Button>

// 方式2: 扩展组件
import { Button, ButtonProps } from '@/components/ui/button'

interface CustomButtonProps extends ButtonProps {
  theme?: 'primary' | 'secondary'
}

function CustomButton({ theme = 'primary', className, ...props }: CustomButtonProps) {
  return (
    <Button
      className={cn(
        theme === 'primary' && 'bg-blue-500 hover:bg-blue-600',
        theme === 'secondary' && 'bg-gray-500 hover:bg-gray-600',
        className
      )}
      {...props}
    />
  )
}

// 方式3: 使用 CSS 变量
// globals.css
:root {
  --button-primary-bg: #3b82f6;
  --button-primary-hover: #2563eb;
}

.custom-button {
  background-color: var(--button-primary-bg);
}

.custom-button:hover {
  background-color: var(--button-primary-hover);
}
```

### Q: 组件的 TypeScript 类型定义在哪里？

**A:** 类型定义位于多个位置：

```typescript
// 1. 组件文件中的内联类型
// src/components/ui/button.tsx
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

// 2. 全局类型定义
// src/types/index.ts
export interface User {
  id: string
  name: string
  email: string
}

// 3. 使用类型
import { ButtonProps } from '@/components/ui/button'
import { User } from '@/types'

function MyComponent({ user }: { user: User }) {
  const buttonProps: ButtonProps = {
    variant: 'default',
    size: 'md'
  }
  
  return <Button {...buttonProps}>Hello {user.name}</Button>
}
```

### Q: 如何处理表单验证？

**A:** 框架提供了多种表单验证方式：

```typescript
// 使用内置验证 Hook
import { useFormValidation } from '@/hooks/use-form-validation'

function LoginForm() {
  const { values, errors, setValue, validate, isValid } = useFormValidation(
    { email: '', password: '' },
    {
      email: (value) => {
        if (!value) return '邮箱不能为空'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '邮箱格式不正确'
        return null
      },
      password: (value) => {
        if (!value) return '密码不能为空'
        if (value.length < 6) return '密码至少6位'
        return null
      }
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      // 提交表单
      console.log('Form data:', values)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={values.email}
        onChange={(e) => setValue('email', e.target.value)}
        placeholder="邮箱"
        className={errors.email ? 'border-red-500' : ''}
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      
      <Input
        type="password"
        value={values.password}
        onChange={(e) => setValue('password', e.target.value)}
        placeholder="密码"
        className={errors.password ? 'border-red-500' : ''}
      />
      {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      
      <Button type="submit" disabled={!isValid}>
        登录
      </Button>
    </form>
  )
}
```

---

## 样式和主题

### Q: 如何切换主题？

**A:** 使用主题系统：

```typescript
// 1. 在应用根部使用 ThemeProvider
import { ThemeProvider } from '@/contexts/theme-context'

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  )
}

// 2. 在组件中使用主题
import { useTheme } from '@/contexts/theme-context'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      切换到 {theme === 'light' ? '深色' : '浅色'} 主题
    </Button>
  )
}

// 3. 自定义主题
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

### Q: 如何添加自定义字体？

**A:** 在 Next.js 中添加字体：

```typescript
// 1. 使用 Google Fonts
// src/app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}

// 2. 使用本地字体
// src/app/layout.tsx
import localFont from 'next/font/local'

const myFont = localFont({
  src: './fonts/MyFont.woff2',
  display: 'swap',
})

// 3. 在 Tailwind 中配置
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      }
    }
  }
}
```

---

## 数据管理

### Q: 如何使用数据库功能？

**A:** 使用内置的数据库管理器：

```typescript
// 1. 初始化数据库
import { DatabaseManager } from '@/lib/database'

const db = new DatabaseManager()

// 2. 创建表
await db.createTable('users', {
  id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
  name: 'TEXT NOT NULL',
  email: 'TEXT UNIQUE NOT NULL',
  created_at: 'DATETIME DEFAULT CURRENT_TIMESTAMP'
})

// 3. 插入数据
const userId = await db.insert('users', {
  name: '张三',
  email: 'zhangsan@example.com'
})

// 4. 查询数据
const users = await db.select('users', {
  where: 'name LIKE ?',
  params: ['%张%'],
  orderBy: 'created_at DESC',
  limit: 10
})

// 5. 更新数据
await db.update('users', 
  { name: '张三丰' }, 
  'id = ?', 
  [userId]
)

// 6. 删除数据
await db.delete('users', 'id = ?', [userId])
```

### Q: 如何处理 API 调用？

**A:** 使用 API 客户端：

```typescript
// 1. 创建 API 服务
import { ApiClient } from '@/lib/api/client'

class UserService extends ApiClient {
  async getUsers() {
    return this.get('/users')
  }

  async createUser(userData: any) {
    return this.post('/users', userData)
  }

  async updateUser(id: string, userData: any) {
    return this.put(`/users/${id}`, userData)
  }
}

// 2. 在组件中使用
function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const userService = new UserService()

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await userService.getUsers()
        setUsers(response.data)
      } catch (error) {
        console.error('Failed to load users:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  if (loading) return <div>加载中...</div>

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}
```

---

## 性能优化

### Q: 如何优化组件渲染性能？

**A:** 使用多种优化技术：

```typescript
// 1. 使用 React.memo
import React from 'react'

interface UserCardProps {
  user: User
  onEdit: (user: User) => void
}

export const UserCard = React.memo(function UserCard({ 
  user, 
  onEdit 
}: UserCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardFooter>
        <Button onClick={() => onEdit(user)}>编辑</Button>
      </CardFooter>
    </Card>
  )
}, (prevProps, nextProps) => {
  // 自定义比较函数
  return prevProps.user.id === nextProps.user.id &&
         prevProps.user.name === nextProps.user.name
})

// 2. 使用 useMemo 和 useCallback
function UserList({ users }: { users: User[] }) {
  const sortedUsers = useMemo(() => {
    return users.sort((a, b) => a.name.localeCompare(b.name))
  }, [users])

  const handleEdit = useCallback((user: User) => {
    // 编辑逻辑
  }, [])

  return (
    <div>
      {sortedUsers.map(user => (
        <UserCard key={user.id} user={user} onEdit={handleEdit} />
      ))}
    </div>
  )
}

// 3. 代码分割
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./heavy-component'))

function App() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### Q: 如何减少包大小？

**A:** 使用多种优化策略：

```typescript
// 1. 按需导入
// ❌ 不好的做法
import * as Icons from 'lucide-react'

// ✅ 好的做法
import { User, Settings, Home } from 'lucide-react'

// 2. 动态导入
const Chart = dynamic(() => import('@/components/charts/chart'), {
  loading: () => <p>加载图表中...</p>,
  ssr: false
})

// 3. 配置 webpack 优化
// next.config.js
module.exports = {
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    }
    return config
  }
}
```

---

## 部署问题

### Q: 如何部署到 Vercel？

**A:** 按照以下步骤部署：

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署
vercel

# 4. 配置环境变量（在 Vercel 控制台）
# NEXT_PUBLIC_API_URL=https://api.example.com
# DATABASE_URL=your-database-url

# 5. 自动部署（连接 Git 仓库）
# 在 Vercel 控制台连接 GitHub 仓库
```

### Q: 构建时出现错误怎么办？

**A:** 常见构建错误解决方案：

```bash
# 1. 类型错误
npm run type-check
# 修复 TypeScript 类型错误

# 2. ESLint 错误
npm run lint
npm run lint:fix

# 3. 清理缓存
rm -rf .next
npm run build

# 4. 检查依赖
npm audit
npm audit fix

# 5. 更新依赖
npm update
```

---

## 开发工具

### Q: 推荐的 VS Code 扩展有哪些？

**A:** 推荐以下扩展：

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "bradlc.vscode-tailwindcss"
  ]
}
```

### Q: 如何配置调试环境？

**A:** 配置 VS Code 调试：

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Q: 如何设置代码格式化？

**A:** 配置 Prettier 和 ESLint：

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}

// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

---

如果您的问题没有在这里找到答案，请：

1. 查看 [GitHub Issues](https://github.com/fbsqual/PDCS-Fronted-UI/issues)
2. 创建新的 Issue 描述问题
3. 参与 [GitHub Discussions](https://github.com/fbsqual/PDCS-Fronted-UI/discussions)

**PDCS-Fronted-UI FAQ** - 快速解决常见问题 💡
