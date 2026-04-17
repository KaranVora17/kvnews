import { XMLParser } from 'fast-xml-parser'
import he from 'he'
import { Category } from './sources'

export type NewsItem = {
  id: string
  headline: string
  summary: string
  image: string | null
  url: string
  publishedAt: string
  ageMinutes: number
  trending: boolean
  breaking: boolean
}

// Hard cap: never show stories older than 23 hours
const MAX_AGE_MINUTES = 23 * 60

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  isArray: (name) => ['item', 'entry'].includes(name),
})

function cleanHeadline(raw: string): string {
  return he.decode(raw)
    .replace(/^(WATCH|EXCLUSIVE|BREAKING|VIDEO|PHOTOS?|LIVE)[:\s|]+/gi, '')
    .replace(/^[A-Z ]{4,20}\s*[:|]\s*/, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function cleanSummary(raw: string): string {
  return he.decode(raw)
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200)
}

function extractTextField(raw: unknown, depth = 0): string {
  if (raw == null || depth > 6) return ''
  if (typeof raw === 'string') return raw
  if (typeof raw === 'object') {
    const o = raw as Record<string, unknown>
    if (typeof o['#text'] === 'string') return o['#text']
    if (typeof o['_'] === 'string') return o['_']
    for (const k of ['div', 'p', 'content', 'summary']) {
      if (k in o && o[k] != null) {
        const inner = extractTextField(o[k], depth + 1)
        if (inner) return inner
      }
    }
  }
  return String(raw)
}

function extractTitle(item: Record<string, unknown>): string {
  return extractTextField(item.title)
}

function extractBodyForSummary(item: Record<string, unknown>): string {
  return extractTextField(item.description ?? item.summary ?? item.content)
}

function extractLink(item: Record<string, unknown>): string {
  const raw = item.link
  if (typeof raw === 'string') return raw
  if (raw && typeof raw === 'object') {
    const o = raw as Record<string, unknown>
    if (typeof o['#text'] === 'string') return o['#text']
    if (typeof o['@_href'] === 'string') return o['@_href']
  }
  return String(item.guid || '')
}

function extractImage(item: Record<string, unknown>): string | null {
  const https = (url: string) => url.replace(/^http:\/\//, 'https://')

  // 1. media:thumbnail — BBC feeds
  const thumb = item['media:thumbnail'] as Record<string, string> | undefined
  if (thumb?.['@_url']) return https(thumb['@_url'])

  // 2. media:content — NDTV, The Hindu, ESPN Cricinfo
  const mc = item['media:content']
  if (mc) {
    if (typeof mc === 'object' && !Array.isArray(mc)) {
      const url = (mc as Record<string, string>)['@_url']
      if (url) return https(url)
    }
    if (Array.isArray(mc)) {
      for (const m of mc) {
        const url = (m as Record<string, string>)['@_url']
        if (url) return https(url)
      }
    }
  }

  // 3. coverImages — ESPN Cricinfo plain text tag
  const cover = item['coverImages']
  if (typeof cover === 'string' && cover.startsWith('http')) return https(cover)

  // 4. enclosure
  const enc = item['enclosure'] as Record<string, string> | undefined
  if (enc?.['@_url'] && enc?.['@_type']?.startsWith('image')) return https(enc['@_url'])

  // 5. image tag
  const img = item['image'] as Record<string, unknown> | undefined
  if (typeof img?.url === 'string') return https(img.url as string)

  // 6. src= in description — only trusted CDN domains to avoid logos/ads
  const desc = extractBodyForSummary(item)
  const match = desc.match(/src=["']([^"']+\.(jpg|jpeg|png|webp))[^"']*["']/i)
  if (match) {
    const url = match[1]
    const allowed = [
      'ichef.bbci.co.uk', 'ndtvimg.com', 'thgim.com', 'imgci.com',
      'espncricinfo.com', 'skysports.com', 'espncdn.com', 'toiimg.com',
      'techcrunch.com', 'arstechnica.net', 'aljazeera.com', 'reuters.com',
      'livemint.com', 'indianexpress.com', 'goal.com',
    ]
    if (allowed.some(domain => url.includes(domain))) return https(url)
  }

  return null
}

function upscaleImage(url: string): string {
  if (url.includes('ichef.bbci.co.uk')) return url.replace(/\/\d{2,4}\//, '/800/')
  if (url.includes('skysports.com')) return url.replace(/_skysports-\d+x\d+/, '_skysports-800x450')
  if (url.includes('espncdn.com') || url.includes('espn.com')) return url.replace(/_\d+x\d+/, '_1024x576')
  if (url.includes('thehindu.com') || url.includes('thgim.com')) return url.replace(/width=\d+/, 'width=800')
  if (url.includes('ndtv.com') || url.includes('ndtvimg.com')) return url.replace(/width=\d+/, 'width=1200')
  if (url.includes('timesofindia') || url.includes('toiimg.com')) return url.replace(/width=\d+/, 'width=800').replace(/\/thumb\/\d+x\d+/, '/thumb/800x450')
  if (url.match(/-\d{2,4}x\d{2,4}\.(jpg|jpeg|png|webp)/i)) return url.replace(/-\d{2,4}x\d{2,4}(\.(jpg|jpeg|png|webp))/i, '$1')
  if (url.includes('aljazeera.com')) return url.replace(/([?&]w=)\d+/, '$1800')
  return url
}

function ageMinutes(dateStr: string): number {
  if (!dateStr) return 9999
  const pub = new Date(dateStr).getTime()
  if (isNaN(pub)) return 9999
  return Math.floor((Date.now() - pub) / 60000)
}

async function fetchFeed(url: string): Promise<NewsItem[]> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'KVNews/1.0 RSS Reader' },
      next: { revalidate: 0 },
    })
    if (!res.ok) return []
    const xml = await res.text()
    const data = parser.parse(xml)

    const items: Record<string, unknown>[] =
      data?.rss?.channel?.item ||
      data?.feed?.entry ||
      []

    return items.slice(0, 20).map((item) => {
      const row = item as Record<string, unknown>
      const title = extractTitle(row)
      const desc = extractBodyForSummary(row)
      const link = extractLink(row)
      const pubDate = String(item.pubDate || item.published || item.updated || '')
      const age = ageMinutes(pubDate)
      const rawImage = extractImage(row)

      return {
        id: Buffer.from(link).toString('base64').slice(0, 16),
        headline: cleanHeadline(title),
        summary: cleanSummary(desc),
        image: rawImage ? upscaleImage(rawImage) : null,
        url: link,
        publishedAt: pubDate,
        ageMinutes: age,
        trending: false,
        breaking: age <= 30,
      }
    }).filter(i => i.headline.length > 10)
  } catch {
    return []
  }
}

function dedup(items: NewsItem[]): NewsItem[] {
  const seen = new Set<string>()
  const result: NewsItem[] = []
  for (const item of items) {
    const key = item.headline.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40)
    if (!seen.has(key)) {
      seen.add(key)
      result.push(item)
    }
  }
  return result
}

function markTrending(items: NewsItem[], allItems: NewsItem[]): NewsItem[] {
  const counts = new Map<string, number>()
  for (const item of allItems) {
    const key = item.headline.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40)
    counts.set(key, (counts.get(key) || 0) + 1)
  }
  return items.map(item => ({
    ...item,
    trending: (counts.get(item.headline.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40)) || 0) >= 2,
  }))
}

export async function fetchCategory(category: Category): Promise<NewsItem[]> {
  const primaries = category.feeds.filter(f => f.primary)
  const fallbacks = category.feeds.filter(f => !f.primary)

  // Fresh = has image AND within 23 hours
  const fresh = (items: NewsItem[]) =>
    items.filter(i => i.image !== null && i.ageMinutes <= MAX_AGE_MINUTES)

  // Always fetch all primaries
  const primaryResults = await Promise.all(primaries.map(f => fetchFeed(f.url)))
  let allItems = primaryResults.flat()

  // Fetch ALL fallbacks if primaries don't yield 14 fresh stories
  if (fresh(allItems).length < 14 && fallbacks.length > 0) {
    const fallbackResults = await Promise.all(fallbacks.map(f => fetchFeed(f.url)))
    allItems = [...allItems, ...fallbackResults.flat()]
  }

  // Apply keyword filter only if it still leaves 14 fresh stories
  if (category.keywords && category.keywords.length > 0) {
    const kw = category.keywords.map(k => k.toLowerCase())
    const filtered = allItems.filter(item =>
      kw.some(k => item.headline.toLowerCase().includes(k) || item.summary.toLowerCase().includes(k))
    )
    if (fresh(filtered).length >= 14) allItems = filtered
  }

  const deduped = dedup(allItems)
  const withTrending = markTrending(deduped, allItems)

  return withTrending
    .filter(item => item.image !== null && item.ageMinutes <= MAX_AGE_MINUTES)
    .sort((a, b) => a.ageMinutes - b.ageMinutes)  // freshest first always
    .slice(0, 14)
}