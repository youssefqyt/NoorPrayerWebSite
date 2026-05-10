import { useState, useEffect } from 'react'
import { Navigation2 } from 'lucide-react'

const MECCA_LAT = 21.4225
const MECCA_LON = 39.8262

function calcQibla(lat, lon) {
  const φ1 = (lat * Math.PI) / 180
  const φ2 = (MECCA_LAT * Math.PI) / 180
  const Δλ = ((MECCA_LON - lon) * Math.PI) / 180
  const x = Math.sin(Δλ) * Math.cos(φ2)
  const y = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)
  let θ = (Math.atan2(x, y) * 180) / Math.PI
  return (θ + 360) % 360
}

export default function QiblaCompass({ location }) {
  const [angle, setAngle] = useState(null)

  useEffect(() => {
    if (location?.lat && location?.lon) {
      setAngle(calcQibla(location.lat, location.lon))
    }
  }, [location])

  return (
    <div className="glass rounded-3xl p-6 flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <Navigation2 size={16} className="text-emerald-400" />
        <span className="text-white/70 text-sm font-semibold">Qibla Direction</span>
        <span className="font-arabic text-white/30 text-sm">اتجاه القبلة</span>
      </div>
      <div className="relative w-32 h-32">
        {/* Compass circle */}
        <div className="absolute inset-0 rounded-full glass-emerald flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border border-emerald-400/20 flex items-center justify-center">
            <div
              className="flex flex-col items-center transition-transform duration-700"
              style={{ transform: angle !== null ? `rotate(${angle}deg)` : 'rotate(0deg)' }}
            >
              <div className="w-1 h-10 bg-gradient-to-b from-emerald-400 to-transparent rounded-full" />
              <div className="text-lg mt-0.5">🕋</div>
            </div>
          </div>
        </div>
        {/* Cardinal marks */}
        {['N','E','S','W'].map((d, i) => (
          <div key={d} className="absolute text-[9px] text-white/25 font-bold"
            style={{
              top: i===0?'2px':i===2?'auto':'50%',
              bottom: i===2?'2px':'auto',
              left: i===3?'2px':i===1?'auto':'50%',
              right: i===1?'2px':'auto',
              transform: (i===0||i===2)?'translateX(-50%)':'translateY(-50%)',
            }}>{d}</div>
        ))}
      </div>
      {angle !== null ? (
        <p className="text-emerald-400 font-display text-sm">{Math.round(angle)}° from North</p>
      ) : (
        <p className="text-white/30 text-xs">Detecting location…</p>
      )}
    </div>
  )
}
