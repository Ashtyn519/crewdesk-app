'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Eye, EyeOff, Zap, Shield, Users, Check } from 'lucide-react'

const perks = [
  'Unlimited projects and crew members',
  'Full contract and invoice suite',
  'Real-time team messaging',
  'Advanced analytics dashboard',
]

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true); setError('')
    const sb = createClient()
    const { error: err } = await sb.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    })
    if (err) { setError(err.message); setLoading(false) }
    else { setDone(true) }
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
            <Zap className="w-3.5 h-3.5" />
            Free to get started — no credit card needed
          </div>
          <h1 className="text-[2.75rem] leading-[1.12] font-bold text-white mb-5">
            The operating<br />system for your<br /><span className="text-amber-400">freelance workforce.</span>
          </h1>
          <p className="text-white/45 text-base leading-relaxed mb-10 max-w-sm">
            Everything you need to hire, manage, pay and communicate with your freelance crew, built for production professionals.
          </p>
          <div className="space-y-3">
            {perks.map(p => (
              <div key={p} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-400/15 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-amber-400" strokeWidth={3} />
                </div>
                <span className="text-white/60 text-sm">{p}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {['from-violet-500 to-blue-500','from-amber-500 to-orange-400','from-emerald-500 to-teal-400','from-pink-500 to-rose-400'].map((g, i) => (
              <div key={i} className={`w-7 h-7 rounded-full bg-gradient-to-br ${g} border-2 border-[#04080F]`} />
            ))}
          </div>
          <p className="text-white/35 text-xs">Loved by production teams worldwide</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-8 py-14">
        <div className="w-full max-w-[400px]">
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#04080F]" strokeWidth={2.5} />
            </div>
            <span className="text-white font-bold text-lg">CrewDesk</span>
          </div>

          {done ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-emerald-400" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
              <p className="text-white/40 text-sm mb-6">
                We sent a confirmation link to <span className="text-white/70">{email}</span>
              </p>
              <Link href="/login" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors">
                <ArrowRight className="w-4 h-4 rotate-180" />Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-1.5">Create your account</h2>
              <p className="text-white/40 text-sm mb-2">14-day free trial — no credit card required</p>
              <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl px-3 py-2 mb-6">
                <p className="text-amber-400 text-xs font-medium">Full access for 14 days, then choose a plan that fits.</p>
              </div>
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Full name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] focus:border-amber-400/50 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Email address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] focus:border-amber-400/50 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] focus:border-amber-400/50 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-white/25 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && (
                  <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2.5">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-[#04080F] font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-400/20"
                >
                  {loading ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
                    </svg>
                  ) : (
                    <><span>Create account</span><ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
              <p className="text-white/30 text-xs text-center mt-4">
                By signing up you agree to our{' '}
                <a href="mailto:info@crewdeskapp.com?subject=Terms Enquiry" className="text-white/50 hover:text-white/70 transition-colors">Terms</a>
                {' '}and{' '}
                <a href="mailto:info@crewdeskapp.com?subject=Privacy Enquiry" className="text-white/50 hover:text-white/70 transition-colors">Privacy Policy</a>
              </p>
              <p className="text-center text-white/35 text-xs mt-6">
                Already have an account?{' '}
                <Link href="/login" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">Sign in</Link>
              </p>
              <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-white/[0.06]">
                {[{ icon: Shield, label: 'Secure & encrypted' }, { icon: Zap, label: 'Always fast' }, { icon: Users, label: 'Priority support' }].map(b => (
                  <div key={b.label} className="flex items-center gap-1.5 text-white/25 text-xs">
                    <b.icon className="w-3 h-3" />{b.label}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
              }
