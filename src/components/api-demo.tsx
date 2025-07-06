'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { apiClient, type ApiResponse } from '@/lib/api/client'
import { UserService, DataService, SystemService } from '@/lib/api/services'
import { 
  Globe, 
  Database, 
  Settings, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  Trash2
} from 'lucide-react'

/**
 * API演示组件
 * 展示API客户端的各种功能
 */
export function ApiDemo() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [responses, setResponses] = useState<Array<{
    id: string
    name: string
    status: 'success' | 'error' | 'loading'
    data?: any
    error?: string
    timestamp: number
  }>>([])

  /**
   * 添加响应记录
   */
  const addResponse = (name: string, status: 'success' | 'error' | 'loading', data?: any, error?: string) => {
    const response = {
      id: Date.now().toString(),
      name,
      status,
      data,
      error,
      timestamp: Date.now()
    }
    setResponses(prev => [response, ...prev.slice(0, 9)]) // 保留最近10条记录
  }

  /**
   * 更新响应状态
   */
  const updateResponse = (id: string, status: 'success' | 'error', data?: any, error?: string) => {
    setResponses(prev => prev.map(resp => 
      resp.id === id ? { ...resp, status, data, error } : resp
    ))
  }

  /**
   * 模拟API请求
   */
  const simulateApiRequest = async (name: string, requestFn: () => Promise<any>) => {
    const responseId = Date.now().toString()
    addResponse(name, 'loading')
    
    try {
      const result = await requestFn()
      updateResponse(responseId, 'success', result)
    } catch (error) {
      updateResponse(responseId, 'error', undefined, (error as Error).message)
    }
  }

  /**
   * 测试GET请求
   */
  const testGetRequest = async () => {
    await simulateApiRequest('GET /api/users', async () => {
      // 模拟API响应
      await new Promise(resolve => setTimeout(resolve, 1000))
      return {
        data: [
          { id: '1', name: '张三', email: 'zhangsan@example.com' },
          { id: '2', name: '李四', email: 'lisi@example.com' }
        ],
        success: true,
        message: '获取用户列表成功'
      }
    })
  }

  /**
   * 测试POST请求
   */
  const testPostRequest = async () => {
    await simulateApiRequest('POST /api/users', async () => {
      await new Promise(resolve => setTimeout(resolve, 800))
      return {
        data: { id: '3', name: '王五', email: 'wangwu@example.com' },
        success: true,
        message: '创建用户成功'
      }
    })
  }

  /**
   * 测试错误处理
   */
  const testErrorHandling = async () => {
    await simulateApiRequest('GET /api/error', async () => {
      await new Promise(resolve => setTimeout(resolve, 500))
      throw new Error('HTTP 404: 资源未找到')
    })
  }

  /**
   * 测试缓存功能
   */
  const testCaching = async () => {
    await simulateApiRequest('GET /api/cached (缓存测试)', async () => {
      const cacheKey = 'test-cache-key'
      const cached = apiClient.getCacheStats()
      
      await new Promise(resolve => setTimeout(resolve, 300))
      return {
        data: { message: '这是缓存的数据', timestamp: Date.now() },
        success: true,
        cache: cached
      }
    })
  }

  /**
   * 测试重试机制
   */
  const testRetry = async () => {
    let attempts = 0
    await simulateApiRequest('GET /api/retry (重试测试)', async () => {
      attempts++
      if (attempts < 3) {
        await new Promise(resolve => setTimeout(resolve, 200))
        throw new Error(`尝试 ${attempts} 失败`)
      }
      return {
        data: { message: '重试成功', attempts },
        success: true
      }
    })
  }

  /**
   * 清空记录
   */
  const clearResponses = () => {
    setResponses([])
  }

  /**
   * 清空缓存
   */
  const clearCache = () => {
    apiClient.clearCache()
    addResponse('清空缓存', 'success', { message: '缓存已清空' })
  }

  /**
   * 获取状态图标
   */
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'loading':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  /**
   * 格式化时间
   */
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <div className="space-y-6">
      {/* API测试按钮 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>API 功能测试</span>
          </CardTitle>
          <CardDescription>
            测试API客户端的各种功能，包括请求、错误处理、缓存等
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Button 
              onClick={testGetRequest}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              GET 请求
            </Button>
            
            <Button 
              onClick={testPostRequest}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              POST 请求
            </Button>
            
            <Button 
              onClick={testErrorHandling}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              错误处理
            </Button>
            
            <Button 
              onClick={testCaching}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              缓存测试
            </Button>
            
            <Button 
              onClick={testRetry}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              重试机制
            </Button>
            
            <Button 
              onClick={clearCache}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              清空缓存
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 响应记录 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>API 响应记录</span>
            </CardTitle>
            <Button 
              onClick={clearResponses}
              variant="outline"
              size="sm"
              disabled={responses.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              清空记录
            </Button>
          </div>
          <CardDescription>
            显示最近的API请求和响应结果
          </CardDescription>
        </CardHeader>
        <CardContent>
          {responses.length > 0 ? (
            <div className="space-y-3">
              {responses.map((response) => (
                <div
                  key={response.id}
                  className="flex items-start space-x-3 p-3 border rounded-lg"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getStatusIcon(response.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{response.name}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(response.timestamp)}
                      </span>
                    </div>
                    
                    {response.status === 'success' && response.data && (
                      <div className="mt-2">
                        <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                          {JSON.stringify(response.data, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {response.status === 'error' && response.error && (
                      <div className="mt-2">
                        <p className="text-sm text-red-600">{response.error}</p>
                      </div>
                    )}
                    
                    {response.status === 'loading' && (
                      <p className="text-sm text-muted-foreground mt-1">
                        请求处理中...
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              暂无API请求记录
            </div>
          )}
        </CardContent>
      </Card>

      {/* API功能说明 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>API 客户端特性</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">请求管理</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 支持所有HTTP方法 (GET, POST, PUT, DELETE, PATCH)</li>
                <li>• 自动JSON序列化和反序列化</li>
                <li>• 统一的响应格式处理</li>
                <li>• 文件上传支持</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">错误处理</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 自动重试机制（指数退避）</li>
                <li>• 请求超时控制</li>
                <li>• 统一错误格式</li>
                <li>• HTTP状态码解析</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">缓存机制</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 内存缓存支持</li>
                <li>• 可配置缓存时间</li>
                <li>• 自动过期清理</li>
                <li>• 缓存统计信息</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">认证支持</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Bearer Token 认证</li>
                <li>• 自动令牌管理</li>
                <li>• 令牌刷新机制</li>
                <li>• 本地存储集成</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
