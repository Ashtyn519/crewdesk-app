'use client'
import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Users, FileText, Receipt, ArrowRight, Eye, EyeOff, Zap, Shield, BarChart3, CheckCircle } from 'lucide-react'

const features = [
  { icon: Users, label: 'Freelancer Management', desc: 'Build and rate your freelance roster' },
  { icon: FileText, label: 'Smart Contracts', desc: 'Draft, send and sign in one place' },
  { icon: Receipt, label: 'Instant Invoicing', desc: 'Create, track and collect payments' },
  { icon: BarChart3, label: 'Live Analytics', desc: 'Real-time dashboards across projects' },
  ]

function GoogleIcon() {
    return (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>svg>
        )
}

function AppleIcon() {
    return (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.627 0c.073.937-.257 1.875-.744 2.573-.487.717-1.316 1.27-2.143 1.205-.09-.917.318-1.875.772-2.468C11.04.588 11.98.07 12.627 0zM15.75 12.394c-.378.89-.558 1.29-1.044 2.078-.677 1.09-1.633 2.448-2.818 2.458-.994.01-1.25-.637-2.6-.63-1.35.008-1.632.643-2.632.633-1.185-.01-2.09-1.24-2.767-2.332C2.149 12.457 1.8 9.886 2.745 8.332c.665-1.117 1.768-1.77 2.808-1.77 1.044 0 1.7.64 2.564.64.837 0 1.346-.642 2.551-.642 1.026 0 2.007.558 2.674 1.522-2.348 1.282-1.966 4.623.408 5.512z" fill="currentColor"/>
          </svg>svg>
        )
}

function LoginContent() {
    const router = useRouter()
        const searchParams = useSearchParams()
            const redirectTo = searchParams.get('redirect') || '/dashboard'
                const [email, setEmail] = useState('')
                    const [password, setPassword] = useState('')
                        const [showPw, setShowPw] = useState(false)
                            const [loading, setLoading] = useState(false)
                                const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null)
                                    const [error, setError] = useState('')
                                        const [resetSent, setResetSent] = useState(false)
                                            const [resetLoading, setResetLoading] = useState(false)
                                              
                                                async function handleLogin(e: React.FormEvent) {
                                                      e.preventDefault()
                                                            setLoading(true)
                                                                  setError('')
                                                                        const sb = createClient()
                                                                              const { error: err } = await sb.auth.signInWithPassword({ email, password })
                                                                                    if (err) { setError(err.message); setLoading(false) }
                                                      else { router.push(redirectTo) }
                                                }
  
    async function handleOAuth(provider: 'google' | 'apple') {
          setOauthLoading(provider)
                setError('')
                      const sb = createClient()
                            const { error: err } = await sb.auth.signInWithOAuth({
                                    provider,
                                    options: {
                                              redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
                                    },
                            })
                                  if (err) { setError(err.message); setOauthLoading(null) }
    }
  
    async function handleForgotPassword() {
          if (!email) {
                  setError('Please enter your email address above, then click Forgot password.')
                          return
          }
          setResetLoading(true)
                setError('')
                      const sb = createClient()
                            const { error: err } = await sb.auth.resetPasswordForEmail(email, {
                                    redirectTo: `${window.location.origin}/auth/callback?next=/settings?tab=security`,
                            })
                                  setResetLoading(false)
                                        if (err) {
                                                setError(err.message)
                                        } else {
                                                setResetSent(true)
                                        }
    }
  
    return (
          <div className="min-h-screen bg-[#04080F] flex">
            {/* Left panel */}
                <div className="hidden lg:flex flex-col justify-between w-[52%] px-16 py-14 border-r border-white/[0.06]">
                        <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center">
                                              <Zap className="w-5 h-5 text-[#04080F]" strokeWidth={2.5} />
                                  </div>div>
                                  <span className="text-white font-bold text-xl tracking-tight">CrewDesk</span>span>
                        </div>div>
                        <div className="flex-1 flex flex-col justify-center max-w-lg pt-16">
                                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/20 bg-amber-400/5 text-amber-400 text-xs font-medium mb-8 w-fit">
                                              <Zap className="w-3.5 h-3.5" />
                                              The operating system for freelance teams
                                  </div>div>
                                  <h1 className="text-[2.75rem] leading-[1.12] font-bold text-white mb-5">
                                              Your freelance<br /><span className="text-amber-400">workforce,</span>span><br />fully in control.
                                  </h1>h1>
                                  <p className="text-white/45 text-base leading-relaxed mb-10 max-w-sm">
                                              Hire, contract, invoice and communicate with your entire crew from one beautifully designed workspace.
                                  </p>p>
                                  <div className="grid grid-cols-2 gap-3">
                                    {features.map(f => (
                          <div key={f.label} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                                          <div className="w-8 h-8 rounded-xl bg-amber-400/10 flex items-center justify-center shrink-0">
                                                            <f.icon className="w-4 h-4 text-amber-400" />
                                          </div>div>
                                          <div>
                                                            <p className="text-white text-xs font-semibold">{f.label}</p>p>
                                                            <p className="text-white/35 text-xs mt-0.5 leading-snug">{f.desc}</p>p>
                                          </div>div>
                          </div>div>
                        ))}
                                  </div>div>
                        </div>div>
                        <div className="flex items-center gap-2 text-white/25 text-xs">
                                  <Shield className="w-3.5 h-3.5" />
                                  <span>Secure, encrypted, and built for professional teams</span>span>
                        </div>div>
                </div>div>
          
            {/* Right panel */}
                <div className="flex-1 flex items-center justify-center px-8 py-14">
                        <div className="w-full max-w-[400px]">
                                  <div className="flex lg:hidden items-center gap-2 mb-8">
                                              <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center">
                                                            <Zap className="w-4 h-4 text-[#04080F]" strokeWidth={2.5} />
                                              </div>div>
                                              <span className="text-white font-bold text-lg">CrewDesk</span>span>
                                  </div>div>
                                  <h2 className="text-2xl font-bold text-white mb-1.5">Welcome back</h2>h2>
                                  <p className="text-white/40 text-sm mb-8">Sign in to your CrewDesk workspace</p>p>
                        
                          {/* OAuth buttons */}
                                  <div className="space-y-3 mb-6">
                                              <button
                                                              type="button"
                                                              onClick={() => handleOAuth('google')}
                                                              disabled={!!oauthLoading || loading}
                                                              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 disabled:opacity-50 text-gray-800 font-medium py-3 rounded-xl text-sm transition-colors shadow-sm"
                                                            >
                                                {oauthLoading === 'google' ? (
                                                                              <svg className="animate-spin w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none">
                                                                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
                                                                              </svg>svg>
                                                                            ) : <GoogleIcon />}
                                                            Continue with Google
                                              </button>button>
                                              <button
                                                              type="button"
                                                              onClick={() => handleOAuth('apple')}
                                                              disabled={!!oauthLoading || loading}
                                                              className="w-full flex items-center justify-center gap-3 bg-white/[0.06] hover:bg-white/[0.10] disabled:opacity-50 border border-white/[0.10] text-white font-medium py-3 rounded-xl text-sm transition-colors"
                                                            >
                                                {oauthLoading === 'apple' ? (
                                                                              <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                                                                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
                                                                              </svg>svg>
                                                                            ) : <AppleIcon />}
                                                            Continue with Apple
                                              </button>button>
                                  </div>div>
                        
                          {/* Divider */}
                                  <div className="flex items-center gap-3 mb-6">
                                              <div className="flex-1 h-px bg-white/[0.08]" />
                                              <span className="text-white/25 text-xs">or sign in with email</span>span>
                                              <div className="flex-1 h-px bg-white/[0.08]" />
                                  </div>div>
                        
                                  <form onSubmit={handleLogin} className="space-y-4">
                                              <div>
                                                            <label className="block text-xs font-medium text-white/50 mb-1.5">Email address</label>label>
                                                            <input
                                                                              type="email"
                                                                              required
                                                                              value={email}
                                                                              onChange={e => setEmail(e.target.value)}
                                                                              placeholder="you@company.com"
                                                                              className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] focus:border-amber-400/50 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none transition-colors"
                                                                            />
                                              </div>div>
                                              <div>
                                                            <div className="flex items-center justify-between mb-1.5">
                                                                            <label className="text-xs font-medium text-white/50">Password</label>label>
                                                                            <button
                                                                                                type="button"
                                                                                                onClick={handleForgotPassword}
                                                                                                disabled={resetLoading}
                                                                                                className="text-xs text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-50"
                                                                                              >
                                                                              {resetLoading ? 'Sending...' : 'Forgot password?'}
                                                                            </button>button>
                                                            </div>div>
                                                            <div className="relative">
                                                                            <input
                                                                                                type={showPw ? 'text' : 'password'}
                                                                                                required
                                                                                                value={password}
                                                                                                onChange={e => setPassword(e.target.value)}
                                                                                                placeholder="Enter your password"
                                                                                                className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] focus:border-amber-400/50 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-white/25 focus:outline-none transition-colors"
                                                                                              />
                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => setShowPw(!showPw)}
                                                                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                                                                                              >
                                                                              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                            </button>button>
                                                            </div>div>
                                              </div>div>
                                  
                                    {resetSent && (
                          <div className="flex items-start gap-2 text-emerald-400 text-xs bg-emerald-400/10 border border-emerald-400/20 rounded-xl px-3 py-2.5">
                                          <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                          <span>Password reset email sent! Check your inbox and follow the link to reset your password.</span>span>
                          </div>div>
                                              )}
                                  
                                    {error && (
                          <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2.5">{error}</p>p>
                                              )}
                                  
                                              <button
                                                              type="submit"
                                                              disabled={loading || !!oauthLoading}
                                                              className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-[#04080F] font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-400/20"
                                                            >
                                                {loading ? (
                                                                              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
                                                                              </svg>svg>
                                                                            ) : (
                                                                              <><span>Sign in</span>span><ArrowRight className="w-4 h-4" /></>>
                                                                            )}
                                              </button>button>
                                  </form>form>
                        
                                  <p className="text-center text-white/35 text-xs mt-6">
                                              Don&apos;t have an account?{' '}
                                              <Link href="/signup" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">Create one free</Link>Link>
                                  </p>p>
                        
                                  <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-white/[0.06]">
                                    {[{ icon: Shield, label: 'Secure & encrypted' }, { icon: Zap, label: 'Always fast' }, { icon: Users, label: 'Priority support' }].map(b => (
                          <div key={b.label} className="flex items-center gap-1.5 text-white/25 text-xs">
                                          <b.icon className="w-3 h-3" />{b.label}
                          </div>div>
                        ))}
                                  </div>div>
                        </div>div>
                </div>div>
          </div>div>
        )
}

export default function LoginPage() {
    return (
          <Suspense fallback={<div className="min-h-screen bg-[#04080F]" />}>
                <LoginContent />
          </Suspense>Suspense>
        )
}</></svg>
