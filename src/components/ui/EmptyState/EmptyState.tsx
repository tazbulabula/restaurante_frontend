// src/components/ui/EmptyState/EmptyState.tsx

import { Button } from '../Button'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon || '📭'}</div>
      <h3 className="text-xl font-display text-brown-800 mb-2">{title}</h3>
      {description && <p className="text-brown-500">{description}</p>}
      {action && (
        <Button
          variant="gold"
          className="mt-4"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}