import { NextRequest, NextResponse } from 'next/server'
import { 資料庫 } from '@/lib/資料庫'

export async function GET(請求: NextRequest) {
  try {
    const 網址 = 請求.nextUrl.origin

    // 獲取所有已發布文章
    const 所有文章 = await 資料庫.文章.findMany({
      where: { 已發布: true },
      select: {
        id: true,
        標題: true,
        摘要: true,
        發布時間: true,
        更新時間: true
      },
      orderBy: {
        發布時間: 'desc'
      }
    })

    // 獲取所有標籤頁面
    const 所有標籤 = await 資料庫.標籤.findMany({
      select: {
        id: true,
        名稱: true,
        更新時間: true
      },
      orderBy: {
        更新時間: 'desc'
      }
    })

    // 生成 sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${網址}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${網址}/文章</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${網址}/標籤</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${網址}/搜尋</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`

    // 添加文章頁面
    所有文章.forEach((文章: any) => {
      const 最後修改 = 文章.更新時間 || 文章.發布時間 || 文章.建立時間
      sitemap += `  <url>
    <loc>${網址}/文章/${文章.id}</loc>
    <lastmod>${new Date(最後修改).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`
    })

    // 添加標籤頁面
    所有標籤.forEach((標籤: any) => {
      sitemap += `  <url>
    <loc>${網址}/標籤/${標籤.id}</loc>
    <lastmod>${new Date(標籤.更新時間).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`
    })

    sitemap += `</urlset>`

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })

  } catch (錯誤) {
    console.error('Sitemap 生成錯誤:', 錯誤)
    return NextResponse.json(
      { 錯誤: 'Sitemap 生成失敗' },
      { status: 500 }
    )
  }
}
