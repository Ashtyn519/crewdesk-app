'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Download, CheckCircle, Clock, AlertCircle, Trash2, Edit2, X, FileText, Printer } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Invoice {
  id: string
  invoice_number: string
  client_name: string
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  due_date: string
  issue_date: string
  description: string
  line_items: LineItem[]
}

interface LineItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

const defaultForm = {
  invoice_number: '',
  client_name: '',
  amount: 0,
  status: 'draft' as Invoice['status'],
  due_date: '',
  issue_date: new Date().toISOString().split('T')[0],
  description: '',
  line_items: [{ description: '', quantity: 1, rate: 0, amount: 0 }] as LineItem[],
}

export default function InvoicesPage() {
  const supabase = createClient()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showPDF, setShowPDF] = useState<Invoice | null>(null)
  const [editing, setEditing] = useState<Invoice | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const printRef = useRef<HTMLDivElement>(null)

  const load = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setInvoices(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const nextInvoiceNumber = () => {
    if (invoices.length === 0) return 'INV-001'
    const nums = invoices.map(i => parseInt(i.invoice_number.replace(/\D/g, '') || '0'))
    return `INV-${String(Math.max(...nums) + 1).padStart(3, '0')}`
  }

  const openNew = () => {
    setEditing(null)
    setForm({ ...defaultForm, invoice_number: nextInvoiceNumber() })
    setShowModal(true)
  }

  const openEdit = (inv: Invoice) => {
    setEditing(inv)
    setForm({
      invoice_number: inv.invoice_number,
      client_name: inv.client_name,
      amount: inv.amount,
      status: inv.status as Invoice['status'],
      due_date: inv.due_date || '',
      issue_date: inv.issue_date || new Date().toISOString().split('T')[0],
      description: inv.description || '',
      line_items: inv.line_items?.length ? inv.line_items : [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    })
    setShowModal(true)
  }

  const updateLineItem = (idx: number, field: keyof LineItem, value: string | number) => {
    const items = [...form.line_items]
    items[idx] = { ...items[idx], [field]: value }
    if (field === 'quantity' || field === 'rate') {
      items[idx].amount = Number(items[idx].quantity) * Number(items[idx].rate)
    }
    const total = items.reduce((s, i) => s + (Number(i.amount) || 0), 0)
    setForm({ ...form, line_items: items, amount: total })
  }

  const addLineItem = () => setForm({ ...form, line_items: [...form.line_items, { description: '', quantity: 1, rate: 0, amount: 0 }] })
  const removeLineItem = (idx: number) => {
    const items = form.line_items.filter((_, i) => i !== idx)
    setForm({ ...form, line_items: items, amount: items.reduce((s, i) => s + i.amount, 0) })
  }

  const handleSave = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const payload = { ...form, user_id: user.id, updated_at: new Date().toISOString() }
    if (editing) {
      await supabase.from('invoices').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('invoices').insert(payload)
    }
    await load()
    setShowModal(false)
    setSaving(false)
  }

  const markPaid = async (inv: Invoice) => {
    await supabase.from('invoices').update({ status: 'paid', updated_at: new Date().toISOString() }).eq('id', inv.id)
    await load()
  }

  const deleteInvoice = async (id: string) => {
    if (!confirm('Delete this invoice?')) return
    await supabase.from('invoices').delete().eq('id', id)
    await load()
  }

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML
    if (!printContent) return
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <html><head><title>Invoice ${showPDF?.invoice_number}</title>
      <style>
        body { font-family: -apple-system, sans-serif; padding: 40px; color: #111; max-width: 800px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .title { font-size: 32px; font-weight: bold; color: #d97706; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #f5f5f5; padding: 10px; text-align: left; border-bottom: 2px solid #ddd; }
        td { padding: 10px; border-bottom: 1px solid #eee; }
        .total { font-size: 20px; font-weight: bold; text-align: right; margin-top: 20px; }
        .badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; display: inline-block; }
        @media print { body { padding: 20px; } }
      </style></head>
      <body>${printContent}</body></html>
    `)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close() }, 500)
  }

  const statusIcon = (status: string) => {
    if (status === 'paid') return <CheckCircle className="w-4 h-4 text-emerald-400" />
    if (status === 'overdue') return <AlertCircle className="w-4 h-4 text-red-400" />
    if (status === 'sent') return <Clock className="w-4 h-4 text-amber-400" />
    return <FileText className="w-4 h-4 text-gray-400" />
  }

  const statusColor = (status: string) => {
    if (status === 'paid') return 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20'
    if (status === 'overdue') return 'text-red-400 bg-red-400/10 border border-red-400/20'
    if (status === 'sent') return 'text-amber-400 bg-amber-400/10 border border-amber-400/20'
    return 'text-gray-400 bg-gray-400/10 border border-gray-400/20'
  }

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.amount || 0), 0)
  const totalPending = invoices.filter(i => i.status === 'sent').reduce((s, i) => s + (i.amount || 0), 0)
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + (i.amount || 0), 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Invoices</h1>
          <p className="text-gray-400 text-sm mt-1">{invoices.length} invoice{invoices.length !== 1 ? 's' : ''} total</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition-colors">
          <Plus className="w-4 h-4" /><span>New Invoice</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#0A1020] rounded-xl p-4 border border-white/5">
          <p className="text-gray-400 text-xs mb-1">Revenue Collected</p>
          <p className="text-2xl font-bold text-emerald-400">£{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-[#0A1020] rounded-xl p-4 border border-white/5">
          <p className="text-gray-400 text-xs mb-1">Pending Payment</p>
          <p className="text-2xl font-bold text-amber-400">£{totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-[#0A1020] rounded-xl p-4 border border-white/5">
          <p className="text-gray-400 text-xs mb-1">Overdue</p>
          <p className="text-2xl font-bold text-red-400">£{totalOverdue.toLocaleString()}</p>
        </div>
      </div>

      {/* Invoice List */}
      <div className="bg-[#0A1020] rounded-xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No invoices yet</p>
            <button onClick={openNew} className="mt-4 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors text-sm">
              Create your first invoice
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Invoice #</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Client</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Amount</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Status</th>
                <th className="text-left text-xs text-gray-400 font-medium px-4 py-3">Due Date</th>
                <th className="text-right text-xs text-gray-400 font-medium px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, idx) => (
                <tr key={inv.id} className={`border-b border-white/5 hover:bg-white/2 transition-colors ${idx === invoices.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-4 py-3">
                    <span className="text-white font-mono text-sm">{inv.invoice_number}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-300">{inv.client_name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-white font-semibold">£{inv.amount?.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1.5 w-fit px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(inv.status)}`}>
                      {statusIcon(inv.status)}
                      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-400 text-sm">
                      {inv.due_date ? new Date(inv.due_date).toLocaleDateString('en-GB') : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => setShowPDF(inv)} className="p-1.5 text-gray-400 hover:text-blue-400 transition-colors" title="Preview/Download PDF">
                        <Printer className="w-4 h-4" />
                      </button>
                      {inv.status !== 'paid' && (
                        <button onClick={() => markPaid(inv)} className="p-1.5 text-gray-400 hover:text-emerald-400 transition-colors" title="Mark as Paid">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => openEdit(inv)} className="p-1.5 text-gray-400 hover:text-amber-400 transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteInvoice(inv.id)} className="p-1.5 text-gray-400 hover:text-red-400 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A1020] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">{editing ? 'Edit Invoice' : 'New Invoice'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Invoice Number</label>
                  <input value={form.invoice_number} onChange={e => setForm({...form, invoice_number: e.target.value})}
                    className="w-full bg-[#04080F] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Client Name</label>
                  <input value={form.client_name} onChange={e => setForm({...form, client_name: e.target.value})}
                    className="w-full bg-[#04080F] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50" placeholder="Client name" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Issue Date</label>
                  <input type="date" value={form.issue_date} onChange={e => setForm({...form, issue_date: e.target.value})}
                    className="w-full bg-[#04080F] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Due Date</label>
                  <input type="date" value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})}
                    className="w-full bg-[#04080F] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value as any})}
                    className="w-full bg-[#04080F] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50">
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2}
                  className="w-full bg-[#04080F] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50 resize-none" placeholder="Invoice description..." />
              </div>

              {/* Line Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-400">Line Items</label>
                  <button onClick={addLineItem} className="text-xs text-amber-400 hover:text-amber-300">+ Add Item</button>
                </div>
                <div className="space-y-2">
                  {form.line_items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                      <input value={item.description} onChange={e => updateLineItem(idx, 'description', e.target.value)}
                        placeholder="Description" className="col-span-5 bg-[#04080F] border border-white/10 rounded px-2 py-1.5 text-white text-xs focus:outline-none" />
                      <input type="number" value={item.quantity} onChange={e => updateLineItem(idx, 'quantity', parseFloat(e.target.value) || 0)}
                        placeholder="Qty" className="col-span-2 bg-[#04080F] border border-white/10 rounded px-2 py-1.5 text-white text-xs focus:outline-none" />
                      <input type="number" value={item.rate} onChange={e => updateLineItem(idx, 'rate', parseFloat(e.target.value) || 0)}
                        placeholder="Rate" className="col-span-2 bg-[#04080F] border border-white/10 rounded px-2 py-1.5 text-white text-xs focus:outline-none" />
                      <span className="col-span-2 text-gray-300 text-xs text-right">£{item.amount.toFixed(2)}</span>
                      <button onClick={() => removeLineItem(idx)} className="col-span-1 text-gray-500 hover:text-red-400">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-right">
                  <span className="text-gray-400 text-sm">Total: </span>
                  <span className="text-white font-bold text-lg">£{form.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-white/5">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-white/10 text-gray-300 rounded-lg hover:bg-white/5 transition-colors text-sm">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition-colors text-sm disabled:opacity-50">
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Invoice'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview Modal */}
      {showPDF && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">Invoice {showPDF.invoice_number}</h2>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-white rounded-lg text-sm transition-colors">
                  <Download className="w-4 h-4" /><span>Download PDF</span>
                </button>
                <button onClick={() => setShowPDF(null)} className="text-gray-400 hover:text-gray-600 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div ref={printRef} className="p-8 text-gray-800">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="text-3xl font-bold text-amber-600 mb-1">CrewDesk</div>
                  <div className="text-gray-500 text-sm">Film & TV Production Management</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">{showPDF.invoice_number}</div>
                  <div className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold ${
                    showPDF.status === 'paid' ? 'bg-green-100 text-green-800' :
                    showPDF.status === 'overdue' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>{showPDF.status.toUpperCase()}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="text-xs text-gray-400 uppercase font-medium mb-1">Bill To</div>
                  <div className="font-semibold text-gray-800">{showPDF.client_name}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Issue Date: {showPDF.issue_date ? new Date(showPDF.issue_date).toLocaleDateString('en-GB') : '—'}</div>
                  <div className="text-xs text-gray-400">Due Date: {showPDF.due_date ? new Date(showPDF.due_date).toLocaleDateString('en-GB') : '—'}</div>
                </div>
              </div>
              {showPDF.description && <p className="text-gray-600 text-sm mb-6">{showPDF.description}</p>}
              <table className="w-full border-collapse mb-6">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 text-xs text-gray-500 font-medium">Description</th>
                    <th className="text-right py-2 text-xs text-gray-500 font-medium">Qty</th>
                    <th className="text-right py-2 text-xs text-gray-500 font-medium">Rate</th>
                    <th className="text-right py-2 text-xs text-gray-500 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {showPDF.line_items?.length ? showPDF.line_items.map((item, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2 text-sm">{item.description}</td>
                      <td className="py-2 text-sm text-right">{item.quantity}</td>
                      <td className="py-2 text-sm text-right">£{Number(item.rate).toFixed(2)}</td>
                      <td className="py-2 text-sm text-right">£{Number(item.amount).toFixed(2)}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className="py-4 text-sm text-gray-400 text-center">No line items</td></tr>
                  )}
                </tbody>
              </table>
              <div className="flex justify-end">
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">Total Amount</div>
                  <div className="text-3xl font-bold text-gray-900">£{Number(showPDF.amount).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
