'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'
import { Plus, Search, X, Trash2, CheckCircle, FileText, Download } from 'lucide-react'

export const dynamic = 'force-dynamic'

type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue'
type LineItem = { description: string; qty: number; rate: number }
type Invoice = { id: string; number: string; client: string; project: string; items: LineItem[]; status: InvoiceStatus; date: string; dueDate?: string }

const vatRate = 0.2

const initialInvoices: Invoice[] = [
  {
    id: 'i1', number: 'INV-001', client: 'Apex Solutions Ltd', project: 'Website Redesign',
    items: [
      { description: 'UI Design — 4 days', qty: 4, rate: 600 },
      { description: 'UX Prototype', qty: 1, rate: 800 },
    ],
    status: 'paid', date: 'Mar 1, 2026', dueDate: 'Mar 31, 2026'
  },
  {
    id: 'i2', number: 'INV-002', client: 'Spark Retail', project: 'Mobile App v2',
    items: [
      { description: 'Full-Stack Development — 6 days', qty: 6, rate: 760 },
      { description: 'API Integration', qty: 1, rate: 1200 },
    ],
    status: 'overdue', date: 'Mar 5, 2026', dueDate: 'Mar 20, 2026'
  },
  {
    id: 'i3', number: 'INV-003', client: 'Meridian Consulting', project: 'Brand Refresh',
    items: [
      { description: 'Brand Strategy Workshop', qty: 2, rate: 1400 },
      { description: 'Logo Design Concepts', qty: 1, rate: 600 },
    ],
    status: 'sent', date: 'Mar 12, 2026', dueDate: 'Apr 12, 2026'
  },
  {
    id: 'i4', number: 'INV-004', client: 'GrowthBase Inc', project: 'Marketing Automation',
    items: [
      { description: 'HubSpot Setup — 3 days', qty: 3, rate: 480 },
      { description: 'Email Templates', qty: 5, rate: 120 },
    ],
    status: 'draft', date: 'Mar 18, 2026', dueDate: 'Apr 18, 2026'
  },
]

const STATUS_STYLE: Record<InvoiceStatus, string> = {
  draft: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
  sent: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  paid: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  overdue: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
}

function calcSubtotal(items: LineItem[]) { return items.reduce((s, i) => s + i.qty * i.rate, 0) }

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [selected, setSelected] = useState<Invoice | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newInv, setNewInv] = useState({ client: '', project: '', description: '', qty: '1', rate: '' })

  const filtered = invoices.filter(inv => {
    const matchStatus = statusFilter === 'All' || inv.status === statusFilter
    const matchSearch = inv.client.toLowerCase().includes(search.toLowerCase()) ||
      inv.project.toLowerCase().includes(search.toLowerCase()) ||
      inv.number.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + calcSubtotal(i.items), 0)
  const totalOutstanding = invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + calcSubtotal(i.items), 0)
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + calcSubtotal(i.items), 0)

  const addInvoice = () => {
    if (!newInv.client || !newInv.rate) return
    const inv: Invoice = {
      id: 'i' + Date.now(),
      number: 'INV-' + String(invoices.length + 1).padStart(3, '0'),
      client: newInv.client, project: newInv.project,
      items: [{ description: newInv.description || 'Services', qty: parseInt(newInv.qty) || 1, rate: parseFloat(newInv.rate) || 0 }],
      status: 'draft',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    }
    setInvoices(prev => [...prev, inv])
    setNewInv({ client: '', project: '', description: '', qty: '1', rate: '' })
    setShowAdd(false)
  }

  const remove = (id: string) => {
    setInvoices(prev => prev.filter(i => i.id !== id))
    setSelected(null)
  }

  const markPaid = (id: string) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: 'paid' } : i))
    setSelected(prev => prev?.id === id ? { ...prev, status: 'paid' } : prev)
  }

  return (
    <div className="flex min-h-screen bg-[#04080F]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopHeader />
        <main className="flex-1 p-6 overflow-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Invoices</h1>
              <p className="text-sm text-white/40 mt-1">{filtered.length} of {invoices.length} invoices</p>
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" /> New Invoice
            </button>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Collected', value: '£' + totalPaid.toLocaleString(), color: 'text-emerald-400' },
              { label: 'Outstanding', value: '£' + totalOutstanding.toLocaleString(), color: 'text-blue-400' },
              { label: 'Overdue', value: '£' + totalOverdue.toLocaleString(), color: 'text-rose-400' },
            ].map(s => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-white/30 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Status filter tabs */}
          <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 w-fit mb-6">
            {['All', 'draft', 'sent', 'paid', 'overdue'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${statusFilter === s ? 'bg-amber-400 text-black' : 'text-white/40 hover:text-white'}`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search invoices, clients, or projects..."
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30"
            />
          </div>

          {/* Invoices table */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/30 border-b border-white/5">
                  <th className="text-left px-5 py-3 font-medium">Invoice</th>
                  <th className="text-left px-5 py-3 font-medium">Client</th>
                  <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Project</th>
                  <th className="text-right px-5 py-3 font-medium">Amount</th>
                  <th className="text-right px-5 py-3 font-medium">Status</th>
                  <th className="text-right px-5 py-3 font-medium hidden sm:table-cell">Due</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(inv => {
                  const subtotal = calcSubtotal(inv.items)
                  const total = subtotal * (1 + vatRate)
                  return (
                    <tr
                      key={inv.id}
                      onClick={() => setSelected(inv)}
                      className="border-b border-white/5 hover:bg-white/[0.03] cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-3.5 text-white font-medium">{inv.number}</td>
                      <td className="px-5 py-3.5 text-white/70">{inv.client}</td>
                      <td className="px-5 py-3.5 text-white/40 hidden md:table-cell">{inv.project}</td>
                      <td className="px-5 py-3.5 text-right text-white font-semibold">£{total.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-right">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLE[inv.status]}`}>
                          {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right text-white/30 text-xs hidden sm:table-cell">{inv.dueDate || '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="text-white/30 text-sm">No invoices found.</p>
              </div>
            )}
          </div>

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
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span className="text-white font-bold">{selected.number}</span>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-white font-semibold mb-0.5">{selected.client}</p>
            <p className="text-white/40 text-sm mb-4">{selected.project}</p>
            <div className="space-y-1.5 mb-4">
              {selected.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-white/50">{item.description}</span>
                  <span className="text-white/70">£{(item.qty * item.rate).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/5 pt-3 space-y-1.5 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-white/30">Subtotal</span>
                <span className="text-white">£{calcSubtotal(selected.items).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/30">VAT (20%)</span>
                <span className="text-white">£{(calcSubtotal(selected.items) * vatRate).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-white">Total</span>
                <span className="text-amber-400">£{(calcSubtotal(selected.items) * (1 + vatRate)).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-5 text-sm">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLE[selected.status]}`}>
                {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
              </span>
              <span className="text-white/30">{selected.dueDate ? 'Due ' + selected.dueDate : ''}</span>
            </div>
            <div className="flex gap-2">
              {(selected.status === 'sent' || selected.status === 'overdue') && (
                <button
                  onClick={() => markPaid(selected.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-400 hover:bg-emerald-300 text-black text-sm font-semibold py-2.5 rounded-xl transition-colors"
                >
                  <CheckCircle className="w-4 h-4" /> Mark Paid
                </button>
              )}
              <button className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 text-white/60 hover:text-white text-sm py-2.5 rounded-xl transition-colors">
                <Download className="w-4 h-4" /> PDF
              </button>
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

      {/* Add invoice modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowAdd(false)}>
          <div
            className="w-full max-w-md bg-[#0D1117] border border-white/10 rounded-2xl p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold text-lg">New Invoice</h2>
              <button onClick={() => setShowAdd(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input value={newInv.client} onChange={e => setNewInv(p => ({ ...p, client: e.target.value }))} placeholder="Client name *"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30" />
              <input value={newInv.project} onChange={e => setNewInv(p => ({ ...p, project: e.target.value }))} placeholder="Project"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30" />
              <input value={newInv.description} onChange={e => setNewInv(p => ({ ...p, description: e.target.value }))} placeholder="Line item description"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" value={newInv.qty} onChange={e => setNewInv(p => ({ ...p, qty: e.target.value }))} placeholder="Qty"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                <input type="number" value={newInv.rate} onChange={e => setNewInv(p => ({ ...p, rate: e.target.value }))} placeholder="Rate (£) *"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 bg-white/5 border border-white/10 text-white/60 py-2.5 rounded-xl text-sm hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={addInvoice} className="flex-1 bg-amber-400 hover:bg-amber-300 text-black font-semibold py-2.5 rounded-xl text-sm transition-colors">Create Invoice</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
