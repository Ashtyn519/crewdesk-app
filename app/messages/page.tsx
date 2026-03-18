'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Send, MessageSquare, Plus, Trash2 } from 'lucide-react'

export const dynamic = "force-dynamic";


type Thread = { id: string; title: string; last_message: string; last_message_at: string; unread_count: number }
type Message = { id: string; content: string; sender_id: string; created_at: string }

export default function MessagesPage() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [activeThread, setActiveThread] = useState<Thread|null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [showNewThread, setShowNewThread] = useState(false)
  const [newThreadTitle, setNewThreadTitle] = useState('')
  const [userId, setUserId] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || '')
      const { data } = await supabase.from('message_threads').select('*').eq('user_id', user?.id).order('last_message_at', { ascending: false })
      setThreads(data || [])
      setLoading(false)
    }
    init()
  }, [])

  useEffect(() => {
    if (activeThread) loadMessages(activeThread.id)
  }, [activeThread])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const loadMessages = async (threadId: string) => {
    const { data } = await supabase.from('messages').select('*').eq('thread_id', threadId).order('created_at')
    setMessages(data || [])
    await supabase.from('message_threads').update({ unread_count: 0 }).eq('id', threadId)
    setThreads(prev => prev.map(t => t.id === threadId ? { ...t, unread_count: 0 } : t))
  }

  const sendMessage = async () => {
    if (!input.trim() || !activeThread || sending) return
    setSending(true)
    const content = input.trim()
    setInput('')
    const { data } = await supabase.from('messages').insert({ thread_id: activeThread.id, sender_id: userId, content }).select().single()
    if (data) {
      setMessages(prev => [...prev, data])
      await supabase.from('message_threads').update({ last_message: content, last_message_at: new Date().toISOString() }).eq('id', activeThread.id)
      setThreads(prev => prev.map(t => t.id === activeThread.id ? { ...t, last_message: content, last_message_at: new Date().toISOString() } : t))
    }
    setSending(false)
  }

  const createThread = async () => {
    if (!newThreadTitle.trim()) return
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.from('message_threads').insert({ user_id: user?.id, title: newThreadTitle.trim(), unread_count: 0 }).select().single()
    if (data) {
      setThreads(prev => [data, ...prev])
      setActiveThread(data)
    }
    setNewThreadTitle('')
    setShowNewThread(false)
  }

  const deleteThread = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Delete this thread?')) return
    await supabase.from('messages').delete().eq('thread_id', id)
    await supabase.from('message_threads').delete().eq('id', id)
    setThreads(prev => prev.filter(t => t.id !== id))
    if (activeThread?.id === id) { setActiveThread(null); setMessages([]) }
  }

  const formatTime = (ts: string) => {
    const d = new Date(ts)
    const now = new Date()
    if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  }

  return (
    <div className="flex h-screen md:h-[calc(100vh)] overflow-hidden">
      {/* Thread list */}
      <div className={`w-full md:w-80 bg-[#0A1020] border-r border-slate-800 flex flex-col ${activeThread ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h1 className="text-xl font-black text-white">Messages</h1>
          <button onClick={() => setShowNewThread(true)} className="w-8 h-8 bg-amber-400 hover:bg-amber-300 text-black rounded-lg flex items-center justify-center transition-colors">
            <Plus size={16} />
          </button>
        </div>
        {showNewThread && (
          <div className="p-4 border-b border-slate-800 flex gap-2">
            <input value={newThreadTitle} onChange={e => setNewThreadTitle(e.target.value)} placeholder="Thread name..."
              onKeyDown={e => e.key === 'Enter' && createThread()}
              className="flex-1 bg-[#0F1A2E] border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/50" />
            <button onClick={createThread} className="bg-amber-400 hover:bg-amber-300 text-black px-3 rounded-xl text-sm font-bold transition-colors">Go</button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {loading ? <div className="p-4 text-slate-400 text-sm">Loading...</div> : threads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <MessageSquare size={40} className="text-slate-600 mb-3" />
              <p className="text-slate-400 text-sm">No threads yet</p>
              <button onClick={() => setShowNewThread(true)} className="mt-3 text-amber-400 text-sm">Start a conversation</button>
            </div>
          ) : threads.map(t => (
            <div key={t.id} onClick={() => setActiveThread(t)}
              className={`p-4 border-b border-slate-800/50 cursor-pointer hover:bg-slate-800/30 transition-colors ${activeThread?.id === t.id ? 'bg-amber-400/5 border-l-2 border-l-amber-400' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm truncate">{t.title}</span>
                    {t.unread_count > 0 && <span className="w-5 h-5 bg-amber-400 text-black text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">{t.unread_count}</span>}
                  </div>
                  {t.last_message && <p className="text-slate-500 text-xs mt-0.5 truncate">{t.last_message}</p>}
                </div>
                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                  <span className="text-slate-600 text-xs">{t.last_message_at ? formatTime(t.last_message_at) : ''}</span>
                  <button onClick={e => deleteThread(t.id, e)} className="text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className={`flex-1 flex flex-col ${!activeThread ? 'hidden md:flex' : 'flex'}`}>
        {!activeThread ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <MessageSquare size={64} className="text-slate-700 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Select a conversation</h2>
            <p className="text-slate-400">Choose a thread from the left or create a new one</p>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-slate-800 flex items-center gap-3">
              <button onClick={() => setActiveThread(null)} className="md:hidden text-slate-400 hover:text-white mr-1">←</button>
              <div className="w-8 h-8 bg-amber-400/20 rounded-full flex items-center justify-center text-amber-400 font-bold text-sm">
                {activeThread.title.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-white font-bold text-sm">{activeThread.title}</div>
                <div className="text-slate-500 text-xs">{messages.length} messages</div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-slate-500 text-sm">No messages yet. Say hello!</p>
                </div>
              )}
              {messages.map(msg => {
                const isOwn = msg.sender_id === userId
                return (
                  <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${isOwn ? 'bg-amber-400 text-black rounded-br-md' : 'bg-[#0F1A2E] text-white border border-slate-700 rounded-bl-md'}`}>
                      <p>{msg.content}</p>
                      <p className={`text-xs mt-1 ${isOwn ? 'text-amber-900/60' : 'text-slate-500'}`}>{formatTime(msg.created_at)}</p>
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>
            <div className="p-4 border-t border-slate-800">
              <div className="flex gap-3">
                <input value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                  placeholder="Type a message..."
                  className="flex-1 bg-[#0F1A2E] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 text-sm" />
                <button onClick={sendMessage} disabled={!input.trim() || sending}
                  className="w-11 h-11 bg-amber-400 hover:bg-amber-300 text-black rounded-xl flex items-center justify-center transition-colors disabled:opacity-50">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
