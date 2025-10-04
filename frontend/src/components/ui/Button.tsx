'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ButtonHTMLAttributes, forwardRef, useState } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const [isHovered, setIsHovered] = useState(false)
    
    return (
      <motion.button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg relative overflow-hidden',
          'transition-all duration-300 ease-out transform-gpu',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-orange text-white shadow-lg hover:shadow-xl': variant === 'primary',
            'bg-brown text-white shadow-lg hover:shadow-xl': variant === 'secondary',
            'border-2 border-orange text-orange hover:text-white':
              variant === 'outline',
          },
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-6 py-3 text-base': size === 'md',
            'px-8 py-4 text-lg': size === 'lg',
          },
          className
        )}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        {...props}
      >
        {/* Background animation */}
        <motion.div
          className={cn(
            'absolute inset-0 rounded-lg',
            {
              'bg-rust': variant === 'primary',
              'bg-dark-brown': variant === 'secondary',
              'bg-orange': variant === 'outline',
            }
          )}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: isHovered ? 1.5 : 0,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ originX: 0.5, originY: 0.5 }}
        />
        
        {/* Content */}
        <span className="relative z-10">{children}</span>
        
        {/* Ripple effect on hover */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-lg bg-white/20"
            initial={{ scale: 0 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

