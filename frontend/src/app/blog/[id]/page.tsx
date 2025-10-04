'use client'

import { Loading } from '@/components/ui/Loading'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  image?: string
  createdAt: string
}

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [allPosts, setAllPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    fetchPost()
    fetchAllPosts()
  }, [params.id])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
      } else {
        router.push('/blog')
      }
    } catch (error) {
      console.error('Error fetching blog post:', error)
      router.push('/blog')
    } finally {
      setLoading(false)
    }
  }

  const fetchAllPosts = async () => {
    try {
      const response = await fetch('/api/blog')
      if (response.ok) {
        const data = await response.json()
        setAllPosts(data)
      }
    } catch (error) {
      console.error('Error fetching all posts:', error)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-cream pt-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loading size="lg" />
        </div>
      </main>
    )
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-cream pt-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-dark-brown mb-4">Статья не найдена</h1>
          <Link href="/blog" className="text-orange hover:underline">
            ← Вернуться к блогу
          </Link>
        </div>
      </main>
    )
  }

  const currentIndex = allPosts.findIndex(p => p.id === post.id)
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null

  return (
    <main className="min-h-screen bg-cream pt-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            href="/blog"
            className="inline-flex items-center text-orange hover:text-orange/80 transition-colors"
          >
            ← Вернуться к блогу
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {post.image && (
            <div className="relative h-96 bg-gray/10">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="p-8">
            <div className="mb-6">
              <span className="text-sm text-orange font-medium">
                {new Date(post.createdAt).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-dark-brown mt-2 mb-4">
                {post.title}
              </h1>
            </div>

            <MarkdownRenderer 
              content={post.content} 
              className="text-brown"
            />
          </div>
        </motion.article>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row justify-between gap-4"
        >
          {prevPost ? (
            <Link 
              href={`/blog/${prevPost.id}`}
              className="flex-1 p-4 bg-white rounded-lg shadow hover:shadow-lg transition-all group"
            >
              <div className="text-sm text-orange mb-1">← Предыдущая статья</div>
              <div className="font-medium text-dark-brown group-hover:text-orange transition-colors">
                {prevPost.title}
              </div>
            </Link>
          ) : (
            <div className="flex-1"></div>
          )}

          {nextPost ? (
            <Link 
              href={`/blog/${nextPost.id}`}
              className="flex-1 p-4 bg-white rounded-lg shadow hover:shadow-lg transition-all group text-right"
            >
              <div className="text-sm text-orange mb-1">Следующая статья →</div>
              <div className="font-medium text-dark-brown group-hover:text-orange transition-colors">
                {nextPost.title}
              </div>
            </Link>
          ) : (
            <div className="flex-1"></div>
          )}
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-orange text-white rounded-lg hover:bg-orange/90 transition-colors"
          >
            ← Вернуться на главную
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
