'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import clsx from 'clsx'
import {
  Send, Search, Plus, MoreVertical, Phone, Video,
  Paperclip, Smile, ArrowLeft, Circle, CheckCheck,
  Hash, Lock, Users, MessageSquare, X, Loader2
} from 'lucide-react'

interface Thread {
  id: string
  name: string
  last_message?: string
  last_message_at?: string
  unread_count?: number
  is_group?: boolean
  avatar_color?: string
}

interface Message {
  id: string
  thread_id: string
  content: string
  sender_name: string
  created_at: string
  is_own?: boolean
}

const MOCK_THREADS: Thread[] = [
  { id: '1', name: 'Alice Morgan', last_message: 'The raw footage looks great!', last_message_at: '2m ago', unread_count: 3, avatar_color: 'bg-blue-500' },
  { id: '2', name: 'Production Team', last_message: 'Call sheet for tomorrow sent', last_message_at: '1h ago', unread_count: 1, is_group: true, avatar_color: 'bg-purple-500' },
  { id: '3', name: 'James Whitfield', last_message: 'Invoice approved ✓', last_message_at: '3h ago', unread_count: 0, avatar_color: 'bg-emerald-500' },
  { id: '4', name: 'Sound Dept', last_message: 'Boom op confirmed for Monday', last_message_at: 'Yesterday', unread_count: 0, is_group: true, avatar_color: 'bg-amber-500' },
  { id: '5', name: 'Rachel Chen', last_message: 'Rate card attached', last_message_at: 'Mon', unread_count: 0, avatar_color: 'bg-rose-500' },
]

const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    { id: 'm1', thread_id: '1', content: 'Hey! Just finished reviewing the footage from yesterday.', sender_name: 'Alice Morgan', created_at: '10:15', is_own: false },
    { id: 'm2', thread_id: '1', content: 'The lighting in scene 3 is absolutely perfect.', sender_name: 'Alice Morgan', created_at: '10:16', is_own: false },
    { id: 'm3', thread_id: '1', content: 'Thanks! We spent a long time setting that up. Really happy with it.', sender_name: 'You', created_at: '10:22', is_own: true },
    { id: 'm4', thread_id: '1', content: 'The raw footage looks great!', sender_name: 'Alice Morgan', created_at: '10:45', is_own: false },
  ],
  '2': [
    { id: 'm5', thread_id: '2', content: 'Morning everyone! Quick reminder — wrap is at 18:00 tomorrow.', sender_name: 'James', created_at: '09:00', is_own: false },
    { id: 'm6', thread_id: '2', content: 'Got it, will make sure the kit is packed by 17:30.', sender_name: 'Rachel', created_at: '09:12', is_own: false },
    { id: 'm7', thread_id: '2', content: 'Call sheet for tomorrow sent', sender_name: 'You', created_at: '09:30', is_own: true },
  ],
}

function AvatarInitials({ name, colorClass, size = 'md' }: { name: string; colorClass?: string; size?: 'sm' | 'md' | 'lg' }) {
  const colors = ['bg-blue-500','bg-purple-500','bg-emerald-500','bg-amber-500','bg-rose-500','bg-cyan-500']
  const idx = name.charCodeAt(0) % colors.length
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-11 h-11 text-sm' }
  return (
    <div className={clsx('rounded-full flex items-center justify-center font-bold text-white flex-shrink-0', colorClass ?? colors[idx], sizes[size])}>
      {initials}
    </div>
  )
}

export const dynamic = 'force-dynamic'

export default function MessagesPage() {
  const supabase = createClient()
  const [threads, setThreads] = useState<Thread[]>(MOCK_THREADS)
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [search, setSearch] = useState('')
  const [sending, setSending] = useState(false)
  const [showMobileThread, setShowMobileThread] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (selectedThread) {
      setMessages(MOCK_MESSAGES[selectedThread.id] ?? [])
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [selectedThread])

  function selectThread(t: Thread) {
    setSelectedThread(t)
    setShowMobileThread(true)
    // Mark as read
    setThreads(prev => prev.map(th => th.id === t.id ? { ...th, unread_count: 0 } : th))
  }

  async function sendMessage() {
    if (!newMessage.trim() || !selectedThread || sending) return
    setSending(true)
    const msg: Message = {
      id: Date.now().toString(),
      thread_id: selectedThread.id,
      content: newMessage.trim(),
      sender_name: 'You',
      created_at: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      is_own: true,
    }
    setMessages(prev => [...prev, msg])
    setNewMessage('')
    setSending(false)
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const filteredThreads = threads.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  )
  const totalUnread = threads.reduce((sum, t) => sum + (t.unread_count ?? 0), 0)

  return (
    <div className="h-[calc(100vh-4rem)] bg-[#04080F] flex overflow-hidden">
      {/* Sidebar */}
      <div className={clsx(
        'w-full md:w-80 lg:w-96 flex-shrink-0 flex flex-col border-r border-white/[0.06] bg-[#060C18]',
        showMobileThread && 'hidden md:flex'
      )}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white">Messages</h2>
              {totalUnread > 0 && (
                <span className="px-2 py-0.5 bg-amber-500 text-black text-xs font-bold rounded-full">{totalUnread}</span>
              )}
            </div>
            <button className="p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-4 py-2 bg-[#0A1020] border border-white/[0.06] rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-500/50 transition-all" />
          </div>
        </div>

        {/* Thread List */}
        <div className="flex-1 overflow-y-auto py-2">
          {filteredThreads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <MessageSquare className="w-8 h-8 text-white/20 mb-3" />
              <p className="text-sm text-white/40">No conversations found</p>
            </div>
          ) : (
            filteredThreads.map(t => (
              <button key={t.id} onClick={() => selectThread(t)}
                className={clsx(
                  'w-full flex items-center gap-3 px-4 py-3 transition-all text-left',
                  selectedThread?.id === t.id
                    ? 'bg-amber-500/10 border-r-2 border-r-amber-500'
                    : 'hover:bg-white/5'
                )}>
                <div className="relative">
                  <AvatarInitials name={t.name} colorClass={t.avatar_color} />
                  {t.is_group && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#060C18] rounded-full flex items-center justify-center">
                      <Users className="w-2.5 h-2.5 text-white/40" />
                    </div>
                  )}
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#060C18]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={clsx('text-sm font-medium truncate', (t.unread_count ?? 0) > 0 ? 'text-white' : 'text-white/80')}>{t.name}</span>
                    <span className="text-xs text-white/30 flex-shrink-0">{t.last_message_at}</span>
                  </div>
                  <div className="flex items-center justify-between gap-1 mt-0.5">
                    <p className="text-xs text-white/40 truncate">{t.last_message}</p>
                    {(t.unread_count ?? 0) > 0 && (
                      <span className="flex-shrink-0 w-5 h-5 bg-amber-500 text-black text-xs font-bold rounded-full flex items-center justify-center">{t.unread_count}</span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={clsx(
        'flex-1 flex flex-col',
        !showMobileThread && 'hidden md:flex'
      )}>
        {selectedThread ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-[#060C18]">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowMobileThread(false)} className="md:hidden p-2 rounded-xl hover:bg-white/10 text-white/50 transition-all mr-1">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="relative">
                  <AvatarInitials name={selectedThread.name} colorClass={selectedThread.avatar_color} size="md" />
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#060C18]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">{selectedThread.name}</h3>
                  <p className="text-xs text-emerald-400">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all">
                  <Video className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Date divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-xs text-white/25 px-3 py-1 bg-[#0A1020] rounded-full border border-white/[0.06]">Today</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              {messages.map((msg, i) => {
                const isOwn = msg.is_own
                const prevMsg = messages[i - 1]
                const showAvatar = !prevMsg || prevMsg.sender_name !== msg.sender_name
                return (
                  <div key={msg.id} className={clsx('flex items-end gap-2', isOwn ? 'flex-row-reverse' : 'flex-row')}>
                    {!isOwn && (
                      <div className="w-8 flex-shrink-0">
                        {showAvatar && <AvatarInitials name={msg.sender_name} size="sm" />}
                      </div>
                    )}
                    <div className={clsx('max-w-xs lg:max-w-md xl:max-w-lg group', isOwn ? 'items-end' : 'items-start', 'flex flex-col gap-1')}>
                      {showAvatar && !isOwn && (
                        <span className="text-xs text-white/40 ml-1">{msg.sender_name}</span>
                      )}
                      <div className={clsx(
                        'px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
                        isOwn
                          ? 'bg-amber-500 text-black rounded-br-md'
                          : 'bg-[#0A1020] border border-white/[0.06] text-white/90 rounded-bl-md'
                      )}>
                        {msg.content}
                      </div>
                      <div className={clsx('flex items-center gap-1', isOwn ? 'flex-row-reverse' : 'flex-row')}>
                        <span className="text-xs text-white/25">{msg.created_at}</span>
                        {isOwn && <CheckCheck className="w-3 h-3 text-amber-400" />}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/[0.06] bg-[#060C18]">
              <div className="flex items-center gap-3 bg-[#0A1020] border border-white/[0.06] rounded-2xl px-4 py-2 focus-within:border-amber-500/40 transition-all">
                <button className="p-1 text-white/30 hover:text-white/60 transition-all flex-shrink-0">
                  <Paperclip className="w-4 h-4" />
                </button>
                <input ref={inputRef}
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Message ${selectedThread.name}...`}
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/25 focus:outline-none py-1" />
                <button className="p-1 text-white/30 hover:text-white/60 transition-all flex-shrink-0">
                  <Smile className="w-4 h-4" />
                </button>
                <button onClick={sendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="w-8 h-8 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black rounded-xl flex items-center justify-center transition-all flex-shrink-0">
                  {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-xs text-white/20 text-center mt-2">Press Enter to send · Shift+Enter for new line</p>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 rounded-3xl bg-[#0A1020] border border-white/[0.06] flex items-center justify-center mb-6">
              <MessageSquare className="w-9 h-9 text-white/20" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Your messages</h3>
            <p className="text-sm text-white/40 max-w-xs mb-6">Send direct messages to crew members or chat with your production teams</p>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold rounded-xl transition-all">
              <Plus className="w-4 h-4" />
              New Message
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
