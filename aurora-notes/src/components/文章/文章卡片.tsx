'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar, Clock, Eye, Heart, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface 文章卡片Props {
  文章: {
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
  優先?: boolean
}

export function 文章卡片({ 文章, 優先 = false }: 文章卡片Props) {
  const [圖片載入中, 設定圖片載入中] = useState(true)
  const [圖片錯誤, 設定圖片錯誤] = useState(false)

  const 格式化日期 = (日期字串: string) => {
    const 日期 = new Date(日期字串)
    return 日期.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const 處理圖片載入 = () => {
    設定圖片載入中(false)
  }

  const 處理圖片錯誤 = () => {
    設定圖片載入中(false)
    設定圖片錯誤(true)
  }

  const 卡片變體 = {
    初始: { opacity: 0, y: 20 },
    動畫: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    懸停: { 
      y: -8,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  }

  return (
    <motion.div
      variants={卡片變體}
      initial="初始"
      animate="動畫"
      whileHover="懸停"
      className={優先 ? 'col-span-full md:col-span-2' : ''}
    >
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {文章.封面圖片 && !圖片錯誤 && (
          <div className="relative aspect-video overflow-hidden">
            {圖片載入中 && (
              <Skeleton className="absolute inset-0 w-full h-full" />
            )}
            <Image
              src={文章.封面圖片}
              alt={文章.標題}
              fill
              className="object-cover"
              onLoad={處理圖片載入}
              onError={處理圖片錯誤}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="line-clamp-2 text-lg md:text-xl mb-2 hover:text-aurora-600 transition-colors">
                <Link href={`/文章/${文章.id}`} className="block">
                  {文章.標題}
                </Link>
              </CardTitle>
              <CardDescription className="line-clamp-3 text-sm">
                {文章.摘要}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-3">
            {文章.標籤.map((標籤) => (
              <Badge 
                key={標籤.id} 
                variant="secondary" 
                className="text-xs"
                style={{ 
                  backgroundColor: 標籤.顏色 ? `${標籤.顏色}20` : undefined,
                  color: 標籤.顏色 || undefined
                }}
              >
                {標籤.名稱}
              </Badge>
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={文章.作者.頭像} alt={文章.作者.使用者名稱} />
                  <AvatarFallback className="text-xs">
                    {文章.作者.使用者名稱.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs">{文章.作者.使用者名稱}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span className="text-xs">
                  {格式化日期(文章.發布時間 || 文章.建立時間)}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className="text-xs">{文章.閱讀時間} 分鐘</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span className="text-xs">{文章.瀏覽次數}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span className="text-xs">{文章.喜歡次數}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href={`/文章/${文章.id}`}>
                閱讀全文
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface 文章骨架屏Props {
  優先?: boolean
}

export function 文章骨架屏({ 優先 = false }: 文章骨架屏Props) {
  return (
    <Card className="h-full overflow-hidden">
      <div className="relative aspect-video overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
      <CardHeader className="pb-3">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 mt-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-14" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-8" />
          </div>
        </div>
        <div className="mt-4">
          <Skeleton className="h-8 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
