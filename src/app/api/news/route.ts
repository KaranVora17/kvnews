import { NextRequest, NextResponse } from 'next/server'
import { CATEGORIES } from '@/lib/sources'
import { getCached, getMeta } from '@/lib/cache'
import { fetchCategory } from '@/lib/fetcher'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const cat = searchParams.get('cat') || 'global'

  const valid = CATEGORIES.find(c => c.id === cat)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  }

  // Try cache first
  let items = await getCached(cat)
  const meta = await getMeta()

  // Cache miss — fetch live (first load or KV not set up yet)
  if (!items || items.length === 0) {
    items = await fetchCategory(valid)
  }

  return NextResponse.json({
    items,
    category: cat,
    meta,
    fetchedAt: new Date().toISOString(),
  })
}
