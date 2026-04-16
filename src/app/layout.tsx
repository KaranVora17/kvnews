import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'NEWS. — Your Current Briefing',
  description: 'Clean, fast, hourly-updated news across Global, India, Business, Technology, Sports, Football and Cricket.',
  openGraph: {
    title: 'NEWS.',
    description: 'Your current briefing — updated every hour.',
    siteName: 'NEWS.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
