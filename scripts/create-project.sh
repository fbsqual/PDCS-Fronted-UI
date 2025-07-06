#!/bin/bash

# PDCS Framework 项目创建脚本
# 使用方法: ./create-project.sh <project-name>

PROJECT_NAME=$1

if [ -z "$PROJECT_NAME" ]; then
    echo "❌ 请提供项目名称"
    echo "使用方法: ./create-project.sh <project-name>"
    exit 1
fi

echo "🚀 创建新项目: $PROJECT_NAME"

# 1. 创建项目目录
mkdir "$PROJECT_NAME"
cd "$PROJECT_NAME"

# 2. 初始化Next.js项目
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 3. 安装PDCS UI框架依赖
echo "📦 安装PDCS UI框架依赖..."
npm install @your-org/pdcs-ui
npm install next-themes react-i18next i18next i18next-browser-languagedetector
npm install recharts tailwind-merge class-variance-authority
npm install @radix-ui/react-slot @radix-ui/react-dropdown-menu
npm install lucide-react

# 4. 安装开发依赖
npm install -D @types/node

# 5. 创建基础配置文件
echo "⚙️ 创建配置文件..."

# Tailwind配置
cat > tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './node_modules/@your-org/pdcs-ui/dist/**/*.js'
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
EOF

# 6. 创建基础布局
mkdir -p src/app
cat > src/app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider, I18nProvider } from '@your-org/pdcs-ui'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PROJECT_NAME',
  description: 'Built with PDCS UI Framework',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
EOF

# 替换项目名称
sed -i "s/PROJECT_NAME/$PROJECT_NAME/g" src/app/layout.tsx

# 7. 创建示例页面
cat > src/app/page.tsx << 'EOF'
'use client'

import { Button, Card, CardContent, CardHeader, CardTitle, ThemeToggle, LanguageToggle } from '@your-org/pdcs-ui'

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">PROJECT_NAME</h1>
        <div className="flex gap-4">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>欢迎使用 PDCS UI Framework</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">您的项目已成功创建！</p>
          <Button>开始开发</Button>
        </CardContent>
      </Card>
    </main>
  )
}
EOF

# 替换项目名称
sed -i "s/PROJECT_NAME/$PROJECT_NAME/g" src/app/page.tsx

echo "✅ 项目 $PROJECT_NAME 创建完成！"
echo ""
echo "🚀 下一步:"
echo "  cd $PROJECT_NAME"
echo "  npm run dev"
echo ""
echo "📚 访问 http://localhost:3000 查看您的项目"
