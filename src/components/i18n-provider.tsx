'use client'

import { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'

/**
 * 国际化提供者组件属性
 */
interface I18nProviderProps {
  children: React.ReactNode
}

/**
 * 国际化提供者组件
 * 为应用提供国际化功能支持
 */
export function I18nProvider({ children }: I18nProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // 等待i18n初始化完成
    const initI18n = async () => {
      try {
        // 如果i18n还未初始化，等待初始化完成
        if (!i18n.isInitialized) {
          await i18n.init()
        }
        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize i18n:', error)
        // 即使初始化失败，也要设置为已初始化，避免无限等待
        setIsInitialized(true)
      }
    }

    initI18n()

    // 监听语言变化事件
    const handleLanguageChange = (event: CustomEvent) => {
      console.log('Language changed to:', event.detail.language)
    }

    window.addEventListener('languageChanged', handleLanguageChange as EventListener)

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener)
    }
  }, [])

  // 在i18n初始化完成前显示加载状态
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  )
}
