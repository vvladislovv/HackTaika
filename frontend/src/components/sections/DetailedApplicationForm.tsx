'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { detailedApplicationSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type ApplicationFormData = z.infer<typeof detailedApplicationSchema>

const projectTypes = [
  'Интернет-магазин',
  'Корпоративный сайт',
  'Мобильное приложение',
  'Landing Page',
  'Веб-сервис',
  'Другое',
]

const budgets = [
  'До 50 000 ₽',
  '50 000 - 150 000 ₽',
  '150 000 - 300 000 ₽',
  '300 000 - 500 000 ₽',
  'Более 500 000 ₽',
]

const deadlines = [
  '1-2 недели',
  '2-4 недели',
  '1-2 месяца',
  '2-3 месяца',
  'Более 3 месяцев',
  'Не определено',
]

export function DetailedApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const totalSteps = 4

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    watch,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(detailedApplicationSchema),
    mode: 'onChange',
  })

  // Рассчитываем прогресс на основе завершенных шагов
  const progress = Math.max(0, ((currentStep - 1) / totalSteps) * 100)

  const nextStep = async () => {
    let fieldsToValidate: (keyof ApplicationFormData)[] = []

    if (currentStep === 1) {
      fieldsToValidate = ['fullName', 'email', 'phone', 'telegram']
    } else if (currentStep === 2) {
      fieldsToValidate = ['projectType', 'projectProblem', 'targetAudience']
    } else if (currentStep === 3) {
      fieldsToValidate = ['budget', 'deadline']
    }

    const isValid = await trigger(fieldsToValidate)
    if (isValid && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSubmitSuccess(true)
        reset()
        setCurrentStep(1)
        setTimeout(() => setSubmitSuccess(false), 10000)
      }
    } catch (error) {
      console.error('Error submitting application:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="detailed-application"
      className="py-32 bg-gradient-to-br from-orange/5 to-rust/5"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-dark-brown mb-4">
            Подробная заявка
          </h2>
          <p className="text-xl text-brown">
            Расскажите нам о вашем проекте детальнее
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-dark-brown">
                Шаг {currentStep} из {totalSteps}
              </span>
              <span className="text-sm font-medium text-orange">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray/20 rounded-full h-2.5">
              <motion.div
                className="bg-orange h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mb-6 p-6 bg-gradient-to-r from-green-50 to-orange/10 border-2 border-green-500 rounded-xl"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">🎉</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-green-800 mb-2">
                    Спасибо! Заявка успешно отправлена!
                  </h3>
                  <p className="text-green-700 mb-3">
                    Мы получили вашу заявку и свяжемся с вами в ближайшее время. 
                    Обычно это занимает от 30 минут до 2 часов в рабочее время.
                  </p>
                  <div className="bg-orange/20 border-l-4 border-orange p-4 rounded">
                    <p className="text-dark-brown font-medium">
                      🎁 <strong>Специальное предложение!</strong>
                    </p>
                    <p className="text-brown text-sm mt-1">
                      Напишите в вашей следующей заявке слово <span className="font-bold text-orange">"ЗАКАЗ"</span> 
                      {' '}и получите <span className="font-bold">скидку 10%</span> или бонусный подарок!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {/* Шаг 1: Контактная информация */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-dark-brown mb-4">
                    Контактная информация
                  </h3>

                  <Input
                    label="Полное имя *"
                    placeholder="Иван Иванов"
                    error={errors.fullName?.message}
                    autoComplete="name"
                    {...register('fullName')}
                  />

                  <Input
                    label="Email *"
                    type="email"
                    placeholder="ivan@example.com"
                    error={errors.email?.message}
                    autoComplete="email"
                    {...register('email')}
                  />

                  <Input
                    label="Телефон *"
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    error={errors.phone?.message}
                    autoComplete="tel"
                    {...register('phone')}
                  />

                  <Input
                    label="Telegram (опционально)"
                    type="text"
                    placeholder="@username"
                    error={errors.telegram?.message}
                    {...register('telegram')}
                  />
                </motion.div>
              )}

              {/* Шаг 2: О проекте и целях */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-dark-brown mb-4">
                    О проекте и целях
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-dark-brown mb-2">
                      Тип проекта *
                    </label>
                    <select
                      {...register('projectType')}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray/30 transition-smooth bg-white text-dark-brown focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                    >
                      <option value="">Выберите тип проекта</option>
                      {projectTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.projectType && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.projectType.message}
                      </p>
                    )}
                  </div>

                  <Textarea
                    label="Какую проблему решает ваш проект? *"
                    placeholder="Например: Клиенты не могут быстро оформить заказ на нашем сайте..."
                    rows={4}
                    error={errors.projectProblem?.message}
                    {...register('projectProblem')}
                  />

                  <Input
                    label="Кто ваша целевая аудитория? *"
                    placeholder="Например: Молодые родители 25-35 лет"
                    error={errors.targetAudience?.message}
                    {...register('targetAudience')}
                  />
                </motion.div>
              )}

              {/* Шаг 3: Требования и ожидания */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-dark-brown mb-4">
                    Требования и ожидания
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-dark-brown mb-2">
                      Бюджет *
                    </label>
                    <select
                      {...register('budget')}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray/30 transition-smooth bg-white text-dark-brown focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                    >
                      <option value="">Выберите бюджет</option>
                      {budgets.map((budget) => (
                        <option key={budget} value={budget}>
                          {budget}
                        </option>
                      ))}
                    </select>
                    {errors.budget && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.budget.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-brown mb-2">
                      Сроки *
                    </label>
                    <select
                      {...register('deadline')}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray/30 transition-smooth bg-white text-dark-brown focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                    >
                      <option value="">Выберите сроки</option>
                      {deadlines.map((deadline) => (
                        <option key={deadline} value={deadline}>
                          {deadline}
                        </option>
                      ))}
                    </select>
                    {errors.deadline && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.deadline.message}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Шаг 4: Детали проекта */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-dark-brown mb-4">
                    Детали проекта
                  </h3>

                  <Textarea
                    label="Опишите ваш проект подробно *"
                    placeholder="Расскажите о функционале, особенностях, что именно вы хотите получить..."
                    rows={6}
                    error={errors.description?.message}
                    {...register('description')}
                  />

                  <Textarea
                    label="Дополнительная информация (референсы, особые пожелания)"
                    placeholder="Есть ли примеры сайтов, которые вам нравятся? Какие-то особые требования к дизайну или функционалу?"
                    rows={4}
                    {...register('additionalInfo')}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  size="lg"
                >
                  ← Назад
                </Button>
              ) : (
                <div />
              )}

              {currentStep < totalSteps ? (
                <Button type="button" onClick={nextStep} size="lg">
                  Далее →
                </Button>
              ) : (
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                </Button>
              )}
            </div>
          </form>

          {/* Step Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-2 w-2 rounded-full transition-smooth ${
                  step === currentStep
                    ? 'bg-orange w-8'
                    : step < currentStep
                    ? 'bg-orange/50'
                    : 'bg-gray/30'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

