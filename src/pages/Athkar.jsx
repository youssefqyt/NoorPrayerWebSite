import { useState } from 'react'
import AthkarCard from '../components/AthkarCard'
import { ATHKAR } from '../services/api'

const CATEGORY_KEYS = ['morning','evening','sleep','prayer']
const COLOR_TAB = {
  morning: 'gold', evening: 'emerald', sleep: 'purple', prayer: 'teal',
}
const TAB_ACTIVE = {
  gold:    'glass-gold    text-amber-300  border-amber-400/40',
  emerald: 'glass-emerald text-emerald-300 border-emerald-400/40',
  purple:  'glass-purple  text-violet-300 border-violet-400/40',
  teal:    'bg-teal-400/10 backdrop-blur-xl border border-teal-400/30 text-teal-300',
}

export default function Athkar() {
  const [active, setActive] = useState('morning')
  const [tasbihCount, setTasbihCount] = useState(0)
  const [tasbihTotal, setTasbihTotal] = useState(0)
  const cat = ATHKAR[active]
  const color = COLOR_TAB[active]

  return (
    <div className="min-h-screen pt-24 px-4 pb-20 pattern-bg max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-g-emerald mb-1">Athkar</h1>
        <p className="font-arabic text-2xl text-white/40">أذكار · تسبيح</p>
      </div>

      {/* Category tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
        {CATEGORY_KEYS.map(key => {
          const c = ATHKAR[key]
          const col = COLOR_TAB[key]
          const isActive = active === key
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`rounded-xl p-3 text-center transition-all duration-200 border ${
                isActive ? TAB_ACTIVE[col] : 'glass text-white/40 border-white/5 hover:text-white/70 hover:border-white/10'
              }`}
            >
              <div className="text-2xl mb-1">{c.icon}</div>
              <div className="font-arabic text-sm">{c.arabic}</div>
              <div className="text-xs opacity-60">{c.label}</div>
            </button>
          )
        })}
      </div>

      {/* Athkar list */}
      <div className="space-y-4 mb-12">
        <h2 className="text-white/50 text-xs tracking-widest uppercase flex items-center gap-2 mb-4">
          <span className="h-px flex-1 bg-white/10" />
          {cat.icon} {cat.label} Athkar · {cat.arabic}
          <span className="h-px flex-1 bg-white/10" />
        </h2>
        {cat.items.map(item => (
          <AthkarCard key={item.id} item={item} color={color} />
        ))}
      </div>

      {/* ── TASBIH COUNTER ── */}
      <div className="glass rounded-3xl p-8 text-center">
        <h2 className="text-white/50 text-xs tracking-widest uppercase mb-2">Tasbih Counter · مسبحة</h2>
        <p className="text-white/30 text-xs mb-6">Tap the button to count your dhikr</p>

        {/* Big count display */}
        <div className="relative w-44 h-44 mx-auto mb-6 flex items-center justify-center">
          <svg className="absolute inset-0" viewBox="0 0 176 176">
            <circle cx="88" cy="88" r="80" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8"/>
            <circle
              cx="88" cy="88" r="80"
              fill="none"
              stroke="#10b981"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(tasbihCount % 33) / 33 * 502} 502`}
              strokeDashoffset="125"
              style={{ filter:'drop-shadow(0 0 6px rgba(16,185,129,0.6))' }}
            />
          </svg>
          <button
            onClick={() => {
              setTasbihCount(c => c + 1)
              setTasbihTotal(t => t + 1)
            }}
            className="w-28 h-28 rounded-full glass-emerald flex flex-col items-center justify-center transition-all active:scale-90 cursor-pointer select-none glow-e"
          >
            <span className="font-display text-4xl text-emerald-400 tabular-nums">{tasbihCount % 33}</span>
            <span className="text-white/30 text-xs mt-0.5">/ 33</span>
          </button>
        </div>

        {/* Round & total */}
        <div className="flex justify-center gap-6 mb-4 text-sm">
          <div className="glass rounded-xl px-4 py-2 text-center">
            <div className="text-white/30 text-xs mb-0.5">Rounds</div>
            <div className="text-emerald-400 font-display">{Math.floor(tasbihCount / 33)}</div>
          </div>
          <div className="glass rounded-xl px-4 py-2 text-center">
            <div className="text-white/30 text-xs mb-0.5">Total</div>
            <div className="text-amber-400 font-display">{tasbihTotal}</div>
          </div>
        </div>

        {/* Quick dhikr labels */}
        <div className="flex gap-3 justify-center text-xs text-white/30 flex-wrap mb-4 font-arabic">
          {['سبحان الله','الحمد لله','الله أكبر'].map((z, i) => (
            <span key={i} className="glass rounded-full px-3 py-1">{z}</span>
          ))}
        </div>

        <button
          onClick={() => setTasbihCount(0)}
          className="text-white/25 hover:text-white/60 text-xs border border-white/10 rounded-full px-4 py-1.5 transition"
        >
          Reset Round
        </button>
      </div>
    </div>
  )
}
