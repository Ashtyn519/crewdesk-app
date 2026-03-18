'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, FileText, CheckCircle, Clock, AlertCircle, Trash2, Edit2, X, Upload, Eye } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Contract {
  id: string
  title: string
  client_name: string
  status: 'draft' | 'sent' | 'signed' | 'expired'
  start_date: string
  end_date: string
  value: number
  description: string
  file_url: string | null
}

const defaultForm = {
  title: '',
  client_name: '',
  status: 'draft' as Contract['status'],
  start_date: '',
  end_date: '',
  value: 0,
  description: '',
}

export default function ContractsPage() {
  const supabase = createClient()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Contract | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(defaultForm)

  const load = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('contracts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setContracts(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNew = () => {
    setEditing(null)
    setForm(defaultForm)
    setShowModal(true)
  }

  const openEdit = (c: Contract) => {
    setEditing(c)
    setForm({
      title: c.title,
      client_name: c.client_name || '',
      status: c.status as 'draft' | 'sent' | 'signed' | 'expired',
      start_date: c.start_date || '',
      end_date: c.end_date || '',
      value: c.value || 0,
      description: c.description || '',
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const payload = { ...form, user_id: user.id, updated_at: new Date().toISOString() }
    if (editing) {
      await supabase.from('contracts').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('contracts').insert(payload)
    }
    await load()
    setShowModal(false)
    setSaving(false)
  }

  const deleteContract = async (id: string) => {
    if (!confirm('Delete this contract?')) return
    await supabase.from('contracts').delete().eq('id', id)
    await load()
  }

  const updateStatus = async (id: string, status: Contract['status']) => {
    await supabase.from('contracts').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    await load()
  }

  const statusIcon = (status: string) => {
    if (status === 'signed') return <CheckCircle className="w-4 h-4 text-emerald-400" />
    if (status === 'expired') return <AlertCircle className="w-4 h-4 text-red-400" />
    if (status === 'sent') return <Clock className="w-4 h-4 text-amber-400" />
    return <FileText className="w-4 h-4 text-gray-400" />
  }

  const statusColor = (status: string) => {
    if (status === 'signed') return 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20'
    if (status === 'expired') return 'text-red-400 bg-red-400/10 border border-red-400/20'
    if (status === 'sent') return 'text-amber-400 bg-amber-400/10 border border-amber-400/20'
    return 'text-gray-400 bg-gray-400/10 border border-gray-400/20'
  }

  const totalValue = contracts.filter(c => c.status === 'signed').reduce((s, c) => s + (c.value || 0), 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Contracts</h1>
          <p className="text-gray-400 text-sm mt-1">{contracts.length} contract{contracts.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition-colors">
          <Plus className="w-4 h-4" /><span>New Contract</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {(['draft', 'sent', 'signed', 'expired'] as const).map(status => (
          <div key={status} className="bg-[#0A1020] rounded-xl p-4 border border-white/5">
            <p className="text-gray-400 text-xs mb-1 capitalize">{status}</p>
            <p className={`text-2xl font-bold ${statusColor(status).split(' ')[0]}`}>
              {contracts.filter(c => c.status === status).length}
            </p>
          </div>
        ))}
      </div>

      {totalValue > 0 && (
        <div className="bg-emerald-400/5 border border-emerald-400/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Signed Contract Value</p>
          <p className="text-2xl font-bold text-emerald-400">£{totalValue.toLocaleString()}</p>
        </div>
      )}

      {/* Contract Grid */}
      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading contracts...</div>
      ) : contracts.length === 0 ? (
        <div className="bg-[#0A1020] rounded-xl border border-white/5 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No contracts yet</p>
          <button onClick={openNew} className="mt-4 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors text-sm">
            Create your first contract
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contracts.map(contract => (
            <div key={contract.id} className="bg-[#0A1020] rounded-xl border border-white/5 p-5 hover:border-white/10 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">{contract.title}</h3>
                  <p className="text-gray-400 text-sm mt-0.5">{contract.client_name || 'No client'}</p>
                </div>
                <span className={`ml-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${statusColor(contract.status)}`}>
                  {statusIcon(contract.status)}
                  {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                </span>
              </div>

              {contract.description && (
                <p className="text-gray-500 text-xs mb-3 line-clamp-2">{contract.description}</p>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>
                  {contract.start_date && `${new Date(contract.start_date).toLocaleDateString('en-GB')} → `}
                  {contract.end_date ? new Date(contract.end_date).toLocaleDateString('en-GB') : 'No end date'}
                </span>
                {contract.value > 0 && (
                  <span className="text-amber-400 font-medium">£{contract.value.toLocaleString()}</span>
                )}
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                {contract.status === 'draft' && (
                  <button onClick={() => updateStatus(contract.id, 'sent')} className="flex-1 text-xs bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 py-1.5 rounded-lg transition-colors">
                    Mark Sent
                  </button>
                )}
                {contract.status === 'sent' && (
                  <button onClick={() => updateStatus(contract.id, 'signed')} className="flex-1 text-xs bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 py-1.5 rounded-lg transition-colors">
                    Mark Signed
                  </button>
                )}
                <button onClick={() => openEdit(contract)} className="p-1.5 text-gray-400 hover:text-amber-400 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => deleteContract(contract.id)} className="p-1.5 text-gray-400 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A1020] border border-white/10 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">{editing ? 'Edit Contract' : 'New Contract'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Contract Title *</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full bg-[#04080F] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50" placeholder="Project agreement..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Client Name</label>
                  <input value={form.client_name} onChange={e => setForm({...form, client_name: e.target.value})}
                    className="w-full bg-[#04080F] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50" placeholder="Client name" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value as any})}
                    className="w-full bg-[#04080F] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50">
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="signed">Signed</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Start Date</label>
                  <input type="date" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})}
                    className="w-full bg-[#04080F] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">End Date</label>
                  <input type="date" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})}
                    className="w-full bg-[#04080F] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Contract Value (£)</label>
                <input type="number" value={form.value} onChange={e => setForm({...form, value: parseFloat(e.target.value) || 0})}
                  className="w-full bg-[#04080F] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50" placeholder="0" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3}
                  className="w-full bg-[#04080F] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50 resize-none" placeholder="Contract details..." />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-white/5">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-white/10 text-gray-300 rounded-lg hover:bg-white/5 transition-colors text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.title} className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition-colors text-sm disabled:opacity-50">
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Contract'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
