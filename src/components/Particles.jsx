import { useMemo } from 'react'

export default function Particles() {
  const particles = useMemo(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      left: Math.random() * 100,
      dur: Math.random() * 10 + 8,
      delay: Math.random() * 10,
      drift: (Math.random() - 0.5) * 80,
      opacity: Math.random() * 0.5 + 0.2,
      color: i % 3 === 0 ? '#10b981' : i % 3 === 1 ? '#f59e0b' : '#818cf8',
    })), [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            background: p.color,
            opacity: p.opacity,
            '--dur': `${p.dur}s`,
            '--delay': `${p.delay}s`,
            '--drift': `${p.drift}px`,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
        />
      ))}
    </div>
  )
}
