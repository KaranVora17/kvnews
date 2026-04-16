import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const WX_ICONS: Record<string, string> = {
  '01': '☀', '02': '⛅', '03': '☁', '04': '☁',
  '09': '🌧', '10': '🌦', '11': '⛈', '13': '❄', '50': '🌫',
}

export async function GET(req: NextRequest) {
  const key =
    process.env.OPENWEATHER_API_KEY ||
    process.env.OPENWEATHER_KEY
  if (!key) {
    return NextResponse.json(
      { error: 'Weather not configured' },
      { status: 503 }
    )
  }

  const { searchParams } = new URL(req.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')
  const city = searchParams.get('city') || 'Mumbai'

  let url: string
  if (lat != null && lon != null && lat !== '' && lon !== '') {
    const la = encodeURIComponent(lat)
    const lo = encodeURIComponent(lon)
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${la}&lon=${lo}&units=metric&appid=${encodeURIComponent(key)}`
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${encodeURIComponent(key)}`
  }

  try {
    const res = await fetch(url, { next: { revalidate: 0 } })
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Weather upstream error' },
        { status: 502 }
      )
    }
    const d = (await res.json()) as {
      name?: string
      weather?: { icon?: string }[]
      main?: { temp?: number }
    }
    const iconCode = String(d.weather?.[0]?.icon || '01d').slice(0, 2)
    return NextResponse.json({
      temp: `${Math.round(d.main?.temp ?? 0)}°C`,
      icon: WX_ICONS[iconCode] || '☀',
      city: d.name || city,
    })
  } catch {
    return NextResponse.json(
      { error: 'Weather request failed' },
      { status: 502 }
    )
  }
}
