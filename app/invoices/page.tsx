'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Receipt, Plus, Search, Check, X, Eye,
  Clock, CheckCircle2, AlertCircle, Sparkles,
  MoreVertical, Edit2, Trash2, DollarSign, TrendingUp, Send, FileDown
} from 'lucide-react'
import clsx from 'clsx'
import { downloadInvoicePDF } from '@/lib/pdf'

interface LineItem { description: string; qty: number; rate: number }
interface Invoice {
  id: string
  invoice_number: string | null
  client_name: string | null
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  amount: number | null
  due_date: string | null
  issued_date: string | null
  line_items: LineItem[] | null
  notes: string | null
  created_at: string
}

const statusConfig = {
  draft:     { label: 'Draft',     color: 'text-white/40',    bg: 'bg-white/5',        dot: 'bg-white/30'    },
  sent:      { label: 'Sent',      color: 'text-blue-400',    bg: 'bg-blue-400/10',    dot: 'bg-blue-400'    },
  paid:      { label: 'Paid',      color: 'text-emerald-400', bg: 'bg-emerald-400/10', dot: 'bg-emerald-400' },
  overdue:   { label: 'Overdue',   color: 'text-red-400',     bg: 'bg-red-400/10',     dot: 'bg-red-400'     },
  cancelled: { label: 'Cancelled', color: 'text-white/20',    bg: 'bg-white/[0.03]',   dot: 'bg-white/20'    },
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const rowVariant = {
  hidden: { opacity: 0, x: -16 },
  show:   { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 26 } }
}
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22,1,0.36,1] } }
}

function AvatarInitials({ name }: { name: string }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['from-violet-500 to-blue-500','from-amber-500 to-orange-500','from-emerald-500 to-teal-500','from-pink-500 to-rose-500']
  const idx = name.charCodeAt(0) % colors.length
  return (
    <div className={clsx('w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center font-bold text-white text-xs shrink-0', colors[idx])}>
      {initials}
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

export default function InvoicesPage() {
  const supabase = createClient()
  const [invoices, setInvoices]     = useState<Invoice[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal]   = useState(false)
  const [viewModal, setViewModal]   = useState<Invoice | null>(null)
  const [editInvoice, setEditInvoice] = useState<Invoice | null>(null)
  const [menuOpen, setMenuOpen]     = useState<string | null>(null)
  const [toast, setToast]           = useState<string | null>(null)
  const [lineItems, setLineItems]   = useState<LineItem[]>([{ description: '', qty: 1, rate: 0 }])
  const [form, setForm] = useState({
    invoice_number: '', client_name: '', status: 'draft' as Invoice['status'],
    due_date: '', issued_date: '', notes: ''
  })

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500) }

  async function load() {
    const { data } = await supabase.from('invoices').select('*').order('created_at', { ascending: false })
    setInvoices((data || []) as Invoice[])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const filtered = invoices.filter(inv => {
    const q = search.toLowerCase()
    const matchSearch = (inv.invoice_number || '').toLowerCase().includes(q) || (inv.client_name || '').toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter
    return matchSearch && matchStatus
  })

  const stats = {
    total:     invoices.length,
    paid:      invoices.filter(i => i.status === 'paid').length,
    outstanding: invoices.filter(i => ['sent','overdue'].includes(i.status)).reduce((s, i) => s + (i.amount || 0), 0),
    revenue:   invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.amount || 0), 0),
  }

  const totalLineItems = lineItems.reduce((s, li) => s + li.qty * li.rate, 0)

  function openCreate() {
    setEditInvoice(null)
    setLineItems([{ description: '', qty: 1, rate: 0 }])
    const num = `INV-${String(invoices.length + 1).padStart(4, '0')}`
    setForm({ invoice_number: num, client_name: '', status: 'draft', due_date: '', issued_date: '', notes: '' })
    setShowModal(true)
  }

  function openEdit(inv: Invoice) {
    setEditInvoice(inv)
    setLineItems(inv.line_items?.length ? inv.line_items : [{ description: '', qty: 1, rate: 0 }])
    setForm({
      invoice_number: inv.invoice_number || '', client_name: inv.client_name || '',
      status: inv.status as Invoice['status'],
      due_date: inv.due_date?.slice(0, 10) || '', issued_date: inv.issued_date?.slice(0, 10) || '',
      notes: inv.notes || ''
    })
    setShowModal(true)
    setMenuOpen(null)
  }

  async function saveInvoice() {
    const amount = totalLineItems
    const payload = {
      invoice_number: form.invoice_number || null,
      client_name: form.client_name || null,
      status: form.status,
      amount: amount > 0 ? amount : null,
      due_date: form.due_date || null,
      issued_date: form.issued_date || null,
      notes: form.notes || null,
      line_items: lineItems.filter(li => li.description),
    }
    if (editInvoice) {
      await supabase.from('invoices').update(payload).eq('id', editInvoice.id)
      showToast('Invoice updated')
    } else {
      await supabase.from('invoices').insert(payload)
      showToast('Invoice created')
    }
    setShowModal(false)
    load()
  }

  async function markPaid(id: string) {
    await supabase.from('invoices').update({ status: 'paid' }).eq('id', id)
    showToast('Invoice marked as paid ✓')
    setViewModal(null)
    setMenuOpen(null)
    load()
  }

  async function deleteInvoice(id: string) {
    await supabase.from('invoices').delete().eq('id', id)
    showToast('Invoice deleted')
    setMenuOpen(null)
    load()
  }

  const fmtCurrency = (n: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n)
  const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  function updateLineItem(i: number, field: keyof LineItem, val: string | number) {
    setLineItems(prev => prev.map((li, idx) => idx === i ? { ...li, [field]: val } : li))
  }

  return (
    <div className="min-h-screen bg-[#04080F] p-6 lg:p-8">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}
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
              <Receipt className="w-6 h-6 text-amber-400" /> Invoices
            </h1>
            <p className="text-white/40 text-sm mt-1">{stats.total} invoices · {stats.paid} paid</p>
          </div>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={openCreate}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#04080F] font-semibold px-4 py-2.5 rounded-xl text-sm">
            <Plus className="w-4 h-4" /> New Invoice
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div variants={container} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Receipt}     label="Total"       value={stats.total.toString()} accent="bg-violet-400/10 text-violet-400" />
          <StatCard icon={CheckCircle2} label="Paid"       value={stats.paid.toString()}  accent="bg-emerald-400/10 text-emerald-400" />
          <StatCard icon={Clock}       label="Outstanding" value={stats.outstanding > 0 ? fmtCurrency(stats.outstanding) : '£0'} accent="bg-amber-400/10 text-amber-400" />
          <StatCard icon={TrendingUp}  label="Revenue"     value={stats.revenue > 0 ? fmtCurrency(stats.revenue) : '£0'} accent="bg-blue-400/10 text-blue-400" />
        </motion.div>

        {/* Filters */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by invoice # or client…"
              className="w-full bg-[#0A1020] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50" />
          </div>
          <div className="flex gap-2">
            {['all', 'draft', 'sent', 'paid', 'overdue'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={clsx('px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize',
                  statusFilter === s ? 'bg-amber-400 text-[#04080F]' : 'bg-[#0A1020] text-white/50 hover:text-white border border-white/[0.06]'
                )}>{s}</button>
            ))}
          </div>
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
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-6">
            <Receipt className="w-8 h-8 text-white/20" />
          </div>
          <h3 className="text-white/60 text-lg font-medium mb-2">No invoices yet</h3>
          <p className="text-white/30 text-sm mb-6">Create your first invoice to get started</p>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={openCreate}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#04080F] font-semibold px-5 py-2.5 rounded-xl text-sm">
            <Plus className="w-4 h-4" /> New Invoice
          </motion.button>
        </motion.div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
          {filtered.map(inv => {
            const s = statusConfig[inv.status]
            return (
              <motion.div key={inv.id} variants={rowVariant}
                whileHover={{ x: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
                className="bg-[#0A1020] border border-white/[0.06] hover:border-white/10 rounded-2xl p-5 flex items-center gap-4 group transition-colors">
                {inv.client_name ? <AvatarInitials name={inv.client_name} /> : (
                  <div className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0">
                    <Receipt className="w-4 h-4 text-white/20" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white font-medium text-sm">{inv.invoice_number || 'Draft Invoice'}</span>
                    <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium', s.bg, s.color)}>
                      <span className={clsx('w-1.5 h-1.5 rounded-full', s.dot)} />{s.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/40">
                    {inv.client_name && <span>{inv.client_name}</span>}
                    {inv.amount && <span className="text-amber-400 font-semibold">{fmtCurrency(inv.amount)}</span>}
                    {inv.due_date && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Due {fmtDate(inv.due_date)}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {inv.status !== 'paid' && inv.status !== 'cancelled' && (
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => markPaid(inv.id)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-400 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <Check className="w-3 h-3" /> Mark Paid
                    </motion.button>
                  )}
                  <button onClick={() => setViewModal(inv)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-all">
                    <Eye className="w-4 h-4" />
                  </button>
                  <div className="relative">
                    <button onClick={() => setMenuOpen(menuOpen === inv.id ? null : inv.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    <AnimatePresence>
                      {menuOpen === inv.id && (
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                          className="absolute right-0 top-8 bg-[#0C1428] border border-white/[0.08] rounded-xl overflow-hidden z-20 w-36 shadow-2xl">
                          <button onClick={() => openEdit(inv)} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/[0.05]">
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </button>
                          {inv.status !== 'paid' && (
                            <button onClick={() => markPaid(inv.id)} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/5">
                              <Check className="w-3.5 h-3.5" /> Mark Paid
                            </button>
                          )}
                          <button onClick={() => { downloadInvoicePDF({ invoice_number: inv.invoice_number || 'INV-001', client_name: inv.client_name || 'Client', issued_date: inv.issued_date || inv.created_at, status: inv.status, amount: inv.amount, notes: inv.notes, line_items: inv.line_items as any }) }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-400/5">
                      <FileDown className="w-3.5 h-3.5" /> Download PDF
                    </button>
                    <button onClick={() => deleteInvoice(inv.id)} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/5">
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setViewModal(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }} transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              className="bg-[#0A1020] border border-white/[0.08] rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">{viewModal.invoice_number || 'Invoice'}</h2>
                  {viewModal.client_name && <p className="text-white/40 text-sm">{viewModal.client_name}</p>}
                </div>
                <button onClick={() => setViewModal(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Line Items */}
              {viewModal.line_items && viewModal.line_items.length > 0 && (
                <div className="mb-6">
                  <div className="grid grid-cols-3 text-xs text-white/40 mb-2 px-1">
                    <span>Description</span><span className="text-right">Qty</span><span className="text-right">Amount</span>
                  </div>
                  {viewModal.line_items.map((li, i) => (
                    <div key={i} className="grid grid-cols-3 text-sm py-2 border-b border-white/[0.04]">
                      <span className="text-white/70">{li.description}</span>
                      <span className="text-right text-white/50">{li.qty} × £{li.rate}</span>
                      <span className="text-right text-white font-medium">{fmtCurrency(li.qty * li.rate)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3">
                    <span className="text-white/40 text-sm">Total</span>
                    <span className="text-amber-400 font-bold text-lg">{fmtCurrency(viewModal.amount || 0)}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2 mb-6">
                {viewModal.issued_date && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Issued</span>
                    <span className="text-white">{fmtDate(viewModal.issued_date)}</span>
                  </div>
                )}
                {viewModal.due_date && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Due</span>
                    <span className={clsx('font-medium', viewModal.status === 'overdue' ? 'text-red-400' : 'text-white')}>{fmtDate(viewModal.due_date)}</span>
                  </div>
                )}
              </div>

              {viewModal.status !== 'paid' && viewModal.status !== 'cancelled' && (
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => markPaid(viewModal.id)}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> Mark as Paid
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }} transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              className="bg-[#0A1020] border border-white/[0.08] rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  {editInvoice ? 'Edit Invoice' : 'New Invoice'}
                </h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {[
                  { label: 'Invoice #', key: 'invoice_number', type: 'text', placeholder: 'INV-0001' },
                  { label: 'Client Name', key: 'client_name', type: 'text', placeholder: 'Acme Corp' },
                  { label: 'Issued Date', key: 'issued_date', type: 'date', placeholder: '' },
                  { label: 'Due Date', key: 'due_date', type: 'date', placeholder: '' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs text-white/50 mb-1.5 font-medium">{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder}
                      value={form[f.key as keyof typeof form]}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full bg-[#060C18] border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50" />
                  </div>
                ))}

                {/* Line Items */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-white/50 font-medium">Line Items</label>
                    <button onClick={() => setLineItems(prev => [...prev, { description: '', qty: 1, rate: 0 }])}
                      className="text-xs text-amber-400 hover:text-amber-300">+ Add Item</button>
                  </div>
                  <div className="space-y-2">
                    {lineItems.map((li, i) => (
                      <div key={i} className="grid grid-cols-5 gap-2">
                        <input placeholder="Description" value={li.description}
                          onChange={e => updateLineItem(i, 'description', e.target.value)}
                          className="col-span-3 bg-[#060C18] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50" />
                        <input type="number" placeholder="Qty" value={li.qty}
                          onChange={e => updateLineItem(i, 'qty', Number(e.target.value))}
                          className="bg-[#060C18] border border-white/[0.06] rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-amber-400/50" />
                        <input type="number" placeholder="Rate" value={li.rate}
                          onChange={e => updateLineItem(i, 'rate', Number(e.target.value))}
                          className="bg-[#060C18] border border-white/[0.06] rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-amber-400/50" />
                      </div>
                    ))}
                  </div>
                  {totalLineItems > 0 && (
                    <div className="flex justify-between mt-3 pt-3 border-t border-white/[0.05]">
                      <span className="text-xs text-white/40">Total</span>
                      <span className="text-amber-400 font-bold">{fmtCurrency(totalLineItems)}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-white/50 mb-1.5 font-medium">Status</label>
                  <select value={form.status} onChange={e => setForm(prev => ({ ...prev, status: e.target.value as Invoice['status'] }))}
                    className="w-full bg-[#060C18] border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50">
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white font-medium py-2.5 rounded-xl text-sm">
                  Cancel
                </button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={saveInvoice} disabled={!form.client_name && !form.invoice_number}
                  className="flex-1 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-[#04080F] font-semibold py-2.5 rounded-xl text-sm">
                  {editInvoice ? 'Save Changes' : 'Create Invoice'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
