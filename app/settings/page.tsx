'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Building2, CreditCard, Bell, Lock, Check } from 'lucide-react'
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
                  <motion.div animate={{ x: on ? 20 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md" />
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
                  name: 'Ashtyn519', email: 'ashtyn@crewdesk.app', role: 'Production Manager',
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
                        const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }
                          
                            return (
                                  <div className="p-6 overflow-y-auto">
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                                                <h1 className="text-xl font-bold text-white">Settings</h1>h1>
                                                <p className="text-slate-400 text-sm">Manage your account and workspace preferences</p>p>
                                        </motion.div>motion.div>
                                  
                                        <div className="flex gap-6">
                                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-52 shrink-0">
                                                          <div className="rounded-2xl border border-white/5 p-2" style={{ background: '#0A1020' }}>
                                                            {TABS.map(t => (
                                                  <button key={t.id} onClick={() => setActiveTab(t.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 last:mb-0 ${activeTab === t.id ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                                                                  <t.Icon className="w-4 h-4" />
                                                    {t.label}
                                                    {activeTab === t.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />}
                                                  </button>button>
                                                ))}
                                                          </div>div>
                                                </motion.div>motion.div>
                                        
                                                <div className="flex-1">
                                                          <AnimatePresence mode="wait">
                                                            {activeTab === 'profile' && (
                                                  <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                                                  <SettingsSection title="Personal Information">
                                                                                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                                                                                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-2xl font-bold text-black">
                                                                                                          {profile.name.charAt(0).toUpperCase()}
                                                                                                          </div>div>
                                                                                                        <div>
                                                                                                                              <p className="text-sm font-semibold text-white">{profile.name}</p>p>
                                                                                                                              <p className="text-xs text-slate-500">{profile.role}</p>p>
                                                                                                                              <button className="text-xs text-amber-400 hover:text-amber-300 mt-1 transition-colors">Change avatar</button>button>
                                                                                                          </div>div>
                                                                                      </div>div>
                                                                                    <div className="grid grid-cols-2 gap-4">
                                                                                                        <div><label className="text-xs text-slate-400 mb-1 block">Full Name</label>label><input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500/50" /></div>div>
                                                                                                        <div><label className="text-xs text-slate-400 mb-1 block">Email</label>label><input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500/50" /></div>div>
                                                                                                        <div><label className="text-xs text-slate-400 mb-1 block">Role</label>label><input value={profile.role} onChange={e => setProfile(p => ({ ...p, role: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500/50" /></div>div>
                                                                                                        <div><label className="text-xs text-slate-400 mb-1 block">Phone</label>label><input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500/50" /></div>div>
                                                                                                        <div className="col-span-2"><label className="text-xs text-slate-400 mb-1 block">Bio</label>label><textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500/50 resize-none" /></div>div>
                                                                                      </div>div>
                                                                  </SettingsSection>SettingsSection>
                                                  </motion.div>motion.div>
                                                )}
                                                            {activeTab === 'workspace' && (
                                                  <motion.div key="workspace" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                                                  <SettingsSection title="Workspace Settings">
                                                                                    <div className="grid grid-cols-2 gap-4">
                                                                                                        <div><label className="text-xs text-slate-400 mb-1 block">Workspace Name</label>label><input value={workspace.name} onChange={e => setWorkspace(p => ({ ...p, name: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500/50" /></div>div>
                                                                                                        <div><label className="text-xs text-slate-400 mb-1 block">Currency</label>label><select value={workspace.currency} onChange={e => setWorkspace(p => ({ ...p, currency: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500/50"><option value="GBP">GBP</option>option><option value="USD">USD</option>option><option value="EUR">EUR</option>option></select>select></div>div>
                                                                                                        <div><label className="text-xs text-slate-400 mb-1 block">Timezone</label>label><select value={workspace.timezone} onChange={e => setWorkspace(p => ({ ...p, timezone: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500/50"><option value="Europe/London">Europe/London</option>option><option value="America/New_York">America/New_York</option>option></select>select></div>div>
                                                                                                        <div><label className="text-xs text-slate-400 mb-1 block">Date Format</label>label><select value={workspace.dateFormat} onChange={e => setWorkspace(p => ({ ...p, dateFormat: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500/50"><option value="DD/MM/YYYY">DD/MM/YYYY</option>option><option value="MM/DD/YYYY">MM/DD/YYYY</option>option></select>select></div>div>
                                                                                      </div>div>
                                                                  </SettingsSection>SettingsSection>
                                                                  <SettingsSection title="Danger Zone">
                                                                                    <SettingsRow label="Delete Workspace" desc="Permanently delete your workspace and all data">
                                                                                                        <button className="text-xs px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all font-medium">Delete</button>button>
                                                                                      </SettingsRow>SettingsRow>
                                                                  </SettingsSection>SettingsSection>
                                                  </motion.div>motion.div>
                                                )}
                                                            {activeTab === 'billing' && (
                                                  <motion.div key="billing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                                                  <SettingsSection title="Current Plan">
                                                                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 mb-4">
                                                                                                        <div><p className="text-sm font-bold text-white">Free Plan</p>p><p className="text-xs text-slate-500 mt-0.5">2 seats · 5 active projects</p>p></div>div>
                                                                                                        <span className="text-xs px-3 py-1 rounded-full bg-slate-500/20 text-slate-400 font-medium">Current</span>span>
                                                                                      </div>div>
                                                                                    <div className="grid grid-cols-2 gap-3">
                                                                                                        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 transition-all cursor-pointer">
                                                                                                                              <div className="flex items-center justify-between mb-2"><p className="text-sm font-bold text-white">Pro</p>p><span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">Popular</span>span></div>div>
                                                                                                                              <p className="text-xl font-bold text-amber-400">£29<span className="text-xs text-slate-500">/mo</span>span></p>p>
                                                                                                                              <p className="text-xs text-slate-500 mt-1">Unlimited seats · projects · storage</p>p>
                                                                                                                              <button className="w-full mt-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold py-2 rounded-xl text-xs">Upgrade to Pro</button>button>
                                                                                                          </div>div>
                                                                                                        <div className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.08] transition-all cursor-pointer">
                                                                                                                              <p className="text-sm font-bold text-white mb-2">Enterprise</p>p>
                                                                                                                              <p className="text-xl font-bold text-white">Custom</p>p>
                                                                                                                              <p className="text-xs text-slate-500 mt-1">White-label · SSO · dedicated support</p>p>
                                                                                                                              <button className="w-full mt-3 bg-white/10 hover:bg-white/15 text-white font-semibold py-2 rounded-xl text-xs">Contact Sales</button>button>
                                                                                                          </div>div>
                                                                                      </div>div>
                                                                  </SettingsSection>SettingsSection>
                                                                  <SettingsSection title="Billing History">
                                                                                    <div className="text-center py-8"><p className="text-sm text-slate-500">No billing history on Free plan</p>p></div>div>
                                                                  </SettingsSection>SettingsSection>
                                                  </motion.div>motion.div>
                                                )}
                                                            {activeTab === 'notifications' && (
                                                  <motion.div key="notifications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                                                  <SettingsSection title="Email Notifications">
                                                                                    <SettingsRow label="New Messages" desc="Get notified when crew sends you a message"><Toggle on={notifs.newMessage} onChange={v => setNotifs(p => ({ ...p, newMessage: v }))} /></SettingsRow>SettingsRow>
                                                                                    <SettingsRow label="Invoice Paid" desc="Receive alerts when an invoice is marked paid"><Toggle on={notifs.invoicePaid} onChange={v => setNotifs(p => ({ ...p, invoicePaid: v }))} /></SettingsRow>SettingsRow>
                                                                                    <SettingsRow label="Contract Signed" desc="Alert when a contract is signed"><Toggle on={notifs.contractSigned} onChange={v => setNotifs(p => ({ ...p, contractSigned: v }))} /></SettingsRow>SettingsRow>
                                                                                    <SettingsRow label="Crew Activity" desc="When crew members join or accept invitations"><Toggle on={notifs.crewAdded} onChange={v => setNotifs(p => ({ ...p, crewAdded: v }))} /></SettingsRow>SettingsRow>
                                                                  </SettingsSection>SettingsSection>
                                                                  <SettingsSection title="Reports">
                                                                                    <SettingsRow label="Weekly Summary" desc="A weekly digest of your workspace activity"><Toggle on={notifs.weeklyReport} onChange={v => setNotifs(p => ({ ...p, weeklyReport: v }))} /></SettingsRow>SettingsRow>
                                                                                    <SettingsRow label="Marketing Updates" desc="News and product updates from CrewDesk"><Toggle on={notifs.marketing} onChange={v => setNotifs(p => ({ ...p, marketing: v }))} /></SettingsRow>SettingsRow>
                                                                  </SettingsSection>SettingsSection>
                                                  </motion.div>motion.div>
                                                )}
                                                            {activeTab === 'security' && (
                                                  <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                                                  <SettingsSection title="Password">
                                                                                    <div className="space-y-3">
                                                                                                        <div><label className="text-xs text-slate-400 mb-1 block">Current Password</label>label><input type="password" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500/50" /></div>div>
                                                                                                        <div><label className="text-xs text-slate-400 mb-1 block">New Password</label>label><input type="password" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500/50" /></div>div>
                                                                                                        <div><label className="text-xs text-slate-400 mb-1 block">Confirm New Password</label>label><input type="password" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500/50" /></div>div>
                                                                                                        <button className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-6 py-2.5 rounded-xl text-sm">Update Password</button>button>
                                                                                      </div>div>
                                                                  </SettingsSection>SettingsSection>
                                                                  <SettingsSection title="Two-Factor Authentication">
                                                                                    <SettingsRow label="Authenticator App" desc="Use an authenticator app for extra security">
                                                                                                        <button className="text-xs px-4 py-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 font-medium">Enable</button>button>
                                                                                      </SettingsRow>SettingsRow>
                                                                  </SettingsSection>SettingsSection>
                                                                  <SettingsSection title="Active Sessions">
                                                                                    <div className="space-y-3">
                                                                                      {[
                                                    { device: 'Chrome on macOS', location: 'London, UK', current: true, time: 'Now' },
                                                    { device: 'Safari on iPhone', location: 'London, UK', current: false, time: '2 days ago' },
                                                                        ].map((s, i) => (
                                                                                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                                                                                                        <div><p className="text-sm font-medium text-white">{s.device}</p>p><p className="text-xs text-slate-500">{s.location} · {s.time}</p>p></div>div>
                                                                                                  {s.current ? <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">Current</span>span> : <button className="text-xs text-rose-400 hover:text-rose-300">Revoke</button>button>}
                                                                                                  </div>div>
                                                                                              ))}
                                                                                      </div>div>
                                                                  </SettingsSection>SettingsSection>
                                                  </motion.div>motion.div>
                                                )}
                                                          </AnimatePresence>AnimatePresence>
                                                          <div className="flex items-center gap-3 mt-2">
                                                                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={save} className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-6 py-2.5 rounded-xl text-sm">
                                                                                    Save Changes
                                                                      </motion.button>motion.button>
                                                                      <AnimatePresence>
                                                                        {saved && (
                                                    <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-sm text-emerald-400 font-medium flex items-center gap-1">
                                                                      <Check className="w-4 h-4" /> Changes saved
                                                    </motion.span>motion.span>
                                                  )}
                                                                      </AnimatePresence>AnimatePresence>
                                                          </div>div>
                                                </div>div>
                                        </div>div>
                                  </div>div>
                                )
                              }</h3>
