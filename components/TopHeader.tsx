"use client"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bell, Search, ChevronRight, X, CheckCircle2,
  AlertCircle, MessageSquare, FileText, Users, Clock
} from "lucide-react"
import clsx from "clsx"

const ease = [0.22, 1, 0.36, 1]

const BREADCRUMB_MAP: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/projects": "Projects",
  "/crew": "Crew",
  "/contracts": "Contracts",
  "/invoices": "Invoices",
  "/messages": "Messages",
  "/settings": "Settings",
  "/onboarding": "Onboarding",
}

const NOTIFICATIONS = [
  { id: "1", type: "message", icon: MessageSquare, color: "text-blue-400", bg: "bg-blue-400/10", title: "New message from Sarah Mitchell", body: "Can you confirm the call sheet for Monday?", time: "2m ago", read: false },
  { id: "2", type: "invoice", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10", title: "Invoice INV-0042 marked paid", body: "Lighthouse Films · £4,200.00 received", time: "1h ago", read: false },
  { id: "3", type: "contract", icon: FileText, color: "text-violet-400", bg: "bg-violet-400/10", title: "Contract signed by James Cole", body: "Q2 Production Contract · Gaffer role confirmed", time: "3h ago", read: true },
  { id: "4", type: "crew", icon: Users, color: "text-amber-400", bg: "bg-amber-400/10", title: "New crew member application", body: "Priya Nair applied for Production Designer", time: "5h ago", read: true },
  { id: "5", type: "alert", icon: AlertCircle, color: "text-red-400", bg: "bg-red-400/10", title: "Invoice INV-0039 is overdue", body: "Atlantic Media · £8,500.00 · 7 days overdue", time: "1d ago", read: true },
]

export default function TopHeader() {
  const pathname = usePathname()
  const [showNotifs, setShowNotifs] = useState(false)
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const page = BREADCRUMB_MAP[pathname] || pathname.split("/").filter(Boolean).pop() || "Home"
  const unread = notifications.filter(n => !n.read).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  return (
    <div className="h-16 bg-[#060C18]/80 backdrop-blur-md border-b border-white/[0.06] flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-white/30">CrewDesk</span>
        <ChevronRight className="w-3.5 h-3.5 text-white/20" />
        <span className="text-white font-medium">{page}</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <AnimatePresence>
          {searchOpen ? (
            <motion.div
              key="search-open"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease }}
              className="relative overflow-hidden"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onBlur={() => { setSearchOpen(false); setSearchQuery("") }}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm text-white placeholder-white/30 outline-none focus:border-amber-400/40"
              />
            </motion.div>
          ) : (
            <motion.button
              key="search-closed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchOpen(true)}
              className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center text-white/50 hover:text-white/80 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center text-white/50 hover:text-white/80 transition-colors"
          >
            <Bell className="w-3.5 h-3.5" />
            {unread > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-black text-[9px] font-bold flex items-center justify-center"
              >
                {unread}
              </motion.div>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifs && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease }}
                  className="absolute right-0 top-full mt-2 w-80 bg-[#0A1020] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-sm text-white">Notifications</h3>
                      {unread > 0 && <p className="text-xs text-white/40">{unread} unread</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      {unread > 0 && (
                        <button onClick={markAllRead} className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                          Mark all read
                        </button>
                      )}
                      <button onClick={() => setShowNotifs(false)} className="text-white/30 hover:text-white/60 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((n, i) => (
                      <motion.button
                        key={n.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04, ease }}
                        onClick={() => markRead(n.id)}
                        className={clsx(
                          "w-full p-4 flex gap-3 text-left hover:bg-white/[0.03] transition-colors border-b border-white/[0.04] last:border-0",
                          !n.read && "bg-white/[0.02]"
                        )}
                      >
                        <div className={"w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center " + n.bg}>
                          <n.icon className={"w-4 h-4 " + n.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-medium text-white leading-snug">{n.title}</p>
                            {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1" />}
                          </div>
                          <p className="text-xs text-white/40 mt-0.5 truncate">{n.body}</p>
                          <p className="text-xs text-white/25 mt-1 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />{n.time}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  <div className="p-3 border-t border-white/[0.06]">
                    <button className="w-full text-center text-xs text-amber-400 hover:text-amber-300 transition-colors py-1">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black text-sm font-bold shadow-lg"
        >
          A
        </motion.button>
      </div>
    </div>
  )
}
