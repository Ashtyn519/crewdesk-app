'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'
import { Plus, Search, X, Trash2, Edit2, Calendar, Users, TrendingUp, ChevronDown } from 'lucide-react'

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
  freelancers: number
  description: string
}

const PRIORITY_STYLE: Record<Priority, string> = {
  low: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  high: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
}

const STATUS_STYLE: Record<ProjectStatus, string> = {
  active: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  completed: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  'on-hold': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  upcoming: 'bg-violet-500/20 text-violet-400 border border-violet-500/30',
}

const initialProjects: Project[] = [
  { id: 'p1', title: 'Website Redesign', client: 'Apex Solutions Ltd', budget: 85000, spent: 42000, progress: 65, status: 'active', priority: 'high', startDate: 'Mar 1, 2026', endDate: 'Jun 30, 2026', freelancers: 4, description: 'Full website redesign and rebrand. Currently in design phase.' },
  { id: 'p2', title: 'Mobile App Development', client: 'Spark Retail', budget: 120000, spent: 54000, progress: 45, status: 'active', priority: 'high', startDate: 'Feb 15, 2026', endDate: 'Aug 15, 2026', freelancers: 5, description: 'iOS and Android app for loyalty and payments.' },
  { id: 'p3', title: 'Brand Identity Refresh', client: 'Meridian Consulting', budget: 28000, spent: 8400, progress: 30, status: 'active', priority: 'medium', startDate: 'Mar 10, 2026', endDate: 'May 10, 2026', freelancers: 2, description: 'New logo, visual identity and brand guidelines.' },
  { id: 'p4', title: 'Data Platform Migration', client: 'CoreTech Systems', budget: 60000, spent: 59000, progress: 98, status: 'completed', priority: 'high', startDate: 'Jan 5, 2026', endDate: 'Mar 20, 2026', freelancers: 3, description: 'Migrated legacy data warehouse to cloud-native stack.' },
  { id: 'p5', title: 'Marketing Automation', client: 'GrowthBase Inc', budget: 35000, spent: 29800, progress: 85, status: 'active', priority: 'medium', startDate: 'Feb 1, 2026', endDate: 'Apr 30, 2026', freelancers: 2, description: 'HubSpot implementation and email automation setup.' },
  { id: 'p6', title: 'UX Research Study', client: 'Finova Bank', budget: 22000, spent: 0, progress: 0, status: 'upcoming', priority: 'low', startDate: 'Apr 14, 2026', endDate: 'Jun 14, 2026', freelancers: 2, description: 'User interviews and usability testing for new onboarding flow.' },
]

const STATUS_OPTIONS: ProjectStatus[] = ['active', 'completed', 'on-hold', 'upcoming']

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [selected, setSelected] = useState<Project | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newP, setNewP] = useState({ title: '', client: '', budget: '', description: '', startDate: '', endDate: '' })

  const filtered = projects.filter(p => {
    const matchStatus = statusFilter === 'All' || p.status === statusFilter
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const addProject = () => {
    if (!newP.title || !newP.client) return
    const project: Project = {
      id: 'p' + Date.now(), title: newP.title, client: newP.client,
      budget: parseInt(newP.budget) || 0, spent: 0, progress: 0, status: 'upcoming',
      priority: 'medium', startDate: newP.startDate, endDate: newP.endDate,
      freelancers: 0, description: newP.description
    }
    setProjects(prev => [...prev, project])
    setNewP({ title: '', client: '', budget: '', description: '', startDate: '', endDate: '' })
    setShowAdd(false)
  }

  const remove = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id))
    setSelected(null)
  }

  return (
    <div className="flex min-h-screen bg-[#04080F]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopHeader />
        <main className="flex-1 p-6 overflow-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Projects</h1>
              <p className="text-sm text-white/40 mt-1">{filtered.length} of {projects.length} projects</p>
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" /> New Project
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search projects or clients..."
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 pr-8 text-sm focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-[#04080F]">All Statuses</option>
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s} className="bg-[#04080F]">{s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>
          </div>

          {/* Project cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(p => (
              <div
                key={p.id}
                onClick={() => setSelected(p)}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 cursor-pointer hover:border-amber-400/30 hover:bg-white/[0.07] transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLE[p.status]}`}>
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1).replace('-', ' ')}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_STYLE[p.priority]}`}>
                    {p.priority}
                  </span>
                </div>
                <h3 className="text-white font-semibold text-sm mb-0.5">{p.title}</h3>
                <p className="text-white/40 text-xs mb-4">{p.client}</p>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-white/30 mb-1">
                    <span>Progress</span><span>{p.progress}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${p.progress > 90 ? 'bg-rose-400' : p.progress > 60 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1 text-white/40 text-xs">
                    <Users className="w-3.5 h-3.5" /> {p.freelancers} freelancers
                  </div>
                  <div className="text-xs text-white/40">
                    £{p.spent.toLocaleString()} <span className="text-white/20">/ £{p.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-white/30 text-sm">No projects match your search.</p>
            </div>
          )}
        </main>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-end" onClick={() => setSelected(null)}>
          <div
            className="w-full max-w-sm bg-[#0D1117] border border-white/10 rounded-2xl m-4 p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold">{selected.title}</h2>
              <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-white/40 text-sm mb-4">{selected.client}</p>
            {selected.description && <p className="text-white/50 text-sm mb-5">{selected.description}</p>}

            <div className="space-y-2 mb-5 text-sm">
              <div className="flex justify-between">
                <span className="text-white/30">Status</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLE[selected.status]}`}>
                  {selected.status.charAt(0).toUpperCase() + selected.status.slice(1).replace('-', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/30">Priority</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_STYLE[selected.priority]}`}>{selected.priority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/30">Budget</span>
                <span className="text-white">£{selected.budget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/30">Spent</span>
                <span className="text-amber-400">£{selected.spent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-white/30">Timeline</span>
                <span className="text-white/60 text-xs">{selected.startDate} → {selected.endDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/30">Freelancers</span>
                <span className="text-white">{selected.freelancers}</span>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-5">
              <div className="flex justify-between text-xs text-white/30 mb-1">
                <span>Progress</span><span>{selected.progress}%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${selected.progress > 90 ? 'bg-rose-400' : selected.progress > 60 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                  style={{ width: `${selected.progress}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-black text-sm font-semibold py-2.5 rounded-xl transition-colors">
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button onClick={() => remove(selected.id)} className="px-3 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-xl transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add project modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowAdd(false)}>
          <div
            className="w-full max-w-md bg-[#0D1117] border border-white/10 rounded-2xl p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold text-lg">New Project</h2>
              <button onClick={() => setShowAdd(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              {[
                { key: 'title', placeholder: 'Project title *' },
                { key: 'client', placeholder: 'Client name *' },
                { key: 'budget', placeholder: 'Budget (£)' },
                { key: 'description', placeholder: 'Description' },
                { key: 'startDate', placeholder: 'Start date (e.g. Apr 1, 2026)' },
                { key: 'endDate', placeholder: 'End date' },
              ].map(({ key, placeholder }) => (
                <input
                  key={key}
                  value={newP[key as keyof typeof newP]}
                  onChange={e => setNewP(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                />
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 bg-white/5 border border-white/10 text-white/60 py-2.5 rounded-xl text-sm hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={addProject} className="flex-1 bg-amber-400 hover:bg-amber-300 text-black font-semibold py-2.5 rounded-xl text-sm transition-colors">Create Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
