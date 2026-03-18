'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Plus, Upload, CheckSquare, FileText, Trash2, Search } from 'lucide-react'

type Contract = {
  id: string; title: string; client_name: string; client_email: string;
  status: string; value: number; file_url: string; signed_at: string;
  expires_at: string; created_at: string;
}
const EMPTY = { title: '', client_name: '', client_email: '', status: 'draft', value: 0, file_url: '', expires_at: '' }
const STATUS_COLORS: Record<string,string> = { draft:'bg-slate-700 text-slate-400', sent:'bg-amber-400/10 text-amber-400', signed:'bg-emerald-400/10 text-emerald-400', expired:'bg-red-400/10 text-red-400' }

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<any>(EMPTY)
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.from('contracts').select('*').eq('user_id', user?.id).order('created_at', { ascending: false })
    setContracts(data || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const path = `contracts/${user?.id}/${Date.now()}-${file.name}`
    const { data } = await supabase.storage.from('contracts').upload(path, file)
    if (data) {
      const { data: { publicUrl } } = supabase.storage.from('contracts').getPublicUrl(path)
      setForm((f: any) => ({ ...f, file_url: publicUrl }))
    }
    setUploading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('contracts').insert({ ...form, user_id: user?.id })
    await load()
    setShowModal(false)
    setForm(EMPTY)
    setSaving(false)
  }

  const markSigned = async (id: string) => {
    await supabase.from('contracts').update({ status: 'signed', signed_at: new Date().toISOString() }).eq('id', id)
    setContracts(prev => prev.map(c => c.id === id ? { ...c, status: 'signed', signed_at: new Date().toISOString() } : c))
  }

  const deleteContract = async (id: string) => {
    if (!confirm('Delete contract?')) return
    await supabase.from('contracts').delete().eq('id', id)
    setContracts(prev => prev.filter(c => c.id !== id))
  }

  const filtered = contracts.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.client_name?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-white">Contracts</h1>
          <p className="text-slate-400 mt-1">{contracts.length} contract{contracts.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setShowModal(true) }}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-bold px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={18} /> New Contract
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {(['draft','sent','signed','expired'] as string[]).map(status => (
          <div key={status} className="bg-[#0F1A2E] rounded-2xl p-4 border border-slate-800">
            <div className="text-2xl font-bold text-white">{contracts.filter(c => c.status === status).length}</div>
            <div className={`text-sm mt-1 capitalize ${STATUS_COLORS[status]?.split(' ')[1] || 'text-slate-400'}`}>{status}</div>
          </div>
        ))}
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-4 top-3.5 text-slate-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contracts..."
          className="w-full bg-[#0F1A2E] border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
      </div>

      {loading ? <div className="text-slate-400">Loading...</div> : (
        <div className="space-y-3">
          {filtered.map(c => (
            <div key={c.id} className="bg-[#0F1A2E] rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <FileText size={16} className="text-slate-500" />
                    <span className="text-white font-bold">{c.title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[c.status] || 'bg-slate-700 text-slate-400'}`}>{c.status}</span>
                  </div>
                  <div className="text-slate-400 text-sm">{c.client_name} · {formatCurrency(c.value)} {c.signed_at && `· Signed ${formatDate(c.signed_at)}`}</div>
                </div>
                <div className="flex gap-2">
                  {c.status !== 'signed' && (
                    <button onClick={() => markSigned(c.id)} title="Mark signed"
                      className="w-8 h-8 bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-400 rounded-lg flex items-center justify-center transition-colors">
                      <CheckSquare size={14} />
                    </button>
                  )}
                  {c.file_url && (
                    <a href={c.file_url} target="_blank" rel="noopener noreferrer"
                      className="w-8 h-8 bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 rounded-lg flex items-center justify-center transition-colors">
                      <Upload size={14} />
                    </a>
                  )}
                  <button onClick={() => deleteContract(c.id)}
                    className="w-8 h-8 bg-red-400/10 hover:bg-red-400/20 text-red-400 rounded-lg flex items-center justify-center transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <FileText size={48} className="text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No contracts yet</p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0F1A2E] rounded-2xl p-6 w-full max-w-md border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-5">New Contract</h2>
            <div className="space-y-4">
              {[['title','Contract Title',true],['client_name','Client Name',false],['client_email','Client Email',false]].map(([k,label,required]) => (
                <div key={k as string}>
                  <label className="text-slate-300 text-sm block mb-1.5">{label as string}</label>
                  <input type="text" value={form[k as string]} onChange={e => setForm((f: any) => ({...f, [k as string]: e.target.value}))} required={required as boolean}
                    className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400/50" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 text-sm block mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setForm((f: any) => ({...f, status: e.target.value}))}
                    className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none">
                    {['draft','sent','signed','expired'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 text-sm block mb-1.5">Value (£)</label>
                  <input type="number" value={form.value} onChange={e => setForm((f: any) => ({...f, value: parseFloat(e.target.value)||0}))}
                    className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400/50" />
                </div>
              </div>
              <div>
                <label className="text-slate-300 text-sm block mb-1.5">Expiry Date</label>
                <input type="date" value={form.expires_at} onChange={e => setForm((f: any) => ({...f, expires_at: e.target.value}))}
                  className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400/50" />
              </div>
              <div>
                <label className="text-slate-300 text-sm block mb-1.5">Upload Contract File</label>
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
                <button onClick={() => fileRef.current?.click()}
                  className="w-full border border-dashed border-slate-600 hover:border-amber-400/50 rounded-xl p-4 text-slate-400 hover:text-amber-400 transition-colors flex items-center justify-center gap-2">
                  <Upload size={16} />
                  {uploading ? 'Uploading...' : form.file_url ? 'File uploaded ✓' : 'Click to upload (PDF, DOC)'}
                </button>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.title} className="flex-1 bg-amber-400 hover:bg-amber-300 text-black font-bold py-2.5 rounded-xl transition-colors disabled:opacity-50">
                {saving ? 'Creating...' : 'Create Contract'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
