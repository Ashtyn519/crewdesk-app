'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'
import { Plus, Search, X, Star, Mail, Phone, Trash2, Edit2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

type Status = 'available' | 'on-project' | 'unavailable'

type CrewMember = {
  id: string
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

const initialCrew: CrewMember[] = [
  { id: 'm1', name: 'Jordan Ellis', role: 'Director of Photography', department: 'Camera', email: 'jordan@crewdesk.com', phone: '+44 7700 900001', rate: 750, rating: 5, status: 'available', skills: ['Cinematography', 'Lighting', 'Colour Grading'], bio: 'Award-winning DP with 12 years in film and commercial production.' },
  { id: 'm2', name: 'Sam Rivera', role: 'Production Manager', department: 'Production', email: 'sam@crewdesk.com', phone: '+44 7700 900002', rate: 550, rating: 4, status: 'on-project', skills: ['Scheduling', 'Budgeting', 'Crew Management'], bio: 'Experienced PM with a track record of delivering complex shoots on time.' },
  { id: 'm3', name: 'Alex Chen', role: 'Sound Designer', department: 'Audio', email: 'alex@crewdesk.com', phone: '+44 7700 900003', rate: 480, rating: 5, status: 'available', skills: ['Location Sound', 'Post Audio', 'Foley'], bio: 'Specialist in broadcast and documentary audio across 200+ projects.' },
  { id: 'm4', name: 'Morgan Blake', role: 'Editor', department: 'Post', email: 'morgan@crewdesk.com', phone: '+44 7700 900004', rate: 520, rating: 4, status: 'unavailable', skills: ['Premiere Pro', 'DaVinci Resolve', 'After Effects'], bio: 'Post-production specialist with credits on BAFTA-nominated projects.' },
  { id: 'm5', name: 'Taylor Moss', role: 'Gaffer', department: 'Lighting', email: 'taylor@crewdesk.com', phone: '+44 7700 900005', rate: 420, rating: 5, status: 'available', skills: ['Electrical', 'LED Rigs', 'Day-for-Night'], bio: 'Senior gaffer with expertise in large-scale studio and location rigs.' },
]

const DEPARTMENTS = ['All', 'Camera', 'Production', 'Audio', 'Post', 'Lighting', 'Art', 'Directing']

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12} className={i <= value ? 'text-amber-400 fill-amber-400' : 'text-slate-600'} />
      ))}
    </div>
  )
}

type ModalMode = 'add' | 'edit'

function MemberModal({ mode, member, onClose, onSave }: {
  mode: ModalMode
  member?: CrewMember
  onClose: () => void
  onSave: (m: CrewMember) => void
}) {
  const [form, setForm] = useState({
    name: member?.name ?? '',
    role: member?.role ?? '',
    department: member?.department ?? 'Camera',
    email: member?.email ?? '',
    phone: member?.phone ?? '',
    rate: member?.rate?.toString() ?? '',
    skills: member?.skills?.join(', ') ?? '',
    bio: member?.bio ?? '',
    status: member?.status ?? 'available' as Status,
    rating: member?.rating ?? 4,
  })
  const set = (k: string, v: string | number) => setForm(p => ({ ...p, [k]: v }))

  const submit = () => {
    if (!form.name.trim() || !form.role.trim()) return
    onSave({
      id: member?.id ?? 'm' + Date.now(),
      name: form.name.trim(),
      role: form.role.trim(),
      department: form.department,
      email: form.email.trim(),
      phone: form.phone.trim(),
      rate: parseFloat(form.rate) || 0,
      rating: form.rating,
      status: form.status,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      bio: form.bio.trim(),
    })
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-[#0A1020] border border-white/10 rounded-2xl p-7 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">{mode === 'add' ? 'Add Crew Member' : 'Edit Member'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full name" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Role *</label>
              <input value={form.role} onChange={e => set('role', e.target.value)} placeholder="Job title" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Department</label>
              <select value={form.department} onChange={e => set('department', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50">
                {DEPARTMENTS.filter(d => d !== 'All').map(d => <option key={d} value={d} className="bg-[#0A1020]">{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value as Status)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50">
                <option value="available" className="bg-[#0A1020]">Available</option>
                <option value="on-project" className="bg-[#0A1020]">On Project</option>
                <option value="unavailable" className="bg-[#0A1020]">Unavailable</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Email</label>
              <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Day Rate (£)</label>
              <input value={form.rate} onChange={e => set('rate', e.target.value)} placeholder="e.g. 500" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Skills (comma separated)</label>
            <input value={form.skills} onChange={e => set('skills', e.target.value)} placeholder="e.g. Cinematography, Lighting" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Bio</label>
            <textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={3} placeholder="Brief professional bio" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 resize-none" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Rating</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(i => (
                <button key={i} type="button" onClick={() => set('rating', i)} className={`text-sm ${i <= form.rating ? 'text-amber-400' : 'text-slate-600'} hover:text-amber-400 transition-colors`}>
                  <Star size={20} className={i <= form.rating ? 'fill-amber-400' : ''} />
                </button>
              ))}
            </div>
          </div>
        </div>
        <button onClick={submit} disabled={!form.name.trim() || !form.role.trim()} className="w-full py-3 bg-amber-400 text-black font-bold rounded-xl text-sm hover:bg-amber-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          {mode === 'add' ? 'Add to Roster' : 'Save Changes'}
        </button>
      </motion.div>
    </motion.div>
  )
}

export default function CrewPage() {
  const [crew, setCrew] = useState<CrewMember[]>(initialCrew)
  const [search, setSearch] = useState('')
  const [dept, setDept] = useState('All')
  const [modal, setModal] = useState<{ mode: ModalMode; member?: CrewMember } | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filtered = crew.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()) ||
      m.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
    const matchDept = dept === 'All' || m.department === dept
    return matchSearch && matchDept
  })

  const saveMember = (m: CrewMember) => {
    setCrew(prev => {
      const exists = prev.find(x => x.id === m.id)
      return exists ? prev.map(x => x.id === m.id ? m : x) : [m, ...prev]
    })
    setModal(null)
  }

  const deleteMember = (id: string) => {
    setCrew(prev => prev.filter(m => m.id !== id))
    setDeleteConfirm(null)
    if (expanded === id) setExpanded(null)
  }

  const cycleStatus = (id: string) => {
    const order: Status[] = ['available', 'on-project', 'unavailable']
    setCrew(prev => prev.map(m => {
      if (m.id !== id) return m
      const idx = order.indexOf(m.status)
      return { ...m, status: order[(idx + 1) % order.length] }
    }))
  }

  const available = crew.filter(m => m.status === 'available').length
  const onProject = crew.filter(m => m.status === 'on-project').length

  return (
    <div className="flex h-screen bg-[#04080F] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Crew Roster</h1>
              <p className="text-slate-400 text-sm mt-0.5">Manage your freelancers and production crew</p>
            </div>
            <button onClick={() => setModal({ mode: 'add' })} className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-black font-semibold rounded-xl text-sm hover:bg-amber-300 transition-colors">
              <Plus size={16} />
              Add Member
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Crew', value: crew.length, color: 'text-white' },
              { label: 'Available', value: available, color: 'text-emerald-400' },
              { label: 'On Project', value: onProject, color: 'text-amber-400' },
              { label: 'Unavailable', value: crew.length - available - onProject, color: 'text-rose-400' },
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
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search crew, roles, skills..." className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
            </div>
            <div className="flex gap-1 flex-wrap">
              {DEPARTMENTS.map(d => (
                <button key={d} onClick={() => setDept(d)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${dept === d ? 'bg-amber-400 text-black' : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'}`}>{d}</button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {filtered.map(member => (
              <motion.div key={member.id} layout className="bg-[#0A1020] border border-white/5 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setExpanded(expanded === member.id ? null : member.id)}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                      <span className="text-amber-400 font-bold text-sm">{member.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{member.name}</p>
                      <p className="text-xs text-slate-400">{member.role} &middot; {member.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StarRating value={member.rating} />
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full cursor-pointer ${STATUS_STYLE[member.status]}`} onClick={e => { e.stopPropagation(); cycleStatus(member.id) }}>
                      {member.status === 'on-project' ? 'On Project' : member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </span>
                    <span className="text-sm font-semibold text-amber-400">£{member.rate}/day</span>
                    <button onClick={e => { e.stopPropagation(); setModal({ mode: 'edit', member }) }} className="text-slate-500 hover:text-white transition-colors p-1"><Edit2 size={14} /></button>
                    <button onClick={e => { e.stopPropagation(); setDeleteConfirm(member.id) }} className="text-slate-500 hover:text-rose-400 transition-colors p-1"><Trash2 size={14} /></button>
                  </div>
                </div>
                <AnimatePresence>
                  {expanded === member.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-white/5 px-4 pb-4 pt-3">
                      <p className="text-sm text-slate-300 mb-3">{member.bio}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {member.skills.map(skill => (
                          <span key={skill} className="text-xs bg-white/5 border border-white/10 text-slate-300 px-2 py-1 rounded-full">{skill}</span>
                        ))}
                      </div>
                      <div className="flex gap-4 text-xs text-slate-400">
                        {member.email && <a href={`mailto:${member.email}`} className="flex items-center gap-1 hover:text-amber-400 transition-colors"><Mail size={12} />{member.email}</a>}
                        {member.phone && <span className="flex items-center gap-1"><Phone size={12} />{member.phone}</span>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500 text-sm">No crew members found</p>
              </div>
            )}
          </div>
        </main>
      </div>
      <AnimatePresence>
        {modal && <MemberModal mode={modal.mode} member={modal.member} onClose={() => setModal(null)} onSave={saveMember} />}
      </AnimatePresence>
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-[#0A1020] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
              <h3 className="text-base font-bold text-white mb-2">Remove Crew Member</h3>
              <p className="text-sm text-slate-400 mb-6">This will remove them from the roster. Are you sure?</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-white/10 text-slate-300 rounded-xl text-sm hover:bg-white/5 transition-colors">Cancel</button>
                <button onClick={() => deleteMember(deleteConfirm)} className="flex-1 py-2.5 bg-rose-500 text-white font-semibold rounded-xl text-sm hover:bg-rose-600 transition-colors">Remove</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
