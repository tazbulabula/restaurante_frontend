// src/components/ui/Label/Label.tsx

import { LabelHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn('block text-sm font-medium text-gray-700', className)}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
    )
  }
)

Label.displayName = 'Label'