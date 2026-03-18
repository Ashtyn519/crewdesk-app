'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Building2, CreditCard, Bell, Shield, Save, CheckCircle, ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [workspace, setWorkspace] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  const [profileForm, setProfileForm] = useState({
    full_name: '',
    email: '',
  })

  const [workspaceForm, setWorkspaceForm] = useState({
    name: '',
    production_type: '',
  })

  const [notifyForm, setNotifyForm] = useState({
    invoice_due: true,
    project_updates: true,
    crew_messages: false,
    weekly_digest: true,
  })

  useEffect(() => {
    const load = async () => {
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) return
      setUser(u)
      setProfileForm({
        full_name: u.user_metadata?.full_name || '',
        email: u.email || '',
      })
      const { data: ws } = await supabase
        .from('workspaces')
        .select('*')
        .eq('user_id', u.id)
        .single()
      if (ws) {
        setWorkspace(ws)
        setWorkspaceForm({
          name: ws.name || '',
          production_type: ws.production_type || '',
        })
      }
    }
    load()
  }, [])

  const saveProfile = async () => {
    setSaving(true)
    await supabase.auth.updateUser({
      data: { full_name: profileForm.full_name }
    })
    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const saveWorkspace = async () => {
    setSaving(true)
    if (workspace) {
      await supabase.from('workspaces').update({
        name: workspaceForm.name,
        production_type: workspaceForm.production_type,
        updated_at: new Date().toISOString(),
      }).eq('id', workspace.id)
    } else if (user) {
      await supabase.from('workspaces').insert({
        name: workspaceForm.name,
        production_type: workspaceForm.production_type,
        user_id: user.id,
      })
    }
    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'workspace', label: 'Workspace', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  const productionTypes = [
    'Feature Film', 'TV Series', 'Commercial', 'Documentary',
    'Short Film', 'Music Video', 'Corporate Video', 'Other'
  ]

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your account and workspace preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Nav */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                    activeTab === tab.id
                      ? 'bg-amber-400/10 text-amber-400'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}>
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {saved && (
            <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-emerald-400/10 border border-emerald-400/20 rounded-xl text-emerald-400 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Changes saved successfully</span>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-[#0A1020] rounded-2xl border border-white/5 p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Profile Information</h2>
              
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400/30 to-amber-600/30 border border-amber-400/30 flex items-center justify-center">
                  <span className="text-amber-400 font-bold text-2xl">
                    {profileForm.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{profileForm.full_name || 'Your Name'}</p>
                  <p className="text-gray-400 text-sm">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Full Name</label>
                  <input value={profileForm.full_name} onChange={e => setProfileForm({...profileForm, full_name: e.target.value})}
                    className="w-full bg-[#04080F] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400/50 transition-colors" placeholder="Your full name" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Email Address</label>
                  <input value={profileForm.email} disabled
                    className="w-full bg-[#04080F] border border-white/10 rounded-lg px-3 py-2.5 text-gray-500 text-sm cursor-not-allowed" />
                  <p className="text-xs text-gray-600 mt-1">Email cannot be changed here. Contact support if needed.</p>
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={saveProfile} disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition-colors text-sm disabled:opacity-50">
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workspace' && (
            <div className="bg-[#0A1020] rounded-2xl border border-white/5 p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Workspace Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Workspace Name</label>
                  <input value={workspaceForm.name} onChange={e => setWorkspaceForm({...workspaceForm, name: e.target.value})}
                    className="w-full bg-[#04080F] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400/50" placeholder="My Production Company" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Production Type</label>
                  <select value={workspaceForm.production_type} onChange={e => setWorkspaceForm({...workspaceForm, production_type: e.target.value})}
                    className="w-full bg-[#04080F] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400/50">
                    <option value="">Select type</option>
                    {productionTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={saveWorkspace} disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition-colors text-sm disabled:opacity-50">
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Workspace'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-[#0A1020] rounded-2xl border border-white/5 p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { key: 'invoice_due', label: 'Invoice due date reminders', desc: 'Get notified when invoices are approaching due date' },
                  { key: 'project_updates', label: 'Project updates', desc: 'Notifications for project status changes' },
                  { key: 'crew_messages', label: 'Crew messages', desc: 'Alerts for new messages in threads' },
                  { key: 'weekly_digest', label: 'Weekly digest', desc: 'A weekly summary of your production activity' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-[#04080F] rounded-xl border border-white/5">
                    <div>
                      <p className="text-white text-sm font-medium">{label}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                    </div>
                    <button onClick={() => setNotifyForm(prev => ({...prev, [key]: !prev[key as keyof typeof prev]}))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${notifyForm[key as keyof typeof notifyForm] ? 'bg-amber-500' : 'bg-gray-700'}`}>
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${notifyForm[key as keyof typeof notifyForm] ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="bg-[#0A1020] rounded-2xl border border-white/5 p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Billing & Subscription</h2>
              <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-5 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-400 font-semibold">Pro Plan</p>
                    <p className="text-gray-400 text-sm mt-0.5">£29/month · Renews March 18, 2026</p>
                  </div>
                  <span className="px-3 py-1 bg-amber-400/20 text-amber-400 text-xs font-medium rounded-full">Active</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-[#04080F] rounded-xl border border-white/5 hover:border-white/10 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-white text-sm">Payment Method</p>
                      <p className="text-gray-500 text-xs">Visa ending in 4242</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex items-center justify-between p-4 bg-[#04080F] rounded-xl border border-white/5 hover:border-white/10 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-white text-sm">Billing History</p>
                      <p className="text-gray-500 text-xs">View past invoices</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>
              </div>
              <p className="text-gray-600 text-xs mt-4">To manage your subscription, please contact support.</p>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-[#0A1020] rounded-2xl border border-white/5 p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Security</h2>
              <div className="space-y-4">
                <div className="p-4 bg-[#04080F] rounded-xl border border-white/5">
                  <p className="text-white text-sm font-medium mb-1">Password</p>
                  <p className="text-gray-500 text-xs mb-3">Last changed: Never</p>
                  <button onClick={() => supabase.auth.resetPasswordForEmail(user?.email || '', { redirectTo: `${window.location.origin}/auth/callback` })}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-sm transition-colors">
                    Send Reset Email
                  </button>
                </div>
                <div className="p-4 bg-[#04080F] rounded-xl border border-white/5">
                  <p className="text-white text-sm font-medium mb-1">Two-Factor Authentication</p>
                  <p className="text-gray-500 text-xs mb-3">Add an extra layer of security to your account</p>
                  <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1.5 rounded-full">Coming soon</span>
                </div>
                <div className="p-4 bg-red-400/5 rounded-xl border border-red-400/10">
                  <p className="text-red-400 text-sm font-medium mb-1">Delete Account</p>
                  <p className="text-gray-500 text-xs mb-3">Permanently delete your account and all data</p>
                  <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm transition-colors border border-red-500/20">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
