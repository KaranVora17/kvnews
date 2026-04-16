import { Redis } from '@upstash/redis'
import { NewsItem } from './fetcher'

const KEY = (cat: string) => `news:${cat}`
const META_KEY = 'news:meta'

let redis: Redis | null | undefined

function getRedis(): Redis | null {
  if (redis !== undefined) return redis
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    redis = null
    return null
  }
  redis = new Redis({ url, token })
  return redis
}

export type CacheMeta = {
  lastUpdated: string
  nextUpdate: string
}

export async function getCached(category: string): Promise<NewsItem[] | null> {
  const client = getRedis()
  if (!client) return null
  try {
    return await client.get<NewsItem[]>(KEY(category))
  } catch {
    return null
  }
}

export async function setCached(category: string, items: NewsItem[]): Promise<void> {
  const client = getRedis()
  if (!client) return
  try {
    // TTL 90 minutes — safety net if cron skips a run
    await client.set(KEY(category), items, { ex: 5400 })
  } catch {
    // Silently fail — frontend falls back to live fetch
  }
}

export async function getMeta(): Promise<CacheMeta | null> {
  const client = getRedis()
  if (!client) return null
  try {
    return await client.get<CacheMeta>(META_KEY)
  } catch {
    return null
  }
}

export async function setMeta(meta: CacheMeta): Promise<void> {
  const client = getRedis()
  if (!client) return
  try {
    await client.set(META_KEY, meta, { ex: 7200 })
  } catch {}
}
