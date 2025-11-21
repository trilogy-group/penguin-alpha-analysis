import { NextRequest, NextResponse } from 'next/server'
import { 資料庫 } from '@/lib/資料庫'

export async function GET(請求: NextRequest) {
  try {
    const { 搜尋參數 } = new URL(請求.url)
    
    const 頁數 = parseInt(搜尋參數.get('頁數') || '1')
    const 每頁數量 = parseInt(搜尋參數.get('每頁數量') || '12')
    const 排序方式 = 搜尋參數.get('排序方式') || '最新'
    const 標籤篩選 = 搜尋參數.get('標籤')?.split(',').filter(Boolean) || []
    const 搜尋關鍵字 = 搜尋參數.get('搜尋') || ''

    const 跳過數量 = (頁數 - 1) * 每頁數量

    // 建立排序條件
    let 排序條件: any = { 建立時間: 'desc' }
    switch (排序方式) {
      case '最熱門':
        排序條件 = { 喜歡次數: 'desc' }
        break
      case '最多瀏覽':
        排序條件 = { 瀏覽次數: 'desc' }
        break
      default:
        排序條件 = { 發布時間: 'desc' }
    }

    // 建立篩選條件
    const 篩選條件: any = { 已發布: true }
    
    if (標籤篩選.length > 0) {
      篩選條件.標籤 = {
        some: {
          標籤: {
            名稱: {
              in: 標籤篩選
            }
          }
        }
      }
    }

    if (搜尋關鍵字) {
      篩選條件.OR = [
        { 標題: { contains: 搜尋關鍵字 } },
        { 摘要: { contains: 搜尋關鍵字 } },
        { 內容: { contains: 搜尋關鍵字 } }
      ]
    }

    // 獲取文章總數
    const 總數 = await 資料庫.文章.count({
      where: 篩選條件
    })

    // 獲取文章
    const 文章列表 = await 資料庫.文章.findMany({
      where: 篩選條件,
      include: {
        作者: {
          select: {
            使用者名稱: true,
            頭像: true
          }
        },
        標籤: {
          include: {
            標籤: {
              select: {
                id: true,
                名稱: true,
                顏色: true
              }
            }
          }
        }
      },
      orderBy: 排序條件,
      skip: 跳過數量,
      take: 每頁數量
    })

    // 格式化回應資料
    const 格式化文章 = 文章列表.map(文章 => ({
      ...文章,
      標籤: 文章.標籤.map(文章標籤 => 文章標籤.標籤)
    }))

    const 還有更多 = 跳過數量 + 文章列表.length < 總數

    return NextResponse.json({
      文章: 格式化文章,
      還有更多,
      總數,
      當前頁數: 頁數,
      總頁數: Math.ceil(總數 / 每頁數量)
    })

  } catch (錯誤) {
    console.error('獲取文章 API 錯誤:', 錯誤)
    return NextResponse.json(
      { 錯誤: '獲取文章失敗' },
      { status: 500 }
    )
  }
}
