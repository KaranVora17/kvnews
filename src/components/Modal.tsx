'use client'
import { useEffect } from 'react'
import { NewsItem } from '@/lib/fetcher'
import { formatAge } from '@/lib/formatAge'
import StoryImage, { STORY_IMAGE_FALLBACK } from './StoryImage'

type Props = {
  item: NewsItem
  onClose: () => void
}

export default function Modal({ item, onClose }: Props) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const src = item.image || STORY_IMAGE_FALLBACK

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: item.headline, url: item.url })
    } else {
      navigator.clipboard.writeText(item.url)
        .then(() => alert('Link copied to clipboard'))
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal-box">
        {/* Image */}
        <StoryImage
          src={src}
          alt=""
          sizes="(max-width: 640px) 100vw, 640px"
          wrapperStyle={{ height: 220, background: 'var(--bdr)' }}
        />

        {/* Content */}
        <div style={{ padding: '20px 24px 24px' }}>
          {/* Badges */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            {item.breaking && (
              <span style={{
                fontSize: 10, fontWeight: 500, background: 'var(--acc)', color: 'var(--sur)',
                padding: '2px 8px', borderRadius: 3, letterSpacing: 0.8, textTransform: 'uppercase',
              }}>Breaking</span>
            )}
            {item.trending && !item.breaking && (
              <span style={{
                fontSize: 10, fontWeight: 500, background: 'var(--acc)', color: 'var(--sur)',
                padding: '2px 8px', borderRadius: 3, letterSpacing: 0.8, textTransform: 'uppercase',
              }}>Trending</span>
            )}
            <span style={{ fontSize: 10, color: 'var(--mu)' }}>
              {formatAge(item.ageMinutes)}
            </span>
          </div>

          {/* Headline */}
          <h2 style={{
            fontSize: 18, fontWeight: 500, color: 'var(--tx)',
            lineHeight: 1.4, marginBottom: 12,
          }}>
            {item.headline}
          </h2>

          {/* Summary */}
          <p style={{
            fontSize: 14, color: 'var(--mu)', lineHeight: 1.7, marginBottom: 24,
          }}>
            {item.summary}
          </p>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1, padding: '10px 0',
                background: 'var(--acc)', color: 'var(--sur)',
                borderRadius: 7, textAlign: 'center',
                fontSize: 13, fontWeight: 500,
                textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Read full story →
            </a>
            <button
              onClick={handleShare}
              style={{
                padding: '10px 16px',
                background: 'var(--bg)', color: 'var(--tx)',
                border: '1px solid var(--bdr)',
                borderRadius: 7, fontSize: 13, fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Share
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '10px 16px',
                background: 'transparent', color: 'var(--mu)',
                border: '1px solid var(--bdr)',
                borderRadius: 7, fontSize: 13,
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
