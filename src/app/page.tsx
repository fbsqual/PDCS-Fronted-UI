'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageToggle } from '@/components/language-toggle'
import { ChartDemo } from '@/components/charts/chart-demo'
import { DatabaseDemo } from '@/components/database-demo'

/**
 * 主页组件
 * 展示应用的主要功能和演示
 */
export default function HomePage() {
  const { t } = useTranslation()
  const [count, setCount] = useState(0)

  return (
    <div className="container-responsive py-8">
      {/* 页面头部 */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('welcome.title', 'PDCS-UI')}
          </h1>
          <p className="text-muted-foreground">
            {t('welcome.description', '基于Next.js和Tailwind的现代化前端应用')}
          </p>
        </div>
        
        {/* 工具栏 */}
        <div className="flex items-center space-x-2">
          <Link href="/demo">
            <Button variant="outline">
              {t('nav.demo', '组件展示')}
            </Button>
          </Link>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>

      {/* 功能演示区域 */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* 计数器演示 */}
        <Card>
          <CardHeader>
            <CardTitle>{t('demo.counter.title', '计数器演示')}</CardTitle>
            <CardDescription>
              {t('demo.counter.description', '展示React状态管理')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">{count}</div>
              <p className="text-sm text-muted-foreground">
                {t('demo.counter.current', '当前计数')}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={() => setCount(count + 1)}
                className="flex-1"
              >
                {t('demo.counter.increment', '增加')}
              </Button>
              <Button 
                variant="outline"
                onClick={() => setCount(count - 1)}
                className="flex-1"
              >
                {t('demo.counter.decrement', '减少')}
              </Button>
              <Button 
                variant="secondary"
                onClick={() => setCount(0)}
              >
                {t('demo.counter.reset', '重置')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 主题演示 */}
        <Card>
          <CardHeader>
            <CardTitle>{t('demo.theme.title', '主题系统')}</CardTitle>
            <CardDescription>
              {t('demo.theme.description', '支持亮色/暗色模式切换')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="h-8 rounded bg-primary"></div>
              <div className="h-8 rounded bg-secondary"></div>
              <div className="h-8 rounded bg-accent"></div>
              <div className="h-8 rounded bg-muted"></div>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('demo.theme.colors', '主题颜色展示')}
            </p>
          </CardContent>
        </Card>

        {/* 国际化演示 */}
        <Card>
          <CardHeader>
            <CardTitle>{t('demo.i18n.title', '国际化')}</CardTitle>
            <CardDescription>
              {t('demo.i18n.description', '支持多语言切换')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">中文：</span>
                你好，世界！
              </p>
              <p className="text-sm">
                <span className="font-medium">English：</span>
                Hello, World!
              </p>
              <p className="text-sm">
                <span className="font-medium">日本語：</span>
                こんにちは、世界！
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 图表演示 */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('demo.charts.title', '图表演示')}</CardTitle>
            <CardDescription>
              {t('demo.charts.description', '集成多种图表组件')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartDemo />
          </CardContent>
        </Card>
      </div>

      {/* 数据库演示 */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('demo.database.title', '本地数据库')}</CardTitle>
            <CardDescription>
              {t('demo.database.description', 'SQLite本地存储演示')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DatabaseDemo />
          </CardContent>
        </Card>
      </div>

      {/* 页脚信息 */}
      <footer className="mt-16 border-t pt-8">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <p className="text-sm text-muted-foreground">
            {t('footer.copyright', '© 2024 PDCS Frontend. All rights reserved.')}
          </p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>Next.js 14</span>
            <span>•</span>
            <span>React 18</span>
            <span>•</span>
            <span>TypeScript</span>
            <span>•</span>
            <span>Tailwind CSS</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
