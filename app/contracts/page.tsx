'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import clsx from 'clsx'
import {
  FileText, Plus, Search, Upload, CheckCircle, Clock, AlertCircle,
  XCircle, MoreVertical, Download, Eye, Trash2, FileSignature,
  Calendar, User, DollarSign, ChevronRight, X, ArrowRight,
  Loader2, Filter, Tag, Building2
} from 'lucide-react'

interface Contract {
  id: string
  title: string
  client_name: string
  status: 'draft' | 'sent' | 'signed' | 'expired' | 'cancelled'
  value: number
  start_date: string
  end_date: string
  created_at: string
  file_url?: string
  notes?: string
  project_id?: string
}

const STATUS_CONFIG = {
  draft:     { label: 'Draft',     color: 'text-slate-400',   bg: 'bg-slate-400/10',  border: 'border-slate-400/20', dot: 'bg-slate-400',  icon: FileText },
  sent:      { label: 'Sent',      color: 'text-blue-400',    bg: 'bg-blue-400/10',   border: 'border-blue-400/20',  dot: 'bg-blue-400',   icon: ArrowRight },
  signed:    { label: 'Signed',    color: 'text-emerald-400', bg: 'bg-emerald-400/10',border: 'border-emerald-400/20',dot: 'bg-emerald-400',icon: CheckCircle },
  expired:   { label: 'Expired',   color: 'text-amber-400',   bg: 'bg-amber-400/10',  border: 'border-amber-400/20', dot: 'bg-amber-400',  icon: Clock },
  cancelled: { label: 'Cancelled', color: 'text-red-400',     bg: 'bg-red-400/10',    border: 'border-red-400/20',   dot: 'bg-red-400',    icon: XCircle },
}

const STATUS_STEPS: Contract['status'][] = ['draft', 'sent', 'signed']

const EMPTY_FORM = {
  title: '',
  client_name: '',
  status: 'draft' as Contract['status'],
  value: '',
  start_date: '',
  end_date: '',
  notes: '',
}

function StatusBadge({ status }: { status: Contract['status'] }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border', cfg.color, cfg.bg, cfg.border)}>
      <span className={clsx('w-1.5 h-1.5 rounded-full', cfg.dot)} />
      {cfg.label}
    </span>
  )
}

function StatusPipeline({ status }: { status: Contract['status'] }) {
  const activeIdx = STATUS_STEPS.indexOf(status)
  if (activeIdx === -1) return null
  return (
    <div className="flex items-center gap-0 mt-3">
      {STATUS_STEPS.map((s, i) => {
        const cfg = STATUS_CONFIG[s]
        const done = i <= activeIdx
        const isLast = i === STATUS_STEPS.length - 1
        return (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={clsx(
              'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all border',
              done ? 'bg-amber-500 border-amber-500 text-black' : 'bg-white/5 border-white/10 text-white/30'
            )}>
              {i + 1}
            </div>
            <span className={clsx('text-xs ml-1 mr-2', done ? 'text-white/70' : 'text-white/25')}>{cfg.label}</span>
            {!isLast && (
              <div className={clsx('flex-1 h-px mr-2', done && i < activeIdx ? 'bg-amber-500/50' : 'bg-white/10')} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function AvatarInitials({ name }: { name: string }) {
  const colors = ['bg-blue-500','bg-purple-500','bg-emerald-500','bg-amber-500','bg-rose-500','bg-cyan-500']
  const idx = name.charCodeAt(0) % colors.length
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)
  return (
    <div className={clsx('w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0', colors[idx])}>
      {initials}
    </div>
  )
}

export const dynamic = 'force-dynamic'

export default function ContractsPage() {
  const supabase = createClient()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Contract | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [viewContract, setViewContract] = useState<Contract | null>(null)

  useEffect(() => { loadContracts() }, [])

  async function loadContracts() {
    setLoading(true)
    const { data } = await supabase.from('contracts').select('*').order('created_at', { ascending: false })
    setContracts(data ?? [])
    setLoading(false)
  }

  function openCreate() {
    setEditing(null)
    setForm({ ...EMPTY_FORM })
    setShowModal(true)
  }

  function openEdit(c: Contract) {
    setEditing(c)
    setForm({
      title: c.title,
      client_name: c.client_name,
      status: c.status as Contract['status'],
      value: String(c.value ?? ''),
      start_date: c.start_date ?? '',
      end_date: c.end_date ?? '',
      notes: c.notes ?? '',
    })
    setShowModal(true)
    setOpenMenu(null)
  }

  async function saveContract() {
    setSaving(true)
    const payload = {
      title: form.title,
      client_name: form.client_name,
      status: form.status,
      value: parseFloat(form.value) || 0,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      notes: form.notes,
    }
    if (editing) {
      await supabase.from('contracts').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('contracts').insert(payload)
    }
    setSaving(false)
    setShowModal(false)
    loadContracts()
  }

  async function deleteContract(id: string) {
    await supabase.from('contracts').delete().eq('id', id)
    setOpenMenu(null)
    loadContracts()
  }

  async function advanceStatus(c: Contract) {
    const idx = STATUS_STEPS.indexOf(c.status)
    if (idx === -1 || idx >= STATUS_STEPS.length - 1) return
    const next = STATUS_STEPS[idx + 1]
    await supabase.from('contracts').update({ status: next }).eq('id', c.id)
    loadContracts()
    setOpenMenu(null)
  }

  const filtered = contracts.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.client_name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  const stats = {
    total: contracts.length,
    signed: contracts.filter(c => c.status === 'signed').length,
    pending: contracts.filter(c => c.status === 'sent').length,
    totalValue: contracts.filter(c => c.status === 'signed').reduce((sum, c) => sum + (c.value || 0), 0),
  }

  const formatCurrency = (v: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(v)
  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

  return (
    <div className="min-h-screen bg-[#04080F] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Contracts</h1>
          <p className="text-sm text-white/40 mt-0.5">Manage agreements, track signatures, monitor deadlines</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25 active:scale-95">
          <Plus className="w-4 h-4" />
          New Contract
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Contracts', value: stats.total, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Signed', value: stats.signed, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Awaiting Signature', value: stats.pending, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { label: 'Contract Value', value: formatCurrency(stats.totalValue), icon: DollarSign, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        ].map(s => (
          <div key={s.label} className="bg-[#0A1020] border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4">
            <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', s.bg)}>
              <s.icon className={clsx('w-5 h-5', s.color)} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search contracts or clients..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0A1020] border border-white/[0.06] rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', ...Object.keys(STATUS_CONFIG)] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={clsx('px-3.5 py-2 rounded-xl text-xs font-medium transition-all border',
                statusFilter === s
                  ? 'bg-amber-500 text-black border-amber-500'
                  : 'bg-[#0A1020] text-white/50 border-white/[0.06] hover:border-white/20 hover:text-white/80'
              )}>
              {s === 'all' ? 'All' : STATUS_CONFIG[s as keyof typeof STATUS_CONFIG].label}
            </button>
          ))}
        </div>
      </div>

      {/* Contract List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#0A1020] border border-white/[0.06] rounded-2xl p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-white/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/10 rounded w-48" />
                  <div className="h-3 bg-white/10 rounded w-32" />
                </div>
                <div className="h-6 bg-white/10 rounded-full w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <FileSignature className="w-7 h-7 text-white/20" />
          </div>
          <p className="text-white/50 text-sm font-medium">No contracts found</p>
          <p className="text-white/25 text-xs mt-1 mb-5">
            {search || statusFilter !== 'all' ? 'Try changing your filters' : 'Create your first contract to get started'}
          </p>
          {!search && statusFilter === 'all' && (
            <button onClick={openCreate}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold rounded-xl transition-all">
              <Plus className="w-4 h-4 inline mr-1.5" />New Contract
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => {
            const cfg = STATUS_CONFIG[c.status]
            return (
              <div key={c.id}
                className="group bg-[#0A1020] border border-white/[0.06] hover:border-white/10 rounded-2xl p-5 transition-all hover:bg-[#0C1428] cursor-pointer"
                onClick={() => setViewContract(c)}>
                <div className="flex items-start gap-4">
                  <AvatarInitials name={c.client_name} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-white text-sm truncate">{c.title}</h3>
                        <p className="text-xs text-white/40 mt-0.5 flex items-center gap-1.5">
                          <Building2 className="w-3 h-3" />
                          {c.client_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <StatusBadge status={c.status} />
                        <div className="relative" onClick={e => e.stopPropagation()}>
                          <button onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-white/80 transition-all">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {openMenu === c.id && (
                            <div className="absolute right-0 top-8 z-20 bg-[#0C1428] border border-white/10 rounded-xl shadow-2xl shadow-black/50 py-1 w-44">
                              <button onClick={() => openEdit(c)} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 transition-all">
                                <FileText className="w-3.5 h-3.5" />Edit Contract
                              </button>
                              {STATUS_STEPS.indexOf(c.status) !== -1 && STATUS_STEPS.indexOf(c.status) < STATUS_STEPS.length - 1 && (
                                <button onClick={() => advanceStatus(c)} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-all">
                                  <ChevronRight className="w-3.5 h-3.5" />
                                  Advance to {STATUS_CONFIG[STATUS_STEPS[STATUS_STEPS.indexOf(c.status)+1]].label}
                                </button>
                              )}
                              <div className="border-t border-white/5 my-1" />
                              <button onClick={() => deleteContract(c.id)} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
                                <Trash2 className="w-3.5 h-3.5" />Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/[0.04]">
                      {c.value ? (
                        <span className="flex items-center gap-1 text-xs text-white/50">
                          <DollarSign className="w-3 h-3" />{formatCurrency(c.value)}
                        </span>
                      ) : null}
                      {c.start_date && (
                        <span className="flex items-center gap-1 text-xs text-white/50">
                          <Calendar className="w-3 h-3" />{formatDate(c.start_date)}
                        </span>
                      )}
                      {c.end_date && (
                        <span className="flex items-center gap-1 text-xs text-white/50">
                          <ArrowRight className="w-3 h-3" />{formatDate(c.end_date)}
                        </span>
                      )}
                    </div>
                    <StatusPipeline status={c.status} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0A1020] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
              <div>
                <h2 className="text-lg font-semibold text-white">{editing ? 'Edit Contract' : 'New Contract'}</h2>
                <p className="text-xs text-white/40 mt-0.5">{editing ? 'Update contract details' : 'Create a new agreement'}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Contract Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Cinematography Services Agreement"
                  className="w-full px-4 py-2.5 bg-[#060C18] border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Client / Company *</label>
                <input value={form.client_name} onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))}
                  placeholder="e.g. Pinewood Productions Ltd"
                  className="w-full px-4 py-2.5 bg-[#060C18] border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Contract['status'] }))}
                    className="w-full px-4 py-2.5 bg-[#060C18] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all">
                    {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                      <option key={val} value={val}>{cfg.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Contract Value (£)</label>
                  <input value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
                    type="number" placeholder="0"
                    className="w-full px-4 py-2.5 bg-[#060C18] border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Start Date</label>
                  <input value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
                    type="date"
                    className="w-full px-4 py-2.5 bg-[#060C18] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">End Date</label>
                  <input value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
                    type="date"
                    className="w-full px-4 py-2.5 bg-[#060C18] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={3} placeholder="Add any additional notes or terms..."
                  className="w-full px-4 py-2.5 bg-[#060C18] border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 resize-none transition-all" />
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-white/60 hover:text-white hover:border-white/20 transition-all">
                Cancel
              </button>
              <button onClick={saveContract} disabled={!form.title || !form.client_name || saving}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Contract'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Contract Modal */}
      {viewContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setViewContract(null)}>
          <div className="bg-[#0A1020] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between p-6 border-b border-white/[0.06]">
              <div className="flex items-start gap-3">
                <AvatarInitials name={viewContract.client_name} />
                <div>
                  <h2 className="text-lg font-semibold text-white leading-tight">{viewContract.title}</h2>
                  <p className="text-xs text-white/40 mt-0.5 flex items-center gap-1"><Building2 className="w-3 h-3" />{viewContract.client_name}</p>
                </div>
              </div>
              <button onClick={() => setViewContract(null)} className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <StatusBadge status={viewContract.status} />
                {viewContract.value ? <span className="text-lg font-bold text-white">{formatCurrency(viewContract.value)}</span> : null}
              </div>
              <StatusPipeline status={viewContract.status} />
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-[#060C18] rounded-xl p-3">
                  <p className="text-xs text-white/40 mb-1">Start Date</p>
                  <p className="text-sm text-white font-medium">{formatDate(viewContract.start_date)}</p>
                </div>
                <div className="bg-[#060C18] rounded-xl p-3">
                  <p className="text-xs text-white/40 mb-1">End Date</p>
                  <p className="text-sm text-white font-medium">{formatDate(viewContract.end_date)}</p>
                </div>
              </div>
              {viewContract.notes && (
                <div className="bg-[#060C18] rounded-xl p-4">
                  <p className="text-xs text-white/40 mb-1.5">Notes</p>
                  <p className="text-sm text-white/70 leading-relaxed">{viewContract.notes}</p>
                </div>
              )}
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => { setViewContract(null); openEdit(viewContract) }}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-all">
                Edit Contract
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
