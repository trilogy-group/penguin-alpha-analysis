export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            極光筆記
          </h1>
          <p className="text-muted-foreground text-lg">
            探索知識的奧秘，分享思想的火花
          </p>
        </div>
        
        <div className="space-y-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              歡迎來到極光筆記
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              這是一個現代化的部落格平台，致力於提供優質的內容和良好的閱讀體驗。
              目前系統正在建置中，敬請期待更多精彩內容。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">優質內容</h3>
              <p className="text-muted-foreground">
                精心挑選的文章，涵蓋各種有趣的主題
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">現代設計</h3>
              <p className="text-muted-foreground">
                簡潔優雅的介面，提供最佳的閱讀體驗
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">快速載入</h3>
              <p className="text-muted-foreground">
                優化的性能，讓您快速找到想要的內容
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
