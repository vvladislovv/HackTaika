'use client'

import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'

export function Hero() {
  const scrollToProducts = () => {
    const element = document.querySelector('#products')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-cream via-white to-orange/10">
      {/* Geometric Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-20 right-20 w-64 h-64 bg-orange/20 geometric-shape"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-20 left-20 w-48 h-48 bg-rust/20 geometric-shape"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          className="text-5xl md:text-7xl font-brand text-dark-brown mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Создаём
          </motion.div>
          <motion.div
            className="text-orange inline-block"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.7, 
              delay: 0.4,
              ease: "easeOut"
            }}
          >
            инновационные
          </motion.div>
          <motion.div
            className="block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            цифровые решения
          </motion.div>
        </motion.h1>
        
        {/* Добавляем анимированные частицы вокруг текста */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-orange rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0],
                x: [0, (i % 2 === 0 ? 50 : -50) * Math.random()],
                y: [0, -50 * Math.random()],
              }}
              transition={{
                duration: 2,
                delay: 0.8 + i * 0.1,
                repeat: Infinity,
                repeatDelay: 3,
              }}
              style={{
                left: `${50 + (i - 3) * 15}%`,
                top: '40%',
              }}
            />
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-brown mb-12 max-w-3xl mx-auto"
        >
          Разработка веб-приложений, дизайн и маркетинг для вашего бизнеса
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button size="lg" onClick={scrollToProducts}>
            Наши работы
          </Button>
          <Button size="lg" variant="outline" onClick={() => {
            const element = document.querySelector('#description')
            if (element) element.scrollIntoView({ behavior: 'smooth' })
          }}>
            Узнать больше
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

