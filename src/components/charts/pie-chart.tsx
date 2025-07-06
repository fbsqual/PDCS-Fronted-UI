'use client'

import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { useTheme } from 'next-themes'

/**
 * 饼图组件属性接口
 */
export interface PieChartProps {
  /**
   * 图表数据
   */
  data: any[]
  
  /**
   * 名称字段键名
   */
  nameKey: string
  
  /**
   * 数值字段键名
   */
  valueKey: string
  
  /**
   * 颜色字段键名（可选）
   */
  colorKey?: string
  
  /**
   * 默认颜色配置
   */
  colors?: string[]
  
  /**
   * 图表高度
   */
  height?: number
  
  /**
   * 是否显示图例
   */
  showLegend?: boolean
  
  /**
   * 是否显示工具提示
   */
  showTooltip?: boolean
  
  /**
   * 是否显示标签
   */
  showLabels?: boolean
  
  /**
   * 内半径（环形图）
   */
  innerRadius?: number
  
  /**
   * 外半径
   */
  outerRadius?: number
  
  /**
   * 自定义样式类名
   */
  className?: string
}

/**
 * 饼图组件
 * 基于Recharts的响应式饼图组件
 * 
 * @example
 * ```tsx
 * const data = [
 *   { name: '桌面端', value: 400, color: '#3b82f6' },
 *   { name: '移动端', value: 300, color: '#ef4444' },
 * ]
 * 
 * <PieChart
 *   data={data}
 *   nameKey="name"
 *   valueKey="value"
 *   colorKey="color"
 *   height={300}
 * />
 * ```
 */
export function PieChart({
  data,
  nameKey,
  valueKey,
  colorKey,
  colors,
  height = 400,
  showLegend = true,
  showTooltip = true,
  showLabels = false,
  innerRadius = 0,
  outerRadius = 120,
  className
}: PieChartProps) {
  const { theme } = useTheme()
  
  // 根据主题设置颜色
  const isDark = theme === 'dark'
  const textColor = isDark ? '#d1d5db' : '#374151'
  const tooltipBg = isDark ? '#1f2937' : '#ffffff'
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb'

  // 默认颜色配置
  const defaultColors = [
    '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', 
    '#8b5cf6', '#06b6d4', '#f97316', '#84cc16',
    '#ec4899', '#14b8a6', '#f43f5e', '#10b981'
  ]

  /**
   * 获取颜色
   */
  const getColor = (entry: any, index: number) => {
    if (colorKey && entry[colorKey]) {
      return entry[colorKey]
    }
    if (colors && colors[index]) {
      return colors[index]
    }
    return defaultColors[index % defaultColors.length]
  }

  /**
   * 自定义工具提示组件
   */
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const total = payload[0].payload.total || 
        payload[0].payload.data?.reduce((sum: number, item: any) => sum + item[valueKey], 0)
      const percentage = total ? ((data[valueKey] / total) * 100).toFixed(1) : '0'
      
      return (
        <div 
          className="rounded-lg border p-3 shadow-lg"
          style={{ 
            backgroundColor: tooltipBg,
            borderColor: tooltipBorder
          }}
        >
          <p className="font-medium mb-2" style={{ color: textColor }}>
            {data[nameKey]}
          </p>
          <p className="text-sm" style={{ color: payload[0].color }}>
            数值: {data[valueKey].toLocaleString()}
          </p>
          <p className="text-sm" style={{ color: textColor }}>
            占比: {percentage}%
          </p>
        </div>
      )
    }
    return null
  }

  /**
   * 自定义图例组件
   */
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span 
              className="text-sm"
              style={{ color: textColor }}
            >
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }

  /**
   * 自定义标签渲染
   */
  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    if (percent < 0.05) return null // 不显示小于5%的标签

    return (
      <text 
        x={x} 
        y={y} 
        fill={textColor} 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  // 计算总数用于百分比计算
  const total = data.reduce((sum, item) => sum + item[valueKey], 0)
  const dataWithTotal = data.map(item => ({ ...item, total }))

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: showLegend ? 60 : 20,
          }}
        >
          <Pie
            data={dataWithTotal}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={showLabels ? renderLabel : false}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey={valueKey}
            nameKey={nameKey}
          >
            {dataWithTotal.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getColor(entry, index)}
                stroke={isDark ? '#1f2937' : '#ffffff'}
                strokeWidth={2}
              />
            ))}
          </Pie>
          
          {/* 工具提示 */}
          {showTooltip && (
            <Tooltip content={<CustomTooltip />} />
          )}
          
          {/* 图例 */}
          {showLegend && (
            <Legend content={<CustomLegend />} />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}
