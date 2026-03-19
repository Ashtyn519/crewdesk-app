'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DATA = [4200, 6800, 5900, 8400, 9200, 7600, 11000, 9800, 12400, 10900, 13800, 15200];
const MAX = Math.max(...DATA);

export function RevenueChart() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="bg-[#0A1020] rounded-2xl border border-[#1A2540] p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-white mb-1">Revenue Overview</h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-amber-400">£115,200</span>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/20">
              <span className="text-emerald-400 text-xs font-bold">+23.4%</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">vs last year</p>
        </div>
        <div className="flex gap-2">
          {['1M','3M','YTD','1Y'].map((p, i) => (
            <button key={p} className={['text-xs px-2.5 py-1 rounded-lg font-medium transition-colors', i === 3 ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' : 'text-slate-500 hover:text-slate-300'].join(' ')}>{p}</button>
          ))}
        </div>
      </div>
      <div className="flex items-end gap-1.5 h-40 mb-3">
        {DATA.map((val, i) => {
          const h = (val / MAX) * 100;
          return (
            <div key={i} className="flex-1 group relative">
              <motion.div
                initial={{ height: 0 }} animate={inView ? { height: `${h}%` } : { height: 0 }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: 'easeOut' }}
                className="w-full rounded-t-lg bg-gradient-to-t from-amber-500/60 to-amber-400 group-hover:from-amber-500/80 group-hover:to-amber-300 transition-colors cursor-pointer"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#060C18] border border-[#1A2540] rounded-lg px-2 py-1 text-[10px] text-white font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                  £{(val/1000).toFixed(1)}k
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-1.5">
        {MONTHS.map(m => <div key={m} className="flex-1 text-center text-[10px] text-slate-600">{m}</div>)}
      </div>
    </div>
  );
}
