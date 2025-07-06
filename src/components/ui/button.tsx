import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * 按钮变体样式定义
 */
const buttonVariants = cva(
  // 基础样式
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      // 按钮变体
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      // 按钮尺寸
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

/**
 * 按钮组件属性接口
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * 是否作为子组件渲染（使用Slot）
   */
  asChild?: boolean
  
  /**
   * 加载状态
   */
  loading?: boolean
  
  /**
   * 加载文本
   */
  loadingText?: string
}

/**
 * 按钮组件
 * 提供多种样式变体和尺寸的按钮组件
 * 
 * @example
 * ```tsx
 * // 基础按钮
 * <Button>点击我</Button>
 * 
 * // 不同变体
 * <Button variant="outline">轮廓按钮</Button>
 * <Button variant="destructive">危险按钮</Button>
 * 
 * // 不同尺寸
 * <Button size="sm">小按钮</Button>
 * <Button size="lg">大按钮</Button>
 * 
 * // 加载状态
 * <Button loading loadingText="处理中...">提交</Button>
 * 
 * // 作为链接使用
 * <Button asChild>
 *   <Link href="/about">关于我们</Link>
 * </Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    loadingText,
    disabled,
    children,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : 'button'
    
    // 当处于加载状态时禁用按钮
    const isDisabled = disabled || loading
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {loading && loadingText ? loadingText : children}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
