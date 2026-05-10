import { useState } from 'react'
import { Check, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'

const colorMap = {
  gold:    { ring:'ring-amber-400/30',  text:'text-amber-300',  bg:'bg-amber-400/10',  btn:'bg-amber-500 hover:bg-amber-400' },
  emerald: { ring:'ring-emerald-400/30',text:'text-emerald-300',bg:'bg-emerald-400/10',btn:'bg-emerald-500 hover:bg-emerald-400' },
  purple:  { ring:'ring-violet-400/30', text:'text-violet-300', bg:'bg-violet-400/10', btn:'bg-violet-500 hover:bg-violet-400' },
  teal:    { ring:'ring-teal-400/30',   text:'text-teal-300',   bg:'bg-teal-400/10',   btn:'bg-teal-500 hover:bg-teal-400' },
}

export default function AthkarCard({ item, color = 'emerald' }) {
  const [count, setCount] = useState(0)
  const [done, setDone] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const c = colorMap[color]
  const progress = Math.min(count / item.count, 1)

  function tap() {
    if (done) return
    const next = count + 1
    setCount(next)
    if (next >= item.count) setDone(true)
  }

  function reset() { setCount(0); setDone(false) }

  return (
    <div className={`glass rounded-2xl p-5 ring-1 ${c.ring} transition-all duration-300 ${done ? 'opacity-70' : ''}`}>
      {/* Arabic text */}
      <p className="font-arabic text-right text-xl leading-relaxed text-white/90 mb-3">
        {item.arabic}
      </p>

      {/* Expand / collapse transliteration */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition mb-2"
      >
        {expanded ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
        {expanded ? 'Hide' : 'Show'} transliteration
      </button>
      {expanded && (
        <p className="text-white/40 text-xs italic mb-2">{item.transliteration}</p>
      )}
      <p className="text-white/50 text-sm mb-4 leading-relaxed">{item.translation}</p>

      {/* Progress bar */}
      <div className="h-1 bg-white/5 rounded-full mb-4 overflow-hidden">
        <div
          className={`h-full ${c.bg} transition-all duration-300 rounded-full`}
          style={{ width: `${progress * 100}%`, background: done ? '#10b981' : undefined }}
        />
      </div>

      {/* Counter row */}
      <div className="flex items-center justify-between">
        <span className="text-white/30 text-xs">{item.source}</span>
        <div className="flex items-center gap-3">
          <button onClick={reset} className="text-white/25 hover:text-white/60 transition">
            <RotateCcw size={14} />
          </button>
          <div className={`${c.text} ${c.bg} rounded-xl px-3 py-1 font-display text-sm tabular-nums`}>
            {count} / {item.count}
          </div>
          <button
            onClick={tap}
            disabled={done}
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all active:scale-90
              ${done ? 'bg-emerald-500/30 cursor-not-allowed' : `${c.btn} shadow-lg active:shadow-none`}`}
          >
            {done ? <Check size={16} /> : <span className="text-base font-bold">+</span>}
          </button>
        </div>
      </div>
    </div>
  )
}
