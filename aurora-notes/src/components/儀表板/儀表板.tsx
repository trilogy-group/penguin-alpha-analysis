'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Users, Eye, Heart, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

interface 儀表板統計 {
  總文章數: number
  總瀏覽次數: number
  總喜歡次數: number
  總使用者數: number
  本月文章數: number
  本月瀏覽次數: number
  本月喜歡次數: number
  本月新使用者數: number
}

interface 月度統計 {
  月份: string
  文章數: number
  瀏覽次數: number
  喜歡次數: number
  新使用者數: number
}

interface 標籤統計 {
  名稱: string
  文章數: number
  瀏覽次數: number
}

interface 熱門文章 {
  id: string
  標題: string
  瀏覽次數: number
  喜歡次數: number
  發布時間: string
}

const 顏色 = ['#22c55e', '#16a34a', '#15803d', '#86efac', '#4ade80', '#bbf7d0']

export function 儀表板() {
  const [統計資料, 設定統計資料] = useState<儀表板統計 | null>(null)
  const [月度資料, 設定月度資料] = useState<月度統計[]>([])
  const [標籤資料, 設定標籤資料] = useState<標籤統計[]>([])
  const [熱門文章, 設定熱門文章] = useState<熱門文章[]>([])
  const [載入中, 設定載入中] = useState(true)
  const [錯誤, 設定錯誤] = useState<string | null>(null)

  useEffect(() => {
    const 獲取儀表板資料 = async () => {
      try {
        設定載入中(true)
        設定錯誤(null)

        const 回應 = await fetch('/api/儀表板')
        if (!回應.ok) {
          throw new Error('獲取儀表板資料失敗')
        }

        const 資料 = await 回應.json()
        設定統計資料(資料.統計)
        設定月度資料(資料.月度統計)
        設定標籤資料(資料.標籤統計)
        設定熱門文章(資料.熱門文章)
      } catch (錯誤) {
        console.error('獲取儀表板資料錯誤:', 錯誤)
        設定錯誤(錯誤 instanceof Error ? 錯誤.message : '發生未知錯誤')
      } finally {
        設定載入中(false)
      }
    }

    獲取儀表板資料()
  }, [])

  const 格式化數字 = (數字: number) => {
    if (數字 >= 1000000) {
      return `${(數字 / 1000000).toFixed(1)}M`
    }
    if (數字 >= 1000) {
      return `${(數字 / 1000).toFixed(1)}K`
    }
    return 數字.toString()
  }

  const 格式化日期 = (日期字串: string) => {
    const 日期 = new Date(日期字串)
    return 日期.toLocaleDateString('zh-TW', {
      month: 'short',
      day: 'numeric'
    })
  }

  const 統計卡片 = ({ 圖示, 標題, 數值, 變化, 顏色 = 'aurora' }: {
    圖示: React.ReactNode
    標題: string
    數值: number
    變化?: number
    顏色?: string
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{標題}</CardTitle>
          {圖示}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{格式化數字(數值)}</div>
          {變化 !== undefined && (
            <p className={`text-xs ${變化 >= 0 ? 'text-aurora-600' : 'text-destructive'}`}>
              {變化 >= 0 ? '+' : ''}{變化}% 較上月
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )

  if (載入中) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, 索引) => (
            <Card key={索引}>
              <CardHeader className="pb-2">
                <div className="w-8 h-8 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="w-16 h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="w-20 h-4 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="w-32 h-6 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="w-32 h-6 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (錯誤) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{錯誤}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-aurora-600 text-white rounded hover:bg-aurora-700"
        >
          重試
        </button>
      </div>
    )
  }

  if (!統計資料) return null

  return (
    <div className="space-y-6">
      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <統計卡片
          圖示={<FileText className="h-4 w-4 text-muted-foreground" />}
          標題="總文章數"
          數值={統計資料.總文章數}
          變化={統計資料.本月文章數 > 0 ? 15 : -5}
        />
        <統計卡片
          圖示={<Eye className="h-4 w-4 text-muted-foreground" />}
          標題="總瀏覽次數"
          數值={統計資料.總瀏覽次數}
          變化={統計資料.本月瀏覽次數 > 0 ? 25 : -10}
        />
        <統計卡片
          圖示={<Heart className="h-4 w-4 text-muted-foreground" />}
          標題="總喜歡次數"
          數值={統計資料.總喜歡次數}
          變化={統計資料.本月喜歡次數 > 0 ? 18 : -8}
        />
        <統計卡片
          圖示={<Users className="h-4 w-4 text-muted-foreground" />}
          標題="總使用者數"
          數值={統計資料.總使用者數}
          變化={統計資料.本月新使用者數 > 0 ? 12 : -3}
        />
      </div>

      {/* 圖表區域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 月度趨勢 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              月度發文趨勢
            </CardTitle>
            <CardDescription>過去12個月的文章發布數量</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={月度資料}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="月份" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => [`${value} 篇`, '文章數']}
                  labelStyle={{ color: '#000' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="文章數" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 瀏覽與喜歡統計 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              瀏覽與喜歡統計
            </CardTitle>
            <CardDescription>過去12個月的互動數據</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={月度資料}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="月份" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value, name) => [
                    格式化數字(value as number), 
                    name === '瀏覽次數' ? '瀏覽' : '喜歡'
                  ]}
                  labelStyle={{ color: '#000' }}
                />
                <Bar dataKey="瀏覽次數" fill="#22c55e" />
                <Bar dataKey="喜歡次數" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 標籤統計與熱門文章 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 標籤統計 */}
        <Card>
          <CardHeader>
            <CardTitle>熱門標籤</CardTitle>
            <CardDescription>按文章數量排序的標籤統計</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={標籤資料.slice(0, 6)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ 名稱, 文章數 }) => `${名稱} (${文章數})`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="文章數"
                >
                  {標籤資料.slice(0, 6).map((項目, 索引) => (
                    <Cell key={`cell-${索引}`} fill={顏色[索引 % 顏色.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 熱門文章 */}
        <Card>
          <CardHeader>
            <CardTitle>熱門文章</CardTitle>
            <CardDescription>按瀏覽次數排序的文章</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {熱門文章.slice(0, 5).map((文章, 索引) => (
                <motion.div
                  key={文章.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 索引 * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-1">{文章.標題}</h4>
                    <p className="text-xs text-muted-foreground">
                      {格式化日期(文章.發布時間)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {格式化數字(文章.瀏覽次數)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {格式化數字(文章.喜歡次數)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
