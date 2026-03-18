'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Plus, Search, Check, X, Eye, ChevronRight,
  Clock, AlertCircle, CheckCircle2, Send, PenLine, Sparkles,
  MoreVertical, Edit2, Trash2, TrendingUp, Shield
} from 'lucide-react'
import clsx from 'clsx'

interface Contract {
  id: string
  title: string
  client_name: string | null
  status: 'draft' | 'sent' | 'signed' | 'expired' | 'cancelled'
  value: number | null
  start_date: string | null
  end_date: string | null
  notes: string | null
  created_at: string
}

const pipeline = [
  { key: 'draft',     label: 'Draft',     icon: PenLine,      color: 'text-white/40',    bg: 'bg-white/5',         border: 'border-white/10' },
  { key: 'sent',      label: 'Sent',      icon: Send,         color: 'text-blue-400',    bg: 'bg-blue-400/10',     border: 'border-blue-400/30' },
  { key: 'signed',    label: 'Signed',    icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10',  border: 'border-emerald-400/30' },
  { key: 'expired',   label: 'Expired',   icon: Clock,        color: 'text-amber-400',   bg: 'bg-amber-400/10',    border: 'border-amber-400/30' },
  { key: 'cancelled', label: 'Cancelled', icon: AlertCircle,  color: 'text-red-400',     bg: 'bg-red-400/10',      border: 'border-red-400/30' },
]

const nextStatus: Record<string, Contract['status']> = {
  draft: 'sent', sent: 'signed'
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const rowVariant = {
  hidden: { opacity: 0, x: -16 },
  show:   { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 320, damping: 28 } }
}
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22,1,0.36,1] } }
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

export default function ContractsPage() {
  const supabase = createClient()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [viewModal, setViewModal] = useState<Contract | null>(null)
  const [editContract, setEditContract] = useState<Contract | null>(null)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' } | null>(null)
  const [form, setForm] = useState({
    title: '', client_name: '', value: '', start_date: '', end_date: '', notes: '', status: 'draft' as Contract['status']
  })

  const showToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function load() {
    const { data } = await supabase.from('contracts').select('*').order('created_at', { ascending: false })
    setContracts((data || []) as Contract[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = contracts.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = c.title.toLowerCase().includes(q) || (c.client_name || '').toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  const stats = {
    total:  contracts.length,
    signed: contracts.filter(c => c.status === 'signed').length,
    draft:  contracts.filter(c => c.status === 'draft').length,
    value:  contracts.filter(c => c.status === 'signed').reduce((s, c) => s + (c.value || 0), 0),
  }

  function openCreate() {
    setEditContract(null)
    setForm({ title:'', client_name:'', value:'', start_date:'', end_date:'', notes:'', status:'draft' })
    setShowModal(true)
  }

  function openEdit(c: Contract) {
    setEditContract(c)
    setForm({
      title: c.title, client_name: c.client_name||'', value: c.value?.toString()||'',
      start_date: c.start_date?.slice(0,10)||'', end_date: c.end_date?.slice(0,10)||'',
      notes: c.notes||'', status: c.status
    })
    setShowModal(true)
    setMenuOpen(null)
  }

  async function saveContract() {
    const payload = {
      title: form.title, client_name: form.client_name||null, status: form.status,
      value: form.value ? parseFloat(form.value) : null,
      start_date: form.start_date||null, end_date: form.end_date||null, notes: form.notes||null
    }
    if (editContract) {
      await supabase.from('contracts').update(payload).eq('id', editContract.id)
      showToast('Contract updated')
    } else {
      await supabase.from('contracts').insert(payload)
      showToast('Contract created')
    }
    setShowModal(false)
    load()
  }

  async function deleteContract(id: string) {
    await supabase.from('contracts').delete().eq('id', id)
    showToast('Contract deleted')
    setMenuOpen(null)
    load()
  }

  async function advanceStatus(c: Contract) {
    const next = nextStatus[c.status]
    if (!next) return
    await supabase.from('contracts').update({ status: next }).eq('id', c.id)
    showToast(`Moved to ${next}`, 'info')
    setViewModal(null)
    load()
  }

  const fmtCurrency = (n: number) => new Intl.NumberFormat('en-GB', { style:'currency', currency:'GBP', maximumFractionDigits:0 }).format(n)
  const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })

  const getPipeline = (status: string) => pipeline.find(p => p.key === status) || pipeline[0]

  return (
    <div className="min-h-screen bg-[#04080F] p-6 lg:p-8">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity:0, y:-20, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:-20, scale:0.95 }} transition={{ type:'spring', stiffness:400, damping:25 }}
            className={clsx('fixed top-6 right-6 z-50 px-5 py-3 rounded-xl flex items-center gap-2 shadow-xl text-white',
              toast.type === 'success' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-blue-500 shadow-blue-500/20')}>
            <Check className="w-4 h-4" /> {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div variants={container} initial="hidden" animate="show" className="mb-8">
        <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-amber-400" /> Contracts
            </h1>
            <p className="text-white/40 text-sm mt-1">{stats.total} total · {stats.signed} signed</p>
          </div>
          <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
            onClick={openCreate}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#04080F] font-semibold px-4 py-2.5 rounded-xl text-sm">
            <Plus className="w-4 h-4" /> New Contract
          </motion.button>
        </motion.div>

        {/* Pipeline Overview */}
        <motion.div variants={container} className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {pipeline.map(p => {
            const count = contracts.filter(c => c.status === p.key).length
            return (
              <motion.button key={p.key} variants={fadeUp}
                onClick={() => setStatusFilter(statusFilter === p.key ? 'all' : p.key)}
                whileHover={{ y:-2 }} whileTap={{ scale:0.97 }}
                className={clsx('p-4 rounded-2xl border text-left transition-all',
                  statusFilter === p.key
                    ? `${p.bg} ${p.border} ${p.color}`
                    : 'bg-[#0A1020] border-white/[0.06] hover:border-white/10'
                )}>
                <p.icon className={clsx('w-4 h-4 mb-2', statusFilter === p.key ? p.color : 'text-white/30')} />
                <p className={clsx('text-xl font-bold', statusFilter === p.key ? p.color : 'text-white')}>{count}</p>
                <p className={clsx('text-xs mt-0.5', statusFilter === p.key ? p.color : 'text-white/40')}>{p.label}</p>
              </motion.button>
            )
          })}
        </motion.div>

        {/* Stats row */}
        <motion.div variants={container} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={FileText}   label="Total"        value={stats.total.toString()}  accent="bg-violet-400/10 text-violet-400" />
          <StatCard icon={CheckCircle2} label="Signed"     value={stats.signed.toString()} accent="bg-emerald-400/10 text-emerald-400" />
          <StatCard icon={PenLine}    label="Drafts"       value={stats.draft.toString()}  accent="bg-white/5 text-white/50" />
          <StatCard icon={Shield}     label="Signed Value" value={stats.value > 0 ? fmtCurrency(stats.value) : '—'} accent="bg-amber-400/10 text-amber-400" />
        </motion.div>

        {/* Search */}
        <motion.div variants={fadeUp} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search contracts or clients…"
            className="w-full bg-[#0A1020] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50" />
        </motion.div>
      </motion.div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-[#0A1020] border border-white/[0.06] rounded-2xl p-5 h-20 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }}
          className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-6">
            <FileText className="w-8 h-8 text-white/20" />
          </div>
          <h3 className="text-white/60 text-lg font-medium mb-2">No contracts found</h3>
          <p className="text-white/30 text-sm mb-6">Create your first contract to get started</p>
          <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
            onClick={openCreate}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#04080F] font-semibold px-5 py-2.5 rounded-xl text-sm">
            <Plus className="w-4 h-4" /> New Contract
          </motion.button>
        </motion.div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
          {filtered.map(c => {
            const p = getPipeline(c.status)
            return (
              <motion.div key={c.id} variants={rowVariant}
                whileHover={{ x: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
                className="bg-[#0A1020] border border-white/[0.06] hover:border-white/10 rounded-2xl p-5 flex items-center gap-4 group transition-colors relative">
                {/* Icon */}
                <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', p.bg)}>
                  <p.icon className={clsx('w-5 h-5', p.color)} />
                </div>

                {/* Main */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-white font-medium text-sm truncate">{c.title}</h3>
                    <span className={clsx('px-2 py-0.5 rounded-lg text-xs font-medium shrink-0', p.bg, p.color)}>{p.label}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/40">
                    {c.client_name && <span>{c.client_name}</span>}
                    {c.value && <span className="text-amber-400 font-medium">{fmtCurrency(c.value)}</span>}
                    {c.end_date && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{fmtDate(c.end_date)}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {nextStatus[c.status] && (
                    <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                      onClick={() => advanceStatus(c)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-amber-400/10 hover:text-amber-400 text-white/50 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100">
                      <ChevronRight className="w-3 h-3" />
                      Move to {nextStatus[c.status]}
                    </motion.button>
                  )}
                  <button onClick={() => setViewModal(c)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-all">
                    <Eye className="w-4 h-4" />
                  </button>
                  <div className="relative">
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
                          <button onClick={() => deleteContract(c.id)} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/5">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* View Modal */}
      <AnimatePresence>
        {viewModal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setViewModal(null)}>
            <motion.div initial={{ opacity:0, scale:0.92, y:20 }} animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.92, y:20 }} transition={{ type:'spring', stiffness:360, damping:28 }}
              className="bg-[#0A1020] border border-white/[0.08] rounded-2xl p-6 w-full max-w-lg shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">{viewModal.title}</h2>
                <button onClick={() => setViewModal(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status pipeline */}
              <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
                {pipeline.slice(0,3).map((p, i) => {
                  const isActive = viewModal.status === p.key
                  const isPast = pipeline.slice(0,3).findIndex(x => x.key === viewModal.status) > i
                  return (
                    <div key={p.key} className="flex items-center gap-1 shrink-0">
                      <div className={clsx('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                        isActive ? `${p.bg} ${p.color} border ${p.border}` :
                        isPast ? 'bg-emerald-400/10 text-emerald-400' : 'bg-white/[0.03] text-white/30')}>
                        {isPast ? <Check className="w-3 h-3" /> : <p.icon className="w-3 h-3" />}
                        {p.label}
                      </div>
                      {i < 2 && <ChevronRight className="w-3 h-3 text-white/20" />}
                    </div>
                  )
                })}
              </div>

              <div className="space-y-3 mb-6">
                {viewModal.client_name && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">Client</span>
                    <span className="text-sm text-white">{viewModal.client_name}</span>
                  </div>
                )}
                {viewModal.value && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">Value</span>
                    <span className="text-sm text-amber-400 font-semibold">{fmtCurrency(viewModal.value)}</span>
                  </div>
                )}
                {viewModal.start_date && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">Start Date</span>
                    <span className="text-sm text-white">{fmtDate(viewModal.start_date)}</span>
                  </div>
                )}
                {viewModal.end_date && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">End Date</span>
                    <span className="text-sm text-white">{fmtDate(viewModal.end_date)}</span>
                  </div>
                )}
                {viewModal.notes && (
                  <div>
                    <span className="text-xs text-white/40 block mb-1.5">Notes</span>
                    <p className="text-sm text-white/60 bg-white/[0.03] rounded-xl p-3">{viewModal.notes}</p>
                  </div>
                )}
              </div>

              {nextStatus[viewModal.status] && (
                <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                  onClick={() => advanceStatus(viewModal)}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-[#04080F] font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  Move to {nextStatus[viewModal.status]}
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit Modal */}
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
                  {editContract ? 'Edit Contract' : 'New Contract'}
                </h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { label:'Contract Title', key:'title', type:'text', placeholder:'Service Agreement' },
                  { label:'Client Name', key:'client_name', type:'text', placeholder:'Acme Corp' },
                  { label:'Value (£)', key:'value', type:'number', placeholder:'0' },
                  { label:'Start Date', key:'start_date', type:'date', placeholder:'' },
                  { label:'End Date', key:'end_date', type:'date', placeholder:'' },
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
                  <label className="block text-xs text-white/50 mb-1.5 font-medium">Notes</label>
                  <textarea rows={3} placeholder="Any notes or terms…"
                    value={form.notes}
                    onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full bg-[#060C18] border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50 resize-none" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5 font-medium">Status</label>
                  <select value={form.status} onChange={e => setForm(prev => ({ ...prev, status: e.target.value as Contract['status'] }))}
                    className="w-full bg-[#060C18] border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50">
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="signed">Signed</option>
                    <option value="expired">Expired</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white font-medium py-2.5 rounded-xl text-sm">
                  Cancel
                </button>
                <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                  onClick={saveContract} disabled={!form.title}
                  className="flex-1 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-[#04080F] font-semibold py-2.5 rounded-xl text-sm">
                  {editContract ? 'Save Changes' : 'Create Contract'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
