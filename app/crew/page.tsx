'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useCallback } from 'react'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'
import { createClient } from '@/lib/supabase/client'
import { Plus, Search, X, Star, Mail, Phone, Trash2, Edit2, ChevronDown, Loader2, Users } from 'lucide-react'

type Status = 'available' | 'on-project' | 'unavailable'

type CrewMember = {
    id: string
    workspace_id: string
    name: string
    role: string
    department: string
    email: string
    phone: string
    rate: number
    rating: number
    status: Status
    skills: string[]
    bio: string
}

const STATUS_STYLE: Record<Status, string> = {
    available: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    'on-project': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    unavailable: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
}

const DEPARTMENTS = ['All', 'Design', 'Engineering', 'Marketing', 'Operations', 'Analytics', 'Other']

const EMPTY_FORM = { name: '', role: '', department: '', email: '', phone: '', rate: '', skills: '', bio: '', status: 'available' as Status }

export default function FreelancersPage() {
    const [crew, setCrew] = useState<CrewMember[]>([])
    const [loading, setLoading] = useState(true)
    const [workspaceId, setWorkspaceId] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [dept, setDept] = useState('All')
    const [selected, setSelected] = useState<CrewMember | null>(null)
    const [showAdd, setShowAdd] = useState(false)
    const [saving, setSaving] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [formData, setFormData] = useState(EMPTY_FORM)
    const [editTarget, setEditTarget] = useState<CrewMember | null>(null)

  const loadCrew = useCallback(async () => {
        const sb = createClient()
        const { data: { user } } = await sb.auth.getUser()
        if (!user) return

                                   const { data: ws } = await sb.from('workspaces').select('id').eq('user_id', user.id).single()
        if (!ws) { setLoading(false); return }

                                   setWorkspaceId(ws.id)

                                   const { data: members } = await sb
          .from('crew_members')
          .select('*')
          .eq('workspace_id', ws.id)
          .order('name')

                                   setCrew(members || [])
        setLoading(false)
  }, [])

  useEffect(() => { loadCrew() }, [loadCrew])

  const filtered = crew.filter(f => {
        const matchDept = dept === 'All' || f.department === dept
        const matchSearch =
                f.name.toLowerCase().includes(search.toLowerCase()) ||
                f.role.toLowerCase().includes(search.toLowerCase()) ||
                (f.skills || []).some(s => s.toLowerCase().includes(search.toLowerCase()))
        return matchDept && matchSearch
  })

  async function addCrewMember() {
        if (!formData.name || !formData.role || !workspaceId) return
        setSaving(true)
        const sb = createClient()
        const { data, error } = await sb.from('crew_members').insert({
                workspace_id: workspaceId,
                name: formData.name,
                role: formData.role,
                department: formData.department || 'Other',
                email: formData.email,
                phone: formData.phone,
                rate: parseInt(formData.rate) || 0,
                rating: 5.0,
                status: formData.status,
                skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
                bio: formData.bio,
        }).select().single()

      if (!error && data) {
              setCrew(prev => [...prev, data])
      }
        setSaving(false)
        setShowAdd(false)
        setFormData(EMPTY_FORM)
  }

  async function saveEdit() {
        if (!editTarget) return
        setSaving(true)
        const sb = createClient()
        const { data, error } = await sb.from('crew_members').update({
                name: formData.name,
                role: formData.role,
                department: formData.department || 'Other',
                email: formData.email,
                phone: formData.phone,
                rate: parseInt(formData.rate) || 0,
                status: formData.status,
                skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
                bio: formData.bio,
        }).eq('id', editTarget.id).select().single()

      if (!error && data) {
              setCrew(prev => prev.map(m => m.id === data.id ? data : m))
              setSelected(data)
      }
        setSaving(false)
        setEditMode(false)
        setEditTarget(null)
        setFormData(EMPTY_FORM)
  }

  async function removeMember(id: string) {
        const sb = createClient()
        await sb.from('crew_members').delete().eq('id', id)
        setCrew(prev => prev.filter(m => m.id !== id))
        if (selected?.id === id) setSelected(null)
  }

  function openEdit(member: CrewMember) {
        setEditTarget(member)
        setFormData({
                name: member.name,
                role: member.role,
                department: member.department,
                email: member.email || '',
                phone: member.phone || '',
                rate: String(member.rate || ''),
                skills: (member.skills || []).join(', '),
                bio: member.bio || '',
                status: member.status,
        })
        setEditMode(true)
  }

  const FormField = ({ field, placeholder, type = 'text' }: { field: keyof typeof formData; placeholder: string; type?: string }) => (
        <input
                type={type}
                value={formData[field] as string}
                onChange={e => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30"
              />
      )

  return (
        <div className="flex min-h-screen bg-[#04080F]">
              <Sidebar />
              <div className="flex-1 flex flex-col min-w-0">
                      <TopHeader />
                      <main className="flex-1 p-6 overflow-auto">
                        {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                            <div>
                                                          <h1 className="text-2xl font-bold text-white">Freelancers</h1>h1>
                                                          <p className="text-sm text-white/40 mt-1">
                                                            {loading ? 'Loading…' : `${filtered.length} of ${crew.length} freelancers`}
                                                          </p>p>
                                            </div>div>
                                            <button
                                                            onClick={() => { setFormData(EMPTY_FORM); setShowAdd(true) }}
                                                            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                                                          >
                                                          <Plus className="w-4 h-4" /> Add Freelancer
                                            </button>button>
                                </div>div>
                      
                        {/* Filters */}
                                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                                            <div className="relative flex-1">
                                                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                                          <input
                                                                            value={search}
                                                                            onChange={e => setSearch(e.target.value)}
                                                                            placeholder="Search by name, role or skill..."
                                                                            className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                                                                          />
                                            </div>div>
                                            <div className="relative">
                                                          <select
                                                                            value={dept}
                                                                            onChange={e => setDept(e.target.value)}
                                                                            className="appearance-none bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 pr-8 text-sm focus:outline-none cursor-pointer"
                                                                          >
                                                            {DEPARTMENTS.map(d => <option key={d} value={d} className="bg-[#04080F]">{d}</option>option>)}
                                                          </select>select>
                                                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                                            </div>div>
                                </div>div>
                      
                        {/* Loading state */}
                        {loading && (
                      <div className="flex items-center justify-center py-20">
                                    <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                      </div>div>
                                )}
                      
                        {/* Empty state */}
                        {!loading && crew.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                                                    <Users className="w-8 h-8 text-white/20" />
                                    </div>div>
                                    <h3 className="text-white font-semibold mb-1">No freelancers yet</h3>h3>
                                    <p className="text-white/30 text-sm mb-6 max-w-xs">Add your first freelancer to start building your crew roster.</p>p>
                                    <button
                                                      onClick={() => { setFormData(EMPTY_FORM); setShowAdd(true) }}
                                                      className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                                                    >
                                                    <Plus className="w-4 h-4" /> Add your first freelancer
                                    </button>button>
                      </div>div>
                                )}
                      
                        {/* No search results */}
                        {!loading && crew.length > 0 && filtered.length === 0 && (
                      <div className="text-center py-16">
                                    <p className="text-white/30 text-sm">No freelancers match your search.</p>p>
                      </div>div>
                                )}
                      
                        {/* Grid */}
                        {!loading && filtered.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map(f => (
                                        <div
                                                            key={f.id}
                                                            onClick={() => setSelected(f)}
                                                            className="bg-white/5 border border-white/10 rounded-2xl p-5 cursor-pointer hover:border-amber-400/30 hover:bg-white/[0.07] transition-all group"
                                                          >
                                                          <div className="flex items-start justify-between mb-3">
                                                                              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400/20 to-violet-500/20 flex items-center justify-center text-lg font-bold text-white">
                                                                                {f.name.charAt(0)}
                                                                              </div>div>
                                                                              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLE[f.status]}`}>
                                                                                {f.status === 'on-project' ? 'On Project' : f.status.charAt(0).toUpperCase() + f.status.slice(1)}
                                                                              </span>span>
                                                          </div>div>
                                                          <h3 className="text-white font-semibold text-sm">{f.name}</h3>h3>
                                                          <p className="text-white/40 text-xs mt-0.5 mb-3">{f.role} · {f.department}</p>p>
                                                          <div className="flex flex-wrap gap-1.5 mb-3">
                                                            {(f.skills || []).slice(0, 3).map(s => (
                                                                                  <span key={s} className="bg-white/5 border border-white/10 text-white/60 text-xs px-2 py-0.5 rounded-full">{s}</span>span>
                                                                                ))}
                                                            {(f.skills || []).length > 3 && <span className="text-white/30 text-xs">+{f.skills.length - 3}</span>span>}
                                                          </div>div>
                                                          <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                                                              <div className="flex items-center gap-1">
                                                                                                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                                                                                    <span className="text-white/60 text-xs">{f.rating ?? '—'}</span>span>
                                                                              </div>div>
                                                                              <span className="text-amber-400 text-xs font-semibold">{f.rate ? `£${f.rate}/hr` : '—'}</span>span>
                                                          </div>div>
                                        </div>div>
                                      ))}
                      </div>div>
                                )}
                      </main>main>
              </div>div>
        
          {/* Detail Panel */}
          {selected && (
                  <div
                              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-end"
                              onClick={() => setSelected(null)}
                            >
                            <div
                                          className="w-full max-w-sm bg-[#0D1117] border border-white/10 rounded-2xl m-4 p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
                                          onClick={e => e.stopPropagation()}
                                        >
                                        <div className="flex items-center justify-between mb-5">
                                                      <h2 className="text-white font-bold text-lg">{selected.name}</h2>h2>
                                                      <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white">
                                                                      <X className="w-5 h-5" />
                                                      </button>button>
                                        </div>div>
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-violet-500/20 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                                          {selected.name.charAt(0)}
                                        </div>div>
                                        <p className="text-center text-white/60 text-sm mb-1">{selected.role}</p>p>
                                        <p className="text-center text-white/30 text-xs mb-4">{selected.department}</p>p>
                                        <span className={`block text-center text-xs px-3 py-1.5 rounded-full font-medium mb-5 ${STATUS_STYLE[selected.status]}`}>
                                          {selected.status === 'on-project' ? 'On Project' : selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                                        </span>span>
                              {selected.bio && <p className="text-white/50 text-sm mb-5 text-center">{selected.bio}</p>p>}
                                        <div className="space-y-2 mb-5">
                                          {selected.email && (
                                                          <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
                                                                            <Mail className="w-4 h-4 text-amber-400" />{selected.email}
                                                          </a>a>
                                                      )}
                                          {selected.phone && (
                                                          <a href={`tel:${selected.phone}`} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
                                                                            <Phone className="w-4 h-4 text-amber-400" />{selected.phone}
                                                          </a>a>
                                                      )}
                                        </div>div>
                                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl mb-5">
                                                      <div className="text-center">
                                                                      <p className="text-amber-400 font-bold">{selected.rate ? `£${selected.rate}/hr` : '—'}</p>p>
                                                                      <p className="text-white/30 text-xs">Rate</p>p>
                                                      </div>div>
                                                      <div className="text-center">
                                                                      <p className="text-white font-bold flex items-center gap-1">
                                                                                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />{selected.rating ?? '—'}
                                                                      </p>p>
                                                                      <p className="text-white/30 text-xs">Rating</p>p>
                                                      </div>div>
                                        </div>div>
                              {(selected.skills || []).length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 mb-6">
                                                          {selected.skills.map(s => (
                                                                            <span key={s} className="bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs px-2.5 py-1 rounded-full">{s}</span>span>
                                                                          ))}
                                                        </div>div>
                                        )}
                                        <div className="flex gap-2">
                                                      <button
                                                                        onClick={() => openEdit(selected)}
                                                                        className="flex-1 flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-black text-sm font-semibold py-2.5 rounded-xl transition-colors"
                                                                      >
                                                                      <Edit2 className="w-4 h-4" /> Edit
                                                      </button>button>
                                                      <button
                                                                        onClick={() => removeMember(selected.id)}
                                                                        className="px-3 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-xl transition-colors"
                                                                      >
                                                                      <Trash2 className="w-4 h-4" />
                                                      </button>button>
                                        </div>div>
                            </div>div>
                  </div>div>
              )}
        
          {/* Add / Edit Modal */}
          {(showAdd || editMode) && (
                  <div
                              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
                              onClick={() => { setShowAdd(false); setEditMode(false); setEditTarget(null) }}
                            >
                            <div
                                          className="w-full max-w-md bg-[#0D1117] border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
                                          onClick={e => e.stopPropagation()}
                                        >
                                        <div className="flex items-center justify-between mb-5">
                                                      <h2 className="text-white font-bold text-lg">{editMode ? 'Edit Freelancer' : 'Add Freelancer'}</h2>h2>
                                                      <button
                                                                        onClick={() => { setShowAdd(false); setEditMode(false); setEditTarget(null) }}
                                                                        className="text-white/40 hover:text-white"
                                                                      >
                                                                      <X className="w-5 h-5" />
                                                      </button>button>
                                        </div>div>
                                        <div className="space-y-3">
                                                      <FormField field="name" placeholder="Full name *" />
                                                      <FormField field="role" placeholder="Role / Title *" />
                                                      <div className="relative">
                                                                      <select
                                                                                          value={formData.department}
                                                                                          onChange={e => setFormData(prev => ({ ...prev, department: e.target.value }))}
                                                                                          className="w-full appearance-none bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 pr-8 text-sm focus:outline-none"
                                                                                        >
                                                                                        <option value="" className="bg-[#04080F]">Department</option>option>
                                                                        {DEPARTMENTS.filter(d => d !== 'All').map(d => (
                                                                                                              <option key={d} value={d} className="bg-[#04080F]">{d}</option>option>
                                                                                                            ))}
                                                                      </select>select>
                                                                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                                                      </div>div>
                                                      <div className="relative">
                                                                      <select
                                                                                          value={formData.status}
                                                                                          onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as Status }))}
                                                                                          className="w-full appearance-none bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 pr-8 text-sm focus:outline-none"
                                                                                        >
                                                                                        <option value="available" className="bg-[#04080F]">Available</option>option>
                                                                                        <option value="on-project" className="bg-[#04080F]">On Project</option>option>
                                                                                        <option value="unavailable" className="bg-[#04080F]">Unavailable</option>option>
                                                                      </select>select>
                                                                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                                                      </div>div>
                                                      <FormField field="email" placeholder="Email address" type="email" />
                                                      <FormField field="phone" placeholder="Phone number" />
                                                      <FormField field="rate" placeholder="Hourly rate (£)" type="number" />
                                                      <FormField field="skills" placeholder="Skills (comma separated)" />
                                                      <textarea
                                                                        value={formData.bio}
                                                                        onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                                                        placeholder="Short bio (optional)"
                                                                        rows={3}
                                                                        className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 resize-none"
                                                                      />
                                        </div>div>
                                        <div className="flex gap-3 mt-5">
                                                      <button
                                                                        onClick={() => { setShowAdd(false); setEditMode(false); setEditTarget(null) }}
                                                                        className="flex-1 bg-white/5 border border-white/10 text-white/60 py-2.5 rounded-xl text-sm hover:bg-white/10 transition-colors"
                                                                      >
                                                                      Cancel
                                                      </button>button>
                                                      <button
                                                                        onClick={editMode ? saveEdit : addCrewMember}
                                                                        disabled={saving || !formData.name || !formData.role}
                                                                        className="flex-1 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-semibold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                                                                      >
                                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editMode ? 'Save Changes' : 'Add Freelancer'}
                                                      </button>button>
                                        </div>div>
                            </div>div>
                  </div>div>
              )}
        </div>div>
      )
}</div>
