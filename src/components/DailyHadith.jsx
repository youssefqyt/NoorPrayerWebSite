import { useState, useEffect } from 'react'
import { BookOpen, RefreshCw, ChevronDown } from 'lucide-react'
import { fetchDailyHadith, HADITH_BOOKS_LIST } from '../services/api'

export default function DailyHadith() {
  const [hadith, setHadith]     = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [book, setBook]         = useState(HADITH_BOOKS_LIST[0].slug)
  const [showBook, setShowBook] = useState(false)
  const [showAr, setShowAr]     = useState(true)

  const load = async (bookSlug) => {
    setLoading(true)
    setError(null)
    try {
      const h = await fetchDailyHadith(bookSlug)
      setHadith(h)
    } catch {
      setError('Could not load hadith. Check connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(book) }, [book])

  const bookName = HADITH_BOOKS_LIST.find(b => b.slug === book)?.name ?? book

  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold">Daily Hadith</h3>
          <p className="text-white/40 text-xs font-arabic">الحديث اليومي</p>
        </div>
        <BookOpen size={20} className="text-amber-400" />
      </div>

      {/* Book selector */}
      <div className="relative">
        <button
          onClick={() => setShowBook(!showBook)}
          className="w-full glass rounded-xl px-4 py-2.5 flex items-center justify-between text-sm hover:bg-white/5 transition-colors"
        >
          <span className="text-white/70">{bookName}</span>
          <ChevronDown size={14} className={`text-white/40 transition-transform ${showBook ? 'rotate-180' : ''}`} />
        </button>
        {showBook && (
          <div className="absolute top-full left-0 right-0 mt-1 z-20 glass rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            {HADITH_BOOKS_LIST.map(b => (
              <button
                key={b.slug}
                onClick={() => { setBook(b.slug); setShowBook(false) }}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/5 ${
                  book === b.slug ? 'text-emerald-400 bg-emerald-500/10' : 'text-white/60'
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-10 gap-3 text-emerald-400">
          <RefreshCw size={20} className="animate-spin" />
          <span className="text-white/40 text-sm">Loading hadith…</span>
        </div>
      ) : error ? (
        <div className="text-red-400 text-sm text-center py-6">{error}</div>
      ) : hadith ? (
        <div className="space-y-4">
          {/* Arabic toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAr(!showAr)}
              className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                showAr ? 'glass-emerald text-emerald-400' : 'glass text-white/40'
              }`}
            >
              عربي
            </button>
            <button
              onClick={() => setShowAr(!showAr)}
              className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                !showAr ? 'glass-emerald text-emerald-400' : 'glass text-white/40'
              }`}
            >
              English
            </button>
          </div>

          {/* Hadith text */}
          <div className="glass rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-amber-600 rounded-l-xl" />
            <p className={`pl-3 leading-relaxed text-white/80 text-sm ${showAr && hadith.arabic ? 'font-arabic text-right text-base' : ''}`}>
              {showAr && hadith.arabic ? hadith.arabic : hadith.english}
            </p>
          </div>

          {/* If showing Arabic, show English below */}
          {showAr && hadith.arabic && hadith.english && (
            <p className="text-white/40 text-xs leading-relaxed italic">{hadith.english}</p>
          )}

          {/* Reference */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-400 text-xs font-medium">{hadith.reference}</p>
              {hadith.chapter && <p className="text-white/30 text-xs mt-0.5">{hadith.chapter}</p>}
            </div>
            <button
              onClick={() => load(book)}
              className="glass rounded-lg p-2 text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
              title="Load another hadith"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
