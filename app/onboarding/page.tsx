'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Building2, Users, Briefcase, ChevronRight, ChevronLeft, Check, Loader2, Zap } from 'lucide-react'

const STEPS = ['workspace', 'industry', 'team', 'done'] as const
type Step = typeof STEPS[number]

const INDUSTRIES = [
  { id: 'agency',       label: 'Creative / Marketing Agency', icon: '🎨' },
  { id: 'production',   label: 'Film, TV & Video Production',  icon: '🎬' },
  { id: 'events',       label: 'Events & Live Production',     icon: '🎤' },
  { id: 'tech',         label: 'Tech / Software',              icon: '💻' },
  { id: 'consulting',   label: 'Consulting / Professional',    icon: '📊' },
  { id: 'architecture', label: 'Architecture / Design',        icon: '🏛️' },
  { id: 'pr',           label: 'PR / Communications',          icon: '📣' },
  { id: 'other',        label: 'Other',                        icon: '✨' },
]

const TEAM_SIZES = [
  { id: 'solo',   label: 'Just me',   desc: 'Sole trader or independent' },
  { id: 'small',  label: '2–10',      desc: 'Small team' },
  { id: 'medium', label: '11–50',     desc: 'Growing business' },
  { id: 'large',  label: '50+',       desc: 'Established company' },
]

const USE_CASES = [
  { id: 'roster',    label: 'Manage my freelancer roster' },
  { id: 'invoicing', label: 'Invoice clients faster' },
  { id: 'contracts', label: 'Send & sign contracts' },
  { id: 'projects',  label: 'Track projects and budgets' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState<Step>('workspace')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [workspaceName, setWorkspaceName] = useState('')
  const [industry, setIndustry] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [useCases, setUseCases] = useState<string[]>([])

  const stepIndex = STEPS.indexOf(step)
  const progress = (stepIndex / (STEPS.length - 1)) * 100

  function toggleUseCase(id: string) {
    setUseCases(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  async function finish() {
    setLoading(true); setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { error: err } = await supabase.from('workspaces').insert({
        user_id: user.id,
        company_name: workspaceName,
        currency: 'GBP',
      })
      if (err) throw err
      router.push('/dashboard')
    } catch (e: any) {
      setError(e.message || 'Something went wrong'); setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#04080F] flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10">
        <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center">
          <Zap className="w-4 h-4 text-black fill-black" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">CrewDesk</span>
      </div>

      {/* Progress */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500">Step {stepIndex + 1} of {STEPS.length}</span>
          <span className="text-xs text-slate-500">{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-1">
          <div className="h-1 bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="w-full max-w-lg">

        {/* Step 1: Workspace */}
        {step === 'workspace' && (
          <div className="bg-[#0A1020] border border-white/5 rounded-2xl p-8">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-6">
              <Building2 className="w-6 h-6 text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Name your workspace</h1>
            <p className="text-slate-400 text-sm mb-8">This is usually your company or agency name. You can change it later.</p>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Workspace name</label>
              <input
                autoFocus
                type="text"
                value={workspaceName}
                onChange={e => setWorkspaceName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && workspaceName.trim() && setStep('industry')}
                placeholder="e.g. Apex Agency, Okafor Productions…"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400/50 text-sm"
              />
            </div>
            <button
              disabled={!workspaceName.trim()}
              onClick={() => setStep('industry')}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-black font-semibold py-3.5 rounded-xl transition-all"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Industry */}
        {step === 'industry' && (
          <div className="bg-[#0A1020] border border-white/5 rounded-2xl p-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center mb-6">
              <Briefcase className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">What best describes your business?</h1>
            <p className="text-slate-400 text-sm mb-6">We'll customise your experience to suit your industry.</p>
            <div className="grid grid-cols-2 gap-2.5">
              {INDUSTRIES.map(ind => (
                <button
                  key={ind.id}
                  onClick={() => setIndustry(ind.id)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${industry === ind.id ? 'bg-amber-400/10 border-amber-400/40 text-amber-400' : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'}`}
                >
                  <span className="text-lg">{ind.icon}</span>
                  <span className="text-xs font-medium leading-snug">{ind.label}</span>
                  {industry === ind.id && <Check className="w-3.5 h-3.5 ml-auto shrink-0" />}
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep('workspace')} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white text-sm transition-all">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                disabled={!industry}
                onClick={() => setStep('team')}
                className="flex-1 flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-black font-semibold py-3 rounded-xl transition-all text-sm"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Team + Use cases */}
        {step === 'team' && (
          <div className="bg-[#0A1020] border border-white/5 rounded-2xl p-8">
            <div className="w-12 h-12 rounded-2xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Tell us about your team</h1>
            <p className="text-slate-400 text-sm mb-6">Helps us set sensible defaults for your workspace.</p>
            
            <div className="mb-6">
              <p className="text-xs font-medium text-slate-400 mb-3">How many people in your team?</p>
              <div className="grid grid-cols-2 gap-2">
                {TEAM_SIZES.map(ts => (
                  <button
                    key={ts.id}
                    onClick={() => setTeamSize(ts.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${teamSize === ts.id ? 'bg-amber-400/10 border-amber-400/40' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                  >
                    <p className={`text-sm font-semibold ${teamSize === ts.id ? 'text-amber-400' : 'text-white'}`}>{ts.label}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{ts.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs font-medium text-slate-400 mb-3">What do you mainly want to use CrewDesk for?</p>
              <div className="space-y-2">
                {USE_CASES.map(uc => (
                  <button
                    key={uc.id}
                    onClick={() => toggleUseCase(uc.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${useCases.includes(uc.id) ? 'bg-amber-400/10 border-amber-400/40 text-amber-400' : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'}`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${useCases.includes(uc.id) ? 'bg-amber-400 border-amber-400' : 'border-white/20'}`}>
                      {useCases.includes(uc.id) && <Check className="w-3 h-3 text-black" />}
                    </div>
                    <span className="text-sm">{uc.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-rose-400 text-sm mb-4 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">{error}</p>}

            <div className="flex gap-3">
              <button onClick={() => setStep('industry')} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white text-sm transition-all">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                disabled={!teamSize || loading}
                onClick={finish}
                className="flex-1 flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-black font-semibold py-3 rounded-xl transition-all text-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Launch my workspace <ChevronRight className="w-4 h-4" /></>}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Done (shown briefly before redirect) */}
        {step === 'done' && (
          <div className="bg-[#0A1020] border border-white/5 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">You're all set!</h1>
            <p className="text-slate-400 text-sm">Taking you to your dashboard…</p>
          </div>
        )}
      </div>
    </div>
  )
}
