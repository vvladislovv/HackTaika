'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { orderSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type OrderFormData = z.infer<typeof orderSchema>

export function OrderForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
  })

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSubmitSuccess(true)
        reset()
        setTimeout(() => setSubmitSuccess(false), 5000)
      }
    } catch (error) {
      console.error('Error submitting order:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="order-form" className="py-32 bg-gradient-to-br from-orange/5 to-rust/5">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-dark-brown mb-4">
            Оставить заявку
          </h2>
          <p className="text-xl text-brown">
            Мы свяжемся с вами в ближайшее время
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
              Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Ваше имя"
              placeholder="Иван Иванов"
              error={errors.name?.message}
              autoComplete="name"
              {...register('name')}
            />

            <Input
              label="Email"
              type="email"
              placeholder="ivan@example.com"
              error={errors.email?.message}
              autoComplete="email"
              {...register('email')}
            />

            <Input
              label="Телефон"
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

            <Textarea
              label="Сообщение"
              placeholder="Расскажите о вашем проекте..."
              rows={5}
              error={errors.message?.message}
              {...register('message')}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

