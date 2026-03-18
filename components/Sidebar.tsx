'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderOpen, FileText, Receipt, Users, MessageSquare, Settings, LogOut, Briefcase } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/projects', icon: FolderOpen, label: 'Projects' },
  { href: '/contracts', icon: FileText, label: 'Contracts' },
  { href: '/invoices', icon: Receipt, label: 'Invoices' },
  { href: '/crew', icon: Users, label: 'Crew' },
  { href: '/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 bg-[#0A1020] border-r border-slate-800 min-h-screen fixed left-0 top-0 z-40">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
              <Briefcase size={16} className="text-black" />
            </div>
            <span className="text-xl font-black text-white">CREWDESK</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-amber-400/10 text-amber-400 font-semibold' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
                <Icon size={18} />
                <span className="text-sm">{label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-900/10 transition-all w-full">
            <LogOut size={18} />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0A1020] border-t border-slate-800 z-40 flex justify-around py-2">
        {navItems.slice(0, 5).map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href} className={`flex flex-col items-center py-1 px-2 ${active ? 'text-amber-400' : 'text-slate-500'}`}>
              <Icon size={20} />
              <span className="text-xs mt-0.5">{label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
