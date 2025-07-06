import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * 卡片容器组件属性接口
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * 卡片容器组件
 * 提供基础的卡片布局容器
 * 
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>标题</CardTitle>
 *     <CardDescription>描述</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     内容区域
 *   </CardContent>
 *   <CardFooter>
 *     <Button>操作按钮</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        className
      )}
      {...props}
    />
  )
)
Card.displayName = 'Card'

/**
 * 卡片头部组件属性接口
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * 卡片头部组件
 * 用于放置卡片标题和描述
 */
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

/**
 * 卡片标题组件属性接口
 */
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

/**
 * 卡片标题组件
 * 用于显示卡片的主标题
 */
const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-2xl font-semibold leading-none tracking-tight',
        className
      )}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

/**
 * 卡片描述组件属性接口
 */
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

/**
 * 卡片描述组件
 * 用于显示卡片的描述信息
 */
const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
)
CardDescription.displayName = 'CardDescription'

/**
 * 卡片内容组件属性接口
 */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * 卡片内容组件
 * 用于放置卡片的主要内容
 */
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

/**
 * 卡片底部组件属性接口
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * 卡片底部组件
 * 用于放置卡片的操作按钮或其他底部内容
 */
const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent 
}
