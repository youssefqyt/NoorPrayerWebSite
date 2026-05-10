import { MapPin, Loader2 } from 'lucide-react'
import Clock from '../components/Clock'
import HijriDate from '../components/HijriDate'
import PrayerCard from '../components/PrayerCard'
import CountdownRing from '../components/CountdownRing'
import QuranVerseCard from '../components/QuranVerseCard'
import QiblaCompass from '../components/QiblaCompass'
import PrayerTracker from '../components/PrayerTracker'
import { usePrayerTimes } from '../hooks/usePrayerTimes'
import { PRAYER_ORDER } from '../services/api'

export default function Home() {
  const { data, hijri, location, loading, error, now, nextPrayer, countdown } = usePrayerTimes()

  return (
    <div className="min-h-screen pt-16 pattern-bg">

      {/* ── HERO ────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden">
        {/* Decorative mosque silhouette */}
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none select-none overflow-hidden opacity-[0.04]">
          <svg viewBox="0 0 800 300" className="w-full max-w-3xl" fill="currentColor">
            <path d="M380 280V180c0-33 27-60 60-60h0c0-40-27-80-60-80-33 0-60 40-60 80h0c33 0 60 27 60 60v100z" className="text-emerald-400"/>
            <rect x="340" y="280" width="120" height="10" rx="2" className="text-emerald-400"/>
            <path d="M250 280V220c0-22 18-40 40-40h0c0-28-18-55-40-55s-40 27-40 55h0c22 0 40 18 40 40v60z" className="text-emerald-400"/>
            <path d="M510 280V220c0-22 18-40 40-40h0c0-28-18-55-40-55s-40 27-40 55h0c22 0 40 18 40 40v60z" className="text-emerald-400"/>
            <rect x="0" y="280" width="800" height="10" className="text-emerald-400"/>
            <ellipse cx="400" cy="90" rx="8" ry="12" className="text-amber-400 fill-amber-400"/>
          </svg>
        </div>

        {/* Animated moon */}
        <div className="anim-moon text-6xl mb-6 select-none">🌙</div>

        {/* Brand */}
        <h1 className="font-display text-5xl md:text-7xl font-bold text-g-dual mb-2">Noor Prayer</h1>
        <p className="font-arabic text-2xl text-white/40 mb-2">نور · ضياء · هداية</p>
        <p className="text-white/30 text-sm mb-10 max-w-md">
          Your modern Islamic companion — prayer times, athkar, Quran & Qibla direction.
        </p>

        {/* Location badge */}
        {location && (
          <div className="flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-white/60 mb-10">
            <MapPin size={14} className="text-emerald-400" />
            {location.city}, {location.country}
          </div>
        )}

        {/* Clock */}
        <Clock now={now} />

        {/* Hijri date */}
        <div className="mt-8">
          <HijriDate hijri={hijri} now={now} />
        </div>
      </section>

      {/* ── PRAYER TIMES ────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* Prayer cards */}
          <div className="lg:col-span-2">
            <h2 className="text-white/50 text-xs tracking-widest uppercase mb-4 flex items-center gap-2">
              <span className="h-px flex-1 bg-white/10" />
              Prayer Times · مواقيت الصلاة
              <span className="h-px flex-1 bg-white/10" />
            </h2>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-emerald-400">
                <Loader2 size={36} className="animate-spin" />
                <p className="text-white/40 text-sm">Detecting your location…</p>
              </div>
            ) : error ? (
              <div className="glass rounded-2xl p-8 text-center text-red-400">{error}</div>
            ) : data?.timings ? (
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
            ) : null}
          </div>

          {/* Sidebar: countdown + qibla + tracker */}
          <div className="space-y-6">
            <CountdownRing nextPrayer={nextPrayer} countdown={countdown} />
            <QiblaCompass location={location} />
            <PrayerTracker />
          </div>
        </div>
      </section>

      {/* ── QURAN VERSE ─────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-4 pb-20">
        <h2 className="text-white/50 text-xs tracking-widest uppercase mb-4 flex items-center gap-2">
          <span className="h-px flex-1 bg-white/10" />
          Daily Verse · آية اليوم
          <span className="h-px flex-1 bg-white/10" />
        </h2>
        <QuranVerseCard />
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className="border-t border-white/5 py-8 text-center text-white/20 text-xs">
        <p className="font-arabic text-lg text-white/15 mb-2">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
        <p>Noor Prayer · Built with ❤️ using AlAdhan API & Quran.com API</p>
      </footer>
    </div>
  )
}
