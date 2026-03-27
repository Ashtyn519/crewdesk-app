'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Search, Bell, CreditCard, UserCheck, FileSignature, FolderPlus, MessageSquare, Folder, User, Receipt, FileText, LogOut, Settings } from 'lucide-react'

type NotifType = 'payment' | 'crew' | 'contract' | 'project' | 'message'

const notifications: { id: number; text: string; time: string; icon: NotifType; unread: boolean }[] = [
  { id: 1, text: 'Invoice paid — funds incoming', time: '2 min ago', icon: 'payment', unread: true },
  { id: 2, text: 'Crew member accepted your invitation', time: '18 min ago', icon: 'crew', unread: true },
  { id: 3, text: 'Contract signed and countersigned', time: '1 hr ago', icon: 'contract', unread: false },
  { id: 4, text: 'New project created successfully', time: '3 hrs ago', icon: 'project', unread: false },
  { id: 5, text: 'You have 3 unread messages', time: 'Yesterday', icon: 'message', unread: false },
]

const NOTIF_ICONS: Record<NotifType, React.ElementType> = {
  payment: CreditCard,
  crew: UserCheck,
  contract: FileSignature,
  project: FolderPlus,
  message: MessageSquare,
}

const NOTIF_COLORS: Record<NotifType, string> = {
  payment: 'text-emerald-400',
  crew: 'text-blue-400',
  contract: 'text-purple-400',
  project: 'text-amber-400',
  message: 'text-sky-400',
}

const searchResults = [
  { type: 'project' as const, label: 'Neon Nights', sub: 'Production · Active', href: '/projects' },
  { type: 'crew' as const, label: 'Sarah Chen', sub: 'Director of Photography', href: '/crew' },
  { type: 'invoice' as const, label: 'INV-2024', sub: 'GBP 3,200 · Paid', href: '/invoices' },
  { type: 'contract' as const, label: 'City Lights Agreement', sub: 'Signed', href: '/contracts' },
]

const SEARCH_ICONS: Record<string, React.ElementType> = {
  project: Folder,
  crew: User,
  invoice: Receipt,
  contract: FileText,
}

export default function TopHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const segment = (pathname.slice(1) || 'dashboard').split('/')[0]
  const pageName = segment.charAt(0).toUpperCase() + segment.slice(1)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const [unreadCount, setUnreadCount] = useState(notifications.filter(n => n.unread).length)
  const notifRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  async function handleSignOut() {
    const sb = createClient()
    await sb.auth.signOut()
    router.push('/login')
  }
  const searchRef = useRef<HTMLInputElement>(null)

  const markAllRead = () => { setUnreadCount(0); setNotifOpen(false) }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = searchQ.length > 0
    ? searchResults.filter(r => r.label.toLowerCase().includes(searchQ.toLowerCase()) || r.sub.toLowerCase().includes(searchQ.toLowerCase()))
    : searchResults

  return (
    <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-40" style={{ background: 'rgba(4,8,15,0.95)', backdropFilter: 'blur(12px)' }}>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-500">CrewDesk</span>
        <span className="text-slate-600">&rsaquo;</span>
        <span className="text-white font-medium">{pageName}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <div className={`flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden h-9 transition-all duration-300 ${searchOpen ? 'w-60' : 'w-9'}`}>
            <button onClick={() => { setSearchOpen(!searchOpen); setTimeout(() => searchRef.current?.focus(), 100) }} className="w-9 h-9 flex items-center justify-center shrink-0 text-slate-400 hover:text-white transition-colors">
              <Search className="w-4 h-4" />
            </button>
            {searchOpen && (
              <input ref={searchRef} value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search projects, crew, invoices..." className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 outline-none pr-3" onBlur={() => setTimeout(() => { setSearchOpen(false); setSearchQ('') }, 200)} />
            )}
          </div>
          {searchOpen && filtered.length > 0 && (
            <div className="absolute top-12 right-0 w-72 rounded-2xl border border-white/10 py-2 z-50 shadow-2xl" style={{ background: '#0A1020' }}>
              <p className="text-xs text-slate-500 px-4 py-1 mb-1 uppercase tracking-wider">Results</p>
              {filtered.map((r, i) => {
                const Icon = SEARCH_ICONS[r.type]
                return (
                  <Link key={i} href={r.href}>
                    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 cursor-pointer transition-colors">
                      <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-white">{r.label}</p>
                        <p className="text-xs text-slate-500">{r.sub}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        <div className="relative" ref={notifRef}>
          <button onClick={() => setNotifOpen(!notifOpen)} className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/8 border border-white/10 transition-all text-slate-400 hover:text-white">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full text-[10px] font-bold text-black flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute top-12 right-0 w-80 rounded-2xl border border-white/10 z-50 shadow-2xl overflow-hidden" style={{ background: '#0A1020' }}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <p className="text-sm font-semibold text-white">Notifications</p>
                <button onClick={markAllRead} className="text-xs text-amber-400 hover:text-amber-300">Mark all read</button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map(n => {
                  const Icon = NOTIF_ICONS[n.icon]
                  const color = NOTIF_COLORS[n.icon]
                  return (
                    <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 last:border-0 ${n.unread ? 'bg-amber-500/[0.03]' : ''}`}>
                      <div className={`w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5 ${color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm leading-snug ${n.unread ? 'text-white font-medium' : 'text-slate-400'}`}>{n.text}</p>
                        <p className="text-xs text-slate-500 mt-1">{n.time}</p>
                      </div>
                      {n.unread && <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-2" />}
                    </div>
                  )
                })}
              </div>
              <div className="px-4 py-2 border-t border-white/5">
                <button className="w-full text-center text-xs text-amber-400 hover:text-amber-300 py-1">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-sm font-bold text-black cursor-pointer hover:scale-105 transition-transform">
          A
        </div>
      </div>
    
            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black text-sm font-bold hover:ring-2 hover:ring-amber-400/30 transition-all"
              >
                A
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-10 w-44 bg-[#0F1A2E] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                  <Link href="/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <button onClick={handleSignOut} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors border-t border-white/5">
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
      </header>
  )
                            }
