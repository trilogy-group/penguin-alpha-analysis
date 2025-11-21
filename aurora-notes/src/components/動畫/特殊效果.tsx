'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode, useEffect, useState } from 'react'

interface 彩紙爆炸Props {
  觸發: boolean
  完成回調?: () => void
  粒子數量?: number
  顏色?: string[]
}

interface 粒子Props {
  顏色: string
  延迟: number
  持續時間: number
}

function 粒子({ 顏色, 延迟, 持續時間 }: 粒子Props) {
  return (
    <motion.div
      className="absolute w-3 h-3 rounded-full"
      style={{ backgroundColor: 顏色 }}
      initial={{
        scale: 0,
        opacity: 1,
        transform: 'translate(0, 0) rotate(0deg)',
      }}
      animate={{
        scale: [0, 1, 1, 0],
        opacity: [1, 1, 0.8, 0],
        transform: [
          'translate(0, 0) rotate(0deg)',
          `translate(${Math.random() * 200 - 100}px, ${Math.random() * -200 - 100}px) rotate(${Math.random() * 360}deg)`,
          `translate(${Math.random() * 400 - 200}px, ${Math.random() * -400 - 200}px) rotate(${Math.random() * 720}deg)`,
          `translate(${Math.random() * 600 - 300}px, ${Math.random() * -600 - 300}px) rotate(${Math.random() * 1080}deg)`,
        ],
      }}
      transition={{
        duration: 持續時間,
        delay: 延迟,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    />
  )
}

export function 彩紙爆炸({ 
  觸發, 
  完成回調, 
  粒子數量 = 50,
  顏色 = ['#22c55e', '#16a34a', '#15803d', '#86efac', '#4ade80']
}: 彩紙爆炸Props) {
  const [顯示, 設定顯示] = useState(false)

  useEffect(() => {
    if (觸發) {
      設定顯示(true)
      
      // 設定自動隱藏
      const 計時器 = setTimeout(() => {
        設定顯示(false)
        完成回調?.()
      }, 3000)

      return () => clearTimeout(計時器)
    }
  }, [觸發, 完成回調])

  return (
    <AnimatePresence>
      {顯示 && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative w-full h-full">
            {Array.from({ length: 粒子數量 }).map((_, 索引) => (
              <粒子
                key={索引}
                顏色={顏色[索引 % 顏色.length]}
                延迟={Math.random() * 0.5}
                持續時間={2 + Math.random()}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface 成功動畫Props {
  觸發: boolean
  完成回調?: () => void
  兒童?: ReactNode
}

export function 成功動畫({ 觸發, 完成回調, 兒童 }: 成功動畫Props) {
  const [顯示, 設定顯示] = useState(false)

  useEffect(() => {
    if (觸發) {
      設定顯示(true)
      
      const 計時器 = setTimeout(() => {
        設定顯示(false)
        完成回調?.()
      }, 2000)

      return () => clearTimeout(計時器)
    }
  }, [觸發, 完成回調])

  return (
    <AnimatePresence>
      {顯示 && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20,
            }}
            className="bg-aurora-600 text-white rounded-full p-8 shadow-lg"
          >
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </svg>
          </motion.div>
          
          {兒童 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-20 text-center"
            >
              {兒童}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface 載入動畫Props {
  顯示: boolean
  文字?: string
}

export function 載入動畫({ 顯示, 文字 = '載入中...' }: 載入動畫Props) {
  return (
    <AnimatePresence>
      {顯示 && (
        <motion.div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="flex justify-center mb-4">
              <motion.div
                className="w-12 h-12 border-4 border-aurora-600 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </div>
            <motion.p
              className="text-muted-foreground"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {文字}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
