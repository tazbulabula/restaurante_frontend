// src/components/charts/ChartCard.tsx

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ChartCardProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function ChartCard({
  title,
  subtitle,
  icon,
  action,
  children,
  className = '',
}: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.15, 1] }}
      className={`bg-white rounded-2xl border border-cream-200/50 shadow-lg shadow-brown-900/5 hover:shadow-xl hover:shadow-brown-900/8 transition-shadow duration-300 ${className}`}
    >
      <div className="flex items-start justify-between p-5 border-b border-cream-100">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-9 h-9 rounded-xl bg-gold-100 flex items-center justify-center text-gold-600">
              {icon}
            </div>
          )}
          <div>
            <h3 className="font-display text-lg text-brown-800">{title}</h3>
            {subtitle && (
              <p className="text-xs text-brown-400 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  )
}