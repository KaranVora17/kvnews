'use client'
import type { CSSProperties } from 'react'
import { NewsItem } from '@/lib/fetcher'
import { formatAge } from '@/lib/formatAge'
import StoryImage from './StoryImage'

type Props = {
  item: NewsItem
  variant: 'hero' | 'standard'
  onClick: (item: NewsItem) => void
  category?: string
}

export const CATEGORY_FALLBACKS: Record<string, string> = {
  global:     'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=85',
  india:      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=85',
  business:   'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=85',
  technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85',
  sports:     'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=85',
  football:   'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=85',
  cricket:    'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&q=85',
}
const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=85'

const btnReset: CSSProperties = {
  font: 'inherit',
  color: 'inherit',
  textAlign: 'left',
  width: '100%',
  cursor: 'pointer',
  border: 'none',
  padding: 0,
  margin: 0,
  background: 'transparent',
  appearance: 'none',
  WebkitAppearance: 'none',
}

export default function NewsCard({ item, variant, onClick, category }: Props) {
  const fallback = (category && CATEGORY_FALLBACKS[category]) || DEFAULT_FALLBACK
  const img = item.image || fallback

  /* ── HERO: image top, text below ── */
  if (variant === 'hero') {
    return (
      <button
        type="button"
        aria-label={`Read story: ${item.headline}`}
        onClick={() => onClick(item)}
        style={{
          ...btnReset,
          display: 'block',
          background: 'var(--sur)',
          border: '1px solid var(--bdr)',
          borderRadius: 10,
          overflow: 'hidden',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          width: '100%',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--acc)'
          e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--bdr)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <StoryImage
          src={img}
          alt=""
          sizes="(max-width: 768px) 100vw, 600px"
          fallbackSrc={fallback}
          wrapperStyle={{ width: '100%', height: 210, background: 'var(--bdr)' }}
          objectPosition="top center"
        />
        <div style={{ padding: '12px 14px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
            {item.breaking && (
              <span style={{
                fontSize: 10, fontWeight: 600,
                background: '#e53e3e', color: '#fff',
                padding: '2px 7px', borderRadius: 3,
                letterSpacing: 0.8, textTransform: 'uppercase',
              }}>Breaking</span>
            )}
            {item.trending && !item.breaking && (
              <span style={{
                fontSize: 10, fontWeight: 500,
                background: 'var(--acc)', color: 'var(--sur)',
                padding: '2px 7px', borderRadius: 3,
                letterSpacing: 0.8, textTransform: 'uppercase',
              }}>Trending</span>
            )}
            <span style={{ fontSize: 10, color: 'var(--mu)' }}>{formatAge(item.ageMinutes)}</span>
          </div>
          <div style={{
            fontSize: 15, fontWeight: 600, color: 'var(--tx)',
            lineHeight: 1.35, marginBottom: 5,
            display: '-webkit-box', WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {item.headline}
          </div>
          {item.summary && (
            <div style={{
              fontSize: 12, color: 'var(--mu)', lineHeight: 1.5,
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {item.summary}
            </div>
          )}
        </div>
      </button>
    )
  }

  /* ── STANDARD: text left, image right ── */
  return (
    <button
      type="button"
      aria-label={`Read story: ${item.headline}`}
      onClick={() => onClick(item)}
      style={{
        ...btnReset,
        display: 'flex',
        alignItems: 'stretch',
        background: 'var(--sur)',
        border: '1px solid var(--bdr)',
        borderRadius: 8,
        overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--acc)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--bdr)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Text left */}
      <div style={{
        padding: '10px 12px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        minWidth: 0,
      }}>
        <div style={{
          fontSize: 12, fontWeight: 500, color: 'var(--tx)',
          lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {item.headline}
        </div>
        <div style={{ fontSize: 10, color: 'var(--mu)', marginTop: 6 }}>
          {formatAge(item.ageMinutes)}
        </div>
      </div>
      {/* Image right */}
      <StoryImage
        src={img}
        alt=""
        sizes="100px"
        fallbackSrc={fallback}
        wrapperStyle={{
          width: 100,
          minWidth: 100,
          alignSelf: 'stretch',
          background: 'var(--bdr)',
          flexShrink: 0,
        }}
        objectPosition="top center"
      />
    </button>
  )
}
