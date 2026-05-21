import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
// Upstream OWM fetch is cached for 5 min via next: { revalidate: 300 } on the fetch() call below

const WX_ICONS: Record<string, string> = {
  '01': '☀', '02': '⛅', '03': '☁', '04': '☁',
  '09': '🌧', '10': '🌦', '11': '⛈', '13': '❄', '50': '🌫',
}

// Allow letters, spaces, apostrophes, hyphens, dots, commas — covers city names worldwide
const CITY_RE = /^[a-zA-Z\s'',\-\.]{1,100}$/

function validateCoords(lat: string, lon: string): boolean {
  const latN = parseFloat(lat)
  const lonN = parseFloat(lon)
  return !isNaN(latN) && !isNaN(lonN) && latN >= -90 && latN <= 90 && lonN >= -180 && lonN <= 180
}

const CACHE_HEADERS = { 'Cache-Control': 'public, max-age=300, s-maxage=300' }

export async function GET(req: NextRequest) {
  const key = process.env.OPENWEATHER_API_KEY || process.env.OPENWEATHER_KEY
  if (!key) {
    return NextResponse.json({ error: 'Weather not configured' }, { status: 503 })
  }

  const { searchParams } = new URL(req.url)
  const lat = searchParams.get('lat') ?? ''
  const lon = searchParams.get('lon') ?? ''
  const rawCity = searchParams.get('city') ?? 'Mumbai'

  let url: string
  if (lat !== '' && lon !== '') {
    if (!validateCoords(lat, lon)) {
      return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 })
    }
    // Use validated numeric values — never forward raw strings directly into the URL
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${parseFloat(lat)}&lon=${parseFloat(lon)}&units=metric&appid=${encodeURIComponent(key)}`
  } else {
    const city = CITY_RE.test(rawCity) ? rawCity : 'Mumbai'
    url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${encodeURIComponent(key)}`
  }

  try {
    // Cache weather for 5 minutes — no need to hit OWM on every page load
    const res = await fetch(url, { next: { revalidate: 300 } })
    if (!res.ok) {
      return NextResponse.json({ error: 'Weather upstream error' }, { status: 502 }, )
    }
    const d = (await res.json()) as {
      name?: string
      weather?: { icon?: string }[]
      main?: { temp?: number }
    }
    const iconCode = String(d.weather?.[0]?.icon || '01d').slice(0, 2)
    return NextResponse.json(
      { temp: `${Math.round(d.main?.temp ?? 0)}°C`, icon: WX_ICONS[iconCode] || '☀', city: d.name || rawCity },
      { headers: CACHE_HEADERS },
    )
  } catch {
    return NextResponse.json({ error: 'Weather request failed' }, { status: 502 })
  }
}