'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Plus, Search, FolderOpen, Calendar, DollarSign,
  Users, MoreVertical, Edit2, Trash2, X, Check,
  TrendingUp, Clock, Briefcase, ChevronRight, Sparkles
} from 'lucide-react'
import clsx from 'clsx'

interface Project {
  id: string
  name: string
  description: string | null
  status: 'active' | 'completed' | 'on_hold' | 'cancelled'
  budget: number | null
  spent: number | null
  client_name: string | null
  deadline: string | null
  created_at: string
}

const statusConfig = {
  active:    { label: 'Active',     color: 'text-emerald-400', bg: 'bg-emerald-400/10', dot: 'bg-emerald-400' },
  completed: { label: 'Completed',  color: 'text-blue-400',    bg: 'bg-blue-400/10',    dot: 'bg-blue-400'    },
  on_hold:   { label: 'On Hold',    color: 'text-amber-400',   bg: 'bg-amber-400/10',   dot: 'bg-amber-400'   },
  cancelled: { label: 'Cancelled',  color: 'text-red-400',     bg: 'bg-red-400/10',     dot: 'bg-red-400'     },
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } }
}
const cardVariant = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show:   { opacity: 1, y: 0,  scale: 1,    transition: { type: 'spring', stiffness: 320, damping: 28 } }
}
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.45, ease: [0.22,1,0.36,1] } }
}

function AnimatedBar({ pct }: { pct: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  return (
    <div ref={ref} className="h-1.5 rounded-full bg-white/5 overflow-hidden">
      <motion.div
        className={clsx('h-full rounded-full', pct > 90 ? 'bg-red-400' : pct > 70 ? 'bg-amber-400' : 'bg-emerald-400')}
        initial={{ width: 0 }}
        animate={{ width: inView ? `${Math.min(pct, 100)}%` : 0 }}
        transition={{ duration: 0.9, ease: [0.22,1,0.36,1], delay: 0.1 }}
      />
    </div>
  )
}

function StatPill({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string; accent: string }) {
  return (
    <motion.div variants={fadeUp} className="bg-[#0A1020] border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4">
      <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', accent)}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-white/40 mb-0.5">{label}</p>
        <p className="text-xl font-bold text-white">{value}</p>
      </div>
    </motion.div>
  )
}

export const dynamic = 'force-dynamic'

export default function ProjectsPage() {
  const supabase = createClient()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [menuOpen, setMenuOpen]  = useState<string | null>(null)
  const [toast, setToast]        = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '', description: '', status: 'active' as Project['status'],
    budget: '', client_name: '', deadline: ''
  })

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  async function load() {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    setProjects((data || []) as Project[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.client_name || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const stats = {
    total:     projects.length,
    active:    projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    budget:    projects.reduce((s, p) => s + (p.budget || 0), 0),
  }

  function openCreate() {
    setEditProject(null)
    setForm({ name: '', description: '', status: 'active', budget: '', client_name: '', deadline: '' })
    setShowModal(true)
  }

  function openEdit(p: Project) {
    setEditProject(p)
    setForm({
      name: p.name, description: p.description || '', status: p.status,
      budget: p.budget?.toString() || '', client_name: p.client_name || '',
      deadline: p.deadline ? p.deadline.slice(0,10) : ''
    })
    setShowModal(true)
    setMenuOpen(null)
  }

  async function saveProject() {
    const payload = {
      name: form.name, description: form.description || null, status: form.status,
      budget: form.budget ? parseFloat(form.budget) : null,
      client_name: form.client_name || null,
      deadline: form.deadline || null,
    }
    if (editProject) {
      await supabase.from('projects').update(payload).eq('id', editProject.id)
      showToast('Project updated')
    } else {
      await supabase.from('projects').insert(payload)
      showToast('Project created')
    }
    setShowModal(false)
    load()
  }

  async function deleteProject(id: string) {
    await supabase.from('projects').delete().eq('id', id)
    showToast('Project deleted')
    setMenuOpen(null)
    load()
  }

  function initials(name: string) {
    return name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
  }

  const fmtCurrency = (n: number) => new Intl.NumberFormat('en-GB', { style:'currency', currency:'GBP', maximumFractionDigits:0 }).format(n)
  const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })

  return (
    <div className="min-h-screen bg-[#04080F] p-6 lg:p-8">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity:0, y:-20, scale:0.95 }}
            animate={{ opacity:1, y:0,   scale:1   }}
            exit={{    opacity:0, y:-20, scale:0.95 }}
            transition={{ type:'spring', stiffness:400, damping:25 }}
            className="fixed top-6 right-6 z-50 bg-emerald-500 text-white px-5 py-3 rounded-xl flex items-center gap-2 shadow-xl shadow-emerald-500/20"
          >
            <Check className="w-4 h-4" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div variants={container} initial="hidden" animate="show" className="mb-8">
        <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-amber-400" /> Projects
            </h1>
            <p className="text-white/40 text-sm mt-1">{stats.total} projects · {stats.active} active</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={openCreate}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#04080F] font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> New Project
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div variants={container} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatPill icon={Briefcase}   label="Total Projects" value={stats.total.toString()}      accent="bg-violet-400/10 text-violet-400" />
          <StatPill icon={TrendingUp}  label="Active"         value={stats.active.toString()}     accent="bg-emerald-400/10 text-emerald-400" />
          <StatPill icon={Check}       label="Completed"      value={stats.completed.toString()}  accent="bg-blue-400/10 text-blue-400" />
          <StatPill icon={DollarSign}  label="Total Budget"   value={stats.budget > 0 ? fmtCurrency(stats.budget) : '—'} accent="bg-amber-400/10 text-amber-400" />
        </motion.div>

        {/* Filters */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search projects or clients…"
              className="w-full bg-[#0A1020] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50"
            />
          </div>
          <div className="flex gap-2">
            {['all','active','completed','on_hold','cancelled'].map(s => (
              <button
                key={s} onClick={() => setStatusFilter(s)}
                className={clsx(
                  'px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize',
                  statusFilter === s
                    ? 'bg-amber-400 text-[#04080F]'
                    : 'bg-[#0A1020] text-white/50 hover:text-white border border-white/[0.06]'
                )}
              >{s === 'on_hold' ? 'On Hold' : s}</button>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Grid */}
      {loading ? (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <motion.div key={i} variants={cardVariant} className="bg-[#0A1020] border border-white/[0.06] rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-white/5 rounded w-2/3 mb-3" />
              <div className="h-3 bg-white/5 rounded w-1/2 mb-6" />
              <div className="h-1.5 bg-white/5 rounded mb-4" />
              <div className="flex gap-2"><div className="h-3 bg-white/5 rounded w-20" /><div className="h-3 bg-white/5 rounded w-20" /></div>
            </motion.div>
          ))}
        </motion.div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.5 }}
          className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-6">
            <FolderOpen className="w-8 h-8 text-white/20" />
          </div>
          <h3 className="text-white/60 text-lg font-medium mb-2">No projects found</h3>
          <p className="text-white/30 text-sm mb-6">Create your first project to get started</p>
          <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
            onClick={openCreate}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#04080F] font-semibold px-5 py-2.5 rounded-xl text-sm"
          ><Plus className="w-4 h-4" /> New Project</motion.button>
        </motion.div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(p => {
            const s = statusConfig[p.status]
            const pct = p.budget && p.spent ? (p.spent / p.budget) * 100 : 0
            return (
              <motion.div key={p.id} variants={cardVariant}
                whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}
                className="bg-[#0A1020] border border-white/[0.06] hover:border-white/10 rounded-2xl p-6 relative group transition-colors">
                {/* Menu */}
                <div className="absolute top-4 right-4">
                  <button onClick={() => setMenuOpen(menuOpen === p.id ? null : p.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-all">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  <AnimatePresence>
                    {menuOpen === p.id && (
                      <motion.div initial={{ opacity:0, scale:0.9, y:-4 }} animate={{ opacity:1, scale:1, y:0 }}
                        exit={{ opacity:0, scale:0.9, y:-4 }} transition={{ type:'spring', stiffness:400, damping:25 }}
                        className="absolute right-0 top-8 bg-[#0C1428] border border-white/[0.08] rounded-xl overflow-hidden z-20 w-36 shadow-2xl">
                        <button onClick={() => openEdit(p)} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors">
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => deleteProject(p.id)} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/5 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Status pill */}
                <div className={clsx('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium mb-4', s.bg, s.color)}>
                  <span className={clsx('w-1.5 h-1.5 rounded-full', s.dot)} />
                  {s.label}
                </div>

                {/* Title */}
                <h3 className="text-white font-semibold text-base mb-1 pr-8">{p.name}</h3>
                {p.client_name && (
                  <p className="text-white/40 text-xs mb-3 flex items-center gap-1">
                    <Users className="w-3 h-3" /> {p.client_name}
                  </p>
                )}
                {p.description && <p className="text-white/30 text-xs mb-4 line-clamp-2">{p.description}</p>}

                {/* Budget bar */}
                {p.budget && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-white/40">Budget</span>
                      <span className="text-white/60">{fmtCurrency(p.spent || 0)} / {fmtCurrency(p.budget)}</span>
                    </div>
                    <AnimatedBar pct={pct} />
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
                  {p.deadline ? (
                    <span className="flex items-center gap-1 text-xs text-white/40">
                      <Clock className="w-3 h-3" /> {fmtDate(p.deadline)}
                    </span>
                  ) : <span />}
                  <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-amber-400 transition-colors" />
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ opacity:0, scale:0.92, y:20 }} animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.92, y:20 }}
              transition={{ type:'spring', stiffness:360, damping:28 }}
              className="bg-[#0A1020] border border-white/[0.08] rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  {editProject ? 'Edit Project' : 'New Project'}
                </h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { label:'Project Name', key:'name', type:'text', placeholder:'e.g. Brand Redesign' },
                  { label:'Client Name',  key:'client_name', type:'text', placeholder:'e.g. Acme Corp' },
                  { label:'Budget (£)',   key:'budget', type:'number', placeholder:'0' },
                  { label:'Deadline',     key:'deadline', type:'date', placeholder:'' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs text-white/50 mb-1.5 font-medium">{f.label}</label>
                    <input
                      type={f.type} placeholder={f.placeholder}
                      value={form[f.key as keyof typeof form]}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full bg-[#060C18] border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs text-white/50 mb-1.5 font-medium">Description</label>
                  <textarea rows={2} placeholder="Brief description…"
                    value={form.description}
                    onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-[#060C18] border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5 font-medium">Status</label>
                  <select value={form.status} onChange={e => setForm(prev => ({ ...prev, status: e.target.value as Project['status'] }))}
                    className="w-full bg-[#060C18] border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50">
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white font-medium py-2.5 rounded-xl text-sm transition-colors">
                  Cancel
                </button>
                <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                  onClick={saveProject}
                  disabled={!form.name}
                  className="flex-1 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-[#04080F] font-semibold py-2.5 rounded-xl text-sm transition-colors">
                  {editProject ? 'Save Changes' : 'Create Project'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
