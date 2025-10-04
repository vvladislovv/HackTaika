'use client'

import { useAppleTextReveal } from '@/hooks/useScrollAnimation'
import { motion } from 'framer-motion'

const text = `Мы команда профессионалов с многолетним опытом в разработке веб-приложений 
и мобильных решений. Наша миссия — создавать продукты, которые решают реальные 
задачи бизнеса и приносят ценность пользователям. Мы используем современные 
технологии и лучшие практики разработки для создания масштабируемых и надёжных решений.`

export function Description() {
  const { ref, revealProgress } = useAppleTextReveal()

  const words = text.split(' ')

  return (
    <section id="description" className="py-32 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-3xl md:text-5xl leading-relaxed font-medium">
          {words.map((word, index) => {
            // Более плавная анимация как у Apple
            const startReveal = index / words.length
            const endReveal = (index + 1) / words.length
            
            // Рассчитываем прогресс для каждого слова
            const wordProgress = Math.max(0, Math.min(1, 
              (revealProgress - startReveal) / (endReveal - startReveal)
            ))
            
            // Плавный переход от серого к черному
            const grayValue = Math.round(156 - (156 - 23) * wordProgress)
            
            return (
              <span
                key={index}
                style={{
                  color: `rgb(${grayValue}, ${grayValue}, ${grayValue})`,
                  transition: 'color 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: 0.4 + 0.6 * wordProgress,
                }}
                className="inline-block mr-3"
              >
                {word}
              </span>
            )
          })}
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Опыт',
              description: 'Более 5 лет в индустрии',
              icon: '🎯',
            },
            {
              title: 'Проекты',
              description: '100+ успешных запусков',
              icon: '🚀',
            },
            {
              title: 'Клиенты',
              description: 'Довольные заказчики',
              icon: '⭐',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-8 rounded-2xl bg-cream hover:bg-orange/10 transition-all duration-300 hover:shadow-xl"
              >
                <motion.div 
                  className="text-5xl mb-4"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.3, type: 'spring', stiffness: 200 }}
                >
                  {item.icon}
                </motion.div>
                <motion.h3 
                  className="text-2xl font-bold text-dark-brown mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.5 }}
                >
                  {item.title}
                </motion.h3>
                <motion.p 
                  className="text-brown"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.6 }}
                >
                  {item.description}
                </motion.p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

