import { NextRequest, NextResponse } from 'next/server'
import { CATEGORIES } from '@/lib/sources'
import { fetchCategory } from '@/lib/fetcher'
import { setCached, setMeta } from '@/lib/cache'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Cron not configured' }, { status: 503 })
  }

  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: Record<string, number> = {}

  // Fetch all categories in parallel
  await Promise.all(
    CATEGORIES.map(async (cat) => {
      const items = await fetchCategory(cat)
      await setCached(cat.id, items)
      results[cat.id] = items.length
    })
  )

  const now = new Date()
  const next = new Date(now.getTime() + 60 * 60 * 1000)

  await setMeta({
    lastUpdated: now.toISOString(),
    nextUpdate: next.toISOString(),
  })

  return NextResponse.json({
    success: true,
    updatedAt: now.toISOString(),
    counts: results,
  })
}
