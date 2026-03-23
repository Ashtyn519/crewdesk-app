'use client';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { Zap, Users, FolderKanban, Receipt, FileText, MessageSquare, ArrowRight, CheckCircle, Star, Smartphone, Apple, Play, TrendingUp, Shield, Globe } from 'lucide-react';

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

const STATS = [
  { value: '12,000+', label: 'Freelancers Managed' },
  { value: '48M+', label: 'Invoices Processed' },
  { value: '2,800+', label: 'Teams Using CrewDesk' },
  { value: '99.9%', label: 'Uptime SLA' },
  ];

const TESTIMONIALS = [
  { name: 'Sarah Mitchell', role: 'Creative Director, StudioHive', text: 'CrewDesk cut our admin time by 70%. Our whole operation runs through it now.', rating: 5 },
  { name: 'James Okafor', role: 'Founder, PixelForge', text: 'Finally, a tool built for agencies that actually work with freelancers. Game changer.', rating: 5 },
  { name: 'Priya Sharma', role: 'Head of Production, MediaLab', text: 'The invoice and contract management alone is worth every penny.', rating: 5 },
  ];

const NAV_ITEMS = [
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Mobile App', href: '/mobile-app' },
  { label: 'Blog', href: '#' },
  ];

function CountUp({ to, duration = 2000 }: { to: number; duration?: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });
    useEffect(() => {
          if (!inView) return;
          let start = 0;
          const step = (to / duration) * 16;
          const timer = setInterval(() => {
                  start += step;
                  if (start >= to) {
                            setCount(to);
                            clearInterval(timer);
                  } else setCount(Math.floor(start));
          }, 16);
          return () => clearInterval(timer);
    }, [inView, to, duration]);
    return <span ref={ref}>{count.toLocaleString()}</span>span>;
}

export default function LandingPage() {
    const featuresRef = useRef(null);
    const featuresInView = useInView(featuresRef, { once: true, margin: '-100px' });

  return (
        <div className="min-h-screen bg-[#04080F] text-white overflow-x-hidden">
          {/* Nav */}
              <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#04080F]/80 backdrop-blur-xl">
                      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center">
                                                          <Zap className="w-3.5 h-3.5 text-black fill-black" />
                                            </div>div>
                                            <span className="font-bold text-lg tracking-tight">CrewDesk</span>span>
                                </div>div>
                                <div className="hidden md:flex items-center gap-8">
                                  {NAV_ITEMS.map(item => (
                        <Link key={item.label} href={item.href} className="text-sm text-slate-400 hover:text-white transition-colors">{item.label}</Link>Link>
                      ))}
                                </div>div>
                                <div className="flex items-center gap-3">
                                            <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5">Sign in</Link>Link>
                                            <Link href="/signup" className="text-sm font-semibold bg-amber-400 text-black px-4 py-2 rounded-lg hover:bg-amber-300 transition-colors">
                                                          Start free
                                            </Link>Link>
                                </div>div>
                      </div>div>
              </nav>nav>
        
          {/* Hero */}
              <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
                      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-400/5 blur-3xl pointer-events-none" />
                      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
                      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                                <motion.div
                                              initial={{ opacity: 0, y: 20 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              transition={{ duration: 0.5 }}
                                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 mb-8"
                                            >
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Now available on iOS & Android</span>span>
                                </motion.div>motion.div>
                                <motion.h1
                                              initial={{ opacity: 0, y: 30 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              transition={{ duration: 0.6, delay: 0.1 }}
                                              className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6"
                                            >
                                            The operating system <br />
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                                                          for your freelance workforce
                                            </span>span>
                                </motion.h1>motion.h1>
                                <motion.p
                                              initial={{ opacity: 0, y: 20 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              transition={{ duration: 0.5, delay: 0.2 }}
                                              className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                                            >
                                            Manage projects, crew, invoices, and contracts in one place. Built for agencies and studios that run on freelance talent.
                                </motion.p>motion.p>
                                <motion.div
                                              initial={{ opacity: 0, y: 20 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              transition={{ duration: 0.5, delay: 0.3 }}
                                              className="flex flex-col sm:flex-row gap-4 justify-center"
                                            >
                                            <Link href="/signup">
                                                          <motion.button
                                                                            whileHover={{ scale: 1.03 }}
                                                                            whileTap={{ scale: 0.97 }}
                                                                            className="flex items-center gap-2 px-8 py-4 bg-amber-400 text-black font-bold text-base rounded-xl hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20"
                                                                          >
                                                                          Start for free <ArrowRight className="w-4 h-4" />
                                                          </motion.button>motion.button>
                                            </Link>Link>
                                            <Link href="/login">
                                                          <motion.button
                                                                            whileHover={{ scale: 1.02 }}
                                                                            className="flex items-center gap-2 px-8 py-4 bg-white/5 text-white font-semibold text-base rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                                                                          >
                                                                          View demo
                                                          </motion.button>motion.button>
                                            </Link>Link>
                                </motion.div>motion.div>
                                <motion.div
                                              initial={{ opacity: 0 }}
                                              animate={{ opacity: 1 }}
                                              transition={{ delay: 0.5 }}
                                              className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500"
                                            >
                                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                                            Free forever plan · No credit card required · Cancel anytime
                                </motion.div>motion.div>
                      </div>div>
              </section>section>
        
          {/* Stats */}
              <section className="py-20 border-y border-[#1A2540]">
                      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
                        {STATS.map((s, i) => (
                      <motion.div
                                      key={s.label}
                                      initial={{ opacity: 0, y: 20 }}
                                      whileInView={{ opacity: 1, y: 0 }}
                                      viewport={{ once: true }}
                                      transition={{ delay: i * 0.1 }}
                                      className="text-center"
                                    >
                                    <div className="text-3xl md:text-4xl font-black text-amber-400 mb-2">{s.value}</div>div>
                                    <div className="text-sm text-slate-500">{s.label}</div>div>
                      </motion.div>motion.div>
                    ))}
                      </div>div>
              </section>section>
        
          {/* Features */}
              <section ref={featuresRef} className="py-24 px-6">
                      <div className="max-w-6xl mx-auto">
                                <div className="text-center mb-16">
                                            <motion.p
                                                            initial={{ opacity: 0 }}
                                                            whileInView={{ opacity: 1 }}
                                                            viewport={{ once: true }}
                                                            className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3"
                                                          >Everything you need</motion.p>motion.p>
                                            <motion.h2
                                                            initial={{ opacity: 0, y: 20 }}
                                                            whileInView={{ opacity: 1, y: 0 }}
                                                            viewport={{ once: true }}
                                                            className="text-4xl md:text-5xl font-black tracking-tight mb-4"
                                                          >One platform. Total control.</motion.h2>motion.h2>
                                            <motion.p
                                                            initial={{ opacity: 0 }}
                                                            whileInView={{ opacity: 1 }}
                                                            viewport={{ once: true }}
                                                            className="text-slate-400 text-lg max-w-2xl mx-auto"
                                                          >Stop juggling spreadsheets, emails, and invoicing tools. CrewDesk brings it all under one roof.</motion.p>motion.p>
                                </div>div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                  {FEATURES.map((f, i) => {
                        const colors = COLOR_MAP[f.color];
                        const [c, bg, border] = colors.split(' ');
                        return (
                                          <motion.div
                                                              key={f.title}
                                                              initial={{ opacity: 0, y: 30 }}
                                                              whileInView={{ opacity: 1, y: 0 }}
                                                              viewport={{ once: true }}
                                                              transition={{ delay: i * 0.07 }}
                                                              whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                                              className="group p-6 rounded-2xl bg-[#0A1020] border border-[#1A2540] hover:border-[#243050] transition-all duration-200 cursor-pointer"
                                                            >
                                                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${bg} border ${border}`}>
                                                                                <f.icon className={`w-5 h-5 ${c}`} />
                                                            </div>div>
                                                            <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>h3>
                                                            <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>p>
                                          </motion.div>motion.div>
                                        );
        })}
                                </div>div>
                      </div>div>
              </section>section>
        
          {/* Mobile App Section */}
              <section className="py-24 px-6 bg-[#040A16] border-y border-[#1A2540]">
                      <div className="max-w-6xl mx-auto">
                                <div className="grid md:grid-cols-2 gap-16 items-center">
                                            <motion.div
                                                            initial={{ opacity: 0, x: -30 }}
                                                            whileInView={{ opacity: 1, x: 0 }}
                                                            viewport={{ once: true }}
                                                          >
                                                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                                                                          <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                                                                          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">iOS & Android</span>span>
                                                          </div>div>
                                                          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                                                                          Your workforce in <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">your pocket</span>span>
                                                          </h2>h2>
                                                          <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                                                          The full power of CrewDesk, optimised for mobile. Review projects, approve invoices, message your crew, and track contracts anywhere, anytime.
                                                          </p>p>
                                                          <div className="space-y-3 mb-10">
                                                            {[
                                                                              'Real-time notifications and updates',
                                                                              'Full invoice and payment management',
                                                                              'Crew availability at a glance',
                                                                              'Offline-ready with smart sync',
                                                                            ].map(item => (
                                                                                                <div key={item} className="flex items-center gap-3">
                                                                                                                    <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                                                                                                    <span className="text-sm text-slate-300">{item}</span>span>
                                                                                                  </div>div>
                                                                                              ))}
                                                          </div>div>
                                                          <div className="flex flex-wrap gap-3">
                                                                          <Link href="/mobile-app">
                                                                                            <motion.button
                                                                                                                  whileHover={{ scale: 1.03 }}
                                                                                                                  whileTap={{ scale: 0.97 }}
                                                                                                                  className="flex items-center gap-2 px-5 py-3 bg-white text-black font-bold text-sm rounded-xl hover:bg-slate-100 transition-colors"
                                                                                                                >
                                                                                                                <Apple className="w-4 h-4" />
                                                                                                                App Store
                                                                                              </motion.button>motion.button>
                                                                          </Link>Link>
                                                                          <Link href="/mobile-app">
                                                                                            <motion.button
                                                                                                                  whileHover={{ scale: 1.03 }}
                                                                                                                  className="flex items-center gap-2 px-5 py-3 bg-[#0A1020] text-white font-semibold text-sm rounded-xl border border-[#1A2540] hover:border-[#243050] transition-colors"
                                                                                                                >
                                                                                                                <Play className="w-4 h-4" />
                                                                                                                Google Play
                                                                                              </motion.button>motion.button>
                                                                          </Link>Link>
                                                          </div>div>
                                            </motion.div>motion.div>
                                            <motion.div
                                                            initial={{ opacity: 0, x: 30 }}
                                                            whileInView={{ opacity: 1, x: 0 }}
                                                            viewport={{ once: true }}
                                                            className="relative"
                                                          >
                                                          <div className="relative mx-auto w-64 h-[500px] rounded-[40px] bg-[#0A1020] border-2 border-[#1A2540] p-3 shadow-2xl shadow-blue-500/10">
                                                                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#060C18] rounded-b-2xl" />
                                                                          <div className="w-full h-full rounded-[32px] bg-[#04080F] overflow-hidden p-4 pt-8">
                                                                                            <div className="text-[10px] text-slate-500 mb-3">Dashboard</div>div>
                                                                                            <div className="text-sm font-bold text-white mb-4">Good morning</div>div>
                                                                                            <div className="grid grid-cols-2 gap-2 mb-4">
                                                                                              {[
                                                            { label: 'Projects', v: '12', c: 'amber' },
                                                            { label: 'Crew', v: '28', c: 'blue' },
                                                            { label: 'Invoices', v: '5', c: 'yellow' },
                                                            { label: 'Earned', v: '48k', c: 'green' },
                                                                                ].map(s => (
                                                                                                        <div key={s.label} className="bg-[#0A1020] rounded-xl p-2.5 border border-[#1A2540]">
                                                                                                                                <div className={`text-base font-black mb-0.5 ${s.c === 'amber' ? 'text-amber-400' : s.c === 'blue' ? 'text-blue-400' : s.c === 'green' ? 'text-emerald-400' : 'text-yellow-400'}`}>{s.v}</div>div>
                                                                                                                                <div className="text-[9px] text-slate-500">{s.label}</div>div>
                                                                                                          </div>div>
                                                                                                      ))}
                                                                                              </div>div>
                                                                                            <div className="text-[10px] text-slate-500 mb-2">Active Projects</div>div>
                                                                            {['Brand Refresh', 'App Prototype', 'Marketing'].map((p, i) => (
                                                                                <div key={p} className="flex items-center gap-2 mb-2">
                                                                                                      <div className="text-[9px] text-slate-300 flex-1 truncate">{p}</div>div>
                                                                                                      <div className="w-16 h-1 bg-[#1A2540] rounded-full overflow-hidden">
                                                                                                                              <div className="h-full bg-amber-400 rounded-full" style={{ width: [72, 45, 88][i] + '%' }} />
                                                                                                        </div>div>
                                                                                  </div>div>
                                                                              ))}
                                                                          </div>div>
                                                                          <div className="absolute inset-0 rounded-[40px] bg-blue-500/10 blur-2xl -z-10" />
                                                          </div>div>
                                            </motion.div>motion.div>
                                </div>div>
                      </div>div>
              </section>section>
        
          {/* Testimonials */}
              <section className="py-24 px-6">
                      <div className="max-w-6xl mx-auto">
                                <div className="text-center mb-16">
                                            <h2 className="text-4xl font-black tracking-tight mb-3">Loved by creative teams</h2>h2>
                                            <p className="text-slate-400">Join thousands of studios running their workforce on CrewDesk</p>p>
                                </div>div>
                                <div className="grid md:grid-cols-3 gap-6">
                                  {TESTIMONIALS.map((t, i) => (
                        <motion.div
                                          key={t.name}
                                          initial={{ opacity: 0, y: 20 }}
                                          whileInView={{ opacity: 1, y: 0 }}
                                          viewport={{ once: true }}
                                          transition={{ delay: i * 0.1 }}
                                          className="p-6 rounded-2xl bg-[#0A1020] border border-[#1A2540]"
                                        >
                                        <div className="flex mb-3">
                                          {[...Array(t.rating)].map((_, j) => (
                                                              <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                            ))}
                                        </div>div>
                                        <p className="text-slate-300 text-sm leading-relaxed mb-4">{t.text}</p>p>
                                        <div>
                                                          <p className="text-sm font-semibold text-white">{t.name}</p>p>
                                                          <p className="text-xs text-slate-500">{t.role}</p>p>
                                        </div>div>
                        </motion.div>motion.div>
                      ))}
                                </div>div>
                      </div>div>
              </section>section>
        
          {/* CTA */}
              <section className="py-24 px-6">
                      <div className="max-w-4xl mx-auto text-center">
                                <motion.div
                                              initial={{ opacity: 0, scale: 0.95 }}
                                              whileInView={{ opacity: 1, scale: 1 }}
                                              viewport={{ once: true }}
                                              className="p-12 rounded-3xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 border border-amber-400/20 relative overflow-hidden"
                                            >
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
                                            <div className="relative z-10">
                                                          <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-400/30">
                                                                          <Zap className="w-6 h-6 text-black fill-black" />
                                                          </div>div>
                                                          <h2 className="text-4xl font-black tracking-tight mb-4">Ready to take control?</h2>h2>
                                                          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                                                                          Start managing your freelance workforce like a world-class operation. Free forever, upgrade when you are ready.
                                                          </p>p>
                                                          <Link href="/signup">
                                                                          <motion.button
                                                                                              whileHover={{ scale: 1.03 }}
                                                                                              whileTap={{ scale: 0.97 }}
                                                                                              className="inline-flex items-center gap-2 px-8 py-4 bg-amber-400 text-black font-bold text-base rounded-xl hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20"
                                                                                            >
                                                                                            Start free today <ArrowRight className="w-4 h-4" />
                                                                          </motion.button>motion.button>
                                                          </Link>Link>
                                            </div>div>
                                </motion.div>motion.div>
                      </div>div>
              </section>section>
        
          {/* Footer */}
              <footer className="border-t border-[#1A2540] py-10 px-6">
                      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-lg bg-amber-400 flex items-center justify-center">
                                                          <Zap className="w-3 h-3 text-black fill-black" />
                                            </div>div>
                                            <span className="font-bold text-sm">CrewDesk</span>span>
                                            <span className="text-slate-600 text-sm ml-2">2026. All rights reserved.</span>span>
                                </div>div>
                                <div className="flex items-center gap-6">
                                  {['Privacy', 'Terms', 'Security', 'Status'].map(l => (
                        <a key={l} href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">{l}</a>a>
                      ))}
                                </div>div>
                      </div>div>
              </footer>footer>
        </div>div>
      );
}</div>
