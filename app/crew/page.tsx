'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'
import { Plus, Search, X, Star, Mail, Phone, Trash2, Edit2, ChevronDown } from 'lucide-react'

export const dynamic = 'force-dynamic'

type Status = 'available' | 'on-project' | 'unavailable'
type FreelancerMember = {
  id: string
  name: string
  role: string
  department: string
  email: string
  phone: string
  rate: number
  rating: number
  status: Status
  skills: string[]
  bio: string
}

const STATUS_STYLE: Record<Status, string> = {
  available: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  'on-project': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  unavailable: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
}

const initialFreelancers: FreelancerMember[] = [
  {
    id: 'm1', name: 'Jordan Ellis', role: 'Senior UI Designer', department: 'Design',
    email: 'jordan@example.com', phone: '+44 7700 900001', rate: 75, rating: 4.9,
    status: 'available',
    skills: ['Figma', 'Brand Identity', 'UI/UX', 'Prototyping'],
    bio: 'Versatile UI designer with 8 years delivering digital products for agencies and startups.'
  },
  {
    id: 'm2', name: 'Maya Chen', role: 'Full-Stack Developer', department: 'Engineering',
    email: 'maya@example.com', phone: '+44 7700 900002', rate: 95, rating: 4.8,
    status: 'on-project',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    bio: 'Full-stack specialist building scalable web apps for B2B SaaS companies.'
  },
  {
    id: 'm3', name: 'Sam Okafor', role: 'Content Strategist', department: 'Marketing',
    email: 'sam@example.com', phone: '+44 7700 900003', rate: 60, rating: 4.7,
    status: 'available',
    skills: ['SEO', 'Copywriting', 'Content Strategy', 'Email Campaigns'],
    bio: 'Content strategist helping B2B brands grow organic traffic and pipeline.'
  },
  {
    id: 'm4', name: 'Priya Sharma', role: 'Project Manager', department: 'Operations',
    email: 'priya@example.com', phone: '+44 7700 900004', rate: 65, rating: 5.0,
    status: 'on-project',
    skills: ['Agile', 'Scrum', 'Stakeholder Management', 'Jira'],
    bio: 'Certified PM with a track record of delivering complex cross-functional projects on time.'
  },
  {
    id: 'm5', name: 'Alex Rivera', role: 'Data Analyst', department: 'Analytics',
    email: 'alex@example.com', phone: '+44 7700 900005', rate: 70, rating: 4.6,
    status: 'unavailable',
    skills: ['Python', 'SQL', 'Tableau', 'Power BI'],
    bio: 'Data analyst turning raw business data into actionable growth insights.'
  },
  {
    id: 'm6', name: 'Chris Morgan', role: 'Brand Consultant', department: 'Marketing',
    email: 'chris@example.com', phone: '+44 7700 900006', rate: 80, rating: 4.8,
    status: 'available',
    skills: ['Brand Strategy', 'Positioning', 'Market Research', 'Workshops'],
    bio: 'Freelance brand consultant with experience across FMCG, fintech and professional services.'
  },
]

const DEPARTMENTS = ['All', 'Design', 'Engineering', 'Marketing', 'Operations', 'Analytics']

export default function FreelancersPage() {
  const [freelancers, setFreelancers] = useState<FreelancerMember[]>(initialFreelancers)
  const [search, setSearch] = useState('')
  const [dept, setDept] = useState('All')
  const [selected, setSelected] = useState<FreelancerMember | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newF, setNewF] = useState({ name: '', role: '', department: '', email: '', phone: '', rate: '', skills: '' })

  const filtered = freelancers.filter(f => {
    const matchDept = dept === 'All' || f.department === dept
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.role.toLowerCase().includes(search.toLowerCase()) ||
      f.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
    return matchDept && matchSearch
  })

  const addFreelancer = () => {
    if (!newF.name || !newF.role) return
    const member: FreelancerMember = {
      id: 'm' + Date.now(),
      name: newF.name, role: newF.role,
      department: newF.department || 'Other',
      email: newF.email, phone: newF.phone,
      rate: parseInt(newF.rate) || 0,
      rating: 5.0, status: 'available',
      skills: newF.skills.split(',').map(s => s.trim()).filter(Boolean),
      bio: ''
    }
    setFreelancers(prev => [...prev, member])
    setNewF({ name: '', role: '', department: '', email: '', phone: '', rate: '', skills: '' })
    setShowAdd(false)
  }

  const remove = (id: string) => {
    setFreelancers(prev => prev.filter(f => f.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  return (
    <div className="flex min-h-screen bg-[#04080F]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopHeader />
        <main className="flex-1 p-6 overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Freelancers</h1>
              <p className="text-sm text-white/40 mt-1">{filtered.length} of {freelancers.length} freelancers</p>
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Freelancer
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, role or skill..."
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30"
              />
            </div>
            <div className="relative">
              <select
                value={dept}
                onChange={e => setDept(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 pr-8 text-sm focus:outline-none cursor-pointer"
              >
                {DEPARTMENTS.map(d => <option key={d} value={d} className="bg-[#04080F]">{d}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(f => (
              <div
                key={f.id}
                onClick={() => setSelected(f)}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 cursor-pointer hover:border-amber-400/30 hover:bg-white/[0.07] transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400/20 to-violet-500/20 flex items-center justify-center text-lg font-bold text-white">
                    {f.name.charAt(0)}
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLE[f.status]}`}>
                    {f.status === 'on-project' ? 'On Project' : f.status.charAt(0).toUpperCase() + f.status.slice(1)}
                  </span>
                </div>
                <h3 className="text-white font-semibold text-sm">{f.name}</h3>
                <p className="text-white/40 text-xs mt-0.5 mb-3">{f.role} · {f.department}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {f.skills.slice(0, 3).map(s => (
                    <span key={s} className="bg-white/5 border border-white/10 text-white/60 text-xs px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                  {f.skills.length > 3 && <span className="text-white/30 text-xs">+{f.skills.length - 3}</span>}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-white/60 text-xs">{f.rating}</span>
                  </div>
                  <span className="text-amber-400 text-xs font-semibold">£{f.rate}/hr</span>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-white/30 text-sm">No freelancers match your search.</p>
            </div>
          )}
        </main>
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-end" onClick={() => setSelected(null)}>
          <div
            className="w-full max-w-sm bg-[#0D1117] border border-white/10 rounded-2xl m-4 p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold text-lg">{selected.name}</h2>
              <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-violet-500/20 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
              {selected.name.charAt(0)}
            </div>
            <p className="text-center text-white/60 text-sm mb-1">{selected.role}</p>
            <p className="text-center text-white/30 text-xs mb-4">{selected.department}</p>
            <span className={`block text-center text-xs px-3 py-1.5 rounded-full font-medium mb-5 ${STATUS_STYLE[selected.status]}`}>
              {selected.status === 'on-project' ? 'On Project' : selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
            </span>
            {selected.bio && <p className="text-white/50 text-sm mb-5 text-center">{selected.bio}</p>}
            <div className="space-y-2 mb-5">
              <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
                <Mail className="w-4 h-4 text-amber-400" />{selected.email}
              </a>
              <a href={`tel:${selected.phone}`} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
                <Phone className="w-4 h-4 text-amber-400" />{selected.phone}
              </a>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl mb-5">
              <div className="text-center">
                <p className="text-amber-400 font-bold">£{selected.rate}/hr</p>
                <p className="text-white/30 text-xs">Day Rate</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />{selected.rating}
                </p>
                <p className="text-white/30 text-xs">Rating</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-6">
              {selected.skills.map(s => (
                <span key={s} className="bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs px-2.5 py-1 rounded-full">{s}</span>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-black text-sm font-semibold py-2.5 rounded-xl transition-colors">
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => remove(selected.id)}
                className="px-3 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Freelancer Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowAdd(false)}>
          <div
            className="w-full max-w-md bg-[#0D1117] border border-white/10 rounded-2xl p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold text-lg">Add Freelancer</h2>
              <button onClick={() => setShowAdd(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              {[
                { key: 'name', placeholder: 'Full name *' },
                { key: 'role', placeholder: 'Role / Title *' },
                { key: 'department', placeholder: 'Department' },
                { key: 'email', placeholder: 'Email address' },
                { key: 'phone', placeholder: 'Phone number' },
                { key: 'rate', placeholder: 'Hourly rate (£)' },
                { key: 'skills', placeholder: 'Skills (comma separated)' },
              ].map(({ key, placeholder }) => (
                <input
                  key={key}
                  value={newF[key as keyof typeof newF]}
                  onChange={e => setNewF(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                />
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 bg-white/5 border border-white/10 text-white/60 py-2.5 rounded-xl text-sm hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={addFreelancer} className="flex-1 bg-amber-400 hover:bg-amber-300 text-black font-semibold py-2.5 rounded-xl text-sm transition-colors">Add Freelancer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
