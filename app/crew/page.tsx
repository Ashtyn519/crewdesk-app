'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import { Plus, Star, Search, Trash2, Edit2, Users, Mail } from 'lucide-react'

export const dynamic = "force-dynamic";


type CrewMember = {
  id: string; name: string; email: string; role: string; department: string;
  day_rate: number; rating: number; availability: string; bio: string; invite_status: string; created_at: string;
}
const EMPTY = { name:'', email:'', role:'', department:'', day_rate:0, rating:5, availability:'available', bio:'' }
const AVAIL_COLORS: Record<string,string> = { available:'bg-emerald-400/10 text-emerald-400', busy:'bg-amber-400/10 text-amber-400', unavailable:'bg-red-400/10 text-red-400' }

export default function CrewPage() {
  const [crew, setCrew] = useState<CrewMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<CrewMember|null>(null)
  const [form, setForm] = useState<any>(EMPTY)
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [deptFilter, setDeptFilter] = useState('all')
  const supabase = createClient()

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.from('crew_members').select('*').eq('user_id', user?.id).order('name')
    setCrew(data || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowModal(true) }
  const openEdit = (m: CrewMember) => { setEditing(m); setForm({ name:m.name, email:m.email, role:m.role, department:m.department, day_rate:m.day_rate, rating:m.rating, availability:m.availability, bio:m.bio||'' }); setShowModal(true) }

  const handleSave = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (editing) {
      await supabase.from('crew_members').update(form).eq('id', editing.id)
    } else {
      await supabase.from('crew_members').insert({ ...form, user_id: user?.id, invite_status: form.email ? 'pending' : 'accepted' })
    }
    await load()
    setShowModal(false)
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove crew member?')) return
    await supabase.from('crew_members').delete().eq('id', id)
    setCrew(prev => prev.filter(m => m.id !== id))
  }

  const setRating = async (id: string, rating: number) => {
    await supabase.from('crew_members').update({ rating }).eq('id', id)
    setCrew(prev => prev.map(m => m.id === id ? { ...m, rating } : m))
  }

  const departments = ['all', ...Array.from(new Set(crew.map(m => m.department).filter(Boolean)))]
  const filtered = crew.filter(m =>
    (deptFilter === 'all' || m.department === deptFilter) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) || m.role?.toLowerCase().includes(search.toLowerCase()) || m.email?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-white">Crew</h1>
          <p className="text-slate-400 mt-1">{crew.length} member{crew.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-bold px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={18} /> Add Crew
        </button>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-4 top-3.5 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search crew..."
            className="w-full bg-[#0F1A2E] border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
        </div>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
          className="bg-[#0F1A2E] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400/50">
          {departments.map(d => <option key={d} value={d}>{d === 'all' ? 'All Departments' : d}</option>)}
        </select>
      </div>

      {loading ? <div className="text-slate-400">Loading...</div> : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Users size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No crew members found</p>
          <button onClick={openCreate} className="mt-4 text-amber-400 hover:text-amber-300">Add your first crew member</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(m => (
            <div key={m.id} className="bg-[#0F1A2E] rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400/30 to-purple-400/30 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-white font-bold">{m.name}</div>
                    <div className="text-slate-500 text-xs">{m.role || 'No role'} {m.department && `· ${m.department}`}</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(m)} className="text-slate-500 hover:text-white transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(m.id)} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs px-2 py-1 rounded-full ${AVAIL_COLORS[m.availability] || 'bg-slate-700 text-slate-400'}`}>{m.availability}</span>
                <span className="text-amber-400 font-bold text-sm">{formatCurrency(m.day_rate)}<span className="text-slate-500 font-normal">/day</span></span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[1,2,3,4,5].map(star => (
                  <button key={star} onClick={() => setRating(m.id, star)}
                    className={`transition-colors ${star <= m.rating ? 'text-amber-400' : 'text-slate-700'}`}>
                    <Star size={14} fill={star <= m.rating ? 'currentColor' : 'none'} />
                  </button>
                ))}
                <span className="text-slate-500 text-xs ml-1">{m.rating}/5</span>
              </div>
              {m.email && (
                <a href={`mailto:${m.email}`} className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 text-xs transition-colors mt-2">
                  <Mail size={12} />{m.email}
                </a>
              )}
              {m.invite_status === 'pending' && m.email && (
                <div className="mt-2 text-xs text-amber-400 bg-amber-400/10 rounded-lg px-2 py-1">Invite pending</div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0F1A2E] rounded-2xl p-6 w-full max-w-md border border-slate-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-5">{editing ? 'Edit Crew Member' : 'Add Crew Member'}</h2>
            <div className="space-y-4">
              {[['name','Full Name'],['email','Email (optional — sends invite)'],['role','Role / Job Title'],['department','Department']].map(([k,label]) => (
                <div key={k}>
                  <label className="text-slate-300 text-sm block mb-1.5">{label}</label>
                  <input type={k === 'email' ? 'email' : 'text'} value={form[k]} onChange={e => setForm((f: any) => ({...f, [k]: e.target.value}))}
                    className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400/50" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 text-sm block mb-1.5">Availability</label>
                  <select value={form.availability} onChange={e => setForm((f: any) => ({...f, availability: e.target.value}))}
                    className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none">
                    {['available','busy','unavailable'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 text-sm block mb-1.5">Day Rate (£)</label>
                  <input type="number" value={form.day_rate} onChange={e => setForm((f: any) => ({...f, day_rate: parseFloat(e.target.value)||0}))}
                    className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400/50" />
                </div>
              </div>
              <div>
                <label className="text-slate-300 text-sm block mb-1.5">Rating (1–5)</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(star => (
                    <button key={star} type="button" onClick={() => setForm((f: any) => ({...f, rating: star}))}
                      className={`transition-colors ${star <= form.rating ? 'text-amber-400' : 'text-slate-700'}`}>
                      <Star size={20} fill={star <= form.rating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-slate-300 text-sm block mb-1.5">Bio / Notes</label>
                <textarea value={form.bio} onChange={e => setForm((f: any) => ({...f, bio: e.target.value}))} rows={2}
                  className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400/50" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name} className="flex-1 bg-amber-400 hover:bg-amber-300 text-black font-bold py-2.5 rounded-xl transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
