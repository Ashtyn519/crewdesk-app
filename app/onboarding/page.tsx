'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import {
  Building2, Users, FileText, ChevronRight, ChevronLeft,
  Check, Camera, Film, Mic, Clapperboard, Sparkles,
  ArrowRight, Loader2, Star
} from 'lucide-react'

const STEPS = [
  { id: 1, title: 'Your Workspace', desc: 'Set up your production company' },
  { id: 2, title: 'Your Role', desc: 'Tell us what you do' },
  { id: 3, title: "You're all set!", desc: 'Ready to go live' },
]

const ROLES = [
  { id: 'dop', label: 'Director of Photography', icon: Camera },
  { id: 'director', label: 'Director', icon: Clapperboard },
  { id: 'producer', label: 'Producer', icon: Film },
  { id: 'sound', label: 'Sound Recordist', icon: Mic },
  { id: 'editor', label: 'Editor / Post', icon: FileText },
  { id: 'other', label: 'Other / Freelancer', icon: Users },
]

const TEAM_SIZES = ['Just me', '2–5 people', '6–15 people', '16–50 people', '50+ people']

export const dynamic = 'force-dynamic'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [completing, setCompleting] = useState(false)
  const [form, setForm] = useState({
    workspace: '',
    industry: 'Film & TV Production',
    teamSize: '',
    role: '',
  })

  function next() { if (step < 3) setStep(s => s + 1) }
  function back() { if (step > 1) setStep(s => s - 1) }

  async function complete() {
    setCompleting(true)
    await new Promise(r => setTimeout(r, 1500))
    router.push('/dashboard')
  }

  const canProceed = {
    1: form.workspace.trim().length >= 2 && form.teamSize,
    2: !!form.role,
    3: true,
  }[step]

  return (
    <div className="min-h-screen bg-[#04080F] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="mb-8 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-black" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">CrewDesk</span>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-0 mb-10 w-full max-w-md">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={clsx(
                'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all',
                step > s.id ? 'bg-amber-500 border-amber-500 text-black' :
                step === s.id ? 'border-amber-500 bg-amber-500/10 text-amber-400' :
                'border-white/10 bg-transparent text-white/30'
              )}>
                {step > s.id ? <Check className="w-4 h-4" /> : s.id}
              </div>
              <span className={clsx(
                'text-xs mt-1.5 font-medium whitespace-nowrap',
                step === s.id ? 'text-white' : step > s.id ? 'text-amber-400' : 'text-white/25'
              )}>{s.title}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={clsx('flex-1 h-px mx-2 -mt-5 transition-all', step > s.id ? 'bg-amber-500/50' : 'bg-white/[0.06]')} />
            )}
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-[#0A1020] border border-white/[0.06] rounded-3xl overflow-hidden shadow-2xl">

        {/* Step 1: Workspace */}
        {step === 1 && (
          <div className="p-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Set up your workspace</h2>
            <p className="text-sm text-white/40 mb-6">This is how your production company will appear in CrewDesk</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Production Company Name *</label>
                <input value={form.workspace} onChange={e => setForm(f => ({ ...f, workspace: e.target.value }))}
                  placeholder="e.g. Pinewood Productions"
                  className="w-full px-4 py-3 bg-[#060C18] border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Industry</label>
                <select value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#060C18] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all">
                  <option>Film &amp; TV Production</option>
                  <option>Commercial Production</option>
                  <option>Music Videos</option>
                  <option>Documentary</option>
                  <option>Events &amp; Weddings</option>
                  <option>Corporate Video</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-2">Team Size *</label>
                <div className="grid grid-cols-3 gap-2">
                  {TEAM_SIZES.map(s => (
                    <button key={s} onClick={() => setForm(f => ({ ...f, teamSize: s }))}
                      className={clsx(
                        'py-2 rounded-xl text-xs font-medium border transition-all',
                        form.teamSize === s
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                          : 'bg-[#060C18] border-white/10 text-white/50 hover:text-white/80 hover:border-white/20'
                      )}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Role */}
        {step === 2 && (
          <div className="p-8">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">What's your primary role?</h2>
            <p className="text-sm text-white/40 mb-6">We'll personalise your CrewDesk experience based on how you work</p>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map(r => (
                <button key={r.id} onClick={() => setForm(f => ({ ...f, role: r.id }))}
                  className={clsx(
                    'flex flex-col items-start gap-2 p-4 rounded-2xl border transition-all text-left',
                    form.role === r.id
                      ? 'bg-amber-500/10 border-amber-500/40'
                      : 'bg-[#060C18] border-white/[0.06] hover:border-white/20 hover:bg-[#0C1428]'
                  )}>
                  <div className={clsx(
                    'w-8 h-8 rounded-xl flex items-center justify-center',
                    form.role === r.id ? 'bg-amber-500/20' : 'bg-white/5'
                  )}>
                    <r.icon className={clsx('w-4 h-4', form.role === r.id ? 'text-amber-400' : 'text-white/40')} />
                  </div>
                  <span className={clsx('text-xs font-medium leading-tight', form.role === r.id ? 'text-white' : 'text-white/60')}>
                    {r.label}
                  </span>
                  {form.role === r.id && (
                    <div className="absolute top-3 right-3">
                      <Check className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Complete */}
        {step === 3 && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">You're all set!</h2>
            <p className="text-sm text-white/50 mb-6 max-w-xs mx-auto">
              Welcome to CrewDesk. Your workspace <span className="text-white font-medium">{form.workspace || 'CrewDesk'}</span> is ready to go.
            </p>
            <div className="space-y-2 mb-6 text-left">
              {[
                { icon: Building2, text: 'Workspace configured', color: 'text-blue-400', bg: 'bg-blue-400/10' },
                { icon: Users, text: `Role set as ${ROLES.find(r => r.id === form.role)?.label ?? 'Freelancer'}`, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                { icon: Star, text: 'Pro features unlocked', color: 'text-amber-400', bg: 'bg-amber-400/10' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-3 p-3 bg-[#060C18] rounded-xl border border-white/[0.06]">
                  <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', item.bg)}>
                    <item.icon className={clsx('w-4 h-4', item.color)} />
                  </div>
                  <span className="text-sm text-white/70">{item.text}</span>
                  <Check className="w-4 h-4 text-emerald-400 ml-auto flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-8 pb-8 flex items-center gap-3">
          {step > 1 && step < 3 && (
            <button onClick={back}
              className="flex items-center gap-2 px-4 py-3 border border-white/10 rounded-xl text-sm text-white/50 hover:text-white hover:border-white/20 transition-all">
              <ChevronLeft className="w-4 h-4" />Back
            </button>
          )}
          {step < 3 ? (
            <button onClick={next} disabled={!canProceed}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25">
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={complete} disabled={completing}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25">
              {completing ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Setting up...</>
              ) : (
                <>Go to Dashboard <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-white/20 mt-6">
        You can change all of these settings later in Settings
      </p>
    </div>
  )
}
