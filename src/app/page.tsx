import Header from '@/components/Header'
import TabShell from '@/components/TabShell'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', transition: 'background 0.4s' }}>
      <Header />
      <TabShell />
    </div>
  )
}
