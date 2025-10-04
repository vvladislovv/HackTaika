'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Loading } from '@/components/ui/Loading'
import { Textarea } from '@/components/ui/Textarea'
import { portfolioSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type PortfolioFormData = z.infer<typeof portfolioSchema>

interface PortfolioItem extends PortfolioFormData {
  id: string
}

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
  })

  useEffect(() => {
    fetchPortfolio()
  }, [])

  useEffect(() => {
    if (editingItem) {
      setValue('title', editingItem.title)
      setValue('description', editingItem.description)
      setValue('images', editingItem.images)
      setValue('videos', editingItem.videos || [])
      setValue('siteUrl', editingItem.siteUrl || '')
      setValue('clientName', editingItem.clientName)
      setValue('clientReview', editingItem.clientReview)
      setValue('category', editingItem.category)
      setValue('featured', editingItem.featured)
      setValue('order', editingItem.order)
      setIsFormOpen(true)
    }
  }, [editingItem, setValue])

  const fetchPortfolio = async () => {
    try {
      const response = await fetch('/api/portfolio')
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: PortfolioFormData) => {
    const url = editingItem
      ? `/api/admin/portfolio/${editingItem.id}`
      : '/api/admin/portfolio'
    const method = editingItem ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        fetchPortfolio()
        reset()
        setEditingItem(null)
        setIsFormOpen(false)
      }
    } catch (error) {
      console.error('Error saving portfolio item:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить проект?')) return

    try {
      const response = await fetch(`/api/admin/portfolio/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchPortfolio()
      }
    } catch (error) {
      console.error('Error deleting portfolio item:', error)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-dark-brown">Управление портфолио</h1>
        <Button
          onClick={() => {
            setEditingItem(null)
            reset()
            setIsFormOpen(!isFormOpen)
          }}
        >
          {isFormOpen ? 'Закрыть' : 'Добавить проект'}
        </Button>
      </div>

      {isFormOpen && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-dark-brown mb-4">
            {editingItem ? 'Редактировать проект' : 'Новый проект'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Название"
              error={errors.title?.message}
              {...register('title')}
            />
            <Textarea
              label="Описание"
              rows={4}
              error={errors.description?.message}
              {...register('description')}
            />
            <Input
              label="URL изображений (через запятую)"
              error={errors.images?.message}
              {...register('images', {
                setValueAs: (v) =>
                  v.split(',').map((url: string) => url.trim()).filter(Boolean),
              })}
            />
            <Input
              label="URL видео (через запятую, необязательно)"
              {...register('videos', {
                setValueAs: (v) =>
                  v ? v.split(',').map((url: string) => url.trim()).filter(Boolean) : [],
              })}
            />
            <Input
              label="Ссылка на сайт (необязательно)"
              error={errors.siteUrl?.message}
              {...register('siteUrl')}
            />
            <Input
              label="Имя клиента"
              error={errors.clientName?.message}
              autoComplete="name"
              {...register('clientName')}
            />
            <Textarea
              label="Отзыв клиента"
              rows={3}
              error={errors.clientReview?.message}
              {...register('clientReview')}
            />
            <Input
              label="Категория"
              error={errors.category?.message}
              {...register('category')}
            />
            <Input
              label="Порядок сортировки"
              type="number"
              error={errors.order?.message}
              {...register('order', { valueAsNumber: true })}
            />
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...register('featured')} />
              <span className="text-dark-brown">Избранное</span>
            </label>

            <div className="flex gap-4">
              <Button type="submit">{editingItem ? 'Обновить' : 'Создать'}</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingItem(null)
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="p-4">
            <h3 className="text-xl font-bold text-dark-brown mb-2">{item.title}</h3>
            <p className="text-brown text-sm mb-2 line-clamp-2">{item.description}</p>
            <p className="text-orange text-sm mb-4">{item.category}</p>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setEditingItem(item)}>
                Редактировать
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(item.id)}
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

