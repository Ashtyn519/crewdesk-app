'use client'

import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

// ─── Shared Variants ──────────────────────────────────────────────────────────

export const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
}

export const slideRight = {
  hidden:  { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
}

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, scale: 0.96, transition: { duration: 0.15 } },
}

export const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

export const staggerItem = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
}

// ─── Page Transition Wrapper ──────────────────────────────────────────────────

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Animated Card ────────────────────────────────────────────────────────────

export function AnimatedCard({
  children, className = '', delay = 0, onClick,
}: {
  children: ReactNode; className?: string; delay?: number; onClick?: () => void
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay }}
      whileHover={{ scale: 1.008, transition: { duration: 0.18 } }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

// ─── Animated List ────────────────────────────────────────────────────────────

export function AnimatedList({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  )
}

export function AnimatedListItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  )
}

// ─── Animated Number Counter ──────────────────────────────────────────────────

export function CountUp({ value, prefix = '', suffix = '', decimals = 0 }: {
  value: number; prefix?: string; suffix?: string; decimals?: number
}) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const end = value
    if (end === 0) return
    const duration = 1200
    const step = 16
    const increment = end / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) { setDisplay(end); clearInterval(timer) }
      else setDisplay(start)
    }, step)
    return () => clearInterval(timer)
  }, [value])
  return <span>{prefix}{display.toFixed(decimals)}{suffix}</span>
}

// ─── Shimmer Skeleton ─────────────────────────────────────────────────────────

export function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-white/5 rounded-xl ${className}`}>
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent"
        animate={{ translateX: ['−100%', '200%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

// ─── Floating Badge (notification-style) ────────────────────────────────────

export function FloatingBadge({ count }: { count: number }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-amber-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center px-1"
        >
          {count}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

// ─── Modal Overlay with Animation ────────────────────────────────────────────

export function AnimatedModal({ show, onClose, children }: {
  show: boolean; onClose: () => void; children: ReactNode
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative w-full max-w-lg"
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Animated Stat Card ───────────────────────────────────────────────────────

export function StatCard({
  label, value, icon: Icon, color, bg, delay = 0, prefix = '', suffix = '',
}: {
  label: string; value: number | string; icon: React.ElementType;
  color: string; bg: string; delay?: number; prefix?: string; suffix?: string;
}) {
  const isNumber = typeof value === 'number'
  return (
    <motion.div
      className="bg-[#0A1020] border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4 group cursor-default"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay }}
      whileHover={{
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgb(12,20,40)',
        transition: { duration: 0.15 },
      }}
    >
      <motion.div
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}
        whileHover={{ scale: 1.1, rotate: 5, transition: { duration: 0.2 } }}
      >
        <Icon className={`w-5 h-5 ${color}`} />
      </motion.div>
      <div>
        <p className="text-2xl font-bold text-white">
          {isNumber ? <CountUp value={value as number} prefix={prefix} suffix={suffix} /> : value}
        </p>
        <p className="text-xs text-white/40 mt-0.5">{label}</p>
      </div>
    </motion.div>
  )
}

// ─── Pulse Dot (online indicator) ────────────────────────────────────────────

export function PulseDot({ color = 'bg-emerald-400' }: { color?: string }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <motion.span
        className={`absolute inline-flex h-full w-full rounded-full ${color} opacity-75`}
        animate={{ scale: [1, 1.6, 1], opacity: [0.75, 0, 0.75] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${color}`} />
    </span>
  )
}

// ─── Animated Progress Bar ────────────────────────────────────────────────────

export function AnimatedProgressBar({
  value, max, color = 'bg-amber-500', className = '',
}: {
  value: number; max: number; color?: string; className?: string
}) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className={`h-1.5 bg-white/[0.06] rounded-full overflow-hidden ${className}`}>
      <motion.div
        className={`h-full ${color} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />
    </div>
  )
}

// ─── Toast Notification ───────────────────────────────────────────────────────

export function Toast({ message, type = 'success', onDismiss }: {
  message: string; type?: 'success' | 'error' | 'info'; onDismiss: () => void
}) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000)
    return () => clearTimeout(t)
  }, [])
  const colors = {
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    error:   'bg-red-500/10 border-red-500/30 text-red-400',
    info:    'bg-blue-500/10 border-blue-500/30 text-blue-400',
  }
  return (
    <motion.div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-2xl ${colors[type]}`}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    >
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onDismiss} className="opacity-60 hover:opacity-100 transition-opacity text-xs">✕</button>
    </motion.div>
  )
}

// ─── Magnetic Button ──────────────────────────────────────────────────────────

export function MagneticButton({
  children, className = '', onClick,
}: {
  children: ReactNode; className?: string; onClick?: () => void
}) {
  return (
    <motion.button
      className={className}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {children}
    </motion.button>
  )
}
