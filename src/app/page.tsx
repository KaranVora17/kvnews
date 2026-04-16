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

      <style>{`
        @media (max-width: 600px) {
          header, nav, main > div {
            padding-left: 14px !important;
            padding-right: 14px !important;
          }
        }
      `}</style>
    </div>
  )
}
