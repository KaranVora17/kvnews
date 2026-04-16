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

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  isArray: (name) => ['item', 'entry'].includes(name),
})

// Strip common RSS headline noise
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

/** RSS/Atom often encode text as strings, `{ #text }`, or nested tags. */
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
  // Try media:thumbnail
  const media = item['media:thumbnail'] as Record<string, string> | undefined
  if (media?.['@_url']) return media['@_url']

  // Try media:content
  const content = item['media:content'] as Record<string, string> | undefined
  if (content?.['@_url']) return content['@_url']

  // Try enclosure
  const enc = item['enclosure'] as Record<string, string> | undefined
  if (enc?.['@_url'] && enc?.['@_type']?.startsWith('image')) return enc['@_url']

  // Try og:image in description
  const desc = extractBodyForSummary(item)
  const match = desc.match(/src=["']([^"']+\.(jpg|jpeg|png|webp))[^"']*["']/i)
  if (match) return match[1]

  return null
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

    return items.slice(0, 15).map((item) => {
      const row = item as Record<string, unknown>
      const title = extractTitle(row)
      const desc = extractBodyForSummary(row)
      const link = extractLink(row)
      const pubDate = String(item.pubDate || item.published || item.updated || '')
      const age = ageMinutes(pubDate)

      return {
        id: Buffer.from(link).toString('base64').slice(0, 16),
        headline: cleanHeadline(title),
        summary: cleanSummary(desc),
        image: extractImage(row),
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
    // Normalise headline to detect duplicates across sources
    const key = item.headline.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40)
    if (!seen.has(key)) {
      seen.add(key)
      result.push(item)
    }
  }
  return result
}

function markTrending(items: NewsItem[], allItems: NewsItem[]): NewsItem[] {
  // Count how many times each normalised headline appears across sources
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

  // Fetch both primaries in parallel
  const results = await Promise.all(primaries.map(f => fetchFeed(f.url)))
  let allItems = results.flat()

  // If we got fewer than 5 items, try fallback
  if (allItems.length < 5 && fallbacks.length > 0) {
    const fallbackItems = await fetchFeed(fallbacks[0].url)
    allItems = [...allItems, ...fallbackItems]
  }

  // Apply keyword filter if defined
  if (category.keywords && category.keywords.length > 0) {
    const kw = category.keywords.map(k => k.toLowerCase())
    const filtered = allItems.filter(item =>
      kw.some(k => item.headline.toLowerCase().includes(k) || item.summary.toLowerCase().includes(k))
    )
    // Only apply filter if we still have enough items
    if (filtered.length >= 5) allItems = filtered
  }

  const deduped = dedup(allItems)
  const withTrending = markTrending(deduped, allItems)

  return withTrending
    .filter(item => item.image !== null)
    .sort((a, b) => a.ageMinutes - b.ageMinutes)
    .slice(0, 10)
}
