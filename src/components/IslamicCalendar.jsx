import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays, Loader2 } from 'lucide-react'
import { fetchHijriMonth, HIJRI_MONTHS, HIJRI_MONTHS_AR } from '../services/api'

// Key Islamic events by Hijri month/day
const ISLAMIC_EVENTS = {
  '1-1':  { name: 'Islamic New Year', emoji: '🌙' },
  '1-10': { name: 'Day of Ashura', emoji: '✨' },
  '3-12': { name: "Mawlid al-Nabi (Prophet's Birthday)", emoji: '💚' },
  '7-27': { name: "Laylat al-Mi'raj", emoji: '🌟' },
  '8-15': { name: "Laylat al-Bara'at (Shab-e-Barat)", emoji: '⭐' },
  '9-1':  { name: 'Ramadan Begins', emoji: '🌙' },
  '9-17': { name: 'Battle of Badr', emoji: '📖' },
  '9-27': { name: 'Laylat al-Qadr (estimated)', emoji: '✨' },
  '10-1': { name: 'Eid al-Fitr', emoji: '🎉' },
  '12-9': { name: 'Day of Arafah', emoji: '🤲' },
  '12-10':{ name: 'Eid al-Adha', emoji: '🎉' },
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function IslamicCalendar() {
  const now = new Date()
  const [month, setMonth]     = useState(now.getMonth() + 1)   // Gregorian 1-12
  const [year, setYear]       = useState(now.getFullYear())
  const [days, setDays]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchHijriMonth(year, month)
      .then(setDays)
      .catch(() => setError('Could not load calendar'))
      .finally(() => setLoading(false))
  }, [month, year])

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  // Build a grid with empty slots for the first day
  const gridDays = []
  if (days.length > 0) {
    const firstDay = new Date(days[0].gregorian.date).getDay()
    for (let i = 0; i < firstDay; i++) gridDays.push(null)
  }
  days.forEach(d => gridDays.push(d))

  const todayGregorian = `${String(now.getDate()).padStart(2,'0')}-${String(now.getMonth()+1).padStart(2,'0')}-${now.getFullYear()}`

  const hijriMonthName = days[0]
    ? HIJRI_MONTHS[parseInt(days[0].hijri.month.number) - 1]
    : null

  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold">Islamic Calendar</h3>
          <p className="text-white/40 text-xs font-arabic">التقويم الهجري</p>
        </div>
        <CalendarDays size={20} className="text-sky-400" />
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="glass rounded-lg p-1.5 text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors">
          <ChevronLeft size={16} />
        </button>
        <div className="text-center">
          <p className="text-white font-medium text-sm">
            {new Date(year, month - 1).toLocaleString('en', { month: 'long', year: 'numeric' })}
          </p>
          {hijriMonthName && (
            <p className="text-white/40 text-xs font-arabic">
              {HIJRI_MONTHS_AR[parseInt(days[0]?.hijri?.month?.number) - 1]} {days[0]?.hijri?.year}
            </p>
          )}
        </div>
        <button onClick={nextMonth} className="glass rounded-lg p-1.5 text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 gap-3 text-emerald-400">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-white/40 text-sm">Loading…</span>
        </div>
      ) : error ? (
        <div className="text-red-400 text-sm text-center py-8">{error}</div>
      ) : (
        <>
          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center">
            {WEEKDAYS.map((d, i) => (
              <div key={d} className={`text-[10px] font-medium pb-2 ${i === 5 ? 'text-emerald-400' : 'text-white/30'}`}>
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {gridDays.map((day, i) => {
              if (!day) return <div key={i} />
              const gDate = day.gregorian.date // DD-MM-YYYY
              const isToday = gDate === todayGregorian
              const hKey = `${day.hijri.month.number}-${parseInt(day.hijri.day)}`
              const event = ISLAMIC_EVENTS[hKey]
              const isWeekend = new Date(day.gregorian.date.split('-').reverse().join('-')).getDay() === 5 // Friday

              return (
                <button
                  key={gDate}
                  onClick={() => setSelected(selected?.gregorian?.date === gDate ? null : day)}
                  title={event ? event.name : undefined}
                  className={`relative flex flex-col items-center justify-center aspect-square rounded-lg text-xs transition-all duration-150 ${
                    isToday
                      ? 'glass-emerald text-emerald-400 font-bold ring-1 ring-emerald-500/50'
                      : isWeekend
                      ? 'text-emerald-300/70 hover:bg-white/5'
                      : 'text-white/60 hover:bg-white/5'
                  } ${event ? 'ring-1 ring-amber-400/30' : ''}`}
                >
                  <span>{day.gregorian.day}</span>
                  <span className="text-[8px] opacity-50">{day.hijri.day}</span>
                  {event && <span className="absolute top-0.5 right-0.5 text-[8px]">{event.emoji}</span>}
                </button>
              )
            })}
          </div>

          {/* Selected day detail */}
          {selected && (
            <div className="glass rounded-xl p-3 space-y-1 border border-white/10">
              <p className="text-white font-medium text-sm">
                {new Date(selected.gregorian.date.split('-').reverse().join('-')).toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-white/40 text-sm font-arabic">
                {selected.hijri.day} {selected.hijri.month.ar} {selected.hijri.year} هـ
              </p>
              <p className="text-white/50 text-xs">
                {HIJRI_MONTHS[selected.hijri.month.number - 1]} {selected.hijri.day}, {selected.hijri.year} AH
              </p>
              {(() => {
                const hKey = `${selected.hijri.month.number}-${parseInt(selected.hijri.day)}`
                const event = ISLAMIC_EVENTS[hKey]
                return event ? (
                  <p className="text-amber-400 text-xs font-medium pt-1">
                    {event.emoji} {event.name}
                  </p>
                ) : null
              })()}
            </div>
          )}

          {/* Legend: upcoming events */}
          <div className="space-y-1 pt-1">
            <p className="text-white/30 text-[10px] uppercase tracking-widest">Islamic events this month</p>
            {days.reduce((acc, day) => {
              const hKey = `${day.hijri.month.number}-${parseInt(day.hijri.day)}`
              const event = ISLAMIC_EVENTS[hKey]
              if (event) acc.push({ day, event })
              return acc
            }, []).length === 0
              ? <p className="text-white/20 text-xs">No major events this month</p>
              : days.reduce((acc, day) => {
                  const hKey = `${day.hijri.month.number}-${parseInt(day.hijri.day)}`
                  const event = ISLAMIC_EVENTS[hKey]
                  if (event) acc.push({ day, event })
                  return acc
                }, []).map(({ day, event }) => (
                  <div key={day.gregorian.date} className="flex items-center gap-2 text-xs">
                    <span>{event.emoji}</span>
                    <span className="text-white/50">{event.name}</span>
                    <span className="text-white/25 ml-auto">{day.gregorian.day}</span>
                  </div>
                ))
            }
          </div>
        </>
      )}
    </div>
  )
}
