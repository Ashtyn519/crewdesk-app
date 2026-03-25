'use client'
export const dynamic = 'force-dynamic'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'
import { Send, Search, Plus, Trash2, X, Check, CheckCheck } from 'lucide-react'

interface Message { id: number; text: string; sender: 'me' | 'them'; time: string; read: boolean }
interface Thread {
    id: number; name: string; role: string; initials: string; color: string;
    lastMessage: string; lastTime: string; unread: number; messages: Message[]
}

const THREADS: Thread[] = [
  {
        id: 1, name: 'Marcus Webb', role: 'DOP', initials: 'MW', color: 'from-blue-400 to-indigo-500',
        lastMessage: 'Sounds good — I\'ll bring the ARRI kit', lastTime: '2:14pm', unread: 2,
        messages: [
          { id: 1, text: 'Hey Marcus, are you free for the City Lights shoot on March 22nd?', sender: 'me', time: '10:00am', read: true },
          { id: 2, text: 'Yes, I\'m available. What\'s the call time?', sender: 'them', time: '10:15am', read: true },
          { id: 3, text: 'Call time is 6am at Canary Wharf. We\'ll need the ARRI Alexa and full lens kit.', sender: 'me', time: '10:20am', read: true },
          { id: 4, text: 'Perfect, I\'ll bring the whole package. Will there be a focus puller?', sender: 'them', time: '11:05am', read: true },
          { id: 5, text: 'Yes, Jake will be on focus. Budget for the kit is £2,400 for the day.', sender: 'me', time: '11:10am', read: true },
          { id: 6, text: 'Sounds good — I\'ll bring the ARRI kit', sender: 'them', time: '2:14pm', read: false },
              ]
  },
  {
        id: 2, name: 'Priya Sharma', role: 'Editor', initials: 'PS', color: 'from-purple-400 to-pink-500',
        lastMessage: 'I\'ll have the first cut ready by Friday', lastTime: '11:30am', unread: 1,
        messages: [
          { id: 1, text: 'Priya, how\'s the Neon Nights edit coming along?', sender: 'me', time: '9:00am', read: true },
          { id: 2, text: 'Going well! I\'ve got the rough assembly done. Need to colour grade and do the sound pass.', sender: 'them', time: '9:45am', read: true },
          { id: 3, text: 'Great. Client needs it by Monday — is that doable?', sender: 'me', time: '10:00am', read: true },
          { id: 4, text: 'I\'ll have the first cut ready by Friday', sender: 'them', time: '11:30am', read: false },
              ]
  },
  {
        id: 3, name: 'Sophie Lane', role: 'Production Designer', initials: 'SL', color: 'from-rose-400 to-red-500',
        lastMessage: 'Budget breakdown sent over to you now', lastTime: 'Yesterday', unread: 0,
        messages: [
          { id: 1, text: 'Sophie, can you send me the budget breakdown for the Apex TVC set?', sender: 'me', time: 'Yesterday 3pm', read: true },
          { id: 2, text: 'Of course. I\'ve itemised everything — props, set build, and rigging.', sender: 'them', time: 'Yesterday 3:30pm', read: true },
          { id: 3, text: 'Budget breakdown sent over to you now', sender: 'them', time: 'Yesterday 4pm', read: true },
              ]
  },
  {
        id: 4, name: 'Jake Torres', role: 'Sound', initials: 'JT', color: 'from-emerald-400 to-teal-500',
        lastMessage: 'All sorted, I\'ve booked the kit', lastTime: 'Monday', unread: 0,
        messages: [
          { id: 1, text: 'Jake — you\'re on the City Lights doc. Focus pulling for Marcus.', sender: 'me', time: 'Monday 9am', read: true },
          { id: 2, text: 'Brilliant, looking forward to it. Same rate as last time?', sender: 'them', time: 'Monday 9:30am', read: true },
          { id: 3, text: 'Yes, £380/day. See you on the 22nd.', sender: 'me', time: 'Monday 10am', read: true },
          { id: 4, text: 'All sorted, I\'ve booked the kit', sender: 'them', time: 'Monday 11am', read: true },
              ]
  },
  {
        id: 5, name: 'Pulse Records', role: 'Client', initials: 'PR', color: 'from-amber-400 to-orange-500',
        lastMessage: 'Love it! Can we add one more revision?', lastTime: 'Last week', unread: 0,
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
    const [showCompose, setShowCompose] = useState(false)
    const [composeName, setComposeName] = useState('')
    const [composeRole, setComposeRole] = useState('')
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
    const bottomRef = useRef<HTMLDivElement>(null)

  const filtered = threads.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.role.toLowerCase().includes(search.toLowerCase())
                                    )

  useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [active.messages])

  const sendMessage = () => {
        const text = input.trim()
        if (!text) return
        const newMsg: Message = {
                id: Date.now(), text, sender: 'me',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                read: true
        }
        const updated = threads.map(t =>
                t.id === active.id
                                            ? { ...t, messages: [...t.messages, newMsg], lastMessage: text, lastTime: 'Just now', unread: 0 }
                  : t
                                        )
        setThreads(updated)
        setActive(updated.find(t => t.id === active.id)!)
        setInput('')

        // Simulate reply after 1.5s
        setTimeout(() => {
                const replies = [
                          'Got it, thanks for the update.',
                          'Sounds good, I\'ll confirm shortly.',
                          'On it — will get back to you soon.',
                          'Noted. Leave it with me.',
                          'Perfect, speak soon.',
                        ]
                const reply: Message = {
                          id: Date.now() + 1,
                          text: replies[Math.floor(Math.random() * replies.length)],
                          sender: 'them',
                          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          read: false
                }
                setThreads(prev => prev.map(t =>
                          t.id === active.id
                                                      ? { ...t, messages: [...t.messages, reply], lastMessage: reply.text, lastTime: 'Just now' }
                            : t
                                                  ))
                setActive(prev => ({ ...prev, messages: [...prev.messages, reply] }))
        }, 1500)
  }

  const openThread = (thread: Thread) => {
        const updated = threads.map(t => t.id === thread.id ? { ...t, unread: 0 } : t)
        setThreads(updated)
        setActive({ ...thread, unread: 0 })
  }

  const deleteThread = (id: number) => {
        const remaining = threads.filter(t => t.id !== id)
        setThreads(remaining)
        if (active.id === id && remaining.length > 0) setActive(remaining[0])
        setDeleteConfirm(null)
  }

  const createThread = () => {
        if (!composeName.trim()) return
        const initials = composeName.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        const colors = ['from-blue-400 to-indigo-500', 'from-purple-400 to-pink-500', 'from-emerald-400 to-teal-500', 'from-amber-400 to-orange-500']
        const newThread: Thread = {
                id: Date.now(),
                name: composeName.trim(),
                role: composeRole.trim() || 'Contact',
                initials,
                color: colors[Math.floor(Math.random() * colors.length)],
                lastMessage: 'New conversation',
                lastTime: 'Now',
                unread: 0,
                messages: []
        }
        setThreads(prev => [newThread, ...prev])
        setActive(newThread)
        setComposeName('')
        setComposeRole('')
        setShowCompose(false)
  }

  const totalUnread = threads.reduce((sum, t) => sum + t.unread, 0)

  return (
        <div className="flex h-screen bg-[#04080F] overflow-hidden">
              <Sidebar />
              <div className="flex flex-col flex-1 min-w-0 ml-64">
                      <TopHeader />
                      <div className="flex flex-1 min-h-0">
                        {/* Thread list */}
                                <div className="w-72 flex-shrink-0 border-r border-[#1A2540] flex flex-col bg-[#060C18]">
                                            <div className="p-4 border-b border-[#1A2540]">
                                                          <div className="flex items-center justify-between mb-3">
                                                                          <div className="flex items-center gap-2">
                                                                                            <h2 className="text-sm font-bold text-white">Messages</h2>h2>
                                                                            {totalUnread > 0 && (
                              <span className="text-[10px] font-bold bg-amber-400 text-black rounded-full px-1.5 py-0.5">{totalUnread}</span>span>
                                                                                            )}
                                                                          </div>div>
                                                                          <button
                                                                                              onClick={() => setShowCompose(true)}
                                                                                              className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center hover:bg-amber-400/20 transition-colors"
                                                                                            >
                                                                                            <Plus className="w-3.5 h-3.5 text-amber-400" />
                                                                          </button>button>
                                                          </div>div>
                                                          <div className="relative">
                                                                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                                                                          <input
                                                                                              value={search}
                                                                                              onChange={e => setSearch(e.target.value)}
                                                                                              placeholder="Search messages..."
                                                                                              className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
                                                                                            />
                                                          </div>div>
                                            </div>div>
                                            <div className="flex-1 overflow-y-auto">
                                              {filtered.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-500 mt-8">No conversations found</div>div>
                        ) : filtered.map(thread => (
                          <div
                                              key={thread.id}
                                              className={`group relative flex items-start gap-3 p-4 cursor-pointer border-b border-[#1A2540] transition-colors ${active.id === thread.id ? 'bg-amber-400/5 border-l-2 border-l-amber-400' : 'hover:bg-white/3'}`}
                                              onClick={() => openThread(thread)}
                                            >
                                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${thread.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                                              {thread.initials}
                                            </div>div>
                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between mb-0.5">
                                                                                      <span className="text-xs font-semibold text-white truncate">{thread.name}</span>span>
                                                                                      <span className="text-[10px] text-slate-500 flex-shrink-0 ml-1">{thread.lastTime}</span>span>
                                                                </div>div>
                                                                <p className="text-[10px] text-slate-500 mb-0.5">{thread.role}</p>p>
                                                                <p className={`text-[11px] truncate ${thread.unread > 0 ? 'text-slate-300 font-medium' : 'text-slate-500'}`}>
                                                                  {thread.lastMessage}
                                                                </p>p>
                                            </div>div>
                            {thread.unread > 0 && (
                                                                  <span className="absolute right-3 top-3 w-4 h-4 bg-amber-400 text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                                                                    {thread.unread}
                                                                  </span>span>
                                            )}
                            {deleteConfirm === thread.id ? (
                                                                  <div className="absolute inset-0 bg-[#0A1020]/95 flex items-center justify-center gap-2 z-10">
                                                                                        <span className="text-xs text-slate-300">Delete?</span>span>
                                                                                        <button onClick={e => { e.stopPropagation(); deleteThread(thread.id) }} className="text-xs text-red-400 hover:text-red-300 font-semibold">Yes</button>button>
                                                                                        <button onClick={e => { e.stopPropagation(); setDeleteConfirm(null) }} className="text-xs text-slate-400 hover:text-slate-300">No</button>button>
                                                                  </div>div>
                                                                ) : (
                                                                  <button
                                                                                          onClick={e => { e.stopPropagation(); setDeleteConfirm(thread.id) }}
                                                                                          className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-500/10"
                                                                                        >
                                                                                        <Trash2 className="w-3 h-3 text-slate-500 hover:text-red-400" />
                                                                  </button>button>
                                            )}
                          </div>div>
                        ))}
                                            </div>div>
                                </div>div>
                      
                        {/* Chat area */}
                                <div className="flex flex-col flex-1 min-w-0">
                                  {/* Chat header */}
                                            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A2540] bg-[#060C18]">
                                                          <div className="flex items-center gap-3">
                                                                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${active.color} flex items-center justify-center text-white text-xs font-bold`}>
                                                                            {active.initials}
                                                                          </div>div>
                                                                          <div>
                                                                                            <p className="text-sm font-semibold text-white">{active.name}</p>p>
                                                                                            <p className="text-xs text-slate-500">{active.role}</p>p>
                                                                          </div>div>
                                                          </div>div>
                                            </div>div>
                                
                                  {/* Messages */}
                                            <div className="flex-1 overflow-y-auto p-6 space-y-3">
                                              {active.messages.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-slate-500">
                                            <p className="text-sm">No messages yet</p>p>
                                            <p className="text-xs mt-1">Send a message to start the conversation</p>p>
                          </div>div>
                        ) : active.messages.map((msg, i) => (
                          <motion.div
                                              key={msg.id}
                                              initial={{ opacity: 0, y: 8 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              transition={{ delay: i < 4 ? 0 : 0.1 }}
                                              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                            >
                            {msg.sender === 'them' && (
                                                                  <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${active.color} flex items-center justify-center text-white text-[9px] font-bold mr-2 flex-shrink-0 mt-auto`}>
                                                                    {active.initials[0]}
                                                                  </div>div>
                                            )}
                                            <div className={`max-w-xs lg:max-w-md ${msg.sender === 'me' ? 'items-end' : 'items-start'} flex flex-col`}>
                                                                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                                                    msg.sender === 'me'
                                                                      ? 'bg-amber-400 text-black rounded-br-sm font-medium'
                                                                      : 'bg-[#0A1020] border border-[#1A2540] text-slate-200 rounded-bl-sm'
                                            }`}>
                                                                  {msg.text}
                                                                </div>div>
                                                                <div className={`flex items-center gap-1 mt-1 ${msg.sender === 'me' ? 'flex-row-reverse' : ''}`}>
                                                                                      <span className="text-[10px] text-slate-600">{msg.time}</span>span>
                                                                  {msg.sender === 'me' && (
                                                                      msg.read
                                                                        ? <CheckCheck className="w-3 h-3 text-amber-400" />
                                                                        : <Check className="w-3 h-3 text-slate-600" />
                                                                    )}
                                                                </div>div>
                                            </div>div>
                          </motion.div>motion.div>
                        ))}
                                                          <div ref={bottomRef} />
                                            </div>div>
                                
                                  {/* Input */}
                                            <div className="px-6 py-4 border-t border-[#1A2540] bg-[#060C18]">
                                                          <div className="flex items-center gap-3">
                                                                          <input
                                                                                              value={input}
                                                                                              onChange={e => setInput(e.target.value)}
                                                                                              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                                                                                              placeholder={`Message ${active.name}...`}
                                                                                              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 transition-colors"
                                                                                            />
                                                                          <button
                                                                                              onClick={sendMessage}
                                                                                              disabled={!input.trim()}
                                                                                              className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center hover:bg-amber-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                                                                                            >
                                                                                            <Send className="w-4 h-4 text-black" />
                                                                          </button>button>
                                                          </div>div>
                                            </div>div>
                                </div>div>
                      </div>div>
              </div>div>
        
          {/* Compose modal */}
              <AnimatePresence>
                {showCompose && (
                    <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                                  onClick={() => setShowCompose(false)}
                                >
                                <motion.div
                                                initial={{ scale: 0.95, y: 20 }}
                                                animate={{ scale: 1, y: 0 }}
                                                exit={{ scale: 0.95, y: 20 }}
                                                className="bg-[#0A1020] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
                                                onClick={e => e.stopPropagation()}
                                              >
                                              <div className="flex items-center justify-between mb-5">
                                                              <h3 className="text-base font-bold text-white">New Conversation</h3>h3>
                                                              <button onClick={() => setShowCompose(false)} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>button>
                                              </div>div>
                                              <div className="space-y-3 mb-5">
                                                              <div>
                                                                                <label className="text-xs text-slate-400 mb-1 block">Name</label>label>
                                                                                <input
                                                                                                      value={composeName}
                                                                                                      onChange={e => setComposeName(e.target.value)}
                                                                                                      placeholder="Contact name"
                                                                                                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
                                                                                                    />
                                                              </div>div>
                                                              <div>
                                                                                <label className="text-xs text-slate-400 mb-1 block">Role</label>label>
                                                                                <input
                                                                                                      value={composeRole}
                                                                                                      onChange={e => setComposeRole(e.target.value)}
                                                                                                      placeholder="e.g. Director of Photography"
                                                                                                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
                                                                                                    />
                                                              </div>div>
                                              </div>div>
                                              <button
                                                                onClick={createThread}
                                                                disabled={!composeName.trim()}
                                                                className="w-full py-2.5 bg-amber-400 text-black font-bold rounded-xl text-sm hover:bg-amber-300 transition-colors disabled:opacity-40"
                                                              >
                                                              Start Conversation
                                              </button>button>
                                </motion.div>motion.div>
                    </motion.div>motion.div>
                  )}
              </AnimatePresence>AnimatePresence>
        </div>div>
      )
}</div>
