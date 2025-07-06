/**
 * 颜色令牌定义
 * 定义应用中使用的所有颜色变量
 */

/**
 * 基础颜色调色板
 */
export const baseColors = {
  // 灰色系
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },
  
  // 蓝色系（主色调）
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  
  // 绿色系（成功色）
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  
  // 红色系（错误色）
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  
  // 黄色系（警告色）
  yellow: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  
  // 紫色系（辅助色）
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764',
  },
} as const

/**
 * 语义化颜色定义
 */
export const semanticColors = {
  // 主色调
  primary: baseColors.blue,
  
  // 辅助色
  secondary: baseColors.gray,
  
  // 成功色
  success: baseColors.green,
  
  // 警告色
  warning: baseColors.yellow,
  
  // 错误色
  error: baseColors.red,
  
  // 信息色
  info: baseColors.blue,
  
  // 强调色
  accent: baseColors.purple,
} as const

/**
 * 亮色主题颜色配置
 */
export const lightTheme = {
  // 背景色
  background: {
    primary: '#ffffff',
    secondary: baseColors.gray[50],
    tertiary: baseColors.gray[100],
    inverse: baseColors.gray[900],
  },
  
  // 前景色（文本色）
  foreground: {
    primary: baseColors.gray[900],
    secondary: baseColors.gray[600],
    tertiary: baseColors.gray[500],
    inverse: '#ffffff',
    muted: baseColors.gray[400],
  },
  
  // 边框色
  border: {
    primary: baseColors.gray[200],
    secondary: baseColors.gray[300],
    focus: semanticColors.primary[500],
    error: semanticColors.error[500],
  },
  
  // 语义化颜色
  semantic: {
    primary: {
      background: semanticColors.primary[500],
      foreground: '#ffffff',
      hover: semanticColors.primary[600],
      active: semanticColors.primary[700],
      light: semanticColors.primary[50],
      border: semanticColors.primary[200],
    },
    secondary: {
      background: semanticColors.secondary[100],
      foreground: semanticColors.secondary[900],
      hover: semanticColors.secondary[200],
      active: semanticColors.secondary[300],
      light: semanticColors.secondary[50],
      border: semanticColors.secondary[200],
    },
    success: {
      background: semanticColors.success[500],
      foreground: '#ffffff',
      hover: semanticColors.success[600],
      active: semanticColors.success[700],
      light: semanticColors.success[50],
      border: semanticColors.success[200],
    },
    warning: {
      background: semanticColors.warning[500],
      foreground: '#ffffff',
      hover: semanticColors.warning[600],
      active: semanticColors.warning[700],
      light: semanticColors.warning[50],
      border: semanticColors.warning[200],
    },
    error: {
      background: semanticColors.error[500],
      foreground: '#ffffff',
      hover: semanticColors.error[600],
      active: semanticColors.error[700],
      light: semanticColors.error[50],
      border: semanticColors.error[200],
    },
    info: {
      background: semanticColors.info[500],
      foreground: '#ffffff',
      hover: semanticColors.info[600],
      active: semanticColors.info[700],
      light: semanticColors.info[50],
      border: semanticColors.info[200],
    },
  },
} as const

/**
 * 暗色主题颜色配置
 */
export const darkTheme = {
  // 背景色
  background: {
    primary: baseColors.gray[900],
    secondary: baseColors.gray[800],
    tertiary: baseColors.gray[700],
    inverse: '#ffffff',
  },
  
  // 前景色（文本色）
  foreground: {
    primary: '#ffffff',
    secondary: baseColors.gray[300],
    tertiary: baseColors.gray[400],
    inverse: baseColors.gray[900],
    muted: baseColors.gray[500],
  },
  
  // 边框色
  border: {
    primary: baseColors.gray[700],
    secondary: baseColors.gray[600],
    focus: semanticColors.primary[400],
    error: semanticColors.error[400],
  },
  
  // 语义化颜色
  semantic: {
    primary: {
      background: semanticColors.primary[600],
      foreground: '#ffffff',
      hover: semanticColors.primary[500],
      active: semanticColors.primary[400],
      light: semanticColors.primary[950],
      border: semanticColors.primary[700],
    },
    secondary: {
      background: semanticColors.secondary[700],
      foreground: '#ffffff',
      hover: semanticColors.secondary[600],
      active: semanticColors.secondary[500],
      light: semanticColors.secondary[900],
      border: semanticColors.secondary[600],
    },
    success: {
      background: semanticColors.success[600],
      foreground: '#ffffff',
      hover: semanticColors.success[500],
      active: semanticColors.success[400],
      light: semanticColors.success[950],
      border: semanticColors.success[700],
    },
    warning: {
      background: semanticColors.warning[600],
      foreground: '#ffffff',
      hover: semanticColors.warning[500],
      active: semanticColors.warning[400],
      light: semanticColors.warning[950],
      border: semanticColors.warning[700],
    },
    error: {
      background: semanticColors.error[600],
      foreground: '#ffffff',
      hover: semanticColors.error[500],
      active: semanticColors.error[400],
      light: semanticColors.error[950],
      border: semanticColors.error[700],
    },
    info: {
      background: semanticColors.info[600],
      foreground: '#ffffff',
      hover: semanticColors.info[500],
      active: semanticColors.info[400],
      light: semanticColors.info[950],
      border: semanticColors.info[700],
    },
  },
} as const

/**
 * 颜色类型定义
 */
export type BaseColors = typeof baseColors
export type SemanticColors = typeof semanticColors
export type LightTheme = typeof lightTheme
export type DarkTheme = typeof darkTheme
export type ThemeColors = LightTheme | DarkTheme
