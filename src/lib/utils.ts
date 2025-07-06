import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并CSS类名的工具函数
 * 结合clsx和tailwind-merge，提供更好的类名合并体验
 * 
 * @param inputs - CSS类名输入
 * @returns 合并后的CSS类名字符串
 * 
 * @example
 * ```tsx
 * cn('px-2 py-1', 'px-4') // 结果: 'py-1 px-4'
 * cn('text-red-500', condition && 'text-blue-500') // 条件性类名
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 格式化文件大小
 * 将字节数转换为人类可读的文件大小格式
 * 
 * @param bytes - 字节数
 * @param decimals - 小数位数，默认为2
 * @returns 格式化后的文件大小字符串
 * 
 * @example
 * ```tsx
 * formatFileSize(1024) // '1.00 KB'
 * formatFileSize(1048576) // '1.00 MB'
 * ```
 */
export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * 防抖函数
 * 在指定时间内只执行最后一次调用
 * 
 * @param func - 要防抖的函数
 * @param wait - 等待时间（毫秒）
 * @returns 防抖后的函数
 * 
 * @example
 * ```tsx
 * const debouncedSearch = debounce((query: string) => {
 *   // 执行搜索
 * }, 300)
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * 节流函数
 * 在指定时间内最多执行一次
 * 
 * @param func - 要节流的函数
 * @param limit - 时间限制（毫秒）
 * @returns 节流后的函数
 * 
 * @example
 * ```tsx
 * const throttledScroll = throttle(() => {
 *   // 处理滚动事件
 * }, 100)
 * ```
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * 深拷贝函数
 * 创建对象的深层副本
 * 
 * @param obj - 要拷贝的对象
 * @returns 深拷贝后的对象
 * 
 * @example
 * ```tsx
 * const original = { a: 1, b: { c: 2 } }
 * const copy = deepClone(original)
 * ```
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T
  }

  if (typeof obj === 'object') {
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }

  return obj
}

/**
 * 生成随机ID
 * 生成指定长度的随机字符串ID
 * 
 * @param length - ID长度，默认为8
 * @returns 随机ID字符串
 * 
 * @example
 * ```tsx
 * generateId() // 'a1b2c3d4'
 * generateId(12) // 'a1b2c3d4e5f6'
 * ```
 */
export function generateId(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

/**
 * 格式化相对时间
 * 将时间戳转换为相对时间描述
 * 
 * @param timestamp - 时间戳
 * @param locale - 语言环境，默认为'zh-CN'
 * @returns 相对时间字符串
 * 
 * @example
 * ```tsx
 * formatRelativeTime(Date.now() - 60000) // '1分钟前'
 * formatRelativeTime(Date.now() + 3600000) // '1小时后'
 * ```
 */
export function formatRelativeTime(timestamp: number, locale = 'zh-CN'): string {
  const now = Date.now()
  const diff = timestamp - now
  const absDiff = Math.abs(diff)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  if (absDiff < 60000) { // 小于1分钟
    return rtf.format(Math.round(diff / 1000), 'second')
  } else if (absDiff < 3600000) { // 小于1小时
    return rtf.format(Math.round(diff / 60000), 'minute')
  } else if (absDiff < 86400000) { // 小于1天
    return rtf.format(Math.round(diff / 3600000), 'hour')
  } else if (absDiff < 2592000000) { // 小于30天
    return rtf.format(Math.round(diff / 86400000), 'day')
  } else if (absDiff < 31536000000) { // 小于1年
    return rtf.format(Math.round(diff / 2592000000), 'month')
  } else {
    return rtf.format(Math.round(diff / 31536000000), 'year')
  }
}

/**
 * 检查是否为有效的URL
 * 
 * @param string - 要检查的字符串
 * @returns 是否为有效URL
 * 
 * @example
 * ```tsx
 * isValidUrl('https://example.com') // true
 * isValidUrl('not-a-url') // false
 * ```
 */
export function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}

/**
 * 检查是否为有效的邮箱地址
 * 
 * @param email - 要检查的邮箱地址
 * @returns 是否为有效邮箱
 * 
 * @example
 * ```tsx
 * isValidEmail('user@example.com') // true
 * isValidEmail('invalid-email') // false
 * ```
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 将对象转换为URL查询参数
 * 
 * @param params - 参数对象
 * @returns URL查询参数字符串
 * 
 * @example
 * ```tsx
 * objectToQueryString({ page: 1, size: 10 }) // 'page=1&size=10'
 * ```
 */
export function objectToQueryString(params: Record<string, any>): string {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
}

/**
 * 将URL查询参数转换为对象
 * 
 * @param queryString - 查询参数字符串
 * @returns 参数对象
 * 
 * @example
 * ```tsx
 * queryStringToObject('page=1&size=10') // { page: '1', size: '10' }
 * ```
 */
export function queryStringToObject(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString)
  const result: Record<string, string> = {}
  
  for (const [key, value] of params.entries()) {
    result[key] = value
  }
  
  return result
}
