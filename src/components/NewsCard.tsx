'use client'
import type { CSSProperties } from 'react'
import { NewsItem } from '@/lib/fetcher'
import { formatAge } from '@/lib/formatAge'
import StoryImage from './StoryImage'

type Props = {
  item: NewsItem
  variant: 'hero' | 'small'
  onClick: (item: NewsItem) => void
  category?: string
}

const CATEGORY_FALLBACKS: Record<string, string> = {
  global:     'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
  india:      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
  business:   'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
  technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  sports:     'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
  football:   'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
  cricket:    'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80'

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
  const label = `Read story: ${item.headline}`

  if (variant === 'hero') {
    return (
      <button
        type="button"
        aria-label={label}
        className="news-card-hero"
        onClick={() => onClick(item)}
        style={{
          ...btnReset,
          display: 'flex',
          background: 'var(--sur)',
          border: '1px solid var(--bdr)',
          borderRadius: 10,
          overflow: 'hidden',
          marginBottom: 12,
          transition: 'border-color 0.2s',
          height: 180,
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--acc)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bdr)' }}
      >
        <StoryImage
          src={img}
          alt=""
          sizes="240px"
          fallbackSrc={fallback}
          wrapperClassName="hero-img"
          wrapperStyle={{
            width: 240,
            minWidth: 240,
            height: '100%',
            alignSelf: 'stretch',
            background: 'var(--bdr)',
            flexShrink: 0,
          }}
        />
        <div style={{
          padding: '14px 16px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          minWidth: 0,
        }}>
          <div>
            {item.trending && (
              <span style={{
                display: 'inline-block',
                fontSize: 10,
                fontWeight: 500,
                background: 'var(--acc)',
                color: 'var(--sur)',
                padding: '2px 8px',
                borderRadius: 3,
                marginBottom: 8,
                letterSpacing: 0.8,
                textTransform: 'uppercase',
              }}>
                Trending
              </span>
            )}
            <div style={{
              fontSize: 15,
              fontWeight: 500,
              color: 'var(--tx)',
              lineHeight: 1.4,
              marginBottom: 6,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {item.headline}
            </div>
            <div style={{
              fontSize: 12,
              color: 'var(--mu)',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {item.summary}
            </div>
          </div>
          <div style={{ fontSize: 10, color: 'var(--mu)', marginTop: 8 }}>
            {formatAge(item.ageMinutes)}
          </div>
        </div>
      </button>
    )
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => onClick(item)}
      style={{
        ...btnReset,
        background: 'var(--sur)',
        border: '1px solid var(--bdr)',
        borderRadius: 8,
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--acc)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bdr)' }}
    >
      <StoryImage
        src={img}
        alt=""
        sizes="(max-width: 900px) 33vw, 280px"
        fallbackSrc={fallback}
        wrapperStyle={{ height: 110, background: 'var(--bdr)' }}
      />
      <div style={{ padding: '10px 12px' }}>
        <div style={{
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--tx)',
          lineHeight: 1.4,
          marginBottom: 5,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {item.headline}
        </div>
        <div style={{ fontSize: 10, color: 'var(--mu)' }}>
          {formatAge(item.ageMinutes)}
        </div>
      </div>
    </button>
  )
}
