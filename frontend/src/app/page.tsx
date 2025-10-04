'use client'

import { Footer } from '@/components/layout/Footer'
import { Navigation } from '@/components/layout/Navigation'
import { Description } from '@/components/sections/Description'
import { DetailedApplicationForm } from '@/components/sections/DetailedApplicationForm'
import { DevBlog } from '@/components/sections/DevBlog'
import { Hero } from '@/components/sections/Hero'
import { Portfolio } from '@/components/sections/Portfolio'
import { Products } from '@/components/sections/Products'
import { Socials } from '@/components/sections/Socials'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <main className="min-h-screen bg-cream" />
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Description />
      <Products />
      <Portfolio />
      <DevBlog />
      <DetailedApplicationForm />
      <Socials />
      <Footer />
    </main>
  )
}

