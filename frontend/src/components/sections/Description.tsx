'use client'

import { useAppleTextReveal } from '@/hooks/useScrollAnimation'

const text = `Мы специализируемся на разработке современных веб-приложений, мобильных решений и цифровых продуктов. Наша команда создает инновационные решения, которые помогают бизнесу расти и развиваться в цифровой среде.`

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

      </div>
    </section>
  )
}

