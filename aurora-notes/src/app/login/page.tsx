export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-card border rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              登入
            </h1>
            <p className="text-muted-foreground">
              登入您的極光筆記帳戶
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                電子郵件
              </label>
              <input
                type="email"
                placeholder="輸入您的電子郵件..."
                className="w-full p-3 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                密碼
              </label>
              <input
                type="password"
                placeholder="輸入您的密碼..."
                className="w-full p-3 border rounded-md"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">記住我</span>
              </label>
              <a href="#" className="text-sm text-primary hover:underline">
                忘記密碼？
              </a>
            </div>
            
            <button className="w-full py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
              登入
            </button>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                還沒有帳戶？{' '}
                <a href="#" className="text-primary hover:underline">
                  立即註冊
                </a>
              </p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              登入功能正在開發中，敬請期待...
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
