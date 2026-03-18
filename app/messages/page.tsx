'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Send, X, MessageSquare, ChevronRight, Search } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Thread {
  id: string
  title: string
  project_id: string | null
  created_at: string
  last_message?: string
  message_count?: number
}

interface Message {
  id: string
  thread_id: string
  content: string
  sender_name: string
  created_at: string
  is_own: boolean
}

export default function MessagesPage() {
  const supabase = createClient()
  const [threads, setThreads] = useState<Thread[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [activeThread, setActiveThread] = useState<Thread | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [showNewThread, setShowNewThread] = useState(false)
  const [newThreadTitle, setNewThreadTitle] = useState('')
  const [search, setSearch] = useState('')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const loadThreads = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setCurrentUser(user)
    
    const { data } = await supabase
      .from('message_threads')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    // Get message counts and last messages
    const enriched = await Promise.all((data || []).map(async (thread) => {
      const { data: msgs } = await supabase
        .from('messages')
        .select('content, created_at')
        .eq('thread_id', thread.id)
        .order('created_at', { ascending: false })
        .limit(1)
      return {
        ...thread,
        last_message: msgs?.[0]?.content || 'No messages yet',
        message_count: msgs?.length || 0,
      }
    }))
    
    setThreads(enriched)
    setLoading(false)
  }

  const loadMessages = async (thread: Thread) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('thread_id', thread.id)
      .order('created_at', { ascending: true })
    setMessages((data || []).map(m => ({
      ...m,
      is_own: m.sender_id === user.id,
    })))
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  useEffect(() => { loadThreads() }, [])
  
  useEffect(() => {
    if (activeThread) loadMessages(activeThread)
  }, [activeThread])

  const createThread = async () => {
    if (!newThreadTitle.trim()) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('message_threads')
      .insert({ title: newThreadTitle, user_id: user.id })
      .select()
      .single()
    setNewThreadTitle('')
    setShowNewThread(false)
    await loadThreads()
    if (data) setActiveThread(data)
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeThread) return
    setSending(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const senderName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'You'
    await supabase.from('messages').insert({
      thread_id: activeThread.id,
      content: newMessage,
      sender_id: user.id,
      sender_name: senderName,
      user_id: user.id,
    })
    setNewMessage('')
    await loadMessages(activeThread)
    await loadThreads()
    setSending(false)
  }

  const deleteThread = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Delete this thread?')) return
    await supabase.from('messages').delete().eq('thread_id', id)
    await supabase.from('message_threads').delete().eq('id', id)
    if (activeThread?.id === id) setActiveThread(null)
    await loadThreads()
  }

  const filtered = threads.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 bg-[#0A1020] border-r border-white/5 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold">Messages</h2>
            <button onClick={() => setShowNewThread(true)} className="p-1.5 text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search threads..."
              className="w-full bg-[#04080F] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-white text-xs focus:outline-none" />
          </div>
        </div>

        {/* New Thread Form */}
        {showNewThread && (
          <div className="p-3 border-b border-white/5 bg-[#04080F]">
            <input value={newThreadTitle} onChange={e => setNewThreadTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createThread()}
              placeholder="Thread title..." autoFocus
              className="w-full bg-[#0A1020] border border-amber-400/30 rounded px-2 py-1.5 text-white text-xs focus:outline-none mb-2" />
            <div className="flex gap-2">
              <button onClick={() => setShowNewThread(false)} className="flex-1 text-xs text-gray-400 py-1 rounded border border-white/10 hover:bg-white/5">Cancel</button>
              <button onClick={createThread} disabled={!newThreadTitle.trim()} className="flex-1 text-xs bg-amber-500 text-black font-medium py-1 rounded hover:bg-amber-400 disabled:opacity-50">Create</button>
            </div>
          </div>
        )}

        {/* Thread List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500 text-sm">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-4 text-center">
              <MessageSquare className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 text-xs">{search ? 'No matches' : 'No threads yet'}</p>
            </div>
          ) : (
            filtered.map(thread => (
              <div key={thread.id} onClick={() => setActiveThread(thread)}
                className={`p-3 cursor-pointer border-b border-white/5 hover:bg-white/3 transition-colors group relative ${activeThread?.id === thread.id ? 'bg-amber-400/5 border-l-2 border-l-amber-400' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{thread.title}</p>
                    <p className="text-gray-500 text-xs truncate mt-0.5">{thread.last_message}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                    <button onClick={e => deleteThread(thread.id, e)} className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#04080F]">
        {!activeThread ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">Select a thread or create a new one</p>
              <button onClick={() => setShowNewThread(true)} className="mt-4 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors text-sm">
                Start a conversation
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Thread Header */}
            <div className="px-6 py-4 border-b border-white/5 bg-[#0A1020]">
              <h2 className="text-white font-semibold">{activeThread.title}</h2>
              <p className="text-gray-500 text-xs mt-0.5">{messages.length} message{messages.length !== 1 ? 's' : ''}</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 text-sm py-8">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.is_own ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md ${msg.is_own ? 'items-end' : 'items-start'} flex flex-col`}>
                      {!msg.is_own && (
                        <span className="text-xs text-gray-500 mb-1 ml-1">{msg.sender_name}</span>
                      )}
                      <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                        msg.is_own 
                          ? 'bg-amber-500 text-black rounded-br-md' 
                          : 'bg-[#0A1020] text-gray-200 border border-white/5 rounded-bl-md'
                      }`}>
                        {msg.content}
                      </div>
                      <span className="text-xs text-gray-600 mt-1 mx-1">
                        {new Date(msg.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/5 bg-[#0A1020]">
              <div className="flex gap-3">
                <input value={newMessage} onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Type a message... (Enter to send)"
                  className="flex-1 bg-[#04080F] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400/40" />
                <button onClick={sendMessage} disabled={sending || !newMessage.trim()}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
