'use client'

import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { useTheme } from 'next-themes'

/**
 * Y轴数据配置接口
 */
export interface YAxisConfig {
  key: string
  name: string
  color: string
}

/**
 * 折线图组件属性接口
 */
export interface LineChartProps {
  /**
   * 图表数据
   */
  data: any[]
  
  /**
   * X轴数据键名
   */
  xKey: string
  
  /**
   * Y轴数据配置
   */
  yKeys: YAxisConfig[]
  
  /**
   * 图表高度
   */
  height?: number
  
  /**
   * 是否显示网格
   */
  showGrid?: boolean
  
  /**
   * 是否显示图例
   */
  showLegend?: boolean
  
  /**
   * 是否显示工具提示
   */
  showTooltip?: boolean
  
  /**
   * 线条样式
   */
  strokeWidth?: number
  
  /**
   * 是否平滑曲线
   */
  smooth?: boolean
  
  /**
   * 自定义样式类名
   */
  className?: string
}

/**
 * 折线图组件
 * 基于Recharts的响应式折线图组件
 * 
 * @example
 * ```tsx
 * const data = [
 *   { month: '1月', sales: 100, visits: 200 },
 *   { month: '2月', sales: 150, visits: 250 },
 * ]
 * 
 * <LineChart
 *   data={data}
 *   xKey="month"
 *   yKeys={[
 *     { key: 'sales', name: '销售量', color: '#3b82f6' },
 *     { key: 'visits', name: '访问量', color: '#ef4444' }
 *   ]}
 *   height={300}
 * />
 * ```
 */
export function LineChart({
  data,
  xKey,
  yKeys,
  height = 400,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  strokeWidth = 2,
  smooth = true,
  className
}: LineChartProps) {
  const { theme } = useTheme()
  
  // 根据主题设置颜色
  const isDark = theme === 'dark'
  const gridColor = isDark ? '#374151' : '#e5e7eb'
  const textColor = isDark ? '#d1d5db' : '#374151'
  const tooltipBg = isDark ? '#1f2937' : '#ffffff'
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb'

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
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
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
      <div className="flex justify-center space-x-6 mt-4">
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

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: showLegend ? 60 : 20,
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
          
          {/* X轴 */}
          <XAxis 
            dataKey={xKey}
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColor, fontSize: 12 }}
          />
          
          {/* Y轴 */}
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColor, fontSize: 12 }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          
          {/* 工具提示 */}
          {showTooltip && (
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ stroke: gridColor, strokeWidth: 1 }}
            />
          )}
          
          {/* 图例 */}
          {showLegend && (
            <Legend 
              content={<CustomLegend />}
            />
          )}
          
          {/* 折线 */}
          {yKeys.map((config, index) => (
            <Line
              key={config.key}
              type={smooth ? 'monotone' : 'linear'}
              dataKey={config.key}
              name={config.name}
              stroke={config.color}
              strokeWidth={strokeWidth}
              dot={{ 
                fill: config.color, 
                strokeWidth: 2, 
                r: 4 
              }}
              activeDot={{ 
                r: 6, 
                stroke: config.color, 
                strokeWidth: 2,
                fill: tooltipBg
              }}
              connectNulls={false}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}
