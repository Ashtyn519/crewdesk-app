'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, FolderOpen, Users, Receipt, AlertCircle, CheckCircle } from 'lucide-react'

export const dynamic = "force-dynamic";


interface Stats {
  totalRevenue: number
  activeProjects: number
  crewCount: number
  unpaidInvoices: number
  paidInvoices: number
  overdueInvoices: number
  recentProjects: any[]
  recentInvoices: any[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ totalRevenue:0, activeProjects:0, crewCount:0, unpaidInvoices:0, paidInvoices:0, overdueInvoices:0, recentProjects:[], recentInvoices:[] })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      const [
        { data: invoices },
        { data: projects },
        { data: crew },
      ] = await Promise.all([
        supabase.from('invoices').select('*').eq('user_id', user?.id),
        supabase.from('projects').select('*').eq('user_id', user?.id),
        supabase.from('crew_members').select('id').eq('user_id', user?.id),
      ])
      const paid = invoices?.filter(i => i.status === 'paid') || []
      const unpaid = invoices?.filter(i => i.status === 'sent') || []
      const overdue = invoices?.filter(i => i.status === 'overdue') || []
      setStats({
        totalRevenue: paid.reduce((s,i) => s + (i.total||0), 0),
        activeProjects: projects?.filter(p => p.status === 'active').length || 0,
        crewCount: crew?.length || 0,
        unpaidInvoices: unpaid.reduce((s,i) => s + (i.total||0), 0),
        paidInvoices: paid.length,
        overdueInvoices: overdue.length,
        recentProjects: (projects || []).slice(0,4),
        recentInvoices: (invoices || []).slice(0,4),
      })
      setLoading(false)
    }
    fetchStats()
  }, [])

  const statCards = [
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Active Projects', value: stats.activeProjects.toString(), icon: FolderOpen, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { label: 'Crew Members', value: stats.crewCount.toString(), icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Unpaid Invoices', value: formatCurrency(stats.unpaidInvoices), icon: Receipt, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  ]

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-slate-400">Loading...</div></div>

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome back, {user?.user_metadata?.full_name || user?.email}</p>
      </div>

      {stats.overdueInvoices > 0 && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="text-red-400" size={20} />
          <p className="text-red-300 text-sm">{stats.overdueInvoices} overdue invoice{stats.overdueInvoices > 1 ? 's' : ''} need attention</p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-[#0F1A2E] rounded-2xl p-5 border border-slate-800">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-slate-400 text-sm mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0F1A2E] rounded-2xl p-6 border border-slate-800">
          <h2 className="text-lg font-bold text-white mb-4">Recent Projects</h2>
          {stats.recentProjects.length === 0 ? (
            <p className="text-slate-500 text-sm">No projects yet. <a href="/projects" className="text-amber-400 hover:underline">Create one</a></p>
          ) : (
            <div className="space-y-3">
              {stats.recentProjects.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-white text-sm font-medium">{p.name}</div>
                    <div className="text-slate-500 text-xs">{p.client || 'No client'}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${p.status === 'active' ? 'bg-emerald-400/10 text-emerald-400' : p.status === 'completed' ? 'bg-cyan-400/10 text-cyan-400' : 'bg-slate-700 text-slate-400'}`}>{p.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#0F1A2E] rounded-2xl p-6 border border-slate-800">
          <h2 className="text-lg font-bold text-white mb-4">Recent Invoices</h2>
          {stats.recentInvoices.length === 0 ? (
            <p className="text-slate-500 text-sm">No invoices yet. <a href="/invoices" className="text-amber-400 hover:underline">Create one</a></p>
          ) : (
            <div className="space-y-3">
              {stats.recentInvoices.map((inv: any) => (
                <div key={inv.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-white text-sm font-medium">{inv.invoice_number}</div>
                    <div className="text-slate-500 text-xs">{inv.client_name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-sm font-medium">{formatCurrency(inv.total)}</div>
                    <span className={`text-xs ${inv.status === 'paid' ? 'text-emerald-400' : inv.status === 'overdue' ? 'text-red-400' : 'text-amber-400'}`}>{inv.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
