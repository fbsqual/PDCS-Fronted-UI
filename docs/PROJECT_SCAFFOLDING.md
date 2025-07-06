# 📋 项目脚手架工具使用指南

PDCS-Fronted-UI 框架提供了强大的项目脚手架工具，帮助您快速创建基于框架的新项目，并确保项目能够安全地与框架同步更新。

## 🚀 快速开始

### 1. 使用增强版项目创建器

```bash
# 创建完整功能项目
./scripts/create-project-enhanced.sh my-awesome-app --template full --git-init

# 创建最小化项目
./scripts/create-project-enhanced.sh my-minimal-app --template minimal

# 创建仅组件库项目
./scripts/create-project-enhanced.sh my-components --template components-only
```

### 2. Windows PowerShell 用户

```powershell
# 使用Node.js运行脚本
node scripts/create-project.js my-app --template full
```

## 📋 模板类型说明

### 🏗️ Full Template (完整模板)
包含PDCS-Fronted-UI框架的所有功能和特性：

**功能特性：**
- ✅ 完整的Next.js应用结构
- ✅ 主题系统（亮色/暗色切换）
- ✅ 国际化支持（多语言）
- ✅ 图表组件库
- ✅ 本地数据库（SQLite + IndexedDB）
- ✅ PWA支持
- ✅ 测试框架
- ✅ 调试UI组件
- ✅ 完整的文档和示例

**适用场景：**
- 新的Web应用项目
- 需要完整功能的企业级应用
- 学习和探索框架功能

### 🎯 Minimal Template (最小化模板)
包含基础功能的轻量级版本：

**功能特性：**
- ✅ Next.js基础结构
- ✅ 核心UI组件
- ✅ 主题系统
- ✅ 基础配置文件
- ❌ 图表组件
- ❌ 数据库功能
- ❌ PWA功能

**适用场景：**
- 简单的展示网站
- 快速原型开发
- 自定义功能需求

### 📦 Components Only Template (仅组件库)
专门用于组件库开发：

**功能特性：**
- ✅ 组件库构建配置
- ✅ TypeScript支持
- ✅ Rollup打包配置
- ✅ NPM发布准备
- ❌ Next.js应用结构
- ❌ 页面和路由

**适用场景：**
- 开发独立的组件库
- 为其他项目提供组件
- 组件库维护和发布

## ⚙️ 配置选项

### 命令行参数

```bash
./scripts/create-project-enhanced.sh <project-name> [options]
```

**可用选项：**

| 选项 | 描述 | 默认值 | 示例 |
|------|------|--------|------|
| `--template <type>` | 项目模板类型 | `full` | `--template minimal` |
| `--package-manager <pm>` | 包管理器 | `npm` | `--package-manager yarn` |
| `--git-init` | 初始化Git仓库 | `false` | `--git-init` |
| `--no-install` | 跳过依赖安装 | `false` | `--no-install` |
| `--help` | 显示帮助信息 | - | `--help` |

### 使用示例

```bash
# 完整功能项目，使用yarn，初始化Git
./scripts/create-project-enhanced.sh my-app \
  --template full \
  --package-manager yarn \
  --git-init

# 最小化项目，跳过依赖安装
./scripts/create-project-enhanced.sh quick-start \
  --template minimal \
  --no-install

# 组件库项目，使用pnpm
./scripts/create-project-enhanced.sh ui-components \
  --template components-only \
  --package-manager pnpm
```

## 🔧 项目配置文件

### .pdcs-config.json
每个创建的项目都包含框架配置文件：

```json
{
  "name": "my-project",
  "framework": "PDCS-Fronted-UI",
  "framework_version": "1.0.0",
  "template": "full",
  "created_at": "2024-01-01T00:00:00Z",
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
  },
  "customizations": {
    "components": [],
    "styles": [],
    "configs": []
  }
}
```

**配置说明：**
- `sync.enabled`: 是否启用框架同步
- `sync.auto_check`: 是否自动检查更新
- `sync.check_interval`: 检查更新频率
- `features`: 启用的功能模块
- `customizations`: 自定义修改记录

## 🔄 框架同步机制

### 自动同步脚本
每个项目都包含同步脚本：

```bash
# 检查框架更新
npm run sync:check

# 更新框架到最新版本
npm run sync:update

# 更新到指定版本
node scripts/project-updater.js update 1.2.0
```

### 同步流程

1. **检查更新**
   - 对比当前版本与最新版本
   - 分析更新类型（major/minor/patch）
   - 检测破坏性更改

2. **创建备份**
   - 备份关键配置文件
   - 备份自定义组件和样式
   - 创建回滚点

3. **执行更新**
   - 更新框架包版本
   - 运行迁移脚本
   - 更新配置文件

4. **验证更新**
   - 运行测试套件
   - 检查构建状态
   - 验证功能完整性

5. **回滚机制**
   - 更新失败时自动回滚
   - 恢复备份文件
   - 保持项目稳定性

## 📚 项目结构

### Full Template 结构
```
my-project/
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/             # React组件
│   │   ├── ui/                 # UI组件库
│   │   ├── theme-provider.tsx  # 主题提供者
│   │   └── i18n-provider.tsx   # 国际化提供者
│   ├── lib/                    # 工具库
│   ├── hooks/                  # 自定义Hooks
│   ├── stores/                 # 状态管理
│   └── types/                  # TypeScript类型
├── public/                     # 静态资源
├── scripts/                    # 工具脚本
│   ├── project-updater.js      # 项目更新器
│   └── sync-framework.js       # 同步脚本
├── .pdcs-config.json          # 框架配置
├── next.config.js             # Next.js配置
├── tailwind.config.ts         # Tailwind配置
└── package.json               # 项目配置
```

### Minimal Template 结构
```
my-minimal-project/
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/             # 基础组件
│   │   └── ui/                 # UI组件
│   └── lib/                    # 工具库
├── scripts/                    # 同步脚本
├── .pdcs-config.json          # 框架配置
└── package.json               # 项目配置
```

### Components Only 结构
```
my-components/
├── src/
│   ├── components/             # 组件源码
│   ├── lib/                    # 工具函数
│   └── index.ts                # 入口文件
├── dist/                       # 构建输出
├── scripts/                    # 构建脚本
├── rollup.config.js           # 打包配置
├── tsconfig.json              # TypeScript配置
└── package.json               # 包配置
```

## 🧪 测试和验证

### 创建后验证
```bash
cd my-project

# 安装依赖（如果跳过了自动安装）
npm install

# 运行开发服务器
npm run dev

# 运行测试
npm test

# 构建项目
npm run build
```

### 同步功能测试
```bash
# 测试同步检查
npm run sync:check

# 测试配置文件
cat .pdcs-config.json

# 验证脚本存在
ls scripts/
```

## 🔍 故障排除

### 常见问题

**1. 创建失败**
```bash
# 检查Node.js版本
node --version  # 需要 >= 18.0.0

# 检查网络连接
npm ping

# 清理npm缓存
npm cache clean --force
```

**2. 依赖安装失败**
```bash
# 删除node_modules重新安装
rm -rf node_modules package-lock.json
npm install

# 或使用yarn
yarn install
```

**3. 同步脚本错误**
```bash
# 检查配置文件
cat .pdcs-config.json

# 手动运行更新器
node scripts/project-updater.js check
```

### 获取帮助

1. **查看日志**
   - 检查控制台输出
   - 查看错误堆栈信息

2. **检查配置**
   - 验证.pdcs-config.json格式
   - 确认package.json脚本

3. **社区支持**
   - [GitHub Issues](https://github.com/fbsqual/PDCS-Fronted-UI/issues)
   - [讨论区](https://github.com/fbsqual/PDCS-Fronted-UI/discussions)
   - [文档Wiki](https://github.com/fbsqual/PDCS-Fronted-UI/wiki)

## 📈 最佳实践

### 1. 项目命名
- 使用小写字母和连字符
- 避免特殊字符和空格
- 保持名称简洁明了

### 2. 模板选择
- 新项目优先选择`full`模板
- 简单需求使用`minimal`模板
- 组件开发使用`components-only`模板

### 3. 版本管理
- 定期检查框架更新
- 在更新前创建Git分支
- 测试更新后再合并到主分支

### 4. 自定义开发
- 记录自定义修改
- 使用框架提供的扩展点
- 避免直接修改框架文件

---

通过这个脚手架工具，您可以快速创建基于PDCS-Fronted-UI框架的项目，并确保项目能够安全地与框架保持同步更新。
