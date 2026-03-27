'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User, Building2, CreditCard, Bell, Lock, Check, ExternalLink, AlertCircle, LogOut } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'

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
        <p className="text-sm font-medium text-white">{label}</p>
        {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
      </div>
      <div className="ml-4">{children}</div>
    </div>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  async function handleSignOut() {
    const sb = createClient()
    await sb.auth.signOut()
    router.push('/login')
  }
  const [activeTab, setActiveTab] = useState('profile')
  const [saved, setSaved] = useState(false)
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

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#04080F' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden ml-64">
        <TopHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-xl font-bold text-white mb-6">Settings</h1>

            <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: '#0A1020' }}>
              {TABS.map(({ id, label, Icon }) => (
                <button key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${activeTab === id ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'}`}>
                  <Icon className="w-3.5 h-3.5" />{label}
                </button>
              ))}
            </div>

            <div>
              {activeTab === 'profile' && (
                <div>
                  <SettingsSection title="Personal Information">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">First Name</label>
                        <input type="text" defaultValue="Alex" className="w-full px-3 py-2 rounded-lg text-sm text-white border border-white/10 focus:border-amber-500 outline-none transition-colors" style={{ background: '#04080F' }} />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Last Name</label>
                        <input type="text" defaultValue="Morgan" className="w-full px-3 py-2 rounded-lg text-sm text-white border border-white/10 focus:border-amber-500 outline-none transition-colors" style={{ background: '#04080F' }} />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-xs text-slate-400 mb-1">Email Address</label>
                      <input type="email" defaultValue="alex@example.com" className="w-full px-3 py-2 rounded-lg text-sm text-white border border-white/10 focus:border-amber-500 outline-none transition-colors" style={{ background: '#04080F' }} />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
                      <input type="tel" defaultValue="+44 7700 900000" className="w-full px-3 py-2 rounded-lg text-sm text-white border border-white/10 focus:border-amber-500 outline-none transition-colors" style={{ background: '#04080F' }} />
                    </div>
                  </SettingsSection>
                  <SettingsSection title="Profile">
                    <div className="mb-4">
                      <label className="block text-xs text-slate-400 mb-1">Bio</label>
                      <textarea defaultValue="Creative director and brand strategist with 8 years of experience working with high-growth startups." rows={3} className="w-full px-3 py-2 rounded-lg text-sm text-white border border-white/10 focus:border-amber-500 outline-none transition-colors resize-none" style={{ background: '#04080F' }} />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Location</label>
                      <input type="text" defaultValue="London, UK" className="w-full px-3 py-2 rounded-lg text-sm text-white border border-white/10 focus:border-amber-500 outline-none transition-colors" style={{ background: '#04080F' }} />
                    </div>
                  </SettingsSection>
                </div>
              )}

              {activeTab === 'workspace' && (
                <div>
                  <SettingsSection title="Workspace Details">
                    <div className="mb-4">
                      <label className="block text-xs text-slate-400 mb-1">Workspace Name</label>
                      <input type="text" defaultValue="My Workspace" className="w-full px-3 py-2 rounded-lg text-sm text-white border border-white/10 focus:border-amber-500 outline-none transition-colors" style={{ background: '#04080F' }} />
                    </div>
                    <div className="mb-4">
                      <label className="block text-xs text-slate-400 mb-1">Industry</label>
                      <select className="w-full px-3 py-2 rounded-lg text-sm text-white border border-white/10 focus:border-amber-500 outline-none transition-colors" style={{ background: '#04080F' }}>
                        <option>Creative &amp; Design</option>
                        <option>Technology</option>
                        <option>Marketing &amp; Communications</option>
                        <option>Finance &amp; Consulting</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Company Size</label>
                      <select className="w-full px-3 py-2 rounded-lg text-sm text-white border border-white/10 focus:border-amber-500 outline-none transition-colors" style={{ background: '#04080F' }}>
                        <option>1-5 people</option>
                        <option>6-20 people</option>
                        <option>21-50 people</option>
                        <option>50+ people</option>
                      </select>
                    </div>
                  </SettingsSection>
                  <SettingsSection title="Preferences">
                    <SettingsRow label="Currency" desc="Used for invoices and payments">
                      <select className="px-3 py-1.5 rounded-lg text-sm text-white border border-white/10 outline-none" style={{ background: '#04080F' }}>
                        <option>GBP (£)</option>
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                      </select>
                    </SettingsRow>
                    <SettingsRow label="Date Format" desc="How dates appear across the app">
                      <select className="px-3 py-1.5 rounded-lg text-sm text-white border border-white/10 outline-none" style={{ background: '#04080F' }}>
                        <option>DD/MM/YYYY</option>
                        <option>MM/DD/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </SettingsRow>
                  </SettingsSection>
                </div>
              )}

              {activeTab === 'billing' && (
                <div>
                  <SettingsSection title="Current Plan">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-amber-500/30" style={{ background: '#04080F' }}>
                      <div>
                        <p className="text-sm font-semibold text-white">Growth Plan</p>
                        <p className="text-xs text-slate-400 mt-0.5">£99 / month &middot; Billed monthly</p>
                      </div>
                      <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full font-medium">Active</span>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {[
                        { label: 'Active Projects', value: '12' },
                        { label: 'Team Members', value: '8' },
                        { label: 'Storage Used', value: '4.2 GB' },
                      ].map(({ label, value }) => (
                        <div key={label} className="p-3 rounded-xl border border-white/5" style={{ background: '#0F1A2E' }}>
                          <p className="text-lg font-bold text-white">{value}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                        </div>
                      ))}
                    </div>
                  </SettingsSection>
                  <SettingsSection title="Payment Method">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/5" style={{ background: '#04080F' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-6 rounded bg-blue-600 flex items-center justify-center"><span className="text-xs font-bold text-white">VISA</span></div>
                        <div>
                          <p className="text-sm text-white">Visa ending 4242</p>
                          <p className="text-xs text-slate-500">Expires 12/26</p>
                        </div>
                      </div>
                      <button className="text-xs text-amber-400 hover:text-amber-300 transition-colors">Update</button>
                    </div>
                  </SettingsSection>
                  <SettingsSection title="Billing History">
                    {[
                      { date: 'Mar 1, 2026', amount: '£99.00', status: 'Paid' },
                      { date: 'Feb 1, 2026', amount: '£99.00', status: 'Paid' },
                      { date: 'Jan 1, 2026', amount: '£99.00', status: 'Paid' },
                    ].map((item) => (
                      <div key={item.date} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                        <div>
                          <p className="text-sm text-white">{item.date}</p>
                          <p className="text-xs text-slate-500">Growth Plan &mdash; Monthly</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-white">{item.amount}</span>
                          <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">{item.status}</span>
                          <button className="text-slate-500 hover:text-slate-300 transition-colors"><ExternalLink className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </SettingsSection>
                  <div className="text-center mt-4">
                    <p className="text-xs text-slate-500">Questions about billing?{' '}<a href="mailto:info@crewdeskapp.com" className="text-amber-400 hover:text-amber-300 transition-colors">Contact support</a></p>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <SettingsSection title="Email Notifications">
                    <SettingsRow label="Project Updates" desc="When a project status changes or a new file is added">
                      <Toggle on={notifs.projectUpdates} onChange={(v) => setNotifs({ ...notifs, projectUpdates: v })} />
                    </SettingsRow>
                    <SettingsRow label="New Messages" desc="When you receive a message in a project thread">
                      <Toggle on={notifs.newMessages} onChange={(v) => setNotifs({ ...notifs, newMessages: v })} />
                    </SettingsRow>
                    <SettingsRow label="Invoice Paid" desc="When a client pays an invoice">
                      <Toggle on={notifs.invoicePaid} onChange={(v) => setNotifs({ ...notifs, invoicePaid: v })} />
                    </SettingsRow>
                    <SettingsRow label="Weekly Digest" desc="A weekly summary of your workspace activity">
                      <Toggle on={notifs.weeklyDigest} onChange={(v) => setNotifs({ ...notifs, weeklyDigest: v })} />
                    </SettingsRow>
                    <SettingsRow label="Marketing Emails" desc="Product updates, tips, and offers from CrewDesk">
                      <Toggle on={notifs.marketingEmails} onChange={(v) => setNotifs({ ...notifs, marketingEmails: v })} />
                    </SettingsRow>
                  </SettingsSection>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <SettingsSection title="Authentication">
                    <SettingsRow label="Two-Factor Authentication" desc="Require a code each time you sign in">
                      <Toggle on={security.twoFactor} onChange={(v) => setSecurity({ ...security, twoFactor: v })} />
                    </SettingsRow>
                    <SettingsRow label="Session Alerts" desc="Get notified when a new device signs in">
                      <Toggle on={security.sessionAlerts} onChange={(v) => setSecurity({ ...security, sessionAlerts: v })} />
                    </SettingsRow>
                  </SettingsSection>
                  <SettingsSection title="Password">
                    <div className="mb-4">
                      <label className="block text-xs text-slate-400 mb-1">Current Password</label>
                      <input type="password" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" className="w-full px-3 py-2 rounded-lg text-sm text-white border border-white/10 focus:border-amber-500 outline-none transition-colors" style={{ background: '#04080F' }} />
                    </div>
                    <div className="mb-4">
                      <label className="block text-xs text-slate-400 mb-1">New Password</label>
                      <input type="password" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" className="w-full px-3 py-2 rounded-lg text-sm text-white border border-white/10 focus:border-amber-500 outline-none transition-colors" style={{ background: '#04080F' }} />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Confirm New Password</label>
                      <input type="password" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" className="w-full px-3 py-2 rounded-lg text-sm text-white border border-white/10 focus:border-amber-500 outline-none transition-colors" style={{ background: '#04080F' }} />
                    </div>
                  </SettingsSection>
                  <SettingsSection title="Danger Zone">
                    <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500/20" style={{ background: '#1a0808' }}>
                      <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">Delete Account</p>
                        <p className="text-xs text-slate-500 mt-0.5">Permanently delete your account and all associated data. This cannot be undone.</p>
                      </div>
                      <button className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 px-3 py-1.5 rounded-lg transition-colors shrink-0">Delete</button>
                    </div>
                  </SettingsSection>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-2">
              <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-all">
                {saved ? (<><Check className="w-4 h-4" />Saved</>) : 'Save Changes'}
              </button>
            </div>
          </div>
        
              {/* Sign Out */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/30 transition-all text-sm font-medium w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out of CrewDesk
                </button>
              </div>
        </main>
      </div>
    </div>
  )
                                         }
