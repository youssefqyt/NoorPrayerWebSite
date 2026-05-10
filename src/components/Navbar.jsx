import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Moon } from 'lucide-react'

const links = [
  { to: '/', label: 'Home', ar: 'الرئيسية' },
  { to: '/prayer-times', label: 'Prayer Times', ar: 'مواقيت الصلاة' },
  { to: '/athkar', label: 'Athkar', ar: 'الأذكار' },
  { to: '/features', label: 'Features', ar: 'الميزات' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl glass-emerald flex items-center justify-center glow-e">
            <Moon size={18} className="text-emerald-400" />
          </div>
          <div>
            <span className="font-display text-lg font-bold text-g-emerald">Noor</span>
            <span className="text-white/40 text-xs ml-1 font-arabic">· نور</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                pathname === l.to
                  ? 'glass-emerald text-emerald-400'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Arabic brand + hamburger */}
        <div className="flex items-center gap-3">
          <span className="hidden md:block font-arabic text-white/30 text-sm">بِسْمِ اللَّهِ</span>
          <button
            className="md:hidden glass rounded-xl p-2 text-white/70"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass border-t border-white/5 px-4 py-4 space-y-1">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === l.to
                  ? 'glass-emerald text-emerald-400'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{l.label}</span>
              <span className="font-arabic text-white/40">{l.ar}</span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
