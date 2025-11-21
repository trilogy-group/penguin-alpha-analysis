'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface 頁面轉場Props {
  children: ReactNode
  類型?: 'fade' | 'slide' | 'scale' | 'stagger'
}

export function 頁面轉場({ children, 類型 = 'fade' }: 頁面轉場Props) {
  const 取得變體 = () => {
    switch (類型) {
      case 'slide':
        return {
          初始: { opacity: 0, y: 20 },
          動畫: { 
            opacity: 1, 
            y: 0,
            transition: {
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1]
            }
          },
          離開: { 
            opacity: 0, 
            y: -20,
            transition: {
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }
          }
        }
      case 'scale':
        return {
          初始: { opacity: 0, scale: 0.95 },
          動畫: { 
            opacity: 1, 
            scale: 1,
            transition: {
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1]
            }
          },
          離開: { 
            opacity: 0, 
            scale: 1.05,
            transition: {
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }
          }
        }
      case 'stagger':
        return {
          初始: { opacity: 0 },
          動畫: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2,
            },
          },
          離開: { 
            opacity: 0,
            transition: {
              staggerChildren: 0.05,
              staggerDirection: -1,
            }
          }
        }
      default: // fade
        return {
          初始: { opacity: 0 },
          動畫: { 
            opacity: 1,
            transition: {
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1]
            }
          },
          離開: { 
            opacity: 0,
            transition: {
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }
          }
        }
    }
  }

  const 變體 = 取得變體()

  return (
    <motion.div
      initial="初始"
      animate="動畫"
      exit="離開"
      variants={變體}
    >
      {children}
    </motion.div>
  )
}

interface 交錯動畫容器Props {
  children: ReactNode
  延迟?: number
  間距?: number
}

export function 交錯動畫容器({ children, 延迟 = 0, 間距 = 0.1 }: 交錯動畫容器Props) {
  return (
    <motion.div
      initial="初始"
      animate="動畫"
      variants={{
        初始: { opacity: 0 },
        動畫: {
          opacity: 1,
          transition: {
            delayChildren: 延迟,
            staggerChildren: 間距,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

interface 交錯動畫項目Props {
  children: ReactNode
  變體?: 'fade' | 'slideUp' | 'scale'
}

export function 交錯動畫項目({ children, 變體 = 'fade' }: 交錯動畫項目Props) {
  const 取得項目變體 = () => {
    switch (變體) {
      case 'slideUp':
        return {
          初始: { opacity: 0, y: 20 },
          動畫: { 
            opacity: 1, 
            y: 0,
            transition: {
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1]
            }
          }
        }
      case 'scale':
        return {
          初始: { opacity: 0, scale: 0.8 },
          動畫: { 
            opacity: 1, 
            scale: 1,
            transition: {
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1]
            }
          }
        }
      default: // fade
        return {
          初始: { opacity: 0 },
          動畫: { 
            opacity: 1,
            transition: {
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1]
            }
          }
        }
    }
  }

  const 項目變體 = 取得項目變體()

  return (
    <motion.div variants={項目變體}>
      {children}
    </motion.div>
  )
}
