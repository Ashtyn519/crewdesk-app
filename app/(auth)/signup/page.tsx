'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Film, Mail, Lock, User, ArrowRight, Sparkles, AlertCircle, CheckCircle } from 'lucide-react'

export default function SignupPage() {
  const supabase = createClient()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } }
    })
    if (error) { setError(error.message); setLoading(false) }
    else { setSuccess(true); setTimeout(() => router.push('/onboarding'), 2000) }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#04080F] flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-white font-bold text-xl mb-2">Account created!</h2>
          <p className="text-slate-400 text-sm">Setting up your workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#04080F] flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#060C18] border-r border-white/[0.06] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Film className="w-5 h-5 text-black" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">CrewDesk</span>
        </div>
        <div className="relative space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 text-xs font-medium">Free to get started</span>
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">Everything your production needs in one place</h2>
            <p className="text-slate-400 text-lg leading-relaxed">Join production managers already using CrewDesk to run smoother, faster productions.</p>
          </div>
          <div className="space-y-4">
            {[
              { title: 'Unlimited projects', desc: 'Create and manage as many productions as you need' },
              { title: 'Full crew management', desc: 'Invite, rate and schedule your entire team' },
              { title: 'Professional invoicing', desc: 'Create and send invoices in seconds' },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{item.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-slate-600 text-xs">© 2026 CrewDesk. All rights reserved.</div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm">
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center">
              <Film className="w-5 h-5 text-black" />
            </div>
            <span className="text-white font-bold text-lg">CrewDesk</span>
          </div>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-slate-400 text-sm">Start managing your productions today</p>
          </div>
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 font-medium mb-1.5">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required className="w-full bg-[#0A1020] border border-white/[0.08] text-white text-sm pl-10 pr-4 py-3 rounded-xl placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 font-medium mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required className="w-full bg-[#0A1020] border border-white/[0.08] text-white text-sm pl-10 pr-4 py-3 rounded-xl placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 font-medium mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 8 characters" minLength={8} required className="w-full bg-[#0A1020] border border-white/[0.08] text-white text-sm pl-10 pr-4 py-3 rounded-xl placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-all" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-semibold text-sm py-3 rounded-xl transition-colors shadow-lg shadow-amber-500/20 mt-2">
              {loading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <><span>Create account</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
          <p className="text-center text-xs text-slate-600 mt-4">
            By creating an account you agree to our Terms of Service and Privacy Policy.
          </p>
          <p className="text-center text-sm text-slate-500 mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
