'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { Zap, Users, FolderKanban, Receipt, FileText, MessageSquare, ArrowRight, CheckCircle, Star, Smartphone, Apple, Play, Shield } from 'lucide-react';

const FEATURES = [
  { icon: FolderKanban, title: 'Project Command Centre', desc: 'Track budgets, deadlines, and progress across every project in one unified view.', color: 'amber' },
  { icon: Users, title: 'Crew Intelligence', desc: 'Manage freelancers with rate tracking, ratings, availability, and contract status.', color: 'blue' },
  { icon: Receipt, title: 'Instant Invoicing', desc: 'Generate branded PDFs, track payments, and get paid faster with automated reminders.', color: 'green' },
  { icon: FileText, title: 'Contract Pipeline', desc: 'From draft to signed in minutes. Track every contract stage with visual status tracking.', color: 'purple' },
  { icon: MessageSquare, title: 'Team Messaging', desc: 'Real-time threads with your entire crew. No external tools needed.', color: 'rose' },
  { icon: Shield, title: 'Enterprise Security', desc: 'Bank-grade encryption, SSO, role-based access, and audit logs. Trusted by top agencies.', color: 'indigo' },
];

const COLOR_MAP: Record<string, string> = {
  amber: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  green: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  rose: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  indigo: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
};

const TESTIMONIALS = [
  { name: 'Sarah Mitchell', role: 'Creative Director', text: 'CrewDesk cut our admin time by 70%. Our whole operation runs through it now.', rating: 5 },
  { name: 'James Okafor', role: 'Founder & Managing Director', text: 'Finally, a tool built for agencies that actually work with freelancers. Game changer.', rating: 5 },
  { name: 'Priya Sharma', role: 'Head of Production', text: 'The invoice and contract management alone is worth every penny.', rating: 5 },
];

const NAV_ITEMS = [
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Mobile App', href: '/mobile-app' },
];

export default function LandingPage() {
  const featuresRef = useRef(null);
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
            {NAV_ITEMS.map(item => (
              <Link key={item.label} href={item.href} className="text-sm text-slate-400 hover:text-white transition-colors">{item.label}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5">Sign in</Link>
            <Link href="/signup" className="text-sm font-semibold bg-amber-400 hover:bg-amber-300 text-black px-4 py-2 rounded-lg transition-colors">Start free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-medium mb-6">
            <Zap className="w-3 h-3" />
            Built for production companies and creative agencies
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            The operating system<br />
            <span className="text-amber-400">for your freelance</span><br />
            workforce
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Manage projects, contracts, invoices, and your entire crew from a single platform. Built for ambitious agencies and production companies.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-semibold px-8 py-3.5 rounded-xl transition-colors text-base">
              Start free trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/pricing" className="flex items-center gap-2 text-slate-400 hover:text-white border border-white/10 hover:border-white/20 px-8 py-3.5 rounded-xl transition-colors text-base">
              View pricing
            </Link>
          </div>
          <p className="text-sm text-slate-600 mt-4">14-day free trial. No credit card required.</p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6" ref={featuresRef}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything your crew operation needs</h2>
            <p className="text-slate-400 max-w-xl mx-auto">One platform to replace the scattered tools slowing your team down.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              const colors = COLOR_MAP[feature.color];
              return (
                <div key={feature.title} className="rounded-2xl border border-white/5 p-6" style={{ background: '#0A1020' }}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border ${colors}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6" style={{ background: '#020608' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Trusted by production teams</h2>
            <p className="text-slate-400">Hear from the teams running their operations on CrewDesk.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-2xl border border-white/5 p-6" style={{ background: '#0A1020' }}>
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-4 text-slate-400">
            <Smartphone className="w-5 h-5" />
            <span className="text-sm font-medium">Available on iOS &amp; Android</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Your crew, in your pocket</h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8">
            Approve timesheets, review invoices, and message your crew from anywhere. Full functionality on mobile.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/mobile-app" className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-3 rounded-xl transition-colors">
              <Apple className="w-5 h-5 text-white" />
              <div className="text-left">
                <p className="text-xs text-slate-400">Download on the</p>
                <p className="text-sm font-semibold text-white">App Store</p>
              </div>
            </Link>
            <Link href="/mobile-app" className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-3 rounded-xl transition-colors">
              <Play className="w-5 h-5 text-white fill-white" />
              <div className="text-left">
                <p className="text-xs text-slate-400">Get it on</p>
                <p className="text-sm font-semibold text-white">Google Play</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="rounded-2xl border border-amber-500/20 p-12" style={{ background: '#0A1020' }}>
            <CheckCircle className="w-10 h-10 text-amber-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-3">Ready to take control?</h2>
            <p className="text-slate-400 mb-8">
              Join production teams and agencies managing their freelance workforce with CrewDesk.
            </p>
            <Link href="/signup" className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-semibold px-8 py-3.5 rounded-xl transition-colors">
              Start your free trial <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-slate-600 mt-4">14-day free trial. No credit card required.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-400 flex items-center justify-center">
              <Zap className="w-3 h-3 text-black fill-black" />
            </div>
            <span className="font-semibold text-sm">CrewDesk</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/mobile-app" className="hover:text-white transition-colors">Mobile App</Link>
            <a href="mailto:info@crewdeskapp.com" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-xs text-slate-600">&copy; 2026 CrewDesk. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
      }
