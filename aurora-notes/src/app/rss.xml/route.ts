import { NextRequest, NextResponse } from 'next/server'
import RSS from 'rss'
import { 資料庫 } from '@/lib/資料庫'

export async function GET(請求: NextRequest) {
  try {
    const 網址 = 請求.nextUrl.origin

    // 創建 RSS feed
    const feed = new RSS({
      title: '極光筆記 - Aurora Notes',
      description: '一個現代化的繁體中文技術部落格平台',
      feed_url: `${網址}/rss.xml`,
      site_url: 網址,
      language: 'zh-TW',
      pubDate: new Date(),
      ttl: 60 // 1小時快取
    })

    // 獲取最新文章
    const 最新文章 = await 資料庫.文章.findMany({
      where: { 已發布: true },
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
                名稱: true
              }
            }
          }
        }
      },
      orderBy: {
        發布時間: 'desc'
      },
      take: 20
    })

    // 添加文章到 RSS feed
    最新文章.forEach((文章: any) => {
      const 標籤列表 = 文章.標籤.map((文章標籤: any) => 文章標籤.標籤.名稱).join(', ')
      
      feed.item({
        title: 文章.標題,
        description: 文章.摘要 || '',
        url: `${網址}/文章/${文章.id}`,
        guid: `${網址}/文章/${文章.id}`,
        categories: 標籤列表 ? 標籤列表.split(', ') : [],
        author: 文章.作者.使用者名稱,
        date: new Date(文章.發布時間 || 文章.建立時間),
        custom_elements: [
          { 'content:encoded': 文章.內容 },
          { 'dc:creator': 文章.作者.使用者名稱 }
        ]
      })
    })

    // 生成 XML
    const xml = feed.xml({ indent: true })

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })

  } catch (錯誤) {
    console.error('RSS 生成錯誤:', 錯誤)
    return NextResponse.json(
      { 錯誤: 'RSS 生成失敗' },
      { status: 500 }
    )
  }
}
