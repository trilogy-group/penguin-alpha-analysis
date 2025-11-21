'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface 骨架屏Props {
  children?: ReactNode
  類型?: 'text' | 'circular' | 'rectangular'
  寬度?: string | number
  高度?: string | number
  行數?: number
  類名?: string
}

export function 骨架屏({ 
  類型 = 'text', 
  寬度, 
  高度, 
  行數 = 1, 
  類名 = '' 
}: 骨架屏Props) {
  const 取得骨架屏內容 = () => {
    switch (類型) {
      case 'circular':
        return (
          <div 
            className={`rounded-full bg-muted animate-pulse ${類名}`}
            style={{ width: 寬度 || 40, height: 高度 || 40 }}
          />
        )
      case 'rectangular':
        return (
          <div 
            className={`rounded-md bg-muted animate-pulse ${類名}`}
            style={{ width: 寬度 || '100%', height: 高度 || 200 }}
          />
        )
      case 'text':
      default:
        return (
          <div className={`space-y-2 ${類名}`}>
            {Array.from({ length: 行數 }).map((_, 索引) => (
              <div
                key={索引}
                className="h-4 bg-muted rounded animate-pulse"
                style={{
                  width: 索引 === 行數 - 1 ? '60%' : '100%',
                }}
              />
            ))}
          </div>
        )
    }
  }

  return 取得骨架屏內容()
}

interface 閃爍骨架屏Props {
  children?: ReactNode
  寬度?: string | number
  高度?: string | number
  類名?: string
}

export function 閃爍骨架屏({ 寬度, 高度, 類名 = '' }: 閃爍骨架屏Props) {
  return (
    <motion.div
      className={`bg-muted rounded-md ${類名}`}
      style={{ width: 寬度 || '100%', height: 高度 || 40 }}
      animate={{
        background: [
          'rgb(var(--muted))',
          'rgb(var(--muted-foreground) / 0.1)',
          'rgb(var(--muted))',
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  )
}

interface 卡片骨架屏Props {
  顯示圖片?: boolean
  顯示標題?: boolean
  顯示描述?: boolean
  顯示標籤?: boolean
  顯示作者?: boolean
  類名?: string
}

export function 卡片骨架屏({
  顯示圖片 = true,
  顯示標題 = true,
  顯示描述 = true,
  顯示標籤 = true,
  顯示作者 = true,
  類名 = ''
}: 卡片骨架屏Props) {
  return (
    <motion.div
      className={`border rounded-lg overflow-hidden ${類名}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {顯示圖片 && (
        <div className="relative aspect-video overflow-hidden">
          <閃爍骨架屏 高度="100%" />
        </div>
      )}
      
      <div className="p-4 space-y-3">
        {顯示標題 && <閃爍骨架屏 高度={24} 寬度="80%" />}
        {顯示描述 && (
          <div className="space-y-2">
            <閃爍骨架屏 高度={16} />
            <閃爍骨架屏 高度={16} 寬度="90%" />
            <閃爍骨架屏 高度={16} 寬度="70%" />
          </div>
        )}
        
        {顯示標籤 && (
          <div className="flex gap-2">
            <閃爍骨架屏 寬度={60} 高度={24} />
            <閃爍骨架屏 寬度={80} 高度={24} />
            <閃爍骨架屏 寬度={50} 高度={24} />
          </div>
        )}
        
        {顯示作者 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <骨架屏 類型="circular" 寬度={24} 高度={24} />
              <閃爍骨架屏 寬度={100} 高度={16} />
            </div>
            <閃爍骨架屏 寬度={60} 高度={16} />
          </div>
        )}
      </div>
    </motion.div>
  )
}

interface 列表骨架屏Props {
  項目數量?: number
  顯示圖片?: boolean
}

export function 列表骨架屏({ 項目數量 = 3, 顯示圖片 = true }: 列表骨架屏Props) {
  return (
    <div className="space-y-4">
      {Array.from({ length: 項目數量 }).map((_, 索引) => (
        <motion.div
          key={索引}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 索引 * 0.1 }}
        >
          <卡片骨架屏 顯示圖片={顯示圖片} />
        </motion.div>
      ))}
    </div>
  )
}
