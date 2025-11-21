'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { 文章卡片, 文章骨架屏 } from '@/components/文章/文章卡片'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface 文章 {
  id: string
  標題: string
  摘要?: string
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
}

interface 無限滾動文章列表Props {
  初始文章: 文章[]
  每頁數量?: number
  標籤篩選?: string[]
  搜尋關鍵字?: string
  排序方式?: '最新' | '最熱門' | '最多瀏覽'
}

export function 無限滾動文章列表({
  初始文章,
  每頁數量 = 12,
  標籤篩選 = [],
  搜尋關鍵字 = '',
  排序方式 = '最新'
}: 無限滾動文章列表Props) {
  const [文章, 設定文章] = useState<文章[]>(初始文章)
  const [載入中, 設定載入中] = useState(false)
  const [頁數, 設定頁數] = useState(1)
  const [還有更多, 設定還有更多] = useState(true)
  const [錯誤, 設定錯誤] = useState<string | null>(null)
  const 觀察器參照 = useRef<HTMLDivElement>(null)

  const 獲取文章 = useCallback(async (重置 = false) => {
    if (載入中) return

    設定載入中(true)
    設定錯誤(null)

    try {
      const 目標頁數 = 重置 ? 1 : 頁數 + 1
      const 搜尋參數 = new URLSearchParams({
        頁數: 目標頁數.toString(),
        每頁數量: 每頁數量.toString(),
        排序方式,
      })

      if (標籤篩選.length > 0) {
        搜尋參數.append('標籤', 標籤篩選.join(','))
      }

      if (搜尋關鍵字) {
        搜尋參數.append('搜尋', 搜尋關鍵字)
      }

      const 回應 = await fetch(`/api/文章?${搜尋參數.toString()}`)
      
      if (!回應.ok) {
        throw new Error('獲取文章失敗')
      }

      const { 文章: 新文章, 還有更多: 新還有更多 } = await 回應.json()

      if (重置) {
        設定文章(新文章)
        設定頁數(1)
      } else {
        設定文章(prev => [...prev, ...新文章])
        設定頁數(目標頁數)
      }

      設定還有更多(新還有更多)
    } catch (錯誤) {
      console.error('獲取文章錯誤:', 錯誤)
      設定錯誤(錯誤 instanceof Error ? 錯誤.message : '發生未知錯誤')
    } finally {
      設定載入中(false)
    }
  }, [載入中, 頁數, 每頁數量, 標籤篩選, 搜尋關鍵字, 排序方式])

  // 設定 Intersection Observer 進行無限滾動
  useEffect(() => {
    const 觀察器 = new IntersectionObserver(
      (項目) => {
        if (項目[0].isIntersecting && 還有更多 && !載入中) {
          獲取文章()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    )

    const 當前觀察器參照 = 觀察器參照.current
    if (當前觀察器參照) {
      觀察器.observe(當前觀察器參照)
    }

    return () => {
      if (當前觀察器參照) {
        觀察器.unobserve(當前觀察器參照)
      }
      觀察器.disconnect()
    }
  }, [還有更多, 載入中, 獲取文章])

  // 當篩選條件變更時重置列表
  useEffect(() => {
    設定文章(初始文章)
    設定頁數(1)
    設定還有更多(true)
    設定錯誤(null)
  }, [標籤篩選, 搜尋關鍵字, 排序方式, 初始文章])

  const 載入更多 = () => {
    獲取文章()
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
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  if (文章.length === 0 && !載入中) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">暫無文章</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        variants={容器變體}
        initial="初始"
        animate="動畫"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {文章.map((文章項目, 索引) => (
            <motion.div
              key={文章項目.id}
              variants={項目變體}
              layout
              exit={{ opacity: 0, scale: 0.8 }}
              className={索引 === 0 ? 'col-span-full md:col-span-2' : ''}
            >
              <文章卡片 
                文章={文章項目} 
                優先={索引 === 0}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* 載入中的骨架屏 */}
        {載入中 && (
          <>
            {[...Array(每頁數量)].map((_, 索引) => (
              <motion.div
                key={`skeleton-${索引}`}
                variants={項目變體}
                className={索引 === 0 ? 'col-span-full md:col-span-2' : ''}
              >
                <文章骨架屏 優先={索引 === 0} />
              </motion.div>
            ))}
          </>
        )}
      </motion.div>

      {/* 錯誤訊息 */}
      {錯誤 && (
        <div className="text-center py-8">
          <p className="text-destructive mb-4">{錯誤}</p>
          <Button onClick={() => 獲取文章(true)} variant="outline">
            重試
          </Button>
        </div>
      )}

      {/* 載入更多按鈕或觀察器 */}
      {!載入中 && !錯誤 && 還有更多 && (
        <div ref={觀察器參照} className="text-center py-8">
          <Button onClick={載入更多} variant="outline" disabled={載入中}>
            {載入中 && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            載入更多文章
          </Button>
        </div>
      )}

      {/* 沒有更多文章 */}
      {!還有更多 && 文章.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">已顯示所有文章</p>
        </div>
      )}
    </div>
  )
}
