'use client'
import { useState, useEffect } from 'react'

function pad(n: number) { return String(n).padStart(2, '0') }

function greeting(h: number): string {
  if (h >= 5  && h < 12) return 'Good morning.'
  if (h >= 12 && h < 17) return 'Good afternoon.'
  if (h >= 17 && h < 21) return 'Good evening.'
  return 'Good night.'
}

function formatDate(d: Date): string {
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const months = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December']
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

export function useClock() {
  const [time, setTime] = useState('')
  const [greet, setGreet] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    function tick() {
      const now = new Date()
      const h = now.getHours()
      setTime(`${pad(h)}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`)
      setGreet(greeting(h))
      setDate(formatDate(now))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return { time, greet, date }
}
