'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'

const PROJECTS = [
  { id: 1, name: 'Neon Nights Music Video', client: 'Pulse Records', status: 'Active', budget: 28000, spent: 18400, deadline: '2026-03-21', crew: 8, progress: 66, tags: ['Music Video', 'Post-Prod'], priority: 'high' },
  { id: 2, name: 'City Lights Documentary', client: 'Channel 4', status: 'Active', budget: 65000, spent: 31200, deadline: '2026-03-22', crew: 14, progress: 48, tags: ['Documentary', 'Filming'], priority: 'high' },
  { id: 3, name: 'Apex Energy TVC', client: 'Apex Corp', status: 'Active', budget: 42000, spent: 12600, deadline: '2026-04-10', crew: 6, progress: 30, tags: ['Commercial', 'Pre-Prod'], priority: 'medium' },
  { id: 4, name: 'Midnight Run Feature', client: 'Indie Films Ltd', status: 'Planning', budget: 180000, spent: 8000, deadline: '2026-06-30', crew: 22, progress: 4, tags: ['Feature Film', 'Pre-Prod'], priority: 'low' },
  { id: 5, name: 'Summer Vibes Campaign', client: 'ASOS', status: 'Completed', budget: 18000, spent: 17200, deadline: '2026-02-28', crew: 5, progress: 100, tags: ['Brand', 'Social'], priority: 'low' },
  { id: 6, name: 'Urban Pulse EP', client: 'Beats United', status: 'Completed', budget: 12000, spent: 11800, deadline: '2026-02-15', crew: 4, progress: 100, tags: ['Music Video'], priority: 'low' },
]

const STATUS_COLORS: Record<string, string> = {
  Active: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  Planning: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  Completed: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
  'On Hold': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
}

const PRIORITY_DOT: Record<string, string> = {
  high: 'bg-red-400',
  medium: 'bg-amber-400',
  low: 'bg-emerald-400',
}

const TAG_COLORS = ['bg-purple-500/20 text-purple-300', 'bg-blue-500/20 text-blue-300', 'bg-pink-500/20 text-pink-300', 'bg-teal-500/20 text-teal-300']

interface Project {
  id: number; name: string; client: string; status: string; budget: number; spent: number;
  deadline: string; crew: number; progress: number; tags: string[]; priority: string;
}

function ProjectModal({ project, onClose, onSave }: { project: Project | null, onClose: () => void, onSave: (p: Project) => void }) {
  const [form, setForm] = useState(project || { id: Date.now(), name: '', client: '', status: 'Planning', budget: 0, spent: 0, deadline: '', crew: 0, progress: 0, tags: [], priority: 'medium' })
  const set = (k: string, v: string | number) => setForm((f: typeof form) => ({ ...f, [k]: v }))
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="bg-[#0A1020] border border-white/10 rounded-2xl p-8 w-full max-w-lg shadow-2xl" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-white mb-6">{project ? 'Edit Project' : 'New Project'}</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">Project Name</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-400/50 focus:outline-none" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Neon Nights MV" /></div>
            <div><label className="text-xs text-gray-400 mb-1 block">Client</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-400/50 focus:outline-none" value={form.client} onChange={e => set('client', e.target.value)} placeholder="Client name" /></div>
            <div><label className="text-xs text-gray-400 mb-1 block">Status</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-400/50 focus:outline-none" value={form.status} onChange={e => set('status', e.target.value)}>
                {['Planning', 'Active', 'On Hold', 'Completed'].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div><label className="text-xs text-gray-400 mb-1 block">Budget (£)</label>
              <input type="number" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-400/50 focus:outline-none" value={form.budget} onChange={e => set('budget', Number(e.target.value))} /></div>
            <div><label className="text-xs text-gray-400 mb-1 block">Deadline</label>
              <input type="date" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-400/50 focus:outline-none" value={form.deadline} onChange={e => set('deadline', e.target.value)} /></div>
            <div><label className="text-xs text-gray-400 mb-1 block">Crew Size</label>
              <input type="number" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-400/50 focus:outline-none" value={form.crew} onChange={e => set('crew', Number(e.target.value))} /></div>
            <div><label className="text-xs text-gray-400 mb-1 block">Priority</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-400/50 focus:outline-none" value={form.priority} onChange={e => set('priority', e.target.value)}>
                {['high', 'medium', 'low'].map(p => <option key={p} value={p}>{p}</option>)}</select></div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-400 text-sm hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={() => onSave(form as Project)} className="flex-1 py-2.5 rounded-lg bg-amber-400 text-black font-semibold text-sm hover:bg-amber-300 transition-colors">{project ? 'Save Changes' : 'Create Project'}</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(PROJECTS)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<'new' | Project | null>(null)

  const statusTabs = ['All', 'Active', 'Planning', 'Completed', 'On Hold']
  const filtered = projects.filter(p => (filter === 'All' || p.status === filter) && (p.name.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase())))

  const totalBudget = projects.reduce((s, p) => s + p.budget, 0)
  const totalSpent = projects.reduce((s, p) => s + p.spent, 0)
  const active = projects.filter(p => p.status === 'Active').length

  const saveProject = (p: Project) => {
    if (projects.find(x => x.id === p.id)) setProjects(ps => ps.map(x => x.id === p.id ? p : x))
    else setProjects(ps => [...ps, p])
    setModal(null)
  }
  const deleteProject = (id: number) => setProjects(ps => ps.filter(p => p.id !== id))

  const daysLeft = (d: string) => Math.ceil((new Date(d).getTime() - Date.now()) / 86400000)

  return (
    <div className="flex h-screen bg-[#04080F] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Projects', value: projects.length, sub: `${active} active` },
              { label: 'Total Budget', value: `£${(totalBudget/1000).toFixed(0)}k`, sub: 'across all projects' },
              { label: 'Total Spent', value: `£${(totalSpent/1000).toFixed(0)}k`, sub: `${Math.round(totalSpent/totalBudget*100)}% utilised` },
              { label: 'Crew Deployed', value: projects.reduce((s,p)=>s+p.crew,0), sub: 'across active projects' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-[#0A1020] border border-white/[0.06] rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex bg-[#0A1020] border border-white/[0.06] rounded-lg p-0.5 gap-0.5">
              {statusTabs.map(t => (
                <button key={t} onClick={() => setFilter(t)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filter === t ? 'bg-amber-400 text-black' : 'text-gray-400 hover:text-white'}`}>{t}</button>
              ))}
            </div>
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input className="w-full bg-[#0A1020] border border-white/[0.06] rounded-lg pl-8 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-amber-400/50 focus:outline-none" placeholder="Search projects or clients..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex bg-[#0A1020] border border-white/[0.06] rounded-lg p-0.5">
              <button onClick={() => setView('grid')} className={`px-3 py-1.5 rounded-md text-xs transition-all ${view === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>⊞ Grid</button>
              <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded-md text-xs transition-all ${view === 'list' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>☰ List</button>
            </div>
            <button onClick={() => setModal('new')} className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
              <span className="text-base leading-none">+</span> New Project
            </button>
          </div>

          {/* Grid View */}
          <AnimatePresence mode="wait">
            {view === 'grid' && (
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((p, i) => {
                  const days = daysLeft(p.deadline)
                  const pct = Math.round(p.spent / p.budget * 100)
                  return (
                    <motion.div key={p.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      className="bg-[#0A1020] border border-white/[0.06] rounded-xl p-5 hover:border-amber-400/20 transition-all group relative">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${PRIORITY_DOT[p.priority]}`} />
                          <div>
                            <h3 className="text-white font-semibold text-sm leading-tight">{p.name}</h3>
                            <p className="text-gray-500 text-xs mt-0.5">{p.client}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                      </div>
                      {/* Tags */}
                      <div className="flex gap-1.5 mb-4 flex-wrap">
                        {p.tags.map((t, ti) => <span key={t} className={`text-xs px-2 py-0.5 rounded-full ${TAG_COLORS[ti % TAG_COLORS.length]}`}>{t}</span>)}
                      </div>
                      {/* Progress */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span><span className="text-white font-medium">{p.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500" initial={{ width: 0 }} animate={{ width: `${p.progress}%` }} transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.05 }} />
                        </div>
                      </div>
                      {/* Budget */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Budget</span><span className={pct > 85 ? 'text-red-400' : 'text-white font-medium'}>£{(p.spent/1000).toFixed(1)}k / £{(p.budget/1000).toFixed(0)}k</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div className={`h-full rounded-full ${pct > 85 ? 'bg-red-400' : 'bg-emerald-400'}`} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.05 + 0.1 }} />
                        </div>
                      </div>
                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>👥 {p.crew}</span>
                          <span className={days < 0 ? 'text-red-400' : days < 7 ? 'text-amber-400' : 'text-gray-500'}>
                            📅 {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Due today' : `${days}d left`}
                          </span>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setModal(p)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs transition-colors">✏️</button>
                          <button onClick={() => deleteProject(p.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 text-xs transition-colors">🗑️</button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}

            {/* List View */}
            {view === 'list' && (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#0A1020] border border-white/[0.06] rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead><tr className="border-b border-white/5">
                    {['Project', 'Client', 'Status', 'Progress', 'Budget', 'Crew', 'Deadline', ''].map(h => (
                      <th key={h} className="text-left text-xs text-gray-500 font-medium px-4 py-3">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {filtered.map((p, i) => {
                      const days = daysLeft(p.deadline)
                      return (
                        <motion.tr key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                          className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                          <td className="px-4 py-3"><div className="flex items-center gap-2"><span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[p.priority]}`} /><span className="text-white text-sm font-medium">{p.name}</span></div></td>
                          <td className="px-4 py-3 text-gray-400 text-sm">{p.client}</td>
                          <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[p.status]}`}>{p.status}</span></td>
                          <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-amber-400 rounded-full" style={{ width: `${p.progress}%` }} /></div><span className="text-xs text-gray-400">{p.progress}%</span></div></td>
                          <td className="px-4 py-3 text-sm text-gray-300">£{(p.budget/1000).toFixed(0)}k</td>
                          <td className="px-4 py-3 text-sm text-gray-400">{p.crew}</td>
                          <td className="px-4 py-3 text-xs"><span className={days < 0 ? 'text-red-400' : days < 7 ? 'text-amber-400' : 'text-gray-400'}>{days < 0 ? `${Math.abs(days)}d overdue` : `${days}d`}</span></td>
                          <td className="px-4 py-3"><div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setModal(p)} className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 text-xs">✏️</button>
                            <button onClick={() => deleteProject(p.id)} className="p-1 rounded bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 text-xs">🗑️</button>
                          </div></td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <p className="text-4xl mb-3">📁</p>
              <p className="font-medium">No projects found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          )}
        </main>
      </div>

      <AnimatePresence>
        {modal && <ProjectModal project={modal === 'new' ? null : modal as Project} onClose={() => setModal(null)} onSave={saveProject} />}
      </AnimatePresence>
    </div>
  )
}
