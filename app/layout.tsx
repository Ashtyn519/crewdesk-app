import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CrewDesk — The operating system for your freelance workforce',
  description: 'CrewDesk gives production managers and freelance teams the tools to manage projects, crew, contracts and invoices in one premium platform.',
  keywords: ['crew management', 'production management', 'freelance workforce', 'film production', 'invoicing', 'contracts'],
  authors: [{ name: 'CrewDesk' }],
  openGraph: {
    title: 'CrewDesk — The operating system for your freelance workforce',
    description: 'Manage your crew, projects, invoices and contracts in one premium platform built for film & TV.',
    type: 'website',
    url: 'https://crewdeskapp.vercel.app',
    siteName: 'CrewDesk',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CrewDesk — Freelance Workforce Management',
    description: 'The premium platform for managing your film & TV production workforce.',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#04080F] text-white antialiased font-sans`}>{children}</body>
    </html>
  )
}
