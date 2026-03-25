'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'
import { Plus, Search, X, Trash2, Users, Calendar, TrendingUp } from 'lucide-react'

interface Project {
    id: number; name: string; client: string; status: string;
    budget: number; spent: number; deadline: string; crew: number;
    progress: number; tags: string[]; priority: string;
}

const INITIAL_PROJECTS: Project[] = [
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

const TAG_COLORS = [
    'bg-purple-500/20 text-purple-300',
    'bg-blue-500/20 text-blue-300',
    'bg-pink-500/20 text-pink-300',
    'bg-teal-500/20 text-teal-300'
  ]

function ProjectModal({ project, onClose, onSave }: { project: Project | null; onClose: () => void; onSave: (p: Project) => void }) {
    const [form, setForm] = useState<Project>(project || {
          id: Date.now(), name: '', client: '', status: 'Planning',
          budget: 0, spent: 0, deadline: '', crew: 0, progress: 0, tags: [], priority: 'medium'
    })
    const set = (k: keyof Project, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  return (
        <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
              >
              <motion.div
                        className="bg-[#0A1020] border border-white/10 rounded-2xl p-7 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
                        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                        onClick={e => e.stopPropagation()}
                      >
                      <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">{project ? 'Edit Project' : 'New Project'}</h2>h2>
                                <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>button>
                      </div>div>
                      <div className="grid grid-cols-2 gap-4 mb-5">
                                <div className="col-span-2">
                                            <label className="text-xs text-slate-400 mb-1 block">Project Name *</label>label>
                                            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Neon Nights Music Video" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
                                </div>div>
                                <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Client *</label>label>
                                            <input value={form.client} onChange={e => set('client', e.target.value)} placeholder="Client name" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
                                </div>div>
                                <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Status</label>label>
                                            <select value={form.status} onChange={e => set('status', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50">
                                              {['Planning', 'Active', 'On Hold', 'Completed'].map(s => <option key={s} value={s} className="bg-[#0A1020]">{s}</option>option>)}
                                            </select>select>
                                </div>div>
                                <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Budget (£)</label>label>
                                            <input type="number" value={form.budget} onChange={e => set('budget', Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50" />
                                </div>div>
                                <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Spent (£)</label>label>
                                            <input type="number" value={form.spent} onChange={e => set('spent', Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50" />
                                </div>div>
                                <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Deadline</label>label>
                                            <input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50" />
                                </div>div>
                                <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Crew Size</label>label>
                                            <input type="number" value={form.crew} onChange={e => set('crew', Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50" />
                                </div>div>
                                <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Progress (%)</label>label>
                                            <input type="number" min={0} max={100} value={form.progress} onChange={e => set('progress', Math.min(100, Math.max(0, Number(e.target.value))))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50" />
                                </div>div>
                                <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Priority</label>label>
                                            <select value={form.priority} onChange={e => set('priority', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50">
                                              {['low', 'medium', 'high'].map(p => <option key={p} value={p} className="bg-[#0A1020]">{p.charAt(0).toUpperCase() + p.slice(1)}</option>option>)}
                                            </select>select>
                                </div>div>
                      </div>div>
                      <button
                                  onClick={() => { if (form.name && form.client) onSave(form) }}
                                  disabled={!form.name.trim() || !form.client.trim()}
                                  className="w-full py-3 bg-amber-400 text-black font-bold rounded-xl text-sm hover:bg-amber-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                        {project ? 'Save Changes' : 'Create Project'}
                      </button>button>
              </motion.div>motion.div>
        </motion.div>motion.div>
      )
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS)
        const [search, setSearch] = useState('')
            const [statusFilter, setStatusFilter] = useState('All')
                const [showModal, setShowModal] = useState(false)
                    const [editing, setEditing] = useState<Project | null>(null)
                        const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
                          
                            const statuses = ['All', 'Active', 'Planning', 'Completed', 'On Hold']
                              
                                const filtered = projects.filter(p => {
                                      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase())
                                            const matchStatus = statusFilter === 'All' || p.status === statusFilter
                                                  return matchSearch && matchStatus
                                })
                                  
                                    const stats = {
                                          active: projects.filter(p => p.status === 'Active').length,
                                          totalBudget: projects.reduce((s, p) => s + p.budget, 0),
                                          totalSpent: projects.reduce((s, p) => s + p.spent, 0),
                                          crew: projects.reduce((s, p) => s + p.crew, 0),
                                    }
                                      
                                        const saveProject = (p: Project) => {
                                              setProjects(prev => {
                                                      const exists = prev.find(x => x.id === p.id)
                                                              return exists ? prev.map(x => x.id === p.id ? p : x) : [p, ...prev]
                                              })
                                                    setShowModal(false)
                                                          setEditing(null)
                                        }
                                          
                                            const deleteProject = (id: number) => {
                                                  setProjects(prev => prev.filter(p => p.id !== id))
                                                        setDeleteConfirm(null)
                                            }
                                              
                                                return (
                                                      <div className="flex h-screen bg-[#04080F] overflow-hidden">
                                                            <Sidebar />
                                                            <div className="flex flex-col flex-1 min-w-0 ml-64 overflow-hidden">
                                                                    <TopHeader />
                                                                    <div className="flex-1 overflow-y-auto p-8">
                                                                              <div className="max-w-7xl mx-auto">
                                                                                {/* Header */}
                                                                                          <div className="flex items-center justify-between mb-8">
                                                                                                        <div>
                                                                                                                        <h1 className="text-2xl font-black text-white tracking-tight">Projects</h1>h1>
                                                                                                                        <p className="text-slate-400 text-sm mt-1">Track and manage your production projects</p>p>
                                                                                                          </div>div>
                                                                                                        <button
                                                                                                                          onClick={() => { setEditing(null); setShowModal(true) }}
                                                                                                                          className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 text-black font-bold text-sm rounded-xl hover:bg-amber-300 transition-colors"
                                                                                                                        >
                                                                                                                        <Plus className="w-4 h-4" /> New Project
                                                                                                          </button>button>
                                                                                            </div>div>
                                                                              
                                                                                {/* Stats */}
                                                                                          <div className="grid grid-cols-4 gap-4 mb-8">
                                                                                            {[
                                                        { label: 'Active Projects', value: stats.active.toString(), color: 'text-emerald-400', icon: TrendingUp },
                                                        { label: 'Total Budget', value: `£${stats.totalBudget.toLocaleString()}`, color: 'text-amber-400', icon: TrendingUp },
                                                        { label: 'Total Spent', value: `£${stats.totalSpent.toLocaleString()}`, color: 'text-blue-400', icon: TrendingUp },
                                                        { label: 'Crew Assigned', value: stats.crew.toString(), color: 'text-purple-400', icon: Users },
                                                                      ].map(stat => (
                                                                                        <div key={stat.label} className="bg-[#0A1020] border border-[#1A2540] rounded-2xl p-5">
                                                                                                          <p className="text-xs text-slate-500 mb-1">{stat.label}</p>p>
                                                                                                          <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>p>
                                                                                          </div>div>
                                                                                      ))}
                                                                                            </div>div>
                                                                              
                                                                                {/* Filters */}
                                                                                          <div className="flex items-center gap-3 mb-6">
                                                                                                        <div className="relative flex-1 max-w-sm">
                                                                                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                                                                                        <input
                                                                                                                                            value={search}
                                                                                                                                            onChange={e => setSearch(e.target.value)}
                                                                                                                                            placeholder="Search projects..."
                                                                                                                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
                                                                                                                                          />
                                                                                                          </div>div>
                                                                                                        <div className="flex items-center gap-1">
                                                                                                          {statuses.map(s => (
                                                                          <button
                                                                                                key={s}
                                                                                                onClick={() => setStatusFilter(s)}
                                                                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === s ? 'bg-amber-400 text-black' : 'text-slate-400 hover:text-white bg-white/5'}`}
                                                                                              >
                                                                            {s}
                                                                          </button>button>
                                                                        ))}
                                                                                                          </div>div>
                                                                                            </div>div>
                                                                              
                                                                                {/* Projects grid */}
                                                                                {filtered.length === 0 ? (
                                                                      <div className="text-center py-20 text-slate-500">
                                                                                      <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                                                                      <p className="text-sm">No projects found</p>p>
                                                                      </div>div>
                                                                    ) : (
                                                                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                                                        {filtered.map((p, i) => (
                                                                                          <motion.div
                                                                                                                key={p.id}
                                                                                                                initial={{ opacity: 0, y: 20 }}
                                                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                                                transition={{ delay: i * 0.05 }}
                                                                                                                className="group bg-[#0A1020] border border-[#1A2540] rounded-2xl p-5 hover:border-[#243050] transition-all"
                                                                                                              >
                                                                                                              <div className="flex items-start justify-between mb-3">
                                                                                                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                                                                                                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_DOT[p.priority]}`} />
                                                                                                                                                            <h3 className="text-sm font-bold text-white truncate">{p.name}</h3>h3>
                                                                                                                                      </div>div>
                                                                                                                                    <div className="flex items-center gap-1 ml-2">
                                                                                                                                                            <button
                                                                                                                                                                                        onClick={() => { setEditing(p); setShowModal(true) }}
                                                                                                                                                                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/10 text-slate-500 hover:text-white"
                                                                                                                                                                                      >
                                                                                                                                                                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>svg>
                                                                                                                                                              </button>button>
                                                                                                                                                            <button
                                                                                                                                                                                        onClick={() => setDeleteConfirm(p.id)}
                                                                                                                                                                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-400"
                                                                                                                                                                                      >
                                                                                                                                                                                      <Trash2 className="w-3.5 h-3.5" />
                                                                                                                                                              </button>button>
                                                                                                                                      </div>div>
                                                                                                                </div>div>
                                                                                          
                                                                                                              <p className="text-xs text-slate-500 mb-3">{p.client}</p>p>
                                                                                          
                                                                                                              <div className="flex flex-wrap gap-1.5 mb-4">
                                                                                                                {p.tags.map((tag, ti) => (
                                                                                                                                        <span key={tag} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${TAG_COLORS[ti % TAG_COLORS.length]}`}>{tag}</span>span>
                                                                                                                                      ))}
                                                                                                                </div>div>
                                                                                          
                                                                                            {/* Progress */}
                                                                                                              <div className="mb-3">
                                                                                                                                    <div className="flex items-center justify-between mb-1.5">
                                                                                                                                                            <span className="text-[10px] text-slate-500">Progress</span>span>
                                                                                                                                                            <span className="text-[10px] font-bold text-white">{p.progress}%</span>span>
                                                                                                                                      </div>div>
                                                                                                                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                                                                                                                            <motion.div
                                                                                                                                                                                        initial={{ width: 0 }}
                                                                                                                                                                                        animate={{ width: `${p.progress}%` }}
                                                                                                                                                                                        transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.05 }}
                                                                                                                                                                                        className={`h-full rounded-full ${p.progress === 100 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                                                                                                                                                                                      />
                                                                                                                                      </div>div>
                                                                                                                </div>div>
                                                                                          
                                                                                            {/* Meta */}
                                                                                                              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                                                                                                                    <div className="flex items-center gap-3">
                                                                                                                                                            <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[p.status]}`}>{p.status}</span>span>
                                                                                                                                                            <span className="flex items-center gap-1 text-[10px] text-slate-500">
                                                                                                                                                                                      <Users className="w-3 h-3" />{p.crew}
                                                                                                                                                              </span>span>
                                                                                                                                      </div>div>
                                                                                                                                    <div className="text-right">
                                                                                                                                                            <p className="text-[10px] text-slate-500">Budget</p>p>
                                                                                                                                                            <p className="text-xs font-bold text-white">£{p.budget.toLocaleString()}</p>p>
                                                                                                                                      </div>div>
                                                                                                                </div>div>
                                                                                          
                                                                                            {/* Budget health bar */}
                                                                                                              <div className="mt-2">
                                                                                                                                    <div className="flex justify-between text-[9px] text-slate-600 mb-1">
                                                                                                                                                            <span>Spent: £{p.spent.toLocaleString()}</span>span>
                                                                                                                                                            <span>{Math.round((p.spent / p.budget) * 100)}% used</span>span>
                                                                                                                                      </div>div>
                                                                                                                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                                                                                                                            <div
                                                                                                                                                                                        className={`h-full rounded-full transition-all ${(p.spent / p.budget) > 0.9 ? 'bg-red-400' : (p.spent / p.budget) > 0.7 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                                                                                                                                                                                        style={{ width: `${Math.min(100, (p.spent / p.budget) * 100)}%` }}
                                                                                                                                                                                      />
                                                                                                                                      </div>div>
                                                                                                                </div>div>
                                                                                            </motion.div>motion.div>
                                                                                        ))}
                                                                      </div>div>
                                                                                          )}
                                                                              </div>div>
                                                                    </div>div>
                                                            </div>div>
                                                      
                                                            <AnimatePresence>
                                                              {showModal && (
                                                                  <ProjectModal
                                                                                project={editing}
                                                                                onClose={() => { setShowModal(false); setEditing(null) }}
                                                                                onSave={saveProject}
                                                                              />
                                                                )}
                                                              {deleteConfirm !== null && (
                                                                  <motion.div
                                                                                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm"
                                                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                                              >
                                                                              <motion.div
                                                                                              className="bg-[#0A1020] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
                                                                                              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                                                                                            >
                                                                                            <h3 className="text-base font-bold text-white mb-2">Delete project?</h3>h3>
                                                                                            <p className="text-sm text-slate-400 mb-5">This action cannot be undone.</p>p>
                                                                                            <div className="flex gap-3">
                                                                                                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 bg-white/5 border border-white/10 text-white font-semibold text-sm rounded-xl hover:bg-white/10 transition-colors">Cancel</button>button>
                                                                                                            <button onClick={() => deleteProject(deleteConfirm!)} className="flex-1 py-2.5 bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-sm rounded-xl hover:bg-red-500/30 transition-colors">Delete</button>button>
                                                                                              </div>div>
                                                                              </motion.div>motion.div>
                                                                  </motion.div>motion.div>
                                                                )}
                                                            </AnimatePresence>AnimatePresence>
                                                      </div>div>
                                                    )
                                                  }</motion.div>
