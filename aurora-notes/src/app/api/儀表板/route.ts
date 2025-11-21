import { NextRequest, NextResponse } from 'next/server'
import { 資料庫 } from '@/lib/資料庫'

export async function GET(請求: NextRequest) {
  try {
    // 獲取總統計
    const 總文章數 = await 資料庫.文章.count({
      where: { 已發布: true }
    })

    const 總瀏覽次數 = await 資料庫.文章.aggregate({
      where: { 已發布: true },
      _sum: { 瀏覽次數: true }
    })

    const 總喜歡次數 = await 資料庫.文章.aggregate({
      where: { 已發布: true },
      _sum: { 喜歡次數: true }
    })

    const 總使用者數 = await 資料庫.使用者.count()

    // 獲取本月統計
    const 本月開始 = new Date()
    本月開始.setDate(1)
    本月開始.setHours(0, 0, 0, 0)

    const 本月文章數 = await 資料庫.文章.count({
      where: {
        已發布: true,
        發布時間: {
          gte: 本月開始
        }
      }
    })

    const 本月瀏覽次數 = await 資料庫.文章.aggregate({
      where: {
        已發布: true,
        發布時間: {
          gte: 本月開始
        }
      },
      _sum: { 瀏覽次數: true }
    })

    const 本月喜歡次數 = await 資料庫.文章.aggregate({
      where: {
        已發布: true,
        發布時間: {
          gte: 本月開始
        }
      },
      _sum: { 喜歡次數: true }
    })

    const 本月新使用者數 = await 資料庫.使用者.count({
      where: {
        建立時間: {
          gte: 本月開始
        }
      }
    })

    const 統計 = {
      總文章數,
      總瀏覽次數: 總瀏覽次數._sum.瀏覽次數 || 0,
      總喜歡次數: 總喜歡次數._sum.喜歡次數 || 0,
      總使用者數,
      本月文章數,
      本月瀏覽次數: 本月瀏覽次數._sum.瀏覽次數 || 0,
      本月喜歡次數: 本月喜歡次數._sum.喜歡次數 || 0,
      本月新使用者數
    }

    // 獲取月度統計（過去12個月）
    const 十二個月前 = new Date()
    十二個月前.setMonth(十二個月前.getMonth() - 12)

    const 月度文章統計 = await 資料庫.文章.groupBy({
      by: ['發布時間'],
      where: {
        已發布: true,
        發布時間: {
          gte: 十二個月前
        }
      },
      _count: {
        id: true
      },
      _sum: {
        瀏覽次數: true,
        喜歡次數: true
      }
    })

    // 獲取月度新使用者統計
    const 月度使用者統計 = await 資料庫.使用者.groupBy({
      by: ['建立時間'],
      where: {
        建立時間: {
          gte: 十二個月前
        }
      },
      _count: {
        id: true
      }
    })

    // 格式化月度資料
    const 月度統計: Array<{
      月份: string
      文章數: number
      瀏覽次數: number
      喜歡次數: number
      新使用者數: number
    }> = []
    const 當前日期 = new Date()

    for (let i = 11; i >= 0; i--) {
      const 月份日期 = new Date(當前日期.getFullYear(), 當前日期.getMonth() - i, 1)
      const 下個月日期 = new Date(當前日期.getFullYear(), 當前日期.getMonth() - i + 1, 1)
      
      const 月份文章 = 月度文章統計.filter((項目: any) => {
        const 項目日期 = new Date(項目.發布時間)
        return 項目日期 >= 月份日期 && 項目日期 < 下個月日期
      })

      const 月份使用者 = 月度使用者統計.filter((項目: any) => {
        const 項目日期 = new Date(項目.建立時間)
        return 項目日期 >= 月份日期 && 項目日期 < 下個月日期
      })

      const 文章數 = 月份文章.reduce((總和: number, 項目: any) => 總和 + 項目._count.id, 0)
      const 瀏覽次數 = 月份文章.reduce((總和: number, 項目: any) => 總和 + (項目._sum.瀏覽次數 || 0), 0)
      const 喜歡次數 = 月份文章.reduce((總和: number, 項目: any) => 總和 + (項目._sum.喜歡次數 || 0), 0)
      const 新使用者數 = 月份使用者.reduce((總和: number, 項目: any) => 總和 + 項目._count.id, 0)

      月度統計.push({
        月份: 月份日期.toLocaleDateString('zh-TW', { month: 'short' }),
        文章數,
        瀏覽次數,
        喜歡次數,
        新使用者數
      })
    }

    // 獲取標籤統計
    const 標籤統計 = await 資料庫.標籤.findMany({
      include: {
        文章: {
          include: {
            文章: {
              where: { 已發布: true },
              select: { 瀏覽次數: true }
            }
          }
        }
      },
      orderBy: {
        文章: {
          _count: 'desc'
        }
      },
      take: 10
    })

    const 格式化標籤統計 = 標籤統計.map((標籤: any) => ({
      名稱: 標籤.名稱,
      文章數: 標籤.文章.length,
      瀏覽次數: 標籤.文章.reduce((總和: number, 文章標籤: any) => 總和 + 文章標籤.文章.瀏覽次數, 0)
    }))

    // 獲取熱門文章
    const 熱門文章 = await 資料庫.文章.findMany({
      where: { 已發布: true },
      include: {
        作者: {
          select: {
            使用者名稱: true
          }
        }
      },
      orderBy: {
        瀏覽次數: 'desc'
      },
      take: 10,
      select: {
        id: true,
        標題: true,
        瀏覽次數: true,
        喜歡次數: true,
        發布時間: true
      }
    })

    return NextResponse.json({
      統計,
      月度統計,
      標籤統計: 格式化標籤統計,
      熱門文章
    })

  } catch (錯誤) {
    console.error('儀表板 API 錯誤:', 錯誤)
    return NextResponse.json(
      { 錯誤: '獲取儀表板資料失敗' },
      { status: 500 }
    )
  }
}
