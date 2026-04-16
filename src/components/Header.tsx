'use client'
import { useClock } from '@/lib/useClock'
import { useTheme, Theme } from '@/lib/useTheme'
import Weather from './Weather'

const SunIcon = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="3" fill="currentColor"/>
    <line x1="7" y1="1" x2="7" y2="2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="7" y1="11.5" x2="7" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="1" y1="7" x2="2.5" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="11.5" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const CloudIcon = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
    <path d="M2 10 Q7 2 12 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <line x1="7" y1="12" x2="7" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="1" y1="12" x2="13" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
    <path d="M10 7.5A4 4 0 0 1 5 3a4.5 4.5 0 1 0 5 4.5z" fill="currentColor"/>
  </svg>
)

const BTNS: { t: Theme; icon: React.ReactNode; title: string }[] = [
  { t: 'morning', icon: <SunIcon />,   title: 'Morning' },
  { t: 'day',     icon: <CloudIcon />, title: 'Day'     },
  { t: 'evening', icon: <MoonIcon />,  title: 'Evening' },
]

export default function Header() {
  const { time, greet, date } = useClock()
  const { theme, setTheme } = useTheme()

  return (
    <header style={{
      background: 'var(--sur)',
      borderBottom: '1px solid var(--bdr)',
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      transition: 'background 0.4s, border-color 0.4s',
    }}>
      {/* Brand */}
      <div>
        <div style={{ fontSize: 20, fontWeight: 500, color: 'var(--acc)', letterSpacing: 5, textTransform: 'uppercase' }}>
          News.
        </div>
        <div style={{ fontSize: 9, color: 'var(--mu)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 }}>
          Your current briefing
        </div>
      </div>

      {/* Center — greeting + date */}
      <div style={{ flex: 1, textAlign: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--tx)' }}>{greet}</div>
        <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 2 }}>{date}</div>
      </div>

      {/* Right — weather + clock + theme */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Weather />

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--acc)', fontVariantNumeric: 'tabular-nums', letterSpacing: 0.5 }}>
            {time}
          </div>
          <div style={{ fontSize: 9, color: 'var(--mu)', letterSpacing: 1 }}>24-HR</div>
        </div>

        {/* Theme switcher */}
        <div style={{ display: 'flex', gap: 2 }}>
          {BTNS.map(b => (
            <button
              key={b.t}
              type="button"
              className="theme-swatch"
              title={b.title}
              aria-label={b.title}
              aria-pressed={theme === b.t}
              onClick={() => setTheme(b.t)}
              style={{
                width: 28, height: 28,
                border: `1px solid ${theme === b.t ? 'var(--acc)' : 'var(--bdr)'}`,
                background: theme === b.t ? 'var(--sur)' : 'var(--bg)',
                borderRadius: 5,
                cursor: 'pointer',
                color: theme === b.t ? 'var(--acc)' : 'var(--mu)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              {b.icon}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
