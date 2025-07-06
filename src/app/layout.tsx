import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { I18nProvider } from '@/components/i18n-provider'
import { DebugPanel } from '@/components/debug/debug-panel'

// 字体配置
const inter = Inter({ subsets: ['latin'] })

// 元数据配置
export const metadata: Metadata = {
  title: {
    default: 'PDCS-Fronted-UI',
    template: '%s | PDCS-Fronted-UI'
  },
  description: '基于Next.js和Tailwind的现代化前端应用',
  keywords: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'PWA'],
  authors: [{ name: 'PDCS Team' }],
  creator: 'PDCS Team',
  publisher: 'PDCS Team',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // PWA配置
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PDCS Frontend',
  },
  // 图标配置
  icons: {
    icon: '/icons/icon-192x192.png',
    shortcut: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
  // 主题颜色
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  // 视口配置
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  // Open Graph配置
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://pdcs-frontend.com',
    title: 'PDCS Frontend',
    description: '基于Next.js和Tailwind的现代化前端应用',
    siteName: 'PDCS Frontend',
  },
  // Twitter配置
  twitter: {
    card: 'summary_large_image',
    title: 'PDCS Frontend',
    description: '基于Next.js和Tailwind的现代化前端应用',
  },
}

/**
 * 根布局组件
 * 提供全局的主题、国际化和调试功能
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* PWA相关meta标签 */}
        <meta name="application-name" content="PDCS Frontend" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PDCS Frontend" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* 预加载关键资源 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        {/* 主题提供者 - 支持亮色/暗色模式切换 */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* 国际化提供者 - 支持多语言 */}
          <I18nProvider>
            {/* 主要内容区域 */}
            <div className="min-h-screen bg-background font-sans antialiased">
              <div className="relative flex min-h-screen flex-col">
                {/* 页面内容 */}
                <main className="flex-1">
                  {children}
                </main>
              </div>
            </div>
            
            {/* 调试面板 - 仅在开发环境显示 */}
            {process.env.NODE_ENV === 'development' && <DebugPanel />}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
