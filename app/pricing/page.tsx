'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Zap, Loader2, ArrowRight, Users, Shield, Star } from 'lucide-react'
import Link from 'next/link'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 49,
    desc: 'Perfect for freelancers and small teams just getting started.',
    features: [
      'Up to 5 active projects',
      'Up to 10 crew / freelancers',
      'Invoicing & payments',
      'Smart contracts',
      'Team messaging',
      'Standard support',
    ],
    cta: 'Start free trial',
    highlight: false,
    badge: null,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 99,
    desc: 'Everything your growing agency needs to run smoothly.',
    features: [
      'Unlimited projects',
      'Unlimited crew members',
      'Advanced analytics & reports',
      'Schedule & shift management',
      'VAT invoicing with PDF export',
      'Priority support',
      'Custom workspace branding',
    ],
    cta: 'Start free trial',
    highlight: true,
    badge: 'Most popular',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 249,
    desc: 'For large studios, agencies and multi-team organisations.',
    features: [
      'Everything in Pro',
      'Dedicated account manager',
      'Custom integrations (Xero, QuickBooks)',
      'SSO & role-based access control',
      'SLA & uptime guarantee',
      'GDPR DPA & audit logs',
      'Volume freelancer licensing',
    ],
    cta: 'Talk to sales',
    highlight: false,
    badge: null,
  },
]

const FAQS = [
  { q: 'Can I cancel at any time?',              a: 'Yes — no lock-in, no cancellation fees. Cancel from your account settings and you keep access until the end of your billing period.' },
  { q: 'Is there a free trial?',                  a: 'Every plan starts with a 14-day free trial. No credit card required to get started.' },
  { q: 'What counts as a crew member?',           a: 'Anyone you add to your freelancer roster — contractors, subcontractors, or employees you track through CrewDesk.' },
  { q: 'Can I change plans later?',               a: 'Yes. Upgrade or downgrade at any time from your billing settings. Prorated credits are applied automatically.' },
  { q: 'Do you support UK VAT invoicing?',        a: 'Yes. CrewDesk supports VAT-registered invoicing with configurable rates and PDF export ready for your accountant.' },
  { q: 'Is my data secure?',                      a: 'All data is encrypted at rest and in transit. We use Supabase and Vercel infrastructure with SOC2-compliant hosting in the EU.' },
]

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [annual, setAnnual] = useState(false)

  async function handleCheckout(planId: string) {
    if (planId === 'enterprise') { window.location.href = 'mailto:hello@crewdeskapp.com'; return }
    setLoading(planId); setError('')
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
    <div className="min-h-screen bg-[#04080F] text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#04080F]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-black fill-black" />
            </div>
            <span className="font-bold text-base tracking-tight">CrewDesk</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-400 hover:text-white px-3 py-1.5 transition-colors">Sign in</Link>
            <Link href="/signup" className="text-sm font-semibold bg-amber-400 hover:bg-amber-300 text-black px-4 py-2 rounded-lg transition-colors">Start free</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">Simple pricing</p>
          <h1 className="text-5xl font-bold text-white mb-4">Pay for what you need.<br />Scale as you grow.</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">14-day free trial on every plan. No credit card required. Cancel anytime.</p>

          {/* Annual toggle */}
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2">
            <span className={`text-sm ${!annual ? 'text-white font-medium' : 'text-slate-500'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-10 h-5 rounded-full transition-colors ${annual ? 'bg-amber-500' : 'bg-white/10'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${annual ? 'left-5.5' : 'left-0.5'}`} />
            </button>
            <span className={`text-sm ${annual ? 'text-white font-medium' : 'text-slate-500'}`}>
              Annual <span className="text-emerald-400 text-xs font-semibold ml-1">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {PLANS.map(plan => {
            const price = annual ? Math.round(plan.price * 0.8) : plan.price
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border p-8 ${plan.highlight ? 'bg-[#0F1A2E] border-amber-400/30 shadow-xl shadow-amber-400/5' : 'bg-[#0A1020] border-white/5'}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">{plan.badge}</span>
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-lg font-bold text-white mb-1">{plan.name}</h2>
                  <p className="text-slate-500 text-sm">{plan.desc}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-white">£{price}</span>
                    <span className="text-slate-500 text-sm mb-1">/mo</span>
                  </div>
                  {annual && <p className="text-emerald-400 text-xs mt-1">Billed annually (save £{(plan.price - price) * 12}/yr)</p>}
                </div>

                <div className="flex-1 space-y-3 mb-8">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-amber-400/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-amber-400" />
                      </div>
                      <span className="text-slate-300 text-sm">{f}</span>
                    </div>
                  ))}
                </div>

                {error && loading === plan.id && (
                  <p className="text-rose-400 text-xs mb-3">{error}</p>
                )}

                <button
                  onClick={() => handleCheckout(plan.id)}
                  disabled={loading === plan.id}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${plan.highlight ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-400/20' : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'} disabled:opacity-60`}
                >
                  {loading === plan.id ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>{plan.cta} <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            )
          })}
        </div>

        {/* Trust bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
          {[
            { icon: Shield, title: 'Secure & GDPR compliant', desc: 'EU data residency. Encrypted at rest and in transit.' },
            { icon: Users,  title: '2,400+ businesses trust us', desc: 'From solo operators to 200-person agencies.' },
            { icon: Star,   title: '4.9/5 average rating',       desc: 'Loved by creative teams across the UK and EU.' },
          ].map(t => {
            const Icon = t.icon
            return (
              <div key={t.title} className="flex items-start gap-4 bg-[#0A1020] border border-white/5 rounded-xl p-5">
                <div className="w-9 h-9 rounded-lg bg-amber-400/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-0.5">{t.title}</p>
                  <p className="text-xs text-slate-500">{t.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQS.map(faq => (
              <details key={faq.q} className="group bg-[#0A1020] border border-white/5 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-sm font-medium text-white hover:text-amber-400 transition-colors list-none">
                  {faq.q}
                  <span className="text-slate-500 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="px-6 pb-4">
                  <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <p className="text-slate-400 text-base mb-4">Not sure which plan is right for you?</p>
          <Link href="mailto:hello@crewdeskapp.com" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium transition-colors">
            Talk to our team — we'll help you choose <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
