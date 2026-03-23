import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'camp.io — Find your stay in nature',
  description: 'Discover handpicked campgrounds, compare amenities, and book with ease.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  )
}