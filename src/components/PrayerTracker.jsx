import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, Flame, TrendingUp } from 'lucide-react'
import { PRAYER_ORDER, PRAYER_ARABIC, PRAYER_EMOJI } from '../services/api'

const TRACKED = PRAYER_ORDER.filter(p => p !== 'Sunrise')
const STORAGE_KEY = 'noor_prayer_tracker'

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function loadData() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}

function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

function calcStreak(data) {
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    const dayData = data[key] || {}
    const completed = TRACKED.filter(p => dayData[p]).length
    if (completed === TRACKED.length) streak++
    else if (i > 0) break
  }
  return streak
}

function getLast7(data) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    const dayData = data[key] || {}
    const done = TRACKED.filter(p => dayData[p]).length
    return { key, done, label: d.toLocaleDateString('en', { weekday: 'short' }) }
  })
}

export default function PrayerTracker() {
  const [allData, setAllData] = useState(() => loadData())
  const today = todayKey()
  const todayData = allData[today] || {}

  const toggle = (prayer) => {
    const updated = {
      ...allData,
      [today]: { ...todayData, [prayer]: !todayData[prayer] },
    }
    setAllData(updated)
    saveData(updated)
  }

  const completedToday = TRACKED.filter(p => todayData[p]).length
  const streak = calcStreak(allData)
  const last7  = getLast7(allData)

  return (
    <div className="glass rounded-2xl p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold">Prayer Tracker</h3>
          <p className="text-white/40 text-xs font-arabic">متابعة الصلوات</p>
        </div>
        <div className="flex items-center gap-1.5 glass-emerald rounded-xl px-3 py-1.5">
          <Flame size={14} className="text-amber-400" />
          <span className="text-white font-bold text-sm">{streak}</span>
          <span className="text-white/50 text-xs">day{streak !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Today's prayers */}
      <div className="space-y-2">
        <p className="text-white/40 text-xs uppercase tracking-widest flex items-center gap-2">
          <span className="h-px flex-1 bg-white/10" /> Today
          <span className="text-emerald-400 font-semibold">{completedToday}/{TRACKED.length}</span>
          <span className="h-px flex-1 bg-white/10" />
        </p>
        <div className="grid grid-cols-2 gap-2">
          {TRACKED.map(prayer => {
            const done = !!todayData[prayer]
            return (
              <button
                key={prayer}
                onClick={() => toggle(prayer)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left ${
                  done
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                    : 'border-white/8 bg-white/3 text-white/50 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                {done
                  ? <CheckCircle2 size={16} className="shrink-0" />
                  : <Circle      size={16} className="shrink-0" />
                }
                <span className="text-sm font-medium">{prayer}</span>
                <span className="font-arabic text-xs ml-auto opacity-60">{PRAYER_ARABIC[prayer]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Weekly chart */}
      <div>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
          <TrendingUp size={10} /> Weekly Progress
        </p>
        <div className="flex items-end gap-1.5 h-16">
          {last7.map(({ key, done, label }) => (
            <div key={key} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t-md transition-all duration-300 ${
                  done === TRACKED.length
                    ? 'bg-emerald-400'
                    : done > 0
                    ? 'bg-emerald-400/40'
                    : 'bg-white/10'
                }`}
                style={{ height: `${Math.max(6, (done / TRACKED.length) * 48)}px` }}
              />
              <span className="text-white/30 text-[9px]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
