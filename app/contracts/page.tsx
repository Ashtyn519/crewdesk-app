'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'
import { Plus, Search, X, Trash2, FileText, ChevronRight, ArrowRight } from 'lucide-react'
export const dynamic = 'force-dynamic'

type ContractStatus = 'draft' | 'sent' | 'signed' | 'expired'

type Contract = {
    id: string
    title: string
    client: string
    value: string
    date: string
    status: ContractStatus
    type: string
}

const initialContracts: Contract[] = [
  { id: 'c1', title: 'Neon Nights — Production Agreement', client: 'Neon Films Ltd', value: '£14,500', date: 'Mar 20, 2026', status: 'signed', type: 'Production' },
  { id: 'c2', title: 'City Lights — Director Contract', client: 'BFI Productions', value: '£8,200', date: 'Mar 22, 2026', status: 'sent', type: 'Director' },
  { id: 'c3', title: 'Apex Documentary — Crew Agreement', client: 'Channel 4', value: '£22,000', date: 'Mar 15, 2026', status: 'draft', type: 'Crew' },
  { id: 'c4', title: 'Midnight Run — NDA', client: 'Sky Studios', value: '—', date: 'Feb 28, 2026', status: 'expired', type: 'NDA' },
  { id: 'c5', title: 'Sundown Series — Service Agreement', client: 'ITV', value: '£31,500', date: 'Apr 1, 2026', status: 'sent', type: 'Service' },
  { id: 'c6', title: 'Freelance Camera — Equipment NDA', client: 'Internal', value: '—', date: 'Mar 10, 2026', status: 'signed', type: 'NDA' },
  ]

const STATUS_STYLE: Record<ContractStatus, string> = {
    draft: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
    sent: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    signed: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    expired: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
}

const STATUS_DOT: Record<ContractStatus, string> = {
    draft: 'bg-slate-400',
    sent: 'bg-blue-400',
    signed: 'bg-emerald-400',
    expired: 'bg-rose-400',
}

const STATUS_ORDER: ContractStatus[] = ['draft', 'sent', 'signed', 'expired']

function NewContractModal({ onClose, onSave }: { onClose: () => void; onSave: (c: Contract) => void }) {
    const [form, setForm] = useState({ title: '', client: '', value: '', type: 'Production', date: '' })
    const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const submit = () => {
        if (!form.title.trim() || !form.client.trim()) return
        onSave({
                id: `c${Date.now()}`,
                title: form.title,
                client: form.client,
                value: form.value ? `£${form.value}` : '—',
                date: form.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                status: 'draft',
                type: form.type,
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
                                <h2 className="text-xl font-bold text-white">New Contract</h2>h2>
                                <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>button>
                      </div>div>
                      <div className="space-y-4 mb-6">
                                <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Contract Title *</label>label>
                                            <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Production Agreement — Project Name" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
                                </div>div>
                                <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                          <label className="text-xs text-slate-400 mb-1 block">Client *</label>label>
                                                          <input value={form.client} onChange={e => set('client', e.target.value)} placeholder="Client or studio name" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
                                            </div>div>
                                            <div>
                                                          <label className="text-xs text-slate-400 mb-1 block">Value (£)</label>label>
                                                          <input value={form.value} onChange={e => set('value', e.target.value)} placeholder="e.g. 12000" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
                                            </div>div>
                                </div>div>
                                <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                          <label className="text-xs text-slate-400 mb-1 block">Type</label>label>
                                                          <select value={form.type} onChange={e => set('type', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50">
                                                            {['Production', 'Director', 'Crew', 'Service', 'NDA', 'Freelance'].map(t => <option key={t} value={t} className="bg-[#0A1020]">{t}</option>option>)}
                                                          </select>select>
                                            </div>div>
                                            <div>
                                                          <label className="text-xs text-slate-400 mb-1 block">Date</label>label>
                                                          <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50" />
                                            </div>div>
                                </div>div>
                      </div>div>
                      <button
                                  onClick={submit}
                                  disabled={!form.title.trim() || !form.client.trim()}
                                  className="w-full py-3 bg-amber-400 text-black font-bold rounded-xl text-sm hover:bg-amber-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                Create Contract
                      </button>button>
              </motion.div>motion.div>
        </motion.div>motion.div>
      )
}

export default function ContractsPage() {
    const [contracts, setContracts] = useState<Contract[]>(initialContracts)
        const [view, setView] = useState<'kanban' | 'list'>('kanban')
            const [showModal, setShowModal] = useState(false)
                const [search, setSearch] = useState('')
                    const [selected, setSelected] = useState<Contract | null>(null)
                        const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
                          
                            const filtered = contracts.filter(c =>
                                  c.title.toLowerCase().includes(search.toLowerCase()) ||
                                  c.client.toLowerCase().includes(search.toLowerCase())
                                )
                              
                                const advanceStatus = (id: string) => {
                                      setContracts(prev => prev.map(c => {
                                              if (c.id !== id) return c
                                                      const idx = STATUS_ORDER.indexOf(c.status)
                                                              const next = STATUS_ORDER[Math.min(idx + 1, STATUS_ORDER.length - 1)]
                                                                      return { ...c, status: next }
                                      }))
                                }
                                  
                                    const saveContract = (c: Contract) => {
                                          setContracts(prev => [c, ...prev])
                                                setShowModal(false)
                                    }
                                      
                                        const deleteContract = (id: string) => {
                                              setContracts(prev => prev.filter(c => c.id !== id))
                                                    if (selected?.id === id) setSelected(null)
                                                          setDeleteConfirm(null)
                                        }
                                          
                                            const columns = [
                                              { key: 'draft' as ContractStatus, label: 'Draft', color: 'border-slate-600', dot: 'bg-slate-400' },
                                              { key: 'sent' as ContractStatus, label: 'Sent', color: 'border-blue-500/40', dot: 'bg-blue-400' },
                                              { key: 'signed' as ContractStatus, label: 'Signed', color: 'border-emerald-500/40', dot: 'bg-emerald-400' },
                                              { key: 'expired' as ContractStatus, label: 'Expired', color: 'border-rose-500/40', dot: 'bg-rose-400' },
                                                ]
                                              
                                                const stats = {
                                                      total: contracts.length,
                                                      signed: contracts.filter(c => c.status === 'signed').length,
                                                      pending: contracts.filter(c => c.status === 'sent').length,
                                                      totalValue: contracts.filter(c => c.value !== '—').reduce((s, c) => s + parseInt(c.value.replace(/[^0-9]/g, '')), 0),
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
                                                                                                                            <h1 className="text-2xl font-black text-white tracking-tight">Contracts</h1>h1>
                                                                                                                            <p className="text-slate-400 text-sm mt-1">Manage your contract pipeline</p>p>
                                                                                                              </div>div>
                                                                                                            <div className="flex items-center gap-3">
                                                                                                                            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
                                                                                                                              {(['kanban', 'list'] as const).map(v => (
                                                                                <button
                                                                                                        key={v}
                                                                                                        onClick={() => setView(v)}
                                                                                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${view === v ? 'bg-amber-400 text-black' : 'text-slate-400 hover:text-white'}`}
                                                                                                      >
                                                                                  {v}
                                                                                  </button>button>
                                                                              ))}
                                                                                                                              </div>div>
                                                                                                                            <button
                                                                                                                                                onClick={() => setShowModal(true)}
                                                                                                                                                className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 text-black font-bold text-sm rounded-xl hover:bg-amber-300 transition-colors"
                                                                                                                                              >
                                                                                                                                              <Plus className="w-4 h-4" /> New Contract
                                                                                                                              </button>button>
                                                                                                              </div>div>
                                                                                                </div>div>
                                                                                  
                                                                                    {/* Stats */}
                                                                                              <div className="grid grid-cols-4 gap-4 mb-6">
                                                                                                {[
                                                            { label: 'Total Contracts', value: stats.total.toString(), color: 'text-white' },
                                                            { label: 'Signed', value: stats.signed.toString(), color: 'text-emerald-400' },
                                                            { label: 'Awaiting Signature', value: stats.pending.toString(), color: 'text-blue-400' },
                                                            { label: 'Total Contract Value', value: `£${stats.totalValue.toLocaleString()}`, color: 'text-amber-400' },
                                                                          ].map(stat => (
                                                                                            <div key={stat.label} className="bg-[#0A1020] border border-[#1A2540] rounded-2xl p-5">
                                                                                                              <p className="text-xs text-slate-500 mb-1">{stat.label}</p>p>
                                                                                                              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>p>
                                                                                              </div>div>
                                                                                          ))}
                                                                                                </div>div>
                                                                                  
                                                                                    {/* Search */}
                                                                                              <div className="relative mb-6 max-w-sm">
                                                                                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                                                                            <input
                                                                                                                              value={search}
                                                                                                                              onChange={e => setSearch(e.target.value)}
                                                                                                                              placeholder="Search contracts..."
                                                                                                                              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
                                                                                                                            />
                                                                                                </div>div>
                                                                                  
                                                                                    {/* Kanban view */}
                                                                                    {view === 'kanban' && (
                                                                          <div className="grid grid-cols-4 gap-4">
                                                                            {columns.map(col => {
                                                                                              const colContracts = filtered.filter(c => c.status === col.key)
                                                                                                                  return (
                                                                                                                                        <div key={col.key} className={`rounded-2xl border-t-2 ${col.color} bg-[#0A1020] border border-[#1A2540] p-4`}>
                                                                                                                                                              <div className="flex items-center gap-2 mb-4">
                                                                                                                                                                                      <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                                                                                                                                                                                      <span className="text-xs font-bold text-white uppercase tracking-wide">{col.label}</span>span>
                                                                                                                                                                                      <span className="text-xs text-slate-500 ml-auto">{colContracts.length}</span>span>
                                                                                                                                                                </div>div>
                                                                                                                                                              <div className="space-y-3">
                                                                                                                                                                {colContracts.map(c => (
                                                                                                                                                                    <motion.div
                                                                                                                                                                                                  key={c.id}
                                                                                                                                                                                                  whileHover={{ y: -2 }}
                                                                                                                                                                                                  onClick={() => setSelected(c)}
                                                                                                                                                                                                  className="p-4 rounded-xl bg-[#060C18] border border-white/5 cursor-pointer hover:border-white/10 transition-all group"
                                                                                                                                                                                                >
                                                                                                                                                                                                <div className="flex items-start justify-between mb-2">
                                                                                                                                                                                                                              <p className="text-xs font-semibold text-white leading-snug flex-1 pr-2">{c.title}</p>p>
                                                                                                                                                                                                                              <button
                                                                                                                                                                                                                                                                onClick={e => { e.stopPropagation(); setDeleteConfirm(c.id) }}
                                                                                                                                                                                                                                                                className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                                                                                                                                                                                                                                              >
                                                                                                                                                                                                                                                              <Trash2 className="w-3.5 h-3.5 text-slate-600 hover:text-red-400" />
                                                                                                                                                                                                                                                            </button>button>
                                                                                                                                                                                                                            </div>div>
                                                                                                                                                                                                <p className="text-[10px] text-slate-500 mb-1">{c.client}</p>p>
                                                                                                                                                                                                <div className="flex items-center justify-between mt-3">
                                                                                                                                                                                                                              <span className="text-[10px] text-slate-400">{c.value}</span>span>
                                                                                                                                                                                                                              <span className="text-[10px] text-slate-500">{c.date}</span>span>
                                                                                                                                                                                                                            </div>div>
                                                                                                                                                                      {c.status !== 'signed' && c.status !== 'expired' && (
                                                                                                                                                                                                                                <button
                                                                                                                                                                                                                                                                  onClick={e => { e.stopPropagation(); advanceStatus(c.id) }}
                                                                                                                                                                                                                                                                  className="mt-3 w-full text-[10px] font-semibold text-amber-400 hover:text-amber-300 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-amber-400/5 hover:bg-amber-400/10 transition-colors"
                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                Advance <ArrowRight className="w-3 h-3" />
                                                                                                                                                                                                                                                              </button>button>
                                                                                                                                                                                                )}
                                                                                                                                                                      </motion.div>motion.div>
                                                                                                                                                                  ))}
                                                                                                                                                                {colContracts.length === 0 && (
                                                                                                                                                                    <div className="py-6 text-center text-[11px] text-slate-600">No contracts</div>div>
                                                                                                                                                                                      )}
                                                                                                                                                                </div>div>
                                                                                                                                          </div>div>
                                                                                                                                      )
                                                                            })}
                                                                          </div>div>
                                                                                              )}
                                                                                  
                                                                                    {/* List view */}
                                                                                    {view === 'list' && (
                                                                          <div className="bg-[#0A1020] border border-[#1A2540] rounded-2xl overflow-hidden">
                                                                                          <div className="grid grid-cols-12 px-6 py-3 border-b border-[#1A2540] text-xs text-slate-500 font-semibold uppercase tracking-wide">
                                                                                                            <span className="col-span-4">Contract</span>span>
                                                                                                            <span className="col-span-2">Client</span>span>
                                                                                                            <span className="col-span-1">Type</span>span>
                                                                                                            <span className="col-span-2">Status</span>span>
                                                                                                            <span className="col-span-1 text-right">Value</span>span>
                                                                                                            <span className="col-span-1 text-right">Date</span>span>
                                                                                                            <span className="col-span-1"></span>span>
                                                                                            </div>div>
                                                                            {filtered.length === 0 ? (
                                                                                              <div className="py-16 text-center text-slate-500">
                                                                                                                  <FileText className="w-8 h-8 mx-auto mb-3 opacity-30" />
                                                                                                                  <p className="text-sm">No contracts found</p>p>
                                                                                                </div>div>
                                                                                            ) : filtered.map((c, i) => (
                                                                                              <motion.div
                                                                                                                    key={c.id}
                                                                                                                    initial={{ opacity: 0 }}
                                                                                                                    animate={{ opacity: 1 }}
                                                                                                                    transition={{ delay: i * 0.03 }}
                                                                                                                    className="group grid grid-cols-12 px-6 py-4 border-b border-[#1A2540] last:border-0 items-center hover:bg-white/3 transition-colors cursor-pointer"
                                                                                                                    onClick={() => setSelected(c)}
                                                                                                                  >
                                                                                                                  <span className="col-span-4 text-sm font-semibold text-white truncate pr-3">{c.title}</span>span>
                                                                                                                  <span className="col-span-2 text-sm text-slate-400">{c.client}</span>span>
                                                                                                                  <span className="col-span-1 text-xs text-slate-500">{c.type}</span>span>
                                                                                                                  <span className="col-span-2">
                                                                                                                                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-full ${STATUS_STYLE[c.status]}`}>
                                                                                                                                                                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[c.status]}`} />
                                                                                                                                          {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                                                                                                                                          </span>span>
                                                                                                                    </span>span>
                                                                                                                  <span className="col-span-1 text-sm text-slate-300 text-right">{c.value}</span>span>
                                                                                                                  <span className="col-span-1 text-xs text-slate-500 text-right">{c.date}</span>span>
                                                                                                                  <span className="col-span-1 flex justify-end">
                                                                                                                                        <button
                                                                                                                                                                  onClick={e => { e.stopPropagation(); setDeleteConfirm(c.id) }}
                                                                                                                                                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-500/10"
                                                                                                                                                                >
                                                                                                                                                                <Trash2 className="w-3.5 h-3.5 text-slate-500 hover:text-red-400" />
                                                                                                                                          </button>button>
                                                                                                                    </span>span>
                                                                                                </motion.div>motion.div>
                                                                                            ))}
                                                                          </div>div>
                                                                                              )}
                                                                                  </div>div>
                                                                        </div>div>
                                                                </div>div>
                                                          
                                                            {/* Modals */}
                                                                <AnimatePresence>
                                                                  {showModal && <NewContractModal onClose={() => setShowModal(false)} onSave={saveContract} />}
                                                                
                                                                  {selected && (
                                                                      <motion.div
                                                                                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                                                                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                                                    onClick={() => setSelected(null)}
                                                                                  >
                                                                                  <motion.div
                                                                                                  className="bg-[#0A1020] border border-white/10 rounded-2xl p-7 w-full max-w-md shadow-2xl"
                                                                                                  initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                                                                                                  onClick={e => e.stopPropagation()}
                                                                                                >
                                                                                                <div className="flex items-start justify-between mb-5">
                                                                                                                <div>
                                                                                                                                  <h2 className="text-lg font-bold text-white mb-1">{selected.title}</h2>h2>
                                                                                                                                  <p className="text-sm text-slate-400">{selected.client}</p>p>
                                                                                                                  </div>div>
                                                                                                                <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>button>
                                                                                                  </div>div>
                                                                                                <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
                                                                                                                <div>
                                                                                                                                  <p className="text-xs text-slate-500 mb-0.5">Status</p>p>
                                                                                                                                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLE[selected.status]}`}>
                                                                                                                                                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[selected.status]}`} />
                                                                                                                                    {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                                                                                                                                    </span>span>
                                                                                                                  </div>div>
                                                                                                                <div>
                                                                                                                                  <p className="text-xs text-slate-500 mb-0.5">Type</p>p>
                                                                                                                                  <p className="text-white font-medium">{selected.type}</p>p>
                                                                                                                  </div>div>
                                                                                                                <div>
                                                                                                                                  <p className="text-xs text-slate-500 mb-0.5">Value</p>p>
                                                                                                                                  <p className="text-white font-medium">{selected.value}</p>p>
                                                                                                                  </div>div>
                                                                                                                <div>
                                                                                                                                  <p className="text-xs text-slate-500 mb-0.5">Date</p>p>
                                                                                                                                  <p className="text-white font-medium">{selected.date}</p>p>
                                                                                                                  </div>div>
                                                                                                  </div>div>
                                                                                    {selected.status !== 'signed' && selected.status !== 'expired' && (
                                                                                                                  <button
                                                                                                                                      onClick={() => { advanceStatus(selected.id); setSelected(prev => prev ? { ...prev, status: STATUS_ORDER[Math.min(STATUS_ORDER.indexOf(prev.status) + 1, 3)] } : null) }}
                                                                                                                                      className="w-full py-2.5 bg-amber-400 text-black font-bold text-sm rounded-xl hover:bg-amber-300 transition-colors flex items-center justify-center gap-2"
                                                                                                                                    >
                                                                                                                                    Advance to {STATUS_ORDER[Math.min(STATUS_ORDER.indexOf(selected.status) + 1, 3)].charAt(0).toUpperCase() + STATUS_ORDER[Math.min(STATUS_ORDER.indexOf(selected.status) + 1, 3)].slice(1)}
                                                                                                                                    <ChevronRight className="w-4 h-4" />
                                                                                                                    </button>button>
                                                                                                )}
                                                                                  </motion.div>motion.div>
                                                                      </motion.div>motion.div>
                                                                    )}
                                                                
                                                                  {deleteConfirm && (
                                                                      <motion.div
                                                                                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm"
                                                                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                                                  >
                                                                                  <motion.div
                                                                                                  className="bg-[#0A1020] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
                                                                                                  initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                                                                                                >
                                                                                                <h3 className="text-base font-bold text-white mb-2">Delete contract?</h3>h3>
                                                                                                <p className="text-sm text-slate-400 mb-5">This action cannot be undone.</p>p>
                                                                                                <div className="flex gap-3">
                                                                                                                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 bg-white/5 border border-white/10 text-white font-semibold text-sm rounded-xl hover:bg-white/10 transition-colors">Cancel</button>button>
                                                                                                                <button onClick={() => deleteContract(deleteConfirm)} className="flex-1 py-2.5 bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-sm rounded-xl hover:bg-red-500/30 transition-colors">Delete</button>button>
                                                                                                  </div>div>
                                                                                  </motion.div>motion.div>
                                                                      </motion.div>motion.div>
                                                                    )}
                                                                </AnimatePresence>AnimatePresence>
                                                          </div>div>
                                                        )
                                                      }</motion.div>
