import { NextRequest, NextResponse } from 'next/server'
import { 資料庫 } from '@/lib/資料庫'

export async function GET(請求: NextRequest) {
  try {
    const { 搜尋參數 } = new URL(請求.url)
    const 限制 = parseInt(搜尋參數.get('限制') || '50')

    // 獲取所有標籤及其文章數量
    const 標籤統計 = await 資料庫.標籤.findMany({
      include: {
        文章: {
          include: {
            文章: {
              where: {
                已發布: true
              }
            }
          }
        }
      },
      orderBy: {
        文章: {
          _count: 'desc'
        }
      },
      take: 限制
    })

    // 格式化標籤資料
    const 格式化標籤 = 標籤統計.map(標籤 => ({
      id: 標籤.id,
      名稱: 標籤.名稱,
      顏色: 標籤.顏色,
      描述: 標籤.描述,
      文章數量: 標籤.文章.length,
      建立時間: 標籤.建立時間,
      更新時間: 標籤.更新時間
    }))

    return NextResponse.json({
      標籤: 格式化標籤,
      總數: 格式化標籤.length
    })

  } catch (錯誤) {
    console.error('獲取標籤 API 錯誤:', 錯誤)
    return NextResponse.json(
      { 錯誤: '獲取標籤失敗' },
      { status: 500 }
    )
  }
}

export async function POST(請求: NextRequest) {
  try {
    const { 名稱, 顏色, 描述 } = await 請求.json()

    if (!名稱 || 名稱.trim().length === 0) {
      return NextResponse.json(
        { 錯誤: '標籤名稱不能為空' },
        { status: 400 }
      )
    }

    // 檢查標籤是否已存在
    const 現有標籤 = await 資料庫.標籤.findUnique({
      where: { 名稱: 名稱.trim() }
    })

    if (現有標籤) {
      return NextResponse.json(
        { 錯誤: '標籤已存在' },
        { status: 409 }
      )
    }

    // 建立新標籤
    const 新標籤 = await 資料庫.標籤.create({
      data: {
        名稱: 名稱.trim(),
        顏色: 顏色 || '#22c55e',
        描述: 描述?.trim()
      }
    })

    return NextResponse.json({
      標籤: 新標籤,
      訊息: '標籤建立成功'
    }, { status: 201 })

  } catch (錯誤) {
    console.error('建立標籤 API 錯誤:', 錯誤)
    return NextResponse.json(
      { 錯誤: '建立標籤失敗' },
      { status: 500 }
    )
  }
}
