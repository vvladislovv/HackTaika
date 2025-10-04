'use client'

import { useEffect, useRef, useState } from 'react'

export function useScrollAnimation(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold])

  return { ref, isVisible }
}

export function useAppleTextReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [revealProgress, setRevealProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementHeight = rect.height

      // Улучшенная логика для лучшей читаемости
      const elementTop = rect.top
      const elementBottom = rect.bottom
      
      // Начинаем анимацию когда элемент появляется внизу экрана
      // и продолжаем пока он не достигнет верха
      if (elementBottom < 0 || elementTop > windowHeight) {
        setRevealProgress(elementTop > windowHeight ? 0 : 1)
      } else {
        // Элемент в видимой области
        const visibleHeight = Math.min(elementBottom, windowHeight) - Math.max(elementTop, 0)
        const progress = visibleHeight / elementHeight
        
        // Добавляем смещение для лучшей читаемости при скролле вниз
        const adjustedProgress = Math.min(1, progress * 1.2)
        setRevealProgress(adjustedProgress)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { ref, revealProgress }
}

