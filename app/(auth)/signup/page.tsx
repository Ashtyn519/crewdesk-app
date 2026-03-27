'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Eye, EyeOff, Zap, Shield, Users, Check } from 'lucide-react'

const perks = [
  'Manage your entire freelance roster',
  'Contracts, invoices and payments in one place',
  'Real-time project tracking and analytics',
  'Free 14-day trial — no credit card needed',
]

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true); setError('')
    const sb = createClient()
    const { error: err } = await sb.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, company_name: company } }
    })
    if (err) { setError(err.message); setLoading(false) }
    else { router.push('/onboarding') }
  }

  return (
    <div className="min-h-screen bg-[#04080F] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] px-16 py-14 border-r border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center">
            <Zap className="w-5 h-5 text-[#04080F]" strokeWidth={2.5} />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">CrewDesk</span>
        </div>
        <div className="flex-1 flex flex-col justify-center max-w-lg pt-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/20 bg-amber-400/5 text-amber-400 text-xs font-medium mb-8 w-fit">
            <Zap className="w-3 h-3" />
            Free to get started — no credit card needed
          </div>
          <h1 className="text-[2.75rem] leading-[1.12] font-bold text-white mb-5">
            The operating<br />system for your<br /><span className="text-amber-400">freelance workforce.</span>
          </h1>
          <p className="text-white/45 text-base leading-relaxed mb-10 max-w-sm">
            Hire, brief, contract, invoice and pay your freelancers — all from one beautifully designed workspace.
          </p>
          <div className="space-y-3">
            {perks.map(p => (
              <div key={p} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="w-8 h-8 rounded-xl bg-amber-400/10 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-white text-xs font-semibold mt-1.5">{p}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 pt-8 border-t border-white/5">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => <span key={i} className="text-amber-400 text-xs">★</span>)}
          </div>
          <p className="text-slate-500 text-xs">Trusted by 2,400+ businesses worldwide</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-12">
        <div className="max-w-md w-full mx-auto">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center">
              <Zap className="w-4 h-4 text-black fill-black" />
            </div>
            <span className="text-white font-bold text-lg">CrewDesk</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Create your account</h2>
          <p className="text-slate-400 text-sm mb-8">Start your 14-day free trial. No credit card required.</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Your name</label>
                <input
                  type="text" required value={name} onChange={e => setName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-amber-400/50 focus:bg-white/[0.07] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Company name</label>
                <input
                  type="text" required value={company} onChange={e => setCompany(e.target.value)}
                  placeholder="Apex Agency"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-amber-400/50 focus:bg-white/[0.07] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Work email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="jane@yourcompany.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-amber-400/50 focus:bg-white/[0.07] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-amber-400/50 focus:bg-white/[0.07] transition-all"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-rose-400 text-sm">{error}</div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-semibold py-3.5 rounded-xl transition-all mt-2 shadow-lg shadow-amber-400/20"
            >
              {loading ? 'Creating account…' : (
                <>Create free account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="flex items-center gap-2 mt-5">
            <Shield className="w-3.5 h-3.5 text-slate-600" />
            <p className="text-slate-600 text-xs">By signing up you agree to our <Link href="mailto:hello@crewdeskapp.com" className="text-slate-400 hover:text-white underline">Terms</Link> and <Link href="mailto:hello@crewdeskapp.com" className="text-slate-400 hover:text-white underline">Privacy Policy</Link>.</p>
          </div>

          <p className="text-center text-slate-500 text-sm mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-amber-400 hover:text-amber-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
