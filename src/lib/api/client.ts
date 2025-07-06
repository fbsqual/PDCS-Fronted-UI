'use client'

/**
 * HTTP请求方法类型
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

/**
 * API响应接口
 */
export interface ApiResponse<T = any> {
  data: T
  message?: string
  code?: number
  success: boolean
  timestamp?: number
}

/**
 * API错误接口
 */
export interface ApiError {
  message: string
  code?: number
  status?: number
  details?: any
}

/**
 * 请求配置接口
 */
export interface RequestConfig {
  method?: HttpMethod
  headers?: Record<string, string>
  params?: Record<string, any>
  data?: any
  timeout?: number
  cache?: boolean
  cacheTime?: number
  retry?: number
  retryDelay?: number
}

/**
 * 缓存项接口
 */
interface CacheItem {
  data: any
  timestamp: number
  expiry: number
}

/**
 * API客户端类
 * 提供统一的HTTP请求接口，包含错误处理、缓存、重试等功能
 */
export class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>
  private cache: Map<string, CacheItem> = new Map()
  private defaultTimeout = 10000
  private defaultRetry = 3
  private defaultRetryDelay = 1000

  constructor(baseURL: string = '', defaultHeaders: Record<string, string> = {}) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders
    }
  }

  /**
   * 设置默认请求头
   */
  setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers }
  }

  /**
   * 设置认证令牌
   */
  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  /**
   * 移除认证令牌
   */
  removeAuthToken(): void {
    delete this.defaultHeaders['Authorization']
  }

  /**
   * 构建完整URL
   */
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.baseURL)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }
    
    return url.toString()
  }

  /**
   * 生成缓存键
   */
  private getCacheKey(url: string, config: RequestConfig): string {
    const method = config.method || 'GET'
    const data = config.data ? JSON.stringify(config.data) : ''
    return `${method}:${url}:${data}`
  }

  /**
   * 获取缓存数据
   */
  private getCache(key: string): any | null {
    const item = this.cache.get(key)
    if (!item) return null
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }

  /**
   * 设置缓存数据
   */
  private setCache(key: string, data: any, cacheTime: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + cacheTime
    })
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * 清除过期缓存
   */
  clearExpiredCache(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 发送HTTP请求
   */
  async request<T = any>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      params,
      data,
      timeout = this.defaultTimeout,
      cache = false,
      cacheTime = 5 * 60 * 1000, // 5分钟
      retry = this.defaultRetry,
      retryDelay = this.defaultRetryDelay
    } = config

    const url = this.buildURL(endpoint, params)
    const cacheKey = this.getCacheKey(url, config)

    // 检查缓存
    if (cache && method === 'GET') {
      const cachedData = this.getCache(cacheKey)
      if (cachedData) {
        return cachedData
      }
    }

    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers
    }

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
      signal: AbortSignal.timeout(timeout)
    }

    if (data && method !== 'GET') {
      requestConfig.body = JSON.stringify(data)
    }

    let lastError: Error | null = null

    // 重试机制
    for (let attempt = 0; attempt <= retry; attempt++) {
      try {
        const response = await fetch(url, requestConfig)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const responseData = await response.json()
        
        // 标准化响应格式
        const apiResponse: ApiResponse<T> = {
          data: responseData.data || responseData,
          message: responseData.message,
          code: responseData.code || response.status,
          success: responseData.success !== false,
          timestamp: Date.now()
        }

        // 缓存成功响应
        if (cache && method === 'GET') {
          this.setCache(cacheKey, apiResponse, cacheTime)
        }

        return apiResponse

      } catch (error) {
        lastError = error as Error
        
        // 如果不是最后一次尝试，等待后重试
        if (attempt < retry) {
          await this.delay(retryDelay * Math.pow(2, attempt)) // 指数退避
        }
      }
    }

    // 所有重试都失败，抛出错误
    throw this.createApiError(lastError!)
  }

  /**
   * 创建API错误对象
   */
  private createApiError(error: Error): ApiError {
    const apiError: ApiError = {
      message: error.message || 'Unknown error occurred',
      details: error
    }

    // 解析HTTP状态码
    const statusMatch = error.message.match(/HTTP (\d+):/)
    if (statusMatch) {
      apiError.status = parseInt(statusMatch[1])
      apiError.code = apiError.status
    }

    return apiError
  }

  /**
   * GET请求
   */
  async get<T = any>(endpoint: string, params?: Record<string, any>, config?: Omit<RequestConfig, 'method' | 'params'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET', params })
  }

  /**
   * POST请求
   */
  async post<T = any>(endpoint: string, data?: any, config?: Omit<RequestConfig, 'method' | 'data'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', data })
  }

  /**
   * PUT请求
   */
  async put<T = any>(endpoint: string, data?: any, config?: Omit<RequestConfig, 'method' | 'data'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', data })
  }

  /**
   * DELETE请求
   */
  async delete<T = any>(endpoint: string, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' })
  }

  /**
   * PATCH请求
   */
  async patch<T = any>(endpoint: string, data?: any, config?: Omit<RequestConfig, 'method' | 'data'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', data })
  }

  /**
   * 上传文件
   */
  async upload<T = any>(endpoint: string, file: File, config?: Omit<RequestConfig, 'method' | 'data'>): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)

    const uploadConfig = {
      ...config,
      method: 'POST' as HttpMethod,
      data: formData,
      headers: {
        ...config?.headers,
        // 移除Content-Type，让浏览器自动设置
      }
    }

    // 移除Content-Type头，让浏览器自动设置multipart/form-data
    delete uploadConfig.headers!['Content-Type']

    return this.request<T>(endpoint, uploadConfig)
  }

  /**
   * 获取缓存统计信息
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}

/**
 * 默认API客户端实例
 */
export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_BASE_URL || '')
