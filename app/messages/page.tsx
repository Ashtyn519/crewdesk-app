'use client'
export const dynamic = 'force-dynamic'
import { useState, useRef, useEffect, useCallback } from 'react'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'
import { createClient } from '@/lib/supabase/client'
import { Send, Plus, X, Trash2, Search, Check, CheckCheck, MessageSquare, Loader2 } from 'lucide-react'

type Message = {
      id: string
      thread_id: string
      text: string
      sender: 'me' | 'them'
      sent_at: string
      read: boolean
}

type Thread = {
      id: string
      workspace_id: string
      contact_name: string
      contact_role: string
      last_message: string
      last_message_at: string
      unread_count: number
}

export default function MessagesPage() {
      const [threads, setThreads] = useState<Thread[]>([])
      const [messages, setMessages] = useState<Message[]>([])
      const [activeId, setActiveId] = useState<string | null>(null)
      const [workspaceId, setWorkspaceId] = useState<string | null>(null)
      const [loading, setLoading] = useState(true)
      const [loadingMessages, setLoadingMessages] = useState(false)
      const [input, setInput] = useState('')
      const [search, setSearch] = useState('')
      const [showCompose, setShowCompose] = useState(false)
      const [composeName, setComposeName] = useState('')
      const [composeRole, setComposeRole] = useState('')
      const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
      const [sending, setSending] = useState(false)
      const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeThread = threads.find(t => t.id === activeId) ?? null

  const loadThreads = useCallback(async () => {
          const sb = createClient()
          const { data: { user } } = await sb.auth.getUser()
          if (!user) return

                                      const { data: ws } = await sb.from('workspaces').select('id').eq('user_id', user.id).single()
          if (!ws) { setLoading(false); return }

                                      setWorkspaceId(ws.id)

                                      const { data } = await sb
            .from('message_threads')
            .select('*')
            .eq('workspace_id', ws.id)
            .order('last_message_at', { ascending: false })

                                      setThreads(data || [])
          if (data && data.length > 0) setActiveId(data[0].id)
          setLoading(false)
  }, [])

  const loadMessages = useCallback(async (threadId: string) => {
          setLoadingMessages(true)
          const sb = createClient()
          const { data } = await sb
            .from('chat_messages')
            .select('*')
            .eq('thread_id', threadId)
            .order('sent_at', { ascending: true })

                                       setMessages(data || [])
          setLoadingMessages(false)

                                       await sb.from('chat_messages').update({ read: true }).eq('thread_id', threadId).eq('sender', 'them')
          setThreads(prev => prev.map(t => t.id === threadId ? { ...t, unread_count: 0 } : t))
  }, [])

  useEffect(() => { loadThreads() }, [loadThreads])

  useEffect(() => {
          if (activeId) loadMessages(activeId)
  }, [activeId, loadMessages])

  useEffect(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
          const text = input.trim()
          if (!text || !activeId || !workspaceId) return
          setSending(true)
          setInput('')

          const sb = createClient()
          const now = new Date().toISOString()

          const { data: newMsg } = await sb.from('chat_messages').insert({
                    thread_id: activeId,
                    text,
                    sender: 'me',
                    sent_at: now,
                    read: true,
          }).select().single()

          if (newMsg) {
                    setMessages(prev => [...prev, newMsg])
          }

          await sb.from('message_threads').update({
                    last_message: text,
                    last_message_at: now,
          }).eq('id', activeId)

          setThreads(prev => prev.map(t =>
                    t.id === activeId ? { ...t, last_message: text, last_message_at: now } : t
                                          ))

          setSending(false)
  }

  const createThread = async () => {
          if (!composeName.trim() || !workspaceId) return
          const sb = createClient()
          const now = new Date().toISOString()

          const { data } = await sb.from('message_threads').insert({
                    workspace_id: workspaceId,
                    contact_name: composeName.trim(),
                    contact_role: composeRole.trim() || 'Freelancer',
                    last_message: 'No messages yet',
                    last_message_at: now,
                    unread_count: 0,
          }).select().single()

          if (data) {
                    setThreads(prev => [data, ...prev])
                    setActiveId(data.id)
          }
          setShowCompose(false)
          setComposeName('')
          setComposeRole('')
  }

  const deleteThread = async (id: string) => {
          const sb = createClient()
          await sb.from('chat_messages').delete().eq('thread_id', id)
          await sb.from('message_threads').delete().eq('id', id)
          const remaining = threads.filter(t => t.id !== id)
          setThreads(remaining)
          setDeleteConfirm(null)
          if (activeId === id) {
                    setActiveId(remaining.length > 0 ? remaining[0].id : null)
          }
  }

  const filteredThreads = threads.filter(t =>
          t.contact_name.toLowerCase().includes(search.toLowerCase()) ||
          t.last_message.toLowerCase().includes(search.toLowerCase())
                                           )

  const formatTime = (iso: string) => {
          const d = new Date(iso)
          const now = new Date()
          const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000)
          if (diffDays === 0) return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
          if (diffDays === 1) return 'Yesterday'
          if (diffDays < 7) return d.toLocaleDateString('en-GB', { weekday: 'short' })
          return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }

  return (
          <div className="flex h-screen bg-[#04080F] overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                        <TopHeader />
                        <div className="flex flex-1 overflow-hidden">
                                  <div className="w-72 shrink-0 border-r border-white/5 flex flex-col bg-[#0A1020]">
                                              <div className="p-3 border-b border-white/5">
                                                            <div className="relative mb-2">
                                                                            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                                                            <input
                                                                                                  value={search}
                                                                                                  onChange={e => setSearch(e.target.value)}
                                                                                                  placeholder="Search messages..."
                                                                                                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
                                                                                                />
                                                            </div>div>
                                                            <button
                                                                                onClick={() => setShowCompose(true)}
                                                                                className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-amber-400 text-black font-semibold rounded-lg text-xs hover:bg-amber-300 transition-colors"
                                                                              >
                                                                            <Plus size={13} /> New Conversation
                                                            </button>button>
                                              </div>div>
                                              <div className="flex-1 overflow-y-auto">
                                                  {loading && (
                              <div className="flex items-center justify-center py-8">
                                                <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                              </div>div>
                                                            )}
                                                  {!loading && threads.length === 0 && (
                              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                                <MessageSquare className="w-8 h-8 text-white/10 mb-2" />
                                                <p className="text-white/30 text-xs">No conversations yet</p>p>
                              </div>div>
                                                            )}
                                                  {filteredThreads.map(thread => (
                              <div
                                                    key={thread.id}
                                                    onClick={() => setActiveId(thread.id)}
                                                    className={`flex items-start gap-3 px-3 py-3 cursor-pointer border-b border-white/5 transition-colors group ${
                                                                            activeId === thread.id ? 'bg-amber-400/10 border-l-2 border-l-amber-400' : 'hover:bg-white/5'
                                                    }`}
                                                  >
                                                <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0 mt-0.5">
                                                                    <span className="text-amber-400 font-bold text-xs">
                                                                        {thread.contact_name.split(' ').map((n: string) => n[0]).join('')}
                                                                    </span>span>
                                                </div>div>
                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center justify-between">
                                                                                          <p className="text-xs font-semibold text-white truncate">{thread.contact_name}</p>p>
                                                                                          <div className="flex items-center gap-1">
                                                                                                                  <span className="text-xs text-slate-500 shrink-0">{formatTime(thread.last_message_at)}</span>span>
                                                                                                                  <button
                                                                                                                                                onClick={e => { e.stopPropagation(); setDeleteConfirm(thread.id) }}
                                                                                                                                                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-all"
                                                                                                                                              >
                                                                                                                                            <Trash2 size={11} />
                                                                                                                      </button>button>
                                                                                              </div>div>
                                                                    </div>div>
                                                                    <p className="text-xs text-slate-500 truncate mt-0.5">{thread.last_message}</p>p>
                                                </div>div>
                                  {thread.unread_count > 0 && (
                                                                          <span className="w-4 h-4 bg-amber-400 text-black text-xs font-bold rounded-full flex items-center justify-center shrink-0 mt-1">
                                                                              {thread.unread_count}
                                                                          </span>span>
                                                )}
                              </div>div>
                            ))}
                                              </div>div>
                                  </div>div>
                        
                            {activeThread ? (
                          <div className="flex-1 flex flex-col min-w-0">
                                        <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5 bg-[#0A1020]">
                                                        <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                                                                          <span className="text-amber-400 font-bold text-xs">
                                                                              {activeThread.contact_name.split(' ').map((n: string) => n[0]).join('')}
                                                                          </span>span>
                                                        </div>div>
                                                        <div>
                                                                          <p className="text-sm font-semibold text-white">{activeThread.contact_name}</p>p>
                                                                          <p className="text-xs text-slate-400">{activeThread.contact_role}</p>p>
                                                        </div>div>
                                        </div>div>
                                        <div className="flex-1 overflow-y-auto p-5 space-y-3">
                                            {loadingMessages && (
                                                <div className="flex items-center justify-center py-10">
                                                                    <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                                                </div>div>
                                                        )}
                                            {!loadingMessages && messages.length === 0 && (
                                                <div className="flex items-center justify-center h-full">
                                                                    <p className="text-slate-500 text-sm">No messages yet. Say hello!</p>p>
                                                </div>div>
                                                        )}
                                            {!loadingMessages && messages.map(msg => (
                                                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                                                    <div className={`max-w-xs rounded-2xl px-4 py-2.5 ${
                                                                          msg.sender === 'me'
                                                                            ? 'bg-amber-400 text-black rounded-br-sm'
                                                                            : 'bg-[#0F1A2E] text-white rounded-bl-sm border border-white/5'
                                                }`}>
                                                                                          <p className="text-sm leading-relaxed">{msg.text}</p>p>
                                                                                          <div className={`flex items-center gap-1 mt-1 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                                                                                                  <span className={`text-xs ${msg.sender === 'me' ? 'text-black/60' : 'text-slate-500'}`}>
                                                                                                                      {formatTime(msg.sent_at)}
                                                                                                                      </span>span>
                                                                                              {msg.sender === 'me' && (
                                                                              msg.read ? <CheckCheck size={11} className="text-black/60" /> : <Check size={11} className="text-black/60" />
                                                                            )}
                                                                                              </div>div>
                                                                    </div>div>
                                                </div>div>
                                              ))}
                                                        <div ref={messagesEndRef} />
                                        </div>div>
                                        <div className="px-5 py-3 border-t border-white/5 bg-[#0A1020]">
                                                        <div className="flex items-center gap-3">
                                                                          <input
                                                                                    </div>
