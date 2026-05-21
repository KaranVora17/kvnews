'use client'
import { useState } from 'react'
import TabNav from './TabNav'
import NewsFeed from './NewsFeed'

export default function TabShell() {
  const [activeTab, setActiveTab] = useState('global')
  return (
    <>
      <TabNav active={activeTab} onChange={setActiveTab} />
      <main>
        <NewsFeed key={activeTab} category={activeTab} />
      </main>
    </>
  )
}
