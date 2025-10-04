'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Loading } from '@/components/ui/Loading'
import { Textarea } from '@/components/ui/Textarea'
import { workSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type WorkFormData = z.infer<typeof workSchema>

interface Work extends WorkFormData {
  id: string
}

export default function AdminWorksPage() {
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [editingWork, setEditingWork] = useState<Work | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<WorkFormData>({
    resolver: zodResolver(workSchema),
  })

  useEffect(() => {
    fetchWorks()
  }, [])

  useEffect(() => {
    if (editingWork) {
      setValue('title', editingWork.title)
      setValue('description', editingWork.description)
      setValue('price', editingWork.price)
      setValue('images', editingWork.images)
      setValue('videos', editingWork.videos || [])
      setValue('siteUrl', editingWork.siteUrl || '')
      setValue('clientName', editingWork.clientName)
      setValue('clientReview', editingWork.clientReview)
      setValue('category', editingWork.category)
      setValue('featured', editingWork.featured)
      setIsFormOpen(true)
    }
  }, [editingWork, setValue])

  const fetchWorks = async () => {
    try {
      const response = await fetch('/api/admin/works')
      if (response.ok) {
        const data = await response.json()
        setWorks(data)
      }
    } catch (error) {
      console.error('Error fetching works:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: WorkFormData) => {
    const url = editingWork
      ? `/api/admin/works/${editingWork.id}`
      : '/api/admin/works'
    const method = editingWork ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        fetchWorks()
        reset()
        setEditingWork(null)
        setIsFormOpen(false)
      }
    } catch (error) {
      console.error('Error saving work:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить работу?')) return

    try {
      const response = await fetch(`/api/admin/works/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchWorks()
      }
    } catch (error) {
      console.error('Error deleting work:', error)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-dark-brown">Управление работами</h1>
        <Button
          onClick={() => {
            setEditingWork(null)
            reset()
            setIsFormOpen(!isFormOpen)
          }}
        >
          {isFormOpen ? 'Закрыть' : 'Добавить работу'}
        </Button>
      </div>

      {isFormOpen && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-dark-brown mb-4">
            {editingWork ? 'Редактировать работу' : 'Новая работа'}
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
              label="Цена"
              error={errors.price?.message}
              {...register('price')}
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
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...register('featured')} />
              <span className="text-dark-brown">Избранное</span>
            </label>

            <div className="flex gap-4">
              <Button type="submit">{editingWork ? 'Обновить' : 'Создать'}</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingWork(null)
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
        {works.map((work) => (
          <Card key={work.id} className="p-4">
            <h3 className="text-xl font-bold text-dark-brown mb-2">{work.title}</h3>
            <p className="text-brown text-sm mb-2 line-clamp-2">{work.description}</p>
            <p className="text-orange font-bold mb-4">{work.price}</p>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setEditingWork(work)}>
                Редактировать
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(work.id)}
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

