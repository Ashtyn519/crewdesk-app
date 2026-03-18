'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Search, Star, Users, Mail, Phone, MapPin, MoreHorizontal, Briefcase, DollarSign, Camera, Mic, Clapperboard, Lightbulb, Film } from 'lucide-react'
import clsx from 'clsx'

interface CrewMember {
  id: string
  name: string
  role: string
  department: string
  email: string
  phone: string
  location: string
  day_rate: number
  rating: number
  status: 'available' | 'booked' | 'unavailable'
  bio: string
  avatar_url: string
  created_at: string
}

const deptIcons: Record<string, React.ElementType> = {
  Camera: Camera,
  Sound: Mic,
  Directing: Clapperboard,
  Lighting: Lightbulb,
  Production: Film,
}

const statusConfig = {
  available: { label: 'Available', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', dot: 'bg-emerald-400' },
  booked: { label: 'Booked', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', dot: 'bg-blue-400' },
  unavailable: { label: 'Unavailable', color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/20', dot: 'bg-slate-400' },
}

const DEPARTMENTS = ['All', 'Camera', 'Sound', 'Directing', 'Lighting', 'Production', 'Art', 'Costume', 'Makeup', 'Post']

const defaultForm = {
  name: '', role: '', department: 'Camera', email: '', phone: '', location: '',
  day_rate: 0, rating: 5, status: 'available' as CrewMember['status'], bio: '',
}

export const dynamic = 'force-dynamic'

function StarRating({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} className={clsx('w-3.5 h-3.5 transition-colors', s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600')} onClick={() => onChange?.(s)} style={onChange ? { cursor: 'pointer' } : {}} />
      ))}
    </div>
  )
}

function AvatarInitials({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500', 'bg-teal-500']
  const color = colors[name.charCodeAt(0) % colors.length]
  const sizeClass = size === 'sm' ? 'w-8 h-8 text-xs' : size === 'lg' ? 'w-14 h-14 text-lg' : 'w-11 h-11 text-sm'
  return <div className={clsx('rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0', color, sizeClass)}>{initials || '?'}</div>
}

export default function CrewPage() {
  const supabase = createClient()
  const [crew, setCrew] = useState<CrewMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<CrewMember | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [search, setSearch] = useState('')
  const [dept, setDept] = useState('All')
  const [menuOpen, setMenuOpen] = useState<string | null>(null)

  useEffect(() => { fetchCrew() }, [])

  async function fetchCrew() {
    setLoading(true)
    const { data } = await supabase.from('crew_members').select('*').order('name')
    setCrew(data || [])
    setLoading(false)
  }

  function openNew() { setEditing(null); setForm(defaultForm); setShowForm(true) }
  function openEdit(m: CrewMember) {
    setEditing(m)
    setForm({ name: m.name, role: m.role, department: m.department, email: m.email || '', phone: m.phone || '', location: m.location || '', day_rate: m.day_rate || 0, rating: m.rating || 5, status: m.status as CrewMember['status'], bio: m.bio || '' })
    setShowForm(true); setMenuOpen(null)
  }

  async function saveCrew() {
    if (!form.name.trim()) return
    if (editing) { await supabase.from('crew_members').update(form).eq('id', editing.id) }
    else { await supabase.from('crew_members').insert([form]) }
    setShowForm(false); fetchCrew()
  }

  async function deleteCrew(id: string) {
    await supabase.from('crew_members').delete().eq('id', id)
    setMenuOpen(null); fetchCrew()
  }

  const filtered = crew.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase())
    const matchDept = dept === 'All' || m.department === dept
    return matchSearch && matchDept
  })

  const stats = {
    total: crew.length,
    available: crew.filter(m => m.status === 'available').length,
    avgRate: crew.length > 0 ? Math.round(crew.reduce((s, m) => s + (m.day_rate || 0), 0) / crew.length) : 0,
    avgRating: crew.length > 0 ? (crew.reduce((s, m) => s + (m.rating || 0), 0) / crew.length).toFixed(1) : '0',
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Crew</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your freelance crew, rates and availability</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-amber-500/20">
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Crew', value: stats.total, icon: Users, color: 'blue' },
          { label: 'Available Now', value: stats.available, icon: Briefcase, color: 'emerald' },
          { label: 'Avg Day Rate', value: stats.avgRate > 0 ? `£${stats.avgRate}` : '—', icon: DollarSign, color: 'amber' },
          { label: 'Avg Rating', value: stats.avgRating !== '0' ? `${stats.avgRating}/5` : '—', icon: Star, color: 'purple' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#0A1020] border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 transition-colors">
            <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center mb-3', {
              'bg-blue-500/10': stat.color === 'blue',
              'bg-emerald-500/10': stat.color === 'emerald',
              'bg-amber-500/10': stat.color === 'amber',
              'bg-purple-500/10': stat.color === 'purple',
            })}>
              <stat.icon style={{ width: '1.125rem', height: '1.125rem' }} className={clsx({
                'text-blue-400': stat.color === 'blue',
                'text-emerald-400': stat.color === 'emerald',
                'text-amber-400': stat.color === 'amber',
                'text-purple-400': stat.color === 'purple',
              })} />
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search crew..." className="w-full bg-[#0A1020] border border-white/[0.06] text-white text-sm pl-9 pr-4 py-2.5 rounded-xl placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {DEPARTMENTS.map(d => (
            <button key={d} onClick={() => setDept(d)} className={clsx('px-3 py-2 rounded-xl text-xs font-medium transition-colors', dept === d ? 'bg-amber-500 text-black' : 'bg-[#0A1020] border border-white/[0.06] text-slate-400 hover:text-white hover:border-white/10')}>{d}</button>
          ))}
        </div>
      </div>

      {/* Crew Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#0A1020] border border-white/[0.06] rounded-2xl p-6 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/5 rounded w-2/3" />
                  <div className="h-3 bg-white/5 rounded w-1/3" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-white/5 rounded w-full" />
                <div className="h-3 bg-white/5 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-[#0A1020] border border-white/[0.06] rounded-2xl flex items-center justify-center mb-4">
            <Users className="w-7 h-7 text-slate-600" />
          </div>
          <h3 className="text-white font-medium mb-1">{search || dept !== 'All' ? 'No crew found' : 'No crew yet'}</h3>
          <p className="text-slate-500 text-sm mb-6">{search || dept !== 'All' ? 'Try adjusting your filters' : 'Add your first crew member to get started'}</p>
          {!search && dept === 'All' && (
            <button onClick={openNew} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
              <Plus className="w-4 h-4" />
              Add Crew Member
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((member) => {
            const cfg = statusConfig[member.status] || statusConfig.available
            const DeptIcon = deptIcons[member.department] || Briefcase
            return (
              <div key={member.id} className="group bg-[#0A1020] border border-white/[0.06] hover:border-white/10 rounded-2xl p-6 transition-all hover:shadow-xl hover:shadow-black/20 relative">
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <AvatarInitials name={member.name} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm truncate">{member.name}</h3>
                    <p className="text-slate-400 text-xs truncate">{member.role}</p>
                    <div className="mt-1.5">
                      <StarRating rating={member.rating || 0} />
                    </div>
                  </div>
                  <div className="relative ml-1">
                    <button onClick={() => setMenuOpen(menuOpen === member.id ? null : member.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                    {menuOpen === member.id && (
                      <div className="absolute right-0 top-8 bg-[#0C1428] border border-white/10 rounded-xl shadow-2xl py-1 z-10 min-w-[120px]">
                        <button onClick={() => openEdit(member)} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 w-full text-left transition-colors">Edit</button>
                        <button onClick={() => deleteCrew(member.id)} className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 w-full text-left transition-colors">Remove</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="inline-flex items-center gap-1 bg-white/5 border border-white/[0.06] text-slate-400 text-xs px-2 py-0.5 rounded-md">
                    <DeptIcon style={{ width: '0.75rem', height: '0.75rem' }} />
                    {member.department}
                  </span>
                  <span className={clsx('inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md border', cfg.bg, cfg.color, cfg.border)}>
                    <span className={clsx('w-1.5 h-1.5 rounded-full', cfg.dot)} />
                    {cfg.label}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-slate-500">
                  {member.email && <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 flex-shrink-0" /><span className="truncate">{member.email}</span></div>}
                  {member.location && <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 flex-shrink-0" /><span className="truncate">{member.location}</span></div>}
                </div>

                {/* Footer */}
                {member.day_rate > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/[0.04] flex items-center justify-between">
                    <span className="text-slate-500 text-xs">Day rate</span>
                    <span className="text-white font-semibold text-sm">£{member.day_rate.toLocaleString()}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="bg-[#0A1020] border border-white/[0.08] rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-white/[0.06]">
              <h2 className="text-white font-semibold text-lg">{editing ? 'Edit Crew Member' : 'Add Crew Member'}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white transition-colors text-xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">Full Name *</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Sarah Johnson" className="w-full bg-[#060C18] border border-white/[0.06] text-white text-sm px-3 py-2.5 rounded-xl placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">Job Title</label>
                  <input value={form.role} onChange={e => setForm({...form, role: e.target.value})} placeholder="e.g. Director of Photography" className="w-full bg-[#060C18] border border-white/[0.06] text-white text-sm px-3 py-2.5 rounded-xl placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">Department</label>
                  <select value={form.department} onChange={e => setForm({...form, department: e.target.value})} className="w-full bg-[#060C18] border border-white/[0.06] text-white text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:border-amber-500/50 transition-colors">
                    {DEPARTMENTS.filter(d => d !== 'All').map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="email@example.com" className="w-full bg-[#060C18] border border-white/[0.06] text-white text-sm px-3 py-2.5 rounded-xl placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">Phone</label>
                  <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+44 7700 900000" className="w-full bg-[#060C18] border border-white/[0.06] text-white text-sm px-3 py-2.5 rounded-xl placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">Location</label>
                  <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="e.g. London, UK" className="w-full bg-[#060C18] border border-white/[0.06] text-white text-sm px-3 py-2.5 rounded-xl placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">Day Rate (£)</label>
                  <input type="number" value={form.day_rate} onChange={e => setForm({...form, day_rate: Number(e.target.value)})} placeholder="0" className="w-full bg-[#060C18] border border-white/[0.06] text-white text-sm px-3 py-2.5 rounded-xl placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value as CrewMember['status']})} className="w-full bg-[#060C18] border border-white/[0.06] text-white text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:border-amber-500/50 transition-colors">
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">Rating (1–5)</label>
                  <div className="flex items-center gap-3 mt-1">
                    <StarRating rating={form.rating} onChange={r => setForm({...form, rating: r})} />
                    <span className="text-slate-400 text-xs">{form.rating}/5</span>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">Bio</label>
                  <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} rows={3} placeholder="Short bio or notes..." className="w-full bg-[#060C18] border border-white/[0.06] text-white text-sm px-3 py-2.5 rounded-xl placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors resize-none" />
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 bg-white/5 hover:bg-white/8 text-slate-300 text-sm font-medium py-2.5 rounded-xl transition-colors">Cancel</button>
              <button onClick={saveCrew} className="flex-1 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold py-2.5 rounded-xl transition-colors">
                {editing ? 'Save Changes' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
