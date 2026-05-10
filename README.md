# 🌙 Noor Prayer — نور

> A modern Islamic web app with prayer times, Athkar, Quran verses, Hijri calendar & Qibla compass.

## 🆓 Free APIs Used (No Key Required)

| Feature | API | URL |
|---|---|---|
| Prayer Times | **AlAdhan** | `https://api.aladhan.com/v1/timings` |
| Hijri Date | **AlAdhan** | `https://api.aladhan.com/v1/gToH` |
| Quran Verses | **Quran.com v4** | `https://api.quran.com/api/v4/verses/by_key` |
| Auto Location | **ip-api.com** | `http://ip-api.com/json` |
| Athkar content | **Local JSON** | Built-in (no API needed) |

All APIs are **100% free** with no API key or registration needed.

---

## ✨ Features

- 🕌 **Prayer Times** — Auto-detect location, all 6 daily prayers
- ⏳ **Live Countdown** — Animated SVG ring to next prayer
- 📅 **Hijri Date** — Full Islamic calendar (Arabic + English)
- 🕋 **Qibla Compass** — Calculated from your real coordinates
- 📖 **Quran Verses** — Daily ayahs from Quran.com API (refresh for new)
- 📿 **Athkar Pages** — Morning, Evening, Sleep & Prayer with tasbih counter
- 🌊 **Glassmorphism UI** — Blur cards, neon glows, animated gradients
- ✨ **Floating Particles** — Islamic-colored ambient particles
- 📱 **Fully Responsive** — Mobile & desktop

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
http://localhost:5173
```

## 📦 Build for Production

```bash
npm run build
npm run preview
```

## 🌐 Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

---

## 📁 Project Structure

```
noor-prayer/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation with mobile menu
│   │   ├── Clock.jsx           # Live digital clock
│   │   ├── HijriDate.jsx       # Hijri + Gregorian date
│   │   ├── PrayerCard.jsx      # Individual prayer card
│   │   ├── CountdownRing.jsx   # SVG countdown to next prayer
│   │   ├── AthkarCard.jsx      # Athkar card + tasbih counter
│   │   ├── QuranVerseCard.jsx  # Verse from Quran.com API
│   │   ├── QiblaCompass.jsx    # Qibla direction compass
│   │   └── Particles.jsx       # Ambient background particles
│   ├── pages/
│   │   ├── Home.jsx            # Main landing page
│   │   ├── PrayerTimes.jsx     # Full prayer times page
│   │   └── Athkar.jsx          # Athkar + tasbih page
│   ├── hooks/
│   │   └── usePrayerTimes.js   # Prayer data + countdown logic
│   ├── services/
│   │   └── api.js              # All API calls + athkar data
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css               # Tailwind + custom glass/glow styles
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🎨 Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS** — utility-first styling
- **Framer Motion** — animations (optional, installed)
- **Axios** — API requests
- **Lucide React** — icons
- **Google Fonts** — Amiri (Arabic), Cinzel (display), Inter (body)

---

*بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ*
