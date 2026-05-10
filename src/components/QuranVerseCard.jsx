import { useState, useEffect } from 'react'
import { RefreshCw, BookOpen } from 'lucide-react'
import { fetchRandomVerse } from '../services/api'

export default function QuranVerseCard() {
  const [verse, setVerse] = useState(null)
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const v = await fetchRandomVerse()
      setVerse(v)
    } catch {
      setVerse({
        arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
        translation: 'Verily, in the remembrance of Allah do hearts find rest.',
        ref: '13:28',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="glass border-gradient rounded-3xl p-8 relative overflow-hidden">
      {/* Decorative star */}
      <div className="absolute top-4 right-6 text-amber-400/20 text-5xl font-arabic select-none">✦</div>
      <div className="absolute bottom-4 left-6 text-emerald-400/15 text-4xl font-arabic select-none">☽</div>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 glass-gold rounded-xl flex items-center justify-center">
          <BookOpen size={16} className="text-amber-400" />
        </div>
        <div>
          <p className="text-white/80 font-semibold text-sm">Quran Verse</p>
          <p className="text-white/30 text-xs">آية قرآنية</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="ml-auto text-white/30 hover:text-white/70 transition-all"
          title="New verse"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin text-emerald-400' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-8 bg-white/5 rounded-xl animate-pulse" />
          <div className="h-5 bg-white/5 rounded-xl animate-pulse w-3/4 ml-auto" />
          <div className="h-4 bg-white/5 rounded-xl animate-pulse" />
        </div>
      ) : verse ? (
        <>
          <p className="font-arabic text-2xl md:text-3xl text-right leading-loose text-white/95 mb-5">
            {verse.arabic}
          </p>
          <div className="h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent mb-5" />
          <p className="text-white/60 text-sm leading-relaxed italic">"{verse.translation}"</p>
          <p className="text-amber-400/60 text-xs mt-3 font-display">— Surah {verse.ref}</p>
        </>
      ) : null}
    </div>
  )
}
