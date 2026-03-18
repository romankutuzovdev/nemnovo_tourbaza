'use client'

/** Рендерит контент юридической страницы: HTML из CKEditor или plain text по абзацам */
export function LegalPageContent({
  content,
  className = '',
}: {
  content: string
  className?: string
}) {
  if (!content?.trim()) return null

  const hasHtml = /<[a-z][\s\S]*>/i.test(content)

  if (hasHtml) {
    return (
      <div
        className={`legal-content font-sans text-black/80 leading-relaxed ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim())
  return (
    <div className={`font-sans text-black/80 leading-relaxed space-y-6 ${className}`}>
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  )
}
