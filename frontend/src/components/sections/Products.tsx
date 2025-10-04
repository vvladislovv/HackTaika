'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loading } from '@/components/ui/Loading'
import { Modal } from '@/components/ui/Modal'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface Work {
  id: string
  title: string
  description: string
  price: string
  images: string[]
  videos: string[]
  siteUrl?: string
  clientName: string
  clientReview: string
  category: string
}

const categories = [
  { id: 'all', name: 'Все' },
  { id: 'corporate', name: 'Корпоративный' },
  { id: 'ecommerce', name: 'E-commerce' },
  { id: 'landing', name: 'Лендинги' },
  { id: 'miniapp', name: 'Mini App' },
  { id: 'chatbot', name: 'Чат боты' },
  { id: 'mobile', name: 'Мобильные приложения' },
  { id: 'crm', name: 'CRM системы' },
  { id: 'api', name: 'API интеграции' },
  { id: 'analytics', name: 'Аналитика' },
  { id: 'other', name: 'Другое' },
]

export function Products() {
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWork, setSelectedWork] = useState<Work | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 6

  useEffect(() => {
    fetchWorks()
  }, [])

  useEffect(() => {
    setCurrentPage(0)
  }, [selectedCategory])

  const fetchWorks = async () => {
    try {
      const response = await fetch('/api/works')
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

  const handleOrderClick = () => {
    const element = document.querySelector('#order-form')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setSelectedWork(null)
    }
  }

  if (loading) {
    return (
      <section id="products" className="py-32 bg-cream">
        <Loading size="lg" />
      </section>
    )
  }

  const filteredWorks = selectedCategory === 'all' 
    ? works 
    : works.filter(work => {
        const workCategory = work.category.toLowerCase()
        const selectedCategoryLower = selectedCategory.toLowerCase()
        
        // Маппинг ID категорий на названия в базе данных
        const categoryMapping: { [key: string]: string[] } = {
          'corporate': ['корпоративный'],
          'ecommerce': ['e-commerce', 'ecommerce'],
          'landing': ['лендинг', 'лендинги', 'landing'],
          'miniapp': ['mini app', 'miniapp', 'мини-приложение'],
          'chatbot': ['чат бот', 'чатбот', 'chatbot'],
          'mobile': ['мобильное приложение', 'мобильные приложения', 'mobile'],
          'crm': ['crm', 'система управления'],
          'api': ['api', 'интеграция', 'интеграции'],
          'analytics': ['аналитика', 'analytics'],
          'other': ['другое', 'прочее', 'other']
        }
        
        const mappedCategories = categoryMapping[selectedCategoryLower] || [selectedCategoryLower]
        return mappedCategories.some(cat => workCategory.includes(cat))
      })

  const totalPages = Math.ceil(filteredWorks.length / itemsPerPage)
  const paginatedWorks = filteredWorks.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
  const showPagination = filteredWorks.length > itemsPerPage

  return (
    <section id="products" className="py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-brand text-dark-brown mb-4">
            Наши товары
          </h2>
          <p className="text-xl text-brown">
            Готовые решения для вашего бизнеса
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-orange text-white shadow-lg'
                  : 'bg-white text-brown hover:bg-orange/10 hover:text-orange'
              }`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedWorks.map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover onClick={() => setSelectedWork(work)}>
                <div className="relative h-64 bg-gray/20">
                  {work.images[0] && (
                    <Image
                      src={work.images[0]}
                      alt={work.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-orange/10 text-orange text-sm rounded-full mb-3">
                    {work.category}
                  </span>
                  <h3 className="text-2xl font-brand text-dark-brown mb-2">
                    {work.title}
                  </h3>
                  <p className="text-brown mb-4 line-clamp-2">
                    {work.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-orange">
                      {work.price}
                    </span>
                    <Button size="sm">Подробнее</Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {showPagination && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center items-center gap-4 mt-12"
          >
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Назад
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-brown">
                Страница {currentPage + 1} из {totalPages}
              </span>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="flex items-center gap-2"
            >
              Вперед
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </motion.div>
        )}

        {filteredWorks.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-brown">
              {selectedCategory === 'all' 
                ? 'Скоро здесь появятся наши работы'
                : 'В этой категории пока нет товаров'
              }
            </p>
          </div>
        )}
      </div>

      {/* Work Detail Modal */}
      {selectedWork && (
        <Modal
          isOpen={!!selectedWork}
          onClose={() => {
            setSelectedWork(null)
            setCurrentImageIndex(0)
          }}
        >
          <div className="p-8">
            {/* Image Gallery */}
            <div className="relative h-96 bg-gray/10 rounded-xl overflow-hidden mb-6">
              {selectedWork.images.length > 0 && (
                <>
                  <Image
                    src={selectedWork.images[currentImageIndex]}
                    alt={selectedWork.title}
                    fill
                    className="object-cover"
                  />
                  {selectedWork.images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setCurrentImageIndex((prev) =>
                            prev === 0
                              ? selectedWork.images.length - 1
                              : prev - 1
                          )
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full hover:bg-white transition-smooth"
                      >
                        ←
                      </button>
                      <button
                        onClick={() =>
                          setCurrentImageIndex((prev) =>
                            prev === selectedWork.images.length - 1
                              ? 0
                              : prev + 1
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full hover:bg-white transition-smooth"
                      >
                        →
                      </button>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Videos */}
            {selectedWork.videos.length > 0 && (
              <div className="mb-6 space-y-4">
                {selectedWork.videos.map((video, index) => (
                  <video
                    key={index}
                    controls
                    className="w-full rounded-xl"
                    src={video}
                  />
                ))}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <span className="inline-block px-3 py-1 bg-orange/10 text-orange text-sm rounded-full mb-3">
                  {selectedWork.category}
                </span>
                <h2 className="text-3xl font-bold text-dark-brown mb-2">
                  {selectedWork.title}
                </h2>
                <p className="text-2xl font-bold text-orange mb-4">
                  {selectedWork.price}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-dark-brown mb-2">
                  Описание
                </h3>
                <p className="text-brown">{selectedWork.description}</p>
              </div>

              {selectedWork.siteUrl && (
                <div>
                  <h3 className="text-xl font-bold text-dark-brown mb-2">
                    Ссылка на сайт
                  </h3>
                  <a
                    href={selectedWork.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange hover:text-rust transition-smooth"
                  >
                    {selectedWork.siteUrl}
                  </a>
                </div>
              )}

              <div className="bg-cream p-6 rounded-xl">
                <h3 className="text-xl font-bold text-dark-brown mb-2">
                  Отзыв клиента
                </h3>
                <p className="text-brown mb-2">{selectedWork.clientReview}</p>
                <p className="text-sm text-brown font-medium">
                  — {selectedWork.clientName}
                </p>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handleOrderClick}
              >
                Заказать у нас
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  )
}

