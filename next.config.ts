import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // BBC
      { protocol: 'https', hostname: 'ichef.bbci.co.uk' },
      { protocol: 'https', hostname: '**.bbci.co.uk' },
      // NDTV
      { protocol: 'https', hostname: 'ndtvimg.com' },
      { protocol: 'https', hostname: '**.ndtvimg.com' },
      // The Hindu
      { protocol: 'https', hostname: 'thgim.com' },
      { protocol: 'https', hostname: '**.thgim.com' },
      { protocol: 'https', hostname: '**.thehindu.com' },
      // Indian Express
      { protocol: 'https', hostname: 'imgci.com' },
      { protocol: 'https', hostname: '**.indianexpress.com' },
      // ESPN / Cricinfo
      { protocol: 'https', hostname: 'espncdn.com' },
      { protocol: 'https', hostname: '**.espncdn.com' },
      { protocol: 'https', hostname: '**.espncricinfo.com' },
      // Sky Sports
      { protocol: 'https', hostname: '**.skysports.com' },
      // Times of India
      { protocol: 'https', hostname: 'toiimg.com' },
      { protocol: 'https', hostname: '**.toiimg.com' },
      // TechCrunch / Ars Technica
      { protocol: 'https', hostname: '**.techcrunch.com' },
      { protocol: 'https', hostname: 'arstechnica.net' },
      { protocol: 'https', hostname: '**.arstechnica.net' },
      // Al Jazeera
      { protocol: 'https', hostname: '**.aljazeera.com' },
      // Reuters
      { protocol: 'https', hostname: '**.reuters.com' },
      // Livemint
      { protocol: 'https', hostname: '**.livemint.com' },
      // Goal.com
      { protocol: 'https', hostname: '**.goal.com' },
      // The Verge / Wired / Guardian
      { protocol: 'https', hostname: '**.theverge.com' },
      { protocol: 'https', hostname: '**.wired.com' },
      { protocol: 'https', hostname: '**.theguardian.com' },
      // Unsplash (category fallback images)
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
}

export default nextConfig
