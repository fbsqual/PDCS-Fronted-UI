import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// 导入语言资源
import zhCN from '@/locales/zh-CN.json'
import enUS from '@/locales/en-US.json'
import jaJP from '@/locales/ja-JP.json'

/**
 * 支持的语言列表
 */
export const SUPPORTED_LANGUAGES = [
  {
    code: 'zh-CN',
    name: '简体中文',
    nativeName: '简体中文',
    flag: '🇨🇳'
  },
  {
    code: 'en-US', 
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  },
  {
    code: 'ja-JP',
    name: 'Japanese',
    nativeName: '日本語', 
    flag: '🇯🇵'
  }
] as const

/**
 * 语言代码类型
 */
export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code']

/**
 * 默认语言
 */
export const DEFAULT_LANGUAGE: LanguageCode = 'zh-CN'

/**
 * 语言资源映射
 */
const resources = {
  'zh-CN': {
    translation: zhCN
  },
  'en-US': {
    translation: enUS
  },
  'ja-JP': {
    translation: jaJP
  }
}

/**
 * i18n配置
 */
i18n
  // 检测用户语言
  .use(LanguageDetector)
  // 传递i18n实例给react-i18next
  .use(initReactI18next)
  // 初始化i18next
  .init({
    // 语言资源
    resources,
    
    // 默认语言
    fallbackLng: DEFAULT_LANGUAGE,
    
    // 调试模式（仅在开发环境启用）
    debug: process.env.NODE_ENV === 'development',
    
    // 语言检测配置
    detection: {
      // 检测顺序
      order: ['localStorage', 'navigator', 'htmlTag'],
      
      // 缓存用户语言选择
      caches: ['localStorage'],
      
      // localStorage键名
      lookupLocalStorage: 'i18nextLng',
      
      // 检查所有回退语言
      checkWhitelist: true
    },
    
    // 插值配置
    interpolation: {
      // React已经默认转义了
      escapeValue: false,
      
      // 格式化函数
      format: (value, format, lng) => {
        if (format === 'uppercase') return value.toUpperCase()
        if (format === 'lowercase') return value.toLowerCase()
        if (format === 'capitalize') {
          return value.charAt(0).toUpperCase() + value.slice(1)
        }
        return value
      }
    },
    
    // 命名空间配置
    defaultNS: 'translation',
    ns: ['translation'],
    
    // 键分隔符
    keySeparator: '.',
    
    // 嵌套分隔符
    nsSeparator: ':',
    
    // 复数规则
    pluralSeparator: '_',
    
    // 上下文分隔符
    contextSeparator: '_',
    
    // 后备键
    saveMissing: process.env.NODE_ENV === 'development',
    
    // 缺失键处理
    missingKeyHandler: (lng, ns, key, fallbackValue) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: ${key} for language: ${lng}`)
      }
    },
    
    // React配置
    react: {
      // 使用Suspense
      useSuspense: false,
      
      // 绑定I18n实例
      bindI18n: 'languageChanged',
      
      // 绑定I18nStore
      bindI18nStore: '',
      
      // 转换默认值
      transEmptyNodeValue: '',
      
      // 转换组件
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
      
      // 使用键作为默认值
      useSuspense: false
    }
  })

/**
 * 获取当前语言信息
 */
export const getCurrentLanguage = () => {
  const currentLang = i18n.language as LanguageCode
  return SUPPORTED_LANGUAGES.find(lang => lang.code === currentLang) || SUPPORTED_LANGUAGES[0]
}

/**
 * 切换语言
 */
export const changeLanguage = async (languageCode: LanguageCode) => {
  try {
    await i18n.changeLanguage(languageCode)
    
    // 更新HTML lang属性
    if (typeof document !== 'undefined') {
      document.documentElement.lang = languageCode
    }
    
    // 触发自定义事件
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: languageCode }
      }))
    }
    
    return true
  } catch (error) {
    console.error('Failed to change language:', error)
    return false
  }
}

/**
 * 获取语言方向（LTR/RTL）
 */
export const getLanguageDirection = (languageCode?: LanguageCode) => {
  const lang = languageCode || i18n.language as LanguageCode
  // 目前支持的语言都是LTR，如果以后添加RTL语言需要在这里配置
  const rtlLanguages: LanguageCode[] = []
  return rtlLanguages.includes(lang) ? 'rtl' : 'ltr'
}

/**
 * 格式化数字
 */
export const formatNumber = (number: number, languageCode?: LanguageCode) => {
  const lang = languageCode || i18n.language as LanguageCode
  return new Intl.NumberFormat(lang).format(number)
}

/**
 * 格式化日期
 */
export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions, languageCode?: LanguageCode) => {
  const lang = languageCode || i18n.language as LanguageCode
  return new Intl.DateTimeFormat(lang, options).format(date)
}

/**
 * 格式化货币
 */
export const formatCurrency = (amount: number, currency = 'CNY', languageCode?: LanguageCode) => {
  const lang = languageCode || i18n.language as LanguageCode
  return new Intl.NumberFormat(lang, {
    style: 'currency',
    currency
  }).format(amount)
}

export default i18n
