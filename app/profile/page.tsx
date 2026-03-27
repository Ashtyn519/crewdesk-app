'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'
import Link from 'next/link'
import {
  User, Star, MapPin, Mail, Phone, Calendar, TrendingUp,
  Briefcase, Clock, CheckCircle, Edit2, Camera, DollarSign,
  BarChart3, Receipt, FolderKanban, ChevronRight, Award
} from 'lucide-react'

const EARNINGS_DATA = [
  { month: 'Oct', amount: 4200 },
  { month: 'Nov', amount: 5800 },
  { month: 'Dec', amount: 3900 },
  { month: 'Jan', amount: 6700 },
  { month: 'Feb', amount: 5200 },
  { month: 'Mar', amount: 7400 },
]

const RATE_CARDS = [
  { label: 'Half Day', hours: '4 hrs', rate: '£325', icon: Clock },
  { label: 'Full Day', hours: '8 hrs', rate: '£600', icon: Calendar },
  { label: 'Weekly', hours: '5 days', rate: '£2,750', icon: TrendingUp },
]

const RECENT_INVOICES = [
  { id: 'INV-2024', client: 'Neon Films Ltd', amount: '£3,200', status: 'paid', date: 'Mar 22' },
  { id: 'INV-2023', client: 'BFI Production', amount: '£1,800', status: 'sent', date: 'Mar 15' },
  { id: 'INV-2022', client: 'City Lights Co.', amount: '£2,400', status: 'paid', date: 'Mar 8' },
]

const UPCOMING_SHIFTS = [
  { project: 'Neon Films — Episode 5', role: 'Director of Photography', date: 'Tomorrow', time: '08:00–18:00', location: 'Studio A' },
  { project: 'City Lights Documentary', role: 'Camera Operator', date: 'Apr 2', time: '09:00–17:00', location: 'City Centre' },
  { project: 'BFI Shorts Package', role: 'Director of Photography', date: 'Apr 8', time: '07:00–19:00', location: 'Location TBC' },
]

const STATUS_STYLE: Record<string, string> = {
  paid: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  sent: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  overdue: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
  draft: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
}

export default function ProfilePage() {
  const [available, setAvailable] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState('Jordan Ellis')
  const [role, setRole] = useState('Director of Photography')
  const [location, setLocation] = useState('London, UK')
  const [bio, setBio] = useState('Award-winning DoP with 12 years in film & TV. Specialising in narrative drama, documentary, and high-end commercials. BAFTA nominated for "City Lights" (2024).')

  const maxEarning = Math.max(...EARNINGS_DATA.map(d => d.amount))
  const totalEarnings = EARNINGS_DATA.reduce((s, d) => s + d.amount, 0)

  return (
    <div className="flex min-h-screen bg-[#04080F]">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <TopHeader />
        <main className="flex-1 p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">My Profile</h1>
              <p className="text-slate-400 text-sm mt-0.5">Manage your public profile and freelancer settings</p>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${editMode ? 'bg-amber-400 text-black' : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'}`}
            >
              <Edit2 className="w-4 h-4" />
              {editMode ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>

          {/* Profile Card + Availability */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-2 bg-[#0A1020] border border-white/5 rounded-2xl p-6">
              <div className="flex items-start gap-5">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-3xl font-bold text-black">
                    {name.charAt(0)}
                  </div>
                  {editMode && (
                    <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center">
                      <Camera className="w-3 h-3 text-black" />
                    </button>
                  )}
                  <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0A1020] ${available ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  {editMode ? (
                    <div className="space-y-3">
                      <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-lg font-bold focus:outline-none focus:border-amber-400/50"
                      />
                      <input
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-slate-300 text-sm focus:outline-none focus:border-amber-400/50"
                      />
                      <input
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-slate-400 text-sm focus:outline-none focus:border-amber-400/50"
                      />
                      <textarea
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-slate-400 text-sm focus:outline-none focus:border-amber-400/50 resize-none"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-xl font-bold text-white">{name}</h2>
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-amber-400 text-sm font-semibold">4.9</span>
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Award className="w-3 h-3 text-purple-400" />
                          <span className="text-purple-400">BAFTA Nominated</span>
                        </span>
                      </div>
                      <p className="text-amber-400 text-sm font-medium mt-0.5">{role}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span className="text-slate-500 text-xs">{location}</span>
                      </div>
                      <p className="text-slate-400 text-sm mt-3 leading-relaxed">{bio}</p>
                      <div className="flex items-center gap-3 mt-4 flex-wrap">
                        {['Narrative Drama', 'Documentary', 'Commercials', 'ARRI ALEXA', 'Sony VENICE'].map(skill => (
                          <span key={skill} className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Contact Row */}
              {!editMode && (
                <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-400 text-xs">jordan@crewdesk.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-400 text-xs">+44 7700 900001</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-400 text-xs">12 years experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FolderKanban className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-400 text-xs">47 projects completed</span>
                  </div>
                </div>
              )}
            </div>

            {/* Availability + Rate */}
            <div className="flex flex-col gap-4">
              {/* Availability Toggle */}
              <div className="bg-[#0A1020] border border-white/5 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Availability</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-base font-semibold ${available ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {available ? 'Available for Work' : 'Not Available'}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {available ? 'Visible to production companies' : 'Hidden from job listings'}
                    </p>
                  </div>
                  <button
                    onClick={() => setAvailable(!available)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${available ? 'bg-emerald-500' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${available ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                  <p className="text-xs text-slate-500">Next available from</p>
                  <p className="text-sm font-medium text-white">Immediately</p>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-[#0A1020] border border-white/5 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-3">This Month</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Earnings</span>
                    <span className="text-sm font-semibold text-white">£7,400</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Days Worked</span>
                    <span className="text-sm font-semibold text-white">14</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Projects</span>
                    <span className="text-sm font-semibold text-white">3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rate Cards */}
          <div className="bg-[#0A1020] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">Rate Card</h2>
              {editMode && <button className="text-xs text-amber-400 hover:text-amber-300">Edit rates</button>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {RATE_CARDS.map(rc => {
                const Icon = rc.icon
                return (
                  <div key={rc.label} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-amber-400/20 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-amber-400" />
                      </div>
                      <span className="text-sm font-medium text-white">{rc.label}</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{rc.rate}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{rc.hours}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Earnings Chart + Upcoming Shifts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Earnings Chart */}
            <div className="bg-[#0A1020] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-semibold text-white">Earnings (6 months)</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Total: <span className="text-amber-400 font-semibold">£{(totalEarnings / 1000).toFixed(1)}k</span></p>
                </div>
                <BarChart3 className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex items-end gap-2 h-32">
                {EARNINGS_DATA.map(d => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-amber-400/20 rounded-t-md hover:bg-amber-400/30 transition-colors relative group"
                      style={{ height: `${(d.amount / maxEarning) * 100}%` }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#0F1A2E] border border-white/10 rounded px-1.5 py-0.5 text-[10px] text-amber-400 font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        £{(d.amount / 1000).toFixed(1)}k
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Shifts */}
            <div className="bg-[#0A1020] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-white">Upcoming Shifts</h2>
                <Link href="/schedule" className="text-xs text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1">
                  View all <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {UPCOMING_SHIFTS.map((shift, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{shift.project}</p>
                      <p className="text-xs text-slate-500 truncate">{shift.role}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-amber-400 font-medium">{shift.date}</span>
                        <span className="text-[10px] text-slate-500">{shift.time}</span>
                        <span className="text-[10px] text-slate-500">{shift.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="bg-[#0A1020] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-white">Recent Invoices</h2>
              <Link href="/invoices" className="text-xs text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {RECENT_INVOICES.map(inv => (
                <div key={inv.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center shrink-0">
                    <Receipt className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{inv.id}</p>
                    <p className="text-xs text-slate-500">{inv.client}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[inv.status]}`}>
                    {inv.status}
                  </span>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-white">{inv.amount}</p>
                    <p className="text-[10px] text-slate-500">{inv.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
