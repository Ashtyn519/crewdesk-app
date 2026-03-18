"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { Zap, ArrowRight, Users, FileText, MessageSquare, BarChart3, CheckCircle, Star, Shield } from "lucide-react"

const ease = [0.22, 1, 0.36, 1]

const features = [
  { icon: Users, color: "text-amber-400", bg: "bg-amber-400/[0.08]", title: "Crew Management", desc: "Build your roster, invite freelancers, rate their work, and track availability across every production." },
  { icon: FileText, color: "text-violet-400", bg: "bg-violet-400/[0.08]", title: "Smart Contracts", desc: "Draft, send and collect e-signatures on contracts in minutes. Track status through a clear pipeline." },
  { icon: BarChart3, color: "text-emerald-400", bg: "bg-emerald-400/[0.08]", title: "Invoice Suite", desc: "Create professional invoices, track payments, and download PDF copies. Get paid faster." },
  { icon: MessageSquare, color: "text-blue-400", bg: "bg-blue-400/[0.08]", title: "Team Messaging", desc: "Real-time threaded conversations with your crew. Stay aligned from pre-production to wrap." },
  { icon: BarChart3, color: "text-pink-400", bg: "bg-pink-400/[0.08]", title: "Live Analytics", desc: "Budget tracking, crew utilisation, project velocity — all the numbers you need at a glance." },
  { icon: CheckCircle, color: "text-cyan-400", bg: "bg-cyan-400/[0.08]", title: "Project Hub", desc: "Manage multiple productions simultaneously with budget tracking, crew allocation and status updates." },
]

const avatarColors = ["bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-pink-500"]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#04080F] text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-amber-500/[0.04] blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-500/[0.04] blur-3xl" />
        <div className="absolute top-[40%] left-[40%] w-[30vw] h-[30vw] rounded-full bg-emerald-500/[0.03] blur-3xl" />
      </div>

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/[0.06]"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-black" fill="currentColor" />
          </div>
          <span className="font-bold text-lg">CrewDesk</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm text-white/50 hidden md:block">The operating system for freelance teams</span>
          <Link href="/login" className="text-sm text-white/70 hover:text-white transition-colors">Sign in</Link>
          <Link href="/signup" className="px-4 py-2 bg-amber-400 text-black text-sm font-semibold rounded-xl hover:bg-amber-300 transition-colors">
            Get started free
          </Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 pt-24 pb-20 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.1 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/20 bg-amber-400/[0.06] text-amber-400 text-xs font-medium mb-8">
            <Zap className="w-3 h-3" />
            Now in production — used by 2,400+ teams
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
            The operating system<br />
            <span className="text-amber-400">for your freelance workforce</span>
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Hire, contract, invoice and communicate with your entire crew — from one beautifully designed workspace built for production professionals.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-amber-400 text-black font-bold rounded-2xl hover:bg-amber-300 transition-all hover:scale-105 text-lg">
              Start for free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-white/[0.06] border border-white/[0.08] text-white font-semibold rounded-2xl hover:bg-white/[0.1] transition-all text-lg">
              Sign in
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.4 }}
          className="flex items-center justify-center gap-6 mt-12 text-sm text-white/40 flex-wrap"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {avatarColors.map((c, i) => (
                <div key={i} className={"w-7 h-7 rounded-full border-2 border-[#04080F] " + c} />
              ))}
            </div>
            <span>2,400+ teams</span>
          </div>
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
            <span className="ml-1">4.9/5 from 800+ reviews</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>SOC 2 Certified</span>
          </div>
        </motion.div>
      </section>

      {/* Features grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, ease }} className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Everything your crew operation needs</h2>
          <p className="text-white/40 text-lg">Built for the realities of freelance production management</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease, delay: i * 0.07 }}
              className="p-6 rounded-2xl border border-white/[0.06] bg-[#0A1020] hover:border-white/[0.12] transition-colors"
            >
              <div className={"w-10 h-10 rounded-xl flex items-center justify-center mb-4 " + f.bg}>
                <f.icon className={"w-5 h-5 " + f.color} />
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="p-12 rounded-3xl border border-amber-400/20 bg-amber-400/[0.04]"
        >
          <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Zap className="w-6 h-6 text-black" fill="currentColor" />
          </div>
          <h2 className="text-4xl font-black mb-4">Ready to run your crew like a pro?</h2>
          <p className="text-white/50 text-lg mb-8">Free to get started. No credit card needed. Set up in under 2 minutes.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-10 py-4 bg-amber-400 text-black font-bold rounded-2xl hover:bg-amber-300 transition-all hover:scale-105 text-lg">
            Get started free <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] px-8 py-8 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-amber-400 rounded-md flex items-center justify-center">
            <Zap className="w-3 h-3 text-black" fill="currentColor" />
          </div>
          <span className="text-sm font-semibold">CrewDesk</span>
        </div>
        <p className="text-xs text-white/30">© 2026 CrewDesk. The operating system for freelance teams.</p>
        <div className="flex items-center gap-4 text-xs text-white/30">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Security</span>
        </div>
      </footer>
    </div>
  )
}
