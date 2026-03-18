'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { CheckCircle, ArrowRight, Briefcase, Users, CreditCard } from 'lucide-react'

export const dynamic = "force-dynamic";


const STEPS = [
  { id: 1, title: 'Your Workspace', desc: 'Set up your company details', icon: Briefcase },
  { id: 2, title: 'Your Role', desc: 'Tell us about your production work', icon: Users },
  { id: 3, title: "You are Ready!", desc: "Start managing your crew", icon: CreditCard },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ company_name: '', role: '', currency: 'GBP', production_type: '' })
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleComplete = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data: existing } = await supabase.from('workspaces').select('id').eq('user_id', user?.id).single()
    if (existing) {
      await supabase.from('workspaces').update({ ...form, onboarding_completed: true }).eq('user_id', user?.id)
    } else {
      await supabase.from('workspaces').insert({ ...form, user_id: user?.id, onboarding_completed: true })
    }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#04080F] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="text-4xl font-black text-amber-400 mb-2">CREWDESK</div>
          <p className="text-slate-400">Let's get you set up in 3 quick steps</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center mb-8 gap-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step > s.id ? 'bg-emerald-400 text-black' : step === s.id ? 'bg-amber-400 text-black' : 'bg-slate-800 text-slate-500'}`}>
                {step > s.id ? <CheckCircle size={16} /> : s.id}
              </div>
              {i < STEPS.length - 1 && <div className={`w-12 h-0.5 ${step > s.id ? 'bg-emerald-400' : 'bg-slate-800'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-[#0F1A2E] rounded-2xl p-8 border border-slate-800">
          {step === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-400/10 rounded-xl flex items-center justify-center"><Briefcase className="text-amber-400" size={20} /></div>
                <div>
                  <h2 className="text-xl font-bold text-white">{STEPS[0].title}</h2>
                  <p className="text-slate-400 text-sm">{STEPS[0].desc}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-slate-300 text-sm block mb-1.5">Company / Production Name</label>
                  <input type="text" value={form.company_name} onChange={e => setForm(f => ({...f, company_name: e.target.value}))}
                    placeholder="e.g. Bright Light Productions"
                    className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
                </div>
                <div>
                  <label className="text-slate-300 text-sm block mb-1.5">Currency</label>
                  <select value={form.currency} onChange={e => setForm(f => ({...f, currency: e.target.value}))}
                    className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400/50">
                    <option value="GBP">£ GBP (British Pound)</option>
                    <option value="USD">$ USD (US Dollar)</option>
                    <option value="EUR">€ EUR (Euro)</option>
                    <option value="AUD">A$ AUD (Australian Dollar)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-cyan-400/10 rounded-xl flex items-center justify-center"><Users className="text-cyan-400" size={20} /></div>
                <div>
                  <h2 className="text-xl font-bold text-white">{STEPS[1].title}</h2>
                  <p className="text-slate-400 text-sm">{STEPS[1].desc}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-slate-300 text-sm block mb-1.5">Your Role</label>
                  <input type="text" value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value}))}
                    placeholder="e.g. Producer, Director, Line Producer"
                    className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
                </div>
                <div>
                  <label className="text-slate-300 text-sm block mb-1.5">Primary Production Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Film', 'TV / Streaming', 'Events', 'Commercial'].map(type => (
                      <button key={type} onClick={() => setForm(f => ({...f, production_type: type}))}
                        className={`p-3 rounded-xl border text-sm font-medium transition-all ${form.production_type === type ? 'border-amber-400 bg-amber-400/10 text-amber-400' : 'border-slate-700 text-slate-400 hover:border-slate-600'}`}>
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-emerald-400" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">You're all set!</h2>
              <p className="text-slate-400 mb-6">Your CrewDesk workspace is ready. Start by adding your crew, creating projects, or sending an invoice.</p>
              <div className="grid grid-cols-3 gap-3 text-center mb-6">
                {[['🎬', 'Projects', 'Track productions'], ['👥', 'Crew', 'Build your roster'], ['📄', 'Invoices', 'Get paid faster']].map(([emoji, title, desc]) => (
                  <div key={title as string} className="bg-[#0A1020] rounded-xl p-3">
                    <div className="text-2xl mb-1">{emoji}</div>
                    <div className="text-white text-sm font-medium">{title as string}</div>
                    <div className="text-slate-500 text-xs">{desc as string}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl transition-colors">
                Back
              </button>
            )}
            {step < 3 ? (
              <button onClick={() => setStep(s => s + 1)}
                className="flex-1 bg-amber-400 hover:bg-amber-300 text-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                Continue <ArrowRight size={18} />
              </button>
            ) : (
              <button onClick={handleComplete} disabled={saving}
                className="flex-1 bg-amber-400 hover:bg-amber-300 text-black font-bold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? 'Setting up...' : 'Go to Dashboard'} {!saving && <ArrowRight size={18} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
