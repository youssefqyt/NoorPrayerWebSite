import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, ChevronDown } from 'lucide-react'

// Free MP3s from everyayah.com / islamcan.com – all public domain / free
const MUEZZINS = [
  {
    id: 'mishary',
    name: 'Mishary Rashid Alafasy',
    arabic: 'مشاري راشد العفاسي',
    url: 'https://islamcan.com/audio/adhan/azan1.mp3',
  },
  {
    id: 'abdulbasit',
    name: 'Abdul Basit',
    arabic: 'عبد الباسط',
    url: 'https://islamcan.com/audio/adhan/azan2.mp3',
  },
  {
    id: 'makkah',
    name: 'Makkah (Masjid al-Haram)',
    arabic: 'مكة المكرمة',
    url: 'https://islamcan.com/audio/adhan/azan3.mp3',
  },
  {
    id: 'madinah',
    name: 'Madinah (Masjid Nabawi)',
    arabic: 'المدينة المنورة',
    url: 'https://islamcan.com/audio/adhan/azan6.mp3',
  },
  {
    id: 'fajr',
    name: 'Fajr Adhan',
    arabic: 'أذان الفجر',
    url: 'https://islamcan.com/audio/adhan/azan4.mp3',
  },
]

export default function AdhanPlayer({ autoPlayPrayer = null }) {
  const [selected, setSelected]   = useState(MUEZZINS[0])
  const [playing, setPlaying]     = useState(false)
  const [muted, setMuted]         = useState(false)
  const [volume, setVolume]       = useState(0.8)
  const [progress, setProgress]   = useState(0)
  const [duration, setDuration]   = useState(0)
  const [showList, setShowList]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setProgress(audio.currentTime)
    const onDuration   = () => setDuration(audio.duration)
    const onEnded      = () => setPlaying(false)
    const onCanPlay    = () => setLoading(false)
    const onWaiting    = () => setLoading(true)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onDuration)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('waiting', onWaiting)
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onDuration)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('waiting', onWaiting)
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume
    }
  }, [volume, muted])

  const selectMuezzin = (m) => {
    const wasPlaying = playing
    setSelected(m)
    setShowList(false)
    setPlaying(false)
    setProgress(0)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = m.url
      audioRef.current.load()
      if (wasPlaying) {
        audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
      }
    }
  }

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      if (!audio.src || audio.src !== selected.url) {
        audio.src = selected.url
        audio.load()
      }
      audio.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false))
    }
  }

  const seek = (e) => {
    if (!audioRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime = ratio * duration
  }

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00'
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  }

  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      <audio ref={audioRef} src={selected.url} preload="none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold">Adhan Player</h3>
          <p className="text-white/40 text-xs font-arabic">مشغّل الأذان</p>
        </div>
        <span className="text-2xl">🕌</span>
      </div>

      {/* Muezzin selector */}
      <div className="relative">
        <button
          onClick={() => setShowList(!showList)}
          className="w-full glass rounded-xl px-4 py-3 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
        >
          <div>
            <p className="text-white text-sm font-medium">{selected.name}</p>
            <p className="text-white/40 text-xs font-arabic">{selected.arabic}</p>
          </div>
          <ChevronDown size={16} className={`text-white/40 transition-transform ${showList ? 'rotate-180' : ''}`} />
        </button>
        {showList && (
          <div className="absolute top-full left-0 right-0 mt-1 z-20 glass rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            {MUEZZINS.map(m => (
              <button
                key={m.id}
                onClick={() => selectMuezzin(m)}
                className={`w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors text-left ${
                  selected.id === m.id ? 'bg-emerald-500/10' : ''
                }`}
              >
                <span className="text-white/80 text-sm">{m.name}</span>
                <span className="text-white/40 text-xs font-arabic">{m.arabic}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div
        className="h-1.5 bg-white/10 rounded-full cursor-pointer relative overflow-hidden"
        onClick={seek}
      >
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all"
          style={{ width: duration ? `${(progress / duration) * 100}%` : '0%' }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Play/pause */}
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full glass-emerald flex items-center justify-center text-emerald-400 hover:scale-105 transition-transform glow-e"
        >
          {loading
            ? <span className="w-4 h-4 border-2 border-emerald-400/40 border-t-emerald-400 rounded-full animate-spin" />
            : playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />
          }
        </button>

        {/* Time */}
        <div className="flex-1 flex items-center justify-between text-white/40 text-xs tabular-nums">
          <span>{fmt(progress)}</span>
          <span>{fmt(duration)}</span>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <button onClick={() => setMuted(!muted)} className="text-white/40 hover:text-white/70 transition-colors">
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range" min="0" max="1" step="0.05"
            value={muted ? 0 : volume}
            onChange={e => { setVolume(Number(e.target.value)); setMuted(false) }}
            className="w-16 accent-emerald-400 cursor-pointer"
          />
        </div>
      </div>

      <p className="text-white/25 text-xs text-center">
        Plays full Adhan — great for prayer time alerts
      </p>
    </div>
  )
}
