export default function SearchPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            搜尋
          </h1>
          <p className="text-muted-foreground text-lg">
            搜尋您感興趣的內容
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="搜尋文章、標籤或作者..."
            className="w-full p-4 border rounded-lg text-lg"
          />
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              搜尋功能正在開發中，敬請期待...
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
