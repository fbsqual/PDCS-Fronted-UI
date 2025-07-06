# {{PROJECT_NAME}}

基于 [PDCS-Fronted-UI](https://github.com/fbsqual/PDCS-Fronted-UI) 框架构建的现代化Web应用。

## 🚀 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📋 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行ESLint检查
- `npm run type-check` - 运行TypeScript类型检查
- `npm run test` - 运行测试
- `npm run test:watch` - 监视模式运行测试

### 框架同步脚本

- `npm run sync:check` - 检查框架更新
- `npm run sync:update` - 更新框架到最新版本
- `npm run migrate` - 运行迁移脚本
- `npm run migrate:rollback` - 回滚迁移

## 🏗️ 项目结构

```
{{PROJECT_NAME}}/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css         # 全局样式
│   │   ├── layout.tsx          # 根布局
│   │   └── page.tsx            # 首页
│   ├── components/             # React组件
│   │   ├── ui/                 # UI组件库
│   │   ├── theme-provider.tsx  # 主题提供者
│   │   └── i18n-provider.tsx   # 国际化提供者
│   ├── lib/                    # 工具库
│   │   ├── utils.ts            # 通用工具函数
│   │   ├── i18n.ts             # 国际化配置
│   │   └── database.ts         # 数据库配置
│   ├── hooks/                  # 自定义Hooks
│   ├── stores/                 # 状态管理
│   └── types/                  # TypeScript类型定义
├── public/                     # 静态资源
├── scripts/                    # 构建和工具脚本
├── .pdcs-config.json          # PDCS框架配置
├── next.config.js             # Next.js配置
├── tailwind.config.ts         # Tailwind CSS配置
└── tsconfig.json              # TypeScript配置
```

## 🎨 功能特性

### 🌈 主题系统
- 支持亮色/暗色主题切换
- 自定义主题配置
- CSS变量驱动的主题系统

### 🌍 国际化 (i18n)
- 多语言支持
- 动态语言切换
- 本地化资源管理

### 📊 图表组件
- 基于Recharts的图表库
- 响应式图表设计
- 多种图表类型支持

### 💾 本地存储
- IndexedDB数据存储
- SQLite本地数据库
- 离线数据同步

### 📱 PWA支持
- 渐进式Web应用
- 离线功能
- 应用安装支持

### 🧪 测试框架
- Jest单元测试
- React Testing Library
- 组件测试覆盖

## 🔧 配置说明

### 环境变量

创建 `.env.local` 文件并配置以下变量：

```env
# 应用配置
NEXT_PUBLIC_APP_NAME={{PROJECT_NAME}}
NEXT_PUBLIC_APP_VERSION=1.0.0

# 数据库配置
NEXT_PUBLIC_DB_NAME={{PROJECT_NAME}}_db

# API配置
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# 调试配置
NEXT_PUBLIC_DEBUG=false
```

### 框架配置

`.pdcs-config.json` 文件包含框架相关配置：

```json
{
  "name": "{{PROJECT_NAME}}",
  "framework": "PDCS-Fronted-UI",
  "framework_version": "{{FRAMEWORK_VERSION}}",
  "template": "{{TEMPLATE}}",
  "sync": {
    "enabled": true,
    "auto_check": true,
    "check_interval": "weekly"
  },
  "features": {
    "i18n": true,
    "themes": true,
    "charts": true,
    "database": true,
    "pwa": true
  }
}
```

## 🔄 框架更新

### 检查更新

```bash
npm run sync:check
```

### 更新框架

```bash
# 更新到最新版本
npm run sync:update

# 更新到指定版本
node scripts/project-updater.js update 1.2.0

# 强制更新（包括主版本）
node scripts/project-updater.js update --force
```

### 迁移指南

当框架有重大更新时，请查看：
1. [变更日志](https://github.com/fbsqual/PDCS-Fronted-UI/blob/main/CHANGELOG.md)
2. [迁移指南](https://github.com/fbsqual/PDCS-Fronted-UI/blob/main/MIGRATION.md)
3. 运行迁移脚本：`npm run migrate`

## 🧪 测试

### 运行测试

```bash
# 运行所有测试
npm test

# 监视模式
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

### 测试结构

```
src/
├── __tests__/              # 测试文件
│   ├── components/         # 组件测试
│   ├── hooks/              # Hooks测试
│   └── utils/              # 工具函数测试
└── test-utils.tsx          # 测试工具
```

## 📚 开发指南

### 添加新组件

1. 在 `src/components/` 目录下创建组件文件
2. 使用PDCS UI组件库作为基础
3. 添加对应的测试文件
4. 更新组件导出

### 自定义主题

1. 修改 `tailwind.config.ts` 中的主题配置
2. 更新CSS变量定义
3. 测试主题切换功能

### 添加新页面

1. 在 `src/app/` 目录下创建页面文件
2. 使用布局组件包装页面内容
3. 添加页面级别的SEO配置

## 🔗 相关链接

- [PDCS-Fronted-UI 文档](https://github.com/fbsqual/PDCS-Fronted-UI#readme)
- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [React 文档](https://react.dev)

## 📄 许可证

本项目基于 MIT 许可证开源。详见 [LICENSE](LICENSE) 文件。

## 🤝 贡献

欢迎提交Issue和Pull Request来改进项目！

## 📞 支持

如果遇到问题，请：
1. 查看[常见问题](https://github.com/fbsqual/PDCS-Fronted-UI/wiki/FAQ)
2. 搜索[已有Issue](https://github.com/fbsqual/PDCS-Fronted-UI/issues)
3. 创建[新Issue](https://github.com/fbsqual/PDCS-Fronted-UI/issues/new)

---

由 [PDCS-Fronted-UI](https://github.com/fbsqual/PDCS-Fronted-UI) 框架强力驱动 ⚡
