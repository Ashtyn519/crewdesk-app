'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'
import RevenueChart from '@/components/RevenueChart'

export const dynamic = 'force-dynamic'

const kpis = [
  { label: 'Total Revenue', value: '£48,200', change: '+23.4%', up: true, icon: '💷', color: 'from-amber-500/20 to-amber-600/5', sparkline: [30,45,38,55,48,62,58,70,65,78,72,85] },
  { label: 'Active Projects', value: '12', change: '+3 this month', up: true, icon: '📁', color: 'from-blue-500/20 to-blue-600/5', sparkline: [5,6,7,6,8,9,10,9,11,10,12,12] },
  { label: 'Crew Members', value: '28', change: '+5 new', up: true, icon: '👥', color: 'from-purple-500/20 to-purple-600/5', sparkline: [18,19,20,21,21,22,23,24,25,26,27,28] },
  { label: 'Pending Invoices', value: '£7,840', change: '3 outstanding', up: false, icon: '📄', color: 'from-rose-500/20 to-rose-600/5', sparkline: [2,4,3,5,4,6,5,7,6,5,4,3] },
]

const recentActivity = [
  { id: 1, type: 'invoice', text: 'Invoice #INV-2024 sent to Neon Films', time: '2 min ago', icon: '📤', color: 'text-amber-400' },
  { id: 2, type: 'crew', text: 'Sarah Chen accepted crew invitation', time: '18 min ago', icon: '✅', color: 'text-green-400' },
  { id: 3, type: 'contract', text: 'Contract for "City Lights" signed', time: '1 hr ago', icon: '✍️', color: 'text-blue-400' },
  { id: 4, type: 'project', text: 'New project "Apex Documentary" created', time: '3 hrs ago', icon: '🆕', color: 'text-purple-400' },
  { id: 5, type: 'payment', text: 'Payment £3,200 received from BFI', time: '5 hrs ago', icon: '💷', color: 'text-emerald-400' },
  { id: 6, type: 'message', text: "James O'Brien sent 3 new messages", time: 'Yesterday', icon: '💬', color: 'text-sky-400' },
]

const quickActions = [
  { label: 'New Project', icon: '📁', href: '/projects', color: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20' },
  { label: 'Create Invoice', icon: '📄', href: '/invoices', color: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20' },
  { label: 'Add Crew', icon: '👤', href: '/crew', color: 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20' },
  { label: 'New Contract', icon: '📝', href: '/contracts', color: 'bg-green-500/10 hover:bg-green-500/20 border-green-500/20' },
]

const upcomingDeadlines = [
  { project: 'Neon Nights', task: 'Final cut delivery', due: 'Tomorrow', urgent: true },
  { project: 'City Lights', task: 'Contract signing', due: 'Mar 22', urgent: true },
  { project: 'Apex Documentary', task: 'Rough cut review', due: 'Mar 25', urgent: false },
  { project: 'Midnight Run', task: 'Invoice submission', due: 'Mar 28', urgent: false },
]

function Sparkline({ data, color }: { data: number[], color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 80, h = 28
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ')
  return (
    <svg width={w} height={h} className="opacity-60">
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  )
}

export default function DashboardPage() {
  const [greeting, setGreeting] = useState('Good morning')
  const [counters, setCounters] = useState(kpis.map(() => 0))
  const [activityFilter, setActivityFilter] = useState('all')

  useEffect(() => {
    const h = new Date().getHours()
    if (h >= 12 && h < 18) setGreeting('Good afternoon')
    else if (h >= 18) setGreeting('Good evening')
  }, [])

  useEffect(() => {
    const timers = kpis.map((_, i) =>
      setTimeout(() => {
        setCounters(prev => { const n = [...prev]; n[i] = 1; return n })
      }, i * 150)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  const filtered = activityFilter === 'all'
    ? recentActivity
    : recentActivity.filter(a => a.type === activityFilter)

  return (
    <div className="flex min-h-screen" style={{ background: '#04080F' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <TopHeader />
        <main className="flex-1 p-6 overflow-y-auto">

          {/* Greeting */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">{greeting}, Ashtyn 👋</h1>
                <p className="text-slate-400 text-sm mt-1">Here's what's happening with your workforce today.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-slate-500">Workspace health</p>
                  <p className="text-sm font-semibold text-emerald-400">All systems live ✓</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>
          </motion.div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {kpis.map((k, i) => (
              <motion.div
                key={k.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-gradient-to-br ${k.color} rounded-2xl p-5 border border-white/5 backdrop-blur-sm relative overflow-hidden group hover:border-white/10 transition-all duration-300`}
                style={{ background: '#0A1020' }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${k.color} opacity-40`} />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{k.icon}</span>
                    <Sparkline data={k.sparkline} color={k.up ? '#fbbf24' : '#f87171'} />
                  </div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: counters[i] }}
                    transition={{ duration: 0.5, delay: i * 0.15 }}
                    className="text-2xl font-bold text-white mb-1"
                  >
                    {k.value}
                  </motion.p>
                  <p className="text-xs text-slate-400">{k.label}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className={`text-xs font-medium ${k.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {k.up ? '↑' : '↓'} {k.change}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-8">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h2>
            <div className="grid grid-cols-4 gap-3">
              {quickActions.map((a, i) => (
                <Link key={a.label} href={a.href}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border ${a.color} cursor-pointer transition-all duration-200`}
                  >
                    <span className="text-2xl">{a.icon}</span>
                    <span className="text-xs font-medium text-white">{a.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Revenue Chart + Upcoming */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            <div className="xl:col-span-2">
              <RevenueChart />
            </div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <div className="rounded-2xl border border-white/5 p-5 h-full" style={{ background: '#0A1020' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white">Upcoming Deadlines</h3>
                  <span className="text-xs text-amber-400 font-medium">{upcomingDeadlines.filter(d => d.urgent).length} urgent</span>
                </div>
                <div className="space-y-3">
                  {upcomingDeadlines.map((d, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors"
                    >
                      <div>
                        <p className="text-xs font-semibold text-white">{d.project}</p>
                        <p className="text-xs text-slate-400">{d.task}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${d.urgent ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-500/20 text-slate-400'}`}>
                        {d.due}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Activity Feed */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <div className="rounded-2xl border border-white/5 p-6" style={{ background: '#0A1020' }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
                <div className="flex gap-2">
                  {['all', 'invoice', 'crew', 'contract', 'project'].map(f => (
                    <button
                      key={f}
                      onClick={() => setActivityFilter(f)}
                      className={`text-xs px-3 py-1 rounded-full transition-all ${activityFilter === f ? 'bg-amber-500 text-black font-semibold' : 'text-slate-400 hover:text-white bg-white/5'}`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <AnimatePresence mode="popLayout">
                <div className="space-y-1">
                  {filtered.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      layout
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
                    >
                      <span className="text-xl">{item.icon}</span>
                      <div className="flex-1">
                        <p className={`text-sm ${item.color} font-medium`}>{item.text}</p>
                      </div>
                      <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">{item.time}</span>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </div>
          </motion.div>

        </main>
      </div>
    </div>
  )
}
