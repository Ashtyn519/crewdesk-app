'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { Zap, Users, FolderKanban, Receipt, FileText, MessageSquare, ArrowRight, CheckCircle, Shield, BarChart3, Clock, Globe } from 'lucide-react';

const FEATURES = [
  { icon: Users, title: 'Freelancer Roster', desc: 'Build your vetted bench of freelancers. Track rates, ratings, skills and availability in one place.', color: 'amber' },
  { icon: FolderKanban, title: 'Project Command Centre', desc: 'Manage every brief, deadline and deliverable. Real-time status, budgets, and team assignment.', color: 'blue' },
  { icon: Receipt, title: 'Instant Invoicing', desc: 'Auto-generate branded invoices with VAT. Get paid faster. Track every payment from sent to settled.', color: 'green' },
  { icon: FileText, title: 'Contract Pipeline', desc: 'Draft, send and e-sign contracts in minutes. Never chase a signature again.', color: 'purple' },
  { icon: MessageSquare, title: 'Team Messaging', desc: 'One inbox for your whole operation. No more WhatsApp groups. Real threads, per project.', color: 'rose' },
  { icon: BarChart3, title: 'Business Analytics', desc: 'Revenue trends, utilisation rates, top freelancers and client profitability — all in one dashboard.', color: 'indigo' },
];

const COLOR_MAP: Record<string, string> = {
  amber: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  green: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  rose: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  indigo: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
};

const BUSINESS_TYPES = [
  'Creative Agencies',
  'Marketing Studios',
  'Film & TV Production',
  'Event Companies',
  'Tech Startups',
  'Consultancies',
  'Architecture Firms',
  'PR Companies',
  'Any business using freelancers',
];

const VALUE_PROPS = [
  { value: '14 days', label: 'Free trial — no card needed' },
  { value: 'One place', label: 'For hiring, contracts & invoicing' },
  { value: 'Built for', label: 'Businesses that use freelancers' },
  { value: 'Cancel', label: 'Anytime, no questions asked' },
];

export default function LandingPage() {
  const featuresRef = useRef<HTMLElement>(null);

  return (
    <div className="min-h-screen bg-[#04080F] text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#04080F]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-black fill-black" />
            </div>
            <span className="font-bold text-lg tracking-tight">CrewDesk</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm text-slate-400 hover:text-white transition-colors">Features</button>
            <Link href="/pricing" className="text-sm text-slate-400 hover:text-white transition-colors">Pricing</Link>
            <Link href="mailto:hello@crewdeskapp.com" className="text-sm text-slate-400 hover:text-white transition-colors">Contact</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5">Sign in</Link>
            <Link href="/signup" className="text-sm font-semibold bg-amber-400 hover:bg-amber-300 text-black px-4 py-2 rounded-lg transition-colors">Start free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 text-center relative">
        <div className="absolute inset-0 bg-gradient-radial from-amber-400/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/20 bg-amber-400/5 text-amber-400 text-xs font-medium mb-8">
            <Zap className="w-3 h-3" />
            The operating system for businesses that hire freelancers
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
            Run your freelance<br />
            <span className="text-amber-400">workforce</span> from<br />
            one platform.
          </h1>
          <p className="text-xl text-white/60 leading-relaxed max-w-2xl mx-auto mb-10">
            CrewDesk gives your business one home for managing freelancers — hiring, briefing, contracting, invoicing, and paying.
            For agencies, studios, and any business that works with freelancers.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/signup" className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-semibold px-6 py-3.5 rounded-xl transition-all text-base shadow-lg shadow-amber-400/20">
              Start free — no credit card <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/pricing" className="flex items-center gap-2 border border-white/10 hover:border-white/20 text-white/80 hover:text-white font-medium px-6 py-3.5 rounded-xl transition-all text-base">
              See pricing
            </Link>
          </div>
          <p className="text-slate-500 text-sm mt-5">Free 14-day trial · No setup fees · Cancel anytime</p>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {VALUE_PROPS.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-sm text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-slate-500 text-sm font-medium uppercase tracking-widest mb-4">Built for</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">Any business that works with freelancers</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {BUSINESS_TYPES.map(bt => (
              <span key={bt} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-slate-300">
                {bt}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} id="features" className="py-20 px-6 bg-white/[0.015]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">Everything in one place</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">Stop juggling tools.<br />Start shipping work.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => {
              const Icon = f.icon;
              const c = COLOR_MAP[f.color];
              return (
                <div key={f.title} className="bg-[#0A1020] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${c}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Up and running in minutes</h2>
            <p className="text-slate-500 text-lg">No lengthy setup. No consultants. No onboarding calls.</p>
          </div>
          <div className="space-y-6">
            {[
              { step: '01', title: 'Create your workspace', desc: 'Sign up, name your business, done. Your dashboard is live instantly.' },
              { step: '02', title: 'Add your freelancers', desc: 'Build your roster. Add rates, skills, and availability. Invite them by email.' },
              { step: '03', title: 'Create a project', desc: "Brief your team, set a budget, assign crew. Everyone knows what they're working on." },
              { step: '04', title: 'Invoice and get paid', desc: 'One click to generate a VAT invoice. Track payments. Export for your accountant.' },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-6 bg-[#0A1020] border border-white/5 rounded-2xl p-6">
                <div className="text-2xl font-bold text-amber-400/30 font-mono shrink-0 w-10">{s.step}</div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">{s.title}</h3>
                  <p className="text-sm text-slate-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-16 px-6 bg-white/[0.015]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Bank-grade security', desc: 'SOC2-ready infrastructure. All data encrypted at rest and in transit.' },
              { icon: Globe, title: 'GDPR compliant', desc: 'Built for UK & EU businesses. Data stored in Europe. Full DPA available.' },
              { icon: Clock, title: '99.9% uptime SLA', desc: 'Built on Supabase and Vercel infrastructure. Always on when you need it.' },
            ].map(t => {
              const Icon = t.icon;
              return (
                <div key={t.title} className="flex items-start gap-4 bg-[#0A1020] border border-white/5 rounded-2xl p-5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">{t.title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{t.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-b from-[#0F1A2E] to-[#0A1020] border border-white/10 rounded-3xl p-12">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center mx-auto mb-6">
              <Zap className="w-6 h-6 text-black fill-black" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Ready to take back your time?</h2>
            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">Replace spreadsheets, WhatsApp groups, and scattered tools with one clean platform — and start your free trial today.</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/signup" className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-semibold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-amber-400/20 text-base">
                Start your free trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="mailto:hello@crewdeskapp.com" className="text-slate-400 hover:text-white text-sm transition-colors">
                Talk to us →
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
              {['14-day free trial', 'No credit card required', 'Cancel anytime'].map(p => (
                <div key={p} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-amber-400 flex items-center justify-center">
                <Zap className="w-3 h-3 text-black fill-black" />
              </div>
              <span className="font-bold text-sm">CrewDesk</span>
              <span className="text-slate-600 text-xs ml-2">© 2026 CrewDesk. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-500">
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="mailto:hello@crewdeskapp.com" className="hover:text-white transition-colors">Contact</Link>
              <Link href="/login" className="hover:text-white transition-colors">Sign in</Link>
              <Link href="/signup" className="hover:text-white transition-colors">Sign up</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
