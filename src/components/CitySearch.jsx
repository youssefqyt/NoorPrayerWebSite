import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, X, Star, StarOff } from 'lucide-react'
import { geocodeCity } from '../services/api'

const SAVED_KEY = 'noor_saved_cities'

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]') } catch { return [] }
}
function saveSaved(arr) {
  try { localStorage.setItem(SAVED_KEY, JSON.stringify(arr)) } catch {}
}

export default function CitySearch({ onSelectCity, currentCity }) {
  const [query, setQuery]           = useState('')
  const [results, setResults]       = useState([])
  const [searching, setSearching]   = useState(false)
  const [saved, setSaved]           = useState(loadSaved)
  const [showSaved, setShowSaved]   = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      const r = await geocodeCity(query)
      setResults(r)
      setSearching(false)
    }, 400)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  const select = (city) => {
    setQuery('')
    setResults([])
    setShowSaved(false)
    onSelectCity?.(city)
  }

  const toggleSave = (city, e) => {
    e.stopPropagation()
    const exists = saved.some(c => c.lat === city.lat && c.lon === city.lon)
    const next = exists
      ? saved.filter(c => !(c.lat === city.lat && c.lon === city.lon))
      : [...saved.slice(-4), city]
    setSaved(next)
    saveSaved(next)
  }

  const isSaved = (city) => saved.some(c => c.lat === city.lat && c.lon === city.lon)

  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold">City Search</h3>
          <p className="text-white/40 text-xs font-arabic">البحث عن المدينة</p>
        </div>
        <Search size={18} className="text-sky-400" />
      </div>

      {/* Current city badge */}
      {currentCity && (
        <div className="flex items-center gap-2 text-emerald-400 text-sm">
          <MapPin size={13} />
          <span>Currently: <strong>{currentCity.city}</strong>, {currentCity.country}</span>
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search any city worldwide…"
          className="w-full glass rounded-xl pl-9 pr-9 py-2.5 text-sm text-white/80 placeholder-white/25 bg-transparent outline-none focus:border-white/20 border border-transparent transition-colors"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Search results */}
      {searching && (
        <div className="text-white/40 text-sm flex items-center gap-2">
          <span className="w-3 h-3 border border-white/30 border-t-white/70 rounded-full animate-spin" />
          Searching…
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-1">
          {results.map((city, i) => (
            <button
              key={i}
              onClick={() => select(city)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <MapPin size={13} className="text-sky-400 shrink-0" />
                <div>
                  <p className="text-white/80 text-sm">{city.city}</p>
                  <p className="text-white/30 text-xs">{city.country}</p>
                </div>
              </div>
              <button
                onClick={(e) => toggleSave(city, e)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-amber-400"
              >
                {isSaved(city) ? <Star size={14} className="text-amber-400 fill-amber-400" /> : <Star size={14} />}
              </button>
            </button>
          ))}
        </div>
      )}

      {/* Saved cities */}
      {saved.length > 0 && (
        <div>
          <button
            onClick={() => setShowSaved(!showSaved)}
            className="text-white/40 text-xs uppercase tracking-widest hover:text-white/60 transition-colors flex items-center gap-2 w-full"
          >
            <Star size={10} className="text-amber-400" />
            Saved Cities ({saved.length})
            <span className="h-px flex-1 bg-white/10" />
          </button>
          {showSaved && (
            <div className="mt-2 space-y-1">
              {saved.map((city, i) => (
                <button
                  key={i}
                  onClick={() => select(city)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <Star size={11} className="text-amber-400 fill-amber-400 shrink-0" />
                    <div>
                      <p className="text-white/70 text-sm">{city.city}</p>
                      <p className="text-white/25 text-xs">{city.country}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => toggleSave(city, e)}
                    className="text-white/20 hover:text-red-400 transition-colors"
                  >
                    <X size={13} />
                  </button>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
