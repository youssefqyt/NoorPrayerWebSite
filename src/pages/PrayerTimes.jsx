import { useState } from 'react'
import { MapPin, Loader2, Calendar } from 'lucide-react'
import PrayerCard from '../components/PrayerCard'
import CountdownRing from '../components/CountdownRing'
import { usePrayerTimes } from '../hooks/usePrayerTimes'
import { PRAYER_ORDER, PRAYER_ARABIC, PRAYER_EMOJI } from '../services/api'

const METHODS = [
  { id:2, name:'Islamic Society of North America (ISNA)' },
  { id:1, name:'Muslim World League' },
  { id:3, name:'Egyptian General Authority' },
  { id:4, name:'Umm Al-Qura, Makkah' },
  { id:5, name:'University of Islamic Sciences, Karachi' },
]

export default function PrayerTimes() {
  const { data, location, loading, error, now, nextPrayer, countdown } = usePrayerTimes()

  return (
    <div className="min-h-screen pt-24 px-4 pb-16 pattern-bg max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-g-emerald mb-1">Prayer Times</h1>
        <p className="font-arabic text-2xl text-white/40">مواقيت الصلاة</p>
        {location && (
          <div className="flex items-center gap-2 mt-3 text-sm text-white/50">
            <MapPin size={14} className="text-emerald-400" />
            {location.city}, {location.country} · Auto-detected via IP
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-emerald-400">
          <Loader2 size={48} className="animate-spin" />
          <p className="text-white/40">Loading prayer times…</p>
        </div>
      ) : error ? (
        <div className="glass rounded-2xl p-8 text-center text-red-400">{error}</div>
      ) : data?.timings ? (
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Main cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid sm:grid-cols-2 gap-3">
              {PRAYER_ORDER.map(name => (
                <PrayerCard
                  key={name}
                  name={name}
                  time={data.timings[name]}
                  isNext={nextPrayer?.name === name}
                />
              ))}
            </div>

            {/* Extra times panel */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-white/50 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <Calendar size={12} /> Additional Times
              </h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                {['Imsak','Midnight','Firstthird','Lastthird'].map(k => (
                  data.timings[k] ? (
                    <div key={k} className="flex justify-between text-white/40 border-b border-white/5 pb-1">
                      <span>{k}</span>
                      <span className="text-white/60 tabular-nums">{data.timings[k]}</span>
                    </div>
                  ) : null
                ))}
              </div>
            </div>

            {/* Calculation method */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-white/50 text-xs uppercase tracking-widest mb-3">Calculation Method</h3>
              <p className="text-white/70 text-sm">{data.meta?.method?.name ?? 'ISNA (Method 2)'}</p>
              <p className="text-white/30 text-xs mt-1">Lat: {data.meta?.latitude?.toFixed(4)} · Lon: {data.meta?.longitude?.toFixed(4)}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <CountdownRing nextPrayer={nextPrayer} countdown={countdown} />

            <div className="glass rounded-2xl p-5 mt-6">
              <h3 className="text-white/50 text-xs uppercase tracking-widest mb-4">All Prayers</h3>
              <div className="space-y-2">
                {PRAYER_ORDER.map(name => (
                  <div key={name} className="flex items-center justify-between">
                    <span className="text-white/50 text-sm flex items-center gap-2">
                      <span>{PRAYER_EMOJI[name]}</span>
                      <span className="font-arabic">{PRAYER_ARABIC[name]}</span>
                    </span>
                    <span className={`tabular-nums text-sm font-display ${nextPrayer?.name === name ? 'text-emerald-400 font-semibold' : 'text-white/60'}`}>
                      {data.timings[name]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
