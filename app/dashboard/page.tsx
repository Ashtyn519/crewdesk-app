'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { TrendingUp, FolderKanban, Users, FileText, Receipt, MessageSquare, ArrowRight, Clock, Loader2 } from 'lucide-react'
import RevenueChart from '@/components/RevenueChart'

const quickActions = [
  { label: 'New Project', icon: FolderKanban, href: '/projects', color: 'bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400' },
  { label: 'Add Freelancer', icon: Users, href: '/crew', color: 'bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400' },
  { label: 'Create Invoice', icon: Receipt, href: '/invoices', color: 'bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400' },
  { label: 'New Contract', icon: FileText, href: '/contracts', color: 'bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400' },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

interface Stats {
  projectCount: number
  crewCount: number
  pendingInvoiceCount: number
  pendingInvoiceTotal: number
  trialDaysLeft: number | null
  plan: string
}

export default function DashboardPage() {
  const [greeting, setGreeting] = useState('')
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    setGreeting(getGreeting())
    loadStats()
  }, [])

  async function loadStats() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [projectsRes, crewRes, invoicesRes, workspaceRes] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('crew_members').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('invoices').select('id, amount, status').eq('user_id', user.id).eq('status', 'pending'),
        supabase.from('workspaces').select('plan, trial_ends_at, subscription_status').eq('user_id', user.id).single(),
      ])

      const pendingInvoices = invoicesRes.data || []
      const pendingTotal = pendingInvoices.reduce((sum: number, inv: { amount?: number }) => sum + (inv.amount || 0), 0)

      let trialDaysLeft: number | null = null
      if (workspaceRes.data?.trial_ends_at) {
        const diff = new Date(workspaceRes.data.trial_ends_at).getTime() - Date.now()
        trialDaysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
      }

      setStats({
        projectCount: projectsRes.count || 0,
        crewCount: crewRes.count || 0,
        pendingInvoiceCount: pendingInvoices.length,
        pendingInvoiceTotal: pendingTotal,
        trialDaysLeft,
        plan: workspaceRes.data?.plan || 'trial',
      })
    } catch (err) {
      console.error('Dashboard stats error:', err)
    } finally {
      setLoading(false)
    }
  }

  const kpis = stats ? [
    {
      label: 'Active Projects',
      value: stats.projectCount.toString(),
      change: stats.projectCount === 0 ? 'No projects yet' : `${stats.projectCount} active`,
      up: stats.projectCount > 0,
      icon: FolderKanban,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      href: '/projects',
    },
    {
      label: 'Freelancers',
      value: stats.crewCount.toString(),
      change: stats.crewCount === 0 ? 'Add your first' : `${stats.crewCount} total`,
      up: stats.crewCount > 0,
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
      href: '/crew',
    },
    {
      label: 'Pending Invoices',
      value: stats.pendingInvoiceCount.toString(),
      change: stats.pendingInvoiceTotal > 0 ? `£${stats.pendingInvoiceTotal.toLocaleString()} outstanding` : 'All clear',
      up: false,
      icon: Receipt,
      color: 'text-rose-400',
      bg: 'bg-rose-400/10',
      href: '/invoices',
    },
    {
      label: 'Plan',
      value: stats.plan.charAt(0).toUpperCase() + stats.plan.slice(1),
      change: stats.trialDaysLeft !== null ? `${stats.trialDaysLeft}d left` : 'Active',
      up: stats.plan !== 'trial',
      icon: TrendingUp,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      href: '/pricing',
    },
  ] : []

  return (
    <main className="flex-1 p-6 space-y-6">

      {/* Trial Banner — only shown during trial */}
      {stats?.plan === 'trial' && stats.trialDaysLeft !== null && (
        <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="text-sm text-amber-200 flex-1">
            <span className="font-semibold text-amber-400">{stats.trialDaysLeft} days left on your free trial.</span>{' '}
            Upgrade to keep full access to all features.
          </p>
          <Link href="/pricing" className="text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap">
            View plans →
          </Link>
        </div>
      )}

      {/* Greeting */}
      <div>
        <p className="text-slate-400 text-sm">{greeting},</p>
        <h1 className="text-3xl font-bold text-white mt-0.5">Dashboard</h1>
      </div>

      {/* KPI Grid */}
      {loading ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#0A1020] border border-white/5 rounded-2xl p-5 flex items-center justify-center h-28">
              <Loader2 className="w-5 h-5 text-slate-600 animate-spin" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon
            return (
              <Link key={kpi.label} href={kpi.href} className="bg-[#0A1020] border border-white/5 rounded-2xl p-5 flex flex-col gap-3 hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${kpi.up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {kpi.change}
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{kpi.value}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{kpi.label}</p>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Revenue Chart */}
      <div className="bg-[#0A1020] border border-white/5 rounded-2xl p-6">
        <RevenueChart />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Empty State / Getting Started */}
        <div className="lg:col-span-2 bg-[#0A1020] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-white">Getting Started</h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-5 h-5 text-slate-600 animate-spin" />
            </div>
          ) : stats && (stats.projectCount > 0 || stats.crewCount > 0) ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3">
                <FolderKanban className="w-4 h-4 text-blue-400 shrink-0" />
                <p className="text-sm text-slate-300">You have <span className="text-white font-medium">{stats.projectCount} project{stats.projectCount !== 1 ? 's' : ''}</span> active</p>
                <Link href="/projects" className="ml-auto text-xs text-amber-400 hover:text-amber-300">View →</Link>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3">
                <Users className="w-4 h-4 text-purple-400 shrink-0" />
                <p className="text-sm text-slate-300">You have <span className="text-white font-medium">{stats.crewCount} freelancer{stats.crewCount !== 1 ? 's' : ''}</span> on your roster</p>
                <Link href="/crew" className="ml-auto text-xs text-amber-400 hover:text-amber-300">View →</Link>
              </div>
              {stats.pendingInvoiceCount > 0 && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
                  <Receipt className="w-4 h-4 text-rose-400 shrink-0" />
                  <p className="text-sm text-slate-300"><span className="text-rose-400 font-medium">{stats.pendingInvoiceCount} invoice{stats.pendingInvoiceCount !== 1 ? 's' : ''}</span> awaiting payment</p>
                  <Link href="/invoices" className="ml-auto text-xs text-amber-400 hover:text-amber-300">View →</Link>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-400 mb-4">Complete these steps to get up and running:</p>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-white/10">
                <FolderKanban className="w-4 h-4 text-blue-400 shrink-0" />
                <p className="text-sm text-slate-300">Create your first project</p>
                <Link href="/projects" className="ml-auto text-xs text-amber-400 hover:text-amber-300">Start →</Link>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-white/10">
                <Users className="w-4 h-4 text-purple-400 shrink-0" />
                <p className="text-sm text-slate-300">Add a freelancer to your roster</p>
                <Link href="/crew" className="ml-auto text-xs text-amber-400 hover:text-amber-300">Add →</Link>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-white/10">
                <Receipt className="w-4 h-4 text-amber-400 shrink-0" />
                <p className="text-sm text-slate-300">Send your first invoice</p>
                <Link href="/invoices" className="ml-auto text-xs text-amber-400 hover:text-amber-300">Create →</Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">

          {/* Quick Actions */}
          <div className="bg-[#0A1020] border border-white/5 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((a) => {
                const Icon = a.icon
                return (
                  <Link key={a.label} href={a.href}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors ${a.color}`}>
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{a.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Plan Info */}
          <div className="bg-[#0A1020] border border-white/5 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-4">Your Plan</h2>
            {loading ? (
              <div className="flex items-center justify-center h-16">
                <Loader2 className="w-4 h-4 text-slate-600 animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Current plan</span>
                  <span className="text-white text-sm font-medium capitalize">{stats?.plan || 'Trial'}</span>
                </div>
                {stats?.trialDaysLeft !== null && stats?.plan === 'trial' && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Trial ends</span>
                    <span className="text-amber-400 text-sm font-medium">{stats?.trialDaysLeft}d remaining</span>
                  </div>
                )}
                <Link href="/pricing"
                  className="w-full mt-2 block text-center text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 px-3 py-2 rounded-lg transition-colors">
                  {stats?.plan === 'trial' ? 'Upgrade now →' : 'Manage plan →'}
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>

    </main>
  )
}
