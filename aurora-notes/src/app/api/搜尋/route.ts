import { NextRequest, NextResponse } from 'next/server'
import { 搜尋文章 } from '@/lib/搜尋'

export async function GET(請求: NextRequest) {
  try {
    const 搜尋參數 = new URL(請求.url).searchParams
    
    const 查詢 = 搜尋參數.get('查詢') || ''
    const 頁數 = parseInt(搜尋參數.get('頁數') || '1')
    const 每頁數量 = parseInt(搜尋參數.get('每頁數量') || '12')
    const 排序方式 = 搜尋參數.get('排序方式') || '發布時間:desc'
    const 標籤篩選 = 搜尋參數.get('標籤')?.split(',').filter(Boolean) || []

    if (!查詢.trim()) {
      return NextResponse.json({
        文章: [],
        總數: 0,
        查詢時間: 0,
        當前頁數: 頁數,
        總頁數: 0
      })
    }

    const 結果 = await 搜尋文章(查詢, {
      頁數,
      每頁數量,
      排序方式,
      標籤篩選
    })

    return NextResponse.json(結果)

  } catch (錯誤) {
    console.error('搜尋 API 錯誤:', 錯誤)
    return NextResponse.json(
      { 錯誤: '搜尋服務暫時無法使用' },
      { status: 503 }
    )
  }
}
