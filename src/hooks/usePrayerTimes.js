import { useState, useEffect, useRef } from 'react'
import { detectLocation, fetchPrayerTimes, fetchHijriDate, PRAYER_ORDER } from '../services/api'

function toMinutes(timeStr) {
  if (!timeStr) return 0
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

function getNextPrayer(timings) {
  const now = new Date()
  const curMin = now.getHours() * 60 + now.getMinutes()
  const prayers = PRAYER_ORDER.filter(p => p !== 'Sunrise').map(p => ({ name: p, min: toMinutes(timings[p]) }))
  const upcoming = prayers.find(p => p.min > curMin)
  return upcoming || prayers[0]
}

export function usePrayerTimes(customLocation = null) {
  const [data, setData] = useState(null)
  const [hijri, setHijri] = useState(null)
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [now, setNow] = useState(new Date())
  const [nextPrayer, setNextPrayer] = useState(null)
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const loc = customLocation ?? await detectLocation()
        setLocation(loc)
        const [pData, hData] = await Promise.all([
          fetchPrayerTimes(loc.lat, loc.lon),
          fetchHijriDate(),
        ])
        setData(pData)
        setHijri(hData)
      } catch (e) {
        setError('Could not load prayer times. Check your connection.')
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [customLocation?.lat, customLocation?.lon])

  useEffect(() => {
    if (!data?.timings) return
    const next = getNextPrayer(data.timings)
    setNextPrayer(next)

    const curMin = now.getHours() * 60 + now.getMinutes()
    let diff = next.min - curMin
    if (diff < 0) diff += 24 * 60
    const h = Math.floor(diff / 60)
    const m = diff % 60
    const s = 59 - now.getSeconds()
    setCountdown(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`)
  }, [now, data])

  return { data, hijri, location, loading, error, now, nextPrayer, countdown }
}
