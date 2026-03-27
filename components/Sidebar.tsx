'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderKanban, Users, FileText, Receipt, MessageSquare, Settings, Zap, ChevronRight, TrendingUp, CalendarDays, BarChart3, UserCircle } from 'lucide-react'

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
  { href: '/projects', icon: FolderKanban,    label: 'Projects',  badge: null },
  { href: '/crew',     icon: Users,           label: 'Freelancers',      badge: null },
  { href: '/schedule', icon: CalendarDays,    label: 'Schedule',  badge: null },
  { href: '/contracts', icon: FileText,       label: 'Contracts', badge: null },
  { href: '/invoices', icon: Receipt,         label: 'Invoices',  badge: null },
  { href: '/messages', icon: MessageSquare,   label: 'Messages',  badge: 3 },
  { href: '/reports',  icon: BarChart3,       label: 'Reports',   badge: null },
  { href: '/profile',  icon: UserCircle,     label: 'My Profile', badge: null },
    ]

export function Sidebar() {
    const pathname = usePathname()
    return (
          <div className="flex flex-col h-screen w-64 bg-[#060C18] border-r border-[#1A2540] fixed left-0 top-0 z-40">
                <div className="px-5 py-5 border-b border-[#1A2540]">
                        <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/20">
                                              <Zap className="w-4 h-4 text-black fill-black" />
                                  </div>
                                  <div>
                                              <span className="text-white font-bold text-lg tracking-tight">CrewDesk</span>
                                              <div className="flex items-center gap-1 mt-0.5">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                            <span className="text-[10px] text-slate-500 font-medium">All systems live</span>
                                              </div>
                                  </div>
                        </div>
                </div>
                <div className="mx-4 mt-3 mb-2 px-3 py-3 rounded-xl bg-[#0A1020] border border-[#1A2540] hover:border-amber-400/20 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xs font-bold text-black shrink-0">W</div>
                                  <div className="flex-1 min-w-0">
                                              <p className="text-xs font-semibold text-white truncate">My Workspace</p>
                                              <p className="text-[10px] text-slate-500">Trial &middot; 11 days left</p>
                                  </div>
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        </div>
                </div>
                <p className="px-5 pt-4 pb-1 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Navigation</p>
                <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
                  {NAV.map(item => {
                      const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                                  const Icon = item.icon
                                              return (
                                                            <Link key={item.href} href={item.href}>
                                                                          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer relative ${isActive ? 'bg-amber-400/10 text-amber-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                                                                            {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-amber-400 rounded-full -ml-1" />}
                                                                                          <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-400' : ''}`} />
                                                                                          <span className={`text-sm flex-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                                                                            {item.badge !== null && item.badge > 0 && (
                                                                                <span className="text-[10px] font-bold bg-amber-400 text-black rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none">{item.badge}</span>
                                                                                          )}
                                                                          </div>
                                                            </Link>
                                                          )
                  })}
                </nav>
                <div className="px-3 pb-4 space-y-1 border-t border-[#1A2540] pt-3">
                        <Link href="/settings">
                                  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${pathname === '/settings' ? 'bg-amber-400/10 text-amber-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                                              <Settings className="w-4 h-4" />
                                              <span className="text-sm font-medium">Settings</span>
                                  </div>
                        </Link>
                        <Link href="/pricing">
                                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-400/5 border border-amber-400/10 hover:bg-amber-400/10 transition-colors cursor-pointer mt-2">
                                              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                                              <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-semibold text-amber-400">Upgrade Plan</p>
                                                            <p className="text-[10px] text-slate-600 leading-tight">Unlock all features</p>
                                              </div>
                                  </div>
                        </Link>
                </div>
          </div>
        )
}

export default Sidebar</div>
