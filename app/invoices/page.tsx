'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'
import { Plus, Search, Filter, X, Trash2, Download, CheckCircle, Clock, AlertCircle, FileText, ChevronDown } from 'lucide-react'

interface InvoiceItem { description: string; qty: number; rate: number }
interface Invoice {
    id: string; client: string; project: string;
    status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
    amount: number; issued: string; due: string; items: InvoiceItem[]
}

const INITIAL_INVOICES: Invoice[] = [
  { id: 'INV-2024', client: 'Pulse Records', project: 'Neon Nights MV', status: 'Paid', amount: 12400, issued: '2026-02-15', due: '2026-03-01', items: [{ description: 'Direction & Production', qty: 1, rate: 8000 }, { description: 'Post Production', qty: 1, rate: 3200 }, { description: 'Equipment Hire', qty: 2, rate: 600 }] },
  { id: 'INV-2025', client: 'Channel 4', project: 'City Lights Doc', status: 'Sent', amount: 28000, issued: '2026-03-01', due: '2026-03-22', items: [{ description: 'Documentary Direction', qty: 1, rate: 18000 }, { description: 'Crew Coordination', qty: 10, rate: 800 }, { description: 'Gear Package', qty: 1, rate: 2000 }] },
  { id: 'INV-2026', client: 'Apex Corp', project: 'Apex Energy TVC', status: 'Draft', amount: 18500, issued: '2026-03-10', due: '2026-04-10', items: [{ description: 'TVC Production', qty: 1, rate: 14000 }, { description: 'Talent Fees', qty: 3, rate: 1500 }] },
  { id: 'INV-2023', client: 'ASOS', project: 'Summer Vibes', status: 'Overdue', amount: 8200, issued: '2026-01-20', due: '2026-02-20', items: [{ description: 'Campaign Shoot', qty: 1, rate: 6000 }, { description: 'Editing', qty: 8, rate: 275 }] },
  { id: 'INV-2022', client: 'Beats United', project: 'Urban Pulse EP', status: 'Paid', amount: 6800, issued: '2026-01-10', due: '2026-02-10', items: [{ description: 'Music Video Production', qty: 1, rate: 5500 }, { description: 'Color Grading', qty: 1, rate: 1300 }] },
  ]

const STATUS_STYLE: Record<string, string> = {
    Draft: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
    Sent: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    Paid: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    Overdue: 'bg-red-500/20 text-red-400 border border-red-500/30',
}

const STATUS_ICON: Record<string, React.ReactNode> = {
    Draft: <FileText className="w-3 h-3" />,
    Sent: <Clock className="w-3 h-3" />,
    Paid: <CheckCircle className="w-3 h-3" />,
    Overdue: <AlertCircle className="w-3 h-3" />,
}

function NewInvoiceModal({ onClose, onSave }: { onClose: () => void; onSave: (inv: Invoice) => void }) {
    const [client, setClient] = useState('')
    const [project, setProject] = useState('')
    const [due, setDue] = useState('')
    const [items, setItems] = useState<InvoiceItem[]>([{ description: '', qty: 1, rate: 0 }])
    const total = items.reduce((s, i) => s + i.qty * i.rate, 0)
    const setItem = (idx: number, k: keyof InvoiceItem, v: string | number) => setItems(items.map((item, i) => i === idx ? { ...item, [k]: v } : item))
    const addItem = () => setItems([...items, { description: '', qty: 1, rate: 0 }])
    const removeItem = (idx: number) => { if (items.length > 1) setItems(items.filter((_, i) => i !== idx)) }

  const submit = () => {
        if (!client.trim() || !project.trim()) return
        const inv: Invoice = {
                id: `INV-${Date.now().toString().slice(-4)}`,
                client, project, status: 'Draft',
                amount: total,
                issued: new Date().toISOString().slice(0, 10),
                due: due || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
                items
        }
        onSave(inv)
  }

  return (
        <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
              >
              <motion.div
                        className="bg-[#0A1020] border border-white/10 rounded-2xl p-7 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
                        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                        onClick={e => e.stopPropagation()}
                      >
                      <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">New Invoice</h2>h2>
                                <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>button>
                      </div>div>
                      <div className="grid grid-cols-2 gap-4 mb-5">
                                <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Client *</label>label>
                                            <input value={client} onChange={e => setClient(e.target.value)} placeholder="Client name" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
                                </div>div>
                                <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Project *</label>label>
                                            <input value={project} onChange={e => setProject(e.target.value)} placeholder="Project name" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
                                </div>div>
                                <div className="col-span-2">
                                            <label className="text-xs text-slate-400 mb-1 block">Due Date</label>label>
                                            <input type="date" value={due} onChange={e => setDue(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400/50" />
                                </div>div>
                      </div>div>
                      <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                            <label className="text-xs text-slate-400">Line Items</label>label>
                                            <button onClick={addItem} className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"><Plus className="w-3 h-3" />Add item</button>button>
                                </div>div>
                                <div className="space-y-2">
                                  {items.map((item, idx) => (
                                      <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                                                      <div className="col-span-6">
                                                                        <input value={item.description} onChange={e => setItem(idx, 'description', e.target.value)} placeholder="Description" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
                                                      </div>div>
                                                      <div className="col-span-2">
                                                                        <input type="number" value={item.qty} onChange={e => setItem(idx, 'qty', parseInt(e.target.value) || 1)} min={1} className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-amber-400/50 text-center" />
                                                      </div>div>
                                                      <div className="col-span-3">
                                                                        <input type="number" value={item.rate} onChange={e => setItem(idx, 'rate', parseFloat(e.target.value) || 0)} min={0} placeholder="Rate £" className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-amber-400/50" />
                                                      </div>div>
                                                      <div className="col-span-1 flex justify-center">
                                                                        <button onClick={() => removeItem(idx)} className="text-slate-600 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>button>
                                                      </div>div>
                                      </div>div>
                                    ))}
                                </div>div>
                      </div>div>
                      <div className="flex items-center justify-between border-t border-white/5 pt-4 mb-5">
                                <span className="text-sm font-semibold text-white">Total</span>span>
                                <span className="text-xl font-black text-white">£{total.toLocaleString()}</span>span>
                      </div>div>
                      <button
                                  onClick={submit}
                                  disabled={!client.trim() || !project.trim()}
                                  className="w-full py-3 bg-amber-400 text-black font-bold rounded-xl text-sm hover:bg-amber-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                Create Invoice
                      </button>button>
              </motion.div>motion.div>
        </motion.div>motion.div>
      )
}

function InvoiceDetailModal({ invoice, onClose, onUpdate }: { invoice: Invoice; onClose: () => void; onUpdate: (inv: Invoice) => void }) {
    const vat = invoice.amount * 0.2
        const total = invoice.amount + vat
          
            const markPaid = () => onUpdate({ ...invoice, status: 'Paid' })
                const markSent = () => onUpdate({ ...invoice, status: 'Sent' })
                  
                    return (
                          <motion.div
                                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                  onClick={onClose}
                                >
                                <motion.div
                                          className="bg-[#0A1020] border border-white/10 rounded-2xl p-7 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto"
                                          initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                                          onClick={e => e.stopPropagation()}
                                        >
                                        <div className="flex items-center justify-between mb-6">
                                                  <div>
                                                              <h2 className="text-xl font-bold text-white">{invoice.id}</h2>h2>
                                                              <p className="text-sm text-slate-400 mt-0.5">{invoice.client} · {invoice.project}</p>p>
                                                  </div>div>
                                                  <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>button>
                                        </div>div>
                                
                                        <div className="flex gap-2 mb-5">
                                                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${STATUS_STYLE[invoice.status]}`}>
                                                    {STATUS_ICON[invoice.status]}{invoice.status}
                                                  </span>span>
                                        </div>div>
                                
                                        <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
                                                  <div>
                                                              <p className="text-xs text-slate-500 mb-0.5">Issued</p>p>
                                                              <p className="text-white font-medium">{invoice.issued}</p>p>
                                                  </div>div>
                                                  <div>
                                                              <p className="text-xs text-slate-500 mb-0.5">Due</p>p>
                                                              <p className={`font-medium ${invoice.status === 'Overdue' ? 'text-red-400' : 'text-white'}`}>{invoice.due}</p>p>
                                                  </div>div>
                                        </div>div>
                                
                                        <div className="rounded-xl bg-black/20 border border-white/5 overflow-hidden mb-5">
                                                  <div className="grid grid-cols-12 px-4 py-2 border-b border-white/5">
                                                              <span className="col-span-6 text-xs text-slate-500">Description</span>span>
                                                              <span className="col-span-2 text-xs text-slate-500 text-center">Qty</span>span>
                                                              <span className="col-span-2 text-xs text-slate-500 text-right">Rate</span>span>
                                                              <span className="col-span-2 text-xs text-slate-500 text-right">Total</span>span>
                                                  </div>div>
                                          {invoice.items.map((item, i) => (
                                                      <div key={i} className="grid grid-cols-12 px-4 py-3 border-b border-white/5 last:border-0">
                                                                    <span className="col-span-6 text-sm text-white">{item.description}</span>span>
                                                                    <span className="col-span-2 text-sm text-slate-400 text-center">{item.qty}</span>span>
                                                                    <span className="col-span-2 text-sm text-slate-400 text-right">£{item.rate.toLocaleString()}</span>span>
                                                                    <span className="col-span-2 text-sm text-white font-medium text-right">£{(item.qty * item.rate).toLocaleString()}</span>span>
                                                      </div>div>
                                                    ))}
                                                  <div className="px-4 py-3 border-t border-white/10 space-y-1">
                                                              <div className="flex justify-between text-sm">
                                                                            <span className="text-slate-400">Subtotal</span>span>
                                                                            <span className="text-white">£{invoice.amount.toLocaleString()}</span>span>
                                                              </div>div>
                                                              <div className="flex justify-between text-sm">
                                                                            <span className="text-slate-400">VAT (20%)</span>span>
                                                                            <span className="text-white">£{vat.toLocaleString()}</span>span>
                                                              </div>div>
                                                              <div className="flex justify-between text-base font-bold border-t border-white/10 pt-2 mt-2">
                                                                            <span className="text-white">Total</span>span>
                                                                            <span className="text-amber-400">£{total.toLocaleString()}</span>span>
                                                              </div>div>
                                                  </div>div>
                                        </div>div>
                                
                                        <div className="flex gap-2">
                                          {invoice.status === 'Draft' && (
                                                      <button onClick={markSent} className="flex-1 py-2.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold text-sm rounded-xl hover:bg-blue-500/30 transition-colors">
                                                                    Mark as Sent
                                                      </button>button>
                                                  )}
                                          {(invoice.status === 'Sent' || invoice.status === 'Overdue') && (
                                                      <button onClick={markPaid} className="flex-1 py-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-sm rounded-xl hover:bg-emerald-500/30 transition-colors">
                                                                    Mark as Paid
                                                      </button>button>
                                                  )}
                                                  <button
                                                                onClick={() => window.print()}
                                                                className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-white font-semibold text-sm rounded-xl hover:bg-white/10 transition-colors"
                                                              >
                                                              <Download className="w-4 h-4" /> Download
                                                  </button>button>
                                        </div>div>
                                </motion.div>motion.div>
                          </motion.div>motion.div>
                        )
                      }
                      
                      export default function InvoicesPage() {
                          const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES)
                              const [search, setSearch] = useState('')
                                  const [statusFilter, setStatusFilter] = useState<string>('All')
                                      const [showNew, setShowNew] = useState(false)
                                          const [selected, setSelected] = useState<Invoice | null>(null)
                                              const [showFilterMenu, setShowFilterMenu] = useState(false)
                                                
                                                  const statuses = ['All', 'Draft', 'Sent', 'Paid', 'Overdue']
                                                    
                                                      const filtered = invoices.filter(inv => {
                                                            const matchSearch = inv.client.toLowerCase().includes(search.toLowerCase()) ||
                                                                    inv.project.toLowerCase().includes(search.toLowerCase()) ||
                                                                    inv.id.toLowerCase().includes(search.toLowerCase())
                                                                  const matchStatus = statusFilter === 'All' || inv.status === statusFilter
                                                                        return matchSearch && matchStatus
                                                      })
                                                        
                                                          const stats = {
                                                                total: invoices.reduce((s, i) => s + i.amount, 0),
                                                                paid: invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0),
                                                                outstanding: invoices.filter(i => i.status === 'Sent' || i.status === 'Overdue').reduce((s, i) => s + i.amount, 0),
                                                                overdue: invoices.filter(i => i.status === 'Overdue').length,
                                                          }
                                                            
                                                              const saveInvoice = (inv: Invoice) => {
                                                                    setInvoices(prev => [inv, ...prev])
                                                                          setShowNew(false)
                                                              }
                                                                
                                                                  const updateInvoice = (inv: Invoice) => {
                                                                        setInvoices(prev => prev.map(i => i.id === inv.id ? inv : i))
                                                                              setSelected(inv)
                                                                  }
                                                                    
                                                                      const deleteInvoice = (id: string, e: React.MouseEvent) => {
                                                                            e.stopPropagation()
                                                                                  setInvoices(prev => prev.filter(i => i.id !== id))
                                                                                        if (selected?.id === id) setSelected(null)
                                                                      }
                                                                        
                                                                          return (
                                                                                <div className="flex h-screen bg-[#04080F] overflow-hidden">
                                                                                      <Sidebar />
                                                                                      <div className="flex flex-col flex-1 min-w-0 ml-64 overflow-hidden">
                                                                                              <TopHeader />
                                                                                              <div className="flex-1 overflow-y-auto p-8">
                                                                                                        <div className="max-w-6xl mx-auto">
                                                                                                          {/* Header */}
                                                                                                                    <div className="flex items-center justify-between mb-8">
                                                                                                                                  <div>
                                                                                                                                                  <h1 className="text-2xl font-black text-white tracking-tight">Invoices</h1>h1>
                                                                                                                                                  <p className="text-slate-400 text-sm mt-1">Manage your billing and payments</p>p>
                                                                                                                                    </div>div>
                                                                                                                                  <button
                                                                                                                                                    onClick={() => setShowNew(true)}
                                                                                                                                                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 text-black font-bold text-sm rounded-xl hover:bg-amber-300 transition-colors"
                                                                                                                                                  >
                                                                                                                                                  <Plus className="w-4 h-4" /> New Invoice
                                                                                                                                    </button>button>
                                                                                                                      </div>div>
                                                                                                        
                                                                                                          {/* Stats */}
                                                                                                                    <div className="grid grid-cols-4 gap-4 mb-8">
                                                                                                                      {[
                                                                                  { label: 'Total Invoiced', value: `£${(stats.total).toLocaleString()}`, color: 'text-white' },
                                                                                  { label: 'Collected', value: `£${stats.paid.toLocaleString()}`, color: 'text-emerald-400' },
                                                                                  { label: 'Outstanding', value: `£${stats.outstanding.toLocaleString()}`, color: 'text-blue-400' },
                                                                                  { label: 'Overdue', value: stats.overdue.toString(), color: 'text-red-400', suffix: stats.overdue === 1 ? ' invoice' : ' invoices' },
                                                                                                ].map(stat => (
                                                                                                                  <div key={stat.label} className="bg-[#0A1020] border border-[#1A2540] rounded-2xl p-5">
                                                                                                                                    <p className="text-xs text-slate-500 mb-1">{stat.label}</p>p>
                                                                                                                                    <p className={`text-2xl font-black ${stat.color}`}>
                                                                                                                                      {stat.value}
                                                                                                                                      {stat.suffix && <span className="text-sm font-normal text-slate-500">{stat.suffix}</span>span>}
                                                                                                                                      </p>p>
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
                                                                                                                                                                      placeholder="Search invoices..."
                                                                                                                                                                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
                                                                                                                                                                    />
                                                                                                                                    </div>div>
                                                                                                                                  <div className="relative">
                                                                                                                                                  <button
                                                                                                                                                                      onClick={() => setShowFilterMenu(!showFilterMenu)}
                                                                                                                                                                      className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white hover:bg-white/10 transition-colors"
                                                                                                                                                                    >
                                                                                                                                                                    <Filter className="w-4 h-4 text-slate-400" />
                                                                                                                                                    {statusFilter}
                                                                                                                                                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                                                                                                                                    </button>button>
                                                                                                                                                  <AnimatePresence>
                                                                                                                                                    {showFilterMenu && (
                                                                                                      <motion.div
                                                                                                                              initial={{ opacity: 0, y: 4 }}
                                                                                                                              animate={{ opacity: 1, y: 0 }}
                                                                                                                              exit={{ opacity: 0, y: 4 }}
                                                                                                                              className="absolute right-0 top-full mt-1 w-40 bg-[#0F1A2E] border border-white/10 rounded-xl overflow-hidden shadow-xl z-20"
                                                                                                                            >
                                                                                                        {statuses.map(s => (
                                                                                                                                                      <button
                                                                                                                                                                                  key={s}
                                                                                                                                                                                  onClick={() => { setStatusFilter(s); setShowFilterMenu(false) }}
                                                                                                                                                                                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${statusFilter === s ? 'text-amber-400 bg-amber-400/10' : 'text-slate-300 hover:bg-white/5'}`}
                                                                                                                                                                                >
                                                                                                                                                        {s}
                                                                                                                                                        </button>button>
                                                                                                                                                    ))}
                                                                                                        </motion.div>motion.div>
                                                                                                    )}
                                                                                                                                                    </AnimatePresence>AnimatePresence>
                                                                                                                                    </div>div>
                                                                                                                      </div>div>
                                                                                                        
                                                                                                          {/* Invoice table */}
                                                                                                                    <div className="bg-[#0A1020] border border-[#1A2540] rounded-2xl overflow-hidden">
                                                                                                                                  <div className="grid grid-cols-12 px-6 py-3 border-b border-[#1A2540] text-xs text-slate-500 font-semibold uppercase tracking-wide">
                                                                                                                                                  <span className="col-span-2">Invoice</span>span>
                                                                                                                                                  <span className="col-span-3">Client</span>span>
                                                                                                                                                  <span className="col-span-3">Project</span>span>
                                                                                                                                                  <span className="col-span-1">Status</span>span>
                                                                                                                                                  <span className="col-span-2 text-right">Amount</span>span>
                                                                                                                                                  <span className="col-span-1"></span>span>
                                                                                                                                    </div>div>
                                                                                                                      {filtered.length === 0 ? (
                                                                                                  <div className="py-16 text-center text-slate-500">
                                                                                                                    <FileText className="w-8 h-8 mx-auto mb-3 opacity-30" />
                                                                                                                    <p className="text-sm">No invoices found</p>p>
                                                                                                    </div>div>
                                                                                                ) : filtered.map((inv, i) => (
                                                                                                  <motion.div
                                                                                                                      key={inv.id}
                                                                                                                      initial={{ opacity: 0 }}
                                                                                                                      animate={{ opacity: 1 }}
                                                                                                                      transition={{ delay: i * 0.03 }}
                                                                                                                      onClick={() => setSelected(inv)}
                                                                                                                      className="group grid grid-cols-12 px-6 py-4 border-b border-[#1A2540] last:border-0 cursor-pointer hover:bg-white/3 transition-colors items-center"
                                                                                                                    >
                                                                                                                    <span className="col-span-2 text-sm font-mono text-amber-400 font-semibold">{inv.id}</span>span>
                                                                                                                    <span className="col-span-3 text-sm text-white font-medium">{inv.client}</span>span>
                                                                                                                    <span className="col-span-3 text-sm text-slate-400 truncate">{inv.project}</span>span>
                                                                                                                    <span className="col-span-1">
                                                                                                                                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full ${STATUS_STYLE[inv.status]}`}>
                                                                                                                                          {inv.status}
                                                                                                                                          </span>span>
                                                                                                                      </span>span>
                                                                                                                    <span className="col-span-2 text-sm font-bold text-white text-right">£{inv.amount.toLocaleString()}</span>span>
                                                                                                                    <span className="col-span-1 flex justify-end">
                                                                                                                                        <button
                                                                                                                                                                onClick={e => deleteInvoice(inv.id, e)}
                                                                                                                                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-500/10"
                                                                                                                                                              >
                                                                                                                                                              <Trash2 className="w-3.5 h-3.5 text-slate-500 hover:text-red-400" />
                                                                                                                                          </button>button>
                                                                                                                      </span>span>
                                                                                                    </motion.div>motion.div>
                                                                                                ))}
                                                                                                                      </div>div>
                                                                                                          </div>div>
                                                                                                </div>div>
                                                                                      </div>div>
                                                                                
                                                                                      <AnimatePresence>
                                                                                        {showNew && <NewInvoiceModal onClose={() => setShowNew(false)} onSave={saveInvoice} />}
                                                                                        {selected && <InvoiceDetailModal invoice={selected} onClose={() => setSelected(null)} onUpdate={updateInvoice} />}
                                                                                      </AnimatePresence>AnimatePresence>
                                                                                </div>div>
                                                                              )
                                                                            }</motion.div>
