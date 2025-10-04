'use client'

import { Card } from '@/components/ui/Card'
import { Loading } from '@/components/ui/Loading'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  image?: string
  createdAt: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog')
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-cream pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loading size="lg" />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-cream pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-brand text-dark-brown mb-4">
            Девблог
          </h1>
          <p className="text-xl text-brown">
            Все статьи и новости
          </p>
        </motion.div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={index === 0 ? "lg:col-span-2" : ""}
            >
              <Link href={`/blog/${post.id}`}>
                <Card className="h-full hover:shadow-2xl transition-all duration-300 cursor-pointer group">
                  {post.image && (
                    <div className={`relative bg-gray/10 rounded-t-xl overflow-hidden ${index === 0 ? "h-80" : "h-64"}`}>
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className={`${index === 0 ? "p-8" : "p-6"}`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-orange font-medium">
                        {new Date(post.createdAt).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    
                    <h3 className={`font-brand text-dark-brown mb-4 group-hover:text-orange transition-colors ${index === 0 ? "text-3xl" : "text-2xl"}`}>
                      {post.title}
                    </h3>
                    
                    <p className={`text-brown leading-relaxed ${index === 0 ? "line-clamp-4 text-lg" : "line-clamp-3"}`}>
                      {post.excerpt}
                    </p>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center pb-16"
        >
          <Link 
            href="/#devblog"
            className="inline-flex items-center gap-2 px-8 py-4 bg-orange text-white rounded-lg hover:bg-rust transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Вернуться на главную
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
