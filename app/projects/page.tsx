'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Search, Filter, FolderOpen, Calendar, Users, DollarSign, MoreHorizontal, ChevronRight, Briefcase, TrendingUp, Clock, CheckCircle2, AlertCircle, Circle } from 'lucide-react'
import clsx from 'clsx'

interface Project {
  id: string
  name: string
  client: string
  status: 'active' | 'completed' | 'on-hold' | 'draft'
  budget: number
  spent: number
  start_date: string
  end_date: string
  crew_count: number
  description: string
  created_at: string
}

const statusConfig = {
  active: { label: 'Active', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', dot: 'bg-emerald-400' },
  completed: { label: 'Completed', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', dot: 'bg-blue-400' },
  'on-hold': { label: 'On Hold', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', dot: 'bg-amber-400' },
  draft: { label: 'Draft', color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/20', dot: 'bg-slate-400' },
}

const defaultForm = {
  name: '', client: '', status: 'active' as Project['status'],
  budget: 0, spent: 0, start_date: '', end_date: '', crew_count: 0, description: '',
}

export const dynamic = 'force-dynamic'

export default function ProjectsPage() {
  const supabase = createClient()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [menuOpen, setMenuOpen] = useState<string | null>(null)

  useEffect(() => { fetchProjects() }, [])

  async function fetchProjects() {
    setLoading(true)
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    setProjects(data || [])
    setLoading(false)
  }

  function openNew() {
    setEditing(null)
    setForm(defaultForm)
    setShowForm(true)
  }

  function openEdit(p: Project) {
    setEditing(p)
    setForm({ name: p.name, client: p.client, status: p.status as Project['status'], budget: p.budget, spent: p.spent, start_date: p.start_date || '', end_date: p.end_date || '', crew_count: p.crew_count || 0, description: p.description || '' })
    setShowForm(true)
    setMenuOpen(null)
  }

  async function saveProject() {
    if (!form.name.trim()) return
    if (editing) {
      await supabase.from('projects').update(form).eq('id', editing.id)
    } else {
      await supabase.from('projects').insert([form])
    }
    setShowForm(false)
    fetchProjects()
  }

  async function deleteProject(id: string) {
    await supabase.from('projects').delete().eq('id', id)
    setMenuOpen(null)
    fetchProjects()
  }

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    totalBudget: projects.reduce((s, p) => s + (p.budget || 0), 0),
    completed: projects.filter(p => p.status === 'completed').length,
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Projects</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your production projects and track budgets</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-amber-500/20">
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Projects', value: stats.total, icon: Briefcase, color: 'blue' },
          { label: 'Active', value: stats.active, icon: TrendingUp, color: 'emerald' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'purple' },
          { label: 'Total Budget', value: `£${(stats.totalBudget / 1000).toFixed(0)}k`, icon: DollarSign, color: 'amber' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#0A1020] border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 transition-colors">
            <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center mb-3', {
              'bg-blue-500/10': stat.color === 'blue',
              'bg-emerald-500/10': stat.color === 'emerald',
              'bg-purple-500/10': stat.color === 'purple',
              'bg-amber-500/10': stat.color === 'amber',
            })}>
              <stat.icon className={clsx('w-4.5 h-4.5', {
                'text-blue-400': stat.color === 'blue',
                'text-emerald-400': stat.color === 'emerald',
                'text-purple-400': stat.color === 'purple',
                'text-amber-400': stat.color === 'amber',
              })} style={{ width: '1.125rem', height: '1.125rem' }} />
            </div>
            <div className="text-xl font-semibold text-white">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full bg-[#0A1020] border border-white/[0.06] text-white text-sm pl-9 pr-4 py-2.5 rounded-xl placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'completed', 'on-hold', 'draft'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={clsx('px-3 py-2 rounded-xl text-xs font-medium capitalize transition-colors', {
                'bg-amber-500 text-black': statusFilter === s,
                'bg-[#0A1020] border border-white/[0.06] text-slate-400 hover:text-white hover:border-white/10': statusFilter !== s,
              })}
            >
              {s === 'all' ? 'All' : statusConfig[s as Project['status']]?.label || s}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#0A1020] border border-white/[0.06] rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-white/5 rounded w-2/3 mb-2" />
              <div className="h-3 bg-white/5 rounded w-1/3 mb-4" />
              <div className="h-2 bg-white/5 rounded-full w-full mb-4" />
              <div className="flex gap-4">
                <div className="h-3 bg-white/5 rounded w-16" />
                <div className="h-3 bg-white/5 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-[#0A1020] border border-white/[0.06] rounded-2xl flex items-center justify-center mb-4">
            <FolderOpen className="w-7 h-7 text-slate-600" />
          </div>
          <h3 className="text-white font-medium mb-1">{search || statusFilter !== 'all' ? 'No projects found' : 'No projects yet'}</h3>
          <p className="text-slate-500 text-sm mb-6">{search || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Create your first project to get started'}</p>
          {!search && statusFilter === 'all' && (
            <button onClick={openNew} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
              <Plus className="w-4 h-4" />
              Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((project) => {
            const cfg = statusConfig[project.status] || statusConfig.draft
            const budgetPct = project.budget > 0 ? Math.min(100, Math.round((project.spent / project.budget) * 100)) : 0
            const budgetColor = budgetPct > 85 ? 'bg-red-500' : budgetPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'
            return (
              <div key={project.id} className="group bg-[#0A1020] border border-white/[0.06] hover:border-white/10 rounded-2xl p-6 transition-all hover:shadow-xl hover:shadow-black/20 relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={clsx('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border', cfg.bg, cfg.color, cfg.border)}>
                        <span className={clsx('w-1.5 h-1.5 rounded-full', cfg.dot)} />
                        {cfg.label}
                      </span>
                    </div>
                    <h3 className="text-white font-semibold text-base truncate">{project.name}</h3>
                    <p className="text-slate-500 text-sm truncate">{project.client}</p>
                  </div>
                  <div className="relative ml-2">
                    <button
                      onClick={() => setMenuOpen(menuOpen === project.id ? null : project.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {menuOpen === project.id && (
                      <div className="absolute right-0 top-9 bg-[#0C1428] border border-white/10 rounded-xl shadow-2xl py-1 z-10 min-w-[120px]">
                        <button onClick={() => openEdit(project)} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 w-full text-left transition-colors">Edit</button>
                        <button onClick={() => deleteProject(project.id)} className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 w-full text-left transition-colors">Delete</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {project.description && (
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{project.description}</p>
                )}

                {/* Budget Bar */}
                {project.budget > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                      <span>Budget used</span>
                      <span className={budgetPct > 85 ? 'text-red-400' : 'text-slate-400'}>{budgetPct}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={clsx('h-full rounded-full transition-all', budgetColor)} style={{ width: `${budgetPct}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-slate-600 mt-1">
                      <span>£{(project.spent || 0).toLocaleString()} spent</span>
                      <span>£{(project.budget || 0).toLocaleString()} total</span>
                    </div>
                  </div>
                )}

                {/* Footer Meta */}
                <div className="flex items-center gap-4 text-xs text-slate-500 pt-4 border-t border-white/[0.04]">
                  {project.crew_count > 0 && (
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {project.crew_count} crew
                    </span>
                  )}
                  {project.end_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(project.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="bg-[#0A1020] border border-white/[0.08] rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-white/[0.06]">
              <h2 className="text-white font-semibold text-lg">{editing ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white transition-colors text-xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">Project Name *</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Feature Film 2026" className="w-full bg-[#060C18] border border-white/[0.06] text-white text-sm px-3 py-2.5 rounded-xl placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">Client</label>
                  <input value={form.client} onChange={e => setForm({...form, client: e.target.value})} placeholder="Client name" className="w-full bg-[#060C18] border border-white/[0.06] text-white text-sm px-3 py-2.5 rounded-xl placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value as Project['status']})} className="w-full bg-[#060C18] border border-white/[0.06] text-white text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:border-amber-500/50 transition-colors">
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="on-hold">On Hold</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">Total Budget (£)</label>
                  <input type="number" value={form.budget} onChange={e => setForm({...form, budget: Number(e.target.value)})} placeholder="0" className="w-full bg-[#060C18] border border-white/[0.06] text-white text-sm px-3 py-2.5 rounded-xl placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">Amount Spent (£)</label>
                  <input type="number" value={form.spent} onChange={e => setForm({...form, spent: Number(e.target.value)})} placeholder="0" className="w-full bg-[#060C18] border border-white/[0.06] text-white text-sm px-3 py-2.5 rounded-xl placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">Start Date</label>
                  <input type="date" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} className="w-full bg-[#060C18] border border-white/[0.06] text-white text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:border-amber-500/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">End Date</label>
                  <input type="date" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} className="w-full bg-[#060C18] border border-white/[0.06] text-white text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:border-amber-500/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">Crew Count</label>
                  <input type="number" value={form.crew_count} onChange={e => setForm({...form, crew_count: Number(e.target.value)})} placeholder="0" className="w-full bg-[#060C18] border border-white/[0.06] text-white text-sm px-3 py-2.5 rounded-xl placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">Description</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} placeholder="Brief project description..." className="w-full bg-[#060C18] border border-white/[0.06] text-white text-sm px-3 py-2.5 rounded-xl placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors resize-none" />
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 bg-white/5 hover:bg-white/8 text-slate-300 text-sm font-medium py-2.5 rounded-xl transition-colors">Cancel</button>
              <button onClick={saveProject} className="flex-1 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold py-2.5 rounded-xl transition-colors">
                {editing ? 'Save Changes' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
