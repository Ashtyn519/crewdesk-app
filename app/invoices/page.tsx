'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Plus, Download, CheckCircle, Receipt, Search, Trash2 } from 'lucide-react'

export const dynamic = "force-dynamic";


type LineItem = { description: string; qty: number; rate: number }
type Invoice = {
  id: string; invoice_number: string; client_name: string; client_email: string;
  status: string; subtotal: number; tax_rate: number; total: number;
  due_date: string; paid_at: string; line_items: LineItem[]; notes: string; created_at: string;
}
const EMPTY_FORM = { invoice_number: '', client_name: '', client_email: '', status: 'draft', subtotal: 0, tax_rate: 20, total: 0, due_date: '', notes: '', line_items: [{ description: '', qty: 1, rate: 0 }] }
const STATUS_COLORS: Record<string,string> = { draft:'bg-slate-700 text-slate-400', sent:'bg-amber-400/10 text-amber-400', paid:'bg-emerald-400/10 text-emerald-400', overdue:'bg-red-400/10 text-red-400' }

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<any>(EMPTY_FORM)
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.from('invoices').select('*').eq('user_id', user?.id).order('created_at', { ascending: false })
    setInvoices(data || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const calcTotals = (items: LineItem[], taxRate: number) => {
    const subtotal = items.reduce((s, i) => s + (i.qty * i.rate), 0)
    const total = subtotal * (1 + taxRate / 100)
    return { subtotal: Math.round(subtotal * 100) / 100, total: Math.round(total * 100) / 100 }
  }

  const updateLineItem = (idx: number, field: keyof LineItem, val: string | number) => {
    const items = [...form.line_items]
    items[idx] = { ...items[idx], [field]: field === 'description' ? val : parseFloat(val as string) || 0 }
    const { subtotal, total } = calcTotals(items, form.tax_rate)
    setForm((f: any) => ({ ...f, line_items: items, subtotal, total }))
  }

  const addLineItem = () => setForm((f: any) => ({ ...f, line_items: [...f.line_items, { description: '', qty: 1, rate: 0 }] }))
  const removeLineItem = (idx: number) => {
    const items = form.line_items.filter((_: any, i: number) => i !== idx)
    const { subtotal, total } = calcTotals(items, form.tax_rate)
    setForm((f: any) => ({ ...f, line_items: items, subtotal, total }))
  }

  const handleSave = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const num = form.invoice_number || `INV-${Date.now().toString().slice(-6)}`
    await supabase.from('invoices').insert({ ...form, invoice_number: num, user_id: user?.id })
    await load()
    setShowModal(false)
    setForm({ ...EMPTY_FORM, invoice_number: `INV-${Date.now().toString().slice(-6)}` })
    setSaving(false)
  }

  const markPaid = async (id: string) => {
    await supabase.from('invoices').update({ status: 'paid', paid_at: new Date().toISOString() }).eq('id', id)
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'paid', paid_at: new Date().toISOString() } : inv))
  }

  const deleteInvoice = async (id: string) => {
    if (!confirm('Delete invoice?')) return
    await supabase.from('invoices').delete().eq('id', id)
    setInvoices(prev => prev.filter(inv => inv.id !== id))
  }

  const downloadPDF = (inv: Invoice) => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${inv.invoice_number}</title><style>
      body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;color:#333;padding:20px}
      .header{display:flex;justify-content:space-between;margin-bottom:40px}
      .title{font-size:48px;font-weight:900;color:#F59E0B}
      .status{padding:8px 16px;border-radius:20px;font-size:12px;font-weight:bold;text-transform:uppercase;background:${inv.status==='paid'?'#10B981':'#F59E0B'};color:white}
      table{width:100%;border-collapse:collapse;margin:20px 0}
      th{background:#f5f5f5;padding:12px;text-align:left;border-bottom:2px solid #ddd}
      td{padding:12px;border-bottom:1px solid #eee}
      .totals{text-align:right;margin-top:20px}
      .total-row{font-size:20px;font-weight:bold;color:#F59E0B}
    </style></head><body>
      <div class="header">
        <div><div class="title">INVOICE</div><div style="color:#666">${inv.invoice_number}</div></div>
        <div><span class="status">${inv.status}</span></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:30px">
        <div><strong>Bill To:</strong><br>${inv.client_name}<br>${inv.client_email || ''}</div>
        <div style="text-align:right"><strong>Date:</strong> ${new Date(inv.created_at).toLocaleDateString('en-GB')}<br><strong>Due:</strong> ${inv.due_date ? new Date(inv.due_date).toLocaleDateString('en-GB') : 'N/A'}</div>
      </div>
      <table><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr>
        ${(inv.line_items || []).map((li: LineItem) => `<tr><td>${li.description}</td><td>${li.qty}</td><td>£${li.rate.toFixed(2)}</td><td>£${(li.qty*li.rate).toFixed(2)}</td></tr>`).join('')}
      </table>
      <div class="totals">
        <div>Subtotal: £${inv.subtotal?.toFixed(2)}</div>
        <div>VAT (${inv.tax_rate}%): £${((inv.total||0)-(inv.subtotal||0)).toFixed(2)}</div>
        <div class="total-row">Total: £${inv.total?.toFixed(2)}</div>
      </div>
      ${inv.notes ? `<div style="margin-top:30px;padding:15px;background:#f9f9f9;border-radius:8px"><strong>Notes:</strong> ${inv.notes}</div>` : ''}
    </body></html>`
    const blob = new Blob([html], { type: 'text/html' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
    a.download = `${inv.invoice_number}.html`; a.click()
  }

  const filtered = invoices.filter(inv => inv.client_name?.toLowerCase().includes(search.toLowerCase()) || inv.invoice_number?.toLowerCase().includes(search.toLowerCase()))

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.total || 0), 0)
  const outstanding = invoices.filter(i => i.status === 'sent').reduce((s, i) => s + (i.total || 0), 0)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-white">Invoices</h1>
          <p className="text-slate-400 mt-1">{invoices.length} invoice{invoices.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setForm({ ...EMPTY_FORM, invoice_number: `INV-${Date.now().toString().slice(-6)}` }); setShowModal(true) }}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-bold px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={18} /> New Invoice
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[['Revenue Collected', formatCurrency(totalRevenue), 'text-emerald-400'],['Outstanding', formatCurrency(outstanding), 'text-amber-400'],['Total Invoices', invoices.length.toString(), 'text-cyan-400']].map(([label, value, color]) => (
          <div key={label} className="bg-[#0F1A2E] rounded-2xl p-4 border border-slate-800">
            <div className={`text-xl font-bold ${color}`}>{value}</div>
            <div className="text-slate-400 text-sm mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-4 top-3.5 text-slate-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoices..."
          className="w-full bg-[#0F1A2E] border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
      </div>

      {loading ? <div className="text-slate-400">Loading...</div> : (
        <div className="space-y-3">
          {filtered.map(inv => (
            <div key={inv.id} className="bg-[#0F1A2E] rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-white font-bold">{inv.invoice_number}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[inv.status] || 'bg-slate-700 text-slate-400'}`}>{inv.status}</span>
                  </div>
                  <div className="text-slate-400 text-sm">{inv.client_name} {inv.due_date && `· Due ${formatDate(inv.due_date)}`}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-white font-bold">{formatCurrency(inv.total)}</div>
                    <div className="text-slate-500 text-xs">incl. VAT</div>
                  </div>
                  <div className="flex gap-2">
                    {inv.status !== 'paid' && (
                      <button onClick={() => markPaid(inv.id)} title="Mark as paid"
                        className="w-8 h-8 bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-400 rounded-lg flex items-center justify-center transition-colors">
                        <CheckCircle size={14} />
                      </button>
                    )}
                    <button onClick={() => downloadPDF(inv)} title="Download PDF"
                      className="w-8 h-8 bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 rounded-lg flex items-center justify-center transition-colors">
                      <Download size={14} />
                    </button>
                    <button onClick={() => deleteInvoice(inv.id)} title="Delete"
                      className="w-8 h-8 bg-red-400/10 hover:bg-red-400/20 text-red-400 rounded-lg flex items-center justify-center transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Receipt size={48} className="text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No invoices yet</p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0F1A2E] rounded-2xl p-6 w-full max-w-2xl border border-slate-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-5">New Invoice</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[['invoice_number','Invoice #'],['client_name','Client Name'],['client_email','Client Email'],['due_date','Due Date']].map(([k,label]) => (
                <div key={k}>
                  <label className="text-slate-300 text-sm block mb-1.5">{label}</label>
                  <input type={k === 'due_date' ? 'date' : 'text'} value={form[k]} onChange={e => setForm((f: any) => ({...f, [k]: e.target.value}))}
                    className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400/50" />
                </div>
              ))}
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-slate-300 text-sm font-medium">Line Items</label>
                <button onClick={addLineItem} className="text-amber-400 hover:text-amber-300 text-sm">+ Add item</button>
              </div>
              <div className="space-y-2">
                {form.line_items.map((item: LineItem, i: number) => (
                  <div key={i} className="grid grid-cols-12 gap-2">
                    <input value={item.description} onChange={e => updateLineItem(i, 'description', e.target.value)} placeholder="Description"
                      className="col-span-6 bg-[#0A1020] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50" />
                    <input type="number" value={item.qty} onChange={e => updateLineItem(i, 'qty', e.target.value)} placeholder="Qty"
                      className="col-span-2 bg-[#0A1020] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50" />
                    <input type="number" value={item.rate} onChange={e => updateLineItem(i, 'rate', e.target.value)} placeholder="Rate"
                      className="col-span-3 bg-[#0A1020] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50" />
                    <button onClick={() => removeLineItem(i)} className="col-span-1 text-red-400 hover:text-red-300 flex items-center justify-center">×</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-slate-300 text-sm block mb-1.5">VAT Rate (%)</label>
                <input type="number" value={form.tax_rate} onChange={e => { const r = parseFloat(e.target.value)||0; const {subtotal,total} = calcTotals(form.line_items,r); setForm((f: any) => ({...f, tax_rate:r, subtotal, total})) }}
                  className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400/50" />
              </div>
              <div className="flex flex-col justify-end">
                <div className="text-slate-400 text-sm">Subtotal: <span className="text-white">{formatCurrency(form.subtotal)}</span></div>
                <div className="text-amber-400 font-bold">Total: {formatCurrency(form.total)}</div>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-slate-300 text-sm block mb-1.5">Notes</label>
              <textarea value={form.notes} onChange={e => setForm((f: any) => ({...f, notes: e.target.value}))} rows={2}
                className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400/50" />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-amber-400 hover:bg-amber-300 text-black font-bold py-2.5 rounded-xl transition-colors disabled:opacity-50">
                {saving ? 'Creating...' : 'Create Invoice'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
