import type { Metadata, Viewport } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'NEWS. — Your Current Briefing',
  description: 'Clean, fast, hourly-updated news across Global, India, Business, Technology, Sports, Football and Cricket.',
  openGraph: {
    title: 'NEWS.',
    description: 'Your current briefing — updated every hour.',
    siteName: 'NEWS.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'NEWS.',
    description: 'Your current briefing — updated every hour.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF7F4' },
    { media: '(prefers-color-scheme: dark)',  color: '#1C2333' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
