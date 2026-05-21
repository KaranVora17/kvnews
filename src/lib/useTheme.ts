'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

export type Theme = 'morning' | 'day' | 'evening'

const STORAGE_KEY = 'kvnews-theme'

function autoTheme(): Theme {
  const h = new Date().getHours()
  if (h >= 6 && h < 12) return 'morning'
  if (h >= 12 && h < 19) return 'day'
  return 'evening'
}

function applyTheme(t: Theme) {
  document.documentElement.setAttribute('data-theme', t)
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('morning')
  // Use a ref so the interval always reads the latest value without re-running
  const manualRef = useRef(false)

  // Effect 1: set initial theme on mount — restore persisted manual choice if present
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (saved && ['morning', 'day', 'evening'].includes(saved)) {
      manualRef.current = true
      setThemeState(saved)
      applyTheme(saved)
    } else {
      const t = autoTheme()
      setThemeState(t)
      applyTheme(t)
    }
  }, [])

  // Effect 2: auto-switch every minute — never overrides a manual pick
  useEffect(() => {
    const interval = setInterval(() => {
      if (!manualRef.current) {
        const next = autoTheme()
        setThemeState(next)
        applyTheme(next)
      }
    }, 60_000)
    return () => clearInterval(interval)
  }, []) // empty deps — interval is stable, reads manualRef directly

  const setTheme = useCallback((t: Theme) => {
    manualRef.current = true
    setThemeState(t)
    applyTheme(t)
    localStorage.setItem(STORAGE_KEY, t)
  }, [])

  return { theme, setTheme }
}