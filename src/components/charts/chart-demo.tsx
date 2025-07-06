'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart } from './line-chart'
import { BarChart } from './bar-chart'
import { PieChart } from './pie-chart'
import { AreaChart } from './area-chart'
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, TrendingUp } from 'lucide-react'

/**
 * 图表类型
 */
type ChartType = 'line' | 'bar' | 'pie' | 'area'

/**
 * 图表选项配置
 */
const chartOptions = [
  {
    type: 'line' as ChartType,
    name: 'demo.charts.line',
    icon: LineChartIcon,
    description: '展示数据趋势变化'
  },
  {
    type: 'bar' as ChartType,
    name: 'demo.charts.bar',
    icon: BarChart3,
    description: '比较不同类别数据'
  },
  {
    type: 'pie' as ChartType,
    name: 'demo.charts.pie',
    icon: PieChartIcon,
    description: '显示数据占比分布'
  },
  {
    type: 'area' as ChartType,
    name: 'demo.charts.area',
    icon: TrendingUp,
    description: '展示累积数据变化'
  }
]

/**
 * 生成示例数据
 */
const generateSampleData = () => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月']
  const lineData = months.map(month => ({
    name: month,
    value: Math.floor(Math.random() * 1000) + 100,
    value2: Math.floor(Math.random() * 800) + 50
  }))

  const barData = [
    { name: '产品A', value: Math.floor(Math.random() * 500) + 100 },
    { name: '产品B', value: Math.floor(Math.random() * 500) + 100 },
    { name: '产品C', value: Math.floor(Math.random() * 500) + 100 },
    { name: '产品D', value: Math.floor(Math.random() * 500) + 100 },
    { name: '产品E', value: Math.floor(Math.random() * 500) + 100 }
  ]

  const pieData = [
    { name: '桌面端', value: Math.floor(Math.random() * 400) + 100, color: '#3b82f6' },
    { name: '移动端', value: Math.floor(Math.random() * 300) + 100, color: '#ef4444' },
    { name: '平板端', value: Math.floor(Math.random() * 200) + 50, color: '#22c55e' },
    { name: '其他', value: Math.floor(Math.random() * 100) + 20, color: '#f59e0b' }
  ]

  const areaData = months.map(month => ({
    name: month,
    销售额: Math.floor(Math.random() * 2000) + 500,
    利润: Math.floor(Math.random() * 800) + 200,
    成本: Math.floor(Math.random() * 1200) + 300
  }))

  return { lineData, barData, pieData, areaData }
}

/**
 * 图表演示组件
 * 展示各种类型的图表组件
 */
export function ChartDemo() {
  const { t } = useTranslation()
  const [activeChart, setActiveChart] = useState<ChartType>('line')
  const [data, setData] = useState(generateSampleData())

  /**
   * 刷新数据
   */
  const refreshData = () => {
    setData(generateSampleData())
  }

  /**
   * 渲染图表
   */
  const renderChart = () => {
    switch (activeChart) {
      case 'line':
        return (
          <LineChart
            data={data.lineData}
            xKey="name"
            yKeys={[
              { key: 'value', name: '销售量', color: '#3b82f6' },
              { key: 'value2', name: '访问量', color: '#ef4444' }
            ]}
            height={300}
          />
        )
      case 'bar':
        return (
          <BarChart
            data={data.barData}
            xKey="name"
            yKey="value"
            color="#22c55e"
            height={300}
          />
        )
      case 'pie':
        return (
          <PieChart
            data={data.pieData}
            nameKey="name"
            valueKey="value"
            colorKey="color"
            height={300}
          />
        )
      case 'area':
        return (
          <AreaChart
            data={data.areaData}
            xKey="name"
            yKeys={[
              { key: '销售额', name: '销售额', color: '#3b82f6' },
              { key: '利润', name: '利润', color: '#22c55e' },
              { key: '成本', name: '成本', color: '#ef4444' }
            ]}
            height={300}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* 图表类型选择 */}
      <div className="flex flex-wrap gap-2">
        {chartOptions.map((option) => {
          const IconComponent = option.icon
          const isActive = activeChart === option.type
          
          return (
            <Button
              key={option.type}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveChart(option.type)}
              className="flex items-center space-x-2"
            >
              <IconComponent className="h-4 w-4" />
              <span>{t(option.name, option.type)}</span>
            </Button>
          )
        })}
        
        <Button
          variant="secondary"
          size="sm"
          onClick={refreshData}
          className="ml-auto"
        >
          刷新数据
        </Button>
      </div>

      {/* 图表显示区域 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {(() => {
              const activeOption = chartOptions.find(opt => opt.type === activeChart)
              const IconComponent = activeOption?.icon || LineChartIcon
              return <IconComponent className="h-5 w-5" />
            })()}
            <span>
              {t(
                chartOptions.find(opt => opt.type === activeChart)?.name || 'demo.charts.line',
                activeChart
              )}
            </span>
          </CardTitle>
          <CardDescription>
            {chartOptions.find(opt => opt.type === activeChart)?.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="chart-container">
            {renderChart()}
          </div>
        </CardContent>
      </Card>

      {/* 图表说明 */}
      <Card>
        <CardHeader>
          <CardTitle>图表功能特性</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">响应式设计</h4>
              <p className="text-muted-foreground">
                图表会根据容器大小自动调整，适配不同屏幕尺寸
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">交互功能</h4>
              <p className="text-muted-foreground">
                支持鼠标悬停显示详细数据，点击图例切换数据系列
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">主题适配</h4>
              <p className="text-muted-foreground">
                自动适配亮色/暗色主题，保持视觉一致性
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">数据更新</h4>
              <p className="text-muted-foreground">
                支持动态数据更新，平滑的动画过渡效果
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
