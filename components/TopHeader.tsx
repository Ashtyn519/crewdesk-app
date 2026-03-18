'use client'

import { usePathname } from 'next/navigation'
import { Bell, Search, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Your production overview' },
  '/projects': { title: 'Projects', subtitle: 'Manage your productions' },
  '/contracts': { title: 'Contracts', subtitle: 'Track agreements & signings' },
  '/invoices': { title: 'Invoices', subtitle: 'Billing & payments' },
  '/crew': { title: 'Crew', subtitle: 'Your talent roster' },
  '/messages': { title: 'Messages', subtitle: 'Team communications' },
  '/settings': { title: 'Settings', subtitle: 'Account & workspace' },
}

export default function TopHeader() {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  
  const page = Object.entries(pageTitles).find(([key]) => 
    pathname === key || pathname.startsWith(key + '/')
  )?.[1] || { title: 'CrewDesk', subtitle: '' }

  // Breadcrumb
  const segments = pathname.split('/').filter(Boolean)

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-white/[0.06] bg-[#04080F]/80 backdrop-blur-sm sticky top-0 z-20">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        {segments.map((seg, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {idx > 0 && <ChevronRight className="w-3 h-3 text-gray-600" />}
            <span className={idx === segments.length - 1 
              ? 'text-white text-sm font-semibold capitalize'
              : 'text-gray-500 text-sm capitalize'
            }>
              {seg}
            </span>
          </div>
        ))}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search trigger */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] rounded-lg text-gray-400 hover:text-gray-200 transition-all text-xs"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline text-[10px] bg-white/5 px-1 py-0.5 rounded text-gray-500">⌘K</kbd>
        </button>

        {/* Notifications */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] text-gray-400 hover:text-gray-200 transition-all">
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-400 rounded-full" />
        </button>
      </div>
    </header>
  )
}
