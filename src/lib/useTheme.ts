'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

export type Theme = 'morning' | 'day' | 'evening'

function autoTheme(): Theme {
  const h = new Date().getHours()
  if (h >= 6 && h < 12) return 'morning'
  if (h >= 12 && h < 19) return 'day'
  return 'evening'
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('morning')
  // Use a ref so the interval always reads the latest value without re-running
  const manualRef = useRef(false)

  // Effect 1: set initial theme on mount only
  useEffect(() => {
    const t = autoTheme()
    setThemeState(t)
    document.documentElement.setAttribute('data-theme', t)
  }, [])

  // Effect 2: auto-switch every minute — never overrides a manual pick
  useEffect(() => {
    const interval = setInterval(() => {
      if (!manualRef.current) {
        const next = autoTheme()
        setThemeState(next)
        document.documentElement.setAttribute('data-theme', next)
      }
    }, 60_000)
    return () => clearInterval(interval)
  }, []) // empty deps — interval is stable, reads manualRef directly

  const setTheme = useCallback((t: Theme) => {
    manualRef.current = true
    setThemeState(t)
    document.documentElement.setAttribute('data-theme', t)
  }, [])

  return { theme, setTheme }
}