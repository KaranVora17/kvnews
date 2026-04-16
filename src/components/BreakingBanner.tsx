'use client'
import { NewsItem } from '@/lib/fetcher'

type Props = {
  item: NewsItem
  onDismiss: () => void
  onClick: (item: NewsItem) => void
}

export default function BreakingBanner({ item, onDismiss, onClick }: Props) {
  return (
    <div
      className="breaking-banner"
      style={{ justifyContent: 'space-between', gap: 0, padding: 0 }}
      role="region"
      aria-label="Breaking news"
    >
      <button
        type="button"
        className="breaking-banner-hit"
        onClick={() => onClick(item)}
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'transparent',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          font: 'inherit',
          padding: '9px 20px',
          textAlign: 'left',
        }}
        aria-label={`Open breaking story: ${item.headline}`}
      >
        <span className="breaking-dot" aria-hidden="true" />
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', flexShrink: 0 }}>
          Breaking
        </span>
        <span style={{
          fontSize: 13, fontWeight: 400,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {item.headline}
        </span>
      </button>
      <button
        type="button"
        onClick={e => { e.stopPropagation(); onDismiss() }}
        aria-label="Dismiss breaking news banner"
        style={{
          background: 'transparent', border: 'none',
          color: 'inherit', cursor: 'pointer',
          fontSize: 14, padding: '9px 20px', opacity: 0.8, flexShrink: 0,
        }}
      >
        ✕
      </button>
    </div>
  )
}
