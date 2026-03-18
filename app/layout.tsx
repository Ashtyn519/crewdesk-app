import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CrewDesk - Production Management',
  description: 'Professional crew management for Film, TV & Events',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#04080F] text-white antialiased">{children}</body>
    </html>
  )
}
