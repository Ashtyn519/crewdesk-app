'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
    if (error) { setError(error.message); setLoading(false); return }
    if (data.user) router.push('/onboarding')
    else setSuccess(true)
    setLoading(false)
  }

  if (success) return (
    <div className="min-h-screen bg-[#04080F] flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-4">✉️</div>
        <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
        <p className="text-slate-400">We sent a confirmation link to {email}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#04080F] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl font-black text-amber-400 mb-2">CREWDESK</div>
          <p className="text-slate-400">Create your account</p>
        </div>
        <div className="bg-[#0F1A2E] rounded-2xl p-8 border border-slate-800">
          <form onSubmit={handleSignup} className="space-y-4">
            {error && <div className="bg-red-900/30 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>}
            <div>
              <label className="text-slate-300 text-sm font-medium block mb-2">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required
                className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 transition-colors"
                placeholder="Your name" />
            </div>
            <div>
              <label className="text-slate-300 text-sm font-medium block mb-2">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 transition-colors"
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-slate-300 text-sm font-medium block mb-2">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
                className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 transition-colors"
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-300 text-black font-bold py-3 rounded-xl transition-colors disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-slate-500 text-sm mt-6">
            Have an account? <Link href="/login" className="text-amber-400 hover:text-amber-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
