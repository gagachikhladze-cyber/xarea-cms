import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'X AREA FITNESS — ქუთაისის პრემიუმ ფიტნეს დარბაზი',
  description: 'ფიტნეს დარბაზი, საუნა და ჯგუფური ვარჯიშები ქუთაისში',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
