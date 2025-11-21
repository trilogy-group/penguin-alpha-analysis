import { DefaultSeo } from 'next-seo'
import { NextSeo, ArticleJsonLd, BreadcrumbJsonLd } from 'next-seo/lib/jsonld'

const SEO_CONFIG = {
  title: '極光筆記 - Aurora Notes',
  titleTemplate: '%s | 極光筆記',
  defaultTitle: '極光筆記 - Aurora Notes',
  description: '一個現代化的繁體中文技術部落格平台，提供優質的技術文章分享與交流空間',
  canonical: 'https://aurora-notes.vercel.app',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://aurora-notes.vercel.app',
    siteName: '極光筆記',
    images: [
      {
        url: 'https://aurora-notes.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: '極光筆記 - Aurora Notes',
      },
    ],
  },
  twitter: {
    handle: '@aurora_notes',
    site: '@aurora_notes',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: '技術部落格,繁體中文,程式設計,開發,前端,後端,全端,教學,分享',
    },
    {
      name: 'author',
      content: '極光筆記團隊',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      httpEquiv: 'x-ua-compatible',
      content: 'IE=edge',
    },
  ],
}

interface SEOProps {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  noindex?: boolean
  article?: {
    publishedTime?: string
    modifiedTime?: string
    authors?: string[]
    tags?: string[]
    section?: string
  }
  breadcrumb?: {
    items: Array<{
      name: string
      url: string
    }>
  }
}

export function SEO({ 
  title, 
  description, 
  canonical, 
  ogImage, 
  ogType = 'website',
  noindex = false,
  article,
  breadcrumb
}: SEOProps) {
  const seoConfig = {
    ...SEO_CONFIG,
    title: title || SEO_CONFIG.defaultTitle,
    description: description || SEO_CONFIG.description,
    canonical: canonical || SEO_CONFIG.canonical,
    noindex,
    openGraph: {
      ...SEO_CONFIG.openGraph,
      type: ogType,
      title: title || SEO_CONFIG.defaultTitle,
      description: description || SEO_CONFIG.description,
      images: ogImage ? [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title || SEO_CONFIG.defaultTitle,
        },
      ] : SEO_CONFIG.openGraph.images,
    },
  }

  if (article) {
    (seoConfig.openGraph as any).article = article
  }

  return (
    <>
      <NextSeo {...seoConfig} />
      
      {article && (
        <ArticleJsonLd
          url={canonical || SEO_CONFIG.canonical}
          headline={title || SEO_CONFIG.defaultTitle}
          image={ogImage ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: title || SEO_CONFIG.defaultTitle,
            },
          ] : SEO_CONFIG.openGraph.images.map(img => ({
            url: img.url,
            width: img.width,
            height: img.height,
            alt: img.alt,
          }))}
          datePublished={article.publishedTime}
          dateModified={article.modifiedTime}
          authorName={article.authors || ['極光筆記團隊']}
          description={description || SEO_CONFIG.description}
          publisherName="極光筆記"
          publisherLogo="https://aurora-notes.vercel.app/logo.png"
        />
      )}
      
      {breadcrumb && (
        <BreadcrumbJsonLd
          itemListElements={breadcrumb.items.map((item, index) => ({
            position: index + 1,
            name: item.name,
            item: item.url,
          }))}
        />
      )}
    </>
  )
}

export { DefaultSeo }
export default SEO
