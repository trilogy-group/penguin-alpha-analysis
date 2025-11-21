import { MeiliSearch } from 'meilisearch'

const 搜尋客戶端 = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_API_KEY,
})

const 文章索引名稱 = '文章'

export async function 初始化搜尋索引() {
  try {
    // 檢查索引是否存在
    const 索引列表 = await 搜尋客戶端.getIndexes()
    const 文章索引存在 = 索引列表.results.some(索引 => 索引.uid === 文章索引名稱)

    if (!文章索引存在) {
      // 建立文章索引
      await 搜尋客戶端.createIndex(文章索引名稱, {
        primaryKey: 'id'
      })

      // 設定搜尋屬性
      await 搜尋客戶端.index(文章索引名稱).updateSearchableAttributes([
        '標題',
        '摘要',
        '內容',
        '作者.使用者名稱',
        '標籤.名稱'
      ])

      // 設定排序屬性
      await 搜尋客戶端.index(文章索引名稱).updateSortableAttributes([
        '發布時間',
        '瀏覽次數',
        '喜歡次數',
        '建立時間'
      ])

      // 設定篩選屬性
      await 搜尋客戶端.index(文章索引名稱).updateFilterableAttributes([
        '已發布',
        '標籤.id',
        '作者.id',
        '發布時間'
      ])

      console.log('搜尋索引初始化完成')
    }
  } catch (錯誤) {
    console.error('初始化搜尋索引失敗:', 錯誤)
  }
}

export async function 索引文章(文章資料: any) {
  try {
    const 索引化資料 = {
      id: 文章資料.id,
      標題: 文章資料.標題,
      摘要: 文章資料.摘要 || '',
      內容: 文章資料.內容,
      已發布: 文章資料.已發布,
      發布時間: 文章資料.發布時間 || 文章資料.建立時間,
      瀏覽次數: 文章資料.瀏覽次數,
      喜歡次數: 文章資料.喜歡次數,
      作者: {
        id: 文章資料.作者.id,
        使用者名稱: 文章資料.作者.使用者名稱
      },
      標籤: 文章資料.標籤?.map((文章標籤: any) => ({
        id: 文章標籤.標籤.id,
        名稱: 文章標籤.標籤.名稱
      })) || []
    }

    await 搜尋客戶端.index(文章索引名稱).addDocuments([索引化資料])
    console.log(`文章 ${文章資料.id} 已索引`)
  } catch (錯誤) {
    console.error('索引文章失敗:', 錯誤)
  }
}

export async function 更新文章索引(文章資料: any) {
  try {
    await 索引文章(文章資料)
  } catch (錯誤) {
    console.error('更新文章索引失敗:', 錯誤)
  }
}

export async function 從索引移除文章(文章Id: string) {
  try {
    await 搜尋客戶端.index(文章索引名稱).deleteDocument(文章Id)
    console.log(`文章 ${文章Id} 已從索引移除`)
  } catch (錯誤) {
    console.error('從索引移除文章失敗:', 錯誤)
  }
}

export async function 搜尋文章(查詢: string, 選項: {
  頁數?: number
  每頁數量?: number
  排序方式?: string
  標籤篩選?: string[]
} = {}) {
  try {
    const {
      頁數 = 1,
      每頁數量 = 12,
      排序方式 = '發布時間:desc',
      標籤篩選 = []
    } = 選項

    const 跳過數量 = (頁數 - 1) * 每頁數量

    // 建立篩選條件
    let 篩選條件 = '已發布 = true'
    
    if (標籤篩選.length > 0) {
      const 標籤篩選條件 = 標籤篩選.map(標籤Id => `標籤.id = ${標籤Id}`).join(' OR ')
      篩選條件 += ` AND (${標籤篩選條件})`
    }

    const 搜尋結果 = await 搜尋客戶端.index(文章索引名稱).search(查詢, {
      offset: 跳過數量,
      limit: 每頁數量,
      sort: [排序方式],
      filter: 篩選條件,
      attributesToHighlight: ['標題', '摘要', '內容'],
      attributesToRetrieve: [
        'id',
        '標題',
        '摘要',
        '封面圖片',
        '閱讀時間',
        '瀏覽次數',
        '喜歡次數',
        '建立時間',
        '發布時間',
        '作者',
        '標籤'
      ]
    })

    return {
      文章: 搜尋結果.hits.map((命中: any) => ({
        ...命中,
        高亮: 命中._formatted
      })),
      總數: 搜尋結果.estimatedTotalHits,
      查詢時間: 搜尋結果.processingTimeMs,
      當前頁數: 頁數,
      總頁數: Math.ceil(搜尋結果.estimatedTotalHits / 每頁數量)
    }
  } catch (錯誤) {
    console.error('搜尋文章失敗:', 錯誤)
    throw new Error('搜尋服務暫時無法使用')
  }
}

export async function 重建所有文章索引() {
  try {
    // 清空現有索引
    await 搜尋客戶端.index(文章索引名稱).deleteAllDocuments()

    // 獲取所有已發布文章
    const { 資料庫 } = await import('@/lib/資料庫')
    const 所有文章 = await 資料庫.文章.findMany({
      where: { 已發布: true },
      include: {
        作者: {
          select: {
            id: true,
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
      }
    })

    // 批量索引文章
    const 索引化文章 = 所有文章.map(文章 => ({
      id: 文章.id,
      標題: 文章.標題,
      摘要: 文章.摘要 || '',
      內容: 文章.內容,
      已發布: 文章.已發布,
      發布時間: 文章.發布時間 || 文章.建立時間,
      瀏覽次數: 文章.瀏覽次數,
      喜歡次數: 文章.喜歡次數,
      作者: {
        id: 文章.作者.id,
        使用者名稱: 文章.作者.使用者名稱
      },
      標籤: 文章.標籤.map(文章標籤 => ({
        id: 文章標籤.標籤.id,
        名稱: 文章標籤.標籤.名稱
      }))
    }))

    // 分批索引以避免超時
    const 批次大小 = 100
    for (let i = 0; i < 索引化文章.length; i += 批次大小) {
      const 批次 = 索引化文章.slice(i, i + 批次大小)
      await 搜尋客戶端.index(文章索引名稱).addDocuments(批次)
      console.log(`已索引 ${Math.min(i + 批次大小, 索引化文章.length)}/${索引化文章.length} 篇文章`)
    }

    console.log('所有文章索引重建完成')
    return { 成功: true, 索引數量: 索引化文章.length }
  } catch (錯誤) {
    console.error('重建文章索引失敗:', 錯誤)
    throw new Error('重建索引失敗')
  }
}
