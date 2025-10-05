'use client'

import { useEffect } from 'react'

export function PrefetchData() {
  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    // Warm critical API endpoints in parallel
    Promise.allSettled([
      fetch('/api/blog', { signal, cache: 'force-cache' }),
      fetch('/api/portfolio', { signal, cache: 'force-cache' }),
      fetch('/api/works', { signal, cache: 'force-cache' }),
    ])
    // ignore results; goal is to warm caches

    return () => controller.abort()
  }, [])

  return null
}


