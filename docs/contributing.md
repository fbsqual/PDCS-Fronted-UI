# PDCS-Fronted-UI 贡献指南

欢迎为 PDCS-Fronted-UI 项目做出贡献！本指南将帮助您了解如何参与项目开发。

## 目录

1. [开发环境设置](#开发环境设置)
2. [代码规范](#代码规范)
3. [提交规范](#提交规范)
4. [Pull Request流程](#pull-request流程)
5. [测试要求](#测试要求)
6. [文档贡献](#文档贡献)
7. [社区参与](#社区参与)

---

## 开发环境设置

### 环境要求

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0 或 **yarn**: >= 1.22.0
- **Git**: >= 2.30.0

### 本地开发设置

```bash
# 1. Fork项目到您的GitHub账户

# 2. 克隆您的Fork
git clone https://github.com/YOUR_USERNAME/PDCS-Fronted-UI.git
cd PDCS-Fronted-UI

# 3. 添加上游仓库
git remote add upstream https://github.com/fbsqual/PDCS-Fronted-UI.git

# 4. 安装依赖
npm install

# 5. 启动开发服务器
npm run dev

# 6. 运行测试
npm test

# 7. 检查代码质量
npm run lint
npm run type-check
```

### 开发工具配置

推荐使用以下VSCode扩展：

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

---

## 代码规范

### TypeScript规范

```typescript
// ✅ 好的实践
interface UserProps {
  id: string
  name: string
  email?: string
  isActive: boolean
}

function UserCard({ id, name, email, isActive }: UserProps) {
  return (
    <Card className={cn('user-card', { 'opacity-50': !isActive })}>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        {email && <CardDescription>{email}</CardDescription>}
      </CardHeader>
    </Card>
  )
}

// ❌ 避免的实践
function BadComponent(props: any) {
  return <div style={{color: 'red'}}>{props.data}</div>
}
```

## 📝 代码规范

### 命名约定

- **文件名**: 使用 kebab-case
  ```
  user-profile.tsx
  api-client.ts
  ```

- **组件名**: 使用 PascalCase
  ```tsx
  export function UserProfile() {}
  export const ApiClient = {}
  ```

- **变量和函数**: 使用 camelCase
  ```tsx
  const userName = 'john'
  function getUserData() {}
  ```

- **常量**: 使用 SCREAMING_SNAKE_CASE
  ```tsx
  const API_BASE_URL = 'https://api.example.com'
  ```

### TypeScript 规范

- 优先使用 `interface` 而不是 `type`
- 为所有函数参数和返回值添加类型注解
- 使用严格的 TypeScript 配置

```tsx
// ✅ 好的示例
interface UserProps {
  id: string
  name: string
  email?: string
}

function UserCard({ id, name, email }: UserProps): JSX.Element {
  return <div>{name}</div>
}

// ❌ 避免的示例
function UserCard(props: any) {
  return <div>{props.name}</div>
}
```

### React 组件规范

- 使用函数组件和 Hooks
- 组件文件结构：

```tsx
'use client' // 如果是客户端组件

import { useState } from 'react'
import { Button } from '@/components/ui/button'

// 类型定义
interface ComponentProps {
  title: string
  onAction?: () => void
}

/**
 * 组件描述
 * @param title - 标题
 * @param onAction - 点击回调
 */
export function Component({ title, onAction }: ComponentProps) {
  const [state, setState] = useState(false)

  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={onAction}>Action</Button>
    </div>
  )
}
```

### CSS 和样式规范

- 使用 Tailwind CSS 类名
- 避免内联样式
- 使用 `cn()` 函数合并类名

```tsx
import { cn } from '@/lib/utils'

function Component({ className, variant }: Props) {
  return (
    <div 
      className={cn(
        'base-styles',
        {
          'variant-styles': variant === 'primary',
        },
        className
      )}
    >
      Content
    </div>
  )
}
```

## 🧪 测试规范

### 单元测试

- 为所有公共函数编写测试
- 测试文件命名：`*.test.ts` 或 `*.test.tsx`
- 使用描述性的测试名称

```tsx
import { render, screen } from '@/lib/test-utils'
import { Button } from './button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    screen.getByRole('button').click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### 组件测试

- 测试组件的渲染
- 测试用户交互
- 测试不同的 props 组合
- 测试错误状态

## 📚 文档规范

### 代码注释

- 为复杂的逻辑添加注释
- 使用 JSDoc 格式注释函数和组件

```tsx
/**
 * 计算用户年龄
 * @param birthDate - 出生日期
 * @returns 年龄（年）
 */
function calculateAge(birthDate: Date): number {
  const today = new Date()
  const age = today.getFullYear() - birthDate.getFullYear()
  
  // 检查是否已过生日
  if (today.getMonth() < birthDate.getMonth() || 
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
    return age - 1
  }
  
  return age
}
```

### README 更新

如果您的更改影响了项目的使用方式，请更新相应的文档：

- README.md
- API 文档
- 组件文档
- 部署指南

## 🔄 提交信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### 类型 (type)

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式化（不影响功能）
- `refactor`: 代码重构
- `test`: 添加或修改测试
- `chore`: 构建过程或辅助工具的变动

### 示例

```bash
feat(auth): add user login functionality

Add login form component with validation
- Email and password validation
- Error handling for invalid credentials
- Redirect to dashboard on success

Closes #123
```

## 🏗️ 项目结构

了解项目结构有助于您更好地贡献代码：

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
│   └── __tests__/         # 工具测试
├── locales/               # 翻译文件
├── styles/                # 样式文件
└── types/                 # TypeScript 类型定义
```

## 🔧 开发环境设置

### 必需工具

- Node.js 18.0+
- npm 或 yarn 或 pnpm
- Git
- VS Code（推荐）

### VS Code 扩展

推荐安装以下扩展：

- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- Auto Rename Tag
- Bracket Pair Colorizer

### 环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_DEBUG_MODE=true
```

## 🚀 发布流程

项目维护者负责发布新版本：

1. 更新版本号
2. 生成 CHANGELOG
3. 创建 Git 标签
4. 发布到 npm（如适用）
5. 部署到生产环境

## 📋 Pull Request 检查清单

在提交 PR 之前，请确保：

- [ ] 代码遵循项目规范
- [ ] 所有测试通过
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 提交信息符合规范
- [ ] 没有合并冲突
- [ ] 功能在不同浏览器中测试
- [ ] 响应式设计正常工作

## 🎯 贡献优先级

我们特别欢迎以下类型的贡献：

### 高优先级
- 修复 bug
- 性能优化
- 安全问题修复
- 可访问性改进

### 中优先级
- 新功能开发
- 代码重构
- 测试覆盖率提升
- 文档完善

### 低优先级
- 代码风格调整
- 依赖更新
- 配置优化

## 🏆 贡献者认可

我们会在以下地方认可贡献者：

- README.md 中的贡献者列表
- 发布说明中的感谢
- 项目网站的贡献者页面

## 📞 获取帮助

如果您在贡献过程中遇到问题：

1. 查看现有的 Issues 和 Discussions
2. 在 GitHub 上创建新的 Discussion
3. 联系项目维护者

## 📄 许可证

通过贡献代码，您同意您的贡献将在与项目相同的 MIT 许可证下发布。

---

再次感谢您的贡献！每一个贡献都让这个项目变得更好。
