// src/components/ui/Spinner/Spinner.tsx

import { cn } from '@/utils/cn'
import { motion } from 'framer-motion'

// ============================================================
// CONFIGURAÇÕES DE CORES
// ============================================================
const colorConfig = {
  gold: {
    spinner: 'border-gold-500',
    track: 'border-gold-200',
    text: 'text-gold-500',
  },
  brown: {
    spinner: 'border-brown-600',
    track: 'border-brown-200',
    text: 'text-brown-600',
  },
  cream: {
    spinner: 'border-cream-500',
    track: 'border-cream-200',
    text: 'text-cream-500',
  },
  white: {
    spinner: 'border-white',
    track: 'border-white/20',
    text: 'text-white',
  },
  primary: {
    spinner: 'border-gold-500',
    track: 'border-gold-200',
    text: 'text-gold-500',
  },
  secondary: {
    spinner: 'border-brown-600',
    track: 'border-brown-200',
    text: 'text-brown-600',
  },
  danger: {
    spinner: 'border-red-500',
    track: 'border-red-200',
    text: 'text-red-500',
  },
  success: {
    spinner: 'border-emerald-500',
    track: 'border-emerald-200',
    text: 'text-emerald-500',
  },
  warning: {
    spinner: 'border-amber-500',
    track: 'border-amber-200',
    text: 'text-amber-500',
  },
  info: {
    spinner: 'border-blue-500',
    track: 'border-blue-200',
    text: 'text-blue-500',
  },
}

// ============================================================
// TIPOS
// ============================================================
interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: keyof typeof colorConfig
  className?: string
  label?: string
  showLabel?: boolean
  variant?: 'default' | 'dots' | 'pulse' | 'ring'
}

// ============================================================
// ANIMAÇÕES
// ============================================================
const dotVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      ease: [0.25, 0.1, 0.15, 1],
      repeat: Infinity,
      repeatType: 'reverse' as const,
      repeatDelay: 0.1,
    }
  })
}

const pulseVariants = {
  hidden: { scale: 0.8, opacity: 0.5 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatType: 'reverse' as const,
      ease: [0.25, 0.1, 0.15, 1],
    }
  }
}

const ringVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.15, 1],
    }
  },
  spin: {
    rotate: 360,
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: "linear",
    }
  }
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export function Spinner({ 
  size = 'md', 
  color = 'gold', 
  className,
  label,
  showLabel = false,
  variant = 'default'
}: SpinnerProps) {
  const colors = colorConfig[color] || colorConfig.gold

  const sizes = {
    xs: 'h-3 w-3 border-2',
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4',
  }

  const textSizes = {
    xs: 'text-[10px]',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  }

  // ============================================================
  // VARIANT: DOTS
  // ============================================================
  if (variant === 'dots') {
    return (
      <div className={cn('flex flex-col items-center gap-3', className)}>
        <div className="flex items-center gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              custom={i}
              variants={dotVariants}
              initial="hidden"
              animate="visible"
              className={cn(
                'rounded-full',
                colors.spinner,
                sizes[size]?.replace(/border-\d+/, '') || 'h-3 w-3'
              )}
              style={{
                backgroundColor: color === 'white' ? '#ffffff' : undefined,
              }}
            />
          ))}
        </div>
        {showLabel && label && (
          <span className={cn('font-medium', colors.text, textSizes[size])}>
            {label}
          </span>
        )}
      </div>
    )
  }

  // ============================================================
  // VARIANT: PULSE
  // ============================================================
  if (variant === 'pulse') {
    return (
      <div className={cn('flex flex-col items-center gap-3', className)}>
        <motion.div
          variants={pulseVariants}
          initial="hidden"
          animate="visible"
          className={cn(
            'rounded-full',
            colors.spinner,
            sizes[size]
          )}
          style={{
            backgroundColor: color === 'white' ? 'rgba(255,255,255,0.2)' : undefined,
          }}
        />
        {showLabel && label && (
          <span className={cn('font-medium', colors.text, textSizes[size])}>
            {label}
          </span>
        )}
      </div>
    )
  }

  // ============================================================
  // VARIANT: RING
  // ============================================================
  if (variant === 'ring') {
    return (
      <div className={cn('flex flex-col items-center gap-3', className)}>
        <div className="relative">
          <motion.div
            variants={ringVariants}
            initial="hidden"
            animate="visible"
            className={cn(
              'rounded-full border-4',
              colors.track,
              sizes[size]?.replace(/border-\d+/, '') || 'h-8 w-8'
            )}
          />
          <motion.div
            variants={ringVariants}
            initial="hidden"
            animate="spin"
            className={cn(
              'absolute inset-0 rounded-full border-4 border-t-transparent',
              colors.spinner,
              sizes[size]
            )}
          />
        </div>
        {showLabel && label && (
          <span className={cn('font-medium', colors.text, textSizes[size])}>
            {label}
          </span>
        )}
      </div>
    )
  }

  // ============================================================
  // VARIANT: DEFAULT
  // ============================================================
  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-t-transparent',
          colors.spinner,
          sizes[size]
        )}
      />
      {showLabel && label && (
        <span className={cn('font-medium', colors.text, textSizes[size])}>
          {label}
        </span>
      )}
    </div>
  )
}