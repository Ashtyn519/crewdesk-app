'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Bell, LogOut, Settings } from 'lucide-react'

const PAGE_NAMES: Record<string, string> = {
  dashboard: 'Dashboard',
  projects: 'Projects',
  crew: 'Freelancers',
  schedule: 'Schedule',
  contracts: 'Contracts',
  invoices: 'Invoices',
  messages: 'Messages',
  reports: 'Reports',
  profile: 'My Profile',
  settings: 'Settings',
  pricing: 'Pricing',
  onboarding: 'Onboarding',
  jobs: 'Jobs',
  analytics: 'Analytics',
}

export default function TopHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const segment = (pathname.slice(1) || 'dashboard').split('/')[0]
  const pageName = PAGE_NAMES[segment] || (segment.charAt(0).toUpperCase() + segment.slice(1))

  const userMenuRef = useRef<HTMLDivElement>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [userInitial, setUserInitial] = useState('U')
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    loadUser()
  }, [])

  async function loadUser() {
    try {
      const sb = createClient()
      const { data: { user } } = await sb.auth.getUser()
      if (!user) return
      const name = user.user_metadata?.full_name || user.user_metadata?.name || ''
      const email = user.email || ''
      setUserEmail(email)
      setUserName(name)
      if (name) {
        setUserInitial(name.charAt(0).toUpperCase())
      } else if (email) {
        setUserInitial(email.charAt(0).toUpperCase())
      }
    } catch {}
  }

  async function handleSignOut() {
    const sb = createClient()
    await sb.auth.signOut()
    router.push('/login')
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header
      className="h-14 border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-40"
      style={{ background: 'rgba(4,8,15,0.95)', backdropFilter: 'blur(12px)' }}
    >
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-500">CrewDesk</span>
        <span className="text-slate-600">&rsaquo;</span>
        <span className="text-white font-medium">{pageName}</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/8 border border-white/10 transition-all text-slate-400 hover:text-white"
          title="Notifications"
          onClick={() => {}}
        >
          <Bell className="w-4 h-4" />
        </button>

        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black text-sm font-bold hover:ring-2 hover:ring-amber-400/30 transition-all"
            title={userName || userEmail || 'Account'}
          >
            {userInitial}
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-10 w-52 bg-[#0F1A2E] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
              {(userName || userEmail) && (
                <div className="px-4 py-3 border-b border-white/5">
                  {userName && <p className="text-xs font-semibold text-white truncate">{userName}</p>}
                  {userEmail && <p className="text-xs text-slate-500 truncate">{userEmail}</p>}
                </div>
              )}
              <Link
                href="/settings"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors border-t border-white/5"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
