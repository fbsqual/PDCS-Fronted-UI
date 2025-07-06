# 🚀 PDCS UI Framework 项目开发指南

## 📋 目录
1. [框架复用方式](#框架复用方式)
2. [新项目快速启动](#新项目快速启动)
3. [组件库开发](#组件库开发)
4. [迭代开发流程](#迭代开发流程)
5. [部署和发布](#部署和发布)

## 🔄 框架复用方式

### 方式一: 直接克隆模板 (推荐快速开发)

```bash
# 1. 克隆当前项目
git clone <current-repo> my-new-project
cd my-new-project

# 2. 清理Git历史
rm -rf .git
git init

# 3. 更新项目信息
# 修改 package.json 中的 name, description
# 更新 README.md
# 替换 public/ 中的图标和manifest

# 4. 安装依赖并启动
npm install
npm run dev
```

### 方式二: NPM包方式 (推荐企业级)

```bash
# 1. 创建新的Next.js项目
npx create-next-app@latest my-project --typescript --tailwind --app

# 2. 安装PDCS UI框架
cd my-project
npm install @your-org/pdcs-ui

# 3. 配置Tailwind (添加框架样式路径)
# 在 tailwind.config.js 中添加:
# './node_modules/@your-org/pdcs-ui/dist/**/*.js'

# 4. 在layout.tsx中配置Provider
import { ThemeProvider, I18nProvider } from '@your-org/pdcs-ui'
```

## 🚀 新项目快速启动

### 使用自动化脚本

```bash
# 给脚本执行权限
chmod +x scripts/create-project.sh

# 创建新项目
./scripts/create-project.sh my-awesome-project

# 进入项目目录
cd my-awesome-project

# 启动开发服务器
npm run dev
```

### 手动配置步骤

1. **创建Next.js项目**
```bash
npx create-next-app@latest my-project --typescript --tailwind --eslint --app --src-dir
```

2. **安装PDCS依赖**
```bash
npm install next-themes react-i18next i18next i18next-browser-languagedetector
npm install recharts tailwind-merge class-variance-authority
npm install @radix-ui/react-slot @radix-ui/react-dropdown-menu lucide-react
```

3. **复制核心文件**
```bash
# 复制组件库
cp -r src/components/* my-project/src/components/
cp -r src/lib/* my-project/src/lib/
cp src/styles/globals.css my-project/src/styles/

# 复制配置文件
cp tailwind.config.ts my-project/
cp next.config.js my-project/
```

## 🛠️ 组件库开发

### 创建新组件

```bash
# 1. 创建组件目录
mkdir src/components/my-component

# 2. 创建组件文件
touch src/components/my-component/index.ts
touch src/components/my-component/my-component.tsx
touch src/components/my-component/my-component.test.tsx
```

### 组件开发模板

```tsx
// src/components/my-component/my-component.tsx
'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface MyComponentProps {
  children?: React.ReactNode
  className?: string
  variant?: 'default' | 'secondary'
}

export const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
  ({ children, className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'base-component-styles',
          {
            'default-variant-styles': variant === 'default',
            'secondary-variant-styles': variant === 'secondary',
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

MyComponent.displayName = 'MyComponent'
```

### 导出组件

```tsx
// src/components/my-component/index.ts
export { MyComponent } from './my-component'
export type { MyComponentProps } from './my-component'
```

## 🔄 迭代开发流程

### Git工作流

```bash
# 1. 功能开发
git checkout -b feature/new-feature
# 开发代码...
git add .
git commit -m "feat: add new feature"

# 2. 合并到开发分支
git checkout develop
git merge feature/new-feature

# 3. 发布版本
git checkout -b release/v1.1.0
npm version minor
git checkout main
git merge release/v1.1.0
git tag v1.1.0
```

### 版本管理

- **Major (1.0.0)**: 破坏性更改
- **Minor (0.1.0)**: 新功能添加
- **Patch (0.0.1)**: Bug修复

### 测试策略

```bash
# 单元测试
npm run test

# E2E测试
npm run test:e2e

# 类型检查
npm run type-check

# 代码质量检查
npm run lint
```

## 📦 部署和发布

### 组件库发布

```bash
# 1. 构建组件库
cd lib
npm run build

# 2. 发布到npm
npm publish

# 3. 更新版本
npm version patch
```

### 项目部署

```bash
# Vercel部署
npm run build
vercel --prod

# Docker部署
docker build -t my-project .
docker run -p 3000:3000 my-project
```

## 🔧 配置文件模板

### package.json脚本

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "type-check": "tsc --noEmit",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

### 环境变量配置

```bash
# .env.local
NEXT_PUBLIC_APP_NAME=My Project
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_ENABLE_DEBUG=true

# .env.production
NEXT_PUBLIC_APP_NAME=My Project
NEXT_PUBLIC_API_URL=https://api.production.com
NEXT_PUBLIC_ENABLE_DEBUG=false
```

## 📚 最佳实践

### 1. 代码组织
- 按功能模块组织组件
- 使用TypeScript严格模式
- 遵循统一的命名规范

### 2. 性能优化
- 使用React.memo优化重渲染
- 实现代码分割和懒加载
- 优化图片和静态资源

### 3. 可访问性
- 使用语义化HTML标签
- 提供键盘导航支持
- 确保颜色对比度符合标准

### 4. 国际化
- 所有文本都要支持多语言
- 考虑RTL语言支持
- 日期和数字格式本地化

### 5. 测试覆盖
- 组件单元测试 > 80%
- 关键业务逻辑集成测试
- E2E测试覆盖主要用户流程
