import { NextRequest, NextResponse } from 'next/server'
import { CATEGORIES } from '@/lib/sources'
import { getCached, getMeta, setCached } from '@/lib/cache'
import { fetchCategory, rehydrateAges } from '@/lib/fetcher'

export const dynamic = 'force-dynamic'

// In-memory lock — on a warm serverless instance, coalesces concurrent requests
// on cache miss into a single RSS fetch. Has no cross-instance effect on serverless.
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

  if (items && items.length > 0) {
    // Recompute ageMinutes and breaking from publishedAt so stale cached values stay accurate
    items = rehydrateAges(items)
  } else {
    let promise = inFlight.get(cat)
    if (!promise) {
      promise = fetchCategory(valid).finally(() => inFlight.delete(cat))
      inFlight.set(cat, promise)
    }
    items = await promise
    // Warm the cache so the next request gets Redis instead of another live fetch
    setCached(cat, items).catch(() => {/* silently ignore Redis write failures */})
  }

  return NextResponse.json(
    { items, category: cat, meta, fetchedAt: new Date().toISOString() },
    { headers: { 'Content-Type': 'application/json' } }
  )
}