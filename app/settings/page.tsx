'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User, Building2, CreditCard, Bell, Lock, LogOut, Loader2, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const TABS = [
  { id: 'profile', label: 'Profile', Icon: User },
  { id: 'workspace', label: 'Workspace', Icon: Building2 },
  { id: 'billing', label: 'Billing', Icon: CreditCard },
  { id: 'notifications', label: 'Notifications', Icon: Bell },
  { id: 'security', label: 'Security', Icon: Lock },
]

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className={`relative w-10 h-5 rounded-full transition-all duration-300 ${on ? 'bg-amber-500' : 'bg-white/10'}`}>
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${on ? 'left-5' : 'left-0.5'}`} />
    </button>
  )
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/5 p-6 mb-4" style={{ background: '#0A1020' }}>
      <h3 className="text-sm font-semibold text-white mb-5">{title}</h3>
      {children}
    </div>
  )
}

function SettingsRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div>
        <p className="text-sm text-white">{label}</p>
        {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  )
}

interface Workspace {
  id: string
  name: string
  plan: string
  trial_ends_at: string | null
  subscription_status: string | null
  stripe_customer_id: string | null
}

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState('profile')
  const [saved, setSaved] = useState(false)
  const [billingLoading, setBillingLoading] = useState(false)
  const [billingError, setBillingError] = useState('')
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [profileData, setProfileData] = useState({ full_name: '', email: '' })
  const [notifs, setNotifs] = useState({
    projectUpdates: true,
    newMessages: true,
    invoicePaid: true,
    weeklyDigest: false,
    marketingEmails: false,
  })
  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionAlerts: true,
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setProfileData({
      full_name: user.user_metadata?.full_name || '',
      email: user.email || '',
    })
    const { data: ws } = await supabase
      .from('workspaces')
      .select('id, name, plan, trial_ends_at, subscription_status, stripe_customer_id')
      .eq('user_id', user.id)
      .single()
    if (ws) setWorkspace(ws)
  }

  async function handleSignout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function openBillingPortal() {
    setBillingLoading(true)
    setBillingError('')
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setBillingError(data.error || 'Could not open billing portal. Please contact support.')
      }
    } catch {
      setBillingError('Network error. Please try again.')
    } finally {
      setBillingLoading(false)
    }
  }

  function getPlanLabel(plan: string) {
    const map: Record<string, string> = {
      trial: 'Free Trial',
      freelancer: 'Freelancer',
      business_starter: 'Business Starter',
      business_growth: 'Business Growth',
    }
    return map[plan] || plan.charAt(0).toUpperCase() + plan.slice(1)
  }

  function getTrialDaysLeft() {
    if (!workspace?.trial_ends_at) return null
    const diff = new Date(workspace.trial_ends_at).getTime() - Date.now()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#04080F' }}>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden ml-64">
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white">Settings</h1>
              <p className="text-slate-500 text-sm mt-1">Manage your account and workspace preferences</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 overflow-x-auto">
              {TABS.map(t => {
                const Icon = t.Icon
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === t.id ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {t.label}
                  </button>
                )
              })}
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <SettingsSection title="Personal Information">
                  <div className="mb-4">
                    <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileData.full_name}
                      onChange={e => setProfileData(p => ({ ...p, full_name: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg text-sm text-white border border-white/10 focus:border-amber-500 outline-none transition-colors"
                      style={{ background: '#04080F' }}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs text-slate-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full px-3 py-2 rounded-lg text-sm text-slate-500 border border-white/5 outline-none cursor-not-allowed"
                      style={{ background: '#04080F' }}
                    />
                    <p className="text-xs text-slate-600 mt-1">Email cannot be changed here. Contact support to update.</p>
                  </div>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 text-sm font-medium bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-lg transition-colors"
                  >
                    {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : 'Save changes'}
                  </button>
                </SettingsSection>

                <SettingsSection title="Account">
                  <SettingsRow label="Sign out" desc="Sign out of your CrewDesk account">
                    <button
                      onClick={handleSignout}
                      className="flex items-center gap-2 text-sm text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </SettingsRow>
                </SettingsSection>
              </div>
            )}

            {/* Workspace Tab */}
            {activeTab === 'workspace' && (
              <div>
                <SettingsSection title="Workspace Details">
                  <div className="mb-4">
                    <label className="block text-xs text-slate-400 mb-1">Workspace Name</label>
                    <input
                      type="text"
                      defaultValue={workspace?.name || ''}
                      className="w-full px-3 py-2 rounded-lg text-sm text-white border border-white/10 focus:border-amber-500 outline-none transition-colors"
                      style={{ background: '#04080F' }}
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 text-sm font-medium bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-lg transition-colors"
                  >
                    {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : 'Save changes'}
                  </button>
                </SettingsSection>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div>
                <SettingsSection title="Current Plan">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-amber-500/30 mb-4" style={{ background: '#04080F' }}>
                    <div>
                      <p className="text-sm font-semibold text-white">{workspace ? getPlanLabel(workspace.plan) : '—'}</p>
                      {workspace?.plan === 'trial' ? (
                        <p className="text-xs text-amber-400 mt-0.5">
                          {getTrialDaysLeft() !== null ? `${getTrialDaysLeft()} days remaining` : 'Trial active'}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400 mt-0.5 capitalize">{workspace?.subscription_status || 'Active'}</p>
                      )}
                    </div>
                    <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full font-medium">
                      {workspace?.plan === 'trial' ? 'Trial' : 'Paid'}
                    </span>
                  </div>

                  {workspace?.plan === 'trial' ? (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-400">Upgrade to a paid plan to keep full access after your trial ends.</p>
                      <Link
                        href="/pricing"
                        className="flex items-center gap-2 text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-black px-4 py-2.5 rounded-lg transition-colors w-fit"
                      >
                        View plans & upgrade →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-400">Manage your subscription, update payment methods, and download invoices through the billing portal.</p>
                      <button
                        onClick={openBillingPortal}
                        disabled={billingLoading}
                        className="flex items-center gap-2 text-sm font-semibold bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black px-4 py-2.5 rounded-lg transition-colors"
                      >
                        {billingLoading ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Opening portal...</>
                        ) : (
                          <><ExternalLink className="w-4 h-4" /> Manage billing</>
                        )}
                      </button>
                      {billingError && (
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <p className="text-xs text-rose-400">{billingError}</p>
                        </div>
                      )}
                    </div>
                  )}
                </SettingsSection>

                <SettingsSection title="Need help?">
                  <p className="text-xs text-slate-500">
                    Questions about billing?{' '}
                    <a href="mailto:info@crewdeskapp.com" className="text-amber-400 hover:text-amber-300 transition-colors">
                      Contact us at info@crewdeskapp.com
                    </a>
                  </p>
                </SettingsSection>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <SettingsSection title="Email Notifications">
                  <SettingsRow label="Project Updates" desc="When a project status changes or a new file is added">
                    <Toggle on={notifs.projectUpdates} onChange={v => setNotifs({ ...notifs, projectUpdates: v })} />
                  </SettingsRow>
                  <SettingsRow label="New Messages" desc="When you receive a message in a project thread">
                    <Toggle on={notifs.newMessages} onChange={v => setNotifs({ ...notifs, newMessages: v })} />
                  </SettingsRow>
                  <SettingsRow label="Invoice Paid" desc="When a client pays an invoice">
                    <Toggle on={notifs.invoicePaid} onChange={v => setNotifs({ ...notifs, invoicePaid: v })} />
                  </SettingsRow>
                  <SettingsRow label="Weekly Digest" desc="A weekly summary of your workspace activity">
                    <Toggle on={notifs.weeklyDigest} onChange={v => setNotifs({ ...notifs, weeklyDigest: v })} />
                  </SettingsRow>
                  <SettingsRow label="Marketing Emails" desc="Product updates, tips, and offers from CrewDesk">
                    <Toggle on={notifs.marketingEmails} onChange={v => setNotifs({ ...notifs, marketingEmails: v })} />
                  </SettingsRow>
                </SettingsSection>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <SettingsSection title="Security">
                  <SettingsRow label="Two-Factor Authentication" desc="Add an extra layer of security to your account">
                    <Toggle on={security.twoFactor} onChange={v => setSecurity({ ...security, twoFactor: v })} />
                  </SettingsRow>
                  <SettingsRow label="Session Alerts" desc="Get notified of new sign-ins to your account">
                    <Toggle on={security.sessionAlerts} onChange={v => setSecurity({ ...security, sessionAlerts: v })} />
                  </SettingsRow>
                </SettingsSection>
                <SettingsSection title="Password">
                  <p className="text-sm text-slate-400 mb-3">Change your password via the sign-in page.</p>
                  <a
                    href="/login"
                    className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Reset password →
                  </a>
                </SettingsSection>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  )
}
