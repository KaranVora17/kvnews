'use client'
import { useState, useEffect, useCallback } from 'react'
import { NewsItem } from '@/lib/fetcher'
import NewsCard from './NewsCard'
import Modal from './Modal'
import BreakingBanner from './BreakingBanner'

type Props = { category: string }

type CacheMeta = { lastUpdated: string; nextUpdate: string }

function formatUpdatedLabel(lastUpdatedIso?: string, fetchedAtIso?: string): string {
  const src = lastUpdatedIso || fetchedAtIso
  if (!src) {
    const now = new Date()
    return now.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  const d = new Date(src)
  if (Number.isNaN(d.getTime())) {
    const now = new Date()
    return now.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  return d.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function NewsFeed({ category }: Props) {
  const [items, setItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [updatedAt, setUpdatedAt] = useState('')
  const [modal, setModal] = useState<NewsItem | null>(null)
  const [breaking, setBreaking] = useState<NewsItem | null>(null)
  const [dismissed, setDismissed] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const res = await fetch(`/api/news?cat=${encodeURIComponent(category)}`)
      const data = (await res.json()) as {
        items?: NewsItem[]
        meta?: CacheMeta | null
        fetchedAt?: string
        error?: string
      }

      if (!res.ok) {
        setLoadError(
          typeof data.error === 'string' ? data.error : `Could not load news (${res.status}).`
        )
        setItems([])
        setUpdatedAt('')
        return
      }

      setItems(data.items || [])

      const meta = data.meta
      const fetchedAt = data.fetchedAt
      setUpdatedAt(formatUpdatedLabel(meta?.lastUpdated, fetchedAt))
    } catch {
      setLoadError('Network error. Check your connection and try again.')
      setItems([])
      setUpdatedAt('')
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    setDismissed(false)
    setBreaking(null)
    void load()
  }, [category, load])

  useEffect(() => {
    if (loading || dismissed) return
    const b = items.find(i => i.breaking) ?? null
    setBreaking(b)
  }, [items, dismissed, loading])

  if (loading) {
    return (
      <div style={{ padding: '48px 0', textAlign: 'center' }} role="status" aria-live="polite" aria-label="Loading news">
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--acc)',
              animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>
        <style>{`
          @keyframes pulse {
            0%,80%,100% { opacity: 0.3; transform: scale(0.8); }
            40% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    )
  }

  if (loadError) {
    return (
      <div style={{ padding: '48px 24px', textAlign: 'center', maxWidth: 360, margin: '0 auto' }}>
        <div style={{ color: 'var(--tx)', fontSize: 14, marginBottom: 12 }}>{loadError}</div>
        <button
          type="button"
          onClick={() => void load()}
          style={{
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            background: 'var(--acc)',
            color: 'var(--sur)',
            border: 'none',
            borderRadius: 6,
          }}
        >
          Try again
        </button>
      </div>
    )
  }

  if (!items.length) {
    return (
      <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--mu)', fontSize: 14 }}>
        No stories available right now. Try refreshing.
      </div>
    )
  }

  const [hero, ...rest] = items
  const row1 = rest.slice(0, 2)
  const row2 = rest.slice(2, 4)

  return (
    <>
      {breaking && !dismissed && (
        <BreakingBanner
          item={breaking}
          onClick={setModal}
          onDismiss={() => { setDismissed(true); setBreaking(null) }}
        />
      )}

      <div style={{ padding: '16px 24px' }}>
        <div style={{ fontSize: 11, color: 'var(--mu)', marginBottom: 14 }}>
          Updated {updatedAt}
        </div>

        <NewsCard item={hero} variant="hero" onClick={setModal} category={category} />

        {[row1, row2].map((row, ri) => (
          row.length > 0 && (
            <div key={ri} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
              marginBottom: 12,
            }}>
              {row.map(item => (
                <NewsCard key={item.id} item={item} variant="small" onClick={setModal} category={category} />
              ))}
            </div>
          )
        ))}
      </div>

      {modal && <Modal item={modal} onClose={() => setModal(null)} />}

      <style>{`
        @media (max-width: 600px) {
          .news-card-hero {
            flex-direction: column !important;
            height: auto !important;
            min-height: 0;
          }
          .news-card-hero .hero-img {
            width: 100% !important;
            min-width: unset !important;
            height: 180px !important;
            align-self: stretch !important;
          }
        }
      `}</style>
    </>
  )
}
