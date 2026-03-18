'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, FolderOpen, FileSignature, Receipt,
  Users, MessageSquare, Settings, LogOut, ChevronRight,
  Clapperboard, Bell, Search, TrendingUp, Zap
} from 'lucide-react'
import { clsx } from 'clsx'

const navItems = [
  {
    section: 'MAIN',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
      { href: '/projects', icon: FolderOpen, label: 'Projects', badge: null },
      { href: '/contracts', icon: FileSignature, label: 'Contracts', badge: null },
      { href: '/invoices', icon: Receipt, label: 'Invoices', badge: null },
    ]
  },
  {
    section: 'PEOPLE',
    items: [
      { href: '/crew', icon: Users, label: 'Crew', badge: null },
      { href: '/messages', icon: MessageSquare, label: 'Messages', badge: null },
    ]
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [workspace, setWorkspace] = useState<string>('My Workspace')
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) return
      setUser(u)
      const { data: ws } = await supabase
        .from('workspaces')
        .select('name')
        .eq('user_id', u.id)
        .single()
      if (ws?.name) setWorkspace(ws.name)
    }
    load()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?'

  return (
    <>
      {/* Mobile overlay */}
      <div className="fixed inset-0 z-20 md:hidden bg-black/50" style={{ display: 'none' }} />

      {/* Sidebar */}
      <aside className={clsx(
        'fixed left-0 top-0 h-screen z-30 flex flex-col',
        'bg-[#060C18] border-r border-white/[0.06]',
        'transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64'
      )}>
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-white/[0.06] flex-shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/20">
              <Clapperboard className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="text-white font-bold text-base tracking-tight">CrewDesk</span>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="p-1 rounded-md text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors flex-shrink-0"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
            </button>
          )}
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="absolute -right-3 top-6 w-6 h-6 bg-[#060C18] border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors shadow-sm"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Workspace Badge */}
        {!collapsed && (
          <div className="mx-3 mt-3 mb-1 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-xl">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium mb-0.5">Workspace</p>
            <p className="text-white text-xs font-semibold truncate">{workspace}</p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {navItems.map(({ section, items }) => (
            <div key={section}>
              {!collapsed && (
                <p className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold px-3 mb-1">{section}</p>
              )}
              <div className="space-y-0.5">
                {items.map(({ href, icon: Icon, label, badge }) => {
                  const active = pathname === href || pathname.startsWith(href + '/')
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={clsx(
                        'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                        'relative overflow-hidden',
                        active
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.05]',
                        collapsed && 'justify-center px-0 w-10 mx-auto'
                      )}
                      title={collapsed ? label : undefined}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-amber-400 rounded-r-full" />
                      )}
                      <Icon className={clsx(
                        'w-[18px] h-[18px] flex-shrink-0 transition-transform duration-150',
                        'group-hover:scale-110',
                        active ? 'text-amber-400' : 'text-gray-500 group-hover:text-white'
                      )} />
                      {!collapsed && (
                        <span className="flex-1 truncate">{label}</span>
                      )}
                      {!collapsed && badge && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full font-semibold">{badge}</span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Pro Badge */}
        {!collapsed && (
          <div className="mx-3 mb-3 p-3 bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/15 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-white text-xs font-semibold">Pro Plan Active</span>
            </div>
            <p className="text-gray-500 text-[11px]">Unlimited projects & crew</p>
          </div>
        )}

        {/* Bottom: Settings + User */}
        <div className="border-t border-white/[0.06] p-2 space-y-0.5 flex-shrink-0">
          <Link
            href="/settings"
            className={clsx(
              'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
              pathname === '/settings'
                ? 'bg-amber-500/10 text-amber-400'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.05]',
              collapsed && 'justify-center px-0 w-10 mx-auto'
            )}
            title={collapsed ? 'Settings' : undefined}
          >
            <Settings className={clsx(
              'w-[18px] h-[18px] flex-shrink-0',
              pathname === '/settings' ? 'text-amber-400' : 'text-gray-500 group-hover:text-white'
            )} />
            {!collapsed && <span>Settings</span>}
          </Link>

          {/* User */}
          <div className={clsx(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl',
            collapsed && 'justify-center px-0 w-10 mx-auto'
          )}>
            <div className={clsx(
              'w-7 h-7 rounded-full bg-gradient-to-br from-amber-400/40 to-amber-600/40',
              'border border-amber-400/20 flex items-center justify-center flex-shrink-0'
            )}>
              <span className="text-amber-300 text-[11px] font-bold">{initials}</span>
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-gray-500 text-[10px] truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main content offset */}
      <div className={clsx(
        'hidden md:block flex-shrink-0 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )} />
    </>
  )
}
