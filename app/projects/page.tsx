'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Plus, Edit2, Trash2, FolderOpen, Search } from 'lucide-react'

export const dynamic = "force-dynamic";


type Project = {
  id: string; name: string; client: string; status: string;
  budget: number; spent: number; start_date: string; end_date: string;
  description: string; priority: string; created_at: string;
}

const EMPTY: Omit<Project,'id'|'created_at'> = { name:'', client:'', status:'active', budget:0, spent:0, start_date:'', end_date:'', description:'', priority:'medium' }
const STATUS_COLORS: Record<string,string> = { active:'bg-emerald-400/10 text-emerald-400', completed:'bg-cyan-400/10 text-cyan-400', 'on-hold':'bg-amber-400/10 text-amber-400', cancelled:'bg-red-400/10 text-red-400' }
const PRIORITY_COLORS: Record<string,string> = { low:'bg-slate-700 text-slate-400', medium:'bg-amber-400/10 text-amber-400', high:'bg-red-400/10 text-red-400' }

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Project|null>(null)
  const [form, setForm] = useState<Omit<Project,'id'|'created_at'>>(EMPTY)
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.from('projects').select('*').eq('user_id', user?.id).order('created_at', { ascending: false })
    setProjects(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowModal(true) }
  const openEdit = (p: Project) => { setEditing(p); setForm({ name:p.name, client:p.client, status:p.status, budget:p.budget, spent:p.spent, start_date:p.start_date||'', end_date:p.end_date||'', description:p.description||'', priority:p.priority }); setShowModal(true) }

  const handleSave = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (editing) {
      await supabase.from('projects').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editing.id)
    } else {
      await supabase.from('projects').insert({ ...form, user_id: user?.id })
    }
    await load()
    setShowModal(false)
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return
    await supabase.from('projects').delete().eq('id', id)
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  const filtered = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.client?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-white">Projects</h1>
          <p className="text-slate-400 mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-bold px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={18} /> New Project
        </button>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-3.5 text-slate-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..."
          className="w-full bg-[#0F1A2E] border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
      </div>

      {loading ? <div className="text-slate-400">Loading...</div> : filtered.length === 0 ? (
        <div className="text-center py-20">
          <FolderOpen size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No projects found</p>
          <button onClick={openCreate} className="mt-4 text-amber-400 hover:text-amber-300">Create your first project</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-[#0F1A2E] rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold truncate">{p.name}</h3>
                  <p className="text-slate-500 text-sm">{p.client || 'No client'}</p>
                </div>
                <div className="flex gap-2 ml-2">
                  <button onClick={() => openEdit(p)} className="text-slate-500 hover:text-white transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(p.id)} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[p.status] || 'bg-slate-700 text-slate-400'}`}>{p.status}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${PRIORITY_COLORS[p.priority] || 'bg-slate-700 text-slate-400'}`}>{p.priority}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Budget</span>
                  <span className="text-white">{formatCurrency(p.budget)}</span>
                </div>
                {p.budget > 0 && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Spent {formatCurrency(p.spent)}</span>
                      <span className={p.spent > p.budget ? 'text-red-400' : 'text-slate-500'}>{p.budget > 0 ? Math.round((p.spent/p.budget)*100) : 0}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full transition-all ${p.spent > p.budget ? 'bg-red-400' : 'bg-amber-400'}`} style={{ width: `${Math.min(100, p.budget > 0 ? (p.spent/p.budget)*100 : 0)}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0F1A2E] rounded-2xl p-6 w-full max-w-md border border-slate-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-5">{editing ? 'Edit Project' : 'New Project'}</h2>
            <div className="space-y-4">
              {[['name','Project Name','text',true],['client','Client Name','text',false],['description','Description','text',false]].map(([k,label,type,required]) => (
                <div key={k as string}>
                  <label className="text-slate-300 text-sm block mb-1.5">{label as string}</label>
                  <input type={type as string} value={(form as any)[k as string]} onChange={e => setForm(f => ({...f, [k as string]: e.target.value}))} required={required as boolean}
                    className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 text-sm block mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}
                    className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400/50">
                    {['active','completed','on-hold','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 text-sm block mb-1.5">Priority</label>
                  <select value={form.priority} onChange={e => setForm(f => ({...f, priority: e.target.value}))}
                    className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400/50">
                    {['low','medium','high'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 text-sm block mb-1.5">Budget (£)</label>
                  <input type="number" value={form.budget} onChange={e => setForm(f => ({...f, budget: parseFloat(e.target.value)||0}))}
                    className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400/50" />
                </div>
                <div>
                  <label className="text-slate-300 text-sm block mb-1.5">Spent (£)</label>
                  <input type="number" value={form.spent} onChange={e => setForm(f => ({...f, spent: parseFloat(e.target.value)||0}))}
                    className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[['start_date','Start Date'],['end_date','End Date']].map(([k,label]) => (
                  <div key={k}>
                    <label className="text-slate-300 text-sm block mb-1.5">{label}</label>
                    <input type="date" value={(form as any)[k]} onChange={e => setForm(f => ({...f, [k]: e.target.value}))}
                      className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400/50" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name} className="flex-1 bg-amber-400 hover:bg-amber-300 text-black font-bold py-2.5 rounded-xl transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
