'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Search, Bell, ChevronRight, X, CheckCircle, Clock, FileText, DollarSign } from 'lucide-react'
import clsx from 'clsx'

const PAGE_TITLES: Record<string, { title: string; desc: string }> = {
  '/dashboard':  { title: 'Dashboard',  desc: 'Overview of your production workspace' },
  '/projects':   { title: 'Projects',   desc: 'Manage your film & video projects' },
  '/contracts':  { title: 'Contracts',  desc: 'Agreements and signatures' },
  '/invoices':   { title: 'Invoices',   desc: 'Billing and payments' },
  '/crew':       { title: 'Crew',       desc: 'Your production team' },
  '/messages':   { title: 'Messages',   desc: 'Team communications' },
  '/settings':   { title: 'Settings',   desc: 'Account and workspace settings' },
  '/onboarding': { title: 'Onboarding', desc: 'Set up your workspace' },
}

const MOCK_NOTIFICATIONS = [
  { id: '1', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10', title: 'Invoice paid', desc: 'Pinewood Productions paid INV-001234', time: '5m ago', unread: true },
  { id: '2', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10', title: 'Contract signed', desc: 'Alice Morgan signed the DoP agreement', time: '1h ago', unread: true },
  { id: '3', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10', title: 'Invoice overdue', desc: 'INV-001189 is 3 days overdue', time: '2h ago', unread: false },
  { id: '4', icon: CheckCircle, color: 'text-purple-400', bg: 'bg-purple-400/10', title: 'Project completed', desc: 'BBC Documentary wrapped successfully', time: '1d ago', unread: false },
]

export default function TopHeader() {
  const pathname = usePathname()
  const [showNotifs, setShowNotifs] = useState(false)
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const pageInfo = PAGE_TITLES[pathname] ?? { title: 'CrewDesk', desc: '' }
  const unreadCount = notifications.filter(n => n.unread).length
  const segments = pathname.split('/').filter(Boolean)

  function markAllRead() {
    setNotifications(n => n.map(notif => ({ ...notif, unread: false })))
  }

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/[0.06] bg-[#04080F]/80 backdrop-blur-md sticky top-0 z-30">
      {/* Left: Breadcrumb + Title */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-white/30 mb-0.5">
            <span>CrewDesk</span>
            {segments.map((seg, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3" />
                <span className={i === segments.length - 1 ? 'text-white/60' : 'text-white/30'}>
                  {seg.charAt(0).toUpperCase() + seg.slice(1)}
                </span>
              </span>
            ))}
          </div>
          <h1 className="text-base font-semibold text-white leading-none">{pageInfo.title}</h1>
        </div>
      </div>

      {/* Right: Search + Notifications */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input placeholder="Quick search..."
            className="w-52 pl-9 pr-4 py-2 bg-white/[0.04] border border-white/[0.06] rounded-xl text-xs text-white/70 placeholder-white/25 focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.06] transition-all" />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 text-xs font-mono hidden lg:block">⌘K</kbd>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-xl hover:bg-white/[0.06] text-white/50 hover:text-white transition-all">
            <Bell className="w-4.5 h-4.5 w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-black text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
              <div className="absolute right-0 top-12 z-50 w-80 bg-[#0A1020] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-amber-500 text-black text-xs font-bold rounded-full">{unreadCount}</span>
                    )}
                  </div>
                  <button onClick={markAllRead} className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                    Mark all read
                  </button>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {notifications.map(n => (
                    <div key={n.id} className={clsx('flex items-start gap-3 px-4 py-3 transition-all hover:bg-white/5', n.unread && 'bg-amber-500/[0.03]')}>
                      <div className={clsx('w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5', n.bg)}>
                        <n.icon className={clsx('w-4 h-4', n.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className={clsx('text-xs font-medium', n.unread ? 'text-white' : 'text-white/60')}>{n.title}</p>
                          <span className="text-xs text-white/25 flex-shrink-0">{n.time}</span>
                        </div>
                        <p className="text-xs text-white/40 mt-0.5 truncate">{n.desc}</p>
                      </div>
                      {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />}
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-white/[0.06]">
                  <button className="w-full text-xs text-amber-400 hover:text-amber-300 text-center transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-400 cursor-pointer hover:bg-amber-500/20 transition-all">
          AJ
        </div>
      </div>
    </header>
  )
}
