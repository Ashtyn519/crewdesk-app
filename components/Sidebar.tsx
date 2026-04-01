'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Briefcase,
  BarChart2,
  Settings,
  ChevronDown,
  Zap,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/crew', icon: Users, label: 'Crew' },
  { href: '/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/jobs', icon: Briefcase, label: 'Jobs' },
  { href: '/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const supabase = createClient()
  const [workspaceName, setWorkspaceName] = useState('My Workspace')
  const [plan, setPlan] = useState('Free')
  const [daysLeft, setDaysLeft] = useState<number | null>(null)

  useEffect(() => {
    async function loadWorkspace() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: workspace } = await supabase
        .from('workspaces')
        .select('name, plan, trial_ends_at')
        .eq('owner_id', user.id)
        .single()

      if (workspace) {
        setWorkspaceName(workspace.name || 'My Workspace')
        setPlan(workspace.plan || 'Free')
        if (workspace.trial_ends_at) {
          const diff = new Date(workspace.trial_ends_at).getTime() - Date.now()
          setDaysLeft(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))))
        }
      }
    }
    loadWorkspace()
  }, [])

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white flex flex-col z-40">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-5 h-5 text-blue-400" />
          <span className="font-bold text-lg">CrewDesk</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-400">
          <span className="truncate max-w-[140px]">{workspaceName}</span>
          <ChevronDown className="w-3 h-3 flex-shrink-0" />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        {daysLeft !== null && (
          <div className="mb-2 text-xs text-yellow-400">
            {daysLeft} day{daysLeft !== 1 ? 's' : ''} left on trial
          </div>
        )}
        <div className="text-xs text-gray-500 capitalize">{plan} plan</div>
      </div>
    </aside>
  )
}
