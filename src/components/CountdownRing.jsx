import { PRAYER_ARABIC, PRAYER_EMOJI } from '../services/api'

export default function CountdownRing({ nextPrayer, countdown }) {
  if (!nextPrayer || !countdown) return null

  const [h, m, s] = countdown.split(':').map(Number)
  const totalSec = h * 3600 + m * 60 + s
  const maxSec = 6 * 3600
  const pct = Math.max(0, Math.min(1, 1 - totalSec / maxSec))
  const radius = 54
  const circ = 2 * Math.PI * radius
  const dash = circ * pct

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-white/40 text-sm tracking-widest uppercase">Next Prayer</p>
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full border border-emerald-400/20 animate-ping" style={{ animationDuration:'3s' }} />
        <svg width="160" height="160" className="absolute inset-0 -rotate-90">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <circle
            cx="80" cy="80" r={radius}
            fill="none"
            stroke="#10b981"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            style={{ filter:'drop-shadow(0 0 8px rgba(16,185,129,0.7))' }}
          />
        </svg>
        <div className="text-center z-10">
          <div className="text-3xl mb-0.5">{PRAYER_EMOJI[nextPrayer.name]}</div>
          <div className="font-arabic text-white/80 text-sm">{PRAYER_ARABIC[nextPrayer.name]}</div>
        </div>
      </div>
      <div className="glass-emerald rounded-2xl px-8 py-3 text-center">
        <p className="font-display text-2xl text-emerald-400 tabular-nums tracking-wider">{countdown}</p>
        <p className="text-white/30 text-xs mt-0.5">hours · minutes · seconds</p>
      </div>
    </div>
  )
}
