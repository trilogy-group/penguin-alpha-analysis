'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type 主題 = 'dark' | 'light' | 'system'

interface 主題內容 {
  主題: 主題
  設定主題: (主題: 主題) => void
  當前主題: 'dark' | 'light'
  切換主題: () => void
}

const 主題內容預設值: 主題內容 = {
  主題: 'system',
  設定主題: () => null,
  當前主題: 'light',
  切換主題: () => null,
}

const 主題提供者 = createContext<主題內容>(主題內容預設值)

export function 使用主題() {
  const 內容 = useContext(主題提供者)
  if (!內容) {
    throw new Error('使用主題必須在 主題提供者 內使用')
  }
  return 內容
}

interface 主題提供者Props {
  children: React.ReactNode
  預設主題?: 主題
  storageKey?: string
}

export function 主題提供者元件({
  children,
  預設主題 = 'system',
  storageKey = 'aurora-notes-theme',
  ...props
}: 主題提供者Props) {
  const [主題, 設定主題狀態] = useState<主題>(
    () => (typeof window !== 'undefined' && (localStorage.getItem(storageKey) as 主題)) || 預設主題
  )
  const [當前主題, 設定當前主題] = useState<'dark' | 'light'>('light')

  useEffect(() => {
    const 根元素 = window.document.documentElement

    // 移除之前的主題類別
    根元素.classList.remove('light', 'dark')

    let 有效主題: 'light' | 'dark' = 'light'

    if (主題 === 'system') {
      有效主題 = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    } else {
      有效主題 = 主題
    }

    根元素.classList.add(有效主題)
    設定當前主題(有效主題)
  }, [主題])

  const 設定主題 = (新主題: 主題) => {
    localStorage.setItem(storageKey, 新主題)
    設定主題狀態(新主題)
  }

  const 切換主題 = () => {
    const 新主題: 主題 = 當前主題 === 'light' ? 'dark' : 'light'
    設定主題(新主題)
  }

  const 值 = {
    主題,
    設定主題,
    當前主題,
    切換主題,
  }

  return (
    <主題提供者.Provider value={值} {...props}>
      {children}
    </主題提供者.Provider>
  )
}
