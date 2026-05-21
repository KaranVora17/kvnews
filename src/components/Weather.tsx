'use client'
import { useState, useEffect, useCallback } from 'react'

type WxData = { temp: string; icon: string; city: string }
type GeoState = 'idle' | 'loading' | 'done' | 'denied'

export default function Weather() {
  const [wx, setWx] = useState<WxData>({ temp: '—', icon: '☀', city: 'Mumbai' })
  const [geoState, setGeoState] = useState<GeoState>('idle')

  // Always load Mumbai weather on mount — no geolocation until user opts in
  useEffect(() => {
    let cancelled = false
    async function loadMumbai() {
      try {
        const res = await fetch('/api/weather?city=Mumbai')
        if (!res.ok || cancelled) return
        const d = await res.json() as { temp: string; icon: string; city: string }
        if (!cancelled) setWx({ temp: d.temp, icon: d.icon, city: d.city || 'Mumbai' })
      } catch { /* silent — default state shows — */ }
    }
    void loadMumbai()
    return () => { cancelled = true }
  }, [])

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) return
    setGeoState('loading')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords
          const res = await fetch(`/api/weather?lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lon))}`)
          if (!res.ok) { setGeoState('denied'); return }
          const d = await res.json() as { temp: string; icon: string; city: string }
          setWx({ temp: d.temp, icon: d.icon, city: d.city || 'Your city' })
          setGeoState('done')
        } catch {
          setGeoState('denied')
        }
      },
      () => setGeoState('denied'),
      { timeout: 5000 },
    )
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: 'var(--bg)',
        border: '1px solid var(--bdr)',
        borderRadius: 6,
        padding: '5px 10px',
        transition: 'background 0.4s, border-color 0.4s',
      }}
      aria-live="polite"
      aria-label={`Weather for ${wx.city}, ${wx.temp}`}
    >
      <span style={{ fontSize: 15 }} aria-hidden="true">{wx.icon}</span>
      <div>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--tx)', lineHeight: 1 }}>{wx.temp}</div>
        <div style={{ fontSize: 9, color: 'var(--mu)', marginTop: 1 }}>{wx.city}</div>
      </div>
      {geoState === 'idle' && navigator.geolocation && (
        <button
          type="button"
          onClick={requestLocation}
          title="Use my location"
          aria-label="Use my location for weather"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--mu)', padding: '0 2px', fontSize: 11, lineHeight: 1,
          }}
        >
          ⊕
        </button>
      )}
      {geoState === 'loading' && (
        <span style={{ fontSize: 10, color: 'var(--mu)' }} aria-label="Locating…">…</span>
      )}
    </div>
  )
}
