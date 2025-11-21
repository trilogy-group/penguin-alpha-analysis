import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const robots = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/sitemap.xml
Sitemap: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/rss.xml

# Crawl-delay
Crawl-delay: 1

# Disallow specific paths if needed
# Disallow: /api/
# Disallow: /admin/
`

  return new NextResponse(robots, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  })
}
