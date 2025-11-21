'use client'

import { motion } from 'framer-motion'
import Tilt from 'react-parallax-tilt'
import { ReactNode } from 'react'

interface 三D傾斜卡片Props {
  children: ReactNode
  最大傾斜?: number
  縮放?: number
  轉換速度?: number
  懸停啟用?: boolean
}

export function 三D傾斜卡片({
  children,
  最大傾斜 = 15,
  縮放 = 1.05,
  轉換速度 = 1000,
  懸停啟用 = true
}: 三D傾斜卡片Props) {
  return (
    <Tilt
      glareEnable={true}
      glareMaxOpacity={0.3}
      glareColor="#22c55e"
      glarePosition="all"
      tiltEnable={懸停啟用}
      tiltMaxAngleX={最大傾斜}
      tiltMaxAngleY={最大傾斜}
      perspective={1000}
      transitionSpeed={轉換速度}
      scale={縮放}
      gyroscope={true}
      className="w-full h-full"
    >
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </Tilt>
  )
}

interface 懸停發光卡片Props {
  children: ReactNode
  發光顏色?: string
  發光強度?: number
}

export function 懸停發光卡片({ 
  children, 
  發光顏色 = 'rgba(34, 197, 94, 0.3)', 
  發光強度 = 20 
}: 懸停發光卡片Props) {
  return (
    <motion.div
      className="relative"
      whileHover={{
        boxShadow: `0 0 ${發光強度}px ${發光顏色}`,
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

interface 浮動動畫Props {
  children: ReactNode
  持續時間?: number
  延迟?: number
  振幅?: number
}

export function 浮動動畫({ 
  children, 
  持續時間 = 3, 
  延迟 = 0, 
  振幅 = 10 
}: 浮動動畫Props) {
  return (
    <motion.div
      animate={{
        y: [0, -振幅, 0],
      }}
      transition={{
        duration: 持續時間,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
        delay: 延迟,
      }}
    >
      {children}
    </motion.div>
  )
}

interface 脈衝動畫Props {
  children: ReactNode
  持續時間?: number
  縮放範圍?: [number, number]
}

export function 脈衝動畫({ 
  children, 
  持續時間 = 2, 
  縮放範圍 = [1, 1.05] 
}: 脈衝動畫Props) {
  return (
    <motion.div
      animate={{
        scale: 縮放範圍,
      }}
      transition={{
        duration: 持續時間,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

interface 旋轉動畫Props {
  children: ReactNode
  持續時間?: number
  方向?: 'clockwise' | 'counterclockwise'
}

export function 旋轉動畫({ 
  children, 
  持續時間 = 10, 
  方向 = 'clockwise' 
}: 旋轉動畫Props) {
  const 旋轉角度 = 方向 === 'clockwise' ? 360 : -360

  return (
    <motion.div
      animate={{
        rotate: 旋轉角度,
      }}
      transition={{
        duration: 持續時間,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {children}
    </motion.div>
  )
}
