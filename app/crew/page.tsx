'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Users, Mail, DollarSign } from 'lucide-react'

interface CrewMember {
    id: number; name: string; role: string; email: string; rate: number; rateUnit: string;
    rating: number; status: 'Available' | 'On Project' | 'Unavailable';
    projects: number; skills: string[]; initials: string; color: string; joined: string
}

const CREW: CrewMember[] = [
  { id: 1, name: 'Ashtyn Cole', role: 'Director', email: 'ashtyn@crewdesk.io', rate: 850, rateUnit: 'day', rating: 5, status: 'On Project', projects: 12, skills: ['Direction', 'Storytelling', 'Client Management'], initials: 'AC', color: 'from-amber-400 to-orange-500', joined: '2023-01-15' },
  { id: 2, name: 'Marcus Webb', role: 'DOP', email: 'marcus@gmail.com', rate: 650, rateUnit: 'day', rating: 5, status: 'On Project', projects: 8, skills: ['Cinematography', 'Lighting', 'ARRI', 'RED'], initials: 'MW', color: 'from-blue-400 to-indigo-500', joined: '2023-03-20' },
  { id: 3, name: 'Priya Sharma', role: 'Editor', email: 'priya@studio.co', rate: 450, rateUnit: 'day', rating: 4, status: 'Available', projects: 15, skills: ['Premiere Pro', 'After Effects', 'DaVinci', 'Sound'], initials: 'PS', color: 'from-purple-400 to-pink-500', joined: '2023-05-10' },
  { id: 4, name: 'Jake Torres', role: 'Sound Designer', email: 'jake@audio.com', rate: 380, rateUnit: 'day', rating: 4, status: 'Available', projects: 6, skills: ['Pro Tools', 'Field Recording', 'Mix', 'Foley'], initials: 'JT', color: 'from-emerald-400 to-teal-500', joined: '2023-08-01' },
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
                    <span key={s} onClick={() => onChange?.(s)} className={`text-sm ${onChange ? 'cursor-pointer' : ''} ${s <= rating ? 'text-amber-400' : 'text-gray-600'}`}>&#9733;</span>span>
                  ))}
          </div>div>
        )
}

function CrewCard({ member, onClick }: { member: CrewMember; onClick: () => void }) {
    return (
          <motion.div layout whileHover={{ y: -2 }} className="bg-[#0A1020] border border-white/[0.06] rounded-xl p-5 cursor-pointer hover:border-amber-400/20 transition-all group" onClick={onClick}>
                <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-bold text-sm`}>{member.initials}</div>div>
                                  <div>
                                              <h3 className="text-white font-semibold text-sm">{member.name}</h3>h3>
                                              <p className="text-gray-500 text-xs">{member.role}</p>p>
                                  </div>div>
                        </div>div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLE[member.status]}`}>{member.status}</span>span>
                </div>div>
                <div className="flex items-center gap-2 mb-3">
                        <StarRating rating={member.rating} />
                        <span className="text-xs text-gray-500">({member.projects} projects)</span>span>
                </div>div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {member.skills.slice(0, 3).map(s => <span key={s} className="text-xs px-2 py-0.5 bg-white/5 text-gray-400 rounded-full">{s}</span>span>)}
                  {member.skills.length > 3 && <span className="text-xs px-2 py-0.5 bg-white/5 text-gray-500 rounded-full">+{member.skills.length - 3}</span>span>}
                </div>div>
                <div className="flex justify-between items-center pt-3 border-t border-white/5 text-xs">
                        <span className="text-gray-500 flex items-center gap-1"><DollarSign className="w-3 h-3" />£{member.rate}/{member.rateUnit}</span>span>
                        <span className="text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" />{member.email}</span>span>
                </div>div>
          </motion.div>motion.div>
        )
      }
      
      function CrewDetailModal({ member, onClose, onUpdate }: { member: CrewMember; onClose: () => void; onUpdate: (m: CrewMember) => void }) {
          const [m, setM] = useState(member)
              return (
                    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
                          <motion.div className="bg-[#0A1020] border border-white/10 rounded-2xl p-8 w-full max-w-lg shadow-2xl" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={e => e.stopPropagation()}>
                                  <div className="flex items-center gap-4 mb-6">
                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white font-bold text-xl`}>{m.initials}</div>div>
                                            <div className="flex-1">
                                                        <h2 className="text-xl font-bold text-white">{m.name}</h2>h2>
                                                        <p className="text-gray-400 text-sm">{m.role}</p>p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                                      <StarRating rating={m.rating} onChange={r => setM({...m, rating: r})} />
                                                                      <span className="text-xs text-gray-500">{m.rating}/5</span>span>
                                                        </div>div>
                                            </div>div>
                                            <span className={`text-xs px-3 py-1 rounded-full ${STATUS_STYLE[m.status]}`}>{m.status}</span>span>
                                  </div>div>
                                  <div className="grid grid-cols-2 gap-4 mb-5">
                                            <div><label className="text-xs text-gray-400 mb-1 block">Email</label>label><input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-400/50 focus:outline-none" value={m.email} onChange={e => setM({...m, email: e.target.value})} /></div>div>
                                            <div><label className="text-xs text-gray-400 mb-1 block">Day Rate (£)</label>label><input type="number" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-400/50 focus:outline-none" value={m.rate} onChange={e => setM({...m, rate: Number(e.target.value)})} /></div>div>
                                            <div><label className="text-xs text-gray-400 mb-1 block">Status</label>label>
                                                        <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-400/50 focus:outline-none" value={m.status} onChange={e => setM({...m, status: e.target.value as CrewMember['status']})}>
                                                          {['Available', 'On Project', 'Unavailable'].map(s => <option key={s} value={s}>{s}</option>option>)}
                                                        </select>select></div>div>
                                            <div><label className="text-xs text-gray-400 mb-1 block">Projects Done</label>label><p className="text-white font-semibold mt-2">{m.projects}</p>p></div>div>
                                  </div>div>
                                  <div className="mb-5"><label className="text-xs text-gray-400 mb-2 block">Skills</label>label>
                                            <div className="flex flex-wrap gap-1.5">{m.skills.map(s => <span key={s} className="text-xs px-3 py-1 bg-white/5 text-gray-300 rounded-full border border-white/10">{s}</span>span>)}</div>div>
                                  </div>div>
                                  <div className="flex gap-3">
                                            <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-400 text-sm hover:bg-white/5 transition-colors">Cancel</button>button>
                                            <button onClick={() => { onUpdate(m); onClose() }} className="flex-1 py-2.5 rounded-lg bg-amber-400 text-black font-semibold text-sm hover:bg-amber-300 transition-colors">Save Changes</button>button>
                                  </div>div>
                          </motion.div>motion.div>
                    </motion.div>motion.div>
                  )
                }
                
                function InviteModal({ onClose }: { onClose: () => void }) {
                    const [email, setEmail] = useState('')
                        const [role, setRole] = useState('')
                            const [sent, setSent] = useState(false)
                                return (
                                      <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
                                            <motion.div className="bg-[#0A1020] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={e => e.stopPropagation()}>
                                              {sent ? (
                                                  <div className="text-center py-4">
                                                              <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mx-auto mb-4">
                                                                            <Mail className="w-8 h-8 text-amber-400" />
                                                              </div>div>
                                                              <h3 className="text-xl font-bold text-white mb-2">Invite Sent!</h3>h3>
                                                              <p className="text-gray-400 text-sm mb-6">An invitation has been sent to {email}</p>p>
                                                              <button onClick={onClose} className="w-full py-2.5 rounded-lg bg-amber-400 text-black font-semibold text-sm">Done</button>button>
                                                  </div>div>
                                                ) : (
                                                  <>
                                                              <h2 className="text-xl font-bold text-white mb-2">Invite Crew Member</h2>h2>
                                                              <p className="text-gray-400 text-sm mb-6">They&apos;ll receive an email to join your CrewDesk workspace.</p>p>
                                                              <div className="space-y-4 mb-6">
                                                                            <div><label className="text-xs text-gray-400 mb-1 block">Email Address</label>label><input type="email" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-400/50 focus:outline-none" value={email} onChange={e => setEmail(e.target.value)} placeholder="crew@example.com" /></div>div>
                                                                            <div><label className="text-xs text-gray-400 mb-1 block">Role</label>label><input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-400/50 focus:outline-none" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Camera Operator" /></div>div>
                                                              </div>div>
                                                              <div className="flex gap-3">
                                                                            <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-400 text-sm hover:bg-white/5 transition-colors">Cancel</button>button>
                                                                            <button onClick={() => setSent(true)} className="flex-1 py-2.5 rounded-lg bg-amber-400 text-black font-semibold text-sm hover:bg-amber-300 transition-colors">Send Invite</button>button>
                                                              </div>div>
                                                  </>>
                                                )}
                                            </motion.div>motion.div>
                                      </motion.div>motion.div>
                                    )
                }

export default function CrewPage() {
    const [crew, setCrew] = useState<CrewMember[]>(CREW)
        const [filter, setFilter] = useState('All')
            const [search, setSearch] = useState('')
                const [selected, setSelected] = useState<CrewMember | null>(null)
                    const [invite, setInvite] = useState(false)
                      
                        const filtered = crew.filter(m =>
                              (filter === 'All' || m.status === filter) &&
                              (m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase()))
                            )
                          
                            const available = crew.filter(m => m.status === 'Available').length
                                const onProject = crew.filter(m => m.status === 'On Project').length
                                    const avgRate = Math.round(crew.reduce((s, m) => s + m.rate, 0) / crew.length)
                                        const updateMember = (updated: CrewMember) => setCrew(c => c.map(m => m.id === updated.id ? updated : m))
                                          
                                            return (
                                                  <div className="p-6 overflow-y-auto">
                                                    {/* Stats */}
                                                        <div className="grid grid-cols-4 gap-4 mb-6">
                                                          {[
                                                    { label: 'Total Crew', value: crew.length, sub: 'in your workspace' },
                                                    { label: 'Available', value: available, sub: 'ready to book', color: 'text-emerald-400' },
                                                    { label: 'On Project', value: onProject, sub: 'currently active', color: 'text-amber-400' },
                                                    { label: 'Avg Day Rate', value: `£${avgRate}`, sub: 'across all crew' },
                                                            ].map((s, i) => (
                                                                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-[#0A1020] border border-white/[0.06] rounded-xl p-4">
                                                                                    <p className="text-xs text-gray-500 mb-1">{s.label}</p>p>
                                                                                    <p className={`text-2xl font-bold ${s.color || 'text-white'}`}>{s.value}</p>p>
                                                                                    <p className="text-xs text-gray-500 mt-1">{s.sub}</p>p>
                                                                        </motion.div>motion.div>
                                                                      ))}
                                                        </div>div>
                                                  
                                                    {/* Toolbar */}
                                                        <div className="flex items-center gap-3 mb-5">
                                                                <div className="flex bg-[#0A1020] border border-white/[0.06] rounded-lg p-0.5 gap-0.5">
                                                                  {['All', 'Available', 'On Project', 'Unavailable'].map(t => (
                                                                <button key={t} onClick={() => setFilter(t)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filter === t ? 'bg-amber-400 text-black' : 'text-gray-400 hover:text-white'}`}>{t}</button>button>
                                                              ))}
                                                                </div>div>
                                                                <div className="flex-1 relative">
                                                                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                                                                          <input className="w-full bg-[#0A1020] border border-white/[0.06] rounded-lg pl-8 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-amber-400/50 focus:outline-none" placeholder="Search by name or role..." value={search} onChange={e => setSearch(e.target.value)} />
                                                                </div>div>
                                                                <button onClick={() => setInvite(true)} className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
                                                                          <span className="text-base leading-none">+</span>span> Invite Crew
                                                                </button>button>
                                                        </div>div>
                                                  
                                                    {/* Grid */}
                                                        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                                                <AnimatePresence>
                                                                  {filtered.map((m, i) => (
                                                                <motion.div key={m.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }}>
                                                                              <CrewCard member={m} onClick={() => setSelected(m)} />
                                                                </motion.div>motion.div>
                                                              ))}
                                                                </AnimatePresence>AnimatePresence>
                                                        </motion.div>motion.div>
                                                  
                                                    {filtered.length === 0 && (
                                                            <div className="text-center py-20 text-gray-500">
                                                                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                                                                                  <Users className="w-8 h-8 text-gray-600" />
                                                                      </div>div>
                                                                      <p className="font-medium">No crew found</p>p>
                                                                      <p className="text-sm mt-1">Try a different filter or invite new crew</p>p>
                                                            </div>div>
                                                        )}
                                                  
                                                        <AnimatePresence>
                                                          {selected && <CrewDetailModal member={selected} onClose={() => setSelected(null)} onUpdate={updateMember} />}
                                                          {invite && <InviteModal onClose={() => setInvite(false)} />}
                                                        </AnimatePresence>AnimatePresence>
                                                  </div>div>
                                                )
                                              }</></div>
