#!/bin/bash

# PDCS-Fronted-UI 增强项目创建脚本
# 用于基于当前框架快速创建新项目，支持多种模板和配置选项

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 显示帮助信息
show_help() {
    echo -e "${CYAN}🚀 PDCS-Fronted-UI 项目创建工具${NC}"
    echo ""
    echo -e "${YELLOW}使用方法:${NC}"
    echo "  ./scripts/create-project-enhanced.sh <project-name> [options]"
    echo ""
    echo -e "${YELLOW}选项:${NC}"
    echo "  --template <type>    项目模板类型 (full|minimal|components-only)"
    echo "  --package-manager    包管理器 (npm|yarn|pnpm)"
    echo "  --git-init          初始化Git仓库"
    echo "  --install-deps      自动安装依赖"
    echo "  --help              显示此帮助信息"
    echo ""
    echo -e "${YELLOW}模板说明:${NC}"
    echo "  full            完整框架 (包含所有功能和示例)"
    echo "  minimal         最小化版本 (基础组件和配置)"
    echo "  components-only 仅组件库 (不包含应用结构)"
    echo ""
    echo -e "${YELLOW}示例:${NC}"
    echo "  ./scripts/create-project-enhanced.sh my-app --template full --git-init"
    echo "  ./scripts/create-project-enhanced.sh my-components --template components-only"
}

# 默认配置
PROJECT_NAME=""
TEMPLATE="full"
PACKAGE_MANAGER="npm"
GIT_INIT=false
INSTALL_DEPS=true
FRAMEWORK_VERSION="latest"

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        --template)
            TEMPLATE="$2"
            shift 2
            ;;
        --package-manager)
            PACKAGE_MANAGER="$2"
            shift 2
            ;;
        --git-init)
            GIT_INIT=true
            shift
            ;;
        --no-install)
            INSTALL_DEPS=false
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        -*)
            echo -e "${RED}❌ 未知选项: $1${NC}"
            show_help
            exit 1
            ;;
        *)
            if [ -z "$PROJECT_NAME" ]; then
                PROJECT_NAME="$1"
            else
                echo -e "${RED}❌ 多余的参数: $1${NC}"
                exit 1
            fi
            shift
            ;;
    esac
done

# 检查项目名称
if [ -z "$PROJECT_NAME" ]; then
    echo -e "${RED}❌ 请提供项目名称${NC}"
    show_help
    exit 1
fi

# 验证项目名称
if [[ ! "$PROJECT_NAME" =~ ^[a-zA-Z0-9_-]+$ ]]; then
    echo -e "${RED}❌ 项目名称只能包含字母、数字、下划线和连字符${NC}"
    exit 1
fi

# 检查目录是否已存在
if [ -d "$PROJECT_NAME" ]; then
    echo -e "${RED}❌ 目录 '$PROJECT_NAME' 已存在${NC}"
    exit 1
fi

# 验证模板类型
case $TEMPLATE in
    full|minimal|components-only)
        ;;
    *)
        echo -e "${RED}❌ 无效的模板类型: $TEMPLATE${NC}"
        echo -e "${YELLOW}支持的模板: full, minimal, components-only${NC}"
        exit 1
        ;;
esac

# 验证包管理器
case $PACKAGE_MANAGER in
    npm|yarn|pnpm)
        ;;
    *)
        echo -e "${RED}❌ 无效的包管理器: $PACKAGE_MANAGER${NC}"
        echo -e "${YELLOW}支持的包管理器: npm, yarn, pnpm${NC}"
        exit 1
        ;;
esac

echo -e "${CYAN}🚀 创建新项目: ${GREEN}$PROJECT_NAME${NC}"
echo -e "${BLUE}📋 配置信息:${NC}"
echo -e "  模板类型: ${YELLOW}$TEMPLATE${NC}"
echo -e "  包管理器: ${YELLOW}$PACKAGE_MANAGER${NC}"
echo -e "  Git初始化: ${YELLOW}$GIT_INIT${NC}"
echo -e "  自动安装依赖: ${YELLOW}$INSTALL_DEPS${NC}"
echo ""

# 获取当前框架版本
get_framework_version() {
    if [ -f "package.json" ]; then
        FRAMEWORK_VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "latest")
    fi
}

get_framework_version

# 创建项目目录
echo -e "${BLUE}📁 创建项目目录...${NC}"
mkdir "$PROJECT_NAME"
cd "$PROJECT_NAME"

# 根据模板类型创建项目
case $TEMPLATE in
    "full")
        create_full_project
        ;;
    "minimal")
        create_minimal_project
        ;;
    "components-only")
        create_components_only_project
        ;;
esac

# 创建完整项目
create_full_project() {
    echo -e "${BLUE}🏗️ 创建完整项目...${NC}"
    
    # 初始化Next.js项目
    npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
    
    # 安装PDCS框架依赖
    install_framework_dependencies
    
    # 复制框架文件
    copy_framework_files "full"
    
    # 创建配置文件
    create_config_files
    
    # 创建示例页面
    create_example_pages
}

# 创建最小化项目
create_minimal_project() {
    echo -e "${BLUE}🏗️ 创建最小化项目...${NC}"
    
    # 初始化Next.js项目
    npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
    
    # 安装基础依赖
    install_minimal_dependencies
    
    # 复制基础文件
    copy_framework_files "minimal"
    
    # 创建基础配置
    create_minimal_config
}

# 创建仅组件库项目
create_components_only_project() {
    echo -e "${BLUE}🏗️ 创建组件库项目...${NC}"
    
    # 初始化基础项目结构
    npm init -y
    
    # 安装组件库依赖
    install_components_dependencies
    
    # 复制组件文件
    copy_framework_files "components-only"
    
    # 创建组件库配置
    create_components_config
}

# 安装框架依赖
install_framework_dependencies() {
    echo -e "${BLUE}📦 安装PDCS-Fronted-UI框架依赖...${NC}"
    
    local deps=(
        "@fbsqual/pdcs-fronted-ui@$FRAMEWORK_VERSION"
        "next-themes"
        "react-i18next"
        "i18next"
        "i18next-browser-languagedetector"
        "recharts"
        "tailwind-merge"
        "class-variance-authority"
        "@radix-ui/react-slot"
        "@radix-ui/react-dropdown-menu"
        "lucide-react"
        "localforage"
        "sql.js"
        "zustand"
    )
    
    local dev_deps=(
        "@types/node"
        "@testing-library/react"
        "@testing-library/jest-dom"
        "@testing-library/user-event"
        "jest"
        "jest-environment-jsdom"
        "@types/jest"
        "ts-jest"
    )
    
    if [ "$INSTALL_DEPS" = true ]; then
        case $PACKAGE_MANAGER in
            npm)
                npm install "${deps[@]}"
                npm install -D "${dev_deps[@]}"
                ;;
            yarn)
                yarn add "${deps[@]}"
                yarn add -D "${dev_deps[@]}"
                ;;
            pnpm)
                pnpm add "${deps[@]}"
                pnpm add -D "${dev_deps[@]}"
                ;;
        esac
    else
        echo -e "${YELLOW}⏭️ 跳过依赖安装，请稍后手动安装${NC}"
    fi
}

# 安装最小化依赖
install_minimal_dependencies() {
    echo -e "${BLUE}📦 安装基础依赖...${NC}"
    
    local deps=(
        "@fbsqual/pdcs-fronted-ui@$FRAMEWORK_VERSION"
        "next-themes"
        "tailwind-merge"
        "class-variance-authority"
        "lucide-react"
    )
    
    if [ "$INSTALL_DEPS" = true ]; then
        case $PACKAGE_MANAGER in
            npm)
                npm install "${deps[@]}"
                ;;
            yarn)
                yarn add "${deps[@]}"
                ;;
            pnpm)
                pnpm add "${deps[@]}"
                ;;
        esac
    fi
}

# 安装组件库依赖
install_components_dependencies() {
    echo -e "${BLUE}📦 安装组件库依赖...${NC}"
    
    # 创建package.json
    cat > package.json << EOF
{
  "name": "$PROJECT_NAME",
  "version": "1.0.0",
  "description": "Components library based on PDCS-Fronted-UI",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "test": "jest",
    "lint": "eslint src --ext .ts,.tsx"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  }
}
EOF
    
    local deps=(
        "@fbsqual/pdcs-fronted-ui@$FRAMEWORK_VERSION"
        "tailwind-merge"
        "class-variance-authority"
        "lucide-react"
    )
    
    local dev_deps=(
        "@types/react"
        "@types/react-dom"
        "typescript"
        "rollup"
        "@rollup/plugin-typescript"
        "@rollup/plugin-node-resolve"
        "@rollup/plugin-commonjs"
        "rollup-plugin-peer-deps-external"
    )
    
    if [ "$INSTALL_DEPS" = true ]; then
        case $PACKAGE_MANAGER in
            npm)
                npm install "${deps[@]}"
                npm install -D "${dev_deps[@]}"
                ;;
            yarn)
                yarn add "${deps[@]}"
                yarn add -D "${dev_deps[@]}"
                ;;
            pnpm)
                pnpm add "${deps[@]}"
                pnpm add -D "${dev_deps[@]}"
                ;;
        esac
    fi
}

# 复制框架文件
copy_framework_files() {
    local template_type=$1
    echo -e "${BLUE}📋 复制框架文件 ($template_type)...${NC}"

    case $template_type in
        "full")
            # 复制完整的源代码结构
            if [ -d "../src" ]; then
                cp -r ../src ./
                cp -r ../public ./
                cp ../next.config.js ./
                cp ../tailwind.config.ts ./
                cp ../tsconfig.json ./
                cp ../.env.example ./.env.local
            fi
            ;;
        "minimal")
            # 复制基础组件和配置
            mkdir -p src/components src/lib src/styles
            if [ -d "../src/components/ui" ]; then
                cp -r ../src/components/ui src/components/
            fi
            if [ -d "../src/lib" ]; then
                cp -r ../src/lib src/
            fi
            ;;
        "components-only")
            # 仅复制组件库文件
            mkdir -p src/components src/lib
            if [ -d "../lib/src" ]; then
                cp -r ../lib/src/* src/
            fi
            ;;
    esac
}

# 创建配置文件
create_config_files() {
    echo -e "${BLUE}⚙️ 创建配置文件...${NC}"

    # 更新package.json
    if [ -f "package.json" ]; then
        node -e "
            const pkg = JSON.parse(require('fs').readFileSync('package.json', 'utf8'));
            pkg.name = '$PROJECT_NAME';
            pkg.description = 'Project based on PDCS-Fronted-UI framework';
            pkg.scripts = {
                ...pkg.scripts,
                'sync:check': 'node scripts/sync-framework.js check',
                'sync:update': 'node scripts/sync-framework.js update',
                'version:update': 'node scripts/version-manager.js update',
                'migrate': 'node scripts/migration-runner.js run',
                'migrate:rollback': 'node scripts/migration-runner.js rollback'
            };
            require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));
        "
    fi

    # 创建版本管理配置
    create_version_config

    # 创建更新同步脚本
    create_sync_script
}

# 创建版本配置
create_version_config() {
    cat > .pdcs-config.json << EOF
{
  "name": "$PROJECT_NAME",
  "framework": "PDCS-Fronted-UI",
  "framework_version": "$FRAMEWORK_VERSION",
  "template": "$TEMPLATE",
  "created_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
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
EOF
}

# 创建同步脚本
create_sync_script() {
    mkdir -p scripts

    # 复制项目更新器
    if [ -f "../scripts/project-updater.js" ]; then
        cp ../scripts/project-updater.js scripts/
        chmod +x scripts/project-updater.js
    fi

    # 创建简化的同步脚本
    cat > scripts/sync-framework.js << 'EOF'
#!/usr/bin/env node

/**
 * PDCS-Fronted-UI 框架同步脚本
 * 简化版本，调用主更新器
 */

const ProjectUpdater = require('./project-updater');

const args = process.argv.slice(2);
const command = args[0];

(async () => {
  const updater = new ProjectUpdater();

  try {
    switch (command) {
      case 'check':
        await updater.checkFrameworkUpdates();
        break;
      case 'update':
        const version = args[1] || 'latest';
        await updater.updateFramework(version);
        break;
      default:
        console.log(`
🔄 PDCS-Fronted-UI 框架同步工具

使用方法:
  npm run sync:check    # 检查更新
  npm run sync:update   # 更新框架
        `);
    }
  } catch (error) {
    console.error('❌ 执行失败:', error.message);
    process.exit(1);
  }
})();
EOF

    chmod +x scripts/sync-framework.js
}

# 创建最小化配置
create_minimal_config() {
    echo -e "${BLUE}⚙️ 创建最小化配置...${NC}"

    # 更新package.json
    if [ -f "package.json" ]; then
        node -e "
            const pkg = JSON.parse(require('fs').readFileSync('package.json', 'utf8'));
            pkg.name = '$PROJECT_NAME';
            pkg.description = 'Minimal project based on PDCS-Fronted-UI framework';
            pkg.scripts = {
                ...pkg.scripts,
                'sync:check': 'node scripts/sync-framework.js check',
                'sync:update': 'node scripts/sync-framework.js update'
            };
            require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));
        "
    fi

    # 创建基础配置
    create_version_config
    create_sync_script
}

# 创建组件库配置
create_components_config() {
    echo -e "${BLUE}⚙️ 创建组件库配置...${NC}"

    # 创建Rollup配置
    cat > rollup.config.js << 'EOF'
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
  ],
};
EOF

    # 创建TypeScript配置
    cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false,
    "jsx": "react-jsx",
    "declaration": true,
    "outDir": "dist"
  },
  "include": [
    "src"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
EOF

    # 创建入口文件
    mkdir -p src
    cat > src/index.ts << 'EOF'
// PDCS-Fronted-UI Components Library
// Export all components and utilities

export * from './components';
export * from './lib';
EOF

    create_version_config
}

# 创建示例页面
create_example_pages() {
    echo -e "${BLUE}📄 创建示例页面...${NC}"

    # 创建基础布局
    if [ ! -f "src/app/layout.tsx" ]; then
        mkdir -p src/app
        cat > src/app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { I18nProvider } from '@/components/i18n-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'My PDCS App',
    template: '%s | My PDCS App'
  },
  description: 'Built with PDCS-Fronted-UI Framework',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
EOF
    fi

    # 创建首页
    if [ ! -f "src/app/page.tsx" ]; then
        cat > src/app/page.tsx << 'EOF'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          欢迎使用 PDCS-Fronted-UI
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          现代化的React组件库和开发框架
        </p>
        <div className="flex gap-2 justify-center mb-8">
          <Badge variant="secondary">Next.js</Badge>
          <Badge variant="secondary">TypeScript</Badge>
          <Badge variant="secondary">Tailwind CSS</Badge>
          <Badge variant="secondary">React</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>🎨 主题系统</CardTitle>
            <CardDescription>
              支持亮色/暗色主题切换
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              切换主题
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🌍 国际化</CardTitle>
            <CardDescription>
              多语言支持和本地化
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              切换语言
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📊 图表组件</CardTitle>
            <CardDescription>
              丰富的数据可视化组件
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              查看图表
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">开始开发</h2>
        <p className="text-muted-foreground mb-6">
          编辑 <code className="bg-muted px-2 py-1 rounded">src/app/page.tsx</code> 开始构建你的应用
        </p>
        <div className="flex gap-4 justify-center">
          <Button>查看文档</Button>
          <Button variant="outline">示例代码</Button>
        </div>
      </div>
    </div>
  )
}
EOF
    fi
}

# Git初始化
init_git() {
    if [ "$GIT_INIT" = true ]; then
        echo -e "${BLUE}📝 初始化Git仓库...${NC}"
        git init

        # 创建.gitignore
        cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Production
/build
/.next/
/out/
/dist/

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Backup files
.backup-*
.migration-backups/
.update-backups/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
EOF

        git add .
        git commit -m "feat: initial commit with PDCS-Fronted-UI framework"

        echo -e "${GREEN}✅ Git仓库初始化完成${NC}"
    fi
}

# 显示完成信息
show_completion() {
    echo ""
    echo -e "${GREEN}🎉 项目创建完成!${NC}"
    echo ""
    echo -e "${CYAN}📋 项目信息:${NC}"
    echo -e "  名称: ${YELLOW}$PROJECT_NAME${NC}"
    echo -e "  模板: ${YELLOW}$TEMPLATE${NC}"
    echo -e "  框架版本: ${YELLOW}$FRAMEWORK_VERSION${NC}"
    echo -e "  包管理器: ${YELLOW}$PACKAGE_MANAGER${NC}"
    echo ""
    echo -e "${CYAN}🚀 下一步操作:${NC}"
    echo -e "  1. ${BLUE}cd $PROJECT_NAME${NC}"

    if [ "$INSTALL_DEPS" = false ]; then
        echo -e "  2. ${BLUE}$PACKAGE_MANAGER install${NC}"
        echo -e "  3. ${BLUE}$PACKAGE_MANAGER run dev${NC}"
    else
        echo -e "  2. ${BLUE}$PACKAGE_MANAGER run dev${NC}"
    fi

    echo ""
    echo -e "${CYAN}🔧 可用命令:${NC}"
    case $TEMPLATE in
        "full"|"minimal")
            echo -e "  ${BLUE}$PACKAGE_MANAGER run dev${NC}          # 启动开发服务器"
            echo -e "  ${BLUE}$PACKAGE_MANAGER run build${NC}        # 构建生产版本"
            echo -e "  ${BLUE}$PACKAGE_MANAGER run test${NC}         # 运行测试"
            echo -e "  ${BLUE}$PACKAGE_MANAGER run lint${NC}         # 代码检查"
            ;;
        "components-only")
            echo -e "  ${BLUE}$PACKAGE_MANAGER run build${NC}        # 构建组件库"
            echo -e "  ${BLUE}$PACKAGE_MANAGER run dev${NC}          # 监视模式构建"
            echo -e "  ${BLUE}$PACKAGE_MANAGER run test${NC}         # 运行测试"
            echo -e "  ${BLUE}$PACKAGE_MANAGER run lint${NC}         # 代码检查"
            ;;
    esac

    echo ""
    echo -e "${CYAN}📚 框架同步:${NC}"
    echo -e "  ${BLUE}$PACKAGE_MANAGER run sync:check${NC}   # 检查框架更新"
    echo -e "  ${BLUE}$PACKAGE_MANAGER run sync:update${NC}  # 更新框架"

    if [ "$TEMPLATE" = "full" ]; then
        echo ""
        echo -e "${CYAN}🔄 迁移工具:${NC}"
        echo -e "  ${BLUE}$PACKAGE_MANAGER run migrate${NC}          # 运行迁移脚本"
        echo -e "  ${BLUE}$PACKAGE_MANAGER run migrate:rollback${NC}  # 回滚迁移"
    fi

    echo ""
    echo -e "${CYAN}📖 相关资源:${NC}"
    echo -e "  ${PURPLE}📚 框架文档: https://github.com/fbsqual/PDCS-Fronted-UI${NC}"
    echo -e "  ${PURPLE}🐛 问题反馈: https://github.com/fbsqual/PDCS-Fronted-UI/issues${NC}"
    echo -e "  ${PURPLE}💬 讨论区: https://github.com/fbsqual/PDCS-Fronted-UI/discussions${NC}"

    if [ "$TEMPLATE" = "full" ]; then
        echo ""
        echo -e "${YELLOW}💡 提示:${NC}"
        echo -e "  - 查看 ${BLUE}README.md${NC} 了解详细使用说明"
        echo -e "  - 编辑 ${BLUE}.env.local${NC} 配置环境变量"
        echo -e "  - 修改 ${BLUE}.pdcs-config.json${NC} 自定义框架配置"
    fi
}

# 主执行流程
main() {
    # 根据模板类型创建项目
    case $TEMPLATE in
        "full")
            create_full_project
            ;;
        "minimal")
            create_minimal_project
            ;;
        "components-only")
            create_components_only_project
            ;;
    esac

    # Git初始化
    init_git

    # 显示完成信息
    show_completion
}

# 执行主函数
main
