'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'

export const dynamic = 'force-dynamic'

type Contract = {
  id: string
  title: string
  client: string
  value: string
  date: string
  status: 'draft' | 'sent' | 'signed' | 'expired'
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

const columns: { key: Contract['status'], label: string, color: string, dot: string }[] = [
  { key: 'draft', label: 'Draft', color: 'border-slate-600', dot: 'bg-slate-400' },
  { key: 'sent', label: 'Sent', color: 'border-blue-500/40', dot: 'bg-blue-400' },
  { key: 'signed', label: 'Signed', color: 'border-emerald-500/40', dot: 'bg-emerald-400' },
  { key: 'expired', label: 'Expired', color: 'border-rose-500/40', dot: 'bg-rose-400' },
]

const statusColors: Record<Contract['status'], string> = {
  draft: 'bg-slate-500/20 text-slate-300',
  sent: 'bg-blue-500/20 text-blue-300',
  signed: 'bg-emerald-500/20 text-emerald-300',
  expired: 'bg-rose-500/20 text-rose-300',
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>(initialContracts)
  const [view, setView] = useState<'kanban' | 'list'>('kanban')
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Contract | null>(null)
  const [form, setForm] = useState({ title: '', client: '', value: '', type: 'Production', date: '' })

  const filtered = contracts.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.client.toLowerCase().includes(search.toLowerCase())
  )

  const advanceStatus = (id: string) => {
    const order: Contract['status'][] = ['draft', 'sent', 'signed', 'expired']
    setContracts(prev => prev.map(c => {
      if (c.id !== id) return c
      const idx = order.indexOf(c.status)
      return { ...c, status: order[Math.min(idx + 1, order.length - 1)] }
    }))
  }

  const deleteContract = (id: string) => {
    setContracts(prev => prev.filter(c => c.id !== id))
    setSelected(null)
  }

  const createContract = () => {
    if (!form.title || !form.client) return
    const newC: Contract = {
      id: `c${Date.now()}`,
      title: form.title,
      client: form.client,
      value: form.value || '—',
      date: form.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'draft',
      type: form.type,
    }
    setContracts(prev => [newC, ...prev])
    setForm({ title: '', client: '', value: '', type: 'Production', date: '' })
    setShowModal(false)
  }

  const stats = {
    total: contracts.length,
    signed: contracts.filter(c => c.status === 'signed').length,
    pending: contracts.filter(c => c.status === 'sent').length,
    draft: contracts.filter(c => c.status === 'draft').length,
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#04080F' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopHeader />
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-white">Contracts</h1>
              <p className="text-slate-400 text-sm">Manage all your production agreements</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex rounded-xl overflow-hidden border border-white/5">
                {(['kanban', 'list'] as const).map(v => (
                  <button key={v} onClick={() => setView(v)}
                    className={`px-4 py-2 text-sm font-medium transition-all ${view === v ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'}`}>
                    {v === 'kanban' ? '⬛ Kanban' : '☰ List'}
                  </button>
                ))}
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setShowModal(true)}
                className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded-xl text-sm transition-all">
                + New Contract
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: stats.total, color: 'text-white' },
              { label: 'Signed', value: stats.signed, color: 'text-emerald-400' },
              { label: 'Awaiting', value: stats.pending, color: 'text-blue-400' },
              { label: 'Draft', value: stats.draft, color: 'text-slate-400' },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-white/5 p-4 text-center" style={{ background: '#0A1020' }}>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-500 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Search */}
          <div className="mb-6">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search contracts..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-500/50 transition-colors" />
          </div>

          {/* Kanban View */}
          {view === 'kanban' && (
            <div className="grid grid-cols-4 gap-4">
              {columns.map((col, ci) => {
                const colContracts = filtered.filter(c => c.status === col.key)
                return (
                  <motion.div key={col.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.1 }}>
                    <div className={`rounded-2xl border ${col.color} p-4 min-h-64`} style={{ background: '#0A1020' }}>
                      <div className="flex items-center gap-2 mb-4">
                        <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                        <span className="text-sm font-semibold text-white">{col.label}</span>
                        <span className="ml-auto text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{colContracts.length}</span>
                      </div>
                      <div className="space-y-3">
                        <AnimatePresence>
                          {colContracts.map(c => (
                            <motion.div key={c.id} layout
                              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                              onClick={() => setSelected(c)}
                              className="p-3 rounded-xl bg-white/5 hover:bg-white/8 border border-white/5 hover:border-white/10 cursor-pointer transition-all group">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <p className="text-xs font-semibold text-white leading-tight flex-1">{c.title}</p>
                              </div>
                              <p className="text-xs text-slate-500 mb-2">{c.client}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-amber-400">{c.value}</span>
                                <span className="text-xs text-slate-500">{c.date}</span>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400">{c.type}</span>
                                {col.key !== 'signed' && col.key !== 'expired' && (
                                  <button onClick={e => { e.stopPropagation(); advanceStatus(c.id) }}
                                    className="text-xs text-amber-400 hover:text-amber-300 opacity-0 group-hover:opacity-100 transition-all">
                                    Advance →
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        {colContracts.length === 0 && (
                          <div className="text-center py-8 text-slate-600 text-xs">No contracts</div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}

          {/* List View */}
          {view === 'list' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: '#0A1020' }}>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Contract', 'Client', 'Type', 'Value', 'Date', 'Status', ''].map(h => (
                      <th key={h} className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <motion.tr key={c.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      onClick={() => setSelected(c)}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-white">{c.title}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">{c.client}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{c.type}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-amber-400">{c.value}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{c.date}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[c.status]}`}>
                          {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          {c.status !== 'signed' && c.status !== 'expired' && (
                            <button onClick={e => { e.stopPropagation(); advanceStatus(c.id) }}
                              className="text-xs text-amber-400 hover:text-amber-300">Advance</button>
                          )}
                          <button onClick={e => { e.stopPropagation(); deleteContract(c.id) }}
                            className="text-xs text-rose-400 hover:text-rose-300">Delete</button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-16 text-slate-600">No contracts found</div>
              )}
            </motion.div>
          )}

          {/* Contract Detail Modal */}
          <AnimatePresence>
            {selected && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setSelected(null)}>
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                  className="rounded-2xl border border-white/10 p-6 max-w-md w-full" style={{ background: '#0A1020' }}
                  onClick={e => e.stopPropagation()}>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">{selected.type}</p>
                      <h2 className="text-lg font-bold text-white">{selected.title}</h2>
                      <p className="text-sm text-slate-400 mt-1">{selected.client}</p>
                    </div>
                    <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white text-xl">×</button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-white/5">
                      <p className="text-xs text-slate-500 mb-1">Contract Value</p>
                      <p className="text-lg font-bold text-amber-400">{selected.value}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5">
                      <p className="text-xs text-slate-500 mb-1">Date</p>
                      <p className="text-sm font-semibold text-white">{selected.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-6">
                    <span className={`text-sm px-3 py-1 rounded-full font-medium ${statusColors[selected.status]}`}>
                      {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    {selected.status !== 'signed' && selected.status !== 'expired' && (
                      <button onClick={() => { advanceStatus(selected.id); setSelected(null) }}
                        className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold py-2.5 rounded-xl text-sm transition-all">
                        Advance Status
                      </button>
                    )}
                    <button onClick={() => deleteContract(selected.id)}
                      className="flex-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-semibold py-2.5 rounded-xl text-sm transition-all">
                      Delete
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* New Contract Modal */}
          <AnimatePresence>
            {showModal && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowModal(false)}>
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                  className="rounded-2xl border border-white/10 p-6 max-w-md w-full" style={{ background: '#0A1020' }}
                  onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-white">New Contract</h2>
                    <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white text-xl">×</button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Contract Title *</label>
                      <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                        placeholder="e.g. Neon Nights — Production Agreement"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-amber-500/50" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Client *</label>
                      <input value={form.client} onChange={e => setForm(p => ({ ...p, client: e.target.value }))}
                        placeholder="e.g. Neon Films Ltd"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-amber-500/50" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Contract Value</label>
                        <input value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))}
                          placeholder="£0.00"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-amber-500/50" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Type</label>
                        <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500/50">
                          {['Production', 'Director', 'Crew', 'Service', 'NDA'].map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Due Date</label>
                      <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500/50" />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setShowModal(false)}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 font-medium py-2.5 rounded-xl text-sm transition-all">
                      Cancel
                    </button>
                    <button onClick={createContract}
                      className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold py-2.5 rounded-xl text-sm transition-all">
                      Create Draft
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
