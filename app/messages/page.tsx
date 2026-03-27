'use client'
import { useState, useRef, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'
import { Send, Plus, X, Trash2, Search, Check, CheckCheck } from 'lucide-react'

export const dynamic = 'force-dynamic'

type Message = { id: string; text: string; from: 'me' | 'them'; time: string; read: boolean }
type Thread = { id: string; name: string; role: string; lastMessage: string; time: string; unread: number; messages: Message[] }

const initialThreads: Thread[] = [
  { id: 't1', name: 'Jordan Ellis', role: 'UI/UX Designer', lastMessage: 'Can we move the call to 3pm?', time: '10:42', unread: 2, messages: [
    { id: 'm1', text: 'Hi, just confirming the design review for next week.', from: 'them', time: '10:30', read: true },
    { id: 'm2', text: 'Yes, we are confirmed for Monday through Wednesday.', from: 'me', time: '10:35', read: true },
    { id: 'm3', text: 'Can we move the call to 3pm?', from: 'them', time: '10:42', read: false },
  ]},
  { id: 't2', name: 'Sam Rivera', role: 'Project Manager', lastMessage: 'Budget approved. Starting Monday.', time: 'Yesterday', unread: 0, messages: [
    { id: 'm4', text: 'The client has reviewed the quote.', from: 'them', time: 'Yesterday', read: true },
    { id: 'm5', text: 'Budget approved. Starting Monday.', from: 'them', time: 'Yesterday', read: true },
  ]},
  { id: 't3', name: 'Alex Chen', role: 'Full-Stack Developer', lastMessage: 'Dev environment access sent to your email.', time: 'Mon', unread: 1, messages: [
    { id: 'm6', text: 'Dev environment access sent to your email.', from: 'them', time: 'Mon', read: false },
  ]},
]

export default function MessagesPage() {
  const [threads, setThreads] = useState<Thread[]>(initialThreads)
  const [activeId, setActiveId] = useState('t1')
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const [showCompose, setShowCompose] = useState(false)
  const [composeName, setComposeName] = useState('')
  const [composeRole, setComposeRole] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const active = threads.find(t => t.id === activeId) ?? threads[0]
  const filteredThreads = threads.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.lastMessage.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeId, active?.messages.length])

  const selectThread = (id: string) => {
    setThreads(prev => prev.map(t => t.id === id ? { ...t, unread: 0, messages: t.messages.map(m => ({ ...m, read: true })) } : t))
    setActiveId(id)
  }

  const sendMessage = () => {
    const text = input.trim()
    if (!text || !active) return
    const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    const newMsg: Message = { id: 'm' + Date.now(), text, from: 'me', time: now, read: true }
    setThreads(prev => prev.map(t => t.id === active.id ? { ...t, messages: [...t.messages, newMsg], lastMessage: text, time: now } : t))
    setInput('')
    setTimeout(() => {
      const replies = ['Got it, thanks!', 'On it.', 'Sounds good.', 'Will confirm shortly.', 'Perfect.']
      const reply: Message = { id: 'm' + (Date.now() + 1), text: replies[Math.floor(Math.random() * replies.length)], from: 'them', time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), read: false }
      setThreads(prev => prev.map(t => t.id === active.id ? { ...t, messages: [...t.messages, newMsg, reply], lastMessage: reply.text } : t))
    }, 1500)
  }

  const createThread = () => {
    if (!composeName.trim()) return
    const newThread: Thread = { id: 't' + Date.now(), name: composeName.trim(), role: composeRole.trim() || 'Freelancer', lastMessage: 'No messages yet', time: 'Just now', unread: 0, messages: [] }
    setThreads(prev => [newThread, ...prev])
    setActiveId(newThread.id)
    setShowCompose(false)
    setComposeName('')
    setComposeRole('')
  }

  const deleteThread = (id: string) => {
    const remaining = threads.filter(t => t.id !== id)
    setThreads(remaining)
    setDeleteConfirm(null)
    if (activeId === id && remaining.length > 0) setActiveId(remaining[0].id)
  }

  return (
    <div className="flex h-screen bg-[#04080F] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <TopHeader />
        <div className="flex flex-1 overflow-hidden">
          <div className="w-72 border-r border-white/5 flex flex-col bg-[#0A1020]">
            <div className="p-3 border-b border-white/5">
              <div className="relative mb-2">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..." className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
              </div>
              <button onClick={() => setShowCompose(true)} className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-amber-400 text-black font-semibold rounded-lg text-xs hover:bg-amber-300 transition-colors"><Plus size={13} />New Conversation</button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredThreads.map(thread => (
                <div key={thread.id} onClick={() => selectThread(thread.id)} className={`flex items-start gap-3 px-3 py-3 cursor-pointer border-b border-white/5 transition-colors group ${activeId === thread.id ? 'bg-amber-400/10 border-l-2 border-l-amber-400' : 'hover:bg-white/5'}`}>
                  <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0 mt-0.5"><span className="text-amber-400 font-bold text-xs">{thread.name.split(' ').map(n => n[0]).join('')}</span></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-white truncate">{thread.name}</p>
                      <div className="flex items-center gap-1"><span className="text-xs text-slate-500 shrink-0">{thread.time}</span><button onClick={e => { e.stopPropagation(); setDeleteConfirm(thread.id) }} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-all"><Trash2 size={11} /></button></div>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{thread.lastMessage}</p>
                  </div>
                  {thread.unread > 0 && <span className="w-4 h-4 bg-amber-400 text-black text-xs font-bold rounded-full flex items-center justify-center shrink-0 mt-1">{thread.unread}</span>}
                </div>
              ))}
            </div>
          </div>

          {active ? (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5 bg-[#0A1020]">
                <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center"><span className="text-amber-400 font-bold text-xs">{active.name.split(' ').map(n => n[0]).join('')}</span></div>
                <div><p className="text-sm font-semibold text-white">{active.name}</p><p className="text-xs text-slate-400">{active.role}</p></div>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {active.messages.length === 0 && <div className="flex items-center justify-center h-full"><p className="text-slate-500 text-sm">No messages yet. Say hello!</p></div>}
                {active.messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs rounded-2xl px-4 py-2.5 ${msg.from === 'me' ? 'bg-amber-400 text-black rounded-br-sm' : 'bg-[#0F1A2E] text-white rounded-bl-sm border border-white/5'}`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <div className={`flex items-center gap-1 mt-1 ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <span className={`text-xs ${msg.from === 'me' ? 'text-black/60' : 'text-slate-500'}`}>{msg.time}</span>
                        {msg.from === 'me' && (msg.read ? <CheckCheck size={11} className="text-black/60" /> : <Check size={11} className="text-black/60" />)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="px-5 py-3 border-t border-white/5 bg-[#0A1020]">
                <div className="flex items-center gap-3">
                  <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())} placeholder={`Message ${active.name}...`} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" />
                  <button onClick={sendMessage} disabled={!input.trim()} className="p-2.5 bg-amber-400 text-black rounded-xl hover:bg-amber-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"><Send size={16} /></button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center"><p className="text-slate-500 text-sm">Select a conversation to start messaging</p></div>
          )}
        </div>
      </div>

      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowCompose(false)}>
          <div className="bg-[#0A1020] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5"><h2 className="text-base font-bold text-white">New Conversation</h2><button onClick={() => setShowCompose(false)} className="text-slate-400 hover:text-white"><X size={18} /></button></div>
            <div className="space-y-3 mb-5">
              <div><label className="text-xs text-slate-400 mb-1 block">Name *</label><input value={composeName} onChange={e => setComposeName(e.target.value)} placeholder="Contact name" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" /></div>
              <div><label className="text-xs text-slate-400 mb-1 block">Role</label><input value={composeRole} onChange={e => setComposeRole(e.target.value)} placeholder="e.g. Director, Editor" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50" /></div>
            </div>
            <button onClick={createThread} disabled={!composeName.trim()} className="w-full py-2.5 bg-amber-400 text-black font-bold rounded-xl text-sm hover:bg-amber-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Start Conversation</button>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0A1020] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Delete Conversation</h3>
            <p className="text-sm text-slate-400 mb-6">This will permanently remove the thread. Are you sure?</p>
            <div className="flex gap-3"><button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-white/10 text-slate-300 rounded-xl text-sm hover:bg-white/5 transition-colors">Cancel</button><button onClick={() => deleteThread(deleteConfirm)} className="flex-1 py-2.5 bg-rose-500 text-white font-semibold rounded-xl text-sm hover:bg-rose-600 transition-colors">Delete</button></div>
          </div>
        </div>
      )}
    </div>
  )
                }
