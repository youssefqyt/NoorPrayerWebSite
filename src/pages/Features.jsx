import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { usePrayerTimes } from '../hooks/usePrayerTimes'
import PrayerNotifications from '../components/PrayerNotifications'
import AdhanPlayer         from '../components/AdhanPlayer'
import PrayerTracker       from '../components/PrayerTracker'
import IslamicCalendar     from '../components/IslamicCalendar'
import DailyHadith         from '../components/DailyHadith'
import CitySearch          from '../components/CitySearch'

export default function Features() {
  const [customLocation, setCustomLocation] = useState(null)
  const { data, location } = usePrayerTimes(customLocation)
  const activeLocation = customLocation ?? location

  return (
    <div className="min-h-screen pt-24 px-4 pb-20 pattern-bg max-w-6xl mx-auto">
      {/* Page header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles size={20} className="text-amber-400" />
          <h1 className="font-display text-4xl font-bold text-g-gold">Features</h1>
        </div>
        <p className="font-arabic text-2xl text-white/30">الميزات</p>
        <p className="text-white/40 text-sm mt-2">
          Prayer notifications, Adhan audio, tracker, Islamic calendar, hadiths &amp; city search
        </p>
      </div>

      {/* 2-column masonry-ish grid */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* LEFT COLUMN */}
        <div className="space-y-6">

          {/* 1. Prayer Notifications */}
          <PrayerNotifications prayerTimings={data?.timings} />

          {/* 2. Adhan Audio Player */}
          <AdhanPlayer />

          {/* 3. Daily Hadith */}
          <DailyHadith />

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">

          {/* 4. Prayer Tracker & Streaks */}
          <PrayerTracker />

          {/* 5. City Search */}
          <CitySearch
            currentCity={activeLocation}
            onSelectCity={(city) => setCustomLocation(city)}
          />
          {customLocation && (
            <div className="glass rounded-xl p-3 text-sm text-white/50 flex items-center justify-between -mt-3">
              <span>Prayer times shown for <strong className="text-emerald-400">{customLocation.city}</strong></span>
              <button
                onClick={() => setCustomLocation(null)}
                className="text-white/30 hover:text-white/60 text-xs transition-colors"
              >
                Reset to my location
              </button>
            </div>
          )}

          {/* 6. Islamic Calendar */}
          <IslamicCalendar />

        </div>
      </div>
    </div>
  )
}
