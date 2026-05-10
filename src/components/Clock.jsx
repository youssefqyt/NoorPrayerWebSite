export default function Clock({ now }) {
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  const ampm = now.getHours() >= 12 ? 'PM' : 'AM'

  return (
    <div className="flex items-end gap-1 justify-center">
      <span className="font-display text-6xl md:text-8xl font-bold text-g-emerald tabular-nums leading-none">
        {h}:{m}
      </span>
      <div className="flex flex-col items-start pb-2 gap-0.5">
        <span className="font-display text-2xl md:text-3xl text-white/40 tabular-nums">{s}</span>
        <span className="text-xs font-semibold text-emerald-400/70 tracking-widest">{ampm}</span>
      </div>
    </div>
  )
}
