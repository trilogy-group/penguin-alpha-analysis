'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

interface 標籤 {
  id: string
  名稱: string
  顏色?: string
  文章數量: number
}

interface 標籤雲Props {
  已選標籤: string[]
  變更已選標籤: (標籤: string[]) => void
  最大顯示數量?: number
}

export function 標籤雲({ 已選標籤, 變更已選標籤, 最大顯示數量 = 20 }: 標籤雲Props) {
  const [標籤列表, 設定標籤列表] = useState<標籤[]>([])
  const [載入中, 設定載入中] = useState(true)
  const [錯誤, 設定錯誤] = useState<string | null>(null)

  useEffect(() => {
    const 獲取標籤 = async () => {
      try {
        設定載入中(true)
        設定錯誤(null)

        const 回應 = await fetch('/api/標籤')
        if (!回應.ok) {
          throw new Error('獲取標籤失敗')
        }

        const 標籤資料 = await 回應.json()
        設定標籤列表(標籤資料.標籤)
      } catch (錯誤) {
        console.error('獲取標籤錯誤:', 錯誤)
        設定錯誤(錯誤 instanceof Error ? 錯誤.message : '發生未知錯誤')
      } finally {
        設定載入中(false)
      }
    }

    獲取標籤()
  }, [])

  const 計算字體大小 = (文章數量: number, 最大文章數量: number) => {
    const 最小尺寸 = 0.875
    const 最大尺寸 = 1.5
    const 比例 = 文章數量 / 最大文章數量
    return 最小尺寸 + (最大尺寸 - 最小尺寸) * 比例
  }

  const 切換標籤選取 = (標籤名稱: string) => {
    if (已選標籤.includes(標籤名稱)) {
      變更已選標籤(已選標籤.filter(名稱 => 名稱 !== 標籤名稱))
    } else {
      變更已選標籤([...已選標籤, 標籤名稱])
    }
  }

  const 清除所有標籤 = () => {
    變更已選標籤([])
  }

  const 顯示標籤 = 標籤列表.slice(0, 最大顯示數量)
  const 最大文章數量 = Math.max(...顯示標籤.map(標籤 => 標籤.文章數量), 1)

  const 容器變體 = {
    初始: { opacity: 0 },
    動畫: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const 項目變體 = {
    初始: { opacity: 0, scale: 0.8 },
    動畫: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  }

  if (載入中) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">標籤雲</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[...Array(10)].map((_, 索引) => (
              <div key={索引} className="h-6 w-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (錯誤) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">標籤雲</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-sm">{錯誤}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">標籤雲</CardTitle>
          {已選標籤.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={清除所有標籤}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4 mr-1" />
              清除
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          variants={容器變體}
          initial="初始"
          animate="動畫"
          className="flex flex-wrap gap-2"
        >
          {顯示標籤.map((標籤) => {
            const 字體大小 = 計算字體大小(標籤.文章數量, 最大文章數量)
            const 已選取 = 已選標籤.includes(標籤.名稱)

            return (
              <motion.div
                key={標籤.id}
                variants={項目變體}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant={已選取 ? "default" : "secondary"}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    已選取 ? "aurora-600 text-white" : ""
                  }`}
                  style={{
                    fontSize: `${字體大小}rem`,
                    backgroundColor: 已選取 
                      ? undefined 
                      : 標籤.顏色 ? `${標籤.顏色}20` : undefined,
                    color: 已選取 
                      ? undefined 
                      : 標籤.顏色 || undefined,
                    borderColor: 標籤.顏色 || undefined,
                  }}
                  onClick={() => 切換標籤選取(標籤.名稱)}
                >
                  {標籤.名稱}
                  <span className="ml-1 text-xs opacity-70">
                    ({標籤.文章數量})
                  </span>
                </Badge>
              </motion.div>
            )
          })}
        </motion.div>

        {已選標籤.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">已選擇的標籤:</p>
            <div className="flex flex-wrap gap-1">
              {已選標籤.map((標籤名稱) => (
                <Badge
                  key={標籤名稱}
                  variant="default"
                  className="aurora-600 text-white"
                >
                  {標籤名稱}
                  <button
                    onClick={() => 切換標籤選取(標籤名稱)}
                    className="ml-1 hover:text-aurora-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {標籤列表.length > 最大顯示數量 && (
          <p className="text-xs text-muted-foreground mt-4">
            顯示前 {最大顯示數量} 個標籤，共 {標籤列表.length} 個
          </p>
        )}
      </CardContent>
    </Card>
  )
}
