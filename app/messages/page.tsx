'use client'
export const dynamic = 'force-dynamic'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'

interface Message { id: number; text: string; sender: 'me' | 'them'; time: string; read: boolean }
interface Thread {
  id: number; name: string; role: string; initials: string; color: string;
  lastMessage: string; lastTime: string; unread: number; messages: Message[]
}

const THREADS: Thread[] = [
  { id: 1, name: 'Marcus Webb', role: 'DOP', initials: 'MW', color: 'from-blue-400 to-indigo-500', lastMessage: 'Sounds good — I\'ll bring the ARRI kit', lastTime: '2:14pm', unread: 2,
    messages: [
      { id: 1, text: 'Hey Marcus, are you free for the City Lights shoot on March 22nd?', sender: 'me', time: '10:00am', read: true },
      { id: 2, text: 'Yes, I\'m available. What\'s the call time?', sender: 'them', time: '10:15am', read: true },
      { id: 3, text: 'Call time is 6am at Canary Wharf. We\'ll need the ARRI Alexa and full lens kit.', sender: 'me', time: '10:20am', read: true },
      { id: 4, text: 'Perfect, I\'ll bring the whole package. Will there be a focus puller?', sender: 'them', time: '11:05am', read: true },
      { id: 5, text: 'Yes, Jake will be on focus. Budget for the kit is £2,400 for the day.', sender: 'me', time: '11:10am', read: true },
      { id: 6, text: 'Sounds good — I\'ll bring the ARRI kit', sender: 'them', time: '2:14pm', read: false },
    ]
  },
  { id: 2, name: 'Priya Sharma', role: 'Editor', initials: 'PS', color: 'from-purple-400 to-pink-500', lastMessage: 'I\'ll have the first cut ready by Friday', lastTime: '11:30am', unread: 1,
    messages: [
      { id: 1, text: 'Priya, how\'s the Neon Nights edit coming along?', sender: 'me', time: '9:00am', read: true },
      { id: 2, text: 'Going well! I\'ve got the rough assembly done. Need to colour grade and do the sound pass.', sender: 'them', time: '9:45am', read: true },
      { id: 3, text: 'Great. Client needs it by Monday — is that doable?', sender: 'me', time: '10:00am', read: true },
      { id: 4, text: 'I\'ll have the first cut ready by Friday', sender: 'them', time: '11:30am', read: false },
    ]
  },
  { id: 3, name: 'Sophie Lane', role: 'Prod Designer', initials: 'SL', color: 'from-rose-400 to-red-500', lastMessage: 'Budget breakdown sent over to you now', lastTime: 'Yesterday', unread: 0,
    messages: [
      { id: 1, text: 'Sophie, can you send me the budget breakdown for the Apex TVC set?', sender: 'me', time: 'Yesterday 3pm', read: true },
      { id: 2, text: 'Of course. I\'ve itemised everything — props, set build, and rigging.', sender: 'them', time: 'Yesterday 3:30pm', read: true },
      { id: 3, text: 'Budget breakdown sent over to you now', sender: 'them', time: 'Yesterday 4pm', read: true },
    ]
  },
  { id: 4, name: 'Jake Torres', role: 'Sound', initials: 'JT', color: 'from-emerald-400 to-teal-500', lastMessage: 'All sorted, I\'ve booked the kit', lastTime: 'Monday', unread: 0,
    messages: [
      { id: 1, text: 'Jake — you\'re on the City Lights doc. Focus pulling for Marcus.', sender: 'me', time: 'Monday 9am', read: true },
      { id: 2, text: 'Brilliant, looking forward to it. Same rate as last time?', sender: 'them', time: 'Monday 9:30am', read: true },
      { id: 3, text: 'Yes, £380/day. See you on the 22nd.', sender: 'me', time: 'Monday 10am', read: true },
      { id: 4, text: 'All sorted, I\'ve booked the kit', sender: 'them', time: 'Monday 11am', read: true },
    ]
  },
  { id: 5, name: 'Pulse Records', role: 'Client', initials: 'PR', color: 'from-amber-400 to-orange-500', lastMessage: 'Love it! Can we add one more revision?', lastTime: 'Last week', unread: 0,
    messages: [
      { id: 1, text: 'Hi! We\'ve reviewed the Neon Nights cut. Overall we love the direction.', sender: 'them', time: 'Last week', read: true },
      { id: 2, text: 'Really glad to hear that! Any feedback?', sender: 'me', time: 'Last week', read: true },
      { id: 3, text: 'Love it! Can we add one more revision?', sender: 'them', time: 'Last week', read: true },
    ]
  },
]

export default function MessagesPage() {
  const [threads, setThreads] = useState<Thread[]>(THREADS)
  const [active, setActive] = useState<Thread>(THREADS[0])
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const messagesEnd = useRef<HTMLDivElement>(null)

  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: 'smooth' }) }, [active.messages.length])

  const send = () => {
    if (!input.trim()) return
    const newMsg: Message = { id: Date.now(), text: input.trim(), sender: 'me', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: true }
    const updated = threads.map(t => t.id === active.id ? { ...t, messages: [...t.messages, newMsg], lastMessage: input.trim(), lastTime: 'now', unread: 0 } : t)
    setThreads(updated)
    setActive({ ...active, messages: [...active.messages, newMsg] })
    setInput('')
    // Simulate reply after 1.5s
    setTimeout(() => {
      const replies = ['Got it, thanks!', 'Perfect, will do.', 'Sounds great!', 'On it 👍', 'Let me check and get back to you.', 'Roger that.']
      const reply: Message = { id: Date.now() + 1, text: replies[Math.floor(Math.random() * replies.length)], sender: 'them', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: true }
      setThreads(prev => prev.map(t => t.id === active.id ? { ...t, messages: [...t.messages, newMsg, reply], lastMessage: reply.text, lastTime: 'now' } : t))
      setActive(prev => ({ ...prev, messages: [...prev.messages, reply] }))
    }, 1500)
  }

  const markRead = (thread: Thread) => {
    const updated = threads.map(t => t.id === thread.id ? { ...t, unread: 0 } : t)
    setThreads(updated)
    setActive({ ...thread, unread: 0 })
  }

  const filteredThreads = threads.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.role.toLowerCase().includes(search.toLowerCase()))
  const totalUnread = threads.reduce((s, t) => s + t.unread, 0)

  return (
    <div className="flex h-screen bg-[#04080F] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <div className="flex-1 flex overflow-hidden">
          {/* Thread list */}
          <div className="w-72 border-r border-white/[0.06] flex flex-col bg-[#060C18]">
            <div className="p-4 border-b border-white/[0.06]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white font-semibold text-sm">Messages</h2>
                {totalUnread > 0 && <span className="bg-amber-400 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">{totalUnread}</span>}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">🔍</span>
                <input className="w-full bg-white/5 border border-white/[0.06] rounded-lg pl-7 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:border-amber-400/30 focus:outline-none" placeholder="Search conversations..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredThreads.map(thread => (
                <button key={thread.id} onClick={() => markRead(thread)} className={`w-full text-left px-4 py-3.5 border-b border-white/[0.03] transition-all hover:bg-white/[0.03] ${active.id === thread.id ? 'bg-white/[0.05] border-l-2 border-l-amber-400' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${thread.color} flex items-center justify-center text-white font-bold text-xs flex-shrink-0 relative`}>
                      {thread.initials}
                      {thread.unread > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full text-black text-[9px] flex items-center justify-center font-bold">{thread.unread}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <span className={`text-xs font-semibold ${thread.unread > 0 ? 'text-white' : 'text-gray-300'}`}>{thread.name}</span>
                        <span className="text-[10px] text-gray-500 flex-shrink-0 ml-2">{thread.lastTime}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">{thread.lastMessage}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message thread */}
          <div className="flex-1 flex flex-col">
            {/* Thread header */}
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between bg-[#04080F]">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${active.color} flex items-center justify-center text-white font-bold text-sm`}>{active.initials}</div>
                <div>
                  <h3 className="text-white font-semibold text-sm">{active.name}</h3>
                  <p className="text-gray-500 text-xs">{active.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-sm transition-colors" title="Call">📞</button>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-sm transition-colors" title="Info">ℹ️</button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence initial={false}>
                {active.messages.map((msg, i) => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.2 }}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} gap-2`}>
                    {msg.sender === 'them' && (
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${active.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-auto`}>{active.initials[0]}</div>
                    )}
                    <div className={`max-w-[65%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.sender === 'me' ? 'bg-amber-400 text-black rounded-br-md' : 'bg-[#0A1020] text-white border border-white/[0.06] rounded-bl-md'}`}>
                      {msg.text}
                      <p className={`text-[10px] mt-1 ${msg.sender === 'me' ? 'text-black/50 text-right' : 'text-gray-500'}`}>{msg.time}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEnd} />
            </div>

            {/* Input */}
            <div className="px-6 py-4 border-t border-white/[0.06] bg-[#04080F]">
              <div className="flex items-end gap-3">
                <div className="flex-1 bg-[#0A1020] border border-white/[0.08] rounded-2xl px-4 py-3 focus-within:border-amber-400/30 transition-colors">
                  <textarea className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-gray-500 max-h-32" placeholder={`Message ${active.name}...`} rows={1} value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} />
                </div>
                <motion.button onClick={send} whileTap={{ scale: 0.9 }} className="w-10 h-10 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center justify-center transition-colors flex-shrink-0" disabled={!input.trim()}>
                  <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
