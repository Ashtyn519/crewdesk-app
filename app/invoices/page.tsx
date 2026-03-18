'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import clsx from 'clsx'
import {
  FileText, Plus, Search, CheckCircle, Clock, AlertCircle,
  MoreVertical, Trash2, Printer, DollarSign, Send,
  Calendar, Building2, X, Loader2, ChevronDown,
  TrendingUp, CreditCard, FilePlus, Hash
} from 'lucide-react'

interface Invoice {
  id: string
  invoice_number: string
  client_name: string
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  amount: number
  due_date: string
  created_at: string
  line_items?: LineItem[]
  notes?: string
}

interface LineItem {
  description: string
  quantity: number
  rate: number
}

const STATUS_CONFIG = {
  draft:   { label: 'Draft',   color: 'text-slate-400',   bg: 'bg-slate-400/10',  border: 'border-slate-400/20',  dot: 'bg-slate-400' },
  sent:    { label: 'Sent',    color: 'text-blue-400',    bg: 'bg-blue-400/10',   border: 'border-blue-400/20',   dot: 'bg-blue-400'  },
  paid:    { label: 'Paid',    color: 'text-emerald-400', bg: 'bg-emerald-400/10',border: 'border-emerald-400/20',dot: 'bg-emerald-400'},
  overdue: { label: 'Overdue', color: 'text-red-400',     bg: 'bg-red-400/10',    border: 'border-red-400/20',    dot: 'bg-red-400'   },
}

function StatusBadge({ status }: { status: Invoice['status'] }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border', cfg.color, cfg.bg, cfg.border)}>
      <span className={clsx('w-1.5 h-1.5 rounded-full', cfg.dot)} />
      {cfg.label}
    </span>
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

export default function InvoicesPage() {
  const supabase = createClient()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Invoice | null>(null)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    client_name: '',
    status: 'draft' as Invoice['status'],
    due_date: '',
    notes: '',
    line_items: [{ description: '', quantity: 1, rate: 0 }] as LineItem[],
  })
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => { loadInvoices() }, [])

  async function loadInvoices() {
    setLoading(true)
    const { data } = await supabase.from('invoices').select('*').order('created_at', { ascending: false })
    setInvoices(data ?? [])
    setLoading(false)
  }

  function openCreate() {
    setEditing(null)
    setForm({ client_name: '', status: 'draft', due_date: '', notes: '', line_items: [{ description: '', quantity: 1, rate: 0 }] })
    setShowModal(true)
  }

  function openEdit(inv: Invoice) {
    setEditing(inv)
    setForm({
      client_name: inv.client_name,
      status: inv.status as Invoice['status'],
      due_date: inv.due_date ?? '',
      notes: inv.notes ?? '',
      line_items: (inv.line_items as LineItem[]) ?? [{ description: '', quantity: 1, rate: 0 }],
    })
    setShowModal(true)
    setOpenMenu(null)
  }

  function calcTotal(items: LineItem[]) {
    return items.reduce((sum, li) => sum + (li.quantity * li.rate), 0)
  }

  async function saveInvoice() {
    setSaving(true)
    const total = calcTotal(form.line_items)
    const invNum = `INV-${Date.now().toString().slice(-6)}`
    const payload = {
      client_name: form.client_name,
      status: form.status as Invoice['status'],
      amount: total,
      due_date: form.due_date || null,
      notes: form.notes,
      line_items: form.line_items,
      invoice_number: editing?.invoice_number ?? invNum,
    }
    if (editing) {
      await supabase.from('invoices').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('invoices').insert(payload)
    }
    setSaving(false)
    setShowModal(false)
    loadInvoices()
  }

  async function markPaid(id: string) {
    await supabase.from('invoices').update({ status: 'paid' as Invoice['status'] }).eq('id', id)
    setOpenMenu(null)
    loadInvoices()
  }

  async function deleteInvoice(id: string) {
    await supabase.from('invoices').delete().eq('id', id)
    setOpenMenu(null)
    loadInvoices()
  }

  function addLineItem() {
    setForm(f => ({ ...f, line_items: [...f.line_items, { description: '', quantity: 1, rate: 0 }] }))
  }

  function removeLineItem(i: number) {
    setForm(f => ({ ...f, line_items: f.line_items.filter((_, idx) => idx !== i) }))
  }

  function updateLineItem(i: number, field: keyof LineItem, val: string | number) {
    setForm(f => ({ ...f, line_items: f.line_items.map((li, idx) => idx === i ? { ...li, [field]: val } : li) }))
  }

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.client_name?.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoice_number?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter
    return matchSearch && matchStatus
  })

  const stats = {
    total: invoices.length,
    paid: invoices.filter(i => i.status === 'paid').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    revenue: invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.amount || 0), 0),
    outstanding: invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + (i.amount || 0), 0),
  }

  const fmt = (v: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(v)
  const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

  const formTotal = calcTotal(form.line_items)

  return (
    <div className="min-h-screen bg-[#04080F] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Invoices</h1>
          <p className="text-sm text-white/40 mt-0.5">Create, send, and track your invoices</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25 active:scale-95">
          <Plus className="w-4 h-4" />New Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Invoices', value: stats.total, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Paid', value: stats.paid, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Revenue', value: fmt(stats.revenue), icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Outstanding', value: fmt(stats.outstanding), icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
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
            placeholder="Search by client or invoice number..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0A1020] border border-white/[0.06] rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-500/50 transition-all" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', ...Object.keys(STATUS_CONFIG)] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={clsx('px-3.5 py-2 rounded-xl text-xs font-medium transition-all border',
                statusFilter === s ? 'bg-amber-500 text-black border-amber-500'
                  : 'bg-[#0A1020] text-white/50 border-white/[0.06] hover:border-white/20 hover:text-white/80'
              )}>
              {s === 'all' ? 'All' : STATUS_CONFIG[s as keyof typeof STATUS_CONFIG].label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
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
            <FilePlus className="w-7 h-7 text-white/20" />
          </div>
          <p className="text-white/50 text-sm font-medium">No invoices found</p>
          <p className="text-white/25 text-xs mt-1 mb-5">
            {search || statusFilter !== 'all' ? 'Try changing your filters' : 'Create your first invoice to get started'}
          </p>
          {!search && statusFilter === 'all' && (
            <button onClick={openCreate} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold rounded-xl transition-all">
              <Plus className="w-4 h-4 inline mr-1.5" />New Invoice
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(inv => (
            <div key={inv.id} className="group bg-[#0A1020] border border-white/[0.06] hover:border-white/10 rounded-2xl p-5 transition-all hover:bg-[#0C1428]">
              <div className="flex items-start gap-4">
                <AvatarInitials name={inv.client_name ?? 'Client'} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white text-sm">{inv.client_name}</h3>
                        {inv.invoice_number && (
                          <span className="text-xs text-white/25 font-mono">{inv.invoice_number}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-lg font-bold text-white">{fmt(inv.amount ?? 0)}</span>
                        {inv.due_date && (
                          <span className="flex items-center gap-1 text-xs text-white/40">
                            <Calendar className="w-3 h-3" />Due {fmtDate(inv.due_date)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <StatusBadge status={inv.status as Invoice['status']} />
                      <div className="relative">
                        <button onClick={() => setOpenMenu(openMenu === inv.id ? null : inv.id)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-white/80 transition-all">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {openMenu === inv.id && (
                          <div className="absolute right-0 top-8 z-20 bg-[#0C1428] border border-white/10 rounded-xl shadow-2xl shadow-black/50 py-1 w-44">
                            <button onClick={() => openEdit(inv)} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 transition-all">
                              <FileText className="w-3.5 h-3.5" />Edit Invoice
                            </button>
                            {inv.status !== 'paid' && (
                              <button onClick={() => markPaid(inv.id)} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all">
                                <CheckCircle className="w-3.5 h-3.5" />Mark as Paid
                              </button>
                            )}
                            <button onClick={() => window.print()} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 transition-all">
                              <Printer className="w-3.5 h-3.5" />Print / PDF
                            </button>
                            <div className="border-t border-white/5 my-1" />
                            <button onClick={() => deleteInvoice(inv.id)} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
                              <Trash2 className="w-3.5 h-3.5" />Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0A1020] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/[0.06] sticky top-0 bg-[#0A1020] z-10">
              <div>
                <h2 className="text-lg font-semibold text-white">{editing ? 'Edit Invoice' : 'New Invoice'}</h2>
                <p className="text-xs text-white/40 mt-0.5">{editing ? 'Update invoice details' : 'Create a new invoice for your client'}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Client Name *</label>
                  <input value={form.client_name} onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))}
                    placeholder="e.g. Pinewood Productions"
                    className="w-full px-4 py-2.5 bg-[#060C18] border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Invoice['status'] }))}
                    className="w-full px-4 py-2.5 bg-[#060C18] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all">
                    {Object.entries(STATUS_CONFIG).map(([v, cfg]) => <option key={v} value={v}>{cfg.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Due Date</label>
                <input value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
                  type="date" className="w-full px-4 py-2.5 bg-[#060C18] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all" />
              </div>

              {/* Line Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-white/50">Line Items</label>
                  <button onClick={addLineItem} className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">
                    <Plus className="w-3 h-3" />Add item
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 px-3 text-xs text-white/30">
                    <span className="col-span-6">Description</span>
                    <span className="col-span-2 text-center">Qty</span>
                    <span className="col-span-3 text-right">Rate (£)</span>
                    <span className="col-span-1" />
                  </div>
                  {form.line_items.map((li, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center">
                      <input value={li.description} onChange={e => updateLineItem(i, 'description', e.target.value)}
                        placeholder="Item description"
                        className="col-span-6 px-3 py-2 bg-[#060C18] border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 transition-all" />
                      <input value={li.quantity} onChange={e => updateLineItem(i, 'quantity', parseFloat(e.target.value) || 0)}
                        type="number" min="0"
                        className="col-span-2 px-3 py-2 bg-[#060C18] border border-white/10 rounded-xl text-sm text-white text-center focus:outline-none focus:border-amber-500/50 transition-all" />
                      <input value={li.rate} onChange={e => updateLineItem(i, 'rate', parseFloat(e.target.value) || 0)}
                        type="number" min="0"
                        className="col-span-3 px-3 py-2 bg-[#060C18] border border-white/10 rounded-xl text-sm text-white text-right focus:outline-none focus:border-amber-500/50 transition-all" />
                      <button onClick={() => removeLineItem(i)} className="col-span-1 flex items-center justify-center text-white/20 hover:text-red-400 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-end mt-3 pt-3 border-t border-white/[0.06]">
                  <span className="text-sm text-white/50 mr-3">Total</span>
                  <span className="text-xl font-bold text-white">{fmt(formTotal)}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={2} placeholder="Payment terms, bank details, etc."
                  className="w-full px-4 py-2.5 bg-[#060C18] border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 resize-none transition-all" />
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-white/60 hover:text-white hover:border-white/20 transition-all">
                Cancel
              </button>
              <button onClick={saveInvoice} disabled={!form.client_name || saving}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Invoice'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
