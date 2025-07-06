# API 文档

本文档详细介绍了项目中的 API 客户端和相关服务的使用方法。

## 🔌 API 客户端

### ApiClient 类

统一的 HTTP 请求客户端，提供完整的请求管理功能。

#### 初始化

```tsx
import { ApiClient } from '@/lib/api/client'

// 使用默认配置
const client = new ApiClient()

// 自定义基础 URL 和默认头部
const client = new ApiClient('https://api.example.com', {
  'Authorization': 'Bearer token',
  'Custom-Header': 'value'
})
```

#### 基础方法

##### GET 请求

```tsx
// 简单 GET 请求
const response = await client.get('/users')

// 带查询参数
const response = await client.get('/users', { 
  page: 1, 
  limit: 10 
})

// 带配置选项
const response = await client.get('/users', undefined, {
  cache: true,
  cacheTime: 5 * 60 * 1000, // 5分钟
  timeout: 10000
})
```

##### POST 请求

```tsx
// 创建用户
const response = await client.post('/users', {
  name: '张三',
  email: 'zhangsan@example.com'
})

// 带自定义头部
const response = await client.post('/users', userData, {
  headers: {
    'Content-Type': 'application/json',
    'X-Custom-Header': 'value'
  }
})
```

##### PUT 请求

```tsx
// 更新用户
const response = await client.put('/users/123', {
  name: '李四',
  email: 'lisi@example.com'
})
```

##### DELETE 请求

```tsx
// 删除用户
const response = await client.delete('/users/123')
```

##### PATCH 请求

```tsx
// 部分更新
const response = await client.patch('/users/123', {
  name: '王五'
})
```

##### 文件上传

```tsx
// 上传单个文件
const response = await client.upload('/upload', file)

// 带额外配置
const response = await client.upload('/upload', file, {
  timeout: 30000, // 30秒超时
  headers: {
    'X-Upload-Type': 'avatar'
  }
})
```

#### 高级功能

##### 认证管理

```tsx
// 设置认证令牌
client.setAuthToken('your-jwt-token')

// 移除认证令牌
client.removeAuthToken()

// 设置默认头部
client.setDefaultHeaders({
  'Authorization': 'Bearer new-token',
  'X-API-Version': 'v2'
})
```

##### 缓存管理

```tsx
// 启用缓存的请求
const response = await client.get('/data', undefined, {
  cache: true,
  cacheTime: 10 * 60 * 1000 // 10分钟
})

// 清空所有缓存
client.clearCache()

// 清空过期缓存
client.clearExpiredCache()

// 获取缓存统计
const stats = client.getCacheStats()
console.log(`缓存项数量: ${stats.size}`)
console.log(`缓存键列表: ${stats.keys}`)
```

##### 重试机制

```tsx
// 配置重试
const response = await client.get('/unreliable-endpoint', undefined, {
  retry: 3,           // 重试3次
  retryDelay: 1000    // 每次重试间隔1秒
})
```

#### 响应格式

所有 API 响应都遵循统一格式：

```tsx
interface ApiResponse<T = any> {
  data: T              // 响应数据
  message?: string     // 响应消息
  code?: number        // 状态码
  success: boolean     // 是否成功
  timestamp?: number   // 时间戳
}
```

#### 错误处理

```tsx
interface ApiError {
  message: string      // 错误消息
  code?: number        // 错误码
  status?: number      // HTTP状态码
  details?: any        // 错误详情
}

try {
  const response = await client.get('/api/data')
} catch (error) {
  const apiError = error as ApiError
  console.error(`API错误: ${apiError.message}`)
  console.error(`状态码: ${apiError.status}`)
}
```

## 🛠️ 服务类

### UserService 用户服务

用户相关的 API 操作。

```tsx
import { UserService } from '@/lib/api/services'

// 获取用户列表
const users = await UserService.getUsers({
  page: 1,
  pageSize: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc'
})

// 获取用户详情
const user = await UserService.getUser('user-id')

// 创建用户
const newUser = await UserService.createUser({
  name: '张三',
  email: 'zhangsan@example.com',
  role: 'user'
})

// 更新用户
const updatedUser = await UserService.updateUser('user-id', {
  name: '李四'
})

// 删除用户
await UserService.deleteUser('user-id')

// 上传头像
const avatar = await UserService.uploadAvatar('user-id', avatarFile)
```

### AuthService 认证服务

用户认证相关的 API 操作。

```tsx
import { AuthService } from '@/lib/api/services'

// 用户登录
const loginResult = await AuthService.login({
  email: 'user@example.com',
  password: 'password123'
})

// 用户注册
const registerResult = await AuthService.register({
  name: '张三',
  email: 'zhangsan@example.com',
  password: 'password123'
})

// 用户登出
await AuthService.logout()

// 刷新令牌
const tokenResult = await AuthService.refreshToken()

// 获取当前用户信息
const currentUser = await AuthService.getCurrentUser()

// 修改密码
await AuthService.changePassword({
  oldPassword: 'oldpass123',
  newPassword: 'newpass123'
})

// 忘记密码
await AuthService.forgotPassword('user@example.com')

// 重置密码
await AuthService.resetPassword({
  token: 'reset-token',
  password: 'newpass123'
})

// 初始化认证状态（应用启动时调用）
AuthService.initializeAuth()
```

### DataService 数据服务

数据相关的 API 操作。

```tsx
import { DataService } from '@/lib/api/services'

// 获取仪表板数据
const dashboardData = await DataService.getDashboardData()

// 获取图表数据
const chartData = await DataService.getChartData('sales', {
  startDate: '2024-01-01',
  endDate: '2024-12-31'
})

// 导出数据
const exportResult = await DataService.exportData('excel', {
  type: 'users',
  filters: { active: true }
})

// 导入数据
const importResult = await DataService.importData(csvFile)
console.log(`导入成功: ${importResult.data.imported} 条记录`)
console.log(`错误: ${importResult.data.errors}`)
```

### FileService 文件服务

文件管理相关的 API 操作。

```tsx
import { FileService } from '@/lib/api/services'

// 上传文件
const uploadResult = await FileService.uploadFile(file, 'documents')

// 获取文件列表
const files = await FileService.getFiles({
  folder: 'images',
  page: 1,
  pageSize: 20
})

// 删除文件
await FileService.deleteFile('file-id')

// 获取下载链接
const downloadUrl = await FileService.getDownloadUrl('file-id')
```

### SystemService 系统服务

系统相关的 API 操作。

```tsx
import { SystemService } from '@/lib/api/services'

// 获取系统状态
const status = await SystemService.getSystemStatus()

// 获取系统配置
const config = await SystemService.getSystemConfig()

// 更新系统配置
await SystemService.updateSystemConfig({
  maxUploadSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['jpg', 'png', 'pdf']
})

// 获取系统日志
const logs = await SystemService.getSystemLogs({
  level: 'error',
  page: 1,
  pageSize: 50
})

// 清理系统缓存
await SystemService.clearCache()
```

## 🔧 配置选项

### RequestConfig 接口

```tsx
interface RequestConfig {
  method?: HttpMethod                    // HTTP方法
  headers?: Record<string, string>       // 请求头
  params?: Record<string, any>           // 查询参数
  data?: any                            // 请求体数据
  timeout?: number                      // 超时时间（毫秒）
  cache?: boolean                       // 是否启用缓存
  cacheTime?: number                    // 缓存时间（毫秒）
  retry?: number                        // 重试次数
  retryDelay?: number                   // 重试延迟（毫秒）
}
```

### 默认配置

```tsx
const defaultConfig = {
  timeout: 10000,        // 10秒超时
  retry: 3,              // 重试3次
  retryDelay: 1000,      // 1秒重试延迟
  cacheTime: 300000,     // 5分钟缓存
}
```

## 🌍 环境变量

在 `.env.local` 文件中配置 API 相关环境变量：

```env
# API 基础 URL
NEXT_PUBLIC_API_BASE_URL=https://api.example.com

# API 版本
NEXT_PUBLIC_API_VERSION=v1

# 调试模式
NEXT_PUBLIC_DEBUG_MODE=true
```

## 🧪 测试

### 模拟 API 响应

```tsx
import { testUtils } from '@/lib/test-utils'

// 模拟成功响应
const mockResponse = testUtils.mockApiResponse({
  id: 1,
  name: '张三'
}, true, 200)

// 模拟错误响应
const mockError = testUtils.mockApiResponse(
  { error: '用户不存在' },
  false,
  404
)

// 模拟 fetch 响应
global.fetch = jest.fn().mockResolvedValue(
  testUtils.mockFetchResponse({ success: true })
)
```

### API 客户端测试

```tsx
import { ApiClient } from '@/lib/api/client'

describe('ApiClient', () => {
  let client: ApiClient

  beforeEach(() => {
    client = new ApiClient('https://test.com')
  })

  it('should make GET request', async () => {
    global.fetch = jest.fn().mockResolvedValue(
      testUtils.mockFetchResponse({ data: 'test' })
    )

    const response = await client.get('/test')
    
    expect(response).toBeValidApiResponse()
    expect(response.data).toEqual({ data: 'test' })
  })
})
```

## 📝 最佳实践

### 1. 错误处理

```tsx
try {
  const response = await UserService.getUser(userId)
  // 处理成功响应
} catch (error) {
  const apiError = error as ApiError
  
  // 根据错误类型处理
  switch (apiError.status) {
    case 401:
      // 未授权，重定向到登录页
      router.push('/login')
      break
    case 404:
      // 资源不存在
      showNotification('用户不存在', 'error')
      break
    default:
      // 其他错误
      showNotification('操作失败，请重试', 'error')
  }
}
```

### 2. 缓存策略

```tsx
// 频繁访问的数据使用缓存
const userData = await UserService.getUser(userId) // 自动缓存5分钟

// 实时数据不使用缓存
const liveData = await DataService.getDashboardData() // 缓存30秒

// 手动清理特定缓存
client.clearCache() // 清理所有缓存
```

### 3. 加载状态管理

```tsx
const [loading, setLoading] = useState(false)

const handleSubmit = async (data) => {
  setLoading(true)
  try {
    await UserService.createUser(data)
    showNotification('创建成功', 'success')
  } catch (error) {
    showNotification('创建失败', 'error')
  } finally {
    setLoading(false)
  }
}
```

### 4. 类型安全

```tsx
// 定义响应类型
interface User {
  id: string
  name: string
  email: string
}

// 使用泛型确保类型安全
const response = await client.get<User[]>('/users')
const users: User[] = response.data
```
