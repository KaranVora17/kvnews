import { NextRequest, NextResponse } from 'next/server'
import { CATEGORIES } from '@/lib/sources'
import { getCached, getMeta, setCached } from '@/lib/cache'
import { fetchCategory } from '@/lib/fetcher'

export const dynamic = 'force-dynamic'

// In-memory lock — prevents multiple simultaneous live fetches for the same category
// on cache miss (e.g. cold start with multiple concurrent users)
const inFlight = new Map<string, Promise<Awaited<ReturnType<typeof fetchCategory>>>>()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const cat = searchParams.get('cat') || 'global'

  const valid = CATEGORIES.find(c => c.id === cat)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  }

  // Try Redis cache first
  let items = await getCached(cat)
  const meta = await getMeta()

  // Cache miss — fetch live, but only one fetch per category at a time
  if (!items || items.length === 0) {
    let promise = inFlight.get(cat)
    if (!promise) {
      promise = fetchCategory(valid).finally(() => inFlight.delete(cat))
      inFlight.set(cat, promise)
    }
    items = await promise
    // Warm the cache so the next user gets Redis instead of another live fetch
    setCached(cat, items).catch(() => {/* silently ignore Redis write failures */})
  }

  return NextResponse.json(
    { items, category: cat, meta, fetchedAt: new Date().toISOString() },
    { headers: { 'Content-Type': 'application/json' } }
  )
}