import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <h1 className="font-sans text-4xl font-bold text-black mb-2">404</h1>
      <p className="font-sans text-black/80 mb-6">Страница не найдена</p>
      <Link
        href="/ru"
        className="font-sans text-sm font-medium text-black hover:underline"
      >
        На главную
      </Link>
    </div>
  )
}
