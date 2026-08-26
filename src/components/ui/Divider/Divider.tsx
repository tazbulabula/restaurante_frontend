// src/components/ui/Divider/Divider.tsx

import { cn } from '@/utils/cn'

interface DividerProps {
  className?: string
  orientation?: 'horizontal' | 'vertical'
  children?: React.ReactNode
}

export function Divider({ className, orientation = 'horizontal', children }: DividerProps) {
  if (orientation === 'vertical') {
    return <div className={cn('w-px bg-gray-200', className)} />
  }

  if (children) {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        <hr className="flex-1 border-gray-200" />
        <span className="text-sm text-gray-500">{children}</span>
        <hr className="flex-1 border-gray-200" />
      </div>
    )
  }

  return <hr className={cn('border-gray-200', className)} />
}