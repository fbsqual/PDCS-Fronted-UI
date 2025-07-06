'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { sqliteManager } from '@/lib/database/sqlite'
import { fileManager, type FileInfo } from '@/lib/pwa/file-manager'
import { Database, Upload, Download, Trash2, RefreshCw } from 'lucide-react'

/**
 * 用户数据接口
 */
interface User {
  id: number
  name: string
  email: string
  created_at: string
}

/**
 * 数据库演示组件
 * 展示SQLite和文件管理功能
 */
export function DatabaseDemo() {
  const { t } = useTranslation()
  const [isInitialized, setIsInitialized] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [files, setFiles] = useState<FileInfo[]>([])
  const [loading, setLoading] = useState(false)

  /**
   * 初始化数据库
   */
  useEffect(() => {
    const initDatabase = async () => {
      try {
        setLoading(true)
        await sqliteManager.initialize()
        setIsInitialized(true)
        await loadUsers()
        await loadFiles()
      } catch (error) {
        console.error('Failed to initialize database:', error)
      } finally {
        setLoading(false)
      }
    }

    initDatabase()
  }, [])

  /**
   * 加载用户数据
   */
  const loadUsers = async () => {
    try {
      const userData = sqliteManager.query('SELECT * FROM users ORDER BY created_at DESC')
      setUsers(userData as User[])
    } catch (error) {
      console.error('Failed to load users:', error)
    }
  }

  /**
   * 加载文件数据
   */
  const loadFiles = async () => {
    try {
      const fileData = await fileManager.getAllFiles()
      setFiles(fileData)
    } catch (error) {
      console.error('Failed to load files:', error)
    }
  }

  /**
   * 添加示例用户
   */
  const addSampleUser = async () => {
    try {
      const sampleUsers = [
        { name: '张三', email: 'zhangsan@example.com' },
        { name: '李四', email: 'lisi@example.com' },
        { name: '王五', email: 'wangwu@example.com' },
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Smith', email: 'jane@example.com' }
      ]

      const randomUser = sampleUsers[Math.floor(Math.random() * sampleUsers.length)]
      
      sqliteManager.run(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        [randomUser.name, `${Date.now()}_${randomUser.email}`]
      )

      await loadUsers()
    } catch (error) {
      console.error('Failed to add user:', error)
    }
  }

  /**
   * 删除用户
   */
  const deleteUser = async (userId: number) => {
    try {
      sqliteManager.run('DELETE FROM users WHERE id = ?', [userId])
      await loadUsers()
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  /**
   * 处理文件上传
   */
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      await fileManager.saveFile(file)
      await loadFiles()
      
      // 清空input
      event.target.value = ''
    } catch (error) {
      console.error('Failed to upload file:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * 下载文件
   */
  const downloadFile = async (fileId: string) => {
    try {
      await fileManager.downloadFile(fileId)
    } catch (error) {
      console.error('Failed to download file:', error)
    }
  }

  /**
   * 删除文件
   */
  const deleteFile = async (fileId: string) => {
    try {
      await fileManager.deleteFile(fileId)
      await loadFiles()
    } catch (error) {
      console.error('Failed to delete file:', error)
    }
  }

  /**
   * 清空所有数据
   */
  const clearAllData = async () => {
    try {
      setLoading(true)
      sqliteManager.run('DELETE FROM users')
      await fileManager.clearAllFiles()
      await loadUsers()
      await loadFiles()
    } catch (error) {
      console.error('Failed to clear data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <Database className="h-5 w-5 animate-pulse" />
          <span>{t('common.loading', '加载中...')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 用户数据管理 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>SQLite 用户数据</span>
          </CardTitle>
          <CardDescription>
            本地SQLite数据库用户管理演示
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button onClick={addSampleUser} disabled={loading}>
              {t('demo.database.add', '添加数据')}
            </Button>
            <Button 
              variant="outline" 
              onClick={loadUsers}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('common.refresh', '刷新')}
            </Button>
          </div>

          {users.length > 0 ? (
            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteUser(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              暂无用户数据
            </div>
          )}
        </CardContent>
      </Card>

      {/* 文件管理 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>本地文件管理</span>
          </CardTitle>
          <CardDescription>
            浏览器本地文件存储和管理演示
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <div className="relative">
              <input
                type="file"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={loading}
              />
              <Button disabled={loading}>
                <Upload className="h-4 w-4 mr-2" />
                上传文件
              </Button>
            </div>
            <Button 
              variant="outline" 
              onClick={loadFiles}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('common.refresh', '刷新')}
            </Button>
          </div>

          {files.length > 0 ? (
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{file.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {file.type} • {(file.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadFile(file.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteFile(file.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              暂无文件
            </div>
          )}
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="flex justify-center">
        <Button 
          variant="destructive" 
          onClick={clearAllData}
          disabled={loading}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          清空所有数据
        </Button>
      </div>
    </div>
  )
}
