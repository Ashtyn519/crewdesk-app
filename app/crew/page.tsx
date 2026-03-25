'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Users, Mail, DollarSign, Plus, X, Trash2, Star } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'

interface CrewMember {
      id: number; name: string; role: string; email: string; rate: number; rateUnit: string;
      rating: number; status: 'Available' | 'On Project' | 'Unavailable';
      projects: number; skills: string[]; initials: string; color: string; joined: string
}

const INITIAL_CREW: CrewMember[] = [
    { id: 1, name: 'Ashtyn Cole', role: 'Director', email: 'ashtyn@crewdesk.io', rate: 850, rateUnit: 'day', rating: 5, status: 'On Project', projects: 12, skills: ['Direction', 'Storytelling', 'Client Management'], initials: 'AC', color: 'from-amber-400 to-orange-500', joined: '2023-01-15' },
    { id: 2, name: 'Marcus Webb', role: 'DOP', email: 'marcus@gmail.com', rate: 650, rateUnit: 'day', rating: 5, status: 'On Project', projects: 8, skills: ['Cinematography', 'Lighting', 'ARRI', 'RED'], initials: 'MW', color: 'from-blue-400 to-indigo-500', joined: '2023-03-20' },
    { id: 3, name: 'Priya Sharma', role: 'Editor', email: 'priya@studio.co', rate: 450, rateUnit: 'day', rating: 4, status: 'Available', projects: 15, skills: ['Premiere Pro', 'After Effects', 'DaVinci', 'Sound'], initials: 'PS', color: 'from-purple-400 to-pink-500', joined: '2023-05-10' },
    { id: 4, name: 'Jake Torres', role: 'Sound', email: 'jake@audio.com', rate: 380, rateUnit: 'day', rating: 4, status: 'Available', projects: 6, skills: ['Pro Tools', 'Field Recording', 'Mix', 'Foley'], initials: 'JT', color: 'from-emerald-400 to-teal-500', joined: '2023-08-01' },
    { id: 5, name: 'Sophie Lane', role: 'Production Designer', email: 'sophie@design.io', rate: 500, rateUnit: 'day', rating: 5, status: 'On Project', projects: 9, skills: ['Set Design', 'Art Direction', 'Props', 'Budget'], initials: 'SL', color: 'from-rose-400 to-red-500', joined: '2023-02-28' },
    { id: 6, name: 'Kai Nakamura', role: 'VFX Artist', email: 'kai@vfx.studio', rate: 600, rateUnit: 'day', rating: 4, status: 'Unavailable', projects: 4, skills: ['Houdini', 'Nuke', 'Compositing', 'Motion'], initials: 'KN', color: 'from-cyan-400 to-blue-500', joined: '2024-01-05' },
    ]

const STATUS_STYLE: Record<string, string> = {
      'Available': 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      'On Project': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
      'Unavailable': 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
}

function StarRating({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) {
      return (
              <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                          <span
                                        key={s}
                                        onClick={() => onChange?.(s)}
                                        className={`text-sm ${onChange ? 'cursor-pointer' : ''} ${s <= rating ? 'text-amber-400' : 'text-gray-600'}`}
                                      >
                                    &#9733;
                          </span>span>
                        ))}
              </div>div>
            )
}

function AddCrewModal({ onClose, onSave }: { onClose: () => void; onSave: (m: CrewMember) => void }) {
      const [form, setForm] = useState({ name: '', role: '', email: '', rate: '', skills: '' })
            const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
                
                  const submit = () => {
                          if (!form.name.trim() || !form.role.trim()) return
                                  const initials = form.name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
                                          const colors = ['from-amber-400 to-orange-500', 'from-blue-400 to-indigo-500', 'from-purple-400 to-pink-500', 'from-emerald-400 to-teal-500', 'from-rose-400 to-red-500', 'from-cyan-400 to-blue-500']
                                                  onSave({
                                                            id: Date.now(),
                                                            name: form.name.trim(),
                                                            role: form.role.trim(),
                                                            email: form.email.trim(),
                                                            rate: parseInt(form.rate) || 0,
                                                            rateUnit: 'day',
                                                            rating: 5,
                                                            status: 'Available',
                                                            projects: 0,
                                                            skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
                                                            initials,
                                                            color: colors[Math.floor(Math.random() * colors.length)],
                                                            joined: new Date().toISOString().slice(0, 10),
                                                  })
                  }
                      
                        return (
                                <motion.div
                                          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                          onClick={onClose}
                                        >
                                      <motion.div
                                                  className="bg-[#0A1020] border border-white/10 rounded-2xl p-7 w-full max-w-lg shadow-2xl"
                                                  initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                                                  onClick={e => e.stopPropagation()}
                                                >
                                              <div className="flex items-center justify-between mb-6">
                                                        <h2 className="text-xl font-bold text-white">Add Crew Member</h2>h2>
                                                        <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>button>
                                              </div>div>
                                              <div className="space-y-4 mb-6">
                                                        <div className="grid grid-cols-2 gap-3">
                                                                    <div>
                                                                                  <label className="text-xs text-slate-400 mb-1 block">Name *</label>label>
                                                                                  <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full name" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
                                                                    </div>div>
                                                                    <div>
                                                                                  <label className="text-xs text-slate-400 mb-1 block">Role *</label>label>
                                                                                  <input value={form.role} onChange={e => set('role', e.target.value)} placeholder="e.g. Director of Photography" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
                                                                    </div>div>
                                                        </div>div>
                                                        <div className="grid grid-cols-2 gap-3">
                                                                    <div>
                                                                                  <label className="text-xs text-slate-400 mb-1 block">Email</label>label>
                                                                                  <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
                                                                    </div>div>
                                                                    <div>
                                                                                  <label className="text-xs text-slate-400 mb-1 block">Day Rate (£)</label>label>
                                                                                  <input type="number" value={form.rate} onChange={e => set('rate', e.target.value)} placeholder="e.g. 500" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
                                                                    </div>div>
                                                        </div>div>
                                                        <div>
                                                                    <label className="text-xs text-slate-400 mb-1 block">Skills (comma separated)</label>label>
                                                                    <input value={form.skills} onChange={e => set('skills', e.target.value)} placeholder="e.g. Cinematography, Lighting, ARRI" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
                                                        </div>div>
                                              </div>div>
                                              <button
                                                            onClick={submit}
                                                            disabled={!form.name.trim() || !form.role.trim()}
                                                            className="w-full py-3 bg-amber-400 text-black font-bold rounded-xl text-sm hover:bg-amber-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                          >
                                                        Add to Crew
                                              </button>button>
                                      </motion.div>motion.div>
                                </motion.div>motion.div>
                              )
}

function CrewDetailModal({ member, onClose, onUpdate, onDelete }: {
      member: CrewMember; onClose: () => void;
      onUpdate: (m: CrewMember) => void; onDelete: (id: number) => void
}) {
      const [rating, setRating] = useState(member.rating)
            const [status, setStatus] = useState(member.status)
                
                  const save = () => {
                          onUpdate({ ...member, rating, status })
                                  onClose()
                  }
                      
                        return (
                                <motion.div
                                          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                          onClick={onClose}
                                        >
                                      <motion.div
                                                  className="bg-[#0A1020] border border-white/10 rounded-2xl p-7 w-full max-w-md shadow-2xl"
                                                  initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                                                  onClick={e => e.stopPropagation()}
                                                >
                                              <div className="flex items-start justify-between mb-5">
                                                        <div className="flex items-center gap-4">
                                                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-lg font-bold`}>
                                                                        {member.initials}
                                                                    </div>div>
                                                                    <div>
                                                                                  <h2 className="text-lg font-bold text-white">{member.name}</h2>h2>
                                                                                  <p className="text-sm text-slate-400">{member.role}</p>p>
                                                                    </div>div>
                                                        </div>div>
                                                        <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>button>
                                              </div>div>
                                      
                                              <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
                                                        <div className="p-3 rounded-xl bg-white/3 border border-white/5">
                                                                    <p className="text-xs text-slate-500 mb-0.5">Day Rate</p>p>
                                                                    <p className="text-white font-bold">£{member.rate}/day</p>p>
                                                        </div>div>
                                                        <div className="p-3 rounded-xl bg-white/3 border border-white/5">
                                                                    <p className="text-xs text-slate-500 mb-0.5">Projects</p>p>
                                                                    <p className="text-white font-bold">{member.projects}</p>p>
                                                        </div>div>
                                                        <div className="p-3 rounded-xl bg-white/3 border border-white/5">
                                                                    <p className="text-xs text-slate-500 mb-0.5">Rating</p>p>
                                                                    <StarRating rating={rating} onChange={setRating} />
                                                        </div>div>
                                                        <div className="p-3 rounded-xl bg-white/3 border border-white/5">
                                                                    <p className="text-xs text-slate-500 mb-1">Status</p>p>
                                                                    <select value={status} onChange={e => setStatus(e.target.value as CrewMember['status'])} className="w-full bg-transparent text-white text-xs focus:outline-none">
                                                                        {['Available', 'On Project', 'Unavailable'].map(s => <option key={s} value={s} className="bg-[#0A1020]">{s}</option>option>)}
                                                                    </select>select>
                                                        </div>div>
                                              </div>div>
                                      
                                          {member.skills.length > 0 && (
                                                              <div className="mb-5">
                                                                          <p className="text-xs text-slate-500 mb-2">Skills</p>p>
                                                                          <div className="flex flex-wrap gap-1.5">
                                                                              {member.skills.map(s => (
                                                                                  <span key={s} className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">{s}</span>span>
                                                                                ))}
                                                                          </div>div>
                                                              </div>div>
                                              )}
                                      
                                          {member.email && (
                                                              <div className="flex items-center gap-2 mb-5 p-3 rounded-xl bg-white/3 border border-white/5">
                                                                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                                                                          <a href={`mailto:${member.email}`} className="text-xs text-amber-400 hover:text-amber-300">{member.email}</a>a>
                                                              </div>div>
                                              )}
                                      
                                              <div className="flex gap-2">
                                                        <button onClick={save} className="flex-1 py-2.5 bg-amber-400 text-black font-bold text-sm rounded-xl hover:bg-amber-300 transition-colors">Save Changes</button>button>
                                                        <button
                                                                        onClick={() => { onDelete(member.id); onClose() }}
                                                                        className="px-4 py-2.5 bg-red-500/20 text-red-400 border border-red-500/30 font-semibold text-sm rounded-xl hover:bg-red-500/30 transition-colors"
                                                                      >
                                                                    <Trash2 className="w-4 h-4" />
                                                        </button>button>
                                              </div>div>
                                      </motion.div>motion.div>
                                </motion.div>motion.div>
                              )
}

export default function CrewPage() {
      const [crew, setCrew] = useState<CrewMember[]>(INITIAL_CREW)
            const [search, setSearch] = useState('')
                  const [statusFilter, setStatusFilter] = useState('All')
                        const [showAdd, setShowAdd] = useState(false)
                              const [selected, setSelected] = useState<CrewMember | null>(null)
                                  
                                    const statuses = ['All', 'Available', 'On Project', 'Unavailable']
                                        
                                          const filtered = crew.filter(m => {
                                                  const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                                                            m.role.toLowerCase().includes(search.toLowerCase()) ||
                                                            m.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
                                                          const matchStatus = statusFilter === 'All' || m.status === statusFilter
                                                                  return matchSearch && matchStatus
                                          })
                                              
                                                const stats = {
                                                        total: crew.length,
                                                        available: crew.filter(m => m.status === 'Available').length,
                                                        onProject: crew.filter(m => m.status === 'On Project').length,
                                                        avgRate: Math.round(crew.reduce((s, m) => s + m.rate, 0) / crew.length),
                                                }
                                                    
                                                      const addMember = (m: CrewMember) => {
                                                              setCrew(prev => [m, ...prev])
                                                                      setShowAdd(false)
                                                      }
                                                          
                                                            const updateMember = (m: CrewMember) => {
                                                                    setCrew(prev => prev.map(x => x.id === m.id ? m : x))
                                                            }
                                                                
                                                                  const deleteMember = (id: number) => {
                                                                          setCrew(prev => prev.filter(m => m.id !== id))
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
                                                                                                                                                  <h1 className="text-2xl font-black text-white tracking-tight">Crew</h1>h1>
                                                                                                                                                  <p className="text-slate-400 text-sm mt-1">Manage your freelance roster</p>p>
                                                                                                                                      </div>div>
                                                                                                                                  <button
                                                                                                                                                      onClick={() => setShowAdd(true)}
                                                                                                                                                      className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 text-black font-bold text-sm rounded-xl hover:bg-amber-300 transition-colors"
                                                                                                                                                    >
                                                                                                                                                  <Plus className="w-4 h-4" /> Add Crew
                                                                                                                                      </button>button>
                                                                                                                        </div>div>
                                                                                                        
                                                                                                            {/* Stats */}
                                                                                                                    <div className="grid grid-cols-4 gap-4 mb-8">
                                                                                                                        {[
                                                                                    { label: 'Total Crew', value: stats.total.toString(), color: 'text-white' },
                                                                                    { label: 'Available', value: stats.available.toString(), color: 'text-emerald-400' },
                                                                                    { label: 'On Project', value: stats.onProject.toString(), color: 'text-amber-400' },
                                                                                    { label: 'Avg Day Rate', value: `£${stats.avgRate}`, color: 'text-purple-400' },
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
                                                                                                                                                                        placeholder="Search crew by name, role, or skill..."
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
                                                                                                        
                                                                                                            {/* Crew grid */}
                                                                                                            {filtered.length === 0 ? (
                                                                                                  <div className="text-center py-20 text-slate-500">
                                                                                                                  <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                                                                                                  <p className="text-sm">No crew members found</p>p>
                                                                                                      </div>div>
                                                                                                ) : (
                                                                                                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                                                                                      {filtered.map((member, i) => (
                                                                                                                        <motion.div
                                                                                                                                                key={member.id}
                                                                                                                                                layout
                                                                                                                                                whileHover={{ y: -2 }}
                                                                                                                                                initial={{ opacity: 0, y: 20 }}
                                                                                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                                                                                transition={{ delay: i * 0.05 }}
                                                                                                                                                onClick={() => setSelected(member)}
                                                                                                                                                className="bg-[#0A1020] border border-white/[0.06] rounded-2xl p-5 cursor-pointer hover:border-amber-400/20 transition-all group"
                                                                                                                                              >
                                                                                                                                            <div className="flex items-start justify-between mb-4">
                                                                                                                                                                  <div className="flex items-center gap-3">
                                                                                                                                                                                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-bold text-sm`}>
                                                                                                                                                                                                                    {member.initials}
                                                                                                                                                                                                                  </div>div>
                                                                                                                                                                                          <div>
                                                                                                                                                                                                                    <h3 className="text-sm font-bold text-white">{member.name}</h3>h3>
                                                                                                                                                                                                                    <p className="text-xs text-slate-400">{member.role}</p>p>
                                                                                                                                                                                                                  </div>div>
                                                                                                                                                                      </div>div>
                                                                                                                                                                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${STATUS_STYLE[member.status]}`}>
                                                                                                                                                                      {member.status}
                                                                                                                                                                      </span>span>
                                                                                                                                                </div>div>
                                                                                                                        
                                                                                                                                            <div className="flex items-center justify-between mb-3">
                                                                                                                                                                  <StarRating rating={member.rating} />
                                                                                                                                                                  <span className="flex items-center gap-1 text-xs text-slate-400">
                                                                                                                                                                                          <DollarSign className="w-3 h-3" />£{member.rate}/day
                                                                                                                                                                      </span>span>
                                                                                                                                                </div>div>
                                                                                                                        
                                                                                                                                            <div className="flex flex-wrap gap-1.5 mb-3">
                                                                                                                                                {member.skills.slice(0, 3).map(skill => (
                                                                                                                                                                          <span key={skill} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">{skill}</span>span>
                                                                                                                                                                        ))}
                                                                                                                                                {member.skills.length > 3 && (
                                                                                                                                                                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-slate-500">+{member.skills.length - 3}</span>span>
                                                                                                                                                                  )}
                                                                                                                                                </div>div>
                                                                                                                        
                                                                                                                                            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-white/5">
                                                                                                                                                                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{member.projects} projects</span>span>
                                                                                                                                                {member.email && (
                                                                                                                                                                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" />Contact</span>span>
                                                                                                                                                                  )}
                                                                                                                                                </div>div>
                                                                                                                            </motion.div>motion.div>
                                                                                                                      ))}
                                                                                                      </div>div>
                                                                                                                    )}
                                                                                                            </div>div>
                                                                                                  </div>div>
                                                                                      </div>div>
                                                                                
                                                                                      <AnimatePresence>
                                                                                          {showAdd && <AddCrewModal onClose={() => setShowAdd(false)} onSave={addMember} />}
                                                                                          {selected && (
                                                                                              <CrewDetailModal
                                                                                                              member={selected}
                                                                                                              onClose={() => setSelected(null)}
                                                                                                              onUpdate={updateMember}
                                                                                                              onDelete={deleteMember}
                                                                                                            />
                                                                                            )}
                                                                                      </AnimatePresence>AnimatePresence>
                                                                                </div>div>
                                                                              )
                                                                            }</div>
