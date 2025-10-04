'use client'

import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-white to-orange/10 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-20 right-20 w-64 h-64 bg-orange/10 geometric-shape"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center max-w-md"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 bg-orange geometric-shape" />
            <div className="absolute inset-4 bg-rust geometric-shape rotate-45" />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-dark-brown mb-4">Упс!</h1>
        <h2 className="text-2xl font-bold text-brown mb-4">Что-то пошло не так</h2>
        <p className="text-brown mb-8">
          Произошла непредвиденная ошибка. Мы уже работаем над её исправлением.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => reset()}>Попробовать снова</Button>
          <Button variant="outline" onClick={() => (window.location.href = '/')}>
            На главную
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

