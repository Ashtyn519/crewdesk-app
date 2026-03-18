'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Star, Trash2, Edit2, X, Users, Mail, Phone, Award, Search } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface CrewMember {
  id: string
  name: string
  email: string
  phone: string
  role: string
  department: string
  day_rate: number
  rating: number
  status: 'available' | 'booked' | 'unavailable'
  notes: string
}

const defaultForm = {
  name: '',
  email: '',
  phone: '',
  role: '',
  department: '',
  day_rate: 0,
  rating: 5,
  status: 'available' as CrewMember['status'],
  notes: '',
}

const departments = ['Camera', 'Sound', 'Lighting', 'Art Department', 'Production', 'Post Production', 'Hair & Makeup', 'Costume', 'Other']

export default function CrewPage() {
  const supabase = createClient()
  const [crew, setCrew] = useState<CrewMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<CrewMember | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [search, setSearch] = useState('')
  const [filterDept, setFilterDept] = useState('all')

  const load = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('crew_members')
      .select('*')
      .eq('user_id', user.id)
      .order('name')
    setCrew(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNew = () => {
    setEditing(null)
    setForm(defaultForm)
    setShowModal(true)
  }

  const openEdit = (m: CrewMember) => {
    setEditing(m)
    setForm({
      name: m.name,
      email: m.email || '',
      phone: m.phone || '',
      role: m.role || '',
      department: m.department || '',
      day_rate: m.day_rate || 0,
      rating: m.rating || 5,
      status: m.status || 'available',
      notes: m.notes || '',
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const payload = { ...form, user_id: user.id, updated_at: new Date().toISOString() }
    if (editing) {
      await supabase.from('crew_members').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('crew_members').insert(payload)
    }
    await load()
    setShowModal(false)
    setSaving(false)
  }

  const deleteMember = async (id: string) => {
    if (!confirm('Remove this crew member?')) return
    await supabase.from('crew_members').delete().eq('id', id)
    await load()
  }

  const setRating = async (member: CrewMember, rating: number) => {
    await supabase.from('crew_members').update({ rating, updated_at: new Date().toISOString() }).eq('id', member.id)
    await load()
  }

  const statusColor = (status: string) => {
    if (status === 'available') return 'text-emerald-400 bg-emerald-400/10'
    if (status === 'booked') return 'text-amber-400 bg-amber-400/10'
    return 'text-red-400 bg-red-400/10'
  }

  const filtered = crew.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase())
    const matchDept = filterDept === 'all' || m.department === filterDept
    return matchSearch && matchDept
  })

  const available = crew.filter(m => m.status === 'available').length
  const booked = crew.filter(m => m.status === 'booked').length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Crew</h1>
          <p className="text-gray-400 text-sm mt-1">{crew.length} crew member{crew.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition-colors">
          <Plus className="w-4 h-4" /><span>Add Crew</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#0A1020] rounded-xl p-4 border border-white/5">
          <p className="text-gray-400 text-xs mb-1">Total Crew</p>
          <p className="text-2xl font-bold text-white">{crew.length}</p>
        </div>
        <div className="bg-[#0A1020] rounded-xl p-4 border border-white/5">
          <p className="text-gray-400 text-xs mb-1">Available</p>
          <p className="text-2xl font-bold text-emerald-400">{available}</p>
        </div>
        <div className="bg-[#0A1020] rounded-xl p-4 border border-white/5">
          <p className="text-gray-400 text-xs mb-1">Booked</p>
          <p className="text-2xl font-bold text-amber-400">{booked}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search crew..."
            className="w-full bg-[#0A1020] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50" />
        </div>
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
          className="bg-[#0A1020] border border-white/10 rounded-lg px-3 py-2 text-gray-300 text-sm focus:outline-none">
          <option value="all">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Crew Grid */}
      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading crew...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#0A1020] rounded-xl border border-white/5 p-12 text-center">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">{search || filterDept !== 'all' ? 'No crew matches your filters' : 'No crew members yet'}</p>
          {!search && filterDept === 'all' && (
            <button onClick={openNew} className="mt-4 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors text-sm">
              Add your first crew member
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(member => (
            <div key={member.id} className="bg-[#0A1020] rounded-xl border border-white/5 p-4 hover:border-white/10 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center border border-amber-400/20">
                    <span className="text-amber-400 font-bold text-sm">{member.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{member.name}</p>
                    <p className="text-gray-400 text-xs">{member.role || 'No role set'}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(member.status)}`}>
                  {member.status}
                </span>
              </div>

              {member.department && (
                <div className="flex items-center gap-1.5 mb-2">
                  <Award className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-gray-400 text-xs">{member.department}</span>
                </div>
              )}

              {member.email && (
                <div className="flex items-center gap-1.5 mb-1">
                  <Mail className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-gray-400 text-xs truncate">{member.email}</span>
                </div>
              )}

              {member.phone && (
                <div className="flex items-center gap-1.5 mb-2">
                  <Phone className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-gray-400 text-xs">{member.phone}</span>
                </div>
              )}

              {member.day_rate > 0 && (
                <div className="mb-3">
                  <span className="text-amber-400 font-semibold text-sm">£{member.day_rate.toLocaleString()}</span>
                  <span className="text-gray-500 text-xs"> /day</span>
                </div>
              )}

              {/* Star Rating */}
              <div className="flex items-center gap-0.5 mb-3">
                {[1,2,3,4,5].map(star => (
                  <button key={star} onClick={() => setRating(member, star)}
                    className={`transition-colors ${star <= (member.rating || 0) ? 'text-amber-400' : 'text-gray-600 hover:text-amber-400/50'}`}>
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </button>
                ))}
                <span className="text-gray-500 text-xs ml-1">{member.rating || 0}/5</span>
              </div>

              <div className="flex gap-2 pt-2 border-t border-white/5">
                <button onClick={() => openEdit(member)} className="flex-1 text-xs text-gray-400 hover:text-amber-400 transition-colors flex items-center justify-center gap-1 py-1">
                  <Edit2 className="w-3 h-3" />Edit
                </button>
                <button onClick={() => deleteMember(member.id)} className="flex-1 text-xs text-gray-400 hover:text-red-400 transition-colors flex items-center justify-center gap-1 py-1">
                  <Trash2 className="w-3 h-3" />Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A1020] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">{editing ? 'Edit Crew Member' : 'Add Crew Member'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs text-gray-400 mb-1 block">Full Name *</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full bg-[#04080F] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50" placeholder="Jane Smith" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full bg-[#04080F] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50" placeholder="jane@example.com" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Phone</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    className="w-full bg-[#04080F] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50" placeholder="+44 7700 000000" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Role / Title</label>
                  <input value={form.role} onChange={e => setForm({...form, role: e.target.value})}
                    className="w-full bg-[#04080F] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50" placeholder="Director of Photography" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Department</label>
                  <select value={form.department} onChange={e => setForm({...form, department: e.target.value})}
                    className="w-full bg-[#04080F] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50">
                    <option value="">Select department</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Day Rate (£)</label>
                  <input type="number" value={form.day_rate} onChange={e => setForm({...form, day_rate: parseFloat(e.target.value) || 0})}
                    className="w-full bg-[#04080F] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50" placeholder="500" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value as any})}
                    className="w-full bg-[#04080F] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50">
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Rating (1-5)</label>
                  <div className="flex items-center gap-1 mt-1">
                    {[1,2,3,4,5].map(star => (
                      <button key={star} type="button" onClick={() => setForm({...form, rating: star})}
                        className={`${star <= form.rating ? 'text-amber-400' : 'text-gray-600'}`}>
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2}
                  className="w-full bg-[#04080F] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50 resize-none" placeholder="Additional notes..." />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-white/5">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-white/10 text-gray-300 rounded-lg hover:bg-white/5 transition-colors text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name} className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition-colors text-sm disabled:opacity-50">
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
