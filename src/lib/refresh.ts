import { CATEGORIES } from './sources'
import { fetchCategory } from './fetcher'
import { setCached, setMeta } from './cache'

export async function runRefresh(): Promise<{ counts: Record<string, number>; refreshedAt: string }> {
  const results: Record<string, number> = {}

  await Promise.all(
    CATEGORIES.map(async (cat) => {
      const items = await fetchCategory(cat)
      await setCached(cat.id, items)
      results[cat.id] = items.length
    })
  )

  const now = new Date()
  await setMeta({
    lastUpdated: now.toISOString(),
    nextUpdate: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
  })

  return { counts: results, refreshedAt: now.toISOString() }
}