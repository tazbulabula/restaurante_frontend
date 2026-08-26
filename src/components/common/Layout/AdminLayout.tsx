// src/components/common/Layout/AdminLayout.tsx

import { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Sidebar } from '../Sidebar/Sidebar'
import { useAuthStore } from '@/store/authStore'
import { showToast } from '@/components/ui'

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Se não for admin, redireciona
  if (user?.user_type !== 'admin') {
    navigate('/')
    return null
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleVerSite = () => {
    showToast.info('👁️ Visualizando o site como cliente')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Sidebar Desktop */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-white shadow-luxury
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </aside>

      {/* Overlay para mobile */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header Admin */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-4 lg:px-8">
            <div className="flex items-center gap-4">
              {/* Botão Hamburguer (mobile) */}
              <button
                onClick={toggleSidebar}
                className="lg:hidden text-2xl text-brown-700 hover:text-gold-600"
              >
                ☰
              </button>
              <h1 className="text-xl font-display text-brown-800 lg:hidden">
                Painel Admin
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-brown-600 hidden sm:block">
                👋 {user?.username}
              </span>

              {/* 🔥 Botão "Ver Site" com Toast */}
              <button
                onClick={handleVerSite}
                className="text-sm text-gold-600 hover:underline transition"
              >
                Ver Site
              </button>
            </div>
          </div>
        </header>

        {/* Conteúdo */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}