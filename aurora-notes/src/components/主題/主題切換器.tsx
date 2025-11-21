'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Moon, Sun, Monitor } from 'lucide-react'
import { 使用主題 } from '@/components/主題/主題提供者'

export function 主題切換器() {
  const { 主題, 設定主題 } = 使用主題()

  const 取得主題圖示 = () => {
    switch (主題) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const 取得主題文字 = () => {
    switch (主題) {
      case 'light':
        return '淺色模式'
      case 'dark':
        return '深色模式'
      default:
        return '跟隨系統'
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start">
          {取得主題圖示()}
          <span className="ml-2">{取得主題文字()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => 設定主題('light')}>
          <Sun className="mr-2 h-4 w-4" />
          <span>淺色模式</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => 設定主題('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          <span>深色模式</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => 設定主題('system')}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>跟隨系統</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
