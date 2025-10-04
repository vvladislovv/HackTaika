'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Loading } from '@/components/ui/Loading'
import { adminSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type AdminFormData = z.infer<typeof adminSchema>

interface Admin {
  id: string
  email: string
  name: string
  createdAt: string
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
  })

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/admin/admins')
      if (response.ok) {
        const data = await response.json()
        setAdmins(data)
      }
    } catch (error) {
      console.error('Error fetching admins:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: AdminFormData) => {
    try {
      const response = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        fetchAdmins()
        reset()
        setIsFormOpen(false)
      }
    } catch (error) {
      console.error('Error creating admin:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить администратора?')) return

    try {
      const response = await fetch(`/api/admin/admins/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchAdmins()
      }
    } catch (error) {
      console.error('Error deleting admin:', error)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-dark-brown">Управление админами</h1>
        <Button
          onClick={() => {
            reset()
            setIsFormOpen(!isFormOpen)
          }}
        >
          {isFormOpen ? 'Закрыть' : 'Добавить админа'}
        </Button>
      </div>

      {isFormOpen && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-dark-brown mb-4">Новый администратор</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Имя"
              error={errors.name?.message}
              autoComplete="name"
              {...register('name')}
            />
            <Input
              label="Email"
              type="email"
              error={errors.email?.message}
              autoComplete="email"
              {...register('email')}
            />
            <Input
              label="Пароль"
              type="password"
              error={errors.password?.message}
              autoComplete="new-password"
              {...register('password')}
            />

            <div className="flex gap-4">
              <Button type="submit">Создать</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
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
        {admins.map((admin) => (
          <Card key={admin.id} className="p-4">
            <h3 className="text-xl font-bold text-dark-brown mb-2">{admin.name}</h3>
            <p className="text-brown text-sm mb-2">{admin.email}</p>
            <p className="text-gray text-xs mb-4">
              Создан: {new Date(admin.createdAt).toLocaleDateString('ru-RU')}
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDelete(admin.id)}
            >
              Удалить
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}

