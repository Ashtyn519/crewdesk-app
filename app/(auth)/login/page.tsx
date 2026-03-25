'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Users, FileText, Receipt, ArrowRight, Eye, EyeOff, Zap, Shield, BarChart3, Star } from 'lucide-react'

const features = [
  { icon: Users, label: 'Crew Management', desc: 'Build and rate your freelance roster' },
  { icon: FileText, label: 'Smart Contracts', desc: 'Draft, send and sign in one place' },
  { icon: Receipt, label: 'Instant Invoicing', desc: 'Create, track and collect payments' },
  { icon: BarChart3, label: 'Live Analytics', desc: 'Real-time dashboards across projects' },
  ]

const orbs = [
  { size: 480, top: '-10%', left: '-8%', color: 'rgba(245,158,11,0.07)' },
  { size: 360, top: '55%', left: '60%', color: 'rgba(139,92,246,0.06)' },
  { size: 280, top: '30%', left: '35%', color: 'rgba(16,185,129,0.04)' },
  ]

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')
        const sb = createClient()
        const { error: err } = await sb.auth.signInWithPassword({ email, password })
        if (err) {
                setError(err.message)
                setLoading(false)
        } else {
                router.push('/dashboard')
        }
  }

  return (
        <div className="h-screen bg-[#04080F] flex overflow-hidden relative">
          {orbs.map((o, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.6, delay: i * 0.3 }} className="absolute pointer-events-none rounded-full blur-3xl" style={{ width: o.size, height: o.size, top: o.top, left: o.left, background: o.color }} />
                ))}
        
          {/* LEFT PANEL */}
              <div className="hidden lg:flex flex-col justify-between w-[52%] px-16 py-14 relative z-10">
                      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center"><Zap className="w-5 h-5 text-[#04080F]" strokeWidth={2.5} /></div>div>
                                <span className="text-white font-bold text-xl tracking-tight">CrewDesk</span>span>
                      </motion.div>motion.div>
              
                      <div className="flex-1 flex flex-col justify-center max-w-lg">
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/20 bg-amber-400/5 text-amber-400 text-xs font-medium mb-8">
                                                          <Star className="w-3.5 h-3.5" />
                                                          The operating system for freelance teams
                                            </div>div>
                                </motion.div>motion.div>
                                <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.22 }} className="text-[2.75rem] leading-[1.12] font-bold text-white mb-5">
                                            Your freelance<br /><span className="text-amber-400">workforce,</span>span><br />fully in control.
                                </motion.h1>motion.h1>
                                <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.32 }} className="text-white/45 text-base leading-relaxed mb-10 max-w-sm">
                                            Hire, contract, invoice and communicate with your entire crew — from one beautifully designed workspace.
                                </motion.p>motion.p>
                                <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.4 } } }} className="grid grid-cols-2 gap-3">
                                  {features.map(f => (
                        <motion.div key={f.label} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1] transition-colors">
                                        <div className="w-8 h-8 rounded-xl bg-amber-400/10 flex items-center justify-center shrink-0"><f.icon className="w-4 h-4 text-amber-400" /></div>div>
                                        <div><p className="text-white text-xs font-semibold">{f.label}</p>p><p className="text-white/35 text-xs mt-0.5 leading-snug">{f.desc}</p>p></div>div>
                        </motion.div>motion.div>
                      ))}
                                </motion.div>motion.div>
                      </div>div>
              
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.9 }} className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                  {['from-violet-500 to-blue-500','from-amber-500 to-orange-400','from-emerald-500 to-teal-400','from-pink-500 to-rose-400'].map((g, i) => (
                        <div key={i} className={`w-7 h-7 rounded-full bg-gradient-to-br ${g} border-2 border-[#04080F]`} />
                      ))}
                                </div>div>
                                <p className="text-white/35 text-xs">Loved by production teams worldwide</p>p>
                      </motion.div>motion.div>
              </div>div>
        
          {/* RIGHT PANEL */}
              <div className="flex-1 lg:w-[48%] flex items-center justify-center px-8 py-14 relative z-10">
                      <div className="w-full max-w-[400px]">
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex lg:hidden items-center gap-2 mb-8">
                                            <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center"><Zap className="w-4 h-4 text-[#04080F]" strokeWidth={2.5} /></div>div>
                                            <span className="text-white font-bold text-lg">CrewDesk</span>span>
                                </motion.div>motion.div>
                      
                                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}>
                                            <h2 className="text-2xl font-bold text-white mb-1.5">Welcome back</h2>h2>
                                            <p className="text-white/40 text-sm mb-8">Sign in to your CrewDesk workspace</p>p>
                                
                                            <form onSubmit={handleLogin} className="space-y-4">
                                                          <div>
                                                                          <label className="block text-xs font-medium text-white/50 mb-1.5">Email address</label>label>
                                                                          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] focus:border-amber-400/50 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none transition-colors" />
                                                          </div>div>
                                                          <div>
                                                                          <div className="flex items-center justify-between mb-1.5">
                                                                                            <label className="text-xs font-medium text-white/50">Password</label>label>
                                                                                            <a href="mailto:info@crewdeskapp.com?subject=Password Reset Request" className="text-xs text-amber-400 hover:text-amber-300 transition-colors">Forgot password?</a>a>
                                                                          </div>div>
                                                                          <div className="relative">
                                                                                            <input type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] focus:border-amber-400/50 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-white/25 focus:outline-none transition-colors" />
                                                                                            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                                                                                              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                                              </button>button>
                                                                          </div>div>
                                                          </div>div>
                                                          <AnimatePresence>
                                                            {error && (
                            <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2.5">{error}</motion.p>motion.p>
                          )}
                                                          </AnimatePresence>AnimatePresence>
                                                          <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.975 }} type="submit" disabled={loading} className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-[#04080F] font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-400/20">
                                                            {loading ? (
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" /></svg>svg>
                          ) : (
                            <><span>Sign in</span>span><ArrowRight className="w-4 h-4" /></>>
                          )}
                                                          </motion.button>motion.button>
                                            </form>form>
                                
                                            <p className="text-center text-white/35 text-xs mt-6">
                                                          Don&apos;t have an account?{' '}
                                                          <Link href="/signup" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">Create one free</Link>Link>
                                            </p>p>
                                
                                            <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-white/[0.06]">
                                              {[{ icon: Shield, label: 'Secure & encrypted' }, { icon: Zap, label: 'Always fast' }, { icon: Users, label: 'Priority support' }].map(b => (
                          <div key={b.label} className="flex items-center gap-1.5 text-white/25 text-xs"><b.icon className="w-3 h-3" />{b.label}</div>div>
                        ))}
                                            </div>div>
                                </motion.div>motion.div>
                      </div>div>
              </div>div>
        </div>div>
      )
}</></div>
