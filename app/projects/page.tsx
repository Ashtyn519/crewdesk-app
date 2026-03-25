'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'
import { Plus, Search, X, Trash2, Edit2, Calendar, Users, TrendingUp } from 'lucide-react'

export const dynamic = 'force-dynamic'

type Priority = 'low' | 'medium' | 'high'
type ProjectStatus = 'active' | 'completed' | 'on-hold' | 'upcoming'

type Project = {
  id: string
  title: string
  client: string
  budget: number
  spent: number
  progress: number
  status: ProjectStatus
  priority: Priority
  startDate: string
  endDate: string
  crew: number
  description: string
}

const initialProjects: Project[] = [
  { id: 'p1', title: 'Neon Nights Feature Film', client: 'Neon Films Ltd', budget: 85000, spent: 42000, progress: 65, status: 'active', priority: 'high', startDate: 'Mar 1, 2026', endDate: 'Jun 30, 2026', crew: 12, description: 'Feature film production. Currently in principal photography phase.' },
  { id: 'p2', title: 'City Lights Commercial', client: 'BFI Productions', budget: 28000, spent: 28000, progress: 100, status: 'completed', priority: 'medium', startDate: 'Feb 1, 2026', endDate: 'Mar 15, 2026', crew: 6, description: 'TV commercial for brand campaign. Delivered and approved.' },
  { id: 'p3', title: 'Apex Documentary Series', client: 'Channel 4', budget: 120000, spent: 18000, progress: 20, status: 'active', priority: 'high', startDate: 'Mar 20, 2026', endDate: 'Dec 31, 2026', crew: 8, description: '3-part documentary series covering UK manufacturing.' },
  { id: 'p4', title: 'Midnight Run TVC', client: 'Sky Studios', budget: 45000, spent: 0, progress: 0, status: 'upcoming', priority: 'medium', startDate: 'Apr 15, 2026', endDate: 'May 30, 2026', crew: 5, description: 'Television commercial. Pre-production begins April.' },
  { id: 'p5', title: 'Sundown Series Pilot', client: 'ITV', budget: 220000, spent: 95000, progress: 45, status: 'on-hold', priority: 'high', startDate: 'Jan 10, 2026', endDate: 'Aug 31, 2026', crew: 18, description: 'Drama pilot on hold pending script revisions from writer.' },
]

const STATUS_STYLE: Record<ProjectStatus, string> = {
  active: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  completed: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  'on-hold': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  upcoming: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
}

const PRIORITY_DOT: Record<Priority, string> = {
  low: 'bg-slate-400',
  medium: 'bg-amber-400',
  high: 'bg-rose-400',
}

function ProjectModal({ project, onClose, onSave }: { project?: Project; onClose: () => void; onSave: (p: Project) => void }) {
  const [form, setForm] = useState({
    title: project?.title ?? '',
    client: project?.client ?? '',
    budget: project?.budget?.toString() ?? '',
    crew: project?.crew?.toString() ?? '',
    status: project?.status ?? 'upcoming' as ProjectStatus,
    priority: project?.priority ?? 'medium' as Priority,
    startDate: project?.startDate ?? '',
    endDate: project?.endDate ?? '',
    description: project?.description ?? '',
  })
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const submit = () => {
    if (!form.title.trim() || !form.client.trim()) return
    onSave({
      id: project?.id ?? 'p' + Date.now(),
      title: form.title.trim(),
      client: form.client.trim(),
      budget: parseFloat(form.budget) || 0,
      spent: project?.spent ?? 0,
      progress: project?.progress ?? 0,
      status: form.status,
      priority: form.priority,
      startDate: form.startDate || '-',
      endDate: form.endDate || '-',
      crew: parseInt(form.crew) || 0,
      description: form.description.trim(),
    })
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="bg-[#0A1020] border border-white/10 rounded-2xl p-7 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">{project ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={18} /></button>
        </div>
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Project Title *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Brand Commercial - Spring Campaign" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Client *</label>
              <input value={form.client} onChange={e => set('client', e.target.value)} placeholder="Client name" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Budget (£)</label>
              <input value={form.budget} onChange={e => set('budget', e.target.value)} placeholder="e.g. 50000" type="number" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50">
                {(['active', 'upcoming', 'on-hold', 'completed'] as const).map(s => <option key={s} value={s} className="bg-[#0A1020]">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Priority</label>
              <select value={form.priority} onChange={e => set('priority', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50">
                {(['low', 'medium', 'high'] as const).map(p => <option key={p} value={p} className="bg-[#0A1020]">{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Start Date</label>
              <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">End Date</label>
              <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Crew Size</label>
            <input value={form.crew} onChange={e => set('crew', e.target.value)} placeholder="Number of crew" type="number" min="1" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Brief project description" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 resize-none" />
          </div>
        </div>
        <button onClick={submit} disabled={!form.title.trim() || !form.client.trim()} className="w-full py-3 bg-amber-400 text-black font-bold rounded-xl text-sm hover:bg-amber-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          {project ? 'Save Changes' : 'Create Project'}
        </button>
      </motion.div>
    </motion.div>
  )
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all')
  const [modal, setModal] = useState<{ project?: Project } | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const saveProject = (p: Project) => {
    setProjects(prev => {
      const exists = prev.find(x => x.id === p.id)
      return exists ? prev.map(x => x.id === p.id ? p : x) : [p, ...prev]
    })
    setModal(null)
  }

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id))
    setDeleteConfirm(null)
    if (expanded === id) setExpanded(null)
  }

  const totalBudget = projects.reduce((s, p) => s + p.budget, 0)
  const totalSpent = projects.reduce((s, p) => s + p.spent, 0)
  const active = projects.filter(p => p.status === 'active').length

  return (
    <div className="flex h-screen bg-[#04080F] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Projects</h1>
              <p className="text-slate-400 text-sm mt-0.5">Track productions, budgets, and crew assignments</p>
            </div>
            <button onClick={() => setModal({})} className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-black font-semibold rounded-xl text-sm hover:bg-amber-300 transition-colors"><Plus size={16} />New Project</button>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Projects', value: projects.length, color: 'text-white' },
              { label: 'Active', value: active, color: 'text-emerald-400' },
              { label: 'Total Budget', value: `£${(totalBudget / 1000).toFixed(0)}k`, color: 'text-amber-400' },
              { label: 'Budget Used', value: `${Math.round(totalSpent / totalBudget * 100)}%`, color: 'text-blue-400' },
            ].map(s => (
              <div key={s.label} className="bg-[#0A1020] border border-white/5 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mb-5">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..." className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
            </div>
            <div className="flex gap-1">
              {(['all', 'active', 'upcoming', 'on-hold', 'completed'] as const).map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${statusFilter === s ? 'bg-amber-400 text-black' : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'}`}>{s}</button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {filtered.map(project => (
              <motion.div key={project.id} layout className="bg-[#0A1020] border border-white/5 rounded-xl overflow-hidden">
                <div className="p-4 cursor-pointer" onClick={() => setExpanded(expanded === project.id ? null : project.id)}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${PRIORITY_DOT[project.priority]}`} />
                      <div>
                        <h3 className="text-sm font-semibold text-white">{project.title}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{project.client}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLE[project.status]}`}>{project.status === 'on-hold' ? 'On Hold' : project.status.charAt(0).toUpperCase() + project.status.slice(1)}</span>
                      <button onClick={e => { e.stopPropagation(); setModal({ project }) }} className="text-slate-500 hover:text-white transition-colors p-1"><Edit2 size={13} /></button>
                      <button onClick={e => { e.stopPropagation(); setDeleteConfirm(project.id) }} className="text-slate-500 hover:text-rose-400 transition-colors p-1"><Trash2 size={13} /></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1"><TrendingUp size={11} />£{project.budget.toLocaleString()} budget</span>
                    <span className="flex items-center gap-1"><Users size={11} />{project.crew} crew</span>
                    <span className="flex items-center gap-1"><Calendar size={11} />{project.endDate}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div className={`h-full rounded-full ${project.spent / project.budget > 0.9 ? 'bg-rose-400' : project.spent / project.budget > 0.7 ? 'bg-amber-400' : 'bg-emerald-400'}`} initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} transition={{ duration: 0.8 }} />
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">{project.progress}%</span>
                  </div>
                </div>
                <AnimatePresence>
                  {expanded === project.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-white/5 px-4 pb-4 pt-3">
                      <p className="text-sm text-slate-300 mb-3">{project.description}</p>
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div><p className="text-slate-400 mb-0.5">Budget</p><p className="text-white font-medium">£{project.budget.toLocaleString()}</p></div>
                        <div><p className="text-slate-400 mb-0.5">Spent</p><p className="text-white font-medium">£{project.spent.toLocaleString()}</p></div>
                        <div><p className="text-slate-400 mb-0.5">Remaining</p><p className={`font-medium ${project.budget - project.spent < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>£{(project.budget - project.spent).toLocaleString()}</p></div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
            {filtered.length === 0 && <div className="text-center py-12"><p className="text-slate-500 text-sm">No projects found</p></div>}
          </div>
        </main>
      </div>
      <AnimatePresence>
        {modal !== null && <ProjectModal project={modal.project} onClose={() => setModal(null)} onSave={saveProject} />}
      </AnimatePresence>
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-[#0A1020] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
              <h3 className="text-base font-bold text-white mb-2">Delete Project</h3>
              <p className="text-sm text-slate-400 mb-6">This action cannot be undone. Are you sure?</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-white/10 text-slate-300 rounded-xl text-sm hover:bg-white/5 transition-colors">Cancel</button>
                <button onClick={() => deleteProject(deleteConfirm)} className="flex-1 py-2.5 bg-rose-500 text-white font-semibold rounded-xl text-sm hover:bg-rose-600 transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
