import { PRAYER_ARABIC, PRAYER_EMOJI } from '../services/api'

export default function PrayerCard({ name, time, isNext, isActive }) {
  return (
    <div
      className={`relative rounded-2xl p-4 transition-all duration-500 cursor-default group
        ${isNext ? 'prayer-active scale-[1.03] z-10' : 'prayer-normal hover:scale-[1.02]'}`}
    >
      {isNext && (
        <>
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'radial-gradient(circle at center,rgba(16,185,129,0.08),transparent 70%)' }} />
          <div className="absolute top-2 right-2">
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full tracking-wider uppercase">
              Next
            </span>
          </div>
        </>
      )}

      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0
          ${isNext ? 'bg-emerald-500/20 ring-1 ring-emerald-400/40' : 'bg-white/5'}`}>
          {PRAYER_EMOJI[name]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-arabic text-lg text-right text-white/80 leading-none">
            {PRAYER_ARABIC[name]}
          </p>
          <p className={`text-xs mt-0.5 ${isNext ? 'text-emerald-400/70' : 'text-white/35'}`}>
            {name}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className={`font-display text-lg tabular-nums font-semibold
            ${isNext ? 'text-emerald-400' : 'text-white/70'}`}>
            {time}
          </p>
        </div>
      </div>

      {isNext && (
        <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
      )}
    </div>
  )
}
