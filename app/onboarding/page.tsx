'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

const STEPS = ['Your Profile', 'Your Workspace', 'Invite Your Crew']

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState({ name: '', role: 'Director', company: '', phone: '' })
  const [workspace, setWorkspace] = useState({ name: '', currency: 'GBP', timezone: 'Europe/London', type: 'Production Company' })
  const [emails, setEmails] = useState([''])
  const [done, setDone] = useState(false)

  const next = () => { if (step < 2) setStep(s => s + 1); else setDone(true) }
  const back = () => setStep(s => s - 1)

  if (done) return (
    <div className="min-h-screen bg-[#04080F] flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md px-8">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="w-24 h-24 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🎬</span>
        </motion.div>
        <h1 className="text-3xl font-bold text-white mb-3">You&apos;re all set!</h1>
        <p className="text-gray-400 mb-8">Welcome to CrewDesk, {profile.name || 'Director'}. Your workspace is ready.</p>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => router.push('/dashboard')} className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-xl text-lg transition-colors">
          Go to Dashboard →
        </motion.button>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#04080F] flex items-center justify-center px-4">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">C</span>
            </div>
            <span className="text-white font-bold text-xl">CrewDesk</span>
          </div>
          <p className="text-gray-500 text-sm">Set up your workspace in 3 quick steps</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex items-center gap-2 flex-1">
                <motion.div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${i < step ? 'bg-amber-400 text-black' : i === step ? 'bg-amber-400 text-black' : 'bg-white/10 text-gray-500'}`}
                  animate={{ scale: i === step ? 1.1 : 1 }}>
                  {i < step ? '✓' : i + 1}
                </motion.div>
                <span className={`text-xs transition-colors ${i === step ? 'text-white font-medium' : 'text-gray-500'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`h-px flex-1 mx-2 transition-colors ${i < step ? 'bg-amber-400' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-[#0A1020] border border-white/[0.08] rounded-2xl p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-bold text-white mb-1">Tell us about yourself</h2>
                <p className="text-gray-400 text-sm mb-6">This helps personalise your CrewDesk experience.</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2"><label className="text-xs text-gray-400 mb-1.5 block">Your Name</label>
                      <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400/50 focus:outline-none placeholder-gray-600" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} placeholder="e.g. Ashtyn Cole" /></div>
                    <div><label className="text-xs text-gray-400 mb-1.5 block">Your Role</label>
                      <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400/50 focus:outline-none" value={profile.role} onChange={e => setProfile({...profile, role: e.target.value})}>
                        {['Director', 'Producer', 'Production Manager', 'DOP', 'Editor', 'Other'].map(r => <option key={r} value={r}>{r}</option>)}
                      </select></div>
                    <div><label className="text-xs text-gray-400 mb-1.5 block">Company / Studio</label>
                      <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400/50 focus:outline-none placeholder-gray-600" value={profile.company} onChange={e => setProfile({...profile, company: e.target.value})} placeholder="Optional" /></div>
                    <div className="col-span-2"><label className="text-xs text-gray-400 mb-1.5 block">Phone</label>
                      <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400/50 focus:outline-none placeholder-gray-600" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} placeholder="+44 7700 900000" /></div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-bold text-white mb-1">Set up your workspace</h2>
                <p className="text-gray-400 text-sm mb-6">Configure your workspace settings for your team.</p>
                <div className="space-y-4">
                  <div><label className="text-xs text-gray-400 mb-1.5 block">Workspace Name</label>
                    <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400/50 focus:outline-none placeholder-gray-600" value={workspace.name} onChange={e => setWorkspace({...workspace, name: e.target.value})} placeholder="e.g. Neon Films Studio" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs text-gray-400 mb-1.5 block">Currency</label>
                      <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400/50 focus:outline-none" value={workspace.currency} onChange={e => setWorkspace({...workspace, currency: e.target.value})}>
                        {['GBP (£)', 'USD ($)', 'EUR (€)', 'AUD (A$)'].map(c => <option key={c}>{c}</option>)}
                      </select></div>
                    <div><label className="text-xs text-gray-400 mb-1.5 block">Timezone</label>
                      <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400/50 focus:outline-none" value={workspace.timezone} onChange={e => setWorkspace({...workspace, timezone: e.target.value})}>
                        {['Europe/London', 'America/New_York', 'America/Los_Angeles', 'Australia/Sydney'].map(t => <option key={t}>{t}</option>)}
                      </select></div>
                  </div>
                  <div><label className="text-xs text-gray-400 mb-1.5 block">Business Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Production Company', 'Freelancer', 'Post House', 'Agency'].map(type => (
                        <button key={type} onClick={() => setWorkspace({...workspace, type})} className={`py-2.5 px-4 rounded-xl text-sm border transition-all ${workspace.type === type ? 'bg-amber-400/10 border-amber-400 text-amber-400' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}>{type}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-bold text-white mb-1">Invite your crew</h2>
                <p className="text-gray-400 text-sm mb-6">Add your team members — you can also do this later.</p>
                <div className="space-y-3">
                  {emails.map((email, i) => (
                    <div key={i} className="flex gap-2">
                      <input type="email" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400/50 focus:outline-none placeholder-gray-600" value={email} onChange={e => setEmails(emails.map((em, j) => j === i ? e.target.value : em))} placeholder={`crew${i + 1}@example.com`} />
                      {emails.length > 1 && <button onClick={() => setEmails(emails.filter((_, j) => j !== i))} className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">×</button>}
                    </div>
                  ))}
                  {emails.length < 5 && <button onClick={() => setEmails([...emails, ''])} className="text-amber-400 text-sm hover:text-amber-300 transition-colors">+ Add another</button>}
                </div>
                <div className="mt-4 bg-amber-400/5 border border-amber-400/20 rounded-xl p-4">
                  <p className="text-amber-400 text-xs font-medium mb-1">✨ Invite bonus</p>
                  <p className="text-gray-400 text-xs">Invite 3+ crew members and get 30 days of Pro free.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 mt-8">
            {step > 0 && <button onClick={back} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 text-sm font-medium hover:bg-white/5 transition-colors">← Back</button>}
            <motion.button onClick={next} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="flex-1 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm transition-colors">
              {step < 2 ? 'Continue →' : '🚀 Launch CrewDesk'}
            </motion.button>
          </div>
          {step === 2 && <button onClick={() => router.push('/dashboard')} className="w-full mt-3 text-gray-500 text-xs hover:text-gray-400 transition-colors">Skip for now</button>}
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">Already have an account? <a href="/login" className="text-amber-400 hover:text-amber-300">Sign in</a></p>
      </div>
    </div>
  )
}
