'use client'
import { useState, useEffect, useCallback } from 'react'

export type Theme = 'morning' | 'day' | 'evening'

function autoTheme(): Theme {
  const h = new Date().getHours()
  if (h >= 6 && h < 12) return 'morning'
  if (h >= 12 && h < 19) return 'day'
  return 'evening'
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('morning')
  const [manual, setManual] = useState(false)

  useEffect(() => {
    // Set initial theme
    const t = autoTheme()
    setThemeState(t)
    document.documentElement.setAttribute('data-theme', t)

    // Auto-switch every minute if not manually overridden
    const interval = setInterval(() => {
      if (!manual) {
        const next = autoTheme()
        setThemeState(next)
        document.documentElement.setAttribute('data-theme', next)
      }
    }, 60_000)

    return () => clearInterval(interval)
  }, [manual])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    setManual(true)
    document.documentElement.setAttribute('data-theme', t)
  }, [])

  return { theme, setTheme }
}
