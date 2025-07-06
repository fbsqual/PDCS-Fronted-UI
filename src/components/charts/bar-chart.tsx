'use client'

import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts'
import { useTheme } from 'next-themes'

/**
 * 柱状图组件属性接口
 */
export interface BarChartProps {
  /**
   * 图表数据
   */
  data: any[]
  
  /**
   * X轴数据键名
   */
  xKey: string
  
  /**
   * Y轴数据键名
   */
  yKey: string
  
  /**
   * 柱子颜色
   */
  color?: string
  
  /**
   * 多色柱子（每个柱子不同颜色）
   */
  colors?: string[]
  
  /**
   * 图表高度
   */
  height?: number
  
  /**
   * 是否显示网格
   */
  showGrid?: boolean
  
  /**
   * 是否显示工具提示
   */
  showTooltip?: boolean
  
  /**
   * 柱子圆角半径
   */
  radius?: number
  
  /**
   * 自定义样式类名
   */
  className?: string
  
  /**
   * 是否水平显示
   */
  horizontal?: boolean
}

/**
 * 柱状图组件
 * 基于Recharts的响应式柱状图组件
 * 
 * @example
 * ```tsx
 * const data = [
 *   { name: '产品A', value: 100 },
 *   { name: '产品B', value: 150 },
 * ]
 * 
 * <BarChart
 *   data={data}
 *   xKey="name"
 *   yKey="value"
 *   color="#3b82f6"
 *   height={300}
 * />
 * ```
 */
export function BarChart({
  data,
  xKey,
  yKey,
  color = '#3b82f6',
  colors,
  height = 400,
  showGrid = true,
  showTooltip = true,
  radius = 4,
  className,
  horizontal = false
}: BarChartProps) {
  const { theme } = useTheme()
  
  // 根据主题设置颜色
  const isDark = theme === 'dark'
  const gridColor = isDark ? '#374151' : '#e5e7eb'
  const textColor = isDark ? '#d1d5db' : '#374151'
  const tooltipBg = isDark ? '#1f2937' : '#ffffff'
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb'

  // 默认多色配置
  const defaultColors = [
    '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', 
    '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'
  ]

  /**
   * 自定义工具提示组件
   */
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="rounded-lg border p-3 shadow-lg"
          style={{ 
            backgroundColor: tooltipBg,
            borderColor: tooltipBorder
          }}
        >
          <p className="font-medium mb-2" style={{ color: textColor }}>
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p 
              key={index}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name || yKey}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  /**
   * 获取柱子颜色
   */
  const getBarColor = (index: number) => {
    if (colors && colors[index]) {
      return colors[index]
    }
    if (colors) {
      return defaultColors[index % defaultColors.length]
    }
    return color
  }

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          layout={horizontal ? 'horizontal' : 'vertical'}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          {/* 网格 */}
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={gridColor}
              opacity={0.5}
            />
          )}
          
          {/* 坐标轴 */}
          {horizontal ? (
            <>
              <XAxis 
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: textColor, fontSize: 12 }}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <YAxis 
                type="category"
                dataKey={xKey}
                axisLine={false}
                tickLine={false}
                tick={{ fill: textColor, fontSize: 12 }}
                width={80}
              />
            </>
          ) : (
            <>
              <XAxis 
                dataKey={xKey}
                axisLine={false}
                tickLine={false}
                tick={{ fill: textColor, fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: textColor, fontSize: 12 }}
                tickFormatter={(value) => value.toLocaleString()}
              />
            </>
          )}
          
          {/* 工具提示 */}
          {showTooltip && (
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: gridColor, opacity: 0.1 }}
            />
          )}
          
          {/* 柱子 */}
          <Bar 
            dataKey={yKey}
            radius={horizontal ? [0, radius, radius, 0] : [radius, radius, 0, 0]}
          >
            {/* 多色柱子 */}
            {(colors || data.length <= 8) && data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getBarColor(index)} 
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
