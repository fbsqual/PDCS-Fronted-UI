'use client'

import { apiClient, type ApiResponse } from './client'

/**
 * 用户信息接口
 */
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  createdAt: string
  updatedAt: string
}

/**
 * 分页参数接口
 */
export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * 分页响应接口
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * 用户服务类
 * 提供用户相关的API操作
 */
export class UserService {
  private static readonly BASE_PATH = '/users'

  /**
   * 获取用户列表
   */
  static async getUsers(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<User>>> {
    return apiClient.get<PaginatedResponse<User>>(this.BASE_PATH, params, {
      cache: true,
      cacheTime: 2 * 60 * 1000 // 2分钟缓存
    })
  }

  /**
   * 获取用户详情
   */
  static async getUser(id: string): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`${this.BASE_PATH}/${id}`, undefined, {
      cache: true,
      cacheTime: 5 * 60 * 1000 // 5分钟缓存
    })
  }

  /**
   * 创建用户
   */
  static async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<User>> {
    return apiClient.post<User>(this.BASE_PATH, userData)
  }

  /**
   * 更新用户
   */
  static async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put<User>(`${this.BASE_PATH}/${id}`, userData)
  }

  /**
   * 删除用户
   */
  static async deleteUser(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.BASE_PATH}/${id}`)
  }

  /**
   * 上传用户头像
   */
  static async uploadAvatar(id: string, file: File): Promise<ApiResponse<{ url: string }>> {
    return apiClient.upload<{ url: string }>(`${this.BASE_PATH}/${id}/avatar`, file)
  }
}

/**
 * 认证服务类
 * 提供认证相关的API操作
 */
export class AuthService {
  private static readonly BASE_PATH = '/auth'

  /**
   * 用户登录
   */
  static async login(credentials: { email: string; password: string }): Promise<ApiResponse<{ token: string; user: User }>> {
    const response = await apiClient.post<{ token: string; user: User }>(`${this.BASE_PATH}/login`, credentials)
    
    // 登录成功后设置认证令牌
    if (response.success && response.data.token) {
      apiClient.setAuthToken(response.data.token)
      // 保存到localStorage
      localStorage.setItem('auth_token', response.data.token)
      localStorage.setItem('user_info', JSON.stringify(response.data.user))
    }
    
    return response
  }

  /**
   * 用户注册
   */
  static async register(userData: { name: string; email: string; password: string }): Promise<ApiResponse<{ token: string; user: User }>> {
    return apiClient.post<{ token: string; user: User }>(`${this.BASE_PATH}/register`, userData)
  }

  /**
   * 用户登出
   */
  static async logout(): Promise<ApiResponse<void>> {
    const response = await apiClient.post<void>(`${this.BASE_PATH}/logout`)
    
    // 清除本地存储的认证信息
    apiClient.removeAuthToken()
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_info')
    
    return response
  }

  /**
   * 刷新令牌
   */
  static async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await apiClient.post<{ token: string }>(`${this.BASE_PATH}/refresh`)
    
    if (response.success && response.data.token) {
      apiClient.setAuthToken(response.data.token)
      localStorage.setItem('auth_token', response.data.token)
    }
    
    return response
  }

  /**
   * 获取当前用户信息
   */
  static async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`${this.BASE_PATH}/me`, undefined, {
      cache: true,
      cacheTime: 1 * 60 * 1000 // 1分钟缓存
    })
  }

  /**
   * 修改密码
   */
  static async changePassword(data: { oldPassword: string; newPassword: string }): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.BASE_PATH}/change-password`, data)
  }

  /**
   * 忘记密码
   */
  static async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.BASE_PATH}/forgot-password`, { email })
  }

  /**
   * 重置密码
   */
  static async resetPassword(data: { token: string; password: string }): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.BASE_PATH}/reset-password`, data)
  }

  /**
   * 初始化认证状态
   */
  static initializeAuth(): void {
    const token = localStorage.getItem('auth_token')
    if (token) {
      apiClient.setAuthToken(token)
    }
  }
}

/**
 * 数据服务类
 * 提供数据相关的API操作
 */
export class DataService {
  private static readonly BASE_PATH = '/data'

  /**
   * 获取仪表板数据
   */
  static async getDashboardData(): Promise<ApiResponse<any>> {
    return apiClient.get<any>(`${this.BASE_PATH}/dashboard`, undefined, {
      cache: true,
      cacheTime: 30 * 1000 // 30秒缓存
    })
  }

  /**
   * 获取图表数据
   */
  static async getChartData(type: string, params?: Record<string, any>): Promise<ApiResponse<any>> {
    return apiClient.get<any>(`${this.BASE_PATH}/charts/${type}`, params, {
      cache: true,
      cacheTime: 1 * 60 * 1000 // 1分钟缓存
    })
  }

  /**
   * 导出数据
   */
  static async exportData(format: 'csv' | 'excel' | 'json', params?: Record<string, any>): Promise<ApiResponse<{ url: string }>> {
    return apiClient.post<{ url: string }>(`${this.BASE_PATH}/export`, { format, ...params })
  }

  /**
   * 导入数据
   */
  static async importData(file: File): Promise<ApiResponse<{ imported: number; errors: string[] }>> {
    return apiClient.upload<{ imported: number; errors: string[] }>(`${this.BASE_PATH}/import`, file)
  }
}

/**
 * 文件服务类
 * 提供文件相关的API操作
 */
export class FileService {
  private static readonly BASE_PATH = '/files'

  /**
   * 上传文件
   */
  static async uploadFile(file: File, folder?: string): Promise<ApiResponse<{ id: string; url: string; name: string }>> {
    const endpoint = folder ? `${this.BASE_PATH}?folder=${folder}` : this.BASE_PATH
    return apiClient.upload<{ id: string; url: string; name: string }>(endpoint, file)
  }

  /**
   * 获取文件列表
   */
  static async getFiles(params?: PaginationParams & { folder?: string }): Promise<ApiResponse<PaginatedResponse<any>>> {
    return apiClient.get<PaginatedResponse<any>>(this.BASE_PATH, params, {
      cache: true,
      cacheTime: 1 * 60 * 1000 // 1分钟缓存
    })
  }

  /**
   * 删除文件
   */
  static async deleteFile(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.BASE_PATH}/${id}`)
  }

  /**
   * 获取文件下载链接
   */
  static async getDownloadUrl(id: string): Promise<ApiResponse<{ url: string }>> {
    return apiClient.get<{ url: string }>(`${this.BASE_PATH}/${id}/download`)
  }
}

/**
 * 系统服务类
 * 提供系统相关的API操作
 */
export class SystemService {
  private static readonly BASE_PATH = '/system'

  /**
   * 获取系统状态
   */
  static async getSystemStatus(): Promise<ApiResponse<any>> {
    return apiClient.get<any>(`${this.BASE_PATH}/status`, undefined, {
      cache: true,
      cacheTime: 10 * 1000 // 10秒缓存
    })
  }

  /**
   * 获取系统配置
   */
  static async getSystemConfig(): Promise<ApiResponse<any>> {
    return apiClient.get<any>(`${this.BASE_PATH}/config`, undefined, {
      cache: true,
      cacheTime: 5 * 60 * 1000 // 5分钟缓存
    })
  }

  /**
   * 更新系统配置
   */
  static async updateSystemConfig(config: Record<string, any>): Promise<ApiResponse<void>> {
    return apiClient.put<void>(`${this.BASE_PATH}/config`, config)
  }

  /**
   * 获取系统日志
   */
  static async getSystemLogs(params?: PaginationParams & { level?: string }): Promise<ApiResponse<PaginatedResponse<any>>> {
    return apiClient.get<PaginatedResponse<any>>(`${this.BASE_PATH}/logs`, params)
  }

  /**
   * 清理系统缓存
   */
  static async clearCache(): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.BASE_PATH}/clear-cache`)
  }
}

/**
 * 初始化API服务
 */
export function initializeApiServices(): void {
  // 初始化认证状态
  AuthService.initializeAuth()
  
  // 定期清理过期缓存
  setInterval(() => {
    apiClient.clearExpiredCache()
  }, 5 * 60 * 1000) // 每5分钟清理一次
}
