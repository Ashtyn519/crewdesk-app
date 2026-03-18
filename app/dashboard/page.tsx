'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AnimatedList, AnimatedListItem, StatCard, AnimatedProgressBar,
  AnimatedModal, Toast, MagneticButton, PulseDot, CountUp
} from '@/components/animations'
import clsx from 'clsx'
import {
  FolderOpen, FileText, Users, DollarSign, TrendingUp, Clock,
  Plus, ArrowRight, Sparkles, Zap, CheckCircle, AlertCircle,
  BarChart3, Activity
} from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}
const item = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
}

const QUICK_ACTIONS = [
  { label: 'New Project', href: '/projects', icon: FolderOpen, color: 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20' },
  { label: 'New Invoice', href: '/invoices', icon: FileText, color: 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20' },
  { label: 'Add Crew', href: '/crew', icon: Users, color: 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border-purple-500/20' },
  { label: 'New Contract', href: '/contracts', icon: FileText, color: 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border-amber-500/20' },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function getToastType(msg: string): 'success' | 'error' | 'info' {
  if (msg.includes('Error') || msg.includes('error')) return 'error'
  return 'success'
}

export default function DashboardPage() {
  const supabase = createClient()
  const [stats, setStats] = useState({ projects: 0, invoices: 0, crew: 0, revenue: 0, contracts: 0, overdue: 0 })
  const [loading, setLoading] = useState(true)
  const [recentProjects, setRecentProjects] = useState<any[]>([])
  const [toast, setToast] = useState<{ msg: string; type: 'success'|'error'|'info' } | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const [{ data: projects }, { data: invoices }, { data: crew }, { data: contracts }] = await Promise.all([
      supabase.from('projects').select('id, name, status, budget, spent'),
      supabase.from('invoices').select('id, amount, status'),
      supabase.from('crew').select('id'),
      supabase.from('contracts').select('id, status'),
    ])
    const revenue = (invoices ?? []).filter(i => i.status === 'paid').reduce((s, i) => s + (i.amount || 0), 0)
    const overdue = (invoices ?? []).filter(i => i.status === 'overdue').length
    setStats({
      projects: (projects ?? []).length,
      invoices: (invoices ?? []).length,
      crew: (crew ?? []).length,
      revenue,
      contracts: (contracts ?? []).length,
      overdue,
    })
    setRecentProjects((projects ?? []).slice(0, 4))
    setLoading(false)
  }

  const fmt = (v: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(v)
  const STATUS_COLORS: Record<string, string> = {
    active: 'text-emerald-400 bg-emerald-400/10',
    completed: 'text-blue-400 bg-blue-400/10',
    planning: 'text-amber-400 bg-amber-400/10',
    on_hold: 'text-red-400 bg-red-400/10',
  }

  return (
    <div className="min-h-screen bg-[#04080F] p-6 space-y-6">
      {/* Header */}
      <motion.div
        className="flex items-start justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <motion.div
              animate={{ rotate: [0, 15, -10, 0] }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
            </motion.div>
            <p className="text-sm text-amber-400 font-medium">{getGreeting()}</p>
          </div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-white/40 mt-0.5">Here's what's happening with your productions</p>
        </div>
        <MagneticButton
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-amber-500/20"
          onClick={() => setToast({ msg: 'Feature coming soon!', type: 'info' })}
        >
          <Zap className="w-4 h-4" />
          Quick Add
        </MagneticButton>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <motion.div key={i} className="bg-[#0A1020] border border-white/[0.06] rounded-2xl p-5 h-24 animate-pulse"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} />
          ))
        ) : (
          <>
            <StatCard label="Active Projects" value={stats.projects} icon={FolderOpen} color="text-blue-400" bg="bg-blue-400/10" delay={0} />
            <StatCard label="Total Revenue" value={stats.revenue} icon={TrendingUp} color="text-emerald-400" bg="bg-emerald-400/10" delay={0.06} prefix="£" />
            <StatCard label="Crew Members" value={stats.crew} icon={Users} color="text-purple-400" bg="bg-purple-400/10" delay={0.12} />
            <StatCard label="Contracts" value={stats.contracts} icon={FileText} color="text-amber-400" bg="bg-amber-400/10" delay={0.18} />
          </>
        )}
      </div>

      {/* Activity + Projects row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Projects */}
        <motion.div
          className="lg:col-span-2 bg-[#0A1020] border border-white/[0.06] rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04]">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-white/40" />
              <h3 className="text-sm font-semibold text-white">Recent Projects</h3>
            </div>
            <Link href="/projects" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />)}
            </div>
          ) : recentProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FolderOpen className="w-8 h-8 text-white/15 mb-3" />
              <p className="text-sm text-white/40">No projects yet</p>
              <Link href="/projects" className="mt-3 px-4 py-1.5 bg-amber-500/10 text-amber-400 text-xs font-medium rounded-lg border border-amber-500/20 hover:bg-amber-500/20 transition-all">
                Create your first project
              </Link>
            </div>
          ) : (
            <AnimatedList className="p-4 space-y-2">
              {recentProjects.map((p, i) => (
                <AnimatedListItem key={p.id}>
                  <motion.div
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group"
                    whileHover={{ x: 3, transition: { duration: 0.15 } }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <FolderOpen className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/90">{p.name}</p>
                        {p.budget ? (
                          <div className="mt-1 w-32">
                            <AnimatedProgressBar
                              value={p.spent || 0}
                              max={p.budget}
                              color={(p.spent / p.budget) > 0.8 ? 'bg-red-400' : (p.spent / p.budget) > 0.6 ? 'bg-amber-400' : 'bg-emerald-400'}
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <span className={clsx('text-xs px-2 py-1 rounded-full font-medium', STATUS_COLORS[p.status] || 'text-white/40 bg-white/5')}>
                      {p.status || 'active'}
                    </span>
                  </motion.div>
                </AnimatedListItem>
              ))}
            </AnimatedList>
          )}
        </motion.div>

        {/* Quick Actions + Activity */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <motion.div
            className="bg-[#0A1020] border border-white/[0.06] rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-5 py-4 border-b border-white/[0.04]">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-white/40" />
                <h3 className="text-sm font-semibold text-white">Quick Actions</h3>
              </div>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map((action, i) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 + i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link href={action.href}>
                    <motion.div
                      className={clsx('flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all cursor-pointer text-center', action.color)}
                      whileHover={{ scale: 1.04, transition: { duration: 0.15 } }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <action.icon className="w-4 h-4" />
                      <span className="text-xs font-medium leading-tight">{action.label}</span>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Status Summary */}
          <motion.div
            className="bg-[#0A1020] border border-white/[0.06] rounded-2xl p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-white/40" />
              <h3 className="text-sm font-semibold text-white">Status</h3>
              <PulseDot />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs text-white/60">Invoices sent</span>
                </div>
                <span className="text-xs font-bold text-white">{stats.invoices}</span>
              </div>
              {stats.overdue > 0 && (
                <motion.div
                  className="flex items-center justify-between p-2 bg-red-500/5 border border-red-500/20 rounded-xl"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-xs text-red-400">Overdue invoices</span>
                  </div>
                  <span className="text-xs font-bold text-red-400">{stats.overdue}</span>
                </motion.div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs text-white/60">Crew roster</span>
                </div>
                <span className="text-xs font-bold text-white">{stats.crew} members</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.msg}
            type={toast.type}
            onDismiss={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
