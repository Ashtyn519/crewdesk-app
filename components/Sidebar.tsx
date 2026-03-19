'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, FolderKanban, Users, FileText, 
  Receipt, MessageSquare, Settings, Zap, ChevronRight,
  TrendingUp, Bell
} from 'lucide-react';
import { useState } from 'react';

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
  { href: '/projects', icon: FolderKanban, label: 'Projects', badge: '5' },
  { href: '/crew', icon: Users, label: 'Crew', badge: null },
  { href: '/contracts', icon: FileText, label: 'Contracts', badge: '2' },
  { href: '/invoices', icon: Receipt, label: 'Invoices', badge: '3' },
  { href: '/messages', icon: MessageSquare, label: 'Messages', badge: '7' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-screen w-64 bg-[#060C18] border-r border-[#1A2540] fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#1A2540]">
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

      {/* Workspace Card */}
      <div className="mx-4 mt-4 mb-2 px-3 py-3 rounded-xl bg-[#0A1020] border border-[#1A2540]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xs font-bold text-black">
            W
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">My Workspace</p>
            <p className="text-[10px] text-slate-500">Free Plan · 2 seats</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        </div>
      </div>

      {/* Nav Label */}
      <p className="px-6 pt-3 pb-1.5 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
        Navigation
      </p>

      {/* Nav Items */}
      <nav className="flex-1 px-3 pb-4 overflow-y-auto space-y-0.5">
        {NAV.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href}>
              <motion.div
                className="relative"
                onHoverStart={() => setHoveredItem(href)}
                onHoverEnd={() => setHoveredItem(null)}
              >
                <div className={[
                  'group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer',
                  active
                    ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                    : 'text-slate-400 hover:bg-[#0A1020] hover:text-white border border-transparent'
                ].join(' ')}>
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-amber-400"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className={['w-4 h-4 flex-shrink-0 transition-colors', active ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'].join(' ')} />
                  <span className="text-sm font-medium flex-1">{label}</span>
                  {badge && (
                    <span className={[
                      'text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center',
                      active ? 'bg-amber-400/20 text-amber-400' : 'bg-[#1A2540] text-slate-400'
                    ].join(' ')}>
                      {badge}
                    </span>
                  )}
                </div>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Upgrade banner */}
      <div className="mx-4 mb-3 p-3 rounded-xl bg-gradient-to-r from-amber-400/10 to-amber-600/5 border border-amber-400/20">
        <div className="flex items-center gap-2 mb-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-bold text-amber-400">Upgrade to Pro</span>
        </div>
        <p className="text-[11px] text-slate-500 mb-2">Unlock unlimited crew, advanced analytics and priority support.</p>
        <button className="w-full py-1.5 text-[11px] font-bold text-black bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors">
          View Plans
        </button>
      </div>

      {/* Settings */}
      <div className="px-3 pb-4 border-t border-[#1A2540] pt-3">
        <Link href="/settings">
          <div className={[
            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer',
            pathname.startsWith('/settings')
              ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
              : 'text-slate-400 hover:bg-[#0A1020] hover:text-white border border-transparent'
          ].join(' ')}>
            <Settings className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">Settings</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
