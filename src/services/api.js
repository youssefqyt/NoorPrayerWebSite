import axios from 'axios'

/* ============================================================
   FREE APIS USED
   1. AlAdhan API         https://aladhan.com/prayer-times-api  (prayer times + hijri date)
   2. Quran.com API       https://api.quran.com/api/v4          (ayahs)
   3. ip-api.com          http://ip-api.com/json                (auto-detect city/coords)
   All are 100% free, no key required.
   ============================================================ */

const ALADHAN  = 'https://api.aladhan.com/v1'
const QURANAPI = 'https://api.quran.com/api/v4'

// ── Location auto-detect ─────────────────────────────────────
export async function detectLocation() {
  try {
    const { data } = await axios.get('http://ip-api.com/json?fields=city,country,countryCode,lat,lon,status')
    if (data.status === 'success') {
      return { city: data.city, country: data.country, lat: data.lat, lon: data.lon }
    }
  } catch { /* fallback */ }
  return { city: 'Tunis', country: 'Tunisia', lat: 36.8065, lon: 10.1815 }
}

// ── Prayer times ─────────────────────────────────────────────
export async function fetchPrayerTimes(lat, lon) {
  const { data } = await axios.get(`${ALADHAN}/timings`, {
    params: { latitude: lat, longitude: lon, method: 2 },
  })
  return data.data
}

// ── Hijri date ────────────────────────────────────────────────
export async function fetchHijriDate() {
  const today = new Date()
  const d = String(today.getDate()).padStart(2,'0')
  const m = String(today.getMonth()+1).padStart(2,'0')
  const y = today.getFullYear()
  const { data } = await axios.get(`${ALADHAN}/gToH/${d}-${m}-${y}`)
  return data.data.hijri
}

// ── Quran random verse (free, no key) ────────────────────────
// Uses Quran.com v4 API – chapter 2 has 286 ayahs as pool
const VERSE_POOL = [
  { chapter:2,  verse:286 }, { chapter:3,  verse:200 }, { chapter:13, verse:28  },
  { chapter:65, verse:3   }, { chapter:94, verse:6   }, { chapter:33, verse:56  },
  { chapter:2,  verse:152 }, { chapter:39, verse:53  }, { chapter:3,  verse:139 },
  { chapter:57, verse:4   },
]

export async function fetchRandomVerse() {
  const pick = VERSE_POOL[Math.floor(Math.random() * VERSE_POOL.length)]
  const { data } = await axios.get(
    `${QURANAPI}/verses/by_key/${pick.chapter}:${pick.verse}`,
    { params: { language:'en', words:false, translations:'131', fields:'text_uthmani' } }
  )
  const v = data.verse
  return {
    arabic: v.text_uthmani,
    translation: v.translations?.[0]?.text?.replace(/<[^>]+>/g,'') ?? '',
    ref: `${pick.chapter}:${pick.verse}`,
  }
}

// ── Athkar data (local – no API needed) ──────────────────────
export const ATHKAR = {
  morning: {
    label: 'Morning', arabic: 'الصباح', icon: '🌅', color: 'gold',
    items: [
      { id:1, arabic:'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ', transliteration:'Asbahna wa asbahal mulku lillah walhamdu lillah la ilaha illallah wahdahu la sharika lah', translation:'We have reached the morning and at this very time all sovereignty belongs to Allah…', count:1, source:'Muslim' },
      { id:2, arabic:'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ', transliteration:"Allahumma bika asbahna wa bika amsayna wa bika nahya wa bika namutu wa ilaykan nushur", translation:'O Allah, by You we enter morning and by You we enter evening, by You we live and by You we die…', count:1, source:'Tirmidhi' },
      { id:3, arabic:'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', transliteration:'Subhanallahi wa bihamdihi', translation:'Glory be to Allah and praise Him.', count:100, source:'Bukhari & Muslim' },
      { id:4, arabic:'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', transliteration:'La ilaha illallah wahdahu la sharika lah, lahul mulku wa lahul hamdu wa huwa ala kulli shayin qadir', translation:'None has the right to be worshipped but Allah, alone, without partner…', count:10, source:'Bukhari & Muslim' },
    ],
  },
  evening: {
    label: 'Evening', arabic: 'المساء', icon: '🌙', color: 'emerald',
    items: [
      { id:5, arabic:'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ', transliteration:'Amsayna wa amsal mulku lillah walhamdu lillah la ilaha illallah wahdahu la sharika lah', translation:'We have reached the evening and at this very time all sovereignty belongs to Allah…', count:1, source:'Muslim' },
      { id:6, arabic:'اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ', transliteration:"Allahumma ma amsa bi min ni'matin faminka wahdaka la sharika lak, falakal hamdu wa lakash shukr", translation:'O Allah, whatever blessing I have received this evening is from You alone…', count:1, source:'Abu Dawud' },
      { id:7, arabic:'حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ', transliteration:"Hasbiyallahu la ilaha illa huwa 'alayhi tawakkaltu wa huwa rabbul 'arshil 'adhim", translation:'Allah is sufficient for me; there is no deity except Him. In Him I have put my trust…', count:7, source:'Abu Dawud' },
    ],
  },
  sleep: {
    label: 'Sleep', arabic: 'النوم', icon: '😴', color: 'purple',
    items: [
      { id:8, arabic:'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', transliteration:'Bismika Allahumma amutu wa ahya', translation:'In Your name O Allah, I die and I live.', count:1, source:'Bukhari' },
      { id:9, arabic:'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ', transliteration:"Allahumma qini 'adhabaka yawma tab'athu 'ibadak", translation:'O Allah, protect me from Your punishment on the Day You resurrect Your slaves.', count:3, source:'Abu Dawud' },
      { id:10, arabic:'سُبْحَانَ اللَّهِ • الْحَمْدُ لِلَّهِ • اللَّهُ أَكْبَرُ', transliteration:'Subhanallah • Alhamdulillah • Allahu Akbar', translation:'Glory be to Allah • All praise is for Allah • Allah is the Greatest.', count:33, source:'Bukhari & Muslim' },
      { id:11, arabic:'آيَةُ الْكُرْسِيِّ', transliteration:'Ayat Al-Kursi (2:255)', translation:'Recite Ayat Al-Kursi before sleeping — the greatest verse in the Quran.', count:1, source:'Bukhari' },
    ],
  },
  prayer: {
    label: 'After Prayer', arabic: 'بعد الصلاة', icon: '🤲', color: 'teal',
    items: [
      { id:12, arabic:'سُبْحَانَ اللَّهِ', transliteration:'Subhanallah', translation:'Glory be to Allah.', count:33, source:'Muslim' },
      { id:13, arabic:'الْحَمْدُ لِلَّهِ', transliteration:'Alhamdulillah', translation:'All praise is for Allah.', count:33, source:'Muslim' },
      { id:14, arabic:'اللَّهُ أَكْبَرُ', transliteration:'Allahu Akbar', translation:'Allah is the Greatest.', count:33, source:'Muslim' },
      { id:15, arabic:'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', transliteration:'La ilaha illallah wahdahu la sharika lah, lahul mulku wa lahul hamdu wa huwa ala kulli shayin qadir', translation:'None has the right to be worshipped but Allah alone, without partner. To Him belongs dominion…', count:1, source:'Muslim' },
    ],
  },
}

// ── Daily Hadith (HadithAPI.com – free, no key) ───────────────
const HADITH_API = 'https://hadithapi.com/public-api/hadiths'
const HADITH_BOOKS = [
  { slug: 'sahih-bukhari',  name: 'Sahih Bukhari'  },
  { slug: 'sahih-muslim',   name: 'Sahih Muslim'   },
  { slug: 'al-tirmidhi',    name: 'Jami al-Tirmidhi' },
]

export async function fetchDailyHadith(bookSlug = 'sahih-bukhari') {
  // Pick a deterministic hadith based on day-of-year so it changes daily
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  const pageNum   = (dayOfYear % 100) + 1

  try {
    const { data } = await axios.get(HADITH_API, {
      params: { bookSlug, paginate: 1, page: pageNum },
    })
    const hadiths = data?.hadiths?.data ?? []
    if (hadiths.length > 0) {
      const h = hadiths[0]
      return {
        arabic:      h.hadithArabic  ?? '',
        english:     h.hadithEnglish ?? '',
        urdu:        h.hadithUrdu    ?? '',
        book:        h.book?.bookName ?? bookSlug,
        chapter:     h.chapter?.chapterEnglish ?? '',
        reference:   `${h.book?.bookName ?? bookSlug} – Hadith ${h.hadithNumber}`,
        bookSlug,
      }
    }
  } catch { /* fall through to fallback */ }

  // Offline fallback
  return {
    arabic:    'حَدَّثَنَا عَبْدُ اللَّهِ بْنُ يُوسُفَ، قَالَ أَخْبَرَنَا مَالِكٌ',
    english:   'Actions are judged by intentions, and every person will get what they intended. So whoever emigrated for Allah and His Messenger, his emigration will be for Allah and His Messenger.',
    book:      'Sahih Bukhari',
    chapter:   'Revelation',
    reference: 'Sahih Bukhari – Hadith 1',
    bookSlug,
  }
}

export const HADITH_BOOKS_LIST = HADITH_BOOKS

// ── City Search (AlAdhan geocode) ─────────────────────────────
export async function searchCities(query) {
  if (!query || query.length < 2) return []
  try {
    // AlAdhan prayer times by city — use this to validate city exists
    const { data } = await axios.get(`${ALADHAN}/timingsByCity`, {
      params: { city: query, country: '', method: 2 },
    })
    if (data?.data?.meta) {
      const m = data.data.meta
      return [{
        city:    query,
        country: m.timezone?.split('/')?.[0] ?? '',
        lat:     m.latitude,
        lon:     m.longitude,
        label:   `${query} (${m.timezone})`,
      }]
    }
  } catch { /* no results */ }
  return []
}

// Geocoding via open-meteo's geocoding API (free, no key)
export async function geocodeCity(query) {
  if (!query || query.length < 2) return []
  try {
    const { data } = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: { name: query, count: 6, language: 'en', format: 'json' },
    })
    return (data?.results ?? []).map(r => ({
      city:    r.name,
      country: r.country ?? '',
      lat:     r.latitude,
      lon:     r.longitude,
      label:   [r.name, r.admin1, r.country].filter(Boolean).join(', '),
    }))
  } catch { return [] }
}

// ── Islamic Calendar – full month (AlAdhan) ───────────────────
export async function fetchHijriMonth(gregorianYear, gregorianMonth) {
  const { data } = await axios.get(`${ALADHAN}/gToHCalendar/${gregorianMonth}/${gregorianYear}`)
  return data.data ?? []
}

// ── Constants ─────────────────────────────────────────────────
export const PRAYER_ORDER  = ['Fajr','Sunrise','Dhuhr','Asr','Maghrib','Isha']
export const PRAYER_ARABIC = { Fajr:'الفجر', Sunrise:'الشروق', Dhuhr:'الظهر', Asr:'العصر', Maghrib:'المغرب', Isha:'العشاء' }
export const PRAYER_EMOJI  = { Fajr:'🌙', Sunrise:'🌅', Dhuhr:'☀️', Asr:'🌤️', Maghrib:'🌇', Isha:'⭐' }
export const HIJRI_MONTHS  = ['Muharram','Safar','Rabi\' al-Awwal','Rabi\' al-Thani','Jumada al-Awwal','Jumada al-Thani','Rajab','Sha\'ban','Ramadan','Shawwal','Dhu al-Qi\'dah','Dhu al-Hijjah']
export const HIJRI_MONTHS_AR = ['مُحَرَّم','صَفَر','رَبِيع الأَوَّل','رَبِيع الثَّانِي','جُمَادَى الأُولَى','جُمَادَى الآخِرَة','رَجَب','شَعْبَان','رَمَضَان','شَوَّال','ذُو القَعْدَة','ذُو الحِجَّة']
