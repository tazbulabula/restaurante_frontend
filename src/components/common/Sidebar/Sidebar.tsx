// src/components/common/Sidebar/Sidebar.tsx

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SidebarItem } from './SidebarItem'
import { useAuthStore } from '@/store/authStore'
import { showToast } from '@/components/ui'

const menuItems = [
  { to: '/admin', icon: '📊', label: 'Dashboard' },
  { to: '/admin/produtos', icon: '🍽️', label: 'Produtos' },
  { to: '/admin/mesas', icon: '🪑', label: 'Mesas' },
  { to: '/admin/pedidos', icon: '📦', label: 'Pedidos' },
  { to: '/admin/reservas', icon: '📅', label: 'Reservas' },
  { to: '/admin/clientes', icon: '👥', label: 'Clientes' },
]

interface SidebarProps {
  isMobile?: boolean
  onClose?: () => void
}

export function Sidebar({ isMobile, onClose }: SidebarProps) {
  const navigate = useNavigate()
  const { logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    showToast.success('Logout realizado com sucesso')
    navigate('/login')
    if (onClose) onClose()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-6 border-b border-cream-200">
        <h2 className="text-2xl font-display text-gold-600">🍽️ Aurora</h2>
        <p className="text-sm text-brown-500">Painel Administrativo</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            onClick={onClose}
          />
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-cream-200">
        <Link to="/alterar-senha" className="hover:text-gold-600">
        🔒 Alterar Senha
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all duration-200"
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </div>
  )
}