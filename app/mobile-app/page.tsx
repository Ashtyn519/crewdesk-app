'use client';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import { Zap, Smartphone, Apple, Play, CheckCircle, ArrowRight, LayoutDashboard, FolderKanban, Users, Receipt, FileText, MessageSquare, Star, Shield, Bell, Wifi } from 'lucide-react';

const FEATURES = [
  { icon: LayoutDashboard, title: 'Dashboard', desc: 'Real-time overview of active projects, crew status, and pending invoices at a glance.', color: 'amber' },
  { icon: FolderKanban, title: 'Projects', desc: 'Create and manage projects on the go. Track milestones, deadlines, and team progress in real time.', color: 'blue' },
  { icon: Users, title: 'Crew Management', desc: 'Add crew members, assign roles, and manage availability from your phone with ease.', color: 'purple' },
  { icon: Receipt, title: 'Invoices', desc: 'Create, send, and track invoices instantly. Get notified the moment clients view or pay.', color: 'green' },
  { icon: MessageSquare, title: 'Messages', desc: 'Stay connected with your team through built-in messaging. No third-party apps needed.', color: 'rose' },
  { icon: FileText, title: 'Contracts', desc: 'Review and manage contracts on the fly. Keep every agreement organised and accessible.', color: 'indigo' },
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
  { name: 'Sarah Mitchell', role: 'Creative Director', text: 'The mobile app is incredible. I run my whole crew from my phone now. Absolute game changer.', rating: 5 },
  { name: 'James Okafor', role: 'Founder & Managing Director', text: 'Approving invoices on the go, checking crew status between takes. Cannot imagine working without it.', rating: 5 },
  { name: 'Priya Sharma', role: 'Head of Production', text: 'Same power as the desktop, but in my pocket. The offline sync works flawlessly on set.', rating: 5 },
  ];

export default function MobileAppPage() {
    const featuresRef = useRef(null);
    return (
          <div className="min-h-screen bg-[#04080F] text-white overflow-x-hidden">
                <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#04080F]/80 backdrop-blur-xl">
                        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                                  <Link href="/" className="flex items-center gap-2.5">
                                              <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center">
                                                            <Zap className="w-3.5 h-3.5 text-black fill-black" />
                                              </div>div>
                                              <span className="font-bold text-lg tracking-tight">CrewDesk</span>span>
                                  </Link>Link>
                                  <div className="hidden md:flex items-center gap-8">
                                              <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">Features</Link>Link>
                                              <Link href="/pricing" className="text-sm text-slate-400 hover:text-white transition-colors">Pricing</Link>Link>
                                              <Link href="/mobile-app" className="text-sm text-amber-400 font-semibold">Mobile App</Link>Link>
                                              <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Blog</a>a>
                                  </div>div>
                                  <div className="flex items-center gap-3">
                                              <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5">Sign in</Link>Link>
                                              <Link href="/signup" className="text-sm font-semibold bg-amber-400 text-black px-4 py-2 rounded-lg hover:bg-amber-300 transition-colors">Start free</Link>Link>
                                  </div>div>
                        </div>div>
                </nav>nav>
          
                <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-400/5 blur-3xl pointer-events-none" />
                        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
                        <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                                  <div>
                                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 mb-8">
                                                            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                                                            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Now on iOS & Android</span>span>
                                              </motion.div>motion.div>
                                              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-5xl md:text-6xl font-black tracking-tight leading-[1.05] mb-6">
                                                            Your workforce<br />
                                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">in your pocket</span>span>
                                              </motion.h1>motion.h1>
                                              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-xl text-slate-400 mb-6 leading-relaxed">
                                                            The full power of CrewDesk, now on iOS and Android. Review projects, approve invoices, message your crew, and track contracts anywhere, anytime.
                                                </motion.p>motion.p>
                                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }} className="space-y-2.5 mb-10">
                                                {['Real-time notifications and updates','Full invoice and payment management','Crew availability at a glance','Offline-ready with smart sync'].map(item => (
                            <div key={item} className="flex items-center gap-3">
                                              <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                                              <span className="text-sm text-slate-300">{item}</span>span>
                            </div>div>
                          ))}
                                              </motion.div>motion.div>
                                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-wrap gap-3 mb-6">
                                                            <motion.a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-3 bg-white text-black px-6 py-3.5 rounded-xl font-semibold hover:bg-slate-100 transition-colors shadow-lg">
                                                                            <Apple className="w-5 h-5" />
                                                                            <div className="text-left"><div className="text-[10px] text-slate-500 leading-none">Download on the</div>div><div className="text-sm font-bold">App Store</div>div></div>div>
                                                            </motion.a>motion.a>
                                                            <motion.a href="https://play.google.com" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-3 bg-[#0A1020] text-white px-6 py-3.5 rounded-xl font-semibold border border-[#1A2540] hover:border-[#243050] transition-colors shadow-lg">
                                                                            <Play className="w-5 h-5" />
                                                                            <div className="text-left"><div className="text-[10px] text-slate-500 leading-none">Get it on</div>div><div className="text-sm font-bold">Google Play</div>div></div>div>
                                                            </motion.a>motion.a>
                                              </motion.div>motion.div>
                                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center gap-2 text-sm text-slate-500">
                                                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                            Free plan available · No credit card required
                                              </motion.div>motion.div>
                                  </div>div>
                        
                                  <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative flex justify-center">
                                              <div className="relative mx-auto w-72 h-[560px] rounded-[44px] bg-[#060C18] border-2 border-[#1A2540] p-3 shadow-2xl shadow-amber-400/5">
                                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#060C18] rounded-b-2xl z-10" />
                                                            <div className="w-full h-full rounded-[36px] bg-[#04080F] overflow-hidden">
                                                                            <div className="flex items-center justify-between px-5 pt-8 pb-2">
                                                                                              <span className="text-[10px] text-slate-400 font-medium">9:41</span>span>
                                                                                              <div className="flex items-center gap-1">
                                                                                                                  <Wifi className="w-3 h-3 text-slate-400" />
                                                                                                                  <Bell className="w-3 h-3 text-slate-400" />
                                                                                                                  <div className="w-5 h-2.5 rounded-sm border border-slate-400 relative"><div className="absolute inset-0.5 left-0.5 right-1 bg-emerald-400 rounded-sm" /></div>div>
                                                                                                </div>div>
                                                                            </div>div>
                                                                            <div className="px-4 pb-4 pt-1">
                                                                                              <div className="flex items-center justify-between mb-4">
                                                                                                                  <div className="flex items-center gap-2">
                                                                                                                                        <div className="w-6 h-6 rounded-lg bg-amber-400 flex items-center justify-center"><Zap className="w-3 h-3 text-black fill-black" /></div>div>
                                                                                                                                        <span className="text-xs font-bold text-white">CrewDesk</span>span>
                                                                                                                    </div>div>
                                                                                                                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[9px] font-bold text-black">A</div>div>
                                                                                                </div>div>
                                                                                              <p className="text-[10px] text-slate-500 mb-0.5">Dashboard</p>p>
                                                                                              <p className="text-sm font-bold text-white mb-4">Good morning</p>p>
                                                                                              <div className="grid grid-cols-2 gap-2 mb-4">
                                                                                                {[{label:'Revenue',v:'48k',color:'text-amber-400'},{label:'Projects',v:'12',color:'text-blue-400'},{label:'Crew',v:'28',color:'text-purple-400'},{label:'Invoices',v:'5',color:'text-emerald-400'}].map(s => (
                                  <div key={s.label} className="bg-[#0A1020] rounded-xl p-2.5 border border-[#1A2540]">
                                                          <div className={`text-base font-black mb-0.5 ${s.color}`}>{s.v}</div>div>
                                                          <div className="text-[9px] text-slate-500">{s.label}</div>div>
                                  </div>div>
                                ))}
                                                                                                </div>
                                                                                              <p className="text-[9px] text-slate-500 mb-2 uppercase tracking-widest">Active Projects</p>p>
                                                                              {[{name:'Brand Refresh',pct:72},{name:'App Prototype',pct:45},{name:'Marketing Push',pct:88}].map(p => (
                                <div key={p.name} className="flex items-center gap-2 mb-2">
                                                      <div className="text-[9px] text-slate-300 flex-1 truncate">{p.name}</div>div>
                                                      <div className="w-16 h-1 bg-[#1A2540] rounded-full overflow-hidden"><div className="h-full bg-amber-400 rounded-full" style={{width:p.pct+'%'}} /></div>div>
                                </div>div>
                              ))}
                                                                                              <div className="absolute bottom-3 left-4 right-4 bg-[#060C18] border border-[#1A2540] rounded-2xl px-4 py-2 flex justify-around">
                                                                                                {[LayoutDashboard,FolderKanban,Receipt,Users].map((Icon,i) => (
                                  <div key={i} className={`flex flex-col items-center gap-0.5 ${i===0?'text-amber-400':'text-slate-600'}`}><Icon className="w-4 h-4" /></div>div>
                                ))}
                                                                                                </div>div>
                                                                            </div>div>
                                                            </div>div>
                                                            <div className="absolute inset-0 rounded-[44px] bg-amber-400/5 blur-2xl -z-10" />
                                              </div>div>
                                  </motion.div>motion.div>
                        </div>div>
                </section>section>
          
                <section ref={featuresRef} className="py-24 px-6">
                        <div className="max-w-6xl mx-auto">
                                  <div className="text-center mb-16">
                                              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">Everything you need</motion.p>motion.p>
                                              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-black tracking-tight mb-4">One app. Total control.</motion.h2>motion.h2>
                                              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-slate-400 text-lg max-w-2xl mx-auto">Every CrewDesk feature, optimised for mobile with a native feel and offline-first architecture.</motion.p>motion.p>
                                  </div>div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {FEATURES.map((f, i) => {
                          const colors = COLOR_MAP[f.color];
                          const [c, bg, border] = colors.split(' ');
                          return (
                                            <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="group p-6 rounded-2xl bg-[#0A1020] border border-[#1A2540] hover:border-[#243050] transition-all duration-200 cursor-pointer">
                                                              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${bg} border ${border}`}><f.icon className={`w-5 h-5 ${c}`} /></div>div>
                                                              <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>h3>
                                                              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>p>
                                            </motion.div>motion.div>
                                          );
          })}
                                  </div>div>
                        </div>div>
                </section>section>
          
                <section className="py-24 px-6 bg-[#040A16] border-y border-[#1A2540]">
                        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                                  <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                                              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                                                            <Shield className="w-3.5 h-3.5 text-blue-400" />
                                                            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Enterprise-grade security</span>span>
                                              </div>div>
                                              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Built for<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">business</span>span></h2>h2>
                                              <p className="text-slate-400 text-lg leading-relaxed mb-8">Bank-grade encryption, biometric authentication, and role-based access controls. Your crew data is safe wherever business takes you.</p>p>
                                              <div className="space-y-3 mb-10">
                                                {['Face ID & Touch ID authentication','End-to-end encrypted messaging','Remote wipe for lost devices','SOC 2 Type II compliant'].map(item => (
                            <div key={item} className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" /><span className="text-sm text-slate-300">{item}</span>span></div>div>
                          ))}
                                              </div>div>
                                              <div className="flex flex-wrap gap-3">
                                                            <motion.a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-2 px-5 py-3 bg-white text-black font-bold text-sm rounded-xl hover:bg-slate-100 transition-colors"><Apple className="w-4 h-4" />App Store</motion.a>motion.a>
                                                            <motion.a href="https://play.google.com" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.03 }} className="flex items-center gap-2 px-5 py-3 bg-[#0A1020] text-white font-semibold text-sm rounded-xl border border-[#1A2540] hover:border-[#243050] transition-colors"><Play className="w-4 h-4" />Google Play</motion.a>motion.a>
                                              </div>div>
                                  </motion.div>motion.div>
                                  <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
                                    {[{icon:Shield,label:'Bank-grade encryption',color:'blue'},{icon:Wifi,label:'Offline-first sync',color:'green'},{icon:Bell,label:'Smart notifications',color:'amber'},{icon:Users,label:'Role-based access',color:'purple'}].map((item,i) => {
                          const colors = COLOR_MAP[item.color];
                          const [c, bg, border] = colors.split(' ');
                          return (
                                            <motion.div key={item.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl bg-[#0A1020] border border-[#1A2540] text-center">
                                                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 ${bg} border ${border}`}><item.icon className={`w-5 h-5 ${c}`} /></div>div>
                                                              <p className="text-xs font-semibold text-slate-300 text-center">{item.label}</p>p>
                                            </motion.div>motion.div>
                                                                              );
          })}
                                  </motion.div>motion.div>
                        </div>div>
                </section>section>
          
                <section className="py-24 px-6">
                        <div className="max-w-6xl mx-auto">
                                  <div className="text-center mb-16">
                                              <h2 className="text-4xl font-black tracking-tight mb-3">Loved by creative teams</h2>h2>
                                              <p className="text-slate-400">Join studios and agencies running their workforce on CrewDesk</p>p>
                                  </div>div>
                                  <div className="grid md:grid-cols-3 gap-6">
                                    {TESTIMONIALS.map((t, i) => (
                          <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl bg-[#0A1020] border border-[#1A2540]">
                                          <div className="flex mb-3">{[...Array(t.rating)].map((_,j) => (<Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />))}</div>div>
                                          <p className="text-slate-300 text-sm leading-relaxed mb-4">{t.text}</p>p>
                                          <div><p className="text-sm font-s</div>
