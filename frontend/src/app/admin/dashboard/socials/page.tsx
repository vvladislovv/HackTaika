'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Loading } from '@/components/ui/Loading'
import { socialSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type SocialFormData = z.infer<typeof socialSchema>

interface Social extends SocialFormData {
  id: string
}

export default function AdminSocialsPage() {
  const [socials, setSocials] = useState<Social[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSocial, setEditingSocial] = useState<Social | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<SocialFormData>({
    resolver: zodResolver(socialSchema),
  })

  useEffect(() => {
    fetchSocials()
  }, [])

  useEffect(() => {
    if (editingSocial) {
      setValue('name', editingSocial.name)
      setValue('url', editingSocial.url)
      setValue('icon', editingSocial.icon)
      setValue('order', editingSocial.order)
      setIsFormOpen(true)
    }
  }, [editingSocial, setValue])

  const fetchSocials = async () => {
    try {
      const response = await fetch('/api/admin/socials')
      if (response.ok) {
        const data = await response.json()
        setSocials(data)
      }
    } catch (error) {
      console.error('Error fetching socials:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: SocialFormData) => {
    const url = editingSocial
      ? `/api/admin/socials/${editingSocial.id}`
      : '/api/admin/socials'
    const method = editingSocial ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        fetchSocials()
        reset()
        setEditingSocial(null)
        setIsFormOpen(false)
      }
    } catch (error) {
      console.error('Error saving social:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить соц. сеть?')) return

    try {
      const response = await fetch(`/api/admin/socials/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchSocials()
      }
    } catch (error) {
      console.error('Error deleting social:', error)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-dark-brown">Управление соцсетями</h1>
        <Button
          onClick={() => {
            setEditingSocial(null)
            reset()
            setIsFormOpen(!isFormOpen)
          }}
        >
          {isFormOpen ? 'Закрыть' : 'Добавить соц. сеть'}
        </Button>
      </div>

      {isFormOpen && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-dark-brown mb-4">
            {editingSocial ? 'Редактировать соц. сеть' : 'Новая соц. сеть'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Название"
              placeholder="Telegram"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="URL"
              placeholder="https://t.me/username"
              error={errors.url?.message}
              {...register('url')}
            />
            <Input
              label="Иконка (telegram, vk, youtube)"
              placeholder="telegram"
              error={errors.icon?.message}
              {...register('icon')}
            />
            <Input
              label="Порядок сортировки"
              type="number"
              error={errors.order?.message}
              {...register('order', { valueAsNumber: true })}
            />

            <div className="flex gap-4">
              <Button type="submit">{editingSocial ? 'Обновить' : 'Создать'}</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingSocial(null)
                  reset()
                  setIsFormOpen(false)
                }}
              >
                Отмена
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {socials.map((social) => (
          <Card key={social.id} className="p-4">
            <h3 className="text-xl font-bold text-dark-brown mb-2">{social.name}</h3>
            <p className="text-brown text-sm mb-2 break-all">{social.url}</p>
            <p className="text-orange text-sm mb-4">Иконка: {social.icon}</p>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setEditingSocial(social)}>
                Редактировать
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(social.id)}
              >
                Удалить
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

