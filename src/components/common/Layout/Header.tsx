// src/components/common/Layout/Header.tsx

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { showToast } from '@/components/ui'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMenuOpen(false)
  }

  const handleVerSite = () => {
    showToast.info('👁️ Visualizando o site como cliente')
    navigate('/')
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Banner de Modo Visualização (apenas para admin) */}
      {isAuthenticated && user?.user_type === 'admin' && (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-1.5 text-center">
          <span className="text-xs text-amber-700 font-medium">
            👁️ Modo Visualização - Você está vendo o site como um cliente
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gold-600">
          🍽️ Aurora
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/cardapio" className="text-brown-700 hover:text-gold-600 transition">
            Cardápio
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/reservas/nova" className="text-brown-700 hover:text-gold-600 transition">
                Reservar Mesa
              </Link>
              <Link to="/pedidos/meus" className="text-brown-700 hover:text-gold-600 transition">
                Meus Pedidos
              </Link>
              <Link to="/carrinho" className="text-brown-700 hover:text-gold-600 transition">
                🛒 Carrinho
              </Link>

              {/* 🔥 Link "Voltar ao Admin" (apenas para admin) */}
              {user?.user_type === 'admin' && (
                <Link 
                  to="/admin" 
                  className="text-gold-600 hover:text-gold-700 font-medium transition"
                >
                  ⚙️ Voltar ao Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 transition"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-brown-700 hover:text-gold-600 transition">
                Entrar
              </Link>
              <Link
                to="/registrar"
                className="bg-gold-600 text-white px-4 py-2 rounded-lg hover:bg-gold-700 transition"
              >
                Registrar
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-brown-700 text-2xl"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-cream-200 py-4 px-4 flex flex-col gap-3">
          <Link to="/cardapio" className="hover:text-gold-600" onClick={() => setIsMenuOpen(false)}>
            Cardápio
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/reservas/nova" className="hover:text-gold-600" onClick={() => setIsMenuOpen(false)}>
                Reservar Mesa
              </Link>
              <Link to="/pedidos/meus" className="hover:text-gold-600" onClick={() => setIsMenuOpen(false)}>
                Meus Pedidos
              </Link>
              <Link to="/carrinho" className="hover:text-gold-600" onClick={() => setIsMenuOpen(false)}>
                🛒 Carrinho
              </Link>

              {/* 🔥 Link "Voltar ao Admin" no mobile (apenas para admin) */}
              {user?.user_type === 'admin' && (
                <Link 
                  to="/admin" 
                  className="text-gold-600 font-medium hover:text-gold-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ⚙️ Voltar ao Admin
                </Link>
              )}

              <button onClick={handleLogout} className="text-red-500 text-left hover:text-red-600">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gold-600" onClick={() => setIsMenuOpen(false)}>
                Entrar
              </Link>
              <Link
                to="/registrar"
                className="bg-gold-600 text-white px-4 py-2 rounded-lg text-center hover:bg-gold-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Registrar
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}