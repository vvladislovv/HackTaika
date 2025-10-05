'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loading } from '@/components/ui/Loading'
import { useEffect, useState } from 'react'

interface Application {
  id: string
  fullName: string
  email: string
  phone: string
  projectType: string
  projectProblem: string
  targetAudience: string
  budget: string
  deadline: string
  description: string
  additionalInfo?: string
  status: string
  createdAt: string
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/admin/applications')
      if (response.ok) {
        const data = await response.json()
        setApplications(data)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить заявку?')) return

    try {
      const response = await fetch(`/api/admin/applications/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchApplications()
      }
    } catch (error) {
      console.error('Error deleting application:', error)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchApplications()
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-dark-brown">
          Подробные заявки
        </h1>
        <span className="text-brown">
          Всего заявок: {applications.length}
        </span>
      </div>

      <div className="space-y-4">
        {applications.map((app) => (
          <Card key={app.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-dark-brown mb-1">
                  {app.fullName}
                </h3>
                <p className="text-sm text-brown">
                  {new Date(app.createdAt).toLocaleString('ru-RU')}
                </p>
              </div>
              <select
                value={app.status}
                onChange={(e) => handleStatusChange(app.id, e.target.value)}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  app.status === 'new'
                    ? 'bg-blue-100 text-blue-800'
                    : app.status === 'processing'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                <option value="new">Новая</option>
                <option value="processing">В работе</option>
                <option value="completed">Завершена</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-brown">Email:</p>
                <p className="font-medium text-dark-brown">{app.email}</p>
              </div>
              <div>
                <p className="text-sm text-brown">Телефон:</p>
                <p className="font-medium text-dark-brown">{app.phone}</p>
              </div>
              <div>
                <p className="text-sm text-brown">Тип проекта:</p>
                <p className="font-medium text-dark-brown">{app.projectType}</p>
              </div>
              <div>
                <p className="text-sm text-brown">Целевая аудитория:</p>
                <p className="font-medium text-dark-brown">{app.targetAudience}</p>
              </div>
              <div>
                <p className="text-sm text-brown">Бюджет:</p>
                <p className="font-medium text-orange">{app.budget}</p>
              </div>
              <div>
                <p className="text-sm text-brown">Сроки:</p>
                <p className="font-medium text-dark-brown">{app.deadline}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-brown mb-1">Проблема, которую решает:</p>
              <p className="text-dark-brown">{app.projectProblem}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-brown mb-1">Описание проекта:</p>
              <p className="text-dark-brown">{app.description}</p>
            </div>

            {app.additionalInfo && (
              <div className="mb-4">
                <p className="text-sm text-brown mb-1">
                  Дополнительная информация:
                </p>
                <p className="text-dark-brown">{app.additionalInfo}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(app.id)}
              >
                Удалить
              </Button>
            </div>
          </Card>
        ))}

        {applications.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-brown">Пока нет заявок</p>
          </div>
        )}
      </div>
    </div>
  )
}

