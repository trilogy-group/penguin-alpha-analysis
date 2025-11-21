'use client'

import { useState, useEffect, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 文章卡片 } from '@/components/文章/文章卡片'
import { Search, X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { debounce } from 'lodash'

interface 搜尋文章 {
  id: string
  標題: string
  摘要?: string | undefined
  封面圖片?: string
  閱讀時間: number
  瀏覽次數: number
  喜歡次數: number
  建立時間: string
  發布時間?: string
  作者: {
    使用者名稱: string
    頭像?: string
  }
  標籤: Array<{
    id: string
    名稱: string
    顏色?: string
  }>
  高亮?: {
    標題?: string
    摘要?: string
    內容?: string
  }
}

interface 搜尋介面Props {
  初始查詢?: string
  標籤篩選?: string[]
  變更標籤篩選?: (標籤: string[]) => void
}

export function 搜尋介面({ 初始查詢 = '', 標籤篩選 = [], 變更標籤篩選 }: 搜尋介面Props) {
  const [查詢, 設定查詢] = useState(初始查詢)
  const [搜尋結果, 設定搜尋結果] = useState<搜尋文章[]>([])
  const [載入中, 設定載入中] = useState(false)
  const [錯誤, 設定錯誤] = useState<string | null>(null)
  const [總數, 設定總數] = useState(0)
  const [查詢時間, 設定查詢時間] = useState(0)
  const [已執行搜尋, 設定已執行搜尋] = useState(false)

  // 轉換搜尋結果為文章卡片格式
  const 轉換文章格式 = (搜尋文章: 搜尋文章) => ({
    id: 搜尋文章.id,
    標題: 搜尋文章.高亮?.標題 || 搜尋文章.標題,
    摘要: 搜尋文章.高亮?.摘要 || 搜尋文章.摘要 || '',
    封面圖片: 搜尋文章.封面圖片 || undefined,
    閱讀時間: 搜尋文章.閱讀時間,
    瀏覽次數: 搜尋文章.瀏覽次數,
    喜歡次數: 搜尋文章.喜歡次數,
    建立時間: 搜尋文章.建立時間,
    發布時間: 搜尋文章.發布時間 || undefined,
    作者: 搜尋文章.作者,
    標籤: 搜尋文章.標籤,
  })
  const 執行搜尋 = useMemo(() => 
    debounce(async (搜尋查詢: string) => {
      if (!搜尋查詢.trim()) {
        設定搜尋結果([])
        設定總數(0)
        設定已執行搜尋(false)
        return
      }

      設定載入中(true)
      設定錯誤(null)

      try {
        const 回應 = await fetch('/api/搜尋?' + new URLSearchParams({
          查詢: 搜尋查詢,
          標籤: 標籤篩選.join(','),
        }))

        if (!回應.ok) {
          throw new Error('搜尋失敗')
        }

        const 結果 = await 回應.json()
        設定搜尋結果(結果.文章)
        設定總數(結果.總數)
        設定查詢時間(結果.查詢時間)
        設定已執行搜尋(true)
      } catch (錯誤) {
        console.error('搜尋錯誤:', 錯誤)
        設定錯誤(錯誤 instanceof Error ? 錯誤.message : '搜尋時發生錯誤')
        設定搜尋結果([])
      } finally {
        設定載入中(false)
      }
    }, 300),
    [標籤篩選]
  )

  // 當查詢變更時執行搜尋
  useEffect(() => {
    執行搜尋(查詢)
  }, [查詢, 執行搜尋])

  const 清除搜尋 = () => {
    設定查詢('')
    設定搜尋結果([])
    設定總數(0)
    設定已執行搜尋(false)
  }

  const 處理輸入變更 = (值: string) => {
    設定查詢(值)
  }

  const 容器變體 = {
    初始: { opacity: 0 },
    動畫: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const 項目變體 = {
    初始: { opacity: 0, y: 20 },
    動畫: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  }

  return (
    <div className="space-y-6">
      {/* 搜尋輸入框 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            文章搜尋
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Input
              placeholder="搜尋文章標題、內容或作者..."
              value={查詢}
              onChange={(e) => 處理輸入變更(e.target.value)}
              className="pr-20"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              {載入中 && <Loader2 className="h-4 w-4 animate-spin" />}
              {查詢 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={清除搜尋}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {標籤篩選.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              <span className="text-sm text-muted-foreground">篩選標籤:</span>
              {標籤篩選.map((標籤) => (
                <Badge
                  key={標籤}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => 變更標籤篩選?.(標籤篩選.filter(t => t !== 標籤))}
                >
                  {標籤}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 搜尋結果 */}
      <AnimatePresence mode="wait">
        {載入中 && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">搜尋中...</p>
          </motion.div>
        )}

        {錯誤 && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <p className="text-destructive mb-4">{錯誤}</p>
            <Button onClick={() => 執行搜尋(查詢)} variant="outline">
              重試
            </Button>
          </motion.div>
        )}

        {!載入中 && !錯誤 && 已執行搜尋 && (
          <motion.div
            key="results"
            variants={容器變體}
            initial="初始"
            animate="動畫"
          >
            {搜尋結果.length > 0 ? (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    找到 {總數} 篇相關文章
                    {查詢時間 > 0 && (
                      <span className="ml-2">({查詢時間}ms)</span>
                    )}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {搜尋結果.map((文章, 索引) => (
                    <motion.div
                      key={文章.id}
                      variants={項目變體}
                      className={索引 === 0 ? 'col-span-full md:col-span-2' : ''}
                    >
                      <文章卡片 
                        文章={轉換文章格式(文章)}
                        優先={索引 === 0}
                      />
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {查詢 ? '沒有找到相關文章' : '請輸入搜尋關鍵字'}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {!載入中 && !錯誤 && !已執行搜尋 && (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">輸入關鍵字開始搜尋文章</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
