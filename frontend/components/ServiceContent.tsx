/**
 * Рендерит HTML-описание услуги из CKEditor с правильными стилями и URL медиа.
 */
import { getApiUrl } from '@/lib/api'

function fixMediaUrls(html: string): string {
  const apiUrl = getApiUrl()
  if (!apiUrl) return html
  return html
    .replace(/src="\/media\//g, `src="${apiUrl}/media/`)
    .replace(/href="\/media\//g, `href="${apiUrl}/media/`)
}

function looksLikeHtml(text: string): boolean {
  if (!text || typeof text !== 'string') return false
  const trimmed = text.trim()
  return trimmed.startsWith('<') && (trimmed.includes('</') || trimmed.includes('/>'))
}

export type ServiceContentProps = {
  content: string
  className?: string
}

export function ServiceContent({ content, className = '' }: ServiceContentProps) {
  if (!content?.trim()) return null

  if (looksLikeHtml(content)) {
    const safeHtml = fixMediaUrls(content)
    return (
      <div
        className={`service-content ${className}`.trim()}
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    )
  }

  // Legacy plain text: один абзац с сохранением переносов
  return (
    <div className={`service-content service-content-plain ${className}`.trim()}>
      <p className="whitespace-pre-wrap">{content}</p>
    </div>
  )
}
