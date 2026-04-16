'use client'
import type { CSSProperties } from 'react'
import { NewsItem } from '@/lib/fetcher'
import { formatAge } from '@/lib/formatAge'
import StoryImage, { STORY_IMAGE_FALLBACK } from './StoryImage'

type Props = {
  item: NewsItem
  variant: 'hero' | 'small'
  onClick: (item: NewsItem) => void
}

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

export default function NewsCard({ item, variant, onClick }: Props) {
  const src = item.image || STORY_IMAGE_FALLBACK
  const label = `Read story: ${item.headline}`

  if (variant === 'hero') {
    return (
      <button
        type="button"
        aria-label={label}
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
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--acc)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bdr)' }}
      >
        <StoryImage
          src={src}
          alt=""
          sizes="210px"
          wrapperStyle={{
            width: 210,
            minWidth: 210,
            alignSelf: 'stretch',
            background: 'var(--bdr)',
          }}
          wrapperClassName="hero-img"
        />

        <div style={{
          padding: '16px 18px', flex: 1,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            {item.trending && (
              <span style={{
                display: 'inline-block', fontSize: 10, fontWeight: 500,
                background: 'var(--acc)', color: 'var(--sur)',
                padding: '2px 8px', borderRadius: 3, marginBottom: 8,
                letterSpacing: 0.8, textTransform: 'uppercase',
              }}>
                Trending
              </span>
            )}
            <div style={{
              fontSize: 15, fontWeight: 500, color: 'var(--tx)',
              lineHeight: 1.45, marginBottom: 8,
            }}>
              {item.headline}
            </div>
            <div style={{ fontSize: 12, color: 'var(--mu)', lineHeight: 1.6, marginBottom: 10 }}>
              {item.summary}
            </div>
          </div>
          <div style={{ fontSize: 10, color: 'var(--mu)' }}>
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
        src={src}
        alt=""
        sizes="(max-width: 600px) 50vw, 220px"
        wrapperStyle={{ height: 90, background: 'var(--bdr)' }}
      />
      <div style={{ padding: '10px 12px' }}>
        <div style={{
          fontSize: 12, fontWeight: 500, color: 'var(--tx)',
          lineHeight: 1.4, marginBottom: 4,
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
