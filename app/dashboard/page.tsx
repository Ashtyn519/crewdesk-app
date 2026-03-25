'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, FolderKanban, Users, FileText, Receipt, MessageSquare, AlertCircle, ArrowRight, X, Clock } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'
import RevenueChart from '@/components/RevenueChart'

const ICON_MAP = { TrendingUp, FolderKanban, Users, FileText, Receipt, MessageSquare }

const kpis = [
  { label: 'Total Revenue', value: '£348,200', change: '+23.4%', up: true, iconKey: 'TrendingUp', iconColor: 'text-amber-400', sparkline: [30,45,38,55,48,62,58,70,65,78,72,85] },
  { label: 'Active Projects', value: '12', change: '+3 this month', up: true, iconKey: 'FolderKanban', iconColor: 'text-blue-400', sparkline: [5,6,7,6,8,9,10,9,11,10,12,12] },
  { label: 'Crew Members', value: '28', change: '+5 new', up: true, iconKey: 'Users', iconColor: 'text-purple-400', sparkline: [18,19,20,21,21,22,23,24,25,26,27,28] },
  { label: 'Pending Invoices', value: '£37,840', change: '3 outstanding', up: false, iconKey: 'Receipt', iconColor: 'text-rose-400', sparkline: [2,4,3,5,4,6,5,7,6,5,4,3] },
]

const recentActivity = [
  { id: 1, type: 'invoice', text: 'Invoice #INV-2024 sent to Neon Films', time: '2 min ago', iconKey: 'Receipt', color: 'text-amber-400' },
  { id: 2, type: 'crew', text: 'Sarah Chen accepted crew invitation', time: '18 min ago', iconKey: 'Users', color: 'text-green-400' },
  { id: 3, type: 'contract', text: 'Contract for City Lights signed', time: '1 hr ago', iconKey: 'FileText', color: 'text-blue-400' },
  { id: 4, type: 'project', text: 'New project Apex Documentary created', time: '3 hrs ago', iconKey: 'FolderKanban', color: 'text-purple-400' },
  { id: 5, type: 'payment', text: 'Payment received from BFI', time: '5 hrs ago', iconKey: 'TrendingUp', color: 'text-emerald-400' },
  { id: 6, type: 'message', text: "James O'Brien sent 3 new messages", time: 'Yesterday', iconKey: 'MessageSquare', color: 'text-sky-400' },
]

const quickActions = [
  { label: 'New Project', iconKey: 'FolderKanban', href: '/projects', color: 'bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20' },
  { label: 'Create Invoice', iconKey: 'Receipt', href: '/invoices', color: 'bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20' },
  { label: 'Add Crew', iconKey: 'Users', href: '/crew', color: 'bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20' },
  { label: 'New Contract', iconKey: 'FileText', href: '/contracts', color: 'bg-green-500/10 hover:bg-green-500/20 border border-green-500/20' },
]

const upcomingDeadlines = [
  { project: 'Neon Nights', task: 'Final cut delivery', due: 'Tomorrow', urgent: true },
  { project: 'City Lights', task: 'Contract signing', due: 'Mar 22', urgent: true },
  { project: 'Apex Documentary', task: 'Rough cut review', due: 'Mar 25', urgent: false },
  { project: 'Midnight Run', task: 'Invoice submission', due: 'Mar 28', urgent: false },
]

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1
  const w = 80, h = 28
  const pts = data.map((v, i) => ((i / (data.length - 1)) * w).toFixed(1) + ',' + (h - ((v - min) / range) * h).toFixed(1)).join(' ')
  return <svg width={w} height={h} className="opacity-60"><polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={pts} /></svg>
}

export default function DashboardPage() {
  const [greeting, setGreeting] = useState('Good morning')
  const [activityFilter, setActivityFilter] = useState('all')
  const [showTrialBanner, setShowTrialBanner] = useState(true)
  const TRIAL_DAYS_LEFT = 11

  useEffect(() => {
    const h = new Date().getHours()
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening')
  }, [])

  const filteredActivity = activityFilter === 'all' ? recentActivity : recentActivity.filter(a => a.type === activityFilter)

  return (
    <div className="flex h-screen bg-[#04080F] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 ml-64 overflow-hidden">
        <TopHeader />
        {showTrialBanner && (
          <div className="bg-amber-400/10 border-b border-amber-400/20 px-6 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="text-amber-400 font-semibold">{TRIAL_DAYS_LEFT} days left on your free trial.</span>
              <span className="text-slate-400">Upgrade to keep full access to all features.</span>
              <Link href="/pricing" className="text-amber-400 font-bold hover:text-amber-300 underline underline-offset-2 ml-1">View plans</Link>
            </div>
            <button onClick={() => setShowTrialBanner(false)} className="text-slate-500 hover:text-white ml-4">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">{greeting},</p>
                <h1 className="text-3xl font-black text-white tracking-tight">Dashboard</h1>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">
                  {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              {kpis.map((kpi) => {
                const Icon = ICON_MAP[kpi.iconKey as keyof typeof ICON_MAP]
                return (
                  <div key={kpi.label} className="bg-[#0A1020] border border-[#1A2540] rounded-2xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                        <Icon className={`w-4 h-4 ${kpi.iconColor}`} />
                      </div>
                      <Sparkline data={kpi.sparkline} color={kpi.up ? '#10B981' : '#EF4444'} />
                    </div>
                    <p className="text-2xl font-black text-white mb-1">{kpi.value}</p>
                    <p className="text-xs text-slate-500 mb-1">{kpi.label}</p>
                    <span className={`text-xs font-semibold ${kpi.up ? 'text-emerald-400' : 'text-rose-400'}`}>{kpi.change}</span>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="col-span-2 bg-[#0A1020] border border-[#1A2540] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-base font-bold text-white">Revenue Overview</h2>
                  <span className="text-xs text-slate-500">Last 6 months</span>
                </div>
                <RevenueChart />
              </div>
              <div className="bg-[#0A1020] border border-[#1A2540] rounded-2xl p-6">
                <h2 className="text-base font-bold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map(action => {
                    const Icon = ICON_MAP[action.iconKey as keyof typeof ICON_MAP]
                    return (
                      <Link key={action.label} href={action.href}>
                        <div className={`rounded-xl p-3.5 cursor-pointer transition-all ${action.color}`}>
                          <Icon className="w-5 h-5 text-white mb-2 opacity-80" />
                          <p className="text-xs font-semibold text-white leading-snug">{action.label}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 bg-[#0A1020] border border-[#1A2540] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-bold text-white">Recent Activity</h2>
                  <div className="flex items-center gap-1">
                    {['all', 'invoice', 'crew', 'project'].map(f => (
                      <button
                        key={f}
                        onClick={() => setActivityFilter(f)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all ${activityFilter === f ? 'bg-amber-400 text-black' : 'text-slate-400 hover:text-white'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  {filteredActivity.map((item) => {
                    const Icon = ICON_MAP[item.iconKey as keyof typeof ICON_MAP]
                    return (
                      <div key={item.id} className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-300 leading-snug">{item.text}</p>
                          <p className="text-xs text-slate-600 mt-0.5">{item.time}</p>
                        </div>
                      </div>
                    )
                  })}
                  {filteredActivity.length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-4">No activity in this category</p>
                  )}
                </div>
              </div>
              <div className="bg-[#0A1020] border border-[#1A2540] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-bold text-white">Deadlines</h2>
                  <Link href="/projects" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {upcomingDeadlines.map((d, i) => (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${d.urgent ? 'bg-red-500/5 border border-red-500/10' : 'bg-white/[0.03] border border-white/5'}`}>
                      {d.urgent && <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{d.project}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{d.task}</p>
                      </div>
                      <span className={`text-[10px] font-bold flex-shrink-0 ${d.urgent ? 'text-red-400' : 'text-slate-500'}`}>{d.due}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
              }
