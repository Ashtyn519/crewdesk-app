'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Clock, Users, MapPin, X } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOURS = Array.from({ length: 13 }, (_, i) => i + 7)
const HOUR_HEIGHT = 60

const SHIFTS = [
  { id: 1, day: 0, startHour: 8, endHour: 12, title: 'Brand Strategy Session', crew: 'Sarah Chen, Tom B.', location: 'Meeting Room A', color: 'bg-blue-500/20 border-blue-500/40 text-blue-300' },
  { id: 2, day: 0, startHour: 13, endHour: 17, title: 'Content Review', crew: 'James O.', location: 'Office Suite 3', color: 'bg-purple-500/20 border-purple-500/40 text-purple-300' },
  { id: 3, day: 1, startHour: 9, endHour: 18, title: 'Product Launch Sprint', crew: 'Full Team (8)', location: 'Client Office', color: 'bg-amber-500/20 border-amber-500/40 text-amber-300' },
  { id: 4, day: 2, startHour: 10, endHour: 14, title: 'UX Research Workshop', crew: 'Maya C., Alex R.', location: 'Remote', color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' },
  { id: 5, day: 3, startHour: 8, endHour: 17, title: 'Client Onsite Day', crew: 'Priya S.', location: 'Client HQ', color: 'bg-rose-500/20 border-rose-500/40 text-rose-300' },
  { id: 6, day: 4, startHour: 9, endHour: 12, title: 'Dev Handoff', crew: 'Jordan E., Chris M.', location: 'Remote', color: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' },
]

type Shift = typeof SHIFTS[number]
type NewShift = { title: string; day: string; startHour: string; endHour: string; crew: string; location: string }

const COLORS = [
  'bg-blue-500/20 border-blue-500/40 text-blue-300',
  'bg-purple-500/20 border-purple-500/40 text-purple-300',
  'bg-amber-500/20 border-amber-500/40 text-amber-300',
  'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
  'bg-rose-500/20 border-rose-500/40 text-rose-300',
  'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
]

export default function SchedulePage() {
  const [weekOffset, setWeekOffset] = useState(0)
  const [shifts, setShifts] = useState<Shift[]>(SHIFTS)
  const [selected, setSelected] = useState<Shift | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newShift, setNewShift] = useState<NewShift>({ title: '', day: '0', startHour: '9', endHour: '17', crew: '', location: '' })

  const baseDate = new Date()
  baseDate.setDate(baseDate.getDate() - baseDate.getDay() + 1 + weekOffset * 7)
  const weekDates = DAYS.map((_, i) => { const d = new Date(baseDate); d.setDate(baseDate.getDate() + i); return d })
  const weekLabel = `${weekDates[0].toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${weekDates[6].toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`

  const addShift = () => {
    if (!newShift.title) return
    const shift: Shift = {
      id: Date.now(),
      day: parseInt(newShift.day),
      startHour: parseInt(newShift.startHour),
      endHour: parseInt(newShift.endHour),
      title: newShift.title,
      crew: newShift.crew,
      location: newShift.location,
      color: COLORS[shifts.length % COLORS.length]
    }
    setShifts(prev => [...prev, shift])
    setNewShift({ title: '', day: '0', startHour: '9', endHour: '17', crew: '', location: '' })
    setShowAdd(false)
  }

  const removeShift = (id: number) => {
    setShifts(prev => prev.filter(s => s.id !== id))
    setSelected(null)
  }

  return (
    <div className="flex min-h-screen bg-[#04080F]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopHeader />
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div>
              <h1 className="text-2xl font-bold text-white">Schedule</h1>
              <p className="text-sm text-white/40 mt-0.5">{weekLabel}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
                <button onClick={() => setWeekOffset(w => w - 1)} className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => setWeekOffset(0)} className="px-3 py-1 text-white/60 hover:text-white text-xs rounded-lg hover:bg-white/5 transition-colors">Today</button>
                <button onClick={() => setWeekOffset(w => w + 1)} className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => setShowAdd(true)}
                className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" /> Book Slot
              </button>
            </div>
          </div>

          {/* Calendar */}
          <div className="flex-1 overflow-auto">
            <div className="flex">
              {/* Time gutter */}
              <div className="w-16 flex-shrink-0">
                <div className="h-10" />
                {HOURS.map(h => (
                  <div key={h} style={{ height: HOUR_HEIGHT }} className="relative border-t border-white/5">
                    <span className="absolute -top-2.5 left-2 text-[10px] text-white/20">
                      {h < 10 ? `0${h}:00` : `${h}:00`}
                    </span>
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {DAYS.map((day, di) => {
                const isToday = weekDates[di].toDateString() === new Date().toDateString()
                const dayShifts = shifts.filter(s => s.day === di)
                return (
                  <div key={day} className="flex-1 border-l border-white/5">
                    <div className={`h-10 flex flex-col items-center justify-center border-b border-white/5 ${isToday ? 'bg-amber-400/5' : ''}`}>
                      <span className="text-[10px] text-white/30 uppercase tracking-wider">{day}</span>
                      <span className={`text-sm font-semibold ${isToday ? 'text-amber-400' : 'text-white/60'}`}>
                        {weekDates[di].getDate()}
                      </span>
                    </div>
                    <div className="relative" style={{ height: HOURS.length * HOUR_HEIGHT }}>
                      {HOURS.map(h => (
                        <div key={h} style={{ top: (h - 7) * HOUR_HEIGHT, height: HOUR_HEIGHT }} className="absolute inset-x-0 border-t border-white/[0.03]" />
                      ))}
                      {dayShifts.map(shift => {
                        const top = (shift.startHour - 7) * HOUR_HEIGHT
                        const height = (shift.endHour - shift.startHour) * HOUR_HEIGHT
                        return (
                          <div
                            key={shift.id}
                            onClick={() => setSelected(shift)}
                            style={{ top, height, left: 4, right: 4 }}
                            className={`absolute rounded-xl border p-2 cursor-pointer hover:opacity-90 transition-opacity overflow-hidden ${shift.color}`}
                          >
                            <p className="text-[11px] font-semibold leading-tight truncate">{shift.title}</p>
                            {height > 60 && shift.crew && (
                              <p className="text-[10px] opacity-70 mt-1 truncate flex items-center gap-1">
                                <Users className="w-3 h-3 inline" />{shift.crew}
                              </p>
                            )}
                            {height > 80 && shift.location && (
                              <p className="text-[10px] opacity-70 mt-0.5 truncate flex items-center gap-1">
                                <MapPin className="w-3 h-3 inline" />{shift.location}
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </main>
      </div>

      {/* Shift detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setSelected(null)}>
          <div
            className="w-full max-w-sm bg-[#0D1117] border border-white/10 rounded-2xl p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <span className={`text-xs px-2.5 py-1 rounded-full border ${selected.color}`}>
                {DAYS[selected.day]}
              </span>
              <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <h2 className="text-white font-bold text-xl mb-4">{selected.title}</h2>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-white/50 text-sm">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{selected.startHour}:00 – {selected.endHour}:00 ({selected.endHour - selected.startHour}h)</span>
              </div>
              {selected.crew && (
                <div className="flex items-center gap-3 text-white/50 text-sm">
                  <Users className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>{selected.crew}</span>
                </div>
              )}
              {selected.location && (
                <div className="flex items-center gap-3 text-white/50 text-sm">
                  <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>{selected.location}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => removeShift(selected.id)}
              className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-xl text-sm transition-colors"
            >
              Remove Booking
            </button>
          </div>
        </div>
      )}

      {/* Add booking modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowAdd(false)}>
          <div
            className="w-full max-w-md bg-[#0D1117] border border-white/10 rounded-2xl p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold text-lg">Book a Slot</h2>
              <button onClick={() => setShowAdd(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input
                value={newShift.title}
                onChange={e => setNewShift(p => ({ ...p, title: e.target.value }))}
                placeholder="Session title *"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30"
              />
              <select
                value={newShift.day}
                onChange={e => setNewShift(p => ({ ...p, day: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none"
              >
                {DAYS.map((d, i) => <option key={d} value={i} className="bg-[#04080F]">{d}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Start Hour</label>
                  <input type="number" min="7" max="20" value={newShift.startHour} onChange={e => setNewShift(p => ({ ...p, startHour: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">End Hour</label>
                  <input type="number" min="8" max="21" value={newShift.endHour} onChange={e => setNewShift(p => ({ ...p, endHour: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                </div>
              </div>
              <input
                value={newShift.crew}
                onChange={e => setNewShift(p => ({ ...p, crew: e.target.value }))}
                placeholder="Freelancers assigned"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30"
              />
              <input
                value={newShift.location}
                onChange={e => setNewShift(p => ({ ...p, location: e.target.value }))}
                placeholder="Location / Remote"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30"
              />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 bg-white/5 border border-white/10 text-white/60 py-2.5 rounded-xl text-sm hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={addShift} className="flex-1 bg-amber-400 hover:bg-amber-300 text-black font-semibold py-2.5 rounded-xl text-sm transition-colors">Book Slot</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
