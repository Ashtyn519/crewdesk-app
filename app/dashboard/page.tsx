'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  FolderOpen, Receipt, Users, FileSignature,
  Plus, ArrowUpRight, TrendingUp, AlertCircle,
  Clock, CheckCircle, Activity, ChevronRight,
  Sparkles, Calendar, Target
} from 'lucide-react'
import { clsx } from 'clsx'

export const dynamic = 'force-dynamic'

interface Stats {
  projects: number
  revenue: number
  pending: number
  crew: number
  invoices: number
  overdue: number
  contracts: number
  signed: number
}

interface RecentProject {
  id: string
  name: string
  status: string
  client?: string
  budget?: number
  updated_at: string
}

interface RecentInvoice {
  id: string
  invoice_number: string
  client_name: string
  amount: number
  status: string
  due_date: string
}

const statusColors: Record<string, string> = {
  active: 'text-emerald-400 bg-emerald-400/10',
  planning: 'text-blue-400 bg-blue-400/10',
  completed: 'text-gray-400 bg-gray-400/10',
  'on-hold': 'text-amber-400 bg-amber-400/10',
  paid: 'text-emerald-400 bg-emerald-400/10',
  sent: 'text-amber-400 bg-amber-400/10',
  overdue: 'text-red-400 bg-red-400/10',
  draft: 'text-gray-400 bg-gray-400/10',
}

function StatCard({ icon: Icon, label, value, sub, color, href, trend }: {
  icon: any, label: string, value: string, sub: string,
  color: string, href: string, trend?: number
}) {
  return (
    <Link href={href} className="group relative bg-[#0A1020] hover:bg-[#0C1428] border border-white/[0.06] hover:border-white/10 rounded-2xl p-5 transition-all duration-200 overflow-hidden block">
      {/* Subtle gradient overlay */}
      <div className={clsx('absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl', `bg-gradient-to-br ${color}/5 to-transparent`)} />
      
      <div className="flex items-start justify-between mb-4">
        <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', `bg-${color}/10`)}>
          <Icon className={clsx('w-5 h-5', `text-${color}`)} />
        </div>
        {trend !== undefined && (
          <div className={clsx(
            'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
            trend >= 0 ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'
          )}>
            <TrendingUp className={clsx('w-3 h-3', trend < 0 && 'rotate-180')} />
            {Math.abs(trend)}%
          </div>
        )}
        {trend === undefined && (
          <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
        )}
      </div>
      
      <div>
        <p className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</p>
        <p className="text-gray-400 text-sm font-medium">{label}</p>
        <p className="text-gray-600 text-xs mt-0.5">{sub}</p>
      </div>
    </Link>
  )
}

export default function DashboardPage() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<Stats>({ projects: 0, revenue: 0, pending: 0, crew: 0, invoices: 0, overdue: 0, contracts: 0, signed: 0 })
  const [projects, setProjects] = useState<RecentProject[]>([])
  const [invoices, setInvoices] = useState<RecentInvoice[]>([])
  const [loading, setLoading] = useState(true)
  const today = new Date()
  const hour = today.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  useEffect(() => {
    const load = async () => {
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) return
      setUser(u)

      const [
        { data: proj },
        { data: inv },
        { data: crew },
        { data: contracts }
      ] = await Promise.all([
        supabase.from('projects').select('id,name,status,client,budget,updated_at').eq('user_id', u.id).order('updated_at', { ascending: false }).limit(5),
        supabase.from('invoices').select('id,invoice_number,client_name,amount,status,due_date').eq('user_id', u.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('crew_members').select('id').eq('user_id', u.id),
        supabase.from('contracts').select('id,status').eq('user_id', u.id),
      ])

      const allInv = inv || []
      const allProj = proj || []

      setStats({
        projects: allProj.filter(p => p.status === 'active').length,
        revenue: allInv.filter(i => i.status === 'paid').reduce((s: number, i: any) => s + (i.amount || 0), 0),
        pending: allInv.filter(i => i.status === 'sent').reduce((s: number, i: any) => s + (i.amount || 0), 0),
        crew: (crew || []).length,
        invoices: allInv.length,
        overdue: allInv.filter(i => i.status === 'overdue').length,
        contracts: (contracts || []).length,
        signed: (contracts || []).filter((c: any) => c.status === 'signed').length,
      })
      setProjects(allProj.slice(0, 4))
      setInvoices(allInv.slice(0, 4))
      setLoading(false)
    }
    load()
  }, [])

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Hero Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400/80 text-sm font-medium">{greeting}</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Welcome back, <span className="text-amber-400">{firstName}</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/projects" className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-amber-500/20">
            <Plus className="w-4 h-4" />
            New Project
          </Link>
        </div>
      </div>

      {/* Alert: Overdue invoices */}
      {stats.overdue > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-500/8 border border-red-500/20 rounded-xl text-sm">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-red-300">
            You have <span className="font-semibold text-red-400">{stats.overdue} overdue invoice{stats.overdue > 1 ? 's' : ''}</span> that need attention.
          </p>
          <Link href="/invoices" className="ml-auto text-red-400 hover:text-red-300 font-medium flex items-center gap-1 flex-shrink-0">
            View <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FolderOpen}
          label="Active Projects"
          value={String(stats.projects)}
          sub={`${projects.length} total projects`}
          color="blue"
          href="/projects"
        />
        <StatCard
          icon={Receipt}
          label="Revenue Collected"
          value={`£${stats.revenue.toLocaleString()}`}
          sub={`£${stats.pending.toLocaleString()} pending`}
          color="emerald"
          href="/invoices"
        />
        <StatCard
          icon={Users}
          label="Crew Members"
          value={String(stats.crew)}
          sub="Active talent roster"
          color="purple"
          href="/crew"
        />
        <StatCard
          icon={FileSignature}
          label="Contracts"
          value={String(stats.contracts)}
          sub={`${stats.signed} signed`}
          color="amber"
          href="/contracts"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-[#0A1020] rounded-2xl border border-white/[0.06] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-blue-400" />
              <h2 className="text-white font-semibold text-sm">Recent Projects</h2>
            </div>
            <Link href="/projects" className="text-xs text-gray-500 hover:text-amber-400 transition-colors flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div>
            {loading ? (
              <div className="p-5 space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-10 bg-white/[0.03] rounded-lg animate-pulse" />)}
              </div>
            ) : projects.length === 0 ? (
              <div className="p-8 text-center">
                <FolderOpen className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No projects yet</p>
                <Link href="/projects" className="text-amber-400 text-xs hover:text-amber-300 mt-2 inline-block">Create first project →</Link>
              </div>
            ) : (
              <div>
                {projects.map((p, idx) => (
                  <div key={p.id} className={clsx(
                    'flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors',
                    idx < projects.length - 1 && 'border-b border-white/[0.04]'
                  )}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-400 text-xs font-bold">{p.name[0].toUpperCase()}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{p.name}</p>
                        <p className="text-gray-500 text-xs">{p.client || 'No client'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {p.budget && <span className="text-gray-400 text-xs">£{p.budget.toLocaleString()}</span>}
                      <span className={clsx(
                        'text-xs px-2 py-0.5 rounded-full font-medium capitalize',
                        statusColors[p.status] || 'text-gray-400 bg-gray-400/10'
                      )}>{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-[#0A1020] rounded-2xl border border-white/[0.06] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-400" />
              <h2 className="text-white font-semibold text-sm">Recent Invoices</h2>
            </div>
            <Link href="/invoices" className="text-xs text-gray-500 hover:text-amber-400 transition-colors flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div>
            {loading ? (
              <div className="p-5 space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-10 bg-white/[0.03] rounded-lg animate-pulse" />)}
              </div>
            ) : invoices.length === 0 ? (
              <div className="p-8 text-center">
                <Receipt className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No invoices yet</p>
                <Link href="/invoices" className="text-amber-400 text-xs hover:text-amber-300 mt-2 inline-block">Create first invoice →</Link>
              </div>
            ) : (
              <div>
                {invoices.map((inv, idx) => (
                  <div key={inv.id} className={clsx(
                    'flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors',
                    idx < invoices.length - 1 && 'border-b border-white/[0.04]'
                  )}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{inv.client_name || 'Unknown client'}</p>
                        <p className="text-gray-500 text-xs font-mono">{inv.invoice_number || 'Draft'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-white text-sm font-semibold">£{(inv.amount || 0).toLocaleString()}</span>
                      <span className={clsx(
                        'text-xs px-2 py-0.5 rounded-full font-medium capitalize',
                        statusColors[inv.status] || 'text-gray-400 bg-gray-400/10'
                      )}>{inv.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: '/projects', label: 'New Project', icon: FolderOpen, color: 'blue' },
          { href: '/invoices', label: 'New Invoice', icon: Receipt, color: 'emerald' },
          { href: '/crew', label: 'Add Crew', icon: Users, color: 'purple' },
          { href: '/contracts', label: 'New Contract', icon: FileSignature, color: 'amber' },
        ].map(({ href, label, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-3 px-4 py-3 bg-[#0A1020] hover:bg-[#0C1428] border border-white/[0.06] hover:border-white/10 rounded-xl transition-all duration-200"
          >
            <div className={clsx('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0', `bg-${color}-500/10`)}>
              <Icon className={clsx('w-3.5 h-3.5', `text-${color}-400`)} />
            </div>
            <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">{label}</span>
            <Plus className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 ml-auto transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  )
}
