// src/components/ui/Button/Button.tsx

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { Spinner } from '../Spinner'  // <--- DEVE IMPORTAR O SPINNER

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'bronze' | 'outline-gold' | 'outline-bronze' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  fullWidth?: boolean
  children: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'gold',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      gold: 'bg-gold-500 hover:bg-gold-600 text-white shadow-gold hover:shadow-gold transition-shadow',
      bronze: 'bg-bronze-500 hover:bg-bronze-600 text-white',
      'outline-gold': 'border-2 border-gold-500 text-gold-500 hover:bg-gold-50',
      'outline-bronze': 'border-2 border-bronze-500 text-bronze-500 hover:bg-bronze-50',
      ghost: 'hover:bg-cream-200 text-brown-700',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-2.5 text-base',
      lg: 'px-8 py-3.5 text-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner size="sm" />
            <span>Carregando...</span>
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'