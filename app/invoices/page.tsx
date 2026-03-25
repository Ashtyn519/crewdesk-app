'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'
import { Plus, Search, X, Trash2, CheckCircle, FileText, Download } from 'lucide-react'

export const dynamic = 'force-dynamic'

type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue'
type LineItem = { description: string; qty: number; rate: number }
type Invoice = { id: string; number: string; client: string; project: string; items: LineItem[]; status: InvoiceStatus; date: string; dueDate: string; notes: string }

const vatRate = 0.2

const initialInvoices: Invoice[] = [
  { id: 'i1', number: 'INV-001', client: 'Neon Films Ltd', project: 'Neon Nights', items: [{ description: 'Director of Photography - 5 days', qty: 5, rate: 750 }], status: 'paid', date: 'Mar 1, 2026', dueDate: 'Mar 31, 2026', notes: '' },
  { id: 'i2', number: 'INV-002', client: 'Channel 4', project: 'Apex Documentary', items: [{ description: 'Sound Design - 3 days', qty: 3, rate: 480 }, { description: 'Equipment Hire', qty: 1, rate: 600 }], status: 'sent', date: 'Mar 10, 2026', dueDate: 'Apr 9, 2026', notes: 'Please reference invoice number.' },
  { id: 'i3', number: 'INV-003', client: 'BFI Productions', project: 'City Lights', items: [{ description: 'Production Management - 8 days', qty: 8, rate: 550 }], status: 'overdue', date: 'Feb 15, 2026', dueDate: 'Mar 17, 2026', notes: '' },
  { id: 'i4', number: 'INV-004', client: 'Sky Studios', project: 'Midnight Run', items: [{ description: 'Post Production Edit - 4 days', qty: 4, rate: 520 }], status: 'draft', date: 'Mar 20, 2026', dueDate: 'Apr 19, 2026', notes: 'Draft - pending client approval.' },
]

const STATUS_STYLE: Record<InvoiceStatus, string> = {
  draft: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
  sent: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  paid: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  overdue: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
}

function calcSubtotal(items: LineItem[]) { return items.reduce((s, i) => s + i.qty * i.rate, 0) }

function InvoiceModal({ onClose, onSave }: { onClose: () => void; onSave: (inv: Invoice) => void }) {
  const [form, setForm] = useState({ client: '', project: '', notes: '', dueDate: '' })
  const [items, setItems] = useState<LineItem[]>([{ description: '', qty: 1, rate: 0 }])
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))
  const addItem = () => setItems(p => [...p, { description: '', qty: 1, rate: 0 }])
  const updateItem = (i: number, k: keyof LineItem, v: string) => {
    setItems(p => p.map((item, idx) => idx === i ? { ...item, [k]: k === 'description' ? v : parseFloat(v) || 0 } : item))
  }
  const removeItem = (i: number) => setItems(p => p.filter((_, idx) => idx !== i))
  const submit = () => {
    if (!form.client.trim() || !form.project.trim()) return
    onSave({
      id: 'i' + Date.now(),
      number: 'INV-' + String(Date.now()).slice(-4),
      client: form.client.trim(),
      project: form.project.trim(),
      items,
      status: 'draft',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      dueDate: form.dueDate || '',
      notes: form.notes.trim()
    })
  }
  const subtotal = calcSubtotal(items)
  const total = subtotal * (1 + vatRate)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#0A1020] border border-white/10 rounded-2xl p-7 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">New Invoice</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={18} /></button>
        </div>
        <div className="space-y-4 mb-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Client *</label>
              <input value={form.client} onChange={e => set('client', e.target.value)} placeholder="Client name" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Project *</label>
              <input value={form.project} onChange={e => set('project', e.target.value)} placeholder="Project name" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Due Date</label>
            <input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-slate-400">Line Items</label>
              <button onClick={addItem} className="text-xs text-amber-400 hover:text-amber-300 transition-colors">+ Add Item</button>
            </div>
            {items.map((item, i) => (
              <div key={i} className="grid grid-cols-[1fr_60px_80px_24px] gap-2 mb-2">
                <input value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} placeholder="Description" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none" />
                <input value={item.qty} onChange={e => updateItem(i, 'qty', e.target.value)} type="number" min="1" placeholder="Qty" className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-sm text-white text-center focus:outline-none" />
                <input value={item.rate} onChange={e => updateItem(i, 'rate', e.target.value)} type="number" placeholder="Rate" className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-sm text-white text-center focus:outline-none" />
                <button onClick={() => removeItem(i)} className="text-slate-500 hover:text-rose-400 transition-colors flex items-center justify-center"><X size={14} /></button>
              </div>
            ))}
          </div>
          <div className="bg-white/5 rounded-xl p-4 space-y-1">
            <div className="flex justify-between text-sm"><span className="text-slate-400">Subtotal</span><span className="text-white">£{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-400">VAT (20%)</span><span className="text-white">£{(subtotal * vatRate).toLocaleString()}</span></div>
            <div className="flex justify-between text-sm font-bold border-t border-white/10 pt-1"><span className="text-white">Total</span><span className="text-amber-400">£{total.toLocaleString()}</span></div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} placeholder="Payment terms, reference info..." className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none resize-none" />
          </div>
        </div>
        <button onClick={submit} disabled={!form.client.trim() || !form.project.trim()} className="w-full py-3 bg-amber-400 text-black font-bold rounded-xl text-sm hover:bg-amber-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Create Invoice</button>
      </div>
    </div>
  )
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all')
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState<Invoice | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.client.toLowerCase().includes(search.toLowerCase()) ||
      inv.project.toLowerCase().includes(search.toLowerCase()) ||
      inv.number.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter
    return matchSearch && matchStatus
  })

  const markPaid = (id: string) => setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'paid' } : inv))
  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id))
    setDeleteConfirm(null)
    if (selected?.id === id) setSelected(null)
  }
  const saveNew = (inv: Invoice) => { setInvoices(prev => [inv, ...prev]); setShowModal(false) }

  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + calcSubtotal(i.items) * (1 + vatRate), 0)
  const totalPending = invoices.filter(i => i.status === 'sent').reduce((s, i) => s + calcSubtotal(i.items) * (1 + vatRate), 0)
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + calcSubtotal(i.items) * (1 + vatRate), 0)

  return (
    <div className="flex h-screen bg-[#04080F] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <TopHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Invoices</h1>
              <p className="text-slate-400 text-sm mt-0.5">Track payments, VAT, and billing history</p>
            </div>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-black font-semibold rounded-xl text-sm hover:bg-amber-300 transition-colors"><Plus size={16} />New Invoice</button>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: invoices.length, color: 'text-white' },
              { label: 'Paid', value: `£${Math.round(totalPaid).toLocaleString()}`, color: 'text-emerald-400' },
              { label: 'Pending', value: `£${Math.round(totalPending).toLocaleString()}`, color: 'text-blue-400' },
              { label: 'Overdue', value: `£${Math.round(totalOverdue).toLocaleString()}`, color: 'text-rose-400' },
            ].map(s => (
              <div key={s.label} className="bg-[#0A1020] border border-white/5 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoices..." className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
            </div>
            <div className="flex gap-1">
              {(['all', 'draft', 'sent', 'paid', 'overdue'] as const).map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${statusFilter === s ? 'bg-amber-400 text-black' : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'}`}>{s}</button>
              ))}
            </div>
          </div>

          <div className="bg-[#0A1020] border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Invoice</th>
                  <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Client</th>
                  <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Project</th>
                  <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Amount</th>
                  <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Date</th>
                  <th className="text-left text-xs text-slate-400 font-medium px-4 py-3">Status</th>
                  <th className="text-right text-xs text-slate-400 font-medium px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv, i) => {
                  const total = calcSubtotal(inv.items) * (1 + vatRate)
                  return (
                    <tr key={inv.id} className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`} onClick={() => setSelected(inv)}>
                      <td className="px-4 py-3"><div className="flex items-center gap-2"><FileText size={14} className="text-slate-400" /><span className="text-sm text-white font-medium">{inv.number}</span></div></td>
                      <td className="px-4 py-3 text-sm text-slate-300">{inv.client}</td>
                      <td className="px-4 py-3 text-sm text-slate-400">{inv.project}</td>
                      <td className="px-4 py-3 text-sm text-amber-400 font-semibold">£{Math.round(total).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-slate-400">{inv.date}</td>
                      <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLE[inv.status]}`}>{inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}</span></td>
                      <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>{inv.status !== 'paid' && <button onClick={() => markPaid(inv.id)} className="text-slate-400 hover:text-emerald-400 transition-colors" title="Mark paid"><CheckCircle size={14} /></button>}<button onClick={() => setDeleteConfirm(inv.id)} className="text-slate-500 hover:text-rose-400 transition-colors"><Trash2 size={14} /></button></div></td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">No invoices found</td></tr>}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {selected && (
        <div className="fixed inset-0 z-40 flex" onClick={() => setSelected(null)}>
          <div className="flex-1 bg-black/40" />
          <div className="w-96 bg-[#0A1020] border-l border-white/10 h-full overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-white">{selected.number}</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-3 mb-5">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-slate-400 mb-1">Client</p><p className="text-sm text-white">{selected.client}</p></div>
                <div><p className="text-xs text-slate-400 mb-1">Project</p><p className="text-sm text-white">{selected.project}</p></div>
              </div>
              <div><p className="text-xs text-slate-400 mb-1">Status</p><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLE[selected.status]}`}>{selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}</span></div>
            </div>
            <div className="mb-5">
              <p className="text-xs text-slate-400 mb-2">Line Items</p>
              {selected.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">{item.description} x{item.qty}</span>
                  <span className="text-white">£{(item.qty * item.rate).toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-white/10 mt-2 pt-2 space-y-1">
                <div className="flex justify-between text-sm"><span className="text-slate-400">Subtotal</span><span className="text-white">£{calcSubtotal(selected.items).toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">VAT (20%)</span><span className="text-white">£{Math.round(calcSubtotal(selected.items) * vatRate).toLocaleString()}</span></div>
                <div className="flex justify-between text-sm font-bold"><span className="text-white">Total</span><span className="text-amber-400">£{Math.round(calcSubtotal(selected.items) * (1 + vatRate)).toLocaleString()}</span></div>
              </div>
            </div>
            <div className="space-y-2">
              {selected.status !== 'paid' && (
                <button onClick={() => { markPaid(selected.id); setSelected(prev => prev ? { ...prev, status: 'paid' } : null) }} className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500 text-white font-semibold rounded-xl text-sm hover:bg-emerald-600 transition-colors"><CheckCircle size={16} />Mark as Paid</button>
              )}
              <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 text-slate-300 border border-white/10 font-semibold rounded-xl text-sm hover:bg-white/10 transition-colors"><Download size={16} />Download PDF</button>
              <button onClick={() => setDeleteConfirm(selected.id)} className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold rounded-xl text-sm hover:bg-rose-500/20 transition-colors"><Trash2 size={16} />Delete Invoice</button>
            </div>
          </div>
        </div>
      )}

      {showModal && <InvoiceModal onClose={() => setShowModal(false)} onSave={saveNew} />}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0A1020] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Delete Invoice</h3>
            <p className="text-sm text-slate-400 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-white/10 text-slate-300 rounded-xl text-sm hover:bg-white/5 transition-colors">Cancel</button>
              <button onClick={() => deleteInvoice(deleteConfirm)} className="flex-1 py-2.5 bg-rose-500 text-white font-semibold rounded-xl text-sm hover:bg-rose-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
            }
