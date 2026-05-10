import { HIJRI_MONTHS_AR } from '../services/api'

const DAYS_AR = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت']

export default function HijriDate({ hijri, now }) {
  if (!hijri) return null
  const gregStr = now.toLocaleDateString('en-GB', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
  const monthIdx = parseInt(hijri.month.number, 10) - 1
  const monthAr = HIJRI_MONTHS_AR[monthIdx] ?? hijri.month.ar
  const dayAr = DAYS_AR[now.getDay()]

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="glass-gold rounded-2xl px-6 py-4">
        <p className="font-arabic text-3xl text-amber-300 leading-relaxed">
          {dayAr} · {hijri.day} {monthAr} {hijri.year} هـ
        </p>
        <p className="text-white/40 text-sm mt-1">{gregStr}</p>
      </div>
    </div>
  )
}
