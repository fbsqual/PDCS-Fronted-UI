'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Languages } from 'lucide-react'
import { SUPPORTED_LANGUAGES, changeLanguage, getCurrentLanguage, type LanguageCode } from '@/lib/i18n'

/**
 * 语言切换组件
 * 提供多语言切换功能
 */
export function LanguageToggle() {
  const { t } = useTranslation()
  const [isChanging, setIsChanging] = useState(false)
  const currentLanguage = getCurrentLanguage()

  /**
   * 处理语言切换
   */
  const handleLanguageChange = async (languageCode: LanguageCode) => {
    if (languageCode === currentLanguage.code || isChanging) {
      return
    }

    setIsChanging(true)
    
    try {
      const success = await changeLanguage(languageCode)
      if (success) {
        // 语言切换成功，可以在这里添加成功提示
        console.log(`Language changed to: ${languageCode}`)
      } else {
        // 语言切换失败，可以在这里添加错误提示
        console.error(`Failed to change language to: ${languageCode}`)
      }
    } catch (error) {
      console.error('Error changing language:', error)
    } finally {
      setIsChanging(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 px-0"
          disabled={isChanging}
          title={t('demo.i18n.switch', '切换语言')}
        >
          {isChanging ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Languages className="h-4 w-4" />
          )}
          <span className="sr-only">{t('demo.i18n.switch', '切换语言')}</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {SUPPORTED_LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center gap-2 ${
              currentLanguage.code === language.code 
                ? 'bg-accent text-accent-foreground' 
                : ''
            }`}
            disabled={isChanging}
          >
            <span className="text-base">{language.flag}</span>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{language.nativeName}</span>
              <span className="text-xs text-muted-foreground">{language.name}</span>
            </div>
            {currentLanguage.code === language.code && (
              <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
