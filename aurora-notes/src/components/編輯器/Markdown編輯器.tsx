'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Highlight from '@tiptap/extension-highlight'
import { createLowlight } from 'lowlight'
import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Highlighter
} from 'lucide-react'

const lowlight = createLowlight()

interface 編輯器Props {
  內容: string
  變更內容: (內容: string) => void
  佔位符?: string
  最大字數?: number
  只讀?: boolean
}

export function Markdown編輯器({ 
  內容, 
  變更內容, 
  佔位符 = '開始撰寫您的文章...',
  最大字數 = 10000,
  只讀 = false 
}: 編輯器Props) {
  const [連結網址, 設定連結網址] = useState('')
  const [顯示連結輸入, 設定顯示連結輸入] = useState(false)

  const 編輯器 = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 佔位符,
      }),
      CharacterCount.configure({
        limit: 最大字數,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-aurora-600 hover:text-aurora-700 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: 內容,
    onUpdate: ({ editor }) => {
      變更內容(editor.getHTML())
    },
    editable: !只讀,
  })

  const 設定粗體 = useCallback(() => 編輯器?.chain().focus().toggleBold().run(), [編輯器])
  const 設定斜體 = useCallback(() => 編輯器?.chain().focus().toggleItalic().run(), [編輯器])
  const 設定刪除線 = useCallback(() => 編輯器?.chain().focus().toggleStrike().run(), [編輯器])
  const 設定程式碼 = useCallback(() => 編輯器?.chain().focus().toggleCode().run(), [編輯器])
  const 設定標題一 = useCallback(() => 編輯器?.chain().focus().toggleHeading({ level: 1 }).run(), [編輯器])
  const 設定標題二 = useCallback(() => 編輯器?.chain().focus().toggleHeading({ level: 2 }).run(), [編輯器])
  const 設定標題三 = useCallback(() => 編輯器?.chain().focus().toggleHeading({ level: 3 }).run(), [編輯器])
  const 設定無序清單 = useCallback(() => 編輯器?.chain().focus().toggleBulletList().run(), [編輯器])
  const 設定有序清單 = useCallback(() => 編輯器?.chain().focus().toggleOrderedList().run(), [編輯器])
  const 設定引用 = useCallback(() => 編輯器?.chain().focus().toggleBlockquote().run(), [編輯器])
  const 復原 = useCallback(() => 編輯器?.chain().focus().undo().run(), [編輯器])
  const 重做 = useCallback(() => 編輯器?.chain().focus().redo().run(), [編輯器])
  const 設定連結 = useCallback(() => {
    if (連結網址) {
      編輯器?.chain().focus().setLink({ href: 連結網址 }).run()
      設定連結網址('')
      設定顯示連結輸入(false)
    } else {
      設定顯示連結輸入(true)
    }
  }, [編輯器, 連結網址])
  const 設定圖片 = useCallback(() => {
    const 網址 = window.prompt('輸入圖片網址:')
    if (網址) {
      編輯器?.chain().focus().setImage({ src: 網址 }).run()
    }
  }, [編輯器])
  const 設定標記 = useCallback(() => 編輯器?.chain().focus().toggleHighlight().run(), [編輯器])

  if (!編輯器) {
    return null
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {!只讀 && (
        <div className="border-b bg-muted/50 p-2 flex flex-wrap gap-1 items-center">
          <div className="flex items-center gap-1">
            <Button
              variant={編輯器.isActive('bold') ? 'default' : 'ghost'}
              size="sm"
              onClick={設定粗體}
              title="粗體 (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant={編輯器.isActive('italic') ? 'default' : 'ghost'}
              size="sm"
              onClick={設定斜體}
              title="斜體 (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant={編輯器.isActive('strike') ? 'default' : 'ghost'}
              size="sm"
              onClick={設定刪除線}
              title="刪除線"
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            <Button
              variant={編輯器.isActive('code') ? 'default' : 'ghost'}
              size="sm"
              onClick={設定程式碼}
              title="行內程式碼"
            >
              <Code className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center gap-1">
            <Button
              variant={編輯器.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
              size="sm"
              onClick={設定標題一}
              title="標題一"
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              variant={編輯器.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
              size="sm"
              onClick={設定標題二}
              title="標題二"
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button
              variant={編輯器.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
              size="sm"
              onClick={設定標題三}
              title="標題三"
            >
              <Heading3 className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center gap-1">
            <Button
              variant={編輯器.isActive('bulletList') ? 'default' : 'ghost'}
              size="sm"
              onClick={設定無序清單}
              title="無序清單"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={編輯器.isActive('orderedList') ? 'default' : 'ghost'}
              size="sm"
              onClick={設定有序清單}
              title="有序清單"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              variant={編輯器.isActive('blockquote') ? 'default' : 'ghost'}
              size="sm"
              onClick={設定引用}
              title="引用"
            >
              <Quote className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center gap-1">
            <Button
              variant={編輯器.isActive('link') ? 'default' : 'ghost'}
              size="sm"
              onClick={設定連結}
              title="連結"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={設定圖片}
              title="圖片"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={編輯器.isActive('highlight') ? 'default' : 'ghost'}
              size="sm"
              onClick={設定標記}
              title="標記"
            >
              <Highlighter className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={復原}
              disabled={!編輯器.can().undo()}
              title="復原 (Ctrl+Z)"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={重做}
              disabled={!編輯器.can().redo()}
              title="重做 (Ctrl+Y)"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>

          {顯示連結輸入 && (
            <div className="flex items-center gap-2 ml-auto">
              <input
                type="url"
                placeholder="輸入連結網址"
                value={連結網址}
                onChange={(e) => 設定連結網址(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    設定連結()
                  }
                }}
                className="px-2 py-1 text-sm border rounded"
                autoFocus
              />
              <Button size="sm" onClick={設定連結}>
                確定
              </Button>
              <Button size="sm" variant="ghost" onClick={() => 設定顯示連結輸入(false)}>
                取消
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="prose prose-sm dark:prose-invert max-w-none p-4 min-h-[200px] focus:outline-none">
        <EditorContent editor={編輯器} />
      </div>

      {!只讀 && (
        <div className="border-t bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
          字數: {編輯器.storage.characterCount.characters()} / {最大字數}
        </div>
      )}
    </div>
  )
}
