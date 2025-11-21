# 極光筆記 - Aurora Notes

一個現代化的繁體中文技術部落格平台，基於 Next.js 15.2+ 構建，提供完整的內容管理、搜尋、認證和分析功能。

## ✨ 特色功能

### 🚀 核心技術棧
- **Next.js 15.2+** - App Router，React 19
- **TypeScript 5.6+** - 嚴格模式類型檢查
- **Tailwind CSS 3.4+** - 現代化樣式框架
- **shadcn/ui** - 高品質 UI 組件庫
- **Prisma ORM** - 類型安全的資料庫存取
- **PostgreSQL** - 主要資料庫
- **NextAuth.js v5** - 認證系統

### 📝 內容管理
- **TipTap Markdown 編輯器** - 繁體中文 UI
- **文章管理** - 草稿、發布、排程
- **標籤系統** - 動態標籤雲
- **無限滾動** - 流暢的內容瀏覽
- **圖片上傳** - 封面圖片支援

### 🔍 搜尋與發現
- **Meilisearch** - 全文搜尋引擎
- **即時搜尋** - 防抖輸入處理
- **搜尋高亮** - 關鍵字標記顯示
- **標籤篩選** - 多維度內容篩選

### 🎨 使用者體驗
- **深色/淺色模式** - 系統偏好同步
- **響應式設計** - 行動裝置最佳化
- **複雜動畫** - Framer Motion + 3D tilt 效果
- **骨架屏載入** - 流暢的載入體驗
- **頁面轉場** - 絲滑的導航體驗

### 📊 分析與 SEO
- **儀表板** - Recharts 圖表統計
- **RSS Feed** - 自動生成
- **Sitemap.xml** - 搜尋引擎最佳化
- **Robots.txt** - 爬蟲控制
- **SEO Meta Tags** - next-seo 整合

### 🔐 認證與安全
- **多種登入方式** - Credentials + OAuth (GitHub, Google)
- **JWT 令牌** - 安全的身份驗證
- **會話管理** - 自動過期處理
- **安全標頭** - XSS、CSRF 防護

## 🚀 快速開始

### 環境需求
- Node.js 18.17+ 
- PostgreSQL 14+
- Meilisearch (可選，用於搜尋功能)

### 安裝步驟

1. **複製專案**
```bash
git clone <repository-url>
cd aurora-notes
```

2. **安裝依賴**
```bash
npm install
```

3. **環境設定**
```bash
cp .env.example .env.local
```

4. **設定環境變數**
```env
# 資料庫
DATABASE_URL="postgresql://username:password@localhost:5432/aurora_notes"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth 提供者
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Prisma Accelerate (可選)
PRISMA_ACCELERATE_URL="your-prisma-accelerate-url"

# Meilisearch (可選)
MEILISEARCH_HOST="http://localhost:7700"
MEILISEARCH_API_KEY="your-meilisearch-api-key"
```

5. **資料庫設定**
```bash
# 生成 Prisma 客戶端
npx prisma generate

# 執行資料庫遷移
npx prisma migrate dev --name init

# (可選) 填入範例資料
npx prisma db seed
```

6. **啟動開發伺服器**
```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 查看結果。

## 📁 專案結構

```
aurora-notes/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API 路由
│   │   ├── 文章/              # 文章頁面
│   │   ├── 標籤/              # 標籤頁面
│   │   ├── 搜尋/              # 搜尋頁面
│   │   └── 儀表板/            # 管理儀表板
│   ├── components/            # React 組件
│   │   ├── 文章/              # 文章相關組件
│   │   ├── 標籤/              # 標籤相關組件
│   │   ├── 搜尋/              # 搜尋相關組件
│   │   ├── 主題/              # 主題切換組件
│   │   ├── 動畫/              # 動畫效果組件
│   │   ├── 儀表板/            # 儀表板組件
│   │   ├── SEO/               # SEO 組件
│   │   └── ui/                # shadcn/ui 基礎組件
│   ├── lib/                   # 工具函數
│   │   ├── 認證.ts             # NextAuth.js 設定
│   │   ├── 資料庫.ts           # Prisma 客戶端
│   │   └── 搜尋.ts             # Meilisearch 整合
│   └── types/                 # TypeScript 類型定義
├── prisma/
│   ├── schema.prisma          # 資料庫 Schema
│   └── migrations/            # 資料庫遷移檔案
├── public/                   # 靜態資源
├── .env.example              # 環境變數範例
├── eslint.config.mjs         # ESLint 設定
├── tailwind.config.js        # Tailwind CSS 設定
├── tsconfig.json            # TypeScript 設定
└── vercel.json              # Vercel 部署設定
```

## 🛠️ 開發指令

```bash
# 開發模式
npm run dev

# 建置生產版本
npm run build

# 啟動生產伺服器
npm run start

# 程式碼檢查
npm run lint

# TypeScript 檢查
npm run type-check

# Prisma 相關指令
npx prisma studio          # 開啟 Prisma Studio
npx prisma generate        # 生成客戶端
npx prisma migrate dev     # 執行遷移
npx prisma db push         # 推送 Schema 到資料庫
```

## 🎨 自訂設定

### 主題色彩
在 `tailwind.config.js` 中自訂極光綠主題色彩：

```javascript
theme: {
  extend: {
    colors: {
      aurora: {
        50: '#f0fdf4',
        500: '#22c55e',
        600: '#16a34a',
        900: '#14532d'
      }
    }
  }
}
```

### shadcn/ui 組件
新增 shadcn/ui 組件：

```bash
npx shadcn-ui@latest add [component-name]
```

### 字體設定
在 `src/app/layout.tsx` 中調整字體配置：

```typescript
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
```

## 🚀 部署

### Vercel 部署
1. 推送程式碼到 GitHub
2. 連接 Vercel 帳號
3. 設定環境變數
4. 自動部署

### 環境變數設定
在 Vercel 專案設定中新增：
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- OAuth 提供者憑證
- `PRISMA_ACCELERATE_URL`
- `MEILISEARCH_HOST` 和 `MEILISEARCH_API_KEY`

## 📚 API 文件

### 文章 API
- `GET /api/文章` - 獲取文章列表
- `POST /api/文章` - 建立新文章
- `PUT /api/文章/[id]` - 更新文章
- `DELETE /api/文章/[id]` - 刪除文章

### 標籤 API
- `GET /api/標籤` - 獲取標籤列表
- `POST /api/標籤` - 建立新標籤

### 搜尋 API
- `GET /api/搜尋` - 搜尋文章

### 儀表板 API
- `GET /api/儀表板` - 獲取統計資料

## 🔧 故障排除

### 常見問題

**Q: Prisma 遷移失敗**
A: 確認 PostgreSQL 服務正在運行，且 `DATABASE_URL` 正確設定。

**Q: Meilisearch 搜尋無法運作**
A: 確認 Meilisearch 服務正在運行，且 API 金鑰正確。

**Q: OAuth 登入失敗**
A: 檢查 OAuth 應用程式設定和回調 URL。

**Q: 建置時發生 TypeScript 錯誤**
A: 執行 `npm run type-check` 檢查類型錯誤。

## 🤝 貢獻指南

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交變更 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

## 📄 授權

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案。

## 🙏 致謝

- [Next.js](https://nextjs.org/) - React 框架
- [Prisma](https://prisma.io/) - 資料庫 ORM
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [shadcn/ui](https://ui.shadcn.com/) - UI 組件庫
- [Meilisearch](https://meilisearch.com/) - 搜尋引擎
- [Framer Motion](https://framer.com/motion/) - 動畫庫

---

**極光筆記** - 讓知識如極光般閃耀 ✨
