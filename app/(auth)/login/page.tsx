'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#04080F] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl font-black text-amber-400 mb-2">CREWDESK</div>
          <p className="text-slate-400">Sign in to your workspace</p>
        </div>
        <div className="bg-[#0F1A2E] rounded-2xl p-8 border border-slate-800">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="bg-red-900/30 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>}
            <div>
              <label className="text-slate-300 text-sm font-medium block mb-2">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 transition-colors"
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-slate-300 text-sm font-medium block mb-2">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full bg-[#0A1020] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 transition-colors"
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-300 text-black font-bold py-3 rounded-xl transition-colors disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-slate-500 text-sm mt-6">
            No account? <Link href="/signup" className="text-amber-400 hover:text-amber-300">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
