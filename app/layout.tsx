import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CrewDesk — The operating system for your freelance workforce',
  description: 'CrewDesk gives businesses the tools to manage freelancers, projects, contracts and invoices in one premium platform.',
  keywords: ['freelancer management', 'freelance workforce', 'project management', 'invoicing', 'contracts', 'business tools'],
  authors: [{ name: 'CrewDesk' }],
  openGraph: {
    title: 'CrewDesk — The operating system for your freelance workforce',
    description: 'Manage your freelancers, projects, invoices and contracts in one premium platform built for modern businesses.',
    type: 'website',
    url: 'https://crewdeskapp.vercel.app',
    siteName: 'CrewDesk',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CrewDesk — Freelance Workforce Management',
    description: 'The premium platform for businesses that hire freelancers.',
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
