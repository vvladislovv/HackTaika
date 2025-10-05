'use client'

import { Loading } from '@/components/ui/Loading'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Social {
  id: string
  name: string
  url: string
  icon: string
}

const IconComponent = ({ icon }: { icon: string }) => {
  switch (icon.toLowerCase()) {
    case 'telegram':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
        </svg>
      )
    case 'vk':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.27-1.422 2.168-3.616 2.168-3.616.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.488-.085.744-.576.744z"/>
        </svg>
      )
    case 'youtube':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    default:
      return <span className="text-lg font-bold">{icon[0]}</span>
  }
}

export function Socials() {
  const [socials, setSocials] = useState<Social[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSocials()
  }, [])

  const fetchSocials = async () => {
    try {
      const response = await fetch('/api/socials')
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

  if (loading) {
    return (
      <section id="socials" className="py-32 bg-gradient-to-br from-cream to-white">
        <Loading size="lg" />
      </section>
    )
  }

  return (
    <section id="socials" className="py-32 bg-gradient-to-br from-cream to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-brand text-dark-brown mb-4">
            Мы в соцсетях
          </h2>
          <p className="text-xl text-brown">
            Подписывайтесь и следите за новостями
          </p>
        </motion.div>

        <div className="flex justify-center items-center gap-6">
          {socials.map((social, index) => (
            <motion.a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              whileHover={{ 
                scale: 1.05, 
                y: -6,
                transition: { 
                  duration: 0.3,
                  ease: "easeOut"
                }
              }}
              whileTap={{ scale: 0.95 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.15,
                duration: 0.5,
                ease: "easeOut"
              }}
              className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl hover:bg-orange hover:text-white transition-all duration-300 ease-out shadow-lg hover:shadow-xl group cursor-pointer border border-gray-100 hover:border-orange"
            >
              <motion.div 
                className="transition-transform duration-300 ease-out group-hover:rotate-12"
                whileHover={{ 
                  rotate: 15,
                  scale: 1.1,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                <IconComponent icon={social.icon} />
              </motion.div>
              <span className="text-lg font-semibold transition-all duration-300 group-hover:tracking-wide">{social.name}</span>
            </motion.a>
          ))}
        </div>

        {socials.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-brown">
              Скоро добавим социальные сети
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

