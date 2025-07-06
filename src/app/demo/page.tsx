'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageToggle } from '@/components/language-toggle'
import { DatabaseDemo } from '@/components/database-demo'
import { ApiDemo } from '@/components/api-demo'
import { DebugPanel } from '@/components/debug-panel'
import { LineChart } from '@/components/charts/line-chart'
import { BarChart } from '@/components/charts/bar-chart'
import { PieChart } from '@/components/charts/pie-chart'
import { AreaChart } from '@/components/charts/area-chart'
import { 
  Palette, 
  Globe, 
  Database, 
  BarChart3, 
  Settings, 
  TestTube,
  FileText,
  Smartphone,
  Code,
  Zap
} from 'lucide-react'

/**
 * 组件展示Demo页面
 * 展示项目中所有功能模块和组件
 */
export default function DemoPage() {
  const { t } = useTranslation()
  const [activeSection, setActiveSection] = useState<string>('overview')

  // 示例图表数据
  const chartData = [
    { month: '1月', 销售额: 4000, 利润: 2400, 用户数: 240 },
    { month: '2月', 销售额: 3000, 利润: 1398, 用户数: 221 },
    { month: '3月', 销售额: 2000, 利润: 9800, 用户数: 229 },
    { month: '4月', 销售额: 2780, 利润: 3908, 用户数: 200 },
    { month: '5月', 销售额: 1890, 利润: 4800, 用户数: 218 },
    { month: '6月', 销售额: 2390, 利润: 3800, 用户数: 250 },
  ]

  const pieData = [
    { name: '移动端', value: 400, color: '#0088FE' },
    { name: '桌面端', value: 300, color: '#00C49F' },
    { name: '平板端', value: 200, color: '#FFBB28' },
    { name: '其他', value: 100, color: '#FF8042' },
  ]

  const sections = [
    { id: 'overview', name: '项目概览', icon: Zap },
    { id: 'ui-components', name: 'UI组件', icon: Palette },
    { id: 'charts', name: '图表组件', icon: BarChart3 },
    { id: 'i18n-theme', name: '国际化&主题', icon: Globe },
    { id: 'database', name: '数据存储', icon: Database },
    { id: 'api', name: 'API客户端', icon: Code },
    { id: 'pwa', name: 'PWA功能', icon: Smartphone },
    { id: 'testing', name: '测试框架', icon: TestTube },
    { id: 'docs', name: '项目文档', icon: FileText },
  ]

  const renderOverview = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>PDCS Frontend 项目展示</span>
          </CardTitle>
          <CardDescription>
            现代化的 Next.js 前端项目，具备完整的企业级功能
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">🚀 技术栈</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Next.js 14 + TypeScript</li>
                <li>• Tailwind CSS + Radix UI</li>
                <li>• React Testing Library</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">🌟 核心功能</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 国际化 (i18n)</li>
                <li>• 主题切换</li>
                <li>• PWA 支持</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">📊 数据功能</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• SQLite 数据库</li>
                <li>• 图表可视化</li>
                <li>• API 客户端</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderUIComponents = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>按钮组件</CardTitle>
          <CardDescription>不同样式和尺寸的按钮组件</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="default">默认按钮</Button>
            <Button variant="secondary">次要按钮</Button>
            <Button variant="destructive">危险按钮</Button>
            <Button variant="outline">边框按钮</Button>
            <Button variant="ghost">幽灵按钮</Button>
            <Button variant="link">链接按钮</Button>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <Button size="sm">小按钮</Button>
            <Button size="default">默认按钮</Button>
            <Button size="lg">大按钮</Button>
            <Button size="icon">🔍</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>输入组件</CardTitle>
          <CardDescription>各种类型的输入框组件</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="文本输入框" />
            <Input type="email" placeholder="邮箱输入框" />
            <Input type="password" placeholder="密码输入框" />
            <Input disabled placeholder="禁用输入框" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>卡片组件</CardTitle>
          <CardDescription>展示内容的卡片容器</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>示例卡片 1</CardTitle>
                <CardDescription>这是一个示例卡片的描述</CardDescription>
              </CardHeader>
              <CardContent>
                <p>卡片内容区域</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>示例卡片 2</CardTitle>
                <CardDescription>另一个示例卡片</CardDescription>
              </CardHeader>
              <CardContent>
                <p>更多卡片内容</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderCharts = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>折线图</CardTitle>
          <CardDescription>展示数据趋势的折线图组件</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart
            data={chartData}
            xKey="month"
            yKeys={[
              { key: '销售额', name: '销售额', color: '#3b82f6' },
              { key: '利润', name: '利润', color: '#22c55e' }
            ]}
            height={300}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>柱状图</CardTitle>
            <CardDescription>比较不同类别数据</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={chartData}
              xKey="month"
              yKeys={[
                { key: '用户数', name: '用户数', color: '#8884d8' }
              ]}
              height={250}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>饼图</CardTitle>
            <CardDescription>展示数据占比</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart
              data={pieData}
              valueKey="value"
              nameKey="name"
              height={250}
              colors={['#0088FE', '#00C49F', '#FFBB28', '#FF8042']}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>面积图</CardTitle>
          <CardDescription>展示数据变化趋势的面积图</CardDescription>
        </CardHeader>
        <CardContent>
          <AreaChart
            data={chartData}
            xKey="month"
            yKeys={[
              { key: '销售额', name: '销售额', color: '#3b82f6' },
              { key: '利润', name: '利润', color: '#22c55e' }
            ]}
            height={300}
            stacked={false}
          />
        </CardContent>
      </Card>
    </div>
  )

  const renderI18nTheme = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>主题切换</CardTitle>
          <CardDescription>支持浅色、深色和系统主题</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <span className="text-sm text-muted-foreground">
              点击切换主题模式
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>语言切换</CardTitle>
          <CardDescription>支持中文、英文、日文三种语言</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            <span className="text-sm text-muted-foreground">
              点击切换界面语言
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>国际化示例</CardTitle>
          <CardDescription>动态翻译文本示例</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>当前语言:</strong> {t('common.language')}</p>
            <p><strong>欢迎信息:</strong> {t('welcome.title')}</p>
            <p><strong>按钮文本:</strong> {t('common.confirm')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderDatabase = () => (
    <div className="space-y-6">
      <DatabaseDemo />
    </div>
  )

  const renderAPI = () => (
    <div className="space-y-6">
      <ApiDemo />
    </div>
  )

  const renderPWA = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>PWA 功能</CardTitle>
          <CardDescription>渐进式Web应用功能展示</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">📱 安装应用</h4>
              <p className="text-sm text-muted-foreground mb-3">
                支持安装到桌面和移动设备
              </p>
              <Button size="sm">安装应用</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">🔄 离线支持</h4>
              <p className="text-sm text-muted-foreground mb-3">
                支持离线访问和数据缓存
              </p>
              <Button size="sm" variant="outline">检查状态</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">💾 本地存储</h4>
              <p className="text-sm text-muted-foreground mb-3">
                SQLite + LocalForage 双重存储
              </p>
              <Button size="sm" variant="secondary">查看数据</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">🔔 推送通知</h4>
              <p className="text-sm text-muted-foreground mb-3">
                支持浏览器推送通知
              </p>
              <Button size="sm" variant="ghost">启用通知</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderTesting = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>测试框架</CardTitle>
          <CardDescription>Jest + React Testing Library 测试配置</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">🧪 测试命令</h4>
              <div className="space-y-2 text-sm font-mono">
                <div><code>npm run test</code> - 运行所有测试</div>
                <div><code>npm run test:watch</code> - 监听模式</div>
                <div><code>npm run test:coverage</code> - 生成覆盖率报告</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">✅ 组件测试</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Button 组件测试</li>
                  <li>• ThemeToggle 测试</li>
                  <li>• 图表组件测试</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">🔧 工具测试</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• API 客户端测试</li>
                  <li>• 数据库管理测试</li>
                  <li>• 工具函数测试</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderDocs = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>项目文档</CardTitle>
          <CardDescription>完整的项目文档和使用指南</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">📖 主要文档</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• README.md - 项目介绍</li>
                <li>• 组件库文档</li>
                <li>• API 使用文档</li>
                <li>• 部署指南</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">🔧 开发文档</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 贡献指南</li>
                <li>• 代码规范</li>
                <li>• 测试指南</li>
                <li>• 架构说明</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return renderOverview()
      case 'ui-components': return renderUIComponents()
      case 'charts': return renderCharts()
      case 'i18n-theme': return renderI18nTheme()
      case 'database': return renderDatabase()
      case 'api': return renderAPI()
      case 'pwa': return renderPWA()
      case 'testing': return renderTesting()
      case 'docs': return renderDocs()
      default: return renderOverview()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">组件展示 Demo</h1>
          <p className="text-xl text-muted-foreground">
            PDCS Frontend 项目功能完整展示
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 侧边导航 */}
          <div className="lg:w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">功能模块</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {sections.map((section) => {
                    const IconComponent = section.icon
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                          activeSection === section.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm font-medium">{section.name}</span>
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* 主要内容区域 */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* 调试面板 */}
      <DebugPanel />
    </div>
  )
}
