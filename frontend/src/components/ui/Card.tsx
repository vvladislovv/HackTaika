'use client'

import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export function Card({ className, hover = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-lg overflow-hidden transition-smooth',
        hover && 'hover:shadow-2xl hover:-translate-y-2 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

