import React from 'react'
import { PT_Serif } from 'next/font/google'
import './globals.css'

const ptSerif = PT_Serif({
  weight: ['400', '700'],
  subsets: ['cyrillic', 'latin'],
  display: 'swap',
  variable: '--font-pt-serif',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={ptSerif.variable}>
      <body className="font-sans antialiased min-h-screen flex flex-col text-base font-medium">{children}</body>
    </html>
  )
}
