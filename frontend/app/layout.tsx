import React from 'react'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="font-sans antialiased min-h-screen flex flex-col text-base font-medium">{children}</body>
    </html>
  )
}
