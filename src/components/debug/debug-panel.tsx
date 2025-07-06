'use client'

import React, { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'

/**
 * 调试面板组件
 * 提供系统状态监控和调试信息显示
 */
export function DebugPanel() {
  const { theme, setTheme } = useTheme()
  const { t, i18n } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [systemInfo, setSystemInfo] = useState({
    userAgent: '',
    language: '',
    screenSize: '',
    timestamp: '',
  })

  useEffect(() => {
    // 更新系统信息
    const updateSystemInfo = () => {
      setSystemInfo({
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        timestamp: new Date().toLocaleString(),
      })
    }

    updateSystemInfo()
    const interval = setInterval(updateSystemInfo, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        title="打开调试面板"
      >
        🐛
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          调试面板
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">主题:</span>
          <span className="ml-2 text-gray-600 dark:text-gray-400">{theme}</span>
        </div>
        
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">语言:</span>
          <span className="ml-2 text-gray-600 dark:text-gray-400">{i18n.language}</span>
        </div>
        
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">屏幕:</span>
          <span className="ml-2 text-gray-600 dark:text-gray-400">{systemInfo.screenSize}</span>
        </div>
        
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">时间:</span>
          <span className="ml-2 text-gray-600 dark:text-gray-400">{systemInfo.timestamp}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
        <div className="flex gap-2">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            切换主题
          </button>
          
          <button
            onClick={() => i18n.changeLanguage(i18n.language === 'zh-CN' ? 'en' : 'zh-CN')}
            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            切换语言
          </button>
        </div>
      </div>
    </div>
  )
}
