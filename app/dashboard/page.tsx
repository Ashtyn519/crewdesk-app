'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, FolderKanban, Users, FileText, Receipt, MessageSquare, ArrowRight, Clock, Bell, CheckCircle2, AlertCircle } from 'lucide-react'
import RevenueChart from '@/components/RevenueChart'

const kpis = [
  { label: 'Total Revenue', value: '£348,200', change: '+23.4%', up: true, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { label: 'Active Projects', value: '12', change: '+3 this month', up: true, icon: FolderKanban, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'Crew Members', value: '28', change: '+5 new', up: true, icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { label: 'Pending Invoices', value: '£37,840', change: '3 outstanding', up: false, icon: Receipt, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  ]

const recentActivity = [
  { id: 1, type: 'invoice', text: 'Invoice #INV-2024 sent to Neon Films', time: '2 min ago', icon: Receipt, color: 'text-amber-400' },
  { id: 2, type: 'crew', text: 'Sarah Chen accepted crew invitation', time: '18 min ago', icon: Users, color: 'text-green-400' },
  { id: 3, type: 'contract', text: 'Contract for City Lights signed', time: '1 hr ago', icon: FileText, color: 'text-blue-400' },
  { id: 4, type: 'project', text: 'New project Apex Documentary created', time: '3 hrs ago', icon: FolderKanban, color: 'text-purple-400' },
  { id: 5, type: 'payment', text: 'Payment received from BFI', time: '5 hrs ago', icon: TrendingUp, color: 'text-emerald-400' },
  { id: 6, type: 'message', text: "James O'Brien sent 3 new messages", time: 'Yesterday', icon: MessageSquare, color: 'text-sky-400' },
  ]

const quickActions = [
  { label: 'New Project', icon: FolderKanban, href: '/projects', color: 'bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400' },
  { label: 'Add Crew', icon: Users, href: '/crew', color: 'bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400' },
  { label: 'Create Invoice', icon: Receipt, href: '/invoices', color: 'bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400' },
  { label: 'New Contract', icon: FileText, href: '/contracts', color: 'bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400' },
  ]

const upcomingDeadlines = [
  { project: 'Neon Films — Episode 5', due: 'Tomorrow', status: 'urgent', pct: 78 },
  { project: 'City Lights Documentary', due: 'Apr 2', status: 'on-track', pct: 45 },
  { project: 'BFI Shorts Package', due: 'Apr 8', status: 'on-track', pct: 30 },
  ]

function getGreeting() {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
}

export default function DashboardPage() {
    const [greeting, setGreeting] = useState('')
    useEffect(() => { setGreeting(getGreeting()) }, [])

  return (
    <main className="flex-1 p-6 space-y-6">
                      
                        {/* Trial Banner */}
                                <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
                                            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                                            <p className="text-sm text-amber-200 flex-1">
                                                          <span className="font-semibold text-amber-400">11 days left on your free trial.</span>{' '}
                                                          Upgrade to keep full access to all features.
                                            </p>
                                            <Link href="/pricing" className="text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap">
                                                          View plans →
                                            </Link>
                                </div>
                      
                        {/* Greeting */}
                                <div>
                                            <p className="text-slate-400 text-sm">{greeting},</p>
                                            <h1 className="text-3xl font-bold text-white mt-0.5">Dashboard</h1>
                                </div>
                      
                        {/* KPI Grid — 2 cols on small, 4 on xl */}
                                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                                  {kpis.map((kpi) => {
                        const Icon = kpi.icon
                                        return (
                                                          <div key={kpi.label} className="bg-[#0A1020] border border-white/5 rounded-2xl p-5 flex flex-col gap-3">
                                                                            <div className="flex items-center justify-between">
                                                                                                <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                                                                                                                      <Icon className={`w-5 h-5 ${kpi.color}`} />
                                                                                                  </div>
                                                                                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${kpi.up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                                                                  {kpi.change}
                                                                                                  </span>
                                                                            </div>
                                                                            <div>
                                                                                                <p className="text-2xl font-bold text-white">{kpi.value}</p>
                                                                                                <p className="text-slate-500 text-xs mt-0.5">{kpi.label}</p>
                                                                            </div>
                                                          </div>
                                                        )
                                  })}
                                </div>
                      
                        {/* Revenue Chart — standalone card, no duplicate header */}
                                <div className="bg-[#0A1020] border border-white/5 rounded-2xl p-6">
                                            <RevenueChart />
                                </div>
                      
                        {/* Bottom Row */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                
                                  {/* Recent Activity */}
                                            <div className="lg:col-span-2 bg-[#0A1020] border border-white/5 rounded-2xl p-6">
                                                          <div className="flex items-center justify-between mb-5">
                                                                          <h2 className="text-base font-semibold text-white">Recent Activity</h2>
                                                                          <button className="text-xs text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1">
                                                                                            View all <ArrowRight className="w-3 h-3" />
                                                                          </button>
                                                          </div>
                                                          <div className="space-y-4">
                                                            {recentActivity.map((a) => {
                            const Icon = a.icon
                                                return (
                                                                      <div key={a.id} className="flex items-start gap-3">
                                                                                            <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5`}>
                                                                                                                    <Icon className={`w-4 h-4 ${a.color}`} />
                                                                                              </div>
                                                                                            <div className="flex-1 min-w-0">
                                                                                                                    <p className="text-sm text-slate-200 truncate">{a.text}</p>
                                                                                                                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                                                                                                                              <Clock className="w-3 h-3" />{a.time}
                                                                                                                      </p>
                                                                                              </div>
                                                                      </div>
                                                                    )
                                                            })}
                                                          </div>
                                            </div>
                                
                                  {/* Right Column */}
                                            <div className="flex flex-col gap-6">
                                            
                                              {/* Quick Actions */}
                                                          <div className="bg-[#0A1020] border border-white/5 rounded-2xl p-6">
                                                                          <h2 className="text-base font-semibold text-white mb-4">Quick Actions</h2>
                                                                          <div className="grid grid-cols-2 gap-3">
                                                                            {quickActions.map((a) => {
                              const Icon = a.icon
                                                    return (
                                                                            <Link key={a.label} href={a.href}
                                                                                                      className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors ${a.color}`}>
                                                                                                    <Icon className="w-5 h-5" />
                                                                                                    <span className="text-xs font-medium">{a.label}</span>
                                                                            </Link>
                                                                          )
        })}
                                                                          </div>
                                                          </div>
                                            
                                              {/* Upcoming Deadlines */}
                                                          <div className="bg-[#0A1020] border border-white/5 rounded-2xl p-6">
                                                                          <h2 className="text-base font-semibold text-white mb-4">Deadlines</h2>
                                                                          <div className="space-y-4">
                                                                            {upcomingDeadlines.map((d, i) => (
                              <div key={i}>
                                                    <div className="flex items-center justify-between mb-1">
                                                                            <p className="text-xs text-slate-300 truncate max-w-[65%]">{d.project}</p>
                                                                            <span className={`text-xs font-medium ${d.status === 'urgent' ? 'text-rose-400' : 'text-slate-400'}`}>
                                                                              {d.due}
                                                                              </span>
                                                    </div>
                                                    <div className="w-full bg-white/5 rounded-full h-1.5">
                                                                            <div
                                                                                                        className={`h-1.5 rounded-full transition-all duration-700 ${d.status === 'urgent' ? 'bg-rose-400' : 'bg-amber-400'}`}
                                                                                                        style={{ width: `${d.pct}%` }}
                                                                                                      />
                                                    </div>
                              </div>
                            ))}
                                                                          </div>
                                                          </div>
                                            
                                            </div>
                                </div>
                      
                      </main>
  )

}</div>
