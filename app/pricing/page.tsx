'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, X, Zap, Star, Crown, Users, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'

const BUSINESS_PLANS = [
  {
    name: 'Starter',
    monthlyPrice: 39,
    annualPrice: 32,
    icon: Zap,
    color: 'text-gray-400',
    iconBg: 'bg-gray-400/10',
    desc: 'Best for solo operators and small teams getting started.',
    features: [
      'Up to 3 user seats',
      '20 job postings per month',
      'Basic search and filtering of freelancers',
      'In-platform messaging',
      'Standard support',
      '14-day free trial',
    ],
    missing: ['Advanced search', 'Team collaboration', 'Reporting & analytics', 'Invoicing & payments', 'Custom branding', 'API access'],
    cta: 'Start Free Trial',
    ctaHref: '/signup',
    highlight: false,
    badge: null,
  },
  {
    name: 'Growth',
    monthlyPrice: 99,
    annualPrice: 84,
    icon: Star,
    color: 'text-amber-400',
    iconBg: 'bg-amber-400/10',
    desc: 'Best for growing companies with regular hiring needs.',
    features: [
      'Up to 15 user seats',
      'Unlimited job postings',
      'Advanced search with saved filters',
      'Team collaboration tools',
      'Booking and scheduling management',
      'Basic reporting and analytics',
      'Priority support',
      '14-day free trial',
    ],
    missing: ['Invoicing & payment processing', 'Custom branding', 'Advanced analytics', 'Dedicated account manager', 'API access'],
    cta: 'Start Free Trial',
    ctaHref: '/signup',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Professional',
    monthlyPrice: 249,
    annualPrice: 209,
    icon: Crown,
    color: 'text-purple-400',
    iconBg: 'bg-purple-400/10',
    desc: 'For businesses that need full control and advanced tools.',
    features: [
      'Up to 50 user seats',
      'Unlimited job postings',
      'Advanced search with AI matching',
      'Crew favourites and talent pools',
      'Automated availability checking',
      'Invoicing and payment processing',
      'Custom branding',
      'Advanced analytics and reporting',
      'Dedicated account manager',
      '14-day free trial',
    ],
    missing: ['Unlimited seats', 'API access & integrations', 'SSO & advanced security', 'Custom workflows', 'SLA guarantees'],
    cta: 'Start Free Trial',
    ctaHref: '/signup',
    highlight: false,
    badge: null,
  },
  {
    name: 'Enterprise',
    monthlyPrice: null,
    annualPrice: null,
    icon: Users,
    color: 'text-blue-400',
    iconBg: 'bg-blue-400/10',
    desc: 'For large organisations with complex needs.',
    features: [
      'Unlimited seats',
      'API access & integrations',
      'SSO & advanced security',
      'Custom workflows and approvals',
      'Dedicated customer success manager',
      'SLA guarantees',
      'Custom contract terms',
      'On-site onboarding available',
    ],
    missing: [],
    cta: 'Talk to Sales',
    ctaHref: 'mailto:info@crewdeskapp.com?subject=Enterprise Enquiry',
    highlight: false,
    badge: null,
  },
]

const FAQ = [
  { q: 'Can I switch plans at any time?', a: 'Yes. You can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated.' },
  { q: 'What happens after my free trial?', a: "After 14 days, you'll be prompted to choose a paid plan. Your data is preserved and you won't be charged until you actively select a plan." },
  { q: 'Do you offer discounts for annual billing?', a: 'Yes — annual billing saves you approximately 15% compared to monthly. The discounted price is shown when you toggle to annual view.' },
  { q: 'Is there a setup fee?', a: 'No. There are no setup fees, no hidden costs, and no contracts on Starter, Growth, or Professional plans.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit and debit cards via Stripe. Enterprise customers can also pay by invoice.' },
  { q: 'Can I add more seats to my plan?', a: 'Yes. Additional seats can be added from your billing settings. Enterprise plans include unlimited seats.' },
]

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#04080F] text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#04080F]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-black fill-black" />
            </div>
            <span className="font-bold text-lg tracking-tight">CrewDesk</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">Sign in</Link>
            <Link href="/signup" className="text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-lg transition-colors">
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto mb-8">
            Start free for 14 days. No credit card required. Cancel any time.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-xl" style={{ background: '#0A1020' }}>
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${!annual ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${annual ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'}`}
            >
              Annual
              <span className="ml-1.5 text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">Save 15%</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Plans Grid */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BUSINESS_PLANS.map((plan, i) => {
            const Icon = plan.icon
            const price = annual ? plan.annualPrice : plan.monthlyPrice
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`relative rounded-2xl border p-6 flex flex-col ${
                  plan.highlight
                    ? 'border-amber-500/50 shadow-lg shadow-amber-500/10'
                    : 'border-white/5'
                }`}
                style={{ background: plan.highlight ? '#0F1A2E' : '#0A1020' }}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                    {plan.badge}
                  </div>
                )}

                <div className={`w-10 h-10 rounded-xl ${plan.iconBg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${plan.color}`} />
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{plan.desc}</p>

                <div className="mb-6">
                  {price !== null ? (
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-bold text-white">£{price}</span>
                      <span className="text-slate-500 text-sm mb-1">/mo</span>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-white">Custom</div>
                  )}
                  {annual && price !== null && (
                    <p className="text-xs text-emerald-400 mt-0.5">Billed annually</p>
                  )}
                </div>

                <Link
                  href={plan.ctaHref}
                  className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm transition-all mb-6 ${
                    plan.highlight
                      ? 'bg-amber-500 hover:bg-amber-400 text-black'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex-1 space-y-2">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span className="text-xs text-slate-300">{f}</span>
                    </div>
                  ))}
                  {plan.missing.map((f) => (
                    <div key={f} className="flex items-start gap-2 opacity-40">
                      <X className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                      <span className="text-xs text-slate-500">{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently asked questions</h2>
          <div className="space-y-2">
            {FAQ.map((item, i) => (
              <div key={i} className="rounded-xl border border-white/5 overflow-hidden" style={{ background: '#0A1020' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-white">{item.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-slate-400">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="pb-20 px-6 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to get started?</h2>
          <p className="text-slate-400 mb-6">Join businesses managing their freelance workforce with CrewDesk.</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Start your free trial
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-slate-500 mt-3">14-day free trial. No credit card required.</p>
        </div>
      </section>
    </div>
  )
    }
