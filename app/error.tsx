"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { Zap, RefreshCw, ArrowLeft } from "lucide-react"

const ease = [0.22, 1, 0.36, 1]

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#04080F] text-white flex items-center justify-center overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-red-500/[0.03] blur-3xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="relative z-10 text-center px-8 max-w-lg"
      >
        <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-red-500/20">
          <Zap className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-3xl font-black mb-3">Something went wrong</h1>
        <p className="text-white/40 mb-2 leading-relaxed">
          An unexpected error occurred. Our team has been notified.
        </p>
        <p className="text-white/20 text-sm mb-8 font-mono bg-white/[0.04] rounded-lg px-4 py-2 border border-white/[0.06]">
          {error.message || "Unknown error"}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-black font-semibold rounded-xl hover:bg-amber-300 transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Try again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.06] border border-white/[0.08] text-white font-semibold rounded-xl hover:bg-white/[0.1] transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
