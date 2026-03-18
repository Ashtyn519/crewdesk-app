'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Star, X, Check, Mail, Phone,
  Users, Briefcase, Award, TrendingUp, MoreVertical,
  Edit2, Trash2, Sparkles, Globe, MapPin
} from 'lucide-react'
import clsx from 'clsx'

interface CrewMember {
  id: string
  name: string
  email: string | null
  phone: string | null
  role: string | null
  department: string | null
  rate_per_day: number | null
  rating: number | null
  status: 'active' | 'inactive' | 'on_leave'
  location: string | null
  skills: string[] | null
  created_at: string
}

const deptColors: Record<string, string> = {
  Engineering:  'bg-blue-400/10 text-blue-400',
  Design:       'bg-violet-400/10 text-violet-400',
  Marketing:    'bg-pink-400/10 text-pink-400',
  Operations:   'bg-emerald-400/10 text-emerald-400',
  Finance:      'bg-amber-400/10 text-amber-400',
  'Content':    'bg-cyan-400/10 text-cyan-400',
}

const statusConfig = {
  active:   { label: 'Active',    color: 'text-emerald-400', bg: 'bg-emerald-400/10', dot: 'bg-emerald-400' },
  inactive: { label: 'Inactive',  color: 'text-white/40',    bg: 'bg-white/5',        dot: 'bg-white/30'    },
  on_leave: { label: 'On Leave',  color: 'text-amber-400',   bg: 'bg-amber-400/10',   dot: 'bg-amber-400'   },
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const card = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { type: 'spring', stiffness: 300, damping: 26 } }
}
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.42, ease: [0.22,1,0.36,1] } }
}

function AvatarInitials({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['from-violet-500 to-blue-500','from-amber-500 to-orange-500','from-emerald-500 to-teal-500','from-pink-500 to-rose-500','from-cyan-500 to-sky-500']
  const idx = name.charCodeAt(0) % colors.length
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-12 h-12 text-sm', lg: 'w-16 h-16 text-base' }
  return (
    <div className={clsx('rounded-2xl bg-gradient-to-br flex items-center justify-center font-bold text-white shrink-0', colors[idx], sizes[size])}>
      {initials}
    </div>
  )
}

function StarRating({ rating, onRate }: { rating: number; onRate?: (r: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(n => (
        <motion.button key={n}
          whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
          onClick={() => onRate?.(n)}
          onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(0)}
          className="focus:outline-none"
        >
          <Star className={clsx('w-3.5 h-3.5 transition-colors',
            n <= (hovered || rating) ? 'fill-amber-400 text-amber-400' : 'text-white/15'
          )} />
        </motion.button>
      ))}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string; accent: string }) {
  return (
    <motion.div variants={fadeUp} className="bg-[#0A1020] border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4">
      <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', accent)}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-white/40 mb-0.5">{label}</p>
        <p className="text-xl font-bold text-white">{value}</p>
      </div>
    </motion.div>
  )
}

export const dynamic = 'force-dynamic'

export default function CrewPage() {
  const supabase = createClient()
  const [crew, setCrew] = useState<CrewMember[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editMember, setEditMember] = useState<CrewMember | null>(null)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', role: '', department: '',
    rate_per_day: '', location: '', status: 'active' as CrewMember['status'], skills: ''
  })

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  async function load() {
    const { data } = await supabase.from('crew_members').select('*').order('created_at', { ascending: false })
    setCrew((data || []) as CrewMember[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const depts = ['all', ...Array.from(new Set(crew.map(c => c.department).filter(Boolean) as string[]))]

  const filtered = crew.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = c.name.toLowerCase().includes(q) || (c.role || '').toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q)
    const matchDept = deptFilter === 'all' || c.department === deptFilter
    return matchSearch && matchDept
  })

  const stats = {
    total:  crew.length,
    active: crew.filter(c => c.status === 'active').length,
    avgRate: crew.length ? Math.round(crew.reduce((s, c) => s + (c.rate_per_day || 0), 0) / crew.length) : 0,
    avgRating: crew.length ? (crew.reduce((s, c) => s + (c.rating || 0), 0) / crew.length).toFixed(1) : '—',
  }

  function openCreate() {
    setEditMember(null)
    setForm({ name:'', email:'', phone:'', role:'', department:'', rate_per_day:'', location:'', status:'active', skills:'' })
    setShowModal(true)
  }

  function openEdit(c: CrewMember) {
    setEditMember(c)
    setForm({
      name: c.name, email: c.email||'', phone: c.phone||'', role: c.role||'',
      department: c.department||'', rate_per_day: c.rate_per_day?.toString()||'',
      location: c.location||'', status: c.status,
      skills: (c.skills||[]).join(', ')
    })
    setShowModal(true)
    setMenuOpen(null)
  }

  async function saveMember() {
    const payload = {
      name: form.name, email: form.email||null, phone: form.phone||null,
      role: form.role||null, department: form.department||null,
      rate_per_day: form.rate_per_day ? parseFloat(form.rate_per_day) : null,
      location: form.location||null, status: form.status,
      skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : null,
    }
    if (editMember) {
      await supabase.from('crew_members').update(payload).eq('id', editMember.id)
      showToast('Member updated')
    } else {
      await supabase.from('crew_members').insert(payload)
      showToast('Member added to crew')
    }
    setShowModal(false)
    load()
  }

  async function deleteMember(id: string) {
    await supabase.from('crew_members').delete().eq('id', id)
    showToast('Member removed')
    setMenuOpen(null)
    load()
  }

  async function updateRating(id: string, rating: number) {
    await supabase.from('crew_members').update({ rating }).eq('id', id)
    setCrew(prev => prev.map(c => c.id === id ? { ...c, rating } : c))
  }

  const fmtRate = (n: number) => `£${n}/day`

  return (
    <div className="min-h-screen bg-[#04080F] p-6 lg:p-8">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity:0, y:-20, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:-20, scale:0.95 }} transition={{ type:'spring', stiffness:400, damping:25 }}
            className="fixed top-6 right-6 z-50 bg-emerald-500 text-white px-5 py-3 rounded-xl flex items-center gap-2 shadow-xl shadow-emerald-500/20">
            <Check className="w-4 h-4" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div variants={container} initial="hidden" animate="show" className="mb-8">
        <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-amber-400" /> Crew
            </h1>
            <p className="text-white/40 text-sm mt-1">{stats.total} members · {stats.active} active</p>
          </div>
          <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
            onClick={openCreate}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#04080F] font-semibold px-4 py-2.5 rounded-xl text-sm">
            <Plus className="w-4 h-4" /> Add Member
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div variants={container} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Users}      label="Total Crew"   value={stats.total.toString()}  accent="bg-violet-400/10 text-violet-400" />
          <StatCard icon={TrendingUp} label="Active"       value={stats.active.toString()} accent="bg-emerald-400/10 text-emerald-400" />
          <StatCard icon={Award}      label="Avg Rating"   value={`${stats.avgRating} ★`}  accent="bg-amber-400/10 text-amber-400" />
          <StatCard icon={Briefcase}  label="Avg Day Rate" value={stats.avgRate > 0 ? fmtRate(stats.avgRate) : '—'} accent="bg-blue-400/10 text-blue-400" />
        </motion.div>

        {/* Filters */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, role or email…"
              className="w-full bg-[#0A1020] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {depts.map(d => (
              <button key={d} onClick={() => setDeptFilter(d)}
                className={clsx('px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize',
                  deptFilter === d ? 'bg-amber-400 text-[#04080F]' : 'bg-[#0A1020] text-white/50 hover:text-white border border-white/[0.06]'
                )}>{d}</button>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Grid */}
      {loading ? (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <motion.div key={i} variants={card} className="bg-[#0A1020] border border-white/[0.06] rounded-2xl p-6 animate-pulse h-48" />
          ))}
        </motion.div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }}
          className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-6">
            <Users className="w-8 h-8 text-white/20" />
          </div>
          <h3 className="text-white/60 text-lg font-medium mb-2">No crew members</h3>
          <p className="text-white/30 text-sm mb-6">Add your first freelancer to get started</p>
          <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
            onClick={openCreate}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#04080F] font-semibold px-5 py-2.5 rounded-xl text-sm">
            <Plus className="w-4 h-4" /> Add Member
          </motion.button>
        </motion.div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(c => {
            const s = statusConfig[c.status]
            return (
              <motion.div key={c.id} variants={card}
                whileHover={{ y:-3, boxShadow:'0 12px 40px rgba(0,0,0,0.3)' }}
                className="bg-[#0A1020] border border-white/[0.06] hover:border-white/10 rounded-2xl p-6 relative group">
                {/* Menu */}
                <div className="absolute top-4 right-4">
                  <button onClick={() => setMenuOpen(menuOpen === c.id ? null : c.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-all">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  <AnimatePresence>
                    {menuOpen === c.id && (
                      <motion.div initial={{ opacity:0, scale:0.9, y:-4 }} animate={{ opacity:1, scale:1, y:0 }}
                        exit={{ opacity:0, scale:0.9, y:-4 }} transition={{ type:'spring', stiffness:400, damping:25 }}
                        className="absolute right-0 top-8 bg-[#0C1428] border border-white/[0.08] rounded-xl overflow-hidden z-20 w-36 shadow-2xl">
                        <button onClick={() => openEdit(c)} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/[0.05]">
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => deleteMember(c.id)} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/5">
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <AvatarInitials name={c.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm truncate">{c.name}</h3>
                    {c.role && <p className="text-white/40 text-xs">{c.role}</p>}
                    <div className="mt-1.5">
                      <StarRating rating={c.rating || 0} onRate={r => updateRating(c.id, r)} />
                    </div>
                  </div>
                </div>

                {/* Dept + Status */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {c.department && (
                    <span className={clsx('px-2 py-0.5 rounded-lg text-xs font-medium', deptColors[c.department] || 'bg-white/5 text-white/50')}>
                      {c.department}
                    </span>
                  )}
                  <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium', s.bg, s.color)}>
                    <span className={clsx('w-1.5 h-1.5 rounded-full', s.dot)} /> {s.label}
                  </span>
                </div>

                {/* Meta */}
                <div className="space-y-1.5 mb-4">
                  {c.email && (
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <Mail className="w-3 h-3 shrink-0" />
                      <span className="truncate">{c.email}</span>
                    </div>
                  )}
                  {c.location && (
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span>{c.location}</span>
                    </div>
                  )}
                </div>

                {/* Skills */}
                {c.skills && c.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {c.skills.slice(0,4).map(sk => (
                      <span key={sk} className="px-1.5 py-0.5 bg-white/[0.04] border border-white/[0.06] rounded text-xs text-white/40">{sk}</span>
                    ))}
                    {c.skills.length > 4 && <span className="text-xs text-white/25">+{c.skills.length - 4}</span>}
                  </div>
                )}

                {/* Rate */}
                {c.rate_per_day && (
                  <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between">
                    <span className="text-xs text-white/40">Day Rate</span>
                    <span className="text-sm font-semibold text-amber-400">{fmtRate(c.rate_per_day)}</span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ opacity:0, scale:0.92, y:20 }} animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.92, y:20 }} transition={{ type:'spring', stiffness:360, damping:28 }}
              className="bg-[#0A1020] border border-white/[0.08] rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  {editMember ? 'Edit Member' : 'Add to Crew'}
                </h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { label:'Full Name', key:'name', type:'text', placeholder:'Jane Smith' },
                  { label:'Email', key:'email', type:'email', placeholder:'jane@example.com' },
                  { label:'Phone', key:'phone', type:'tel', placeholder:'+44 7700 900000' },
                  { label:'Role / Title', key:'role', type:'text', placeholder:'Senior Developer' },
                  { label:'Department', key:'department', type:'text', placeholder:'Engineering' },
                  { label:'Day Rate (£)', key:'rate_per_day', type:'number', placeholder:'450' },
                  { label:'Location', key:'location', type:'text', placeholder:'London, UK' },
                  { label:'Skills (comma-separated)', key:'skills', type:'text', placeholder:'React, TypeScript, Node' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs text-white/50 mb-1.5 font-medium">{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder}
                      value={form[f.key as keyof typeof form]}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full bg-[#060C18] border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs text-white/50 mb-1.5 font-medium">Status</label>
                  <select value={form.status} onChange={e => setForm(prev => ({ ...prev, status: e.target.value as CrewMember['status'] }))}
                    className="w-full bg-[#060C18] border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white font-medium py-2.5 rounded-xl text-sm transition-colors">
                  Cancel
                </button>
                <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                  onClick={saveMember} disabled={!form.name}
                  className="flex-1 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-[#04080F] font-semibold py-2.5 rounded-xl text-sm">
                  {editMember ? 'Save Changes' : 'Add Member'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
