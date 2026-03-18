'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight, Eye, EyeOff, Zap, Shield, Users,
  Check, Sparkles, Star, BarChart3
} from 'lucide-react'

const perks = [
  'Unlimited projects & crew members',
  'Full contract and invoice suite',
  'Real-time team messaging',
  'Advanced analytics dashboard',
]

const orbs = [
  { size: 500, top: '-15%', left: '-10%', color: 'rgba(245,158,11,0.06)' },
  { size: 380, top: '60%',  left: '55%',  color: 'rgba(139,92,246,0.05)' },
]

export default function SignupPage() {
  const router = useRouter()
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [done, setDone]         = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const sb = createClient()
    const { error: err } = await sb.auth.signUp({
      email, password,
      options: { data: { full_name: name } }
    })
    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      setDone(true)
    }
  }

  return (
    <div className="h-screen bg-[#04080F] flex overflow-hidden relative">

      {/* Orbs */}
      {orbs.map((o, i) => (
        <motion.div key={i}
          initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
          transition={{ duration:1.6, delay:i*0.3 }}
          className="absolute pointer-events-none rounded-full blur-3xl"
          style={{ width:o.size, height:o.size, top:o.top, left:o.left, background:o.color }}
        />
      ))}

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] px-16 py-14 relative z-10">
        <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
          className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center">
            <Zap className="w-5 h-5 text-[#04080F]" strokeWidth={2.5} />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">CrewDesk</span>
        </motion.div>

        <div className="flex-1 flex flex-col justify-center max-w-lg">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.15 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/20 bg-amber-400/5 text-amber-400 text-xs font-medium mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              Free to get started · No credit card needed
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.65, delay:0.22, ease:[0.22,1,0.36,1] }}
            className="text-[2.75rem] leading-[1.12] font-bold text-white mb-5">
            The operating<br />
            system for your<br />
            <span className="text-amber-400">freelance workforce.</span>
          </motion.h1>

          <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.55, delay:0.32 }}
            className="text-white/45 text-base leading-relaxed mb-10 max-w-sm">
            Everything you need to hire, manage, pay and communicate with your freelance crew — built for production professionals.
          </motion.p>

          <motion.div initial="hidden" animate="show"
            variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.07, delayChildren:0.42 } } }}
            className="space-y-3">
            {perks.map(p => (
              <motion.div key={p}
                variants={{ hidden:{ opacity:0, x:-12 }, show:{ opacity:1, x:0, transition:{ duration:0.4, ease:[0.22,1,0.36,1] } } }}
                className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-400/15 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-amber-400" strokeWidth={3} />
                </div>
                <span className="text-white/60 text-sm">{p}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Rating */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.0, duration:0.5 }}
            className="flex items-center gap-3 mt-10 pt-8 border-t border-white/[0.06]">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-white/35 text-xs"><span className="text-white/60 font-medium">4.9/5</span> from 800+ reviews</p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.6, delay:0.9 }}
          className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {['from-violet-500 to-blue-500','from-amber-500 to-orange-400','from-emerald-500 to-teal-400','from-pink-500 to-rose-400'].map((g,i) => (
              <div key={i} className={`w-7 h-7 rounded-full bg-gradient-to-br ${g} border-2 border-[#04080F]`} />
            ))}
          </div>
          <p className="text-white/35 text-xs">Join <span className="text-white/60 font-medium">2,400+</span> production teams</p>
        </motion.div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 lg:w-[48%] flex items-center justify-center px-8 py-14 relative z-10">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}
            className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#04080F]" strokeWidth={2.5} />
            </div>
            <span className="text-white font-bold text-lg">CrewDesk</span>
          </motion.div>

          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="done"
                initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
                transition={{ type:'spring', stiffness:300, damping:24 }}
                className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-emerald-400" strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
                <p className="text-white/40 text-sm mb-6">We sent a confirmation link to <span className="text-white/70">{email}</span></p>
                <Link href="/login"
                  className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors">
                  <ArrowRight className="w-4 h-4 rotate-180" /> Back to sign in
                </Link>
              </motion.div>
            ) : (
              <motion.div key="form"
                initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
                transition={{ duration:0.55, delay:0.1, ease:[0.22,1,0.36,1] }}>
                <h2 className="text-2xl font-bold text-white mb-1.5">Create your account</h2>
                <p className="text-white/40 text-sm mb-8">Start managing your productions today</p>

                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">Full name</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] focus:border-amber-400/50 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">Email address</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] focus:border-amber-400/50 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">Password</label>
                    <div className="relative">
                      <input type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="Minimum 8 characters"
                        className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] focus:border-amber-400/50 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-white/25 focus:outline-none transition-colors" />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.p initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                        className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2.5">
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button whileHover={{ scale:1.015 }} whileTap={{ scale:0.975 }}
                    type="submit" disabled={loading}
                    className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-[#04080F] font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-400/20">
                    {loading ? (
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
                      </svg>
                    ) : (
                      <><span>Create account</span><ArrowRight className="w-4 h-4" /></>
                    )}
                  </motion.button>
                </form>

                <p className="text-white/30 text-xs text-center mt-4">
                  By signing up you agree to our{' '}
                  <a href="#" className="text-white/50 hover:text-white/70 transition-colors">Terms</a>
                  {' '}and{' '}
                  <a href="#" className="text-white/50 hover:text-white/70 transition-colors">Privacy Policy</a>
                </p>

                <p className="text-center text-white/35 text-xs mt-6">
                  Already have an account?{' '}
                  <Link href="/login" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
                    Sign in
                  </Link>
                </p>

                <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-white/[0.06]">
                  {[
                    { icon: Shield, label: 'SOC 2 Secure' },
                    { icon: Zap,    label: 'Always fast'  },
                    { icon: Users,  label: '24/7 support' },
                  ].map(b => (
                    <div key={b.label} className="flex items-center gap-1.5 text-white/25 text-xs">
                      <b.icon className="w-3 h-3" />
                      {b.label}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
