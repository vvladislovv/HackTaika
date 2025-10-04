'use client'

import { Button } from '@/components/ui/Button'
import { Loading } from '@/components/ui/Loading'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const navItems = [
  { name: 'Работы', href: '/admin/dashboard/works' },
  { name: 'Портфолио', href: '/admin/dashboard/portfolio' },
  { name: 'Блог', href: '/admin/dashboard/blog' },
  { name: 'Соцсети', href: '/admin/dashboard/socials' },
  { name: 'Заявки', href: '/admin/dashboard/applications' },
  { name: 'Админы', href: '/admin/dashboard/admins' },
]

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin')
    }
  }, [status, router])

  if (status === 'loading') {
    return <Loading />
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-orange geometric-shape" />
                <div className="absolute inset-2 bg-rust geometric-shape rotate-45" />
              </div>
              <h1 className="text-xl font-bold text-dark-brown">
                HackTaika Admin
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-brown hidden sm:inline">
                {session.user?.email}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => signOut({ callbackUrl: '/admin' })}
              >
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden mb-4 p-2 rounded-lg bg-white hover:bg-orange/10 transition-smooth"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside
            className={`lg:w-64 ${
              mobileMenuOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <nav className="bg-white rounded-xl shadow-lg p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg transition-smooth ${
                    pathname === item.href
                      ? 'bg-orange text-white'
                      : 'text-dark-brown hover:bg-cream'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}

