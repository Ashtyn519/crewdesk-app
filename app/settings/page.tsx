'use client'

import { useState } from 'react'
import clsx from 'clsx'
import {
  User, Bell, CreditCard, Shield, Building2, Check,
  Camera, Save, Loader2, ChevronRight, Zap, Crown,
  Mail, Phone, Globe, MapPin, Lock, Eye, EyeOff,
  Trash2, LogOut, AlertTriangle, ToggleLeft, ToggleRight,
  Palette, Moon, Sun, Monitor
} from 'lucide-react'

const TABS = [
  { id: 'profile',   label: 'Profile',   icon: User },
  { id: 'workspace', label: 'Workspace', icon: Building2 },
  { id: 'billing',   label: 'Billing',   icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security',  label: 'Security',  icon: Shield },
]

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle}
      className={clsx(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none',
        enabled ? 'bg-amber-500' : 'bg-white/10'
      )}>
      <span className={clsx(
        'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform',
        enabled ? 'translate-x-6' : 'translate-x-1'
      )} />
    </button>
  )
}

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0A1020] border border-white/[0.06] rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/[0.04]">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {description && <p className="text-xs text-white/40 mt-0.5">{description}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showPass, setShowPass] = useState(false)

  // Profile state
  const [profile, setProfile] = useState({
    firstName: 'Alex', lastName: 'Johnson', email: 'alex@crewdesk.io',
    phone: '+44 7700 900123', location: 'London, UK', website: 'alexjohnson.co',
    bio: 'Freelance Director of Photography with 10+ years experience in commercials and documentaries.',
    role: 'Director of Photography',
  })

  // Workspace state
  const [workspace, setWorkspace] = useState({
    name: 'Johnson Productions', slug: 'johnson-productions', industry: 'Film & TV Production',
    timezone: 'Europe/London', currency: 'GBP',
  })

  // Notification state
  const [notifs, setNotifs] = useState({
    email_invoices: true, email_contracts: true, email_crew: false,
    push_messages: true, push_projects: true, push_payments: true,
    weekly_digest: true, marketing: false,
  })

  async function handleSave() {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#04080F] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-white/40 mt-0.5">Manage your account, workspace, and preferences</p>
        </div>

        <div className="flex gap-6">
          {/* Tab Sidebar */}
          <div className="w-52 flex-shrink-0">
            <nav className="space-y-1 bg-[#0A1020] border border-white/[0.06] rounded-2xl p-2">
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                    activeTab === tab.id
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  )}>
                  <tab.icon className="w-4 h-4 flex-shrink-0" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex-1 space-y-4">

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <>
                <SectionCard title="Personal Information" description="Update your name, contact details, and bio">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl font-bold text-amber-400 relative">
                        AJ
                        <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                          <Camera className="w-3 h-3 text-black" />
                        </button>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{profile.firstName} {profile.lastName}</p>
                        <p className="text-xs text-white/40">{profile.role}</p>
                        <button className="text-xs text-amber-400 hover:text-amber-300 mt-1 transition-colors">Change photo</button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-white/50 mb-1.5">First Name</label>
                        <input value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))}
                          className="w-full px-4 py-2.5 bg-[#060C18] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/50 mb-1.5">Last Name</label>
                        <input value={profile.lastName} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))}
                          className="w-full px-4 py-2.5 bg-[#060C18] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5">Role / Job Title</label>
                      <input value={profile.role} onChange={e => setProfile(p => ({ ...p, role: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-[#060C18] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                          className="w-full pl-10 pr-4 py-2.5 bg-[#060C18] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-white/50 mb-1.5">Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                          <input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                            className="w-full pl-10 pr-4 py-2.5 bg-[#060C18] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/50 mb-1.5">Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                          <input value={profile.location} onChange={e => setProfile(p => ({ ...p, location: e.target.value }))}
                            className="w-full pl-10 pr-4 py-2.5 bg-[#060C18] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5">Bio</label>
                      <textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                        rows={3} className="w-full px-4 py-2.5 bg-[#060C18] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 resize-none transition-all" />
                    </div>
                  </div>
                </SectionCard>
              </>
            )}

            {/* WORKSPACE TAB */}
            {activeTab === 'workspace' && (
              <>
                <SectionCard title="Workspace Details" description="Customize your production workspace settings">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5">Workspace Name</label>
                      <input value={workspace.name} onChange={e => setWorkspace(w => ({ ...w, name: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-[#060C18] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5">Workspace URL</label>
                      <div className="flex items-center gap-0 bg-[#060C18] border border-white/10 rounded-xl overflow-hidden focus-within:border-amber-500/50 transition-all">
                        <span className="px-3 py-2.5 text-sm text-white/30 bg-white/5 border-r border-white/10">crewdesk.io/</span>
                        <input value={workspace.slug} onChange={e => setWorkspace(w => ({ ...w, slug: e.target.value }))}
                          className="flex-1 px-3 py-2.5 bg-transparent text-sm text-white focus:outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-white/50 mb-1.5">Industry</label>
                        <select value={workspace.industry} onChange={e => setWorkspace(w => ({ ...w, industry: e.target.value }))}
                          className="w-full px-4 py-2.5 bg-[#060C18] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all">
                          <option>Film &amp; TV Production</option>
                          <option>Commercial Production</option>
                          <option>Music Videos</option>
                          <option>Documentary</option>
                          <option>Events &amp; Weddings</option>
                          <option>Corporate Video</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/50 mb-1.5">Currency</label>
                        <select value={workspace.currency} onChange={e => setWorkspace(w => ({ ...w, currency: e.target.value }))}
                          className="w-full px-4 py-2.5 bg-[#060C18] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all">
                          <option value="GBP">GBP (£)</option>
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </SectionCard>
                <SectionCard title="Danger Zone" description="Irreversible actions — proceed with caution">
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium rounded-xl hover:bg-red-500/20 transition-all">
                    <Trash2 className="w-4 h-4" />Delete Workspace
                  </button>
                </SectionCard>
              </>
            )}

            {/* BILLING TAB */}
            {activeTab === 'billing' && (
              <>
                <SectionCard title="Current Plan" description="You're on the Pro plan">
                  <div className="flex items-center justify-between p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <Crown className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Pro Plan</p>
                        <p className="text-xs text-white/40">£29/month · Renews 18 Apr 2026</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 text-xs font-semibold rounded-full">Active</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      'Unlimited projects & contracts',
                      'Up to 50 crew members',
                      'PDF invoice generation',
                      'Priority support',
                    ].map(f => (
                      <div key={f} className="flex items-center gap-2 text-sm text-white/60">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                </SectionCard>
                <SectionCard title="Payment Method" description="Manage your billing information">
                  <div className="flex items-center justify-between p-4 bg-[#060C18] rounded-xl border border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center text-white text-xs font-bold">VISA</div>
                      <div>
                        <p className="text-sm text-white">•••• •••• •••• 4242</p>
                        <p className="text-xs text-white/40">Expires 12/27</p>
                      </div>
                    </div>
                    <button className="text-xs text-amber-400 hover:text-amber-300 transition-colors">Update</button>
                  </div>
                </SectionCard>
              </>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <>
                <SectionCard title="Email Notifications" description="Choose what to receive in your inbox">
                  <div className="space-y-4">
                    {[
                      { key: 'email_invoices', label: 'Invoice updates', desc: 'When invoices are paid or overdue' },
                      { key: 'email_contracts', label: 'Contract activity', desc: 'Signatures, expiries, and updates' },
                      { key: 'email_crew', label: 'Crew invitations', desc: 'When crew members accept or decline' },
                      { key: 'weekly_digest', label: 'Weekly digest', desc: 'A summary of your week every Monday' },
                      { key: 'marketing', label: 'Product updates', desc: 'New features and CrewDesk news' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm text-white/80">{item.label}</p>
                          <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
                        </div>
                        <Toggle
                          enabled={notifs[item.key as keyof typeof notifs] as boolean}
                          onToggle={() => setNotifs(n => ({ ...n, [item.key]: !n[item.key as keyof typeof notifs] }))}
                        />
                      </div>
                    ))}
                  </div>
                </SectionCard>
                <SectionCard title="Push Notifications" description="In-app and mobile notifications">
                  <div className="space-y-4">
                    {[
                      { key: 'push_messages', label: 'New messages', desc: 'When you receive a new direct message' },
                      { key: 'push_projects', label: 'Project updates', desc: 'Status changes and new assignments' },
                      { key: 'push_payments', label: 'Payment received', desc: 'When a payment is marked as received' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm text-white/80">{item.label}</p>
                          <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
                        </div>
                        <Toggle
                          enabled={notifs[item.key as keyof typeof notifs] as boolean}
                          onToggle={() => setNotifs(n => ({ ...n, [item.key]: !n[item.key as keyof typeof notifs] }))}
                        />
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <>
                <SectionCard title="Change Password" description="Update your account password">
                  <div className="space-y-4">
                    {[
                      { label: 'Current Password', placeholder: '••••••••' },
                      { label: 'New Password', placeholder: 'Min. 8 characters' },
                      { label: 'Confirm New Password', placeholder: 'Repeat new password' },
                    ].map(f => (
                      <div key={f.label}>
                        <label className="block text-xs font-medium text-white/50 mb-1.5">{f.label}</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                          <input type={showPass ? 'text' : 'password'} placeholder={f.placeholder}
                            className="w-full pl-10 pr-10 py-2.5 bg-[#060C18] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all" />
                          <button onClick={() => setShowPass(!showPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
                <SectionCard title="Two-Factor Authentication" description="Add an extra layer of security">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/80">Authenticator app</p>
                      <p className="text-xs text-white/40 mt-0.5">Use an app like Google Authenticator</p>
                    </div>
                    <button className="px-4 py-2 bg-[#060C18] border border-white/10 text-white/60 text-xs font-medium rounded-xl hover:text-white hover:border-white/20 transition-all">
                      Enable 2FA
                    </button>
                  </div>
                </SectionCard>
                <SectionCard title="Sessions" description="Manage active login sessions">
                  <div className="space-y-3">
                    {[
                      { device: 'Chrome on MacBook Pro', location: 'London, UK', time: 'Current session', current: true },
                      { device: 'Safari on iPhone 15', location: 'London, UK', time: '2 hours ago', current: false },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-[#060C18] rounded-xl border border-white/[0.06]">
                        <div>
                          <p className="text-sm text-white/80 font-medium">{s.device}</p>
                          <p className="text-xs text-white/40 mt-0.5">{s.location} · {s.time}</p>
                        </div>
                        {s.current ? (
                          <span className="px-2 py-0.5 bg-emerald-400/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-400/20">Active</span>
                        ) : (
                          <button className="text-xs text-red-400 hover:text-red-300 transition-colors">Revoke</button>
                        )}
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </>
            )}

            {/* Save Button */}
            {activeTab !== 'billing' && (
              <div className="flex items-center justify-end gap-3 pt-2">
                {saved && (
                  <div className="flex items-center gap-1.5 text-emerald-400 text-sm">
                    <Check className="w-4 h-4" />Changes saved
                  </div>
                )}
                <button onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
