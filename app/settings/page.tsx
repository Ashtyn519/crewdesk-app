'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Building2, CreditCard, Bell, Lock, Check, ChevronRight, Mail, ExternalLink, AlertCircle } from 'lucide-react'
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
          <button
                  onClick={() => onChange(!on)}
                  className={`relative w-10 h-5 rounded-full transition-all duration-300 ${on ? 'bg-amber-500' : 'bg-white/10'}`}
                >
                <motion.div
                          animate={{ x: on ? 20 : 2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md"
                        />
          </button>button>
        )
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
          <div className="rounded-2xl border border-white/5 p-6 mb-4" style={{ background: '#0A1020' }}>
                <h3 className="text-sm font-semibold text-white mb-5">{title}</h3>h3>
            {children}
          </div>div>
        )
}

function SettingsRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
    return (
          <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div>
                        <p className="text-sm font-medium text-white">{label}</p>p>
                  {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>p>}
                </div>div>
                <div className="ml-4">{children}</div>div>
          </div>div>
        )
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile')
        const [saved, setSaved] = useState(false)
            const [profile, setProfile] = useState({
                  name: 'Ashtyn519',
                  email: 'ashtyn@crewdesk.app',
                  role: 'Production Manager',
                  bio: 'Freelance production manager based in London.',
                  phone: '+44 7700 900123'
            })
                const [notifs, setNotifs] = useState({
                      newMessage: true, invoicePaid: true, contractSigned: true,
                      crewAdded: false, weeklyReport: true, marketing: false
                })
                    const [workspace, setWorkspace] = useState({
                          name: 'My Workspace', currency: 'GBP', timezone: 'Europe/London', dateFormat: 'DD/MM/YYYY'
                    })
                        const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
                            const [pwError, setPwError] = useState('')
                                const [pwSuccess, setPwSuccess] = useState(false)
                                  
                                    const save = () => {
                                          setSaved(true)
                                                setTimeout(() => setSaved(false), 2500)
                                    }
                                      
                                        const changePassword = () => {
                                              setPwError('')
                                                    setPwSuccess(false)
                                                          if (!passwords.current) { setPwError('Please enter your current password.'); return }
                                              if (passwords.next.length < 8) { setPwError('New password must be at least 8 characters.'); return }
                                              if (passwords.next !== passwords.confirm) { setPwError('Passwords do not match.'); return }
                                              setPwSuccess(true)
                                                    setPasswords({ current: '', next: '', confirm: '' })
                                                          setTimeout(() => setPwSuccess(false), 3000)
                                        }
                                          
                                            return (
                                                  <div className="flex h-screen bg-[#04080F] overflow-hidden">
                                                        <Sidebar />
                                                        <div className="flex flex-col flex-1 min-w-0 ml-64 overflow-hidden">
                                                                <TopHeader />
                                                                <div className="flex-1 overflow-y-auto p-8">
                                                                          <div className="max-w-4xl mx-auto">
                                                                                      <div className="mb-8">
                                                                                                    <h1 className="text-2xl font-black text-white tracking-tight">Settings</h1>h1>
                                                                                                    <p className="text-slate-400 text-sm mt-1">Manage your account, workspace, and preferences</p>p>
                                                                                      </div>div>
                                                                          
                                                                            {/* Tab bar */}
                                                                                      <div className="flex gap-1 mb-8 bg-white/5 p-1 rounded-xl w-fit border border-white/5">
                                                                                        {TABS.map(tab => (
                                                                    <button
                                                                                        key={tab.id}
                                                                                        onClick={() => setActiveTab(tab.id)}
                                                                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                                                                              activeTab === tab.id
                                                                                                                ? 'bg-amber-400 text-black shadow-sm'
                                                                                                                : 'text-slate-400 hover:text-white'
                                                                                          }`}
                                                                                      >
                                                                                      <tab.Icon className="w-3.5 h-3.5" />
                                                                      {tab.label}
                                                                    </button>button>
                                                                  ))}
                                                                                      </div>div>
                                                                          
                                                                                      <AnimatePresence mode="wait">
                                                                                                    <motion.div
                                                                                                                      key={activeTab}
                                                                                                                      initial={{ opacity: 0, y: 8 }}
                                                                                                                      animate={{ opacity: 1, y: 0 }}
                                                                                                                      exit={{ opacity: 0, y: -8 }}
                                                                                                                      transition={{ duration: 0.15 }}
                                                                                                                    >
                                                                                                      {/* PROFILE */}
                                                                                                      {activeTab === 'profile' && (
                                                                                                                                        <div>
                                                                                                                                                            <SettingsSection title="Personal Information">
                                                                                                                                                                                  <div className="grid grid-cols-2 gap-4 mb-4">
                                                                                                                                                                                                          <div>
                                                                                                                                                                                                                                    <label className="text-xs text-slate-400 mb-1 block">Full Name</label>label>
                                                                                                                                                                                                                                    <input
                                                                                                                                                                                                                                                                  value={profile.name}
                                                                                                                                                                                                                                                                  onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                                                                                                                                                                                                                                                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400/50"
                                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                                  </div>div>
                                                                                                                                                                                                          <div>
                                                                                                                                                                                                                                    <label className="text-xs text-slate-400 mb-1 block">Email Address</label>label>
                                                                                                                                                                                                                                    <input
                                                                                                                                                                                                                                                                  value={profile.email}
                                                                                                                                                                                                                                                                  onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                                                                                                                                                                                                                                                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400/50"
                                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                                  </div>div>
                                                                                                                                                                                                          <div>
                                                                                                                                                                                                                                    <label className="text-xs text-slate-400 mb-1 block">Role</label>label>
                                                                                                                                                                                                                                    <input
                                                                                                                                                                                                                                                                  value={profile.role}
                                                                                                                                                                                                                                                                  onChange={e => setProfile(p => ({ ...p, role: e.target.value }))}
                                                                                                                                                                                                                                                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400/50"
                                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                                  </div>div>
                                                                                                                                                                                                          <div>
                                                                                                                                                                                                                                    <label className="text-xs text-slate-400 mb-1 block">Phone</label>label>
                                                                                                                                                                                                                                    <input
                                                                                                                                                                                                                                                                  value={profile.phone}
                                                                                                                                                                                                                                                                  onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                                                                                                                                                                                                                                                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400/50"
                                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                                  </div>div>
                                                                                                                                                                                                          <div className="col-span-2">
                                                                                                                                                                                                                                    <label className="text-xs text-slate-400 mb-1 block">Bio</label>label>
                                                                                                                                                                                                                                    <textarea
                                                                                                                                                                                                                                                                  value={profile.bio}
                                                                                                                                                                                                                                                                  onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                                                                                                                                                                                                                                                                  rows={3}
                                                                                                                                                                                                                                                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400/50 resize-none"
                                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                                  </div>div>
                                                                                                                                                                                                        </div>div>
                                                                                                                                                                                  <div className="flex items-center gap-3">
                                                                                                                                                                                                          <button
                                                                                                                                                                                                                                      onClick={save}
                                                                                                                                                                                                                                      className="px-5 py-2 bg-amber-400 text-black font-bold text-sm rounded-xl hover:bg-amber-300 transition-colors"
                                                                                                                                                                                                                                    >
                                                                                                                                                                                                                                    Save Changes
                                                                                                                                                                                                                                  </button>button>
                                                                                                                                                                                                          <AnimatePresence>
                                                                                                                                                                                                                                    {saved && (
                                                                                                                                                                      <motion.div
                                                                                                                                                                                                      initial={{ opacity: 0, x: -8 }}
                                                                                                                                                                                                      animate={{ opacity: 1, x: 0 }}
                                                                                                                                                                                                      exit={{ opacity: 0 }}
                                                                                                                                                                                                      className="flex items-center gap-1.5 text-emerald-400 text-sm"
                                                                                                                                                                                                    >
                                                                                                                                                                                                    <Check className="w-4 h-4" /> Saved
                                                                                                                                                                        </motion.div>motion.div>
                                                                                                                                                                    )}
                                                                                                                                                                                                                                  </AnimatePresence>AnimatePresence>
                                                                                                                                                                                                        </div>div>
                                                                                                                                                              </SettingsSection>SettingsSection>
                                                                                                                                          </div>div>
                                                                                                                    )}
                                                                                                    
                                                                                                      {/* WORKSPACE */}
                                                                                                      {activeTab === 'workspace' && (
                                                                                                                                        <div>
                                                                                                                                                            <SettingsSection title="Workspace Settings">
                                                                                                                                                                                  <div className="grid grid-cols-2 gap-4 mb-4">
                                                                                                                                                                                                          <div>
                                                                                                                                                                                                                                    <label className="text-xs text-slate-400 mb-1 block">Workspace Name</label>label>
                                                                                                                                                                                                                                    <input
                                                                                                                                                                                                                                                                  value={workspace.name}
                                                                                                                                                                                                                                                                  onChange={e => setWorkspace(w => ({ ...w, name: e.target.value }))}
                                                                                                                                                                                                                                                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400/50"
                                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                                  </div>div>
                                                                                                                                                                                                          <div>
                                                                                                                                                                                                                                    <label className="text-xs text-slate-400 mb-1 block">Currency</label>label>
                                                                                                                                                                                                                                    <select
                                                                                                                                                                                                                                                                  value={workspace.currency}
                                                                                                                                                                                                                                                                  onChange={e => setWorkspace(w => ({ ...w, currency: e.target.value }))}
                                                                                                                                                                                                                                                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400/50"
                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                {['GBP', 'USD', 'EUR', 'CAD', 'AUD'].map(c => <option key={c} value={c} className="bg-[#0A1020]">{c}</option>option>)}
                                                                                                                                                                                                                                                              </select>select>
                                                                                                                                                                                                                                  </div>div>
                                                                                                                                                                                                          <div>
                                                                                                                                                                                                                                    <label className="text-xs text-slate-400 mb-1 block">Timezone</label>label>
                                                                                                                                                                                                                                    <select
                                                                                                                                                                                                                                                                  value={workspace.timezone}
                                                                                                                                                                                                                                                                  onChange={e => setWorkspace(w => ({ ...w, timezone: e.target.value }))}
                                                                                                                                                                                                                                                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400/50"
                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                {['Europe/London', 'America/New_York', 'America/Los_Angeles', 'Europe/Paris', 'Asia/Tokyo'].map(tz => (
                                                                                                                                                                                                                                                                                                <option key={tz} value={tz} className="bg-[#0A1020]">{tz}</option>option>
                                                                                                                                                                                                                                                                                              ))}
                                                                                                                                                                                                                                                              </select>select>
                                                                                                                                                                                                                                  </div>div>
                                                                                                                                                                                                          <div>
                                                                                                                                                                                                                                    <label className="text-xs text-slate-400 mb-1 block">Date Format</label>label>
                                                                                                                                                                                                                                    <select
                                                                                                                                                                                                                                                                  value={workspace.dateFormat}
                                                                                                                                                                                                                                                                  onChange={e => setWorkspace(w => ({ ...w, dateFormat: e.target.value }))}
                                                                                                                                                                                                                                                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400/50"
                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                {['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'].map(f => <option key={f} value={f} className="bg-[#0A1020]">{f}</option>option>)}
                                                                                                                                                                                                                                                              </select>select>
                                                                                                                                                                                                                                  </div>div>
                                                                                                                                                                                                        </div>div>
                                                                                                                                                                                  <button onClick={save} className="px-5 py-2 bg-amber-400 text-black font-bold text-sm rounded-xl hover:bg-amber-300 transition-colors">
                                                                                                                                                                                                          Save Changes
                                                                                                                                                                                                        </button>button>
                                                                                                                                                              </SettingsSection>SettingsSection>
                                                                                                                                          </div>div>
                                                                                                                    )}
                                                                                                    
                                                                                                      {/* BILLING */}
                                                                                                      {activeTab === 'billing' && (
                                                                                                                                        <div>
                                                                                                                                                            <SettingsSection title="Current Plan">
                                                                                                                                                                                  <div className="flex items-start justify-between p-4 rounded-xl bg-amber-400/5 border border-amber-400/20 mb-4">
                                                                                                                                                                                                          <div>
                                                                                                                                                                                                                                    <p className="text-sm font-bold text-white mb-0.5">Growth Plan</p>p>
                                                                                                                                                                                                                                    <p className="text-xs text-slate-400">£99/month · Renews 25 April 2026</p>p>
                                                                                                                                                                                                                                    <div className="flex items-center gap-1.5 mt-2">
                                                                                                                                                                                                                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                                                                                                                                                                                                                                <span className="text-xs text-emerald-400 font-medium">Active</span>span>
                                                                                                                                                                                                                                                              </div>div>
                                                                                                                                                                                                                                  </div>div>
                                                                                                                                                                                                          <a
                                                                                                                                                                                                                                      href="mailto:info@crewdeskapp.com?subject=Upgrade Plan"
                                                                                                                                                                                                                                      className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 text-black font-bold text-xs rounded-xl hover:bg-amber-300 transition-colors"
                                                                                                                                                                                                                                    >
                                                                                                                                                                                                                                    Upgrade Plan
                                                                                                                                                                                                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                                                                                                                                                                                                  </a>a>
                                                                                                                                                                                                        </div>div>
                                                                                                                                                                                  <SettingsRow label="Invoices" desc="Download past invoices and receipts">
                                                                                                                                                                                                          <button className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1">
                                                                                                                                                                                                                                    View all <ExternalLink className="w-3 h-3" />
                                                                                                                                                                                                                                  </button>button>
                                                                                                                                                                                                        </SettingsRow>SettingsRow>
                                                                                                                                                                                  <SettingsRow label="Payment Method" desc="Visa ending in 4242">
                                                                                                                                                                                                          <button className="text-xs text-slate-400 hover:text-white font-medium">Update</button>button>
                                                                                                                                                                                                        </SettingsRow>SettingsRow>
                                                                                                                                                              </SettingsSection>SettingsSection>
                                                                                                                                                            <SettingsSection title="Need Help with Billing?">
                                                                                                                                                                                  <p className="text-sm text-slate-400 mb-4">For billing enquiries, plan changes, or to talk to our team, reach out directly.</p>p>
                                                                                                                                                                                  <a
                                                                                                                                                                                                            href="mailto:info@crewdeskapp.com"
                                                                                                                                                                                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors"
                                                                                                                                                                                                          >
                                                                                                                                                                                                          <Mail className="w-4 h-4 text-amber-400" />
                                                                                                                                                                                                          info@crewdeskapp.com
                                                                                                                                                                                                        </a>a>
                                                                                                                                                              </SettingsSection>SettingsSection>
                                                                                                                                          </div>div>
                                                                                                                    )}
                                                                                                    
                                                                                                      {/* NOTIFICATIONS */}
                                                                                                      {activeTab === 'notifications' && (
                                                                                                                                        <div>
                                                                                                                                                            <SettingsSection title="Email Notifications">
                                                                                                                                                                                  <SettingsRow label="New message" desc="When a crew member sends you a message">
                                                                                                                                                                                                          <Toggle on={notifs.newMessage} onChange={v => setNotifs(n => ({ ...n, newMessage: v }))} />
                                                                                                                                                                                                        </SettingsRow>SettingsRow>
                                                                                                                                                                                  <SettingsRow label="Invoice paid" desc="When a client pays an invoice">
                                                                                                                                                                                                          <Toggle on={notifs.invoicePaid} onChange={v => setNotifs(n => ({ ...n, invoicePaid: v }))} />
                                                                                                                                                                                                        </SettingsRow>SettingsRow>
                                                                                                                                                                                  <SettingsRow label="Contract signed" desc="When a contract is signed by all parties">
                                                                                                                                                                                                          <Toggle on={notifs.contractSigned} onChange={v => setNotifs(n => ({ ...n, contractSigned: v }))} />
                                                                                                                                                                                                        </SettingsRow>SettingsRow>
                                                                                                                                                                                  <SettingsRow label="Crew member added" desc="When someone joins your workspace">
                                                                                                                                                                                                          <Toggle on={notifs.crewAdded} onChange={v => setNotifs(n => ({ ...n, crewAdded: v }))} />
                                                                                                                                                                                                        </SettingsRow>SettingsRow>
                                                                                                                                                                                  <SettingsRow label="Weekly report" desc="Summary of activity every Monday morning">
                                                                                                                                                                                                          <Toggle on={notifs.weeklyReport} onChange={v => setNotifs(n => ({ ...n, weeklyReport: v }))} />
                                                                                                                                                                                                        </SettingsRow>SettingsRow>
                                                                                                                                                                                  <SettingsRow label="Product updates" desc="New features and announcements from CrewDesk">
                                                                                                                                                                                                          <Toggle on={notifs.marketing} onChange={v => setNotifs(n => ({ ...n, marketing: v }))} />
                                                                                                                                                                                                        </SettingsRow>SettingsRow>
                                                                                                                                                              </SettingsSection>SettingsSection>
                                                                                                                                          </div>div>
                                                                                                                    )}
                                                                                                    
                                                                                                      {/* SECURITY */}
                                                                                                      {activeTab === 'security' && (
                                                                                                                                        <div>
                                                                                                                                                            <SettingsSection title="Change Password">
                                                                                                                                                                                  <div className="space-y-3 mb-4">
                                                                                                                                                                                                          <div>
                                                                                                                                                                                                                                    <label className="text-xs text-slate-400 mb-1 block">Current Password</label>label>
                                                                                                                                                                                                                                    <input
                                                                                                                                                                                                                                                                  type="password"
                                                                                                                                                                                                                                                                  value={passwords.current}
                                                                                                                                                                                                                                                                  onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                                                                                                                                                                                                                                                                  placeholder="••••••••"
                                                                                                                                                                                                                                                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400/50"
                                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                                  </div>div>
                                                                                                                                                                                                          <div>
                                                                                                                                                                                                                                    <label className="text-xs text-slate-400 mb-1 block">New Password</label>label>
                                                                                                                                                                                                                                    <input
                                                                                                                                                                                                                                                                  type="password"
                                                                                                                                                                                                                                                                  value={passwords.next}
                                                                                                                                                                                                                                                                  onChange={e => setPasswords(p => ({ ...p, next: e.target.value }))}
                                                                                                                                                                                                                                                                  placeholder="••••••••"
                                                                                                                                                                                                                                                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400/50"
                                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                                  </div>div>
                                                                                                                                                                                                          <div>
                                                                                                                                                                                                                                    <label className="text-xs text-slate-400 mb-1 block">Confirm New Password</label>label>
                                                                                                                                                                                                                                    <input
                                                                                                                                                                                                                                                                  type="password"
                                                                                                                                                                                                                                                                  value={passwords.confirm}
                                                                                                                                                                                                                                                                  onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                                                                                                                                                                                                                                                                  placeholder="••••••••"
                                                                                                                                                                                                                                                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400/50"
                                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                                  </div>div>
                                                                                                                                                                                                        </div>div>
                                                                                                                                                                                  <AnimatePresence>
                                                                                                                                                                                                          {pwError && (
                                                                                                                                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                                                                                                                                                                  className="flex items-center gap-2 text-red-400 text-xs mb-3">
                                                                                                                                                                                                <AlertCircle className="w-3.5 h-3.5" />{pwError}
                                                                                                                                                                      </motion.div>motion.div>
                                                                                                                                                                  )}
                                                                                                                                                                                                          {pwSuccess && (
                                                                                                                                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                                                                                                                                                                  className="flex items-center gap-2 text-emerald-400 text-xs mb-3">
                                                                                                                                                                                                <Check className="w-3.5 h-3.5" />Password updated successfully
                                                                                                                                                                      </motion.div>motion.div>
                                                                                                                                                                  )}
                                                                                                                                                                                                        </AnimatePresence>AnimatePresence>
                                                                                                                                                                                  <button
                                                                                                                                                                                                            onClick={changePassword}
                                                                                                                                                                                                            className="px-5 py-2 bg-amber-400 text-black font-bold text-sm rounded-xl hover:bg-amber-300 transition-colors"
                                                                                                                                                                                                          >
                                                                                                                                                                                                          Update Password
                                                                                                                                                                                                        </button>button>
                                                                                                                                                              </SettingsSection>SettingsSection>
                                                                                                                                                            <SettingsSection title="Two-Factor Authentication">
                                                                                                                                                                                  <SettingsRow label="Authenticator app" desc="Use an authenticator app for additional security">
                                                                                                                                                                                                          <button className="text-xs text-amber-400 hover:text-amber-300 font-medium">Set up</button>button>
                                                                                                                                                                                                        </SettingsRow>SettingsRow>
                                                                                                                                                                                  <SettingsRow label="SMS verification" desc="Receive a code via text message">
                                                                                                                                                                                                          <button className="text-xs text-slate-400 hover:text-white font-medium">Enable</button>button>
                                                                                                                                                                                                        </SettingsRow>SettingsRow>
                                                                                                                                                              </SettingsSection>SettingsSection>
                                                                                                                                                            <SettingsSection title="Support">
                                                                                                                                                                                  <p className="text-sm text-slate-400 mb-4">For account security issues or to contact our team:</p>p>
                                                                                                                                                                                  <a
                                                                                                                                                                                                            href="mailto:info@crewdeskapp.com"
                                                                                                                                                                                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors"
                                                                                                                                                                                                          >
                                                                                                                                                                                                          <Mail className="w-4 h-4 text-amber-400" />
                                                                                                                                                                                                          info@crewdeskapp.com
                                                                                                                                                                                                        </a>a>
                                                                                                                                                              </SettingsSection>SettingsSection>
                                                                                                                                          </div>div>
                                                                                                                    )}
                                                                                                      </motion.div>motion.div>
                                                                                      </AnimatePresence>AnimatePresence>
                                                                          </div>div>
                                                                </div>div>
                                                        </div>div>
                                                  </div>div>
                                                )
                                              }</button>
