'use client'
import { useState, useEffect } from 'react'
const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DATA=[4200,6800,5900,8400,9200,7600,11000,9800,12400,10900,13800,15200]
type Period='1M'|'3M'|'YTD'|'1Y'
const SLICES:Record<Period,number>={'1M':1,'3M':3,'YTD':new Date().getMonth()+1,'1Y':12}
export function RevenueChart(){
    const[animate,setAnimate]=useState(false)
    const[period,setPeriod]=useState<Period>('1Y')
    useEffect(()=>{const t=setTimeout(()=>setAnimate(true),120);return()=>clearTimeout(t)},[])
    const count=SLICES[period],data=DATA.slice(DATA.length-count),months=MONTHS.slice(MONTHS.length-count)
    const pmax=Math.max(...data),total=data.reduce((a,b)=>a+b,0)
    return(
          <div>
                <div className="flex items-start justify-between mb-5">
                        <div>
                                  <div className="flex items-center gap-3 mb-0.5">
                                              <span className="text-2xl font-black text-amber-400">£{(total/1000).toFixed(1)}k</span>span>
                                              <span className="text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/20">+23.4%</span>span>
                                  </div>div>
                                  <p className="text-xs text-slate-500">vs last year</p>p>
                        </div>div>
                        <div className="flex gap-1">
                          {(['1M','3M','YTD','1Y']as Period[]).map(p=>(
                        <button key={p} onClick={()=>setPeriod(p)} className={period===p?'text-xs px-2.5 py-1.5 rounded-lg font-medium bg-amber-400/10 text-amber-400 border border-amber-400/20':'text-xs px-2.5 py-1.5 rounded-lg font-medium text-slate-500 hover:text-slate-300'}>{p}</button>button>
                      ))}
                        </div>div>
                </div>div>
                <div className="flex items-end gap-1.5 mb-3" style={{height:'140px'}}>
                  {data.map((val,i)=>{
                      const h=(val/pmax)*100
                                  return(
                                                <div key={i} className="flex-1 group relative flex items-end" style={{height:'100%'}}>
                                                              <div className="w-full rounded-t-md bg-gradient-to-t from-amber-500/70 to-amber-400 group-hover:to-amber-300 cursor-pointer"
                                                                                style={{height:animate?`${h}%`:'4px',minHeight:'4px',transition:animate?`height 0.5s cubic-bezier(.4,0,.2,1) ${i*0.045}s`:'none'}}/>
                                                </div>div>
                                              )
          })}
                </div>div>
                <div className="flex gap-1.5">
                  {months.map(m=><div key={m} className="flex-1 text-center text-[10px] text-slate-600 font-medium">{m}</div>div>)}
                </div>div>
          </div>div>
        )
}
export default RevenueChart</div>
