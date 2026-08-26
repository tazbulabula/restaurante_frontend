// src/components/common/Sidebar/SidebarItem.tsx

import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/utils/cn'

interface SidebarItemProps {
  to: string
  icon: React.ReactNode
  label: string
  onClick?: () => void
}

export function SidebarItem({ to, icon, label, onClick }: SidebarItemProps) {
  const location = useLocation()
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`)

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
        isActive
          ? 'bg-gold-500 text-white shadow-gold'
          : 'text-brown-600 hover:bg-cream-100 hover:text-brown-800'
      )}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  )
}