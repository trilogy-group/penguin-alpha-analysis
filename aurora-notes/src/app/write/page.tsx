export default function WritePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            寫作
          </h1>
          <p className="text-muted-foreground text-lg">
            分享您的想法和見解
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border rounded-lg p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  文章標題
                </label>
                <input
                  type="text"
                  placeholder="輸入文章標題..."
                  className="w-full p-3 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  文章內容
                </label>
                <textarea
                  placeholder="開始寫作..."
                  rows={12}
                  className="w-full p-3 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  標籤
                </label>
                <input
                  type="text"
                  placeholder="輸入標籤，用逗號分隔..."
                  className="w-full p-3 border rounded-md"
                />
              </div>
              
              <div className="flex gap-4">
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                  發布文章
                </button>
                <button className="px-6 py-2 border border-border rounded-md hover:bg-accent">
                  儲存草稿
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              寫作功能正在開發中，敬請期待完整的編輯體驗...
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
