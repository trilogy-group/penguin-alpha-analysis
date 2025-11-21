export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            關於極光筆記
          </h1>
          <p className="text-muted-foreground text-lg">
            了解我們的故事和使命
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">我們的使命</h2>
            <p className="text-muted-foreground leading-relaxed">
              極光筆記致力於創造一個優質的知識分享平台，讓每個人都能輕鬆地分享自己的想法和見解。
              我們相信知識的力量，並致力於為用戶提供最佳的閱讀和寫作體驗。
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">特色功能</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• 優雅簡潔的閱讀介面</li>
              <li>• 強大的編輯工具</li>
              <li>• 智能標籤系統</li>
              <li>• 響應式設計</li>
              <li>• 快速載入速度</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">聯絡我們</h2>
            <p className="text-muted-foreground">
              如果您有任何問題或建議，歡迎隨時與我們聯繫。
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
