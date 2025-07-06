'use client'

import localforage from 'localforage'

/**
 * 文件信息接口
 */
export interface FileInfo {
  id: string
  name: string
  type: string
  size: number
  lastModified: number
  content?: ArrayBuffer | string
  thumbnail?: string
}

/**
 * 文件管理器类
 * 提供本地文件存储和管理功能
 */
export class FileManager {
  private static instance: FileManager
  private storage: LocalForage

  constructor() {
    // 配置localforage
    this.storage = localforage.createInstance({
      name: 'PDCS-FileManager',
      storeName: 'files',
      description: 'PDCS应用文件存储'
    })
  }

  /**
   * 获取单例实例
   */
  static getInstance(): FileManager {
    if (!FileManager.instance) {
      FileManager.instance = new FileManager()
    }
    return FileManager.instance
  }

  /**
   * 保存文件
   */
  async saveFile(file: File): Promise<FileInfo> {
    try {
      const fileId = this.generateFileId()
      const content = await this.readFileAsArrayBuffer(file)
      
      const fileInfo: FileInfo = {
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        content
      }

      // 如果是图片，生成缩略图
      if (file.type.startsWith('image/')) {
        fileInfo.thumbnail = await this.generateThumbnail(file)
      }

      await this.storage.setItem(fileId, fileInfo)
      
      console.log(`File saved: ${file.name} (${fileId})`)
      return fileInfo
    } catch (error) {
      console.error('Failed to save file:', error)
      throw error
    }
  }

  /**
   * 获取文件
   */
  async getFile(fileId: string): Promise<FileInfo | null> {
    try {
      const fileInfo = await this.storage.getItem<FileInfo>(fileId)
      return fileInfo
    } catch (error) {
      console.error('Failed to get file:', error)
      return null
    }
  }

  /**
   * 获取所有文件列表
   */
  async getAllFiles(): Promise<FileInfo[]> {
    try {
      const files: FileInfo[] = []
      await this.storage.iterate<FileInfo, void>((fileInfo) => {
        // 不包含文件内容，减少内存使用
        files.push({
          ...fileInfo,
          content: undefined
        })
      })
      return files.sort((a, b) => b.lastModified - a.lastModified)
    } catch (error) {
      console.error('Failed to get all files:', error)
      return []
    }
  }

  /**
   * 删除文件
   */
  async deleteFile(fileId: string): Promise<boolean> {
    try {
      await this.storage.removeItem(fileId)
      console.log(`File deleted: ${fileId}`)
      return true
    } catch (error) {
      console.error('Failed to delete file:', error)
      return false
    }
  }

  /**
   * 批量删除文件
   */
  async deleteFiles(fileIds: string[]): Promise<number> {
    let deletedCount = 0
    
    for (const fileId of fileIds) {
      const success = await this.deleteFile(fileId)
      if (success) {
        deletedCount++
      }
    }
    
    return deletedCount
  }

  /**
   * 清空所有文件
   */
  async clearAllFiles(): Promise<void> {
    try {
      await this.storage.clear()
      console.log('All files cleared')
    } catch (error) {
      console.error('Failed to clear files:', error)
      throw error
    }
  }

  /**
   * 获取存储使用情况
   */
  async getStorageInfo(): Promise<{
    totalFiles: number
    totalSize: number
    usedSpace: number
    availableSpace: number
  }> {
    try {
      const files = await this.getAllFiles()
      const totalFiles = files.length
      const totalSize = files.reduce((sum, file) => sum + file.size, 0)

      // 估算可用空间（浏览器限制通常为几MB到几GB）
      let usedSpace = 0
      let availableSpace = 0

      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate()
        usedSpace = estimate.usage || 0
        availableSpace = (estimate.quota || 0) - usedSpace
      }

      return {
        totalFiles,
        totalSize,
        usedSpace,
        availableSpace
      }
    } catch (error) {
      console.error('Failed to get storage info:', error)
      return {
        totalFiles: 0,
        totalSize: 0,
        usedSpace: 0,
        availableSpace: 0
      }
    }
  }

  /**
   * 导出文件为Blob
   */
  async exportFileAsBlob(fileId: string): Promise<Blob | null> {
    try {
      const fileInfo = await this.getFile(fileId)
      if (!fileInfo || !fileInfo.content) {
        return null
      }

      return new Blob([fileInfo.content], { type: fileInfo.type })
    } catch (error) {
      console.error('Failed to export file as blob:', error)
      return null
    }
  }

  /**
   * 下载文件
   */
  async downloadFile(fileId: string): Promise<boolean> {
    try {
      const blob = await this.exportFileAsBlob(fileId)
      const fileInfo = await this.getFile(fileId)
      
      if (!blob || !fileInfo) {
        return false
      }

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileInfo.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      return true
    } catch (error) {
      console.error('Failed to download file:', error)
      return false
    }
  }

  /**
   * 搜索文件
   */
  async searchFiles(query: string): Promise<FileInfo[]> {
    try {
      const allFiles = await this.getAllFiles()
      const lowerQuery = query.toLowerCase()
      
      return allFiles.filter(file => 
        file.name.toLowerCase().includes(lowerQuery) ||
        file.type.toLowerCase().includes(lowerQuery)
      )
    } catch (error) {
      console.error('Failed to search files:', error)
      return []
    }
  }

  /**
   * 按类型筛选文件
   */
  async getFilesByType(type: string): Promise<FileInfo[]> {
    try {
      const allFiles = await this.getAllFiles()
      return allFiles.filter(file => file.type.startsWith(type))
    } catch (error) {
      console.error('Failed to get files by type:', error)
      return []
    }
  }

  /**
   * 生成文件ID
   */
  private generateFileId(): string {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 读取文件为ArrayBuffer
   */
  private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as ArrayBuffer)
      reader.onerror = () => reject(reader.error)
      reader.readAsArrayBuffer(file)
    })
  }

  /**
   * 生成图片缩略图
   */
  private generateThumbnail(file: File, maxSize = 200): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // 计算缩略图尺寸
        const { width, height } = this.calculateThumbnailSize(
          img.width, 
          img.height, 
          maxSize
        )

        canvas.width = width
        canvas.height = height

        // 绘制缩略图
        ctx?.drawImage(img, 0, 0, width, height)
        
        // 转换为base64
        const thumbnail = canvas.toDataURL('image/jpeg', 0.8)
        resolve(thumbnail)
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  /**
   * 计算缩略图尺寸
   */
  private calculateThumbnailSize(
    originalWidth: number, 
    originalHeight: number, 
    maxSize: number
  ): { width: number; height: number } {
    if (originalWidth <= maxSize && originalHeight <= maxSize) {
      return { width: originalWidth, height: originalHeight }
    }

    const aspectRatio = originalWidth / originalHeight

    if (originalWidth > originalHeight) {
      return {
        width: maxSize,
        height: Math.round(maxSize / aspectRatio)
      }
    } else {
      return {
        width: Math.round(maxSize * aspectRatio),
        height: maxSize
      }
    }
  }
}

/**
 * 获取文件管理器实例
 */
export const fileManager = FileManager.getInstance()
