# PDCS-Fronted-UI 使用示例

本文档提供了基于 PDCS-Fronted-UI 框架进行顶层开发的完整示例。

## 目录

1. [快速开始示例](#快速开始示例)
2. [基础组件使用](#基础组件使用)
3. [业务页面开发](#业务页面开发)
4. [数据管理示例](#数据管理示例)
5. [国际化实现](#国际化实现)
6. [主题定制](#主题定制)
7. [完整项目示例](#完整项目示例)

---

## 快速开始示例

### 创建新项目

```bash
# 1. 克隆框架
git clone https://github.com/fbsqual/PDCS-Fronted-UI.git my-project
cd my-project

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 访问应用
# http://localhost:3000
```

### 创建第一个页面

```typescript
// src/app/dashboard/page.tsx
import { Metadata } from 'next'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: '仪表板 - 我的项目',
  description: '项目仪表板页面'
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">项目仪表板</h1>
        <p className="text-muted-foreground">欢迎使用基于 PDCS-Fronted-UI 的项目</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              用户统计
              <Badge variant="default">实时</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-sm text-muted-foreground">活跃用户</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>系统状态</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>系统正常运行</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="default">
              创建新项目
            </Button>
            <Button className="w-full" variant="outline">
              查看报告
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

---

## 基础组件使用

### 表单组件示例

```typescript
// src/components/forms/user-form.tsx
'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

interface UserFormProps {
  onSubmit: (data: UserFormData) => void
  initialData?: Partial<UserFormData>
}

interface UserFormData {
  name: string
  email: string
  role: string
}

export function UserForm({ onSubmit, initialData }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    role: initialData?.role || 'user'
  })
  const [errors, setErrors] = useState<Partial<UserFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = '姓名不能为空'
    }

    if (!formData.email.trim()) {
      newErrors.email = '邮箱不能为空'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          用户信息
          <Badge variant="outline">{formData.role}</Badge>
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">姓名</label>
            <Input
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="请输入姓名"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">邮箱</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="请输入邮箱"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">角色</label>
            <select
              value={formData.role}
              onChange={(e) => updateField('role', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">普通用户</option>
              <option value="admin">管理员</option>
              <option value="moderator">版主</option>
            </select>
          </div>

          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                请修正表单中的错误后重试
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? '提交中...' : '保存'}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => setFormData({ name: '', email: '', role: 'user' })}
          >
            重置
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
```

### 数据展示组件示例

```typescript
// src/components/business/data-table.tsx
'use client'

import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface DataItem {
  id: string
  name: string
  status: 'active' | 'inactive' | 'pending'
  progress: number
  createdAt: string
}

interface DataTableProps {
  data: DataItem[]
  onEdit?: (item: DataItem) => void
  onDelete?: (id: string) => void
}

export function DataTable({ data, onEdit, onDelete }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [data, searchTerm, statusFilter])

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'inactive': return 'secondary'
      case 'pending': return 'outline'
      default: return 'secondary'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '活跃'
      case 'inactive': return '非活跃'
      case 'pending': return '待处理'
      default: return status
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>数据列表</CardTitle>
        <div className="flex gap-4 mt-4">
          <Input
            placeholder="搜索名称..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">所有状态</option>
            <option value="active">活跃</option>
            <option value="inactive">非活跃</option>
            <option value="pending">待处理</option>
          </select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              没有找到匹配的数据
            </div>
          ) : (
            filteredData.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{item.name}</h3>
                    <Badge variant={getStatusVariant(item.status)}>
                      {getStatusText(item.status)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">进度:</span>
                      <Progress value={item.progress} className="flex-1 max-w-32" />
                      <span className="text-sm font-medium">{item.progress}%</span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      创建时间: {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  {onEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(item)}
                    >
                      编辑
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(item.id)}
                    >
                      删除
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

---

## 业务页面开发

### 用户管理页面

```typescript
// src/app/users/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { UserForm } from '@/components/forms/user-form'
import { DataTable } from '@/components/business/data-table'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  progress: number
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 模拟数据加载
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockUsers: User[] = [
          {
            id: '1',
            name: '张三',
            email: 'zhangsan@example.com',
            role: 'admin',
            status: 'active',
            progress: 85,
            createdAt: '2024-01-15'
          },
          {
            id: '2',
            name: '李四',
            email: 'lisi@example.com',
            role: 'user',
            status: 'pending',
            progress: 60,
            createdAt: '2024-01-20'
          },
          {
            id: '3',
            name: '王五',
            email: 'wangwu@example.com',
            role: 'moderator',
            status: 'inactive',
            progress: 30,
            createdAt: '2024-01-25'
          }
        ]
        
        setUsers(mockUsers)
      } catch (err) {
        setError('加载用户数据失败')
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  const handleCreateUser = async (userData: any) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newUser: User = {
        id: Date.now().toString(),
        ...userData,
        status: 'pending' as const,
        progress: 0,
        createdAt: new Date().toISOString().split('T')[0]
      }
      
      setUsers(prev => [...prev, newUser])
      setShowForm(false)
    } catch (err) {
      setError('创建用户失败')
    }
  }

  const handleEditUser = async (userData: any) => {
    if (!editingUser) return

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...userData }
          : user
      ))
      
      setEditingUser(null)
      setShowForm(false)
    } catch (err) {
      setError('更新用户失败')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('确定要删除这个用户吗？')) return

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setUsers(prev => prev.filter(user => user.id !== userId))
    } catch (err) {
      setError('删除用户失败')
    }
  }

  const openEditForm = (user: User) => {
    setEditingUser(user)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingUser(null)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">加载中...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">用户管理</h1>
          <p className="text-muted-foreground">管理系统用户和权限</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          添加用户
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DataTable
            data={users}
            onEdit={openEditForm}
            onDelete={handleDeleteUser}
          />
        </div>

        {showForm && (
          <div className="lg:col-span-1">
            <UserForm
              onSubmit={editingUser ? handleEditUser : handleCreateUser}
              initialData={editingUser || undefined}
            />
            <Button
              variant="outline"
              onClick={closeForm}
              className="w-full mt-4"
            >
              取消
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
```

---

## 数据管理示例

### 使用数据库操作

```typescript
// src/lib/services/user-service.ts
import { DatabaseManager } from '@/lib/database'

export class UserService {
  private db: DatabaseManager

  constructor() {
    this.db = new DatabaseManager()
  }

  async initialize() {
    await this.db.connect()
    
    // 创建用户表
    await this.db.createTable('users', {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      name: 'TEXT NOT NULL',
      email: 'TEXT UNIQUE NOT NULL',
      role: 'TEXT DEFAULT "user"',
      status: 'TEXT DEFAULT "pending"',
      created_at: 'DATETIME DEFAULT CURRENT_TIMESTAMP',
      updated_at: 'DATETIME DEFAULT CURRENT_TIMESTAMP'
    })
  }

  async createUser(userData: {
    name: string
    email: string
    role?: string
  }) {
    const userId = await this.db.insert('users', {
      name: userData.name,
      email: userData.email,
      role: userData.role || 'user'
    })

    return this.getUserById(userId.toString())
  }

  async getUserById(id: string) {
    const users = await this.db.select('users', {
      where: 'id = ?',
      params: [id],
      limit: 1
    })

    return users[0] || null
  }

  async getUsers(options: {
    search?: string
    status?: string
    limit?: number
    offset?: number
  } = {}) {
    let where = '1=1'
    const params: any[] = []

    if (options.search) {
      where += ' AND (name LIKE ? OR email LIKE ?)'
      params.push(`%${options.search}%`, `%${options.search}%`)
    }

    if (options.status) {
      where += ' AND status = ?'
      params.push(options.status)
    }

    return await this.db.select('users', {
      where,
      params,
      orderBy: 'created_at DESC',
      limit: options.limit || 50,
      offset: options.offset || 0
    })
  }

  async updateUser(id: string, userData: Partial<{
    name: string
    email: string
    role: string
    status: string
  }>) {
    const updateData = {
      ...userData,
      updated_at: new Date().toISOString()
    }

    await this.db.update('users', updateData, 'id = ?', [id])
    return this.getUserById(id)
  }

  async deleteUser(id: string) {
    await this.db.delete('users', 'id = ?', [id])
  }

  async getUserStats() {
    const totalUsers = await this.db.execute(
      'SELECT COUNT(*) as count FROM users'
    )
    
    const activeUsers = await this.db.execute(
      'SELECT COUNT(*) as count FROM users WHERE status = "active"'
    )

    const recentUsers = await this.db.execute(
      'SELECT COUNT(*) as count FROM users WHERE created_at > datetime("now", "-7 days")'
    )

    return {
      total: totalUsers[0].count,
      active: activeUsers[0].count,
      recent: recentUsers[0].count
    }
  }
}
```

### 在组件中使用服务

```typescript
// src/hooks/use-user-service.ts
'use client'

import { useState, useEffect } from 'react'
import { UserService } from '@/lib/services/user-service'

export function useUserService() {
  const [userService] = useState(() => new UserService())
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        await userService.initialize()
        setInitialized(true)
      } catch (error) {
        console.error('Failed to initialize user service:', error)
      }
    }

    init()
  }, [userService])

  return {
    userService: initialized ? userService : null,
    initialized
  }
}

// 在组件中使用
export function UserManagement() {
  const { userService, initialized } = useUserService()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userService) return

    const loadUsers = async () => {
      try {
        setLoading(true)
        const userData = await userService.getUsers()
        setUsers(userData)
      } catch (error) {
        console.error('Failed to load users:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [userService])

  const handleCreateUser = async (userData: any) => {
    if (!userService) return

    try {
      const newUser = await userService.createUser(userData)
      setUsers(prev => [...prev, newUser])
    } catch (error) {
      console.error('Failed to create user:', error)
    }
  }

  if (!initialized) {
    return <div>初始化中...</div>
  }

  if (loading) {
    return <div>加载中...</div>
  }

  return (
    <div>
      {/* 用户管理界面 */}
    </div>
  )
}
```

---

这些示例展示了如何基于 PDCS-Fronted-UI 框架进行实际的业务开发。框架提供了完整的基础设施，让您可以专注于业务逻辑的实现。

**PDCS-Fronted-UI Examples** - 实用的开发示例 📚
