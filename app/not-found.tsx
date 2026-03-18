"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { Zap, ArrowLeft, Search } from "lucide-react"

const ease = [0.22, 1, 0.36, 1]

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#04080F] text-white flex items-center justify-center overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-amber-500/[0.03] blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-500/[0.03] blur-3xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="relative z-10 text-center px-8 max-w-lg"
      >
        <div className="w-16 h-16 bg-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <Zap className="w-8 h-8 text-black" fill="currentColor" />
        </div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
          className="text-8xl font-black text-amber-400 mb-4"
        >
          404
        </motion.div>
        <h1 className="text-2xl font-bold mb-3">Page not found</h1>
        <p className="text-white/40 mb-8 leading-relaxed">
          This page does not exist or has been moved. Head back to your workspace to pick up where you left off.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-black font-semibold rounded-xl hover:bg-amber-300 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.06] border border-white/[0.08] text-white font-semibold rounded-xl hover:bg-white/[0.1] transition-all"
          >
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
