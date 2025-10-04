'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Loading } from '@/components/ui/Loading'
import { Textarea } from '@/components/ui/Textarea'
import { blogSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type BlogFormData = z.infer<typeof blogSchema>

interface BlogPost extends BlogFormData {
  id: string
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    if (editingPost) {
      setValue('title', editingPost.title)
      setValue('content', editingPost.content)
      setValue('excerpt', editingPost.excerpt)
      setValue('image', editingPost.image || '')
      setValue('published', editingPost.published)
      setIsFormOpen(true)
    }
  }, [editingPost, setValue])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/blog')
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: BlogFormData) => {
    const url = editingPost
      ? `/api/admin/blog/${editingPost.id}`
      : '/api/admin/blog'
    const method = editingPost ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        fetchPosts()
        reset()
        setEditingPost(null)
        setIsFormOpen(false)
      }
    } catch (error) {
      console.error('Error saving post:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить статью?')) return

    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-dark-brown">Управление блогом</h1>
        <Button
          onClick={() => {
            setEditingPost(null)
            reset()
            setIsFormOpen(!isFormOpen)
          }}
        >
          {isFormOpen ? 'Закрыть' : 'Добавить статью'}
        </Button>
      </div>

      {isFormOpen && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-dark-brown mb-4">
            {editingPost ? 'Редактировать статью' : 'Новая статья'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Заголовок"
              error={errors.title?.message}
              {...register('title')}
            />
            <Textarea
              label="Краткое описание"
              rows={2}
              error={errors.excerpt?.message}
              {...register('excerpt')}
            />
            <Textarea
              label="Содержание"
              rows={8}
              error={errors.content?.message}
              {...register('content')}
            />
            <Input
              label="URL изображения (необязательно)"
              error={errors.image?.message}
              {...register('image')}
            />
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...register('published')} />
              <span className="text-dark-brown">Опубликовано</span>
            </label>

            <div className="flex gap-4">
              <Button type="submit">{editingPost ? 'Обновить' : 'Создать'}</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingPost(null)
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

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-dark-brown mb-2">{post.title}</h3>
                <p className="text-brown text-sm mb-2 line-clamp-2">{post.excerpt}</p>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs ${
                    post.published
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {post.published ? 'Опубликовано' : 'Черновик'}
                </span>
              </div>
              <div className="flex gap-2 ml-4">
                <Button size="sm" onClick={() => setEditingPost(post)}>
                  Редактировать
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(post.id)}
                >
                  Удалить
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

