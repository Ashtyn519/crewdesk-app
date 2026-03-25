'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'
import { Plus, Search, X, Trash2, FileText, ChevronRight, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

type ContractStatus = 'draft' | 'sent' | 'signed' | 'expired'
type Contract = { id: string; title: string; client: string; value: string; date: string; status: ContractStatus; type: string }

const initialContracts: Contract[] = [
  { id: 'c1', title: 'Neon Nights - Production Agreement', client: 'Neon Films Ltd', value: '£14,500', date: 'Mar 20, 2026', status: 'signed', type: 'Production' },
  { id: 'c2', title: 'City Lights - Director Contract', client: 'BFI Productions', value: '£8,200', date: 'Mar 22, 2026', status: 'sent', type: 'Director' },
  { id: 'c3', title: 'Apex Documentary - Crew Agreement', client: 'Channel 4', value: '£22,000', date: 'Mar 15, 2026', status: 'draft', type: 'Crew' },
  { id: 'c4', title: 'Midnight Run - NDA', client: 'Sky Studios', value: '-', date: 'Feb 28, 2026', status: 'expired', type: 'NDA' },
  { id: 'c5', title: 'Sundown Series - Service Agreement', client: 'ITV', value: '£31,500', date: 'Apr 1, 2026', status: 'sent', type: 'Service' },
  { id: 'c6', title: 'Freelance Camera - Equipment NDA', client: 'Internal', value: '-', date: 'Mar 10, 2026', status: 'signed', type: 'NDA' },
]

const STATUS_STYLE: Record<ContractStatus, string> = {
  draft: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
  sent: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  signed: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  expired: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
}

const STATUS_ORDER: ContractStatus[] = ['draft', 'sent', 'signed', 'expired']

const COLUMNS: { status: ContractStatus; label: string }[] = [
  { status: 'draft', label: 'Draft' },
  { status: 'sent', label: 'Sent' },
  { status: 'signed', label: 'Signed' },
  { status: 'expired', label: 'Expired' },
]

function NewContractModal({ onClose, onSave }: { onClose: () => void; onSave: (c: Contract) => void }) {
  const [form, setForm] = useState({ title: '', client: '', value: '', type: 'Production', date: '' })
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))
  const submit = () => {
    if (!form.title.trim() || !form.client.trim()) return
    onSave({
      id: 'c' + Date.now(),
      title: form.title.trim(),
      client: form.client.trim(),
      value: form.value ? `£${form.value}` : '-',
      date: form.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'draft',
      type: form.type,
    })
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#0A1020] border border-white/10 rounded-2xl p-7 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">New Contract</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1"><X size={18} /></button>
        </div>
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Contract Title *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Production Agreement" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Client *</label>
              <input value={form.client} onChange={e => set('client', e.target.value)} placeholder="Client or studio name" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Value (£)</label>
              <input value={form.value} onChange={e => set('value', e.target.value)} placeholder="e.g. 12000" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Type</label>
              <select value={form.type} onChange={e => set('type', e.target.value)} className="w-full bg-[#0A1020] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50">
                {['Production', 'Director', 'Crew', 'Service', 'NDA', 'Freelance'].map(t => (
                  <option key={t} value={t} className="bg-[#0A1020]">{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Date</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50" />
            </div>
          </div>
        </div>
        <button onClick={submit} disabled={!form.title.trim() || !form.client.trim()} className="w-full py-3 bg-amber-400 text-black font-bold rounded-xl text-sm hover:bg-amber-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Create Contract</button>
      </div>
    </div>
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

  const deleteContract = (id: string) => {
    setContracts(prev => prev.filter(c => c.id !== id))
    setDeleteConfirm(null)
    if (selected?.id === id) setSelected(null)
  }

  const saveNew = (c: Contract) => { setContracts(prev => [c, ...prev]); setShowModal(false) }

  const total = contracts.length
  const signed = contracts.filter(c => c.status === 'signed').length
  const pending = contracts.filter(c => c.status === 'sent').length
  const totalValue = contracts.filter(c => c.value !== '-').reduce((sum, c) => sum + parseFloat(c.value.replace(/[^d.]/g, '') || '0'), 0)

  return (
    <div className="flex h-screen bg-[#04080F] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <TopHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Contracts</h1>
              <p className="text-slate-400 text-sm mt-0.5">Manage agreements, NDAs, and production contracts</p>
            </div>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-black font-semibold rounded-xl text-sm hover:bg-amber-300 transition-colors">
              <Plus size={16} />New Contract
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Contracts', value: total, color: 'text-white' },
              { label: 'Signed', value: signed, color: 'text-emerald-400' },
              { label: 'Pending', value: pending, color: 'text-blue-400' },
              { label: 'Total Value', value: `£${totalValue.toLocaleString()}`, color: 'text-amber-400' },
            ].map(s => (
              <div key={s.label} className="bg-[#0A1020] border border-white/5 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 mb-5">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contracts..." className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
            </div>
            <div className="flex gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
              {(['kanban', 'list'] as const).map(v => (
                <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${view === v ? 'bg-amber-400 text-black' : 'text-slate-400 hover:text-white'}`}>{v}</button>
              ))}
            </div>
          </div>

          {view === 'kanban' && (
            <div className="grid grid-cols-4 gap-4">
              {COLUMNS.map(col => {
                const colContracts = filtered.filter(c => c.status === col.status)
                return (
                  <div key={col.status} className="bg-[#0A1020] border border-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[col.status]}`}>{col.label}</span>
                      <span className="text-xs text-slate-500">{colContracts.length}</span>
                    </div>
                    <div className="space-y-3">
                      {colContracts.map(c => (
                        <div key={c.id} className="bg-[#0F1A2E] border border-white/5 rounded-lg p-3 cursor-pointer hover:border-amber-400/30 transition-colors" onClick={() => setSelected(c)}>
                          <p className="text-sm font-medium text-white mb-1 leading-tight">{c.title}</p>
                          <p className="text-xs text-slate-400 mb-2">{c.client}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-amber-400 font-semibold">{c.value}</span>
                            <span className="text-xs text-slate-500">{c.type}</span>
                          </div>
                        </div>
                      ))}
                      {colContracts.length === 0 && <p className="text-xs text-slate-600 text-center py-4">No contracts</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {view === 'list' && (
            <div className="bg-[#0A1020] border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Title</th>
                    <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Client</th>
                    <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Type</th>
                    <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Value</th>
                    <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Date</th>
                    <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Status</th>
                    <th className="text-right text-xs text-slate-400 font-medium px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <tr key={c.id} className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`} onClick={() => setSelected(c)}>
                      <td className="px-4 py-3"><div className="flex items-center gap-2"><FileText size={14} className="text-slate-400 shrink-0" /><span className="text-sm text-white">{c.title}</span></div></td>
                      <td className="px-4 py-3 text-sm text-slate-300">{c.client}</td>
                      <td className="px-4 py-3 text-sm text-slate-400">{c.type}</td>
                      <td className="px-4 py-3 text-sm text-amber-400 font-medium">{c.value}</td>
                      <td className="px-4 py-3 text-sm text-slate-400">{c.date}</td>
                      <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLE[c.status]}`}>{c.status.charAt(0).toUpperCase() + c.status.slice(1)}</span></td>
                      <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}><button onClick={() => advanceStatus(c.id)} title="Advance" className="text-slate-400 hover:text-amber-400 transition-colors"><ArrowRight size={14} /></button><button onClick={() => setDeleteConfirm(c.id)} className="text-slate-500 hover:text-rose-400 transition-colors"><Trash2 size={14} /></button></div></td>
                    </tr>
                  ))}
                  {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">No contracts found</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {selected && (
        <div className="fixed inset-0 z-40 flex" onClick={() => setSelected(null)}>
          <div className="flex-1 bg-black/40" />
          <div className="w-96 bg-[#0A1020] border-l border-white/10 h-full overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-white">Contract Detail</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div><p className="text-xs text-slate-400 mb-1">Title</p><p className="text-sm font-medium text-white">{selected.title}</p></div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-slate-400 mb-1">Client</p><p className="text-sm text-white">{selected.client}</p></div>
                <div><p className="text-xs text-slate-400 mb-1">Type</p><p className="text-sm text-white">{selected.type}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-slate-400 mb-1">Value</p><p className="text-sm font-semibold text-amber-400">{selected.value}</p></div>
                <div><p className="text-xs text-slate-400 mb-1">Date</p><p className="text-sm text-white">{selected.date}</p></div>
              </div>
              <div><p className="text-xs text-slate-400 mb-1">Status</p><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLE[selected.status]}`}>{selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}</span></div>
            </div>
            <div className="mt-6 space-y-3">
              {selected.status !== 'expired' && (
                <button onClick={() => { advanceStatus(selected.id); setSelected(prev => { if (!prev) return null; const idx = STATUS_ORDER.indexOf(prev.status); return { ...prev, status: STATUS_ORDER[Math.min(idx + 1, STATUS_ORDER.length - 1)] } }) }} className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-400 text-black font-semibold rounded-xl text-sm hover:bg-amber-300 transition-colors">
                  <ChevronRight size={16} />Advance Status
                </button>
              )}
              <button onClick={() => setDeleteConfirm(selected.id)} className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold rounded-xl text-sm hover:bg-rose-500/20 transition-colors">
                <Trash2 size={16} />Delete Contract
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && <NewContractModal onClose={() => setShowModal(false)} onSave={saveNew} />}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0A1020] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Delete Contract</h3>
            <p className="text-sm text-slate-400 mb-6">This action cannot be undone. Are you sure?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-white/10 text-slate-300 rounded-xl text-sm hover:bg-white/5 transition-colors">Cancel</button>
              <button onClick={() => deleteContract(deleteConfirm)} className="flex-1 py-2.5 bg-rose-500 text-white font-semibold rounded-xl text-sm hover:bg-rose-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
