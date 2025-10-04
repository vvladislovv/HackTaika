import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-white to-orange/10 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-orange/10 geometric-shape animate-spin-slow" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-rust/10 geometric-shape animate-spin-reverse" />
      </div>

      <div className="relative text-center max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 bg-orange geometric-shape" />
            <div className="absolute inset-4 bg-rust geometric-shape rotate-45" />
          </div>
        </div>

        <h1 className="text-9xl font-bold text-dark-brown mb-4">404</h1>
        <h2 className="text-3xl font-bold text-brown mb-4">Страница не найдена</h2>
        <p className="text-brown mb-8">
          К сожалению, страница, которую вы ищете, не существует или была перемещена.
        </p>

        <Link href="/">
          <Button size="lg">Вернуться на главную</Button>
        </Link>
      </div>
    </div>
  )
}

