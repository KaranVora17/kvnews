import { CATEGORIES } from './sources'
import { fetchCategory } from './fetcher'
import { setCached, setMeta } from './cache'

export type RefreshResult = {
  counts: Record<string, number>
  errors: { category: string; error: string }[]
  refreshedAt: string
}

export async function runRefresh(): Promise<RefreshResult> {
  const counts: Record<string, number> = {}
  const errors: { category: string; error: string }[] = []

  await Promise.all(
    CATEGORIES.map(async (cat) => {
      try {
        const items = await fetchCategory(cat)
        await setCached(cat.id, items)
        counts[cat.id] = items.length
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        console.error(`[refresh] category ${cat.id} failed: ${message}`)
        errors.push({ category: cat.id, error: message })
        counts[cat.id] = 0
      }
    })
  )

  const now = new Date()
  await setMeta({
    lastUpdated: now.toISOString(),
    nextUpdate: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
  })

  return { counts, errors, refreshedAt: now.toISOString() }
}