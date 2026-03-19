'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'

interface InvoiceItem { description: string; qty: number; rate: number }
interface Invoice {
  id: string; client: string; project: string; status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  amount: number; issued: string; due: string; items: InvoiceItem[]
}

const INVOICES: Invoice[] = [
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

function NewInvoiceModal({ onClose, onSave }: { onClose: () => void; onSave: (inv: Invoice) => void }) {
  const [client, setClient] = useState('')
  const [project, setProject] = useState('')
  const [due, setDue] = useState('')
  const [items, setItems] = useState<InvoiceItem[]>([{ description: '', qty: 1, rate: 0 }])
  const total = items.reduce((s, i) => s + i.qty * i.rate, 0)
  const setItem = (idx: number, k: keyof InvoiceItem, v: string | number) => setItems(items.map((item, i) => i === idx ? { ...item, [k]: v } : item))
  const submit = () => {
    const inv: Invoice = { id: `INV-${Date.now().toString().slice(-4)}`, client, project, status: 'Draft', amount: total, issued: new Date().toISOString().slice(0, 10), due, items }
    onSave(inv)
  }
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="bg-[#0A1020] border border-white/10 rounded-2xl p-7 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto" initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-white mb-5">New Invoice</h2>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div><label className="text-xs text-gray-400 mb-1 block">Client</label><input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-400/50 focus:outline-none" value={client} onChange={e => setClient(e.target.value)} placeholder="Client name" /></div>
          <div><label className="text-xs text-gray-400 mb-1 block">Project</label><input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-400/50 focus:outline-none" value={project} onChange={e => setProject(e.target.value)} placeholder="Project name" /></div>
          <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">Due Date</label><input type="date" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-400/50 focus:outline-none" value={due} onChange={e => setDue(e.target.value)} /></div>
        </div>
        <div className="mb-4">
          <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 mb-2 px-1">
            <span className="col-span-6">Description</span><span className="col-span-2">Qty</span><span className="col-span-3">Rate (£)</span><span className="col-span-1" />
          </div>
          {items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 mb-2">
              <input className="col-span-6 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:border-amber-400/50 focus:outline-none" value={item.description} onChange={e => setItem(idx, 'description', e.target.value)} placeholder="e.g. Direction" />
              <input type="number" className="col-span-2 bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-white text-xs focus:border-amber-400/50 focus:outline-none" value={item.qty} onChange={e => setItem(idx, 'qty', Number(e.target.value))} />
              <input type="number" className="col-span-3 bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-white text-xs focus:border-amber-400/50 focus:outline-none" value={item.rate} onChange={e => setItem(idx, 'rate', Number(e.target.value))} />
              <button onClick={() => setItems(items.filter((_, i) => i !== idx))} className="col-span-1 text-gray-500 hover:text-red-400 text-xs transition-colors">×</button>
            </div>
          ))}
          <button onClick={() => setItems([...items, { description: '', qty: 1, rate: 0 }])} className="text-amber-400 text-xs hover:text-amber-300 transition-colors mt-1">+ Add line item</button>
        </div>
        <div className="flex justify-end mb-5">
          <div className="text-right"><p className="text-xs text-gray-500">Total</p><p className="text-2xl font-bold text-white">£{total.toLocaleString()}</p></div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-400 text-sm hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={submit} className="flex-1 py-2.5 rounded-lg bg-amber-400 text-black font-semibold text-sm hover:bg-amber-300 transition-colors">Create Invoice</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function InvoiceDetailModal({ invoice, onClose, onMarkPaid, onDelete }: { invoice: Invoice; onClose: () => void; onMarkPaid: () => void; onDelete: () => void }) {
  const subtotal = invoice.items.reduce((s, i) => s + i.qty * i.rate, 0)
  const vat = subtotal * 0.2
  const total = subtotal + vat

  const printInvoice = () => {
    const html = `
      <html><head><title>Invoice ${invoice.id}</title>
      <style>body{font-family:sans-serif;padding:40px;color:#111}h1{margin-bottom:4px}table{width:100%;border-collapse:collapse;margin:20px 0}th,td{text-align:left;padding:8px;border-bottom:1px solid #eee}th{background:#f9f9f9}.right{text-align:right}.total{font-weight:bold;font-size:1.2em}</style></head>
      <body>
      <h1>${invoice.id}</h1><p style="color:#666">${invoice.client} — ${invoice.project}</p>
      <p>Issued: ${invoice.issued} | Due: ${invoice.due}</p>
      <table><thead><tr><th>Description</th><th>Qty</th><th class="right">Rate</th><th class="right">Amount</th></tr></thead>
      <tbody>${invoice.items.map(i => `<tr><td>${i.description}</td><td>${i.qty}</td><td class="right">£${i.rate.toLocaleString()}</td><td class="right">£${(i.qty * i.rate).toLocaleString()}</td></tr>`).join('')}</tbody></table>
      <div style="text-align:right"><p>Subtotal: £${subtotal.toLocaleString()}</p><p>VAT (20%): £${vat.toLocaleString()}</p><p class="total">Total: £${total.toLocaleString()}</p></div>
      </body></html>`
    const w = window.open('', '_blank')!
    w.document.write(html)
    w.document.close()
    w.print()
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="bg-[#0A1020] border border-white/10 rounded-2xl p-8 w-full max-w-xl shadow-2xl" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">{invoice.id}</h2>
            <p className="text-gray-400 text-sm mt-1">{invoice.client} · {invoice.project}</p>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full ${STATUS_STYLE[invoice.status]}`}>{invoice.status}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
          <div><p className="text-gray-500 text-xs">Issued</p><p className="text-white">{invoice.issued}</p></div>
          <div><p className="text-gray-500 text-xs">Due</p><p className="text-white">{invoice.due}</p></div>
        </div>
        <div className="bg-white/[0.03] rounded-xl overflow-hidden mb-5">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/5"><th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">Description</th><th className="text-center px-3 py-2.5 text-xs text-gray-500 font-medium">Qty</th><th className="text-right px-4 py-2.5 text-xs text-gray-500 font-medium">Amount</th></tr></thead>
            <tbody>{invoice.items.map((item, i) => (<tr key={i} className="border-b border-white/[0.03]"><td className="px-4 py-2.5 text-gray-200">{item.description}</td><td className="px-3 py-2.5 text-center text-gray-400">{item.qty}</td><td className="px-4 py-2.5 text-right text-white">£{(item.qty * item.rate).toLocaleString()}</td></tr>))}</tbody>
          </table>
          <div className="px-4 py-3 space-y-1 text-sm">
            <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>£{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-gray-400"><span>VAT (20%)</span><span>£{vat.toLocaleString()}</span></div>
            <div className="flex justify-between text-white font-semibold pt-1 border-t border-white/5"><span>Total</span><span>£{total.toLocaleString()}</span></div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-400 text-sm hover:bg-white/5 transition-colors">Close</button>
          <button onClick={printInvoice} className="px-4 py-2.5 rounded-lg border border-white/10 text-gray-300 text-sm hover:bg-white/5 transition-colors">🖨️ Print / PDF</button>
          {invoice.status !== 'Paid' && <button onClick={onMarkPaid} className="flex-1 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm transition-colors">✓ Mark Paid</button>}
          <button onClick={onDelete} className="px-4 py-2.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm transition-colors">🗑️</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(INVOICES)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Invoice | null>(null)
  const [showNew, setShowNew] = useState(false)

  const filtered = invoices.filter(inv => (filter === 'All' || inv.status === filter) && (inv.client.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase()) || inv.project.toLowerCase().includes(search.toLowerCase())))

  const totalPaid = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0)
  const totalOutstanding = invoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + i.amount, 0)
  const overdue = invoices.filter(i => i.status === 'Overdue').length

  const markPaid = (id: string) => { setInvoices(inv => inv.map(i => i.id === id ? { ...i, status: 'Paid' } : i)); setSelected(null) }
  const deleteInv = (id: string) => { setInvoices(inv => inv.filter(i => i.id !== id)); setSelected(null) }
  const addInvoice = (inv: Invoice) => { setInvoices(i => [inv, ...i]); setShowNew(false) }

  return (
    <div className="flex h-screen bg-[#04080F] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Invoices', value: invoices.length, sub: `${invoices.filter(i=>i.status==='Draft').length} drafts` },
              { label: 'Total Paid', value: `£${(totalPaid/1000).toFixed(1)}k`, sub: 'collected to date', color: 'text-emerald-400' },
              { label: 'Outstanding', value: `£${(totalOutstanding/1000).toFixed(1)}k`, sub: 'awaiting payment', color: 'text-amber-400' },
              { label: 'Overdue', value: overdue, sub: 'requires attention', color: overdue > 0 ? 'text-red-400' : 'text-gray-400' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-[#0A1020] border border-white/[0.06] rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color || 'text-white'}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex bg-[#0A1020] border border-white/[0.06] rounded-lg p-0.5 gap-0.5">
              {['All', 'Draft', 'Sent', 'Paid', 'Overdue'].map(t => (
                <button key={t} onClick={() => setFilter(t)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filter === t ? 'bg-amber-400 text-black' : 'text-gray-400 hover:text-white'}`}>{t}</button>
              ))}
            </div>
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input className="w-full bg-[#0A1020] border border-white/[0.06] rounded-lg pl-8 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-amber-400/50 focus:outline-none" placeholder="Search invoices, clients..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button onClick={() => setShowNew(true)} className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
              <span className="text-base leading-none">+</span> New Invoice
            </button>
          </div>

          {/* Invoice Table */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#0A1020] border border-white/[0.06] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-white/5">
                {['Invoice', 'Client', 'Project', 'Status', 'Amount', 'Issued', 'Due', ''].map(h => (
                  <th key={h} className="text-left text-xs text-gray-500 font-medium px-4 py-3">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((inv, i) => (
                    <motion.tr key={inv.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ delay: i * 0.03 }}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer group" onClick={() => setSelected(inv)}>
                      <td className="px-4 py-3 text-amber-400 text-sm font-mono font-medium">{inv.id}</td>
                      <td className="px-4 py-3 text-white text-sm">{inv.client}</td>
                      <td className="px-4 py-3 text-gray-400 text-sm">{inv.project}</td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLE[inv.status]}`}>{inv.status}</span></td>
                      <td className="px-4 py-3 text-white font-semibold text-sm">£{inv.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{inv.issued}</td>
                      <td className="px-4 py-3 text-xs"><span className={inv.status === 'Overdue' ? 'text-red-400' : 'text-gray-400'}>{inv.due}</span></td>
                      <td className="px-4 py-3"><div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                        {inv.status !== 'Paid' && <button onClick={() => markPaid(inv.id)} className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs hover:bg-emerald-500/30 transition-colors">Paid</button>}
                        <button onClick={() => deleteInv(inv.id)} className="p-1 rounded bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 text-xs transition-colors">🗑️</button>
                      </div></td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {filtered.length === 0 && <div className="text-center py-16 text-gray-500"><p className="text-3xl mb-2">🧾</p><p>No invoices found</p></div>}
          </motion.div>
        </main>
      </div>

      <AnimatePresence>
        {selected && <InvoiceDetailModal invoice={selected} onClose={() => setSelected(null)} onMarkPaid={() => markPaid(selected.id)} onDelete={() => deleteInv(selected.id)} />}
        {showNew && <NewInvoiceModal onClose={() => setShowNew(false)} onSave={addInvoice} />}
      </AnimatePresence>
    </div>
  )
}
