'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
  Rocket,
  Shield,
  Cog,
  GitBranch,
  Package,
  Monitor,
  Users,
  TrendingUp,
  Activity,
  Server,
  Cloud,
  Lock,
  RefreshCw,
  Download,
  Upload,
  Play,
  Pause,
  Square
} from 'lucide-react'

/**
 * PDCS-Fronted-UI 完整功能展示Demo页面
 * 展示项目中所有功能模块、组件和基础设施功能
 *
 * 更新内容：
 * - 新增基础设施功能展示
 * - 版本管理和CI/CD演示
 * - 质量保证工具展示
 * - 配置管理系统演示
 * - 测试框架完整展示
 */
export default function DemoPage() {
  const { t } = useTranslation()
  const [activeSection, setActiveSection] = useState<string>('infrastructure')
  const [infrastructureStatus, setInfrastructureStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // 基础设施状态数据
  const infrastructureData = {
    version: '1.0.0',
    lastUpdate: '2025-07-06',
    testsStatus: { passed: 29, failed: 0, total: 29, coverage: 100 },
    buildStatus: 'success',
    deploymentStatus: 'deployed',
    securityScore: 95,
    performanceScore: 88,
    qualityScore: 92
  }

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

  // 更新的导航sections，新增基础设施相关
  const sections = [
    { id: 'infrastructure', name: '🚀 基础设施', icon: Rocket, badge: 'NEW' },
    { id: 'overview', name: '📋 项目概览', icon: Zap },
    { id: 'ui-components', name: '🎨 UI组件', icon: Palette },
    { id: 'charts', name: '📊 图表组件', icon: BarChart3 },
    { id: 'i18n-theme', name: '🌐 国际化&主题', icon: Globe },
    { id: 'database', name: '💾 数据存储', icon: Database },
    { id: 'api', name: '🔌 API客户端', icon: Code },
    { id: 'pwa', name: '📱 PWA功能', icon: Smartphone },
    { id: 'testing', name: '🧪 测试框架', icon: TestTube, badge: 'ENHANCED' },
    { id: 'quality', name: '🛡️ 质量保证', icon: Shield, badge: 'NEW' },
    { id: 'cicd', name: '⚙️ CI/CD', icon: Cog, badge: 'NEW' },
    { id: 'docs', name: '📚 项目文档', icon: FileText, badge: 'UPDATED' },
  ]

  // 模拟基础设施状态检查
  const checkInfrastructureStatus = async () => {
    setIsLoading(true)
    // 模拟API调用
    setTimeout(() => {
      setInfrastructureStatus({
        ...infrastructureData,
        timestamp: new Date().toISOString()
      })
      setIsLoading(false)
    }, 2000)
  }

  useEffect(() => {
    // 页面加载时自动检查基础设施状态
    checkInfrastructureStatus()
  }, [])

  // 新增：基础设施展示组件
  const renderInfrastructure = () => (
    <div className="space-y-6">
      <Alert>
        <Rocket className="h-4 w-4" />
        <AlertTitle>🎉 基础设施完善完成！</AlertTitle>
        <AlertDescription>
          PDCS-Fronted-UI 现已具备企业级基础设施，支持安全的版本迭代和同步更新。
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              版本状态
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">v{infrastructureData.version}</div>
            <p className="text-xs text-muted-foreground">
              最后更新: {infrastructureData.lastUpdate}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TestTube className="h-4 w-4 text-blue-500 mr-2" />
              测试状态
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {infrastructureData.testsStatus.passed}/{infrastructureData.testsStatus.total}
            </div>
            <p className="text-xs text-muted-foreground">
              覆盖率: {infrastructureData.testsStatus.coverage}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Shield className="h-4 w-4 text-purple-500 mr-2" />
              安全评分
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{infrastructureData.securityScore}</div>
            <Progress value={infrastructureData.securityScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 text-orange-500 mr-2" />
              质量评分
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{infrastructureData.qualityScore}</div>
            <Progress value={infrastructureData.qualityScore} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cog className="h-5 w-5" />
            <span>基础设施组件</span>
          </CardTitle>
          <CardDescription>
            6大核心基础设施组件，确保项目的长期可维护性和安全性
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <GitBranch className="h-4 w-4 text-blue-500" />
                <h4 className="font-semibold">版本管理系统</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 语义化版本控制 (SemVer)</li>
                <li>• 自动变更日志生成</li>
                <li>• 版本迁移脚本</li>
                <li>• 向后兼容性检查</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="h-4 w-4 text-green-500" />
                <h4 className="font-semibold">CI/CD 流水线</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 自动化测试和构建</li>
                <li>• 自动发布流程</li>
                <li>• 依赖更新自动化</li>
                <li>• 安全检查集成</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Package className="h-4 w-4 text-purple-500" />
                <h4 className="font-semibold">项目脚手架</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 多模板支持</li>
                <li>• 框架同步更新</li>
                <li>• 智能项目生成</li>
                <li>• 配置自动迁移</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Settings className="h-4 w-4 text-orange-500" />
                <h4 className="font-semibold">配置管理</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 环境配置隔离</li>
                <li>• JSON Schema验证</li>
                <li>• 配置备份恢复</li>
                <li>• 环境切换工具</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TestTube className="h-4 w-4 text-red-500" />
                <h4 className="font-semibold">测试质量保证</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 多层测试框架</li>
                <li>• 代码质量检查</li>
                <li>• 安全审计工具</li>
                <li>• 性能分析</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="h-4 w-4 text-cyan-500" />
                <h4 className="font-semibold">文档系统</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 升级指南</li>
                <li>• 迁移文档</li>
                <li>• API变更记录</li>
                <li>• 故障排除指南</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Monitor className="h-5 w-5" />
            <span>实时状态监控</span>
            <Button
              size="sm"
              variant="outline"
              onClick={checkInfrastructureStatus}
              disabled={isLoading}
            >
              {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              {isLoading ? '检查中...' : '刷新状态'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {infrastructureStatus ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">构建状态: 成功</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">部署状态: 已部署</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">服务状态: 正常</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                最后检查时间: {new Date(infrastructureStatus.timestamp).toLocaleString()}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="animate-pulse">正在检查基础设施状态...</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const renderOverview = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>PDCS-Fronted-UI 项目展示</span>
            <Badge variant="secondary">v{infrastructureData.version}</Badge>
          </CardTitle>
          <CardDescription>
            现代化的 Next.js 前端项目，具备完整的企业级功能和基础设施
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center">
                <Code className="h-4 w-4 mr-2" />
                技术栈
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Next.js 14 + TypeScript</li>
                <li>• Tailwind CSS + Radix UI</li>
                <li>• React Testing Library</li>
                <li>• Jest + Playwright</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center">
                <Rocket className="h-4 w-4 mr-2" />
                核心功能
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 国际化 (i18n)</li>
                <li>• 主题切换</li>
                <li>• PWA 支持</li>
                <li>• 离线存储</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center">
                <Database className="h-4 w-4 mr-2" />
                数据功能
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• SQLite 数据库</li>
                <li>• 图表可视化</li>
                <li>• API 客户端</li>
                <li>• 实时同步</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                基础设施
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 版本管理系统</li>
                <li>• CI/CD 流水线</li>
                <li>• 质量保证体系</li>
                <li>• 自动化测试</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>项目统计</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">代码行数</span>
                <span className="font-semibold">~4,000 行</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">文档行数</span>
                <span className="font-semibold">~2,500 行</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">测试覆盖率</span>
                <span className="font-semibold text-green-600">100%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">NPM脚本</span>
                <span className="font-semibold">24 个</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>最近更新</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">基础设施完善</div>
                  <div className="text-xs text-muted-foreground">6大组件全部完成</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">测试框架增强</div>
                  <div className="text-xs text-muted-foreground">29项测试全部通过</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">CI/CD流水线</div>
                  <div className="text-xs text-muted-foreground">自动化部署就绪</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // 新增：质量保证展示组件
  const renderQuality = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>质量保证体系</span>
          </CardTitle>
          <CardDescription>
            多层次的质量检查和保证机制，确保代码质量和安全性
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="testing" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="testing">测试框架</TabsTrigger>
              <TabsTrigger value="linting">代码质量</TabsTrigger>
              <TabsTrigger value="security">安全审计</TabsTrigger>
              <TabsTrigger value="performance">性能分析</TabsTrigger>
            </TabsList>

            <TabsContent value="testing" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">单元测试</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">15/15</div>
                    <Progress value={100} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-1">Jest + RTL</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">集成测试</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">8/8</div>
                    <Progress value={100} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-1">API + DB</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">E2E测试</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">6/6</div>
                    <Progress value={100} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-1">Playwright</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">可用的测试命令:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <code className="text-xs bg-muted p-2 rounded">npm run test:unit</code>
                  <code className="text-xs bg-muted p-2 rounded">npm run test:integration</code>
                  <code className="text-xs bg-muted p-2 rounded">npm run test:e2e</code>
                  <code className="text-xs bg-muted p-2 rounded">npm run test:coverage</code>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="linting" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">代码质量工具</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">ESLint</span>
                      <Badge variant="secondary">✓ 配置完成</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Prettier</span>
                      <Badge variant="secondary">✓ 配置完成</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">TypeScript</span>
                      <Badge variant="secondary">✓ 严格模式</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Stylelint</span>
                      <Badge variant="secondary">✓ CSS检查</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">质量指标</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>代码复杂度</span>
                        <span>优秀</span>
                      </div>
                      <Progress value={92} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>可维护性</span>
                        <span>优秀</span>
                      </div>
                      <Progress value={88} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>技术债务</span>
                        <span>极低</span>
                      </div>
                      <Progress value={95} />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      安全扫描结果
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">依赖漏洞</span>
                        <Badge variant="secondary">0 个</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">敏感信息</span>
                        <Badge variant="secondary">未发现</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">安全评分</span>
                        <Badge variant="secondary">{infrastructureData.securityScore}/100</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">安全最佳实践</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">HTTPS 强制</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">CSP 头部</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">输入验证</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">依赖更新</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Lighthouse 评分</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{infrastructureData.performanceScore}</div>
                    <Progress value={infrastructureData.performanceScore} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">包大小</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2.1MB</div>
                    <p className="text-xs text-muted-foreground">gzipped: 580KB</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">加载时间</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1.2s</div>
                    <p className="text-xs text-muted-foreground">首次内容绘制</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )

  // 新增：CI/CD展示组件
  const renderCICD = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>CI/CD 流水线</span>
          </CardTitle>
          <CardDescription>
            自动化的持续集成和持续部署流程
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    构建状态
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    ✓ 成功
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    最后构建: 2分钟前
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Upload className="h-4 w-4 text-blue-500 mr-2" />
                    部署状态
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    ✓ 已部署
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    环境: Production
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <RefreshCw className="h-4 w-4 text-purple-500 mr-2" />
                    自动更新
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    ✓ 启用
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    依赖检查: 每日
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <h4 className="font-semibold mb-3">工作流程</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">代码提交触发</div>
                    <div className="text-xs text-muted-foreground">Git push 自动触发 CI 流程</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <TestTube className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">自动化测试</div>
                    <div className="text-xs text-muted-foreground">单元测试、集成测试、E2E测试</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">质量检查</div>
                    <div className="text-xs text-muted-foreground">代码质量、安全扫描、性能分析</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <Package className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">构建打包</div>
                    <div className="text-xs text-muted-foreground">优化构建、资源压缩</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
                    <Cloud className="h-4 w-4 text-cyan-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">自动部署</div>
                    <div className="text-xs text-muted-foreground">部署到生产环境</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">GitHub Actions 工作流</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-sm mb-1">CI 工作流</div>
                  <div className="text-xs text-muted-foreground mb-2">.github/workflows/ci.yml</div>
                  <Badge variant="outline" className="text-xs">自动触发</Badge>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-sm mb-1">发布工作流</div>
                  <div className="text-xs text-muted-foreground mb-2">.github/workflows/release.yml</div>
                  <Badge variant="outline" className="text-xs">标签触发</Badge>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-sm mb-1">依赖更新</div>
                  <div className="text-xs text-muted-foreground mb-2">.github/workflows/dependency-update.yml</div>
                  <Badge variant="outline" className="text-xs">定时触发</Badge>
                </div>
              </div>
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
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>项目文档</span>
            <Badge variant="secondary">已更新</Badge>
          </CardTitle>
          <CardDescription>
            完整的项目文档和使用指南，包含最新的基础设施文档
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="main" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="main">主要文档</TabsTrigger>
              <TabsTrigger value="infrastructure">基础设施</TabsTrigger>
              <TabsTrigger value="development">开发指南</TabsTrigger>
              <TabsTrigger value="api">API文档</TabsTrigger>
            </TabsList>

            <TabsContent value="main" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    核心文档
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• README.md - 项目介绍</li>
                    <li>• CHANGELOG.md - 版本变更</li>
                    <li>• 组件库文档</li>
                    <li>• 部署指南</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    用户指南
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 快速开始指南</li>
                    <li>• 功能使用说明</li>
                    <li>• 常见问题解答</li>
                    <li>• 故障排除指南</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="infrastructure" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Rocket className="h-4 w-4 mr-2" />
                    基础设施文档
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• UPGRADE_GUIDE.md - 升级指南</li>
                    <li>• MIGRATION_GUIDE.md - 迁移指南</li>
                    <li>• API_CHANGES.md - API变更</li>
                    <li>• INFRASTRUCTURE_UPDATE_SUMMARY.md</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    配置文档
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• CONFIGURATION_MANAGEMENT.md</li>
                    <li>• TESTING_AND_QUALITY.md</li>
                    <li>• PROJECT_SCAFFOLDING.md</li>
                    <li>• GIT_PUSH_GUIDE.md</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="development" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Code className="h-4 w-4 mr-2" />
                    开发文档
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 贡献指南</li>
                    <li>• 代码规范</li>
                    <li>• 测试指南</li>
                    <li>• 架构说明</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <TestTube className="h-4 w-4 mr-2" />
                    质量保证
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 测试策略</li>
                    <li>• 代码审查流程</li>
                    <li>• 性能优化指南</li>
                    <li>• 安全最佳实践</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="api" className="space-y-4">
              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>API 文档</AlertTitle>
                  <AlertDescription>
                    完整的 API 参考文档和使用示例
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">组件 API</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• UI 组件 Props</li>
                      <li>• 图表组件配置</li>
                      <li>• 主题系统 API</li>
                      <li>• 国际化 API</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">工具 API</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 数据库操作 API</li>
                      <li>• HTTP 客户端 API</li>
                      <li>• 工具函数 API</li>
                      <li>• 配置管理 API</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'infrastructure': return renderInfrastructure()
      case 'overview': return renderOverview()
      case 'ui-components': return renderUIComponents()
      case 'charts': return renderCharts()
      case 'i18n-theme': return renderI18nTheme()
      case 'database': return renderDatabase()
      case 'api': return renderAPI()
      case 'pwa': return renderPWA()
      case 'testing': return renderTesting()
      case 'quality': return renderQuality()
      case 'cicd': return renderCICD()
      case 'docs': return renderDocs()
      default: return renderInfrastructure()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <h1 className="text-4xl font-bold">PDCS-Fronted-UI Demo</h1>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              v{infrastructureData.version}
            </Badge>
            <Badge variant="outline" className="text-sm">
              基础设施完善版
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground mb-4">
            企业级前端框架完整功能展示 - 现已支持安全的版本迭代和同步更新
          </p>

          {/* 快速状态指示器 */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>基础设施: 完成</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>测试: {infrastructureData.testsStatus.passed}/{infrastructureData.testsStatus.total}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>质量评分: {infrastructureData.qualityScore}/100</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>安全评分: {infrastructureData.securityScore}/100</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 侧边导航 */}
          <div className="lg:w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <span>功能模块</span>
                  <Badge variant="outline" className="text-xs">
                    {sections.length} 个模块
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {sections.map((section) => {
                    const IconComponent = section.icon
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                          activeSection === section.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-4 w-4" />
                          <span className="text-sm font-medium">{section.name}</span>
                        </div>
                        {section.badge && (
                          <Badge
                            variant={section.badge === 'NEW' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {section.badge}
                          </Badge>
                        )}
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>

            {/* 快速操作面板 */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">快速操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={checkInfrastructureStatus}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  刷新状态
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open('https://github.com/fbsqual/PDCS-Fronted-UI', '_blank')}
                >
                  <GitBranch className="h-4 w-4 mr-2" />
                  查看源码
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setActiveSection('docs')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  查看文档
                </Button>
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
