import { useState, useEffect } from 'react'
import { Bell, BellOff, Check, AlertCircle } from 'lucide-react'
import { PRAYER_ORDER, PRAYER_ARABIC, PRAYER_EMOJI } from '../services/api'

const TRACKED = PRAYER_ORDER.filter(p => p !== 'Sunrise')

function getPermission() {
  if (!('Notification' in window)) return 'unsupported'
  return Notification.permission // 'default' | 'granted' | 'denied'
}

function scheduleNotification(name, timeStr, minutesBefore = 0) {
  const [h, m] = timeStr.split(':').map(Number)
  const now = new Date()
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m - minutesBefore, 0)
  if (target <= now) return null
  const delay = target - now
  return setTimeout(() => {
    new Notification(`🕌 ${name} Prayer Time`, {
      body: minutesBefore > 0
        ? `${name} (${PRAYER_ARABIC[name]}) starts in ${minutesBefore} minutes`
        : `It's time for ${name} prayer (${PRAYER_ARABIC[name]})`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: `prayer-${name}`,
    })
  }, delay)
}

export default function PrayerNotifications({ prayerTimings }) {
  const [permission, setPermission] = useState(getPermission)
  const [enabled, setEnabled]       = useState(() => {
    try { return JSON.parse(localStorage.getItem('noor_notif_enabled') || 'false') } catch { return false }
  })
  const [minutesBefore, setMinutesBefore] = useState(() => {
    try { return Number(localStorage.getItem('noor_notif_offset') || '0') } catch { return 0 }
  })
  const [timers, setTimers]   = useState([])
  const [testSent, setTestSent] = useState(false)

  // Schedule / cancel timers whenever enabled state or timings change
  useEffect(() => {
    // Clear existing
    timers.forEach(clearTimeout)

    if (!enabled || !prayerTimings || permission !== 'granted') {
      setTimers([])
      return
    }

    const ids = TRACKED
      .map(name => scheduleNotification(name, prayerTimings[name], minutesBefore))
      .filter(Boolean)
    setTimers(ids)

    return () => ids.forEach(clearTimeout)
  }, [enabled, prayerTimings, permission, minutesBefore])

  const requestPermission = async () => {
    if (!('Notification' in window)) return
    const result = await Notification.requestPermission()
    setPermission(result)
    if (result === 'granted') {
      setEnabled(true)
      localStorage.setItem('noor_notif_enabled', 'true')
    }
  }

  const toggleEnabled = () => {
    const next = !enabled
    setEnabled(next)
    localStorage.setItem('noor_notif_enabled', JSON.stringify(next))
  }

  const sendTest = () => {
    new Notification('🕌 Noor Prayer – Test Notification', {
      body: 'Notifications are working! You will be alerted before each prayer.',
      icon: '/favicon.ico',
    })
    setTestSent(true)
    setTimeout(() => setTestSent(false), 3000)
  }

  const setOffset = (v) => {
    setMinutesBefore(v)
    localStorage.setItem('noor_notif_offset', String(v))
  }

  if (permission === 'unsupported') {
    return (
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-3 text-amber-400">
          <AlertCircle size={18} />
          <p className="text-sm">Browser notifications are not supported.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold">Prayer Notifications</h3>
          <p className="text-white/40 text-xs font-arabic">تنبيهات الصلاة</p>
        </div>
        <Bell size={20} className="text-amber-400" />
      </div>

      {permission !== 'granted' ? (
        /* Request permission */
        <div className="space-y-3">
          {permission === 'denied' ? (
            <div className="flex items-start gap-2 text-red-400 text-sm">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <p>Notifications blocked. Please allow them in your browser settings.</p>
            </div>
          ) : (
            <p className="text-white/50 text-sm">
              Get browser alerts before each prayer. Subscribe once and receive
              daily reminders automatically.
            </p>
          )}
          {permission !== 'denied' && (
            <button
              onClick={requestPermission}
              className="w-full py-2.5 rounded-xl glass-emerald text-emerald-400 text-sm font-medium hover:scale-[1.02] transition-transform"
            >
              Enable Notifications
            </button>
          )}
        </div>
      ) : (
        /* Controls */
        <div className="space-y-4">
          {/* Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Alert before each prayer</p>
              <p className="text-white/30 text-xs">Works while this tab is open</p>
            </div>
            <button
              onClick={toggleEnabled}
              className={`w-12 h-6 rounded-full transition-all duration-300 relative ${
                enabled ? 'bg-emerald-500' : 'bg-white/15'
              }`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${
                enabled ? 'left-6' : 'left-0.5'
              }`} />
            </button>
          </div>

          {/* Timing offset */}
          <div>
            <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Alert timing</p>
            <div className="flex gap-2">
              {[0, 5, 10, 15].map(v => (
                <button
                  key={v}
                  onClick={() => setOffset(v)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    minutesBefore === v
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'glass text-white/50 hover:text-white/70'
                  }`}
                >
                  {v === 0 ? 'At time' : `${v} min`}
                </button>
              ))}
            </div>
          </div>

          {/* Prayers list */}
          {enabled && prayerTimings && (
            <div className="space-y-1.5">
              {TRACKED.map(name => (
                <div key={name} className="flex items-center justify-between text-sm">
                  <span className="text-white/50">{PRAYER_EMOJI[name]} {name}</span>
                  <span className="text-emerald-400 text-xs flex items-center gap-1">
                    <Check size={10} /> Scheduled
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Test button */}
          <button
            onClick={sendTest}
            className="w-full py-2 rounded-xl glass text-white/50 text-sm hover:text-white/70 hover:bg-white/5 transition-colors"
          >
            {testSent ? '✓ Test sent!' : 'Send test notification'}
          </button>
        </div>
      )}
    </div>
  )
}
