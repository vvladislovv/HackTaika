'use client'

import { cn } from '@/lib/utils'

interface LoadingProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Loading({ className, size = 'md' }: LoadingProps) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-4 border-gray/30 border-t-orange',
          {
            'w-6 h-6': size === 'sm',
            'w-12 h-12': size === 'md',
            'w-16 h-16': size === 'lg',
          }
        )}
      />
    </div>
  )
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-cream/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Loading size="lg" />
    </div>
  )
}

