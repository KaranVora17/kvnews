'use client'
import { useState } from 'react'
import Header from '@/components/Header'
import TabNav from '@/components/TabNav'
import NewsFeed from '@/components/NewsFeed'

export default function Home() {
  const [activeTab, setActiveTab] = useState('global')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', transition: 'background 0.4s' }}>
      <Header />
      <TabNav active={activeTab} onChange={setActiveTab} />
      <main>
        <NewsFeed key={activeTab} category={activeTab} />
      </main>

      {/* Mobile hero layout fix */}
      <style>{`
        @media (max-width: 600px) {
          /* Stack hero image on top */
          .hero-card-inner {
            flex-direction: column !important;
          }
          .hero-card-inner > div:first-child {
            width: 100% !important;
            min-width: unset !important;
            height: 180px !important;
          }
          /* Single column grid on very small screens */
          .news-grid {
            grid-template-columns: 1fr !important;
          }
          /* Tighter padding on mobile */
          header, nav, main > div {
            padding-left: 14px !important;
            padding-right: 14px !important;
          }
        }
      `}</style>
    </div>
  )
}
