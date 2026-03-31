'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { LayoutDashboard, FolderKanban, Users, FileText, Receipt, MessageSquare, Settings, Zap, ChevronRight, TrendingUp, CalendarDays, BarChart3, UserCircle } from 'lucide-react'

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
  { href: '/projects', icon: FolderKanban, label: 'Projects', badge: null },
  { href: '/crew', icon: Users, label: 'Freelancers', badge: null },
  { href: '/schedule', icon: CalendarDays, label: 'Schedule', badge: null },
  { href: '/contracts', icon: FileText, label: 'Contracts', badge: null },
  { href: '/invoices', icon: Receipt, label: 'Invoices', badge: null },
  { href: '/messages', icon: MessageSquare, label: 'Messages', badge: null },
  { href: '/reports', icon: BarChart3, label: 'Reports', badge: null },
  { href: '/profile', icon: UserCircle, label: 'My Profile', badge: null },
  ]

interface WorkspaceInfo {
    name: string
    plan: string
    trialDaysLeft: number | null
}

export function Sidebar() {
    const pathname = usePathname()
    const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null)

  useEffect(() => {
        loadWorkspace()
  }, [])

  async function loadWorkspace() {
        try {
                const sb = createClient()
                const { data: { user } } = await sb.auth.getUser()
                if (!user) return
                const { data } = await sb.from('workspaces').select('name, plan, trial_ends_at').eq('user_id', user.id).single()
                if (!data) return
                let trialDaysLeft: number | null = null
                if (data.trial_ends_at) {
                          const diff = new Date(data.trial_ends_at).getTime() - Date.now()
                          trialDaysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
                }
                setWorkspace({ name: data.name, plan: data.plan, trialDaysLeft })
        } catch {}
  }

  const initial = workspace?.name?.charAt(0)?.toUpperCase() || 'W'
    const planLabel = workspace?.plan === 'trial'
      ? `Trial · ${workspace.trialDaysLeft ?? 0}d left`
          : workspace?.plan?.charAt(0).toUpperCase() + (workspace?.plan?.slice(1) ?? '') || 'Free'

  return (
        <div className="flex flex-col h-screen w-64 bg-[#060C18] border-r border-[#1A2540] fixed left-0 top-0 z-40">
              <div className="px-5 py-5 border-b border-[#1A2540]">
                      <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/20">
                                            <Zap className="w-4 h-4 text-black fill-black" />
                                </div>div>
                                <div>
                                            <span className="text-white font-bold text-lg tracking-tight">CrewDesk</span>span>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                          <span className="text-[10px] text-slate-500 font-medium">All systems live</span>span>
                                            </div>div>
                                </div>div>
                      </div>div>
              </div>div>
        
              <Link href="/settings?tab=workspace" className="mx-4 mt-3 mb-2 px-3 py-3 rounded-xl bg-[#0A1020] border border-[#1A2540] hover:border-amber-400/20 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xs font-bold text-black shrink-0">{initial}</div>div>
                                <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-white truncate">{workspace?.name || 'My Workspace'}</p>p>
                                            <p className="text-[10px] text-slate-500">{workspace ? planLabel : 'Loading…'}</p>p>
                                </div>div>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      </div>div>
              </Link>Link>
        
              <p className="px-5 pt-4 pb-1 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Navigation</p>p>
        
              <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
                {NAV.map(item => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                                const Icon = item.icon
                                            return (
                                                          <Link key={item.href} href={item.href}>
                                                                        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer relative ${isActive ? 'bg-amber-400/10 text-amber-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                                                                          {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-amber-400 rounded-full -ml-1" />}
                                                                                        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-400' : ''}`} />
                                                                                        <span className={`text-sm flex-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>span>
                                                                        </div>div>
                                                          </Link>Link>
                                                        )
        })}
              </nav>nav>
        
              <div className="px-3 pb-4 space-y-1 border-t border-[#1A2540] pt-3">
                      <Link href="/settings">
                                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${pathname === '/settings' ? 'bg-amber-400/10 text-amber-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                                            <Settings className="w-4 h-4" />
                                            <span className="text-sm font-medium">Settings</span>span>
                                </div>div>
                      </Link>Link>
                {workspace?.plan === 'trial' && (
                    <Link href="/pricing">
                                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-400/5 border border-amber-400/10 hover:bg-amber-400/10 transition-colors cursor-pointer mt-2">
                                              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                                              <div className="flex-1 min-w-0">
                                                              <p className="text-xs font-semibold text-amber-400">Upgrade Plan</p>p>
                                                              <p className="text-[10px] text-slate-600 leading-tight">Unlock all features</p>p>
                                              </div>div>
                                </div>div>
                    </Link>Link>
                      )}
              </div>div>
        </div>div>
      )
}

export default Sidebar</div>
