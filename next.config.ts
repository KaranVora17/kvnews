import type { NextConfig } from 'next'
import { FEED_IMAGE_DOMAINS } from './src/lib/sources'

// Generate remotePatterns from the single source-of-truth list in sources.ts.
// Each domain gets both a bare and a wildcard-subdomain pattern so that CDN
// sub-hosts (e.g. ichef.bbci.co.uk, i.ndtvimg.com) are all covered.
const remotePatterns = [
  ...FEED_IMAGE_DOMAINS.flatMap(hostname => [
    { protocol: 'https' as const, hostname },
    { protocol: 'https' as const, hostname: `**.${hostname}` },
  ]),
  // Unsplash is used for category fallback images in NewsCard — not a feed CDN
  { protocol: 'https' as const, hostname: 'images.unsplash.com' },
]

const nextConfig: NextConfig = {
  images: { remotePatterns },
}

export default nextConfig
