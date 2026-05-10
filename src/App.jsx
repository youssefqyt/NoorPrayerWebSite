import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Particles from './components/Particles'
import Home from './pages/Home'
import PrayerTimes from './pages/PrayerTimes'
import Athkar from './pages/Athkar'
import Features from './pages/Features'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen relative">
        {/* Animated star-field background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div style={{
            background: 'radial-gradient(ellipse at 20% 30%, rgba(16,185,129,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(245,158,11,0.06) 0%, transparent 60%), radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.05) 0%, transparent 70%)',
            position: 'absolute', inset: 0,
          }} />
        </div>
        <Particles />
        <Navbar />
        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/prayer-times" element={<PrayerTimes />} />
          <Route path="/athkar"       element={<Athkar />} />
          <Route path="/features"     element={<Features />} />
        </Routes>
      </div>
    </Router>
  )
}
