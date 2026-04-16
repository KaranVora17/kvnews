'use client'
import { CATEGORIES } from '@/lib/sources'

type Props = {
  active: string
  onChange: (id: string) => void
}

export default function TabNav({ active, onChange }: Props) {
  return (
    <nav style={{
      background: 'var(--sur)',
      borderBottom: '1px solid var(--bdr)',
      padding: '0 24px',
      display: 'flex',
      overflowX: 'auto',
      scrollbarWidth: 'none',
      transition: 'background 0.4s, border-color 0.4s',
    }}>
      {CATEGORIES.map(cat => {
        const isActive = cat.id === active
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            style={{
              padding: '12px 16px',
              fontSize: 13,
              fontWeight: isActive ? 500 : 400,
              color: isActive ? 'var(--acc)' : 'var(--ti)',
              background: 'none',
              border: 'none',
              borderBottom: `3px solid ${isActive ? 'var(--acc)' : 'transparent'}`,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'color 0.15s, border-color 0.15s',
            }}
          >
            {cat.label}
          </button>
        )
      })}
    </nav>
  )
}
