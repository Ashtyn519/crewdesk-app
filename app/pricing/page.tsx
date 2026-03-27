'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Zap, Loader2 } from 'lucide-react'
import Link from 'next/link'

const PLANS = [
  { id: 'starter', name: 'Starter', price: 49, description: 'Perfect for small productions and freelancers.', features: ['Up to 5 crew members', '10 active projects', 'Invoicing and contracts', 'Basic analytics', 'Email support'], cta: 'Start Free Trial', highlight: false },
  { id: 'pro', name: 'Pro', price: 99, description: 'For growing production companies.', features: ['Unlimited crew members', 'Unlimited projects', 'Advanced analytics and reports', 'Schedule and calendar', 'Priority support', 'Custom contract templates'], cta: 'Start Free Trial', highlight: true, badge: 'Most Popular' },
  { id: 'enterprise', name: 'Enterprise', price: 249, description: 'For large studios and agencies.', features: ['Everything in Pro', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee', 'White-label options', 'Advanced security'], cta: 'Contact Sales', highlight: false },
  ]

export default function PricingPage() {
    const router = useRouter()
    const [loading, setLoading] = useState<string | null>(null)
    const [error, setError] = useState('')

  async function handleCheckout(planId: string) {
        if (planId === 'enterprise') { window.location.href = 'mailto:hello@crewdeskapp.com'; return }
        setLoading(planId)
        setError('')
        try {
                const res = await fetch('/api/stripe/checkout', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ plan: planId }),
                })
                const data = await res.json()
                if (!res.ok) throw new Error(data.error || 'Failed to create checkout')
                if (data.url) window.location.href = data.url
        } catch (e: any) {
                setError(e.message)
        } finally {
                setLoading(null)
        }
  }

  return (
        <div className="min-h-screen bg-[#04080F]">
              <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
                      <Link href="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center"><Zap className="w-4 h-4 text-black" fill="black" /></div>
                                <span className="text-white font-bold text-lg">CrewDesk</span>
                      </Link>
                      <div className="flex items-center gap-4">
                                <Link href="/login" className="text-slate-400 hover:text-white text-sm transition">Sign in</Link>
                                <Link href="/signup" className="bg-amber-400 hover:bg-amber-300 text-black text-sm font-semibold px-4 py-2 rounded-xl transition">Get started</Link>
                      </div>
              </nav>
              <div className="max-w-5xl mx-auto px-6 py-20">
                      <div className="text-center mb-16">
                                <h1 className="text-4xl font-bold text-white mb-4">Simple, transparent pricing</h1>
                                <p className="text-slate-400 text-lg max-w-xl mx-auto">Start with a 14-day free trial. No credit card required. Cancel anytime.</p>
                      </div>
                {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center py-3 px-4 rounded-xl mb-8 max-w-md mx-auto">{error}</div>}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {PLANS.map((plan) => (
                      <div key={plan.id} className={`relative rounded-2xl p-8 flex flex-col ${plan.highlight ? 'bg-amber-400/5 border-2 border-amber-400/40' : 'bg-[#0A1020] border border-white/5'}`}>
                        {'badge' in plan && plan.badge && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full">{plan.badge}</div>
                                    )}
                                    <div className="mb-6">
                                                    <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                                                    <p className="text-slate-400 text-sm mt-1">{plan.description}</p>
                                                    <div className="mt-4 flex items-baseline gap-1">
                                                                      <span className="text-4xl font-bold text-white">£{plan.price}</span>
                                                                      <span className="text-slate-400 text-sm">/month</span>
                                                    </div>
                                    </div>
                                    <ul className="space-y-3 mb-8 flex-1">
                                      {plan.features.map((feature, i) => (
                                          <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                                              <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlight ? 'text-amber-400' : 'text-emerald-400'}`} />
                                            {feature}
                                          </li>
                                        ))}
                                    </ul>
                                    <button
                                                      onClick={() => handleCheckout(plan.id)}
                                                      disabled={loading === plan.id}
                                                      className={`w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-60 ${plan.highlight ? 'bg-amber-400 hover:bg-amber-300 text-black' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'}`}
                                                    >
                                      {loading === plan.id ? <Loader2 className="w-4 h-4 animate-spin" /> : plan.cta}
                                    </button>
                      </div>
                    ))}
                      </div>
                      <p className="text-center text-slate-500 text-sm mt-12">
                                All plans include a 14-day free trial. No credit card required to start.{' '}
                                <Link href="/login" className="text-amber-400 hover:text-amber-300">Already have an account?</Link>
                      </p>
              </div>
        </div>
      )
}</div>
