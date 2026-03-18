"use client"
import { useState, useEffect, useRef } from "react"

import { motion, AnimatePresence } from "framer-motion"
import { Send, Search, Plus, MoreHorizontal, Phone, Video, Hash, Circle, Check, CheckCheck, Smile } from "lucide-react"
import clsx from "clsx"

const ease = [0.22, 1, 0.36, 1]

interface Message {
  id: string
  thread_id: string
  sender_name: string
  sender_color: string
  content: string
  created_at: string
  read: boolean
}

interface Thread {
  id: string
  name: string
  avatar_color: string
  role: string
  last_message: string
  last_time: string
  unread: number
  online: boolean
}

const THREADS: Thread[] = [
  { id: "1", name: "Sarah Mitchell", avatar_color: "bg-violet-500", role: "Director of Photography", last_message: "Can you confirm the call sheet for Monday?", last_time: "2m", unread: 3, online: true },
  { id: "2", name: "James Cole", avatar_color: "bg-emerald-500", role: "Gaffer", last_message: "Lighting setup is ready for review", last_time: "14m", unread: 1, online: true },
  { id: "3", name: "Priya Nair", avatar_color: "bg-amber-500", role: "Production Designer", last_message: "Set dressing complete on Stage 4", last_time: "1h", unread: 0, online: false },
  { id: "4", name: "Marcus Webb", avatar_color: "bg-pink-500", role: "Sound Mixer", last_message: "Boom op confirmed for tomorrow", last_time: "2h", unread: 0, online: false },
  { id: "5", name: "Luna Chen", avatar_color: "bg-blue-500", role: "Costume Designer", last_message: "Wardrobe changes approved ✓", last_time: "3h", unread: 0, online: true },
]

const MOCK_MESSAGES: Record<string, Message[]> = {
  "1": [
    { id: "m1", thread_id: "1", sender_name: "Sarah Mitchell", sender_color: "bg-violet-500", content: "Hey, just checking in on the schedule for next week.", created_at: new Date(Date.now() - 3600000).toISOString(), read: true },
    { id: "m2", thread_id: "1", sender_name: "You", sender_color: "bg-amber-400", content: "All sorted! Monday 6am call time at Location A.", created_at: new Date(Date.now() - 3000000).toISOString(), read: true },
    { id: "m3", thread_id: "1", sender_name: "Sarah Mitchell", sender_color: "bg-violet-500", content: "Perfect. I'll need the full DP package — Sony FX9 with full lens kit.", created_at: new Date(Date.now() - 2400000).toISOString(), read: true },
    { id: "m4", thread_id: "1", sender_name: "You", sender_color: "bg-amber-400", content: "Confirmed, already booked with rental house. ETA is Sunday evening.", created_at: new Date(Date.now() - 1800000).toISOString(), read: true },
    { id: "m5", thread_id: "1", sender_name: "Sarah Mitchell", sender_color: "bg-violet-500", content: "Can you confirm the call sheet for Monday?", created_at: new Date(Date.now() - 120000).toISOString(), read: false },
  ],
  "2": [
    { id: "m6", thread_id: "2", sender_name: "James Cole", sender_color: "bg-emerald-500", content: "Rigging is all done on Stage 2. Ready for your sign-off.", created_at: new Date(Date.now() - 7200000).toISOString(), read: true },
    { id: "m7", thread_id: "2", sender_name: "You", sender_color: "bg-amber-400", content: "Will check tomorrow morning. Looks great from the photos!", created_at: new Date(Date.now() - 3600000).toISOString(), read: true },
    { id: "m8", thread_id: "2", sender_name: "James Cole", sender_color: "bg-emerald-500", content: "Lighting setup is ready for review", created_at: new Date(Date.now() - 840000).toISOString(), read: false },
  ],
}

function formatTime(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 60000) return "now"
  if (diff < 3600000) return Math.floor(diff / 60000) + "m"
  if (diff < 86400000) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  return d.toLocaleDateString([], { month: "short", day: "numeric" })
}

export default function MessagesPage() {
  const [activeThread, setActiveThread] = useState<Thread>(THREADS[0])
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES["1"] || [])
  const [threads, setThreads] = useState<Thread[]>(THREADS)
  const [input, setInput] = useState("")
  const [search, setSearch] = useState("")
  const [sending, setSending] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const msgs = MOCK_MESSAGES[activeThread.id] || []
    setMessages(msgs)
    // Mark as read
    setThreads(prev => prev.map(t => t.id === activeThread.id ? { ...t, unread: 0 } : t))
  }, [activeThread])

  const sendMessage = async () => {
    if (!input.trim() || sending) return
    setSending(true)
    const newMsg: Message = {
      id: "new-" + Date.now(),
      thread_id: activeThread.id,
      sender_name: "You",
      sender_color: "bg-amber-400",
      content: input.trim(),
      created_at: new Date().toISOString(),
      read: true,
    }
    setMessages(prev => [...prev, newMsg])
    setThreads(prev => prev.map(t => t.id === activeThread.id ? { ...t, last_message: input.trim(), last_time: "now" } : t))
    setInput("")
    setSending(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const filteredThreads = threads.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.role.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#04080F]">
      {/* Thread list */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease }}
        className="w-80 flex-shrink-0 border-r border-white/[0.06] flex flex-col"
      >
        <div className="p-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-white">Messages</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-7 h-7 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center hover:bg-amber-400/20 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder-white/30 outline-none focus:border-amber-400/40 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredThreads.map((thread, i) => (
            <motion.button
              key={thread.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, ease }}
              onClick={() => setActiveThread(thread)}
              className={clsx(
                "w-full p-4 flex items-center gap-3 hover:bg-white/[0.03] transition-colors text-left border-b border-white/[0.03]",
                activeThread.id === thread.id && "bg-white/[0.05]"
              )}
            >
              <div className="relative flex-shrink-0">
                <div className={"w-10 h-10 rounded-full " + thread.avatar_color + " flex items-center justify-center text-sm font-bold text-white"}>
                  {thread.name.charAt(0)}
                </div>
                {thread.online && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#04080F]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-semibold text-white truncate">{thread.name}</span>
                  <span className="text-xs text-white/30 flex-shrink-0 ml-2">{thread.last_time}</span>
                </div>
                <p className="text-xs text-white/40 truncate">{thread.last_message}</p>
              </div>
              {thread.unread > 0 && (
                <div className="w-5 h-5 rounded-full bg-amber-400 text-black text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {thread.unread}
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="h-16 border-b border-white/[0.06] flex items-center justify-between px-6"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={"w-9 h-9 rounded-full " + activeThread.avatar_color + " flex items-center justify-center text-sm font-bold text-white"}>
                {activeThread.name.charAt(0)}
              </div>
              {activeThread.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#04080F]" />}
            </div>
            <div>
              <div className="font-semibold text-sm text-white">{activeThread.name}</div>
              <div className="text-xs text-white/40">{activeThread.online ? "Active now" : activeThread.role}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {[Phone, Video, MoreHorizontal].map((Icon, i) => (
              <motion.button key={i} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/50 hover:text-white/80 transition-colors">
                <Icon className="w-4 h-4" />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => {
              const isYou = msg.sender_name === "You"
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, ease }}
                  className={clsx("flex gap-3", isYou && "flex-row-reverse")}
                >
                  {!isYou && (
                    <div className={"w-8 h-8 rounded-full flex-shrink-0 " + msg.sender_color + " flex items-center justify-center text-xs font-bold text-white"}>
                      {msg.sender_name.charAt(0)}
                    </div>
                  )}
                  <div className={clsx("max-w-[65%]", isYou && "items-end flex flex-col")}>
                    {!isYou && <div className="text-xs text-white/40 mb-1 ml-1">{msg.sender_name}</div>}
                    <div className={clsx(
                      "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                      isYou
                        ? "bg-amber-400 text-black rounded-tr-sm font-medium"
                        : "bg-white/[0.06] border border-white/[0.06] text-white rounded-tl-sm"
                    )}>
                      {msg.content}
                    </div>
                    <div className={clsx("flex items-center gap-1 mt-1 text-xs text-white/25", isYou && "justify-end")}>
                      <span>{formatTime(msg.created_at)}</span>
                      {isYou && <CheckCheck className="w-3 h-3 text-amber-400/60" />}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
          <div ref={endRef} />
        </div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease, delay: 0.2 }}
          className="p-4 border-t border-white/[0.06]"
        >
          <div className="flex items-end gap-3 bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3 focus-within:border-amber-400/30 transition-colors">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={"Message " + activeThread.name + "..."}
              rows={1}
              className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none resize-none"
              style={{ maxHeight: "120px" }}
            />
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                className="text-white/30 hover:text-white/60 transition-colors">
                <Smile className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                disabled={!input.trim() || sending}
                className={clsx(
                  "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
                  input.trim()
                    ? "bg-amber-400 text-black hover:bg-amber-300"
                    : "bg-white/[0.06] text-white/20"
                )}
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
          <p className="text-xs text-white/20 mt-2 ml-1">Press Enter to send · Shift+Enter for new line</p>
        </motion.div>
      </div>
    </div>
  )
}
