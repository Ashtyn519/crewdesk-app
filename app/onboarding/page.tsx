'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Check, ArrowRight, ArrowLeft, Plus, X, Briefcase, User, Building2, Film } from 'lucide-react'

const STEPS = ['Your Profile', 'Your Workspace', 'Invite Your Crew']
const ROLES = ['Director', 'Producer', 'Production Manager', 'DOP', 'Editor', 'Sound Designer', 'VFX Artist', 'Colorist', 'Other']
const CURRENCIES = ['GBP', 'USD', 'EUR', 'AUD', 'CAD']
const TIMEZONES = ['Europe/London', 'Europe/Paris', 'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Australia/Sydney', 'Asia/Tokyo']
const BUSINESS_TYPES = [
  { id: 'Production Company', label: 'Production Company', icon: Film },
  { id: 'Freelancer', label: 'Freelancer', icon: User },
  { id: 'Post House', label: 'Post House', icon: Building2 },
  { id: 'Agency', label: 'Agency', icon: Briefcase },
  ]

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [profile, setProfile] = useState({ name: '', role: 'Director', company: '', phone: '' })
    const [workspace, setWorkspace] = useState({ name: '', currency: 'GBP', timezone: 'Europe/London', type: 'Production Company' })
    const [emails, setEmails] = useState([''])
    const [done, setDone] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = (s: number) => {
        const e: Record<string, string> = {}
              if (s === 0 && !profile.name.trim()) e.name = 'Please enter your name'
        if (s === 1 && !workspace.name.trim()) e.workspaceName = 'Please enter a workspace name'
        setErrors(e)
        return Object.keys(e).length === 0
  }

  const next = () => {
        if (!validateStep(step)) return
        if (step < 2) setStep(s => s + 1)
        else setDone(true)
  }

  const back = () => {
        setErrors({})
        setStep(s => s - 1)
  }

  const validEmailCount = emails.filter(e => e.trim() && e.includes('@')).length

  if (done) return (
        <div className="min-h-screen bg-[#04080F] flex items-center justify-center px-4">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
                      <motion.div
                                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                                  className="w-24 h-24 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center mx-auto mb-6"
                                >
                                <Check className="w-10 h-10 text-amber-400" strokeWidth={2.5} />
                      </motion.div>motion.div>
                      <h1 className="text-3xl font-bold text-white mb-3">You&apos;re all set!</h1>h1>
                      <p className="text-gray-400 mb-2">Welcome to CrewDesk, <span className="text-white font-medium">{profile.name || 'Director'}</span>span>.</p>p>
                      <p className="text-gray-500 text-sm mb-6">Your workspace <span className="text-amber-400">{workspace.name || 'CrewDesk'}</span>span> is ready. Your 14-day free trial has started.</p>p>
                      <div className="bg-[#0A1020] border border-amber-400/20 rounded-xl p-4 mb-8 text-left">
                          <p className="text-amber-400 text-xs font-semibold uppercase tracking-wide mb-1">Trial included</p>p>
                      <p className="text-gray-400 text-sm">14 days of full access. No credit card required until your trial ends.</p>p>
                      </div>div>
                      <motion.button
                                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                  onClick={() => router.push('/dashboard')}
                                  className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-xl text-base transition-colors flex items-center justify-center gap-2"
                                >
                                Go to Dashboard <ArrowRight className="w-4 h-4" />
                      </motion.button>motion.button>
              </motion.div>motion.div>
        </div>div>
      )
    
      return (
        <div className="min-h-screen bg-[#04080F] flex items-center justify-center px-4 py-12">
              <div className="fixed inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl" />
                      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
              </div>div>
              <div className="w-full max-w-lg relative">
                      <div className="text-center mb-8">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                            <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
                                                          <span className="text-black font-bold text-sm">C</span>span>
                                            </div>div>
                                            <span className="text-white font-bold text-xl">CrewDesk</span>span>
                                </div>div>
                                <p className="text-gray-500 text-sm">Set up your workspace in 3 quick steps</p>p>
                      </div>div>
              
                      <div className="flex items-center mb-8">
                        {STEPS.map((s, i) => (
                      <div key={i} className="flex items-center flex-1">
                                    <div className="flex items-center gap-2">
                                                    <motion.div
                                                                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${i < step ? 'bg-amber-400 text-black' : i === step ? 'bg-amber-400 text-black ring-4 ring-amber-400/20' : 'bg-white/10 text-gray-500'}`}
                                                                        animate={{ scale: i === step ? 1.1 : 1 }}
                                                                      >
                                                      {i < step ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : i + 1}
                                                    </motion.div>motion.div>
                                                    <span className={`text-xs whitespace-nowrap transition-colors ${i === step ? 'text-white font-medium' : i < step ? 'text-amber-400' : 'text-gray-600'}`}>{s}</span>span>
                                    </div>
                        {i < STEPS.length - 1 && <div className={`h-px flex-1 mx-3 transition-colors ${i < step ? 'bg-amber-400' : 'bg-white/10'}`} />}
                      </div>div>
                    ))}
                      </div>div>
              
                      <div className="bg-[#0A1020] border border-white/[0.08] rounded-2xl p-8 shadow-2xl">
                                <AnimatePresence mode="wait">
                                  {step === 0 && (
                        <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                        <h2 className="text-xl font-bold text-white mb-1">Tell us about yourself</h2>h2>
                                        <p className="text-gray-400 text-sm mb-6">This helps personalise your CrewDesk experience.</p>p>
                                        <div className="space-y-4">
                                                          <div>
                                                                              <label className="text-xs text-gray-400 mb-1.5 block">Your Name <span className="text-red-400">*</span>span></label>label>
                                                                              <input
                                                                                                      className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-sm focus:outline-none placeholder-gray-600 transition-colors ${errors.name ? 'border-red-500/50' : 'border-white/10 focus:border-amber-400/50'}`}
                                                                                                      value={profile.name}
                                                                                                      onChange={e => { setProfile({ ...profile, name: e.target.value }); setErrors({ ...errors, name: '' }) }}
                                                                                                      placeholder="e.g. Ashtyn Cole"
                                                                                                    />
                                                            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>p>}
                                                          </div>div>
                                                          <div className="grid grid-cols-2 gap-4">
                                                                              <div>
                                                                                                    <label className="text-xs text-gray-400 mb-1.5 block">Your Role</label>label>
                                                                                                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400/50 focus:outline-none" value={profile.role} onChange={e => setProfile({ ...profile, role: e.target.value })}>
                                                                                                      {ROLES.map(r => <option key={r} value={r} className="bg-[#0A1020]">{r}</option>option>)}
                                                                                                      </select>select>
                                                                              </div>div>
                                                                              <div>
                                                                                                    <label className="text-xs text-gray-400 mb-1.5 block">Company / Studio</label>label>
                                                                                                    <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400/50 focus:outline-none placeholder-gray-600" value={profile.company} onChange={e => setProfile({ ...profile, company: e.target.value })} placeholder="Optional" />
                                                                              </div>div>
                                                          </div>div>
                                                          <div>
                                                                              <label className="text-xs text-gray-400 mb-1.5 block">Phone</label>label>
                                                                              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400/50 focus:outline-none placeholder-gray-600" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="+44 7700 900000" />
                                                          </div>div>
                                        </div>div>
                        </motion.div>motion.div>
                      )}
                                
                                  {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                        <h2 className="text-xl font-bold text-white mb-1">Set up your workspace</h2>h2>
                                        <p className="text-gray-400 text-sm mb-6">Configure your workspace settings for your team.</p>p>
                                        <div className="space-y-4">
                                                          <div>
                                                                              <label className="text-xs text-gray-400 mb-1.5 block">Workspace Name <span className="text-red-400">*</span>span></label>label>
                                                                              <input
                                                                                                      className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-sm focus:outline-none placeholder-gray-600 transition-colors ${errors.workspaceName ? 'border-red-500/50' : 'border-white/10 focus:border-amber-400/50'}`}
                                                                                                      value={workspace.name}
                                                                                                      onChange={e => { setWorkspace({ ...workspace, name: e.target.value }); setErrors({ ...errors, workspaceName: '' }) }}
                                                                                                      placeholder="e.g. Neon Films Studio"
                                                                                                    />
                                                            {errors.workspaceName && <p className="text-red-400 text-xs mt-1">{errors.workspaceName}</p>p>}
                                                          </div>div>
                                                          <div className="grid grid-cols-2 gap-4">
                                                                              <div>
                                                                                                    <label className="text-xs text-gray-400 mb-1.5 block">Currency</label>label>
                                                                                                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400/50 focus:outline-none" value={workspace.currency} onChange={e => setWorkspace({ ...workspace, currency: e.target.value })}>
                                                                                                      {CURRENCIES.map(c => <option key={c} className="bg-[#0A1020]">{c}</option>option>)}
                                                                                                      </select>select>
                                                                              </div>div>
                                                                              <div>
                                                                                                    <label className="text-xs text-gray-400 mb-1.5 block">Timezone</label>label>
                                                                                                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400/50 focus:outline-none" value={workspace.timezone} onChange={e => setWorkspace({ ...workspace, timezone: e.target.value })}>
                                                                                                      {TIMEZONES.map(t => <option key={t} className="bg-[#0A1020]">{t}</option>option>)}
                                                                                                      </select>select>
                                                                              </div>div>
                                                          </div>div>
                                                          <div>
                                                                              <label className="text-xs text-gray-400 mb-1.5 block">Business Type</label>label>
                                                                              <div className="grid grid-cols-2 gap-2">
                                                                                {BUSINESS_TYPES.map(({ id, label, icon: Icon }) => (
                                                  <button key={id} onClick={() => setWorkspace({ ...workspace, type: id })}
                                                                              className={`py-3 px-4 rounded-xl text-sm border transition-all flex items-center gap-2 ${workspace.type === id ? 'bg-amber-400/10 border-amber-400 text-amber-400' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}>
                                                                            <Icon className="w-4 h-4" />{label}
                                                  </button>button>
                                                ))}
                                                                              </div>div>
                                                          </div>div>
                                        </div>div>
                        </motion.div>motion.div>
                      )}
                                
                                  {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                        <h2 className="text-xl font-bold text-white mb-1">Invite your crew</h2>h2>
                                        <p className="text-gray-400 text-sm mb-6">Add your team members — you can also do this later.</p>p>
                                        <div className="space-y-2.5">
                                          {emails.map((email, i) => (
                                              <div key={i} className="flex gap-2">
                                                                    <input type="email" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400/50 focus:outline-none placeholder-gray-600" value={email} onChange={e => setEmails(emails.map((em, j) => j === i ? e.target.value : em))} placeholder={`crew${i + 1}@example.com`} />
                                                {emails.length > 1 && <button onClick={() => setEmails(emails.filter((_, j) => j !== i))} className="p-3 rounded-xl bg-white/5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"><X className="w-4 h-4" /></button>button>}
                                              </div>div>
                                            ))}
                                          {emails.length < 8 && <button onClick={() => setEmails([...emails, ''])} className="flex items-center gap-1.5 text-amber-400 text-sm hover:text-amber-300 transition-colors mt-1"><Plus className="w-3.5 h-3.5" />Add another</button>button>}
                                        </div>div>
                                        <div className="mt-5 bg-amber-400/5 border border-amber-400/20 rounded-xl p-4">
                                                          <p className="text-amber-400 text-xs font-semibold mb-1">Invite bonus</p>p>
                                                          <p className="text-gray-400 text-xs">{validEmailCount >= 3 ? 'You have 3+ invites. Bonus applied automatically.' : 'Invite 3+ crew members and get 30 days of Pro access free.'}</p>p>
                                        </div>div>
                        </motion.div>motion.div>
                      )}
                                </AnimatePresence>AnimatePresence>
                      
                                <div className="flex gap-3 mt-8">
                                  {step > 0 && (
                        <button onClick={back} className="flex items-center justify-center gap-1.5 flex-1 py-3 rounded-xl border border-white/10 text-gray-400 text-sm font-medium hover:bg-white/5 transition-colors">
                                        <ArrowLeft className="w-4 h-4" />Back
                        </button>button>
                                            )}
                                            <motion.button onClick={next} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="flex-1 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm transition-colors flex items-center justify-center gap-2">
                                              {step < 2 ? <>Continue <ArrowRight className="w-4 h-4" /></>> : <>Launch CrewDesk <ArrowRight className="w-4 h-4" /></>>}
                                            </motion.button>motion.button>
                                </div>div>
                        {step === 2 && <button onClick={() => router.push('/dashboard')} className="w-full mt-3 text-gray-500 text-xs hover:text-gray-400 transition-colors">Skip for now</button>button>}
                      </div>div>
              
                      <p className="text-center text-gray-600 text-xs mt-6">Already have an account?{' '}<a href="/login" className="text-amber-400 hover:text-amber-300 transition-colors">Sign in</a>a></p>p>
              </div>div>
        </div>div>
          )
}</></></div>
