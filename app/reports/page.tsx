'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Users, FolderKanban, BarChart3, Download } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'

const TABS = ['Finance', 'Projects', 'Freelancers'] as const
type Tab = typeof TABS[number]

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const REVENUE = [28000,34000,29000,41000,38000,52000,48000,61000,55000,67000,72000,84000]
const EXPENSES = [18000,21000,19000,26000,24000,31000,29000,37000,33000,40000,43000,49000]
const maxRev = Math.max(...REVENUE)

const PROJECTS = [
  { name: 'Website Redesign', budget: 45000, spent: 35000, status: 'Active', pct: 78 },
  { name: 'Mobile App v2', budget: 80000, spent: 36000, status: 'Active', pct: 45 },
  { name: 'Brand Refresh', budget: 25000, spent: 7500, status: 'Active', pct: 30 },
  { name: 'Data Migration', budget: 60000, spent: 58500, status: 'Complete', pct: 100 },
  { name: 'Marketing Campaign', budget: 30000, spent: 29800, status: 'Complete', pct: 99 },
  { name: 'API Integration', budget: 20000, spent: 4200, status: 'Active', pct: 21 },
]

const FREELANCERS = [
  { name: 'Jordan Ellis', role: 'Senior UI Designer', invoiced: 18500, projects: 4, rating: 4.9, trend: 'up' },
  { name: 'Maya Chen', role: 'Full-Stack Developer', invoiced: 32400, projects: 3, rating: 4.8, trend: 'up' },
  { name: 'Sam Okafor', role: 'Content Strategist', invoiced: 9800, projects: 5, rating: 4.7, trend: 'down' },
  { name: 'Priya Sharma', role: 'Project Manager', invoiced: 14200, projects: 2, rating: 5.0, trend: 'up' },
  { name: 'Alex Rivera', role: 'Data Analyst', invoiced: 11600, projects: 3, rating: 4.6, trend: 'up' },
  { name: 'Chris Morgan', role: 'Brand Consultant', invoiced: 16800, projects: 2, rating: 4.8, trend: 'down' },
]

const STATS = [
  { label: 'Total Revenue', value: '£84,200', sub: '+16.7% vs last month', icon: DollarSign, up: true },
  { label: 'Active Projects', value: '12', sub: '3 completing this week', icon: FolderKanban, up: true },
  { label: 'Active Freelancers', value: '24', sub: '6 added this quarter', icon: Users, up: true },
  { label: 'Avg Project Margin', value: '41%', sub: '-2% vs last month', icon: BarChart3, up: false },
]

export default function ReportsPage() {
  const [tab, setTab] = useState<Tab>('Finance')

  const totalProfit = REVENUE.reduce((a,b)=>a+b,0) - EXPENSES.reduce((a,b)=>a+b,0)
  const lastMonthRevenue = REVENUE[REVENUE.length - 1]
  const prevMonthRevenue = REVENUE[REVENUE.length - 2]
  const revGrowth = ((lastMonthRevenue - prevMonthRevenue) / prevMonthRevenue * 100).toFixed(1)

  return (
    <div className="flex min-h-screen bg-[#04080F]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopHeader />
        <main className="flex-1 p-6 overflow-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Reports</h1>
              <p className="text-sm text-white/40 mt-1">Business performance overview</p>
            </div>
            <button className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 hover:text-white px-4 py-2 rounded-xl text-sm transition-colors">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {STATS.map(s => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center">
                    <s.icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-medium ${s.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {s.up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  </span>
                </div>
                <p className="text-2xl font-bold text-white mb-0.5">{s.value}</p>
                <p className="text-xs text-white/30">{s.label}</p>
                <p className={`text-xs mt-1 ${s.up ? 'text-emerald-400/70' : 'text-rose-400/70'}`}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 w-fit mb-6">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-amber-400 text-black' : 'text-white/40 hover:text-white'}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Finance Tab */}
          {tab === 'Finance' && (
            <div className="space-y-4">
              {/* Revenue vs Expenses chart */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-white font-semibold mb-1">Revenue vs Expenses</h2>
                <p className="text-white/30 text-xs mb-5">Last 12 months · Total profit: <span className="text-emerald-400 font-semibold">£{totalProfit.toLocaleString()}</span></p>
                <div className="flex items-end gap-2 h-40">
                  {MONTHS.map((m, i) => (
                    <div key={m} className="flex-1 flex flex-col items-center gap-0.5">
                      <div className="w-full flex items-end gap-0.5" style={{ height: '120px' }}>
                        <div
                          className="flex-1 bg-amber-400/70 rounded-t-sm"
                          style={{ height: `${(REVENUE[i] / maxRev) * 100}%` }}
                          title={`Revenue: £${REVENUE[i].toLocaleString()}`}
                        />
                        <div
                          className="flex-1 bg-violet-500/40 rounded-t-sm"
                          style={{ height: `${(EXPENSES[i] / maxRev) * 100}%` }}
                          title={`Expenses: £${EXPENSES[i].toLocaleString()}`}
                        />
                      </div>
                      <span className="text-[9px] text-white/20">{m}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-amber-400/70" /><span className="text-xs text-white/40">Revenue</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-violet-500/40" /><span className="text-xs text-white/40">Expenses</span></div>
                </div>
              </div>

              {/* Monthly summary table */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-white font-semibold mb-4">Monthly Breakdown</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-white/30 border-b border-white/5">
                        <th className="text-left pb-3 font-medium">Month</th>
                        <th className="text-right pb-3 font-medium">Revenue</th>
                        <th className="text-right pb-3 font-medium">Expenses</th>
                        <th className="text-right pb-3 font-medium">Profit</th>
                        <th className="text-right pb-3 font-medium">Margin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MONTHS.slice(-6).map((m, i) => {
                        const idx = i + 6
                        const profit = REVENUE[idx] - EXPENSES[idx]
                        const margin = ((profit / REVENUE[idx]) * 100).toFixed(0)
                        return (
                          <tr key={m} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 text-white/60">{m}</td>
                            <td className="py-3 text-right text-white">£{REVENUE[idx].toLocaleString()}</td>
                            <td className="py-3 text-right text-rose-400/70">£{EXPENSES[idx].toLocaleString()}</td>
                            <td className="py-3 text-right text-emerald-400">£{profit.toLocaleString()}</td>
                            <td className="py-3 text-right text-white/40">{margin}%</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {tab === 'Projects' && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-4">Project Budget Tracker</h2>
              <div className="space-y-4">
                {PROJECTS.map(p => (
                  <div key={p.name} className="p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-white font-medium text-sm">{p.name}</p>
                        <p className="text-white/30 text-xs mt-0.5">£{p.spent.toLocaleString()} of £{p.budget.toLocaleString()} spent</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.status === 'Active' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                        {p.status}
                      </span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5 mt-3">
                      <div
                        className={`h-1.5 rounded-full transition-all ${p.pct > 90 ? 'bg-rose-400' : p.pct > 70 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                        style={{ width: `${Math.min(p.pct, 100)}%` }}
                      />
                    </div>
                    <p className="text-right text-xs text-white/30 mt-1">{p.pct}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Freelancers Tab */}
          {tab === 'Freelancers' && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-4">Freelancer Spend & Performance</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-white/30 border-b border-white/5">
                      <th className="text-left pb-3 font-medium">Freelancer</th>
                      <th className="text-left pb-3 font-medium">Role</th>
                      <th className="text-right pb-3 font-medium">Invoiced</th>
                      <th className="text-right pb-3 font-medium">Projects</th>
                      <th className="text-right pb-3 font-medium">Rating</th>
                      <th className="text-right pb-3 font-medium">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FREELANCERS.map(f => (
                      <tr key={f.name} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400/20 to-violet-500/20 flex items-center justify-center text-xs font-bold text-white">
                              {f.name.charAt(0)}
                            </div>
                            <span className="text-white font-medium">{f.name}</span>
                          </div>
                        </td>
                        <td className="py-3 text-white/40">{f.role}</td>
                        <td className="py-3 text-right text-white font-semibold">£{f.invoiced.toLocaleString()}</td>
                        <td className="py-3 text-right text-white/60">{f.projects}</td>
                        <td className="py-3 text-right text-amber-400 font-medium">{f.rating}</td>
                        <td className="py-3 text-right">
                          {f.trend === 'up'
                            ? <TrendingUp className="w-4 h-4 text-emerald-400 ml-auto" />
                            : <TrendingDown className="w-4 h-4 text-rose-400 ml-auto" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
