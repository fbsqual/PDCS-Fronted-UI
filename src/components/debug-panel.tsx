'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { apiClient } from '@/lib/api/client'
import { 
  Bug, 
  X, 
  Minimize2, 
  Maximize2, 
  Activity, 
  Database, 
  Globe, 
  Settings,
  Monitor,
  Trash2,
  RefreshCw
} from 'lucide-react'

/**
 * 调试信息接口
 */
interface DebugInfo {
  timestamp: number
  type: 'api' | 'error' | 'performance' | 'system'
  message: string
  data?: any
  level: 'info' | 'warn' | 'error'
}

/**
 * 系统性能信息接口
 */
interface PerformanceInfo {
  memory: {
    used: number
    total: number
    percentage: number
  }
  timing: {
    domContentLoaded: number
    loadComplete: number
  }
  connection?: {
    effectiveType: string
    downlink: number
    rtt: number
  }
}

/**
 * 调试面板组件
 * 提供浮动的调试界面，监控系统状态和API请求
 */
export function DebugPanel() {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState<'logs' | 'api' | 'performance' | 'system'>('logs')
  const [debugLogs, setDebugLogs] = useState<DebugInfo[]>([])
  const [performanceInfo, setPerformanceInfo] = useState<PerformanceInfo | null>(null)
  const [position, setPosition] = useState({ x: 20, y: 20 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const panelRef = useRef<HTMLDivElement>(null)

  /**
   * 添加调试日志
   */
  const addDebugLog = (type: DebugInfo['type'], message: string, data?: any, level: DebugInfo['level'] = 'info') => {
    const log: DebugInfo = {
      timestamp: Date.now(),
      type,
      message,
      data,
      level
    }
    setDebugLogs(prev => [log, ...prev.slice(0, 99)]) // 保留最近100条记录
  }

  /**
   * 获取性能信息
   */
  const getPerformanceInfo = (): PerformanceInfo => {
    const memory = (performance as any).memory
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const connection = (navigator as any).connection

    return {
      memory: memory ? {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        percentage: Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100)
      } : { used: 0, total: 0, percentage: 0 },
      timing: {
        domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.navigationStart),
        loadComplete: Math.round(navigation.loadEventEnd - navigation.navigationStart)
      },
      connection: connection ? {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      } : undefined
    }
  }

  /**
   * 监听API请求
   */
  useEffect(() => {
    // 重写fetch以监听API请求
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const [url, options] = args
      const startTime = Date.now()
      
      try {
        const response = await originalFetch(...args)
        const endTime = Date.now()
        
        addDebugLog('api', `${options?.method || 'GET'} ${url}`, {
          status: response.status,
          statusText: response.statusText,
          duration: endTime - startTime,
          headers: Object.fromEntries(response.headers.entries())
        }, response.ok ? 'info' : 'error')
        
        return response
      } catch (error) {
        const endTime = Date.now()
        addDebugLog('api', `${options?.method || 'GET'} ${url} - Failed`, {
          error: (error as Error).message,
          duration: endTime - startTime
        }, 'error')
        throw error
      }
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [])

  /**
   * 监听错误
   */
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      addDebugLog('error', event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      }, 'error')
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      addDebugLog('error', 'Unhandled Promise Rejection', {
        reason: event.reason
      }, 'error')
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  /**
   * 定期更新性能信息
   */
  useEffect(() => {
    const updatePerformance = () => {
      setPerformanceInfo(getPerformanceInfo())
    }

    updatePerformance()
    const interval = setInterval(updatePerformance, 5000) // 每5秒更新

    return () => clearInterval(interval)
  }, [])

  /**
   * 处理拖拽
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMinimized) return
    
    setIsDragging(true)
    const rect = panelRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  /**
   * 清空日志
   */
  const clearLogs = () => {
    setDebugLogs([])
  }

  /**
   * 获取日志级别颜色
   */
  const getLogLevelColor = (level: DebugInfo['level']) => {
    switch (level) {
      case 'error':
        return 'text-red-500'
      case 'warn':
        return 'text-yellow-500'
      default:
        return 'text-blue-500'
    }
  }

  /**
   * 格式化时间
   */
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  // 开发环境下显示调试按钮
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <>
      {/* 调试按钮 */}
      {!isVisible && (
        <Button
          onClick={() => setIsVisible(true)}
          className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 p-0"
          variant="secondary"
        >
          <Bug className="h-5 w-5" />
        </Button>
      )}

      {/* 调试面板 */}
      {isVisible && (
        <div
          ref={panelRef}
          className="fixed z-50 bg-background border rounded-lg shadow-lg"
          style={{
            left: position.x,
            top: position.y,
            width: isMinimized ? 'auto' : '400px',
            height: isMinimized ? 'auto' : '500px'
          }}
        >
          {/* 标题栏 */}
          <div
            className="flex items-center justify-between p-3 border-b cursor-move"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center space-x-2">
              <Bug className="h-4 w-4" />
              <span className="font-medium text-sm">调试面板</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0"
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* 面板内容 */}
          {!isMinimized && (
            <div className="flex flex-col h-full">
              {/* 标签页 */}
              <div className="flex border-b">
                {[
                  { key: 'logs', label: '日志', icon: Activity },
                  { key: 'api', label: 'API', icon: Globe },
                  { key: 'performance', label: '性能', icon: Monitor },
                  { key: 'system', label: '系统', icon: Settings }
                ].map(tab => {
                  const IconComponent = tab.icon
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`flex items-center space-x-1 px-3 py-2 text-xs border-b-2 transition-colors ${
                        activeTab === tab.key
                          ? 'border-primary text-primary'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <IconComponent className="h-3 w-3" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* 内容区域 */}
              <div className="flex-1 overflow-hidden">
                {activeTab === 'logs' && (
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between p-2 border-b">
                      <span className="text-xs text-muted-foreground">
                        {debugLogs.length} 条日志
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearLogs}
                        className="h-6 px-2 text-xs"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        清空
                      </Button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                      {debugLogs.map((log, index) => (
                        <div key={index} className="text-xs">
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">
                              {formatTime(log.timestamp)}
                            </span>
                            <span className={`font-medium ${getLogLevelColor(log.level)}`}>
                              [{log.type.toUpperCase()}]
                            </span>
                          </div>
                          <div className="mt-1 text-foreground">{log.message}</div>
                          {log.data && (
                            <pre className="mt-1 text-xs bg-muted p-1 rounded overflow-x-auto">
                              {JSON.stringify(log.data, null, 2)}
                            </pre>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'performance' && performanceInfo && (
                  <div className="p-3 space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2">内存使用</h4>
                      <div className="text-xs space-y-1">
                        <div>已用: {performanceInfo.memory.used} MB</div>
                        <div>总计: {performanceInfo.memory.total} MB</div>
                        <div>使用率: {performanceInfo.memory.percentage}%</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">加载时间</h4>
                      <div className="text-xs space-y-1">
                        <div>DOM加载: {performanceInfo.timing.domContentLoaded}ms</div>
                        <div>完全加载: {performanceInfo.timing.loadComplete}ms</div>
                      </div>
                    </div>

                    {performanceInfo.connection && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">网络连接</h4>
                        <div className="text-xs space-y-1">
                          <div>类型: {performanceInfo.connection.effectiveType}</div>
                          <div>下行: {performanceInfo.connection.downlink} Mbps</div>
                          <div>延迟: {performanceInfo.connection.rtt}ms</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'system' && (
                  <div className="p-3 space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2">缓存状态</h4>
                      <div className="text-xs space-y-1">
                        <div>缓存项: {apiClient.getCacheStats().size}</div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            apiClient.clearCache()
                            addDebugLog('system', '缓存已清空')
                          }}
                          className="h-6 px-2 text-xs mt-2"
                        >
                          清空缓存
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
