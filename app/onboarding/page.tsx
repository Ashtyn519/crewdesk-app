'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Building2, Users, Briefcase, ChevronRight, ChevronLeft, Check, Loader2, Zap } from 'lucide-react'

const STEPS = ['workspace', 'team', 'usecase', 'done'] as const
type Step = typeof STEPS[number]

const INDUSTRIES = ['Film & TV', 'Commercial', 'Music Video', 'Events', 'Corporate', 'Documentary', 'Other']
const TEAM_SIZES = ['Just me', '2-5', '6-15', '16-50', '50+']
const USE_CASES = [
  { id: 'crew', label: 'Manage crew and schedules', icon: Users },
  { id: 'invoices', label: 'Send invoices and contracts', icon: Briefcase },
  { id: 'projects', label: 'Track projects and budgets', icon: Building2 },
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
        setUseCases(prev => prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id])
  }

  async function handleFinish() {
        if (!workspaceName.trim()) { setError('Workspace name is required'); return }
        setLoading(true)
        setError('')
        try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) throw new Error('Not authenticated')
                const slug = workspaceName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                const { error: wsErr } = await supabase.from('workspaces').insert({
                          name: workspaceName.trim(),
                          slug,
                          owner_id: user.id,
                          industry,
                          team_size: teamSize,
                          use_cases: useCases,
                          onboarding_completed: true,
                })
                if (wsErr) throw wsErr
                await supabase.from('profiles').upsert({ id: user.id, onboarding_completed: true }, { onConflict: 'id' })
                setStep('done')
        } catch (e: any) {
                setError(e.message || 'Something went wrong. Please try again.')
        } finally {
                setLoading(false)
        }
  }

  return (
        <div className="min-h-screen bg-[#04080F] flex items-center justify-center p-4">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />
              </div>div>
              <div className="relative w-full max-w-lg">
                      <div className="flex items-center justify-center gap-2 mb-8">
                                <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center">
                                            <Zap className="w-5 h-5 text-black" fill="black" />
                                </div>div>
                                <span className="text-xl font-bold text-white">CrewDesk</span>span>
                      </div>
                {step !== 'done' && (
                    <div className="mb-8">
                                <div className="flex justify-between text-xs text-slate-500 mb-2">
                                              <span>Step {stepIndex + 1} of {STEPS.length - 1}</span>span>
                                              <span>{Math.round(progress)}% complete</span>span>
                                </div>div>
                                <div className="w-full bg-white/5 rounded-full h-1.5">
                                              <div className="h-1.5 bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                                </div>div>
                    </div>div>
                      )}
                      <div className="bg-[#0A1020] border border-white/5 rounded-2xl p-8">
                        {step === 'workspace' && (
                      <div className="space-y-6">
                                    <div>
                                                    <h1 className="text-2xl font-bold text-white">Set up your workspace</h1>h1>
                                                    <p className="text-slate-400 mt-1 text-sm">This is how your team will be identified in CrewDesk.</p>p>
                                    </div>div>
                                    <div className="space-y-4">
                                                    <div>
                                                                      <label className="block text-sm font-medium text-slate-300 mb-2">Workspace Name *</label>label>
                                                                      <input
                                                                                            value={workspaceName}
                                                                                            onChange={e => setWorkspaceName(e.target.value)}
                                                                                            placeholder="e.g. Neon Films"
                                                                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 transition"
                                                                                          />
                                                    </div>div>
                                                    <div>
                                                                      <label className="block text-sm font-medium text-slate-300 mb-2">Industry</label>label>
                                                                      <div className="grid grid-cols-3 gap-2">
                                                                        {INDUSTRIES.map(ind => (
                                              <button key={ind} onClick={() => setIndustry(ind)}
                                                                        className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${industry === ind ? 'bg-amber-400/15 border-amber-400/50 text-amber-400' : 'bg-white/3 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'}`}
                                                                      >{ind}</button>button>
                                            ))}
                                                                      </div>div>
                                                    </div>div>
                                    </div>div>
                        {error && <p className="text-rose-400 text-sm">{error}</p>p>}
                                    <button
                                                      onClick={() => { if (!workspaceName.trim()) { setError('Please enter a workspace name'); return } setError(''); setStep('team') }}
                                                      className="w-full bg-amber-400 hover:bg-amber-300 text-black font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
                                                    >Continue <ChevronRight className="w-4 h-4" /></button>button>
                      </div>div>
                                )}
                        {step === 'team' && (
                      <div className="space-y-6">
                                    <div>
                                                    <h1 className="text-2xl font-bold text-white">How big is your team?</h1>h1>
                                                    <p className="text-slate-400 mt-1 text-sm">We will tailor CrewDesk to fit your team size.</p>p>
                                    </div>div>
                                    <div className="grid grid-cols-1 gap-3">
                                      {TEAM_SIZES.map(size => (
                                          <button key={size} onClick={() => setTeamSize(size)}
                                                                className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${teamSize === size ? 'bg-amber-400/10 border-amber-400/40 text-white' : 'bg-white/3 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'}`}
                                                              >
                                                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${teamSize === size ? 'border-amber-400 bg-amber-400' : 'border-slate-600'}`}>
                                                                {teamSize === size && <div className="w-2 h-2 bg-black rounded-full" />}
                                                              </div>div>
                                                              <span className="font-medium">{size}</span>span>
                                          </button>button>
                                        ))}
                                    </div>div>
                                    <div className="flex gap-3">
                                                    <button onClick={() => setStep('workspace')} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl transition flex items-center justify-center gap-2">
                                                                      <ChevronLeft className="w-4 h-4" /> Back
                                                    </button>button>
                                                    <button onClick={() => setStep('usecase')} className="flex-1 bg-amber-400 hover:bg-amber-300 text-black font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2">
                                                                      Continue <ChevronRight className="w-4 h-4" />
                                                    </button>button>
                                    </div>div>
                      </div>div>
                                )}
                        {step === 'usecase' && (
                      <div className="space-y-6">
                                    <div>
                                                    <h1 className="text-2xl font-bold text-white">What will you use CrewDesk for?</h1>h1>
                                                    <p className="text-slate-400 mt-1 text-sm">Select all that apply. You can change this later.</p>p>
                                    </div>div>
                                    <div className="space-y-3">
                                      {USE_CASES.map(({ id, label, icon: Icon }) => {
                                          const selected = useCases.includes(id)
                                                              return (
                                                                                    <button key={id} onClick={() => toggleUseCase(id)}
                                                                                                            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${selected ? 'bg-amber-400/10 border-amber-400/40 text-white' : 'bg-white/3 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'}`}
                                                                                                          >
                                                                                                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selected ? 'bg-amber-400/20' : 'bg-white/5'}`}>
                                                                                                                                  <Icon className={`w-5 h-5 ${selected ? 'text-amber-400' : 'text-slate-500'}`} />
                                                                                                            </div>div>
                                                                                                          <span className="flex-1 text-left font-medium">{label}</span>span>
                                                                                      {selected && <Check className="w-5 h-5 text-amber-400" />}
                                                                                      </button>button>
                                                                                  )
                                      })}
                                    </div>div>
                        {error && <p className="text-rose-400 text-sm">{error}</p>p>}
                                    <div className="flex gap-3">
                                                    <button onClick={() => setStep('team')} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl transition flex items-center justify-center gap-2">
                                                                      <ChevronLeft className="w-4 h-4" /> Back
                                                    </button>button>
                                                    <button onClick={handleFinish} disabled={loading}
                                                                        className="flex-1 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-black font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
                                                                      >
                                                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Finish</>>}
                                                    </button>button>
                                    </div>div>
                      </div>div>
                                )}
                        {step === 'done' && (
                      <div className="text-center space-y-6 py-4">
                                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                                                    <Check className="w-8 h-8 text-emerald-400" />
                                    </div>div>
                                    <div>
                                                    <h1 className="text-2xl font-bold text-white">You are all set!</h1>h1>
                                                    <p className="text-slate-400 mt-2 text-sm">
                                                                      Your workspace <span className="text-white font-medium">{workspaceName}</span>span> is ready. Let us build something great.
                                                    </p>p>
                                    </div>div>
                                    <button onClick={() => router.push('/dashboard')}
                                                      className="w-full bg-amber-400 hover:bg-amber-300 text-black font-bold py-3 rounded-xl transition"
                                                    >Go to Dashboard</button>button>
                      </div>div>
                                )}
                      </div>div>
              </div>div>
        </div>div>
      )
}</></div>
