'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'
import { Plus, Search, X, Trash2, FileText, ChevronRight, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

type ContractStatus = 'draft' | 'sent' | 'signed' | 'expired'
type Contract = { id: string; title: string; client: string; value: string; date: string; status: ContractStatus; type: string }

const initialContracts: Contract[] = [
  { id: 'c1', title: 'Website Redesign — Service Agreement', client: 'Apex Solutions Ltd', value: '£14,500', date: 'Mar 20, 2026', status: 'signed', type: 'Service Agreement' },
  { id: 'c2', title: 'Mobile App Development Contract', client: 'Spark Retail', value: '£38,000', date: 'Mar 22, 2026', status: 'sent', type: 'Development Contract' },
  { id: 'c3', title: 'Brand Refresh — Freelancer Agreement', client: 'Meridian Consulting', value: '£8,200', date: 'Mar 15, 2026', status: 'draft', type: 'Freelancer Agreement' },
  { id: 'c4', title: 'Data Platform Migration NDA', client: 'CoreTech Systems', value: '-', date: 'Feb 28, 2026', status: 'expired', type: 'NDA' },
  { id: 'c5', title: 'Marketing Automation — Retainer', client: 'GrowthBase Inc', value: '£5,800/mo', date: 'Apr 1, 2026', status: 'signed', type: 'Retainer' },
  { id: 'c6', title: 'UX Research Study — Statement of Work', client: 'Finova Bank', value: '£22,000', date: 'Mar 10, 2026', status: 'signed', type: 'Statement of Work' },
]

const STATUS_STYLE: Record<ContractStatus, string> = {
  draft: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
  sent: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  signed: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  expired: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
}

const STATUS_ORDER: ContractStatus[] = ['draft', 'sent', 'signed', 'expired']

const CONTRACT_TYPES = ['All', 'Service Agreement', 'Freelancer Agreement', 'Development Contract', 'Retainer', 'NDA', 'Statement of Work']

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>(initialContracts)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [selected, setSelected] = useState<Contract | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newC, setNewC] = useState({ title: '', client: '', value: '', type: 'Service Agreement' })

  const filtered = contracts.filter(c => {
    const matchStatus = statusFilter === 'All' || c.status === statusFilter
    const matchType = typeFilter === 'All' || c.type === typeFilter
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.client.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchType && matchSearch
  })

  const addContract = () => {
    if (!newC.title || !newC.client) return
    const contract: Contract = {
      id: 'c' + Date.now(), title: newC.title, client: newC.client,
      value: newC.value || '-', date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'draft', type: newC.type
    }
    setContracts(prev => [...prev, contract])
    setNewC({ title: '', client: '', value: '', type: 'Service Agreement' })
    setShowAdd(false)
  }

  const remove = (id: string) => {
    setContracts(prev => prev.filter(c => c.id !== id))
    setSelected(null)
  }

  const statusCounts = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = contracts.filter(c => c.status === s).length
    return acc
  }, {} as Record<ContractStatus, number>)

  return (
    <div className="flex min-h-screen bg-[#04080F]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopHeader />
        <main className="flex-1 p-6 overflow-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Contracts</h1>
              <p className="text-sm text-white/40 mt-1">{filtered.length} of {contracts.length} contracts</p>
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" /> New Contract
            </button>
          </div>

          {/* Status summary pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setStatusFilter('All')}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${statusFilter === 'All' ? 'bg-amber-400 text-black border-amber-400' : 'bg-white/5 border-white/10 text-white/60 hover:text-white'}`}
            >
              All ({contracts.length})
            </button>
            {STATUS_ORDER.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(statusFilter === s ? 'All' : s)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${statusFilter === s ? STATUS_STYLE[s] : 'bg-white/5 border-white/10 text-white/60 hover:text-white'}`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)} ({statusCounts[s]})
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search contracts or clients..."
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30"
            />
          </div>

          {/* Contracts list */}
          <div className="space-y-2">
            {filtered.map(c => (
              <div
                key={c.id}
                onClick={() => setSelected(c)}
                className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 cursor-pointer hover:border-amber-400/30 hover:bg-white/[0.07] transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{c.title}</p>
                  <p className="text-white/40 text-xs mt-0.5">{c.client} · {c.type}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-white font-semibold text-sm">{c.value}</p>
                  <p className="text-white/30 text-xs mt-0.5">{c.date}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${STATUS_STYLE[c.status]}`}>
                  {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                </span>
                <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0" />
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-white/30 text-sm">No contracts match your search.</p>
            </div>
          )}
        </main>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-end" onClick={() => setSelected(null)}>
          <div
            className="w-full max-w-sm bg-[#0D1117] border border-white/10 rounded-2xl m-4 p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-amber-400" />
              </div>
              <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <h2 className="text-white font-bold text-lg mb-1">{selected.title}</h2>
            <p className="text-white/40 text-sm mb-5">{selected.client}</p>
            <div className="space-y-3 mb-5 text-sm">
              <div className="flex justify-between">
                <span className="text-white/30">Status</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLE[selected.status]}`}>
                  {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between"><span className="text-white/30">Type</span><span className="text-white">{selected.type}</span></div>
              <div className="flex justify-between"><span className="text-white/30">Value</span><span className="text-amber-400 font-semibold">{selected.value}</span></div>
              <div className="flex justify-between"><span className="text-white/30">Date</span><span className="text-white/60">{selected.date}</span></div>
            </div>
            <div className="flex gap-2">
              {selected.status === 'draft' && (
                <button className="flex-1 flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-black text-sm font-semibold py-2.5 rounded-xl transition-colors">
                  <ArrowRight className="w-4 h-4" /> Send
                </button>
              )}
              {selected.status === 'sent' && (
                <button className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-400 hover:bg-emerald-300 text-black text-sm font-semibold py-2.5 rounded-xl transition-colors">
                  Mark Signed
                </button>
              )}
              <button
                onClick={() => remove(selected.id)}
                className="px-3 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add contract modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowAdd(false)}>
          <div
            className="w-full max-w-md bg-[#0D1117] border border-white/10 rounded-2xl p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold text-lg">New Contract</h2>
              <button onClick={() => setShowAdd(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input value={newC.title} onChange={e => setNewC(p => ({ ...p, title: e.target.value }))} placeholder="Contract title *"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30" />
              <input value={newC.client} onChange={e => setNewC(p => ({ ...p, client: e.target.value }))} placeholder="Client name *"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30" />
              <input value={newC.value} onChange={e => setNewC(p => ({ ...p, value: e.target.value }))} placeholder="Contract value (e.g. £5,000)"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30" />
              <select value={newC.type} onChange={e => setNewC(p => ({ ...p, type: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none">
                {CONTRACT_TYPES.filter(t => t !== 'All').map(t => (
                  <option key={t} value={t} className="bg-[#04080F]">{t}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 bg-white/5 border border-white/10 text-white/60 py-2.5 rounded-xl text-sm hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={addContract} className="flex-1 bg-amber-400 hover:bg-amber-300 text-black font-semibold py-2.5 rounded-xl text-sm transition-colors">Create Contract</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
