'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Building, CreditCard, Bell, Globe, Save, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const dynamic = "force-dynamic";


const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'workspace', label: 'Workspace', icon: Building },
  { id: 'billing', label: 'Billing', icon: CreditCard },
]

export default function SettingsPage() {
  const [tab, setTab] = useState('profile')
  const [user, setUser] = useState<any>(null)
  const [workspace, setWorkspace] = useState<any>(null)
  const [profileForm, setProfileForm] = useState({ full_name: '', email: '' })
  const [workspaceForm, setWorkspaceForm] = useState({ company_name: '', currency: 'GBP', timezone: 'Europe/London' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setProfileForm({ full_name: user?.user_metadata?.full_name || '', email: user?.email || '' })
      const { data: ws } = await supabase.from('workspaces').select('*').eq('user_id', user?.id).single()
      if (ws) { setWorkspace(ws); setWorkspaceForm({ company_name: ws.company_name || '', currency: ws.currency || 'GBP', timezone: ws.timezone || 'Europe/London' }) }
    }
    load()
  }, [])

  const saveProfile = async () => {
    setSaving(true)
    await supabase.auth.updateUser({ data: { full_name: profileForm.full_name } })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const saveWorkspace = async () => {
    setSaving(true)
    if (workspace) {
      await supabase.from('workspaces').update(workspaceForm).eq('user_id', user?.id)
    } else {
      await supabase.from('workspaces').insert({ ...workspaceForm, user_id: user?.id, onboarding_completed: true })
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account and workspace</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${tab === id ? 'bg-amber-400/10 text-amber-400 font-semibold' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
                <Icon size={16} />{label}
              </button>
            ))}
            <button onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-900/10 transition-all mt-4">
              <LogOut size={16} />Sign Out
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {tab === 'profile' && (
            <div className="bg-[#0F1A2E] rounded-2xl p-6 border border-slate-800">
              <h2 className="text-lg font-bold text-white mb-5">Profile Settings</h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400/30 to-purple-400/30 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                  {profileForm.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                  <div className="text-white font-bold">{profileForm.full_name || 'Your Name'}</div>
                  <div className="text-slate-400 text-sm">{profileForm.email}</div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-slate-300 text-sm block mb-1.5">Full Name</label>
                  <input type="text" value={profileForm.full_name} onChange={e => setProfileForm(f => ({...f, full_name: e.target.value}))}
                    className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400/50" />
                </div>
                <div>
                  <label className="text-slate-300 text-sm block mb-1.5">Email</label>
                  <input type="email" value={profileForm.email} disabled
                    className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-2.5 text-slate-500 cursor-not-allowed" />
                  <p className="text-slate-600 text-xs mt-1">Email cannot be changed here</p>
                </div>
              </div>
              <button onClick={saveProfile} disabled={saving}
                className="mt-6 flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-bold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50">
                <Save size={16} />{saved ? 'Saved!' : saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          )}

          {tab === 'workspace' && (
            <div className="bg-[#0F1A2E] rounded-2xl p-6 border border-slate-800">
              <h2 className="text-lg font-bold text-white mb-5">Workspace Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-slate-300 text-sm block mb-1.5">Company / Production Name</label>
                  <input type="text" value={workspaceForm.company_name} onChange={e => setWorkspaceForm(f => ({...f, company_name: e.target.value}))}
                    className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 text-sm block mb-1.5 flex items-center gap-1"><Globe size={12} /> Currency</label>
                    <select value={workspaceForm.currency} onChange={e => setWorkspaceForm(f => ({...f, currency: e.target.value}))}
                      className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400/50">
                      <option value="GBP">£ GBP</option>
                      <option value="USD">$ USD</option>
                      <option value="EUR">€ EUR</option>
                      <option value="AUD">A$ AUD</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm block mb-1.5">Timezone</label>
                    <select value={workspaceForm.timezone} onChange={e => setWorkspaceForm(f => ({...f, timezone: e.target.value}))}
                      className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400/50">
                      <option value="Europe/London">London (GMT)</option>
                      <option value="America/New_York">New York (EST)</option>
                      <option value="America/Los_Angeles">Los Angeles (PST)</option>
                      <option value="Australia/Sydney">Sydney (AEST)</option>
                    </select>
                  </div>
                </div>
              </div>
              <button onClick={saveWorkspace} disabled={saving}
                className="mt-6 flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-bold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50">
                <Save size={16} />{saved ? 'Saved!' : saving ? 'Saving...' : 'Save Workspace'}
              </button>
            </div>
          )}

          {tab === 'billing' && (
            <div className="bg-[#0F1A2E] rounded-2xl p-6 border border-slate-800">
              <h2 className="text-lg font-bold text-white mb-5">Billing & Plan</h2>
              <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl p-5 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-amber-400 font-bold text-lg">Free Plan</div>
                    <div className="text-slate-400 text-sm">All core features included</div>
                  </div>
                  <div className="text-amber-400 text-2xl font-black">£0/mo</div>
                </div>
              </div>
              <div className="space-y-3">
                {[['✓ Unlimited projects',''],['✓ Crew management up to 10',''],['✓ 5 invoices per month',''],['✓ 2 contracts per month',''],['✗ Unlimited invoices & contracts','Pro'],['✗ Team collaboration','Pro'],['✗ Priority support','Pro']].map(([feature, badge]) => (
                  <div key={feature as string} className="flex items-center justify-between py-2 border-b border-slate-800/50">
                    <span className={`text-sm ${feature.startsWith('✓') ? 'text-slate-300' : 'text-slate-600'}`}>{feature as string}</span>
                    {badge && <span className="text-xs bg-purple-400/10 text-purple-400 px-2 py-0.5 rounded-full">{badge as string}</span>}
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-purple-900/20 border border-purple-500/30 rounded-xl">
                <div className="text-purple-400 font-bold mb-1">Upgrade to Pro — Coming Soon</div>
                <p className="text-slate-400 text-sm">Get unlimited invoices, contracts, team collaboration and priority support.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
