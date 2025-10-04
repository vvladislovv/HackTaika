'use client'

import { Card } from '@/components/ui/Card'
import { Loading } from '@/components/ui/Loading'
import { Modal } from '@/components/ui/Modal'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface PortfolioItem {
  id: string
  title: string
  description: string
  images: string[]
  videos: string[]
  siteUrl?: string
  clientName: string
  clientReview: string
  category: string
}

const categories = [
  { id: 'all', name: 'Все' },
  { id: 'miniapp', name: 'Mini App' },
  { id: 'website', name: 'Сайты' },
  { id: 'chatbot', name: 'Чат боты' },
  { id: 'landing', name: 'Лендинги' },
  { id: 'other', name: 'Другое' },
]

export function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 6

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

  useEffect(() => {
    fetchPortfolio()
  }, [])

  useEffect(() => {
    setCurrentPage(0)
  }, [selectedCategory])

  if (loading) {
    return (
      <section id="portfolio" className="py-32 bg-white">
        <Loading size="lg" />
      </section>
    )
  }

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category.toLowerCase() === selectedCategory)

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const paginatedItems = filteredItems.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
  const showPagination = filteredItems.length > itemsPerPage

  return (
    <section id="portfolio" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-brand text-dark-brown mb-4">
            Портфолио
          </h2>
          <p className="text-xl text-brown">
            Наши лучшие проекты
          </p>
        </motion.div>

        {/* Категории */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-orange text-white shadow-lg scale-105'
                  : 'bg-cream text-dark-brown hover:bg-orange/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.name}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {paginatedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 100,
                }}
              >
                <Card hover onClick={() => setSelectedItem(item)}>
                  <div className="relative h-80 bg-gray/20">
                    {item.images[0] && (
                      <Image
                        src={item.images[0]}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                      <div className="p-6 w-full">
                        <span className="inline-block px-3 py-1 bg-orange text-white text-sm rounded-full mb-2">
                          {item.category}
                        </span>
                        <h3 className="text-2xl font-bold text-white">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination Controls */}
        {showPagination && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-6 mt-12"
          >
            <button
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="group relative p-4 bg-orange text-white rounded-full hover:bg-rust disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 disabled:hover:scale-100 shadow-lg"
              aria-label="Предыдущая страница"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center gap-3">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentPage === index 
                      ? 'bg-orange w-8 shadow-lg' 
                      : 'bg-gray/30 hover:bg-orange/50'
                  }`}
                  aria-label={`Страница ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
              className="group relative p-4 bg-orange text-white rounded-full hover:bg-rust disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 disabled:hover:scale-100 shadow-lg"
              aria-label="Следующая страница"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        )}

        {items.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-brown">
              Скоро здесь появятся наши проекты
            </p>
          </div>
        )}
      </div>

      {/* Portfolio Detail Modal */}
      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => {
            setSelectedItem(null)
            setCurrentImageIndex(0)
          }}
        >
          <div className="p-8">
            {/* Image Gallery */}
            <div className="relative h-96 bg-gray/10 rounded-xl overflow-hidden mb-6">
              {selectedItem.images.length > 0 && (
                <>
                  <Image
                    src={selectedItem.images[currentImageIndex]}
                    alt={selectedItem.title}
                    fill
                    className="object-cover"
                  />
                  {selectedItem.images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setCurrentImageIndex((prev) =>
                            prev === 0 ? selectedItem.images.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full hover:bg-white transition-smooth"
                      >
                        ←
                      </button>
                      <button
                        onClick={() =>
                          setCurrentImageIndex((prev) =>
                            prev === selectedItem.images.length - 1 ? 0 : prev + 1
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

            {/* Thumbnails */}
            {selectedItem.images.length > 1 && (
              <div className="flex gap-2 mb-6 overflow-x-auto">
                {selectedItem.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 ${
                      currentImageIndex === index ? 'ring-2 ring-orange' : ''
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Videos */}
            {selectedItem.videos.length > 0 && (
              <div className="mb-6 space-y-4">
                {selectedItem.videos.map((video, index) => (
                  <video key={index} controls className="w-full rounded-xl" src={video} />
                ))}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <span className="inline-block px-3 py-1 bg-orange/10 text-orange text-sm rounded-full mb-3">
                  {selectedItem.category}
                </span>
                <h2 className="text-3xl font-bold text-dark-brown">
                  {selectedItem.title}
                </h2>
              </div>

              <div>
                <h3 className="text-xl font-bold text-dark-brown mb-2">
                  О проекте
                </h3>
                <p className="text-brown">{selectedItem.description}</p>
              </div>

              {selectedItem.siteUrl && (
                <div>
                  <h3 className="text-xl font-bold text-dark-brown mb-2">
                    Перейти на сайт
                  </h3>
                  <a
                    href={selectedItem.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange hover:text-rust transition-smooth inline-flex items-center gap-2"
                  >
                    {selectedItem.siteUrl}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}

              <div className="bg-cream p-6 rounded-xl">
                <h3 className="text-xl font-bold text-dark-brown mb-2">
                  Отзыв клиента
                </h3>
                <p className="text-brown mb-2">{selectedItem.clientReview}</p>
                <p className="text-sm text-brown font-medium">
                  — {selectedItem.clientName}
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </section>
  )
}

