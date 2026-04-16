'use client'
import { useState, useEffect } from 'react'

type WxData = { temp: string; icon: string; city: string }

export default function Weather() {
  const [wx, setWx] = useState<WxData>({ temp: '—', icon: '☀', city: 'Mumbai' })

  useEffect(() => {
    async function loadFromApi(lat: string, lon: string) {
      const res = await fetch(`/api/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`)
      if (!res.ok) return null
      return res.json() as Promise<{ temp: string; icon: string; city: string }>
    }

    async function loadFallback() {
      const res = await fetch(`/api/weather?city=Mumbai`)
      if (!res.ok) return
      const d = await res.json()
      setWx({
        temp: d.temp,
        icon: d.icon,
        city: d.city || 'Mumbai',
      })
    }

    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords
          const d = await loadFromApi(String(lat), String(lon))
          if (d) {
            setWx({
              temp: d.temp,
              icon: d.icon,
              city: d.city || 'Your city',
            })
          } else {
            await loadFallback()
          }
        } catch {
          await loadFallback()
        }
      },
      () => {
        void loadFallback()
      }
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
    </div>
  )
}
