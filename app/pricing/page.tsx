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
        desc: 'Best for established businesses managing larger crews.',
        features: [
                'Up to 50 user seats',
                'Everything in Growth',
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
  { q: 'What happens after my free trial?', a: 'After 14 days, you\'ll be prompted to choose a paid plan. Your data is preserved and you won\'t be charged until you actively select a plan.' },
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
                                            </div>div>
                                            <span className="font-bold text-lg tracking-tight">CrewDesk</span>span>
                                </Link>Link>
                                <div className="flex items-center gap-3">
                                            <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5">Sign in</Link>Link>
                                            <Link href="/signup" className="text-sm font-semibold bg-amber-400 text-black px-4 py-2 rounded-lg hover:bg-amber-300 transition-colors">Start free</Link>Link>
                                </div>div>
                      </div>div>
              </nav>nav>
        
              <div className="pt-32 pb-24 px-6">
                      <div className="max-w-7xl mx-auto">
                        {/* Header */}
                                <div className="text-center mb-12">
                                            <motion.p
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3"
                                                          >
                                                          Transparent pricing
                                            </motion.p>motion.p>
                                            <motion.h1
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 0.1 }}
                                                            className="text-5xl font-black tracking-tight mb-4"
                                                          >
                                                          Simple, honest pricing
                                            </motion.h1>motion.h1>
                                            <motion.p
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: 0.2 }}
                                                            className="text-slate-400 text-lg max-w-xl mx-auto mb-8"
                                                          >
                                                          14-day free trial on all paid plans. No credit card required.
                                            </motion.p>motion.p>
                                
                                  {/* Billing toggle */}
                                            <div className="inline-flex items-center gap-3 bg-white/5 p-1.5 rounded-full border border-white/10">
                                                          <button
                                                                            onClick={() => setAnnual(false)}
                                                                            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${!annual ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}
                                                                          >
                                                                          Monthly
                                                          </button>button>
                                                          <button
                                                                            onClick={() => setAnnual(true)}
                                                                            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${annual ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}
                                                                          >
                                                                          Annual
                                                                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full">Save 15%</span>span>
                                                          </button>button>
                                            </div>div>
                                </div>div>
                      
                        {/* Plans grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
                                  {BUSINESS_PLANS.map((plan, i) => {
                        const Icon = plan.icon
                                        const price = annual ? plan.annualPrice : plan.monthlyPrice
                                                        return (
                                                                          <motion.div
                                                                                              key={plan.name}
                                                                                              initial={{ opacity: 0, y: 30 }}
                                                                                              animate={{ opacity: 1, y: 0 }}
                                                                                              transition={{ delay: i * 0.08 }}
                                                                                              className={`relative rounded-2xl p-6 flex flex-col ${
                                                                                                                    plan.highlight
                                                                                                                      ? 'bg-amber-400/5 border-2 border-amber-400/40'
                                                                                                                      : 'bg-[#0A1020] border border-[#1A2540]'
                                                                                                }`}
                                                                                            >
                                                                            {plan.badge && (
                                                                                                                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-[10px] font-black px-3 py-1 rounded-full tracking-wide uppercase">
                                                                                                                    {plan.badge}
                                                                                                                    </div>div>
                                                                                            )}
                                                                                            <div className={`w-10 h-10 rounded-xl ${plan.iconBg} flex items-center justify-center mb-4`}>
                                                                                                                <Icon className={`w-5 h-5 ${plan.color}`} />
                                                                                              </div>div>
                                                                                            <h2 className="text-lg font-black text-white mb-1">{plan.name}</h2>h2>
                                                                                            <p className="text-xs text-slate-500 mb-4 leading-relaxed">{plan.desc}</p>p>
                                                                                            <div className="mb-6">
                                                                                              {price !== null ? (
                                                                                                                    <>
                                                                                                                                            <span className="text-4xl font-black text-white">£{price}</span>span>
                                                                                                                                            <span className="text-slate-500 text-sm ml-1">/mo</span>span>
                                                                                                                      {annual && <p className="text-xs text-slate-500 mt-0.5">Billed annually</p>p>}
                                                                                                                      </>>
                                                                                                                  ) : (
                                                                                                                    <span className="text-2xl font-black text-white">Custom</span>span>
                                                                                                                )}
                                                                                              </div>div>
                                                                            {plan.ctaHref.startsWith('mailto:') ? (
                                                                                                                  <a
                                                                                                                                          href={plan.ctaHref}
                                                                                                                                          className={`w-full py-2.5 rounded-xl font-bold text-sm transition-colors text-center mb-6 flex items-center justify-center gap-2 ${
                                                                                                                                                                    plan.highlight
                                                                                                                                                                      ? 'bg-amber-400 text-black hover:bg-amber-300'
                                                                                                                                                                      : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                                                                                                                                            }`}
                                                                                                                                        >
                                                                                                                    {plan.cta}
                                                                                                                                        <ArrowRight className="w-3.5 h-3.5" />
                                                                                                                    </a>a>
                                                                                                                ) : (
                                                                                                                  <Link
                                                                                                                                          href={plan.ctaHref}
                                                                                                                                          className={`w-full py-2.5 rounded-xl font-bold text-sm transition-colors text-center mb-6 flex items-center justify-center gap-2 ${
                                                                                                                                                                    plan.highlight
                                                                                                                                                                      ? 'bg-amber-400 text-black hover:bg-amber-300'
                                                                                                                                                                      : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                                                                                                                                            }`}
                                                                                                                                        >
                                                                                                                    {plan.cta}
                                                                                                                                        <ArrowRight className="w-3.5 h-3.5" />
                                                                                                                    </Link>Link>
                                                                                            )}
                                                                                            <div className="space-y-2 flex-1">
                                                                                              {plan.features.map(f => (
                                                                                                                    <div key={f} className="flex items-start gap-2">
                                                                                                                                            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                                                                                                                            <span className="text-xs text-slate-300">{f}</span>span>
                                                                                                                      </div>div>
                                                                                                                  ))}
                                                                                              {plan.missing.map(f => (
                                                                                                                    <div key={f} className="flex items-start gap-2">
                                                                                                                                            <X className="w-3.5 h-3.5 text-slate-600 flex-shrink-0 mt-0.5" />
                                                                                                                                            <span className="text-xs text-slate-600">{f}</span>span>
                                                                                                                      </div>div>
                                                                                                                  ))}
                                                                                              </div>div>
                                                                          </motion.div>motion.div>
                                                                        )
        })}
                                </div>div>
                      
                        {/* FAQ */}
                                <div className="max-w-2xl mx-auto">
                                            <h2 className="text-2xl font-black text-white text-center mb-8">Frequently asked questions</h2>h2>
                                            <div className="space-y-2">
                                              {FAQ.map((item, i) => (
                          <div key={i} className="rounded-xl bg-[#0A1020] border border-[#1A2540] overflow-hidden">
                                            <button
                                                                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                                                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                                                                >
                                                                <span className="text-sm font-semibold text-white">{item.q}</span>span>
                                              {openFaq === i
                                                                      ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                                      : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                              }
                                            </button>button>
                            {openFaq === i && (
                                                <motion.div
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: 'auto', opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        className="px-5 pb-4"
                                                                      >
                                                                      <p className="text-sm text-slate-400 leading-relaxed">{item.a}</p>p>
                                                </motion.div>motion.div>
                                              )}
                          </div>div>
                        ))}
                                            </div>div>
                                </div>div>
                      
                        {/* CTA strip */}
                                <div className="mt-20 text-center">
                                            <p className="text-slate-400 text-sm mb-3">Still have questions?</p>p>
                                            <a
                                                            href="mailto:info@crewdeskapp.com"
                                                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors"
                                                          >
                                                          Contact us at info@crewdeskapp.com
                                                          <ArrowRight className="w-4 h-4" />
                                            </a>a>
                                </div>div>
                      </div>div>
              </div>div>
        
              <footer className="border-t border-[#1A2540] py-8 px-6">
                      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                                <Link href="/" className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-lg bg-amber-400 flex items-center justify-center">
                                                          <Zap className="w-3 h-3 text-black fill-black" />
                                            </div>div>
                                            <span className="font-bold text-sm">CrewDesk</span>span>
                                            <span className="text-slate-600 text-sm ml-1">© 2026</span>span>
                                </Link>Link>
                                <div className="flex items-center gap-6">
                                  {['Privacy', 'Terms', 'Security'].map(l => (
                        <a key={l} href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">{l}</a>a>
                      ))}
                                            <a href="mailto:info@crewdeskapp.com" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Contact</a>a>
                                </div>div>
                      </div>div>
              </footer>footer>
        </div>div>
      )
}</></div>
