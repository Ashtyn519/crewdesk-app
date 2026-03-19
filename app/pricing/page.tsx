'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function PricingPage() {
  const [annual, setAnnual] = useState(true)

  const plans = [
    {
      name: 'Free',
      price: 0,
      annualPrice: 0,
      desc: 'For freelancers just getting started',
      features: ['2 crew members', '5 active projects', '10 invoices/mo', 'Basic contracts', 'Mobile app access', 'Email support'],
      cta: 'Get started free',
      ctaHref: '/signup',
      highlight: false,
      badge: null,
    },
    {
      name: 'Pro',
      price: 35,
      annualPrice: 29,
      desc: 'For growing production teams',
      features: ['Unlimited crew', 'Unlimited projects', 'Unlimited invoices', 'Advanced contracts + e-sign', 'PDF invoice generation', 'Priority support', 'Revenue analytics', 'Custom branding'],
      cta: 'Start Pro trial',
      ctaHref: '/signup',
      highlight: true,
      badge: 'Most Popular',
    },
    {
      name: 'Enterprise',
      price: null,
      annualPrice: null,
      desc: 'For large studios & agencies',
      features: ['Everything in Pro', 'White-label platform', 'SSO / SAML', 'Dedicated account manager', 'SLA guarantee', 'Custom integrations', 'On-premise option', 'Training & onboarding'],
      cta: 'Contact sales',
      ctaHref: 'mailto:sales@crewdesk.app',
      highlight: false,
      badge: null,
    },
  ]

  const faqs = [
    { q: 'Can I change plans at any time?', a: 'Yes. You can upgrade, downgrade, or cancel at any time. Upgrades take effect immediately; downgrades at next billing cycle.' },
    { q: 'Is there a free trial for Pro?', a: '14-day free trial on Pro, no credit card required. You get full access to every feature.' },
    { q: 'How does the crew member limit work?', a: 'A crew member is any user you invite to your workspace. On Free, you can have 2 active crew members at once.' },
    { q: 'Do you support teams in different currencies?', a: 'Yes. CrewDesk supports GBP, USD, EUR and other currencies. Set your workspace currency in Settings.' },
    { q: 'Can I export my data if I cancel?', a: 'Absolutely. Export all your projects, invoices, contracts and crew data at any time in CSV or PDF format.' },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#04080F' }}>
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 backdrop-blur-xl" style={{ background: 'rgba(4,8,15,0.9)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-6">
          <Link href="/" className="text-lg font-bold text-white">Crew<span className="text-amber-400">Desk</span></Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">Home</Link>
            <Link href="/pricing" className="text-sm text-amber-400 font-medium">Pricing</Link>
            <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">Sign In</Link>
            <Link href="/signup" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm px-4 py-2 rounded-xl transition-all">Get Started</Link>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-24 px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold px-4 py-2 rounded-full mb-6">
            Simple, transparent pricing
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Pay for what you <span className="text-amber-400">actually need</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            No hidden fees. No per-seat pricing tricks. Just one straightforward plan that scales with your crew.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-sm ${!annual ? 'text-white font-medium' : 'text-slate-500'}`}>Monthly</span>
            <button onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-all ${annual ? 'bg-amber-500' : 'bg-white/10'}`}>
              <motion.div animate={{ x: annual ? 24 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow" />
            </button>
            <span className={`text-sm ${annual ? 'text-white font-medium' : 'text-slate-500'}`}>Annual</span>
            <span className="text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full font-medium">Save 17%</span>
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6 mb-20">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 border flex flex-col ${plan.highlight
                ? 'border-amber-500/40 bg-gradient-to-b from-amber-500/8 to-transparent'
                : 'border-white/5'
              }`}
              style={{ background: plan.highlight ? undefined : '#0A1020' }}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-xs font-bold px-4 py-1.5 rounded-full">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{plan.name}</p>
                <div className="flex items-end gap-1 mb-2">
                  {plan.price === null ? (
                    <p className="text-4xl font-bold text-white">Custom</p>
                  ) : plan.price === 0 ? (
                    <p className="text-4xl font-bold text-white">Free</p>
                  ) : (
                    <>
                      <p className="text-4xl font-bold text-white">
                        £{annual ? plan.annualPrice : plan.price}
                      </p>
                      <p className="text-slate-400 mb-2 text-sm">/month</p>
                    </>
                  )}
                </div>
                {annual && plan.annualPrice && plan.price && (
                  <p className="text-xs text-emerald-400">billed annually (save £{(plan.price - plan.annualPrice) * 12}/yr)</p>
                )}
                <p className="text-sm text-slate-400 mt-2">{plan.desc}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 text-sm">✓</span>
                    <span className="text-sm text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.ctaHref}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                    plan.highlight
                      ? 'bg-amber-500 hover:bg-amber-400 text-black'
                      : 'bg-white/8 hover:bg-white/12 text-white border border-white/10'
                  }`}
                >
                  {plan.cta}
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Compare Table */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Compare plans</h2>
          <div className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: '#0A1020' }}>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Feature</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-400">Free</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-amber-400">Pro</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-400">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Crew members', '2', 'Unlimited', 'Unlimited'],
                  ['Projects', '5', 'Unlimited', 'Unlimited'],
                  ['Invoices/month', '10', 'Unlimited', 'Unlimited'],
                  ['PDF generation', '—', '✓', '✓'],
                  ['E-sign contracts', '—', '✓', '✓'],
                  ['Revenue analytics', '—', '✓', '✓'],
                  ['Custom branding', '—', '—', '✓'],
                  ['SSO / SAML', '—', '—', '✓'],
                  ['Dedicated support', '—', '—', '✓'],
                ].map(([f, free, pro, ent], i) => (
                  <tr key={f} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/2' : ''}`}>
                    <td className="px-6 py-3.5 text-sm text-slate-300">{f}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-400 text-center">{free}</td>
                    <td className="px-6 py-3.5 text-sm text-amber-400 text-center font-medium">{pro}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-400 text-center">{ent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently asked questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} delay={i * 0.05} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="max-w-xl mx-auto text-center mt-20 p-10 rounded-2xl border border-amber-500/20"
          style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(4,8,15,0.8) 100%)' }}>
          <h2 className="text-3xl font-bold text-white mb-3">Start free today</h2>
          <p className="text-slate-400 mb-6">No credit card required. 14-day Pro trial included.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/signup">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-3 rounded-xl transition-all">
                Get started free
              </motion.button>
            </Link>
            <Link href="/login">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="bg-white/8 hover:bg-white/12 text-white font-semibold px-8 py-3 rounded-xl border border-white/10 transition-all">
                Sign in
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function FAQItem({ q, a, delay }: { q: string; a: string; delay: number }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="rounded-xl border border-white/5 overflow-hidden" style={{ background: '#0A1020' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left">
        <span className="text-sm font-semibold text-white">{q}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} className="text-amber-400 text-lg ml-4">+</motion.span>
      </button>
      {open && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-5 pb-4">
          <p className="text-sm text-slate-400 leading-relaxed">{a}</p>
        </motion.div>
      )}
    </motion.div>
  )
}
