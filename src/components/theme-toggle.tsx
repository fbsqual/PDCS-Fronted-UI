'use client'

import * as React from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/**
 * 主题选项配置
 */
const themeOptions = [
  {
    value: 'light',
    label: 'demo.theme.light',
    icon: Sun,
  },
  {
    value: 'dark', 
    label: 'demo.theme.dark',
    icon: Moon,
  },
  {
    value: 'system',
    label: 'demo.theme.system',
    icon: Monitor,
  },
] as const

/**
 * 主题切换组件
 * 提供亮色/暗色/系统主题切换功能
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation()
  const [mounted, setMounted] = React.useState(false)

  // 确保组件在客户端挂载后再渲染，避免水合不匹配
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="h-8 w-8 px-0">
        <div className="h-4 w-4" />
        <span className="sr-only">Loading theme toggle</span>
      </Button>
    )
  }

  // 获取当前主题图标
  const getCurrentThemeIcon = () => {
    const currentOption = themeOptions.find(option => option.value === theme)
    const IconComponent = currentOption?.icon || Sun
    return <IconComponent className="h-4 w-4" />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 px-0"
          title={t('demo.theme.title', '主题切换')}
        >
          {getCurrentThemeIcon()}
          <span className="sr-only">{t('demo.theme.title', '主题切换')}</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {themeOptions.map((option) => {
          const IconComponent = option.icon
          const isActive = theme === option.value
          
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={`flex items-center gap-2 ${
                isActive ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <IconComponent className="h-4 w-4" />
              <span className="text-sm">
                {t(option.label, option.value)}
              </span>
              {isActive && (
                <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
