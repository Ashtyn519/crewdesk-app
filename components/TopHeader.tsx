'use client'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const notifications = [
  { id: 1, text: 'Invoice #INV-2024 paid by Neon Films', time: '2 min ago', icon: '💷', unread: true, type: 'payment' },
  { id: 2, text: 'Sarah Chen accepted your crew invitation', time: '18 min ago', icon: '✅', unread: true, type: 'crew' },
  { id: 3, text: '"City Lights" contract signed', time: '1 hr ago', icon: '✍️', unread: false, type: 'contract' },
  { id: 4, text: 'New project "Apex Documentary" created', time: '3 hrs ago', icon: '🆕', unread: false, type: 'project' },
  { id: 5, text: 'James O\'Brien sent 3 new messages', time: 'Yesterday', icon: '💬', unread: false, type: 'message' },
]

const searchResults = [
  { type: 'project', label: 'Neon Nights', sub: 'Production · Active', href: '/projects' },
  { type: 'crew', label: 'Sarah Chen', sub: 'Director of Photography', href: '/crew' },
  { type: 'invoice', label: 'INV-2024', sub: '£3,200 · Paid', href: '/invoices' },
  { type: 'contract', label: 'City Lights Agreement', sub: 'Signed · BFI', href: '/contracts' },
]

export default function TopHeader() {
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const [unreadCount, setUnreadCount] = useState(notifications.filter(n => n.unread).length)
  const notifRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const markAllRead = () => {
    setUnreadCount(0)
    setNotifOpen(false)
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = searchQ.length > 0
    ? searchResults.filter(r =>
        r.label.toLowerCase().includes(searchQ.toLowerCase()) ||
        r.sub.toLowerCase().includes(searchQ.toLowerCase())
      )
    : searchResults

  const icons: Record<string, string> = { project: '📁', crew: '👤', invoice: '📄', contract: '📝' }

  return (
    <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-40" style={{ background: 'rgba(4,8,15,0.95)', backdropFilter: 'blur(12px)' }}>
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-500">CrewDesk</span>
        <span className="text-slate-600">›</span>
        <span className="text-white font-medium">Dashboard</span>
      </div>

      {/* Right: Search + Notifications + Avatar */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <motion.div
            animate={{ width: searchOpen ? 240 : 36 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden h-9"
          >
            <button onClick={() => { setSearchOpen(!searchOpen); setTimeout(() => searchRef.current?.focus(), 100) }}
              className="w-9 h-9 flex items-center justify-center shrink-0 text-slate-400 hover:text-white transition-colors">
              🔍
            </button>
            {searchOpen && (
              <input
                ref={searchRef}
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Search projects, crew, invoices..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 outline-none pr-3"
                onBlur={() => setTimeout(() => { setSearchOpen(false); setSearchQ('') }, 200)}
              />
            )}
          </motion.div>
          <AnimatePresence>
            {searchOpen && filtered.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                className="absolute top-12 right-0 w-72 rounded-2xl border border-white/10 py-2 z-50 shadow-2xl"
                style={{ background: '#0A1020' }}>
                <p className="text-xs text-slate-500 px-4 py-1 mb-1 uppercase tracking-wider">Results</p>
                {filtered.map((r, i) => (
                  <Link key={i} href={r.href}>
                    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 cursor-pointer transition-colors">
                      <span className="text-lg">{icons[r.type]}</span>
                      <div>
                        <p className="text-sm font-semibold text-white">{r.label}</p>
                        <p className="text-xs text-slate-500">{r.sub}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/8 border border-white/10 transition-all text-slate-400 hover:text-white"
          >
            🔔
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full text-[10px] font-bold text-black flex items-center justify-center">
                {unreadCount}
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.96 }}
                className="absolute top-12 right-0 w-80 rounded-2xl border border-white/10 z-50 shadow-2xl overflow-hidden"
                style={{ background: '#0A1020' }}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                  <p className="text-sm font-semibold text-white">Notifications</p>
                  <button onClick={markAllRead} className="text-xs text-amber-400 hover:text-amber-300">Mark all read</button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 last:border-0 ${n.unread ? 'bg-amber-500/3' : ''}`}>
                      <span className="text-xl mt-0.5">{n.icon}</span>
                      <div className="flex-1">
                        <p className={`text-sm leading-snug ${n.unread ? 'text-white font-medium' : 'text-slate-400'}`}>{n.text}</p>
                        <p className="text-xs text-slate-500 mt-1">{n.time}</p>
                      </div>
                      {n.unread && <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-2" />}
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-white/5">
                  <button className="w-full text-center text-xs text-amber-400 hover:text-amber-300 py-1">View all notifications</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-sm font-bold text-black cursor-pointer hover:scale-105 transition-transform">
          A
        </div>
      </div>
    </header>
  )
}
