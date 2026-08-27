// src/components/common/Layout/Header.tsx

import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { showToast } from '@/components/ui'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  Utensils, 
  ShoppingCart, 
  User, 
  LogOut, 
  LogIn, 
  UserPlus,
  LayoutDashboard,
  Eye,
  ChefHat,
  Home
} from 'lucide-react'

// ============================================================
// ANIMAÇÕES
// ============================================================
const menuVariants = {
  hidden: { 
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: { duration: 0.2 }
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.3,
      ease: [0.25, 0.1, 0.15, 1]
    }
  },
  exit: { 
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: { duration: 0.2 }
  }
}

const linkVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: [0.25, 0.1, 0.15, 1]
    }
  })
}

const badgeVariants = {
  initial: { scale: 0.5, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30
    }
  },
  exit: { 
    scale: 0.5, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const menuRef = useRef<HTMLDivElement>(null)

  // Acessar o estado do carrinho
  const items = useCartStore((state) => state.items)
  const totalItems = items.reduce((acc, item) => acc + item.quantidade, 0)

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fechar menu ao mudar de rota
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  // Efeito de scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMenuOpen(false)
    showToast.success('👋 Até logo! Volte sempre.')
  }

  const handleVerSite = () => {
    showToast.info('👁️ Visualizando o site como cliente')
    navigate('/')
    setIsMenuOpen(false)
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-cream-50/95 backdrop-blur-md shadow-lg shadow-brown-900/5' 
          : 'bg-cream-50'
      }`}
    >
      {/* ============================================================ */}
      {/* BANNER DE VISUALIZAÇÃO (Admin) */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isAuthenticated && user?.user_type === 'admin' && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.15, 1] }}
            className="overflow-hidden bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 border-b border-amber-200/50"
          >
            <div className="max-w-7xl mx-auto px-4 py-1.5 text-center">
              <motion.span 
                className="text-xs text-amber-700 font-medium flex items-center justify-center gap-2"
                animate={{ 
                  scale: [1, 1.02, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Eye className="w-3.5 h-3.5" />
                Modo Visualização - Você está vendo o site como um cliente
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* HEADER PRINCIPAL */}
      {/* ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xl md:text-2xl font-display font-bold text-gold-600"
          >
            <ChefHat className="w-6 h-6 md:w-7 md:h-7 text-gold-500" />
            <span className="hidden sm:inline">Aurora</span>
            <span className="sm:hidden">🍽️</span>
          </Link>
        </motion.div>

        {/* ============================================================ */}
        {/* DESKTOP NAVIGATION */}
        {/* ============================================================ */}
        <nav className="hidden md:flex items-center gap-1">
          {/* Cardápio */}
          <motion.div
            whileHover={{ y: -1 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              to="/cardapio"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/cardapio')
                  ? 'text-gold-600 bg-gold-50'
                  : 'text-brown-600 hover:text-gold-600 hover:bg-gold-50/50'
              }`}
            >
              <Utensils className="w-4 h-4" />
              Cardápio
            </Link>
          </motion.div>

          {isAuthenticated ? (
            <>
              {/* Reservar Mesa */}
              <motion.div
                whileHover={{ y: -1 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/reservas/nova"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive('/reservas/nova')
                      ? 'text-gold-600 bg-gold-50'
                      : 'text-brown-600 hover:text-gold-600 hover:bg-gold-50/50'
                  }`}
                >
                  Reservar Mesa
                </Link>
              </motion.div>

              {/* Meus Pedidos */}
              <motion.div
                whileHover={{ y: -1 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/pedidos/meus"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive('/pedidos/meus')
                      ? 'text-gold-600 bg-gold-50'
                      : 'text-brown-600 hover:text-gold-600 hover:bg-gold-50/50'
                  }`}
                >
                  Meus Pedidos
                </Link>
              </motion.div>

              {/* Carrinho */}
              <motion.div
                whileHover={{ y: -1 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Link
                  to="/carrinho"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive('/carrinho')
                      ? 'text-gold-600 bg-gold-50'
                      : 'text-brown-600 hover:text-gold-600 hover:bg-gold-50/50'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Carrinho
                  
                  <AnimatePresence>
                    {totalItems > 0 && (
                      <motion.span
                        key="cart-badge-desktop"
                        variants={badgeVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="ml-1 min-w-[20px] h-5 px-1.5 bg-gold-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-gold-500/30"
                      >
                        {totalItems > 99 ? '99+' : totalItems}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>

              {/* Admin: Voltar ao Admin */}
              {user?.user_type === 'admin' && (
                <motion.div
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to="/admin"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive('/admin')
                        ? 'text-gold-600 bg-gold-50'
                        : 'text-gold-600 hover:text-gold-700 hover:bg-gold-50/50'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin
                  </Link>
                </motion.div>
              )}

              {/* Divider */}
              <div className="w-px h-6 bg-brown-200 mx-1" />

              {/* User Info + Logout */}
              <motion.div
                whileHover={{ y: -1 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <span className="text-sm text-brown-600 font-medium">
                  {user?.name?.split(' ')[0] || 'Usuário'}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden xl:inline">Sair</span>
                </button>
              </motion.div>
            </>
          ) : (
            <>
              {/* Entrar */}
              <motion.div
                whileHover={{ y: -1 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-brown-600 hover:text-gold-600 hover:bg-gold-50/50 transition-all duration-300"
                >
                  <LogIn className="w-4 h-4" />
                  Entrar
                </Link>
              </motion.div>

              {/* Registrar */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/registrar"
                  className="flex items-center gap-1.5 px-4 py-2 bg-gold-600 text-white rounded-lg text-sm font-medium hover:bg-gold-700 transition-all duration-300 shadow-gold"
                >
                  <UserPlus className="w-4 h-4" />
                  Registrar
                </Link>
              </motion.div>
            </>
          )}
        </nav>

        {/* ============================================================ */}
        {/* MOBILE - ÍCONES E HAMBURGER */}
        {/* ============================================================ */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Carrinho (mobile) */}
          <Link
            to="/carrinho"
            className="relative p-2 rounded-lg text-brown-700 hover:text-gold-600 hover:bg-gold-50/50 transition-all duration-300"
          >
            <ShoppingCart className="w-5 h-5" />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key="cart-badge-mobile-icon"
                  variants={badgeVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-4 px-1 bg-gold-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-gold-500/30"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Menu Hamburguer */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg text-brown-700 hover:bg-gold-50/50 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isMenuOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE MENU - SIMPLIFICADO */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden bg-cream-50/98 backdrop-blur-sm border-t border-brown-100/50 py-3 px-4 shadow-lg max-h-[80vh] overflow-y-auto"
          >
            <div className="flex flex-col gap-1">
              {/* Home */}
              <motion.div custom={0} variants={linkVariants} initial="hidden" animate="visible">
                <Link
                  to="/"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive('/')
                      ? 'text-gold-600 bg-gold-50'
                      : 'text-brown-600 hover:text-gold-600 hover:bg-gold-50/50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="w-4 h-4" />
                  Início
                </Link>
              </motion.div>

              {/* Cardápio */}
              <motion.div custom={1} variants={linkVariants} initial="hidden" animate="visible">
                <Link
                  to="/cardapio"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive('/cardapio')
                      ? 'text-gold-600 bg-gold-50'
                      : 'text-brown-600 hover:text-gold-600 hover:bg-gold-50/50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Utensils className="w-4 h-4" />
                  Cardápio
                </Link>
              </motion.div>

              {isAuthenticated ? (
                <>
                  {/* Reservar Mesa */}
                  <motion.div custom={2} variants={linkVariants} initial="hidden" animate="visible">
                    <Link
                      to="/reservas/nova"
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isActive('/reservas/nova')
                          ? 'text-gold-600 bg-gold-50'
                          : 'text-brown-600 hover:text-gold-600 hover:bg-gold-50/50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Reservar Mesa
                    </Link>
                  </motion.div>

                  {/* Meus Pedidos */}
                  <motion.div custom={3} variants={linkVariants} initial="hidden" animate="visible">
                    <Link
                      to="/pedidos/meus"
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isActive('/pedidos/meus')
                          ? 'text-gold-600 bg-gold-50'
                          : 'text-brown-600 hover:text-gold-600 hover:bg-gold-50/50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Meus Pedidos
                    </Link>
                  </motion.div>

                  {/* Admin: Voltar ao Admin */}
                  {user?.user_type === 'admin' && (
                    <motion.div custom={4} variants={linkVariants} initial="hidden" animate="visible">
                      <Link
                        to="/admin"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                          isActive('/admin')
                            ? 'text-gold-600 bg-gold-50'
                            : 'text-gold-600 hover:text-gold-700 hover:bg-gold-50/50'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Painel Admin
                      </Link>
                    </motion.div>
                  )}

                  {/* Divider */}
                  <motion.div 
                    custom={5} 
                    variants={linkVariants} 
                    initial="hidden" 
                    animate="visible"
                    className="my-2 border-t border-brown-100"
                  />

                  {/* User info + Logout */}
                  <motion.div 
                    custom={6} 
                    variants={linkVariants} 
                    initial="hidden" 
                    animate="visible"
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <span className="text-sm text-brown-600 font-medium flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {user?.name || 'Usuário'}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </motion.div>
                </>
              ) : (
                <>
                  {/* Entrar */}
                  <motion.div custom={2} variants={linkVariants} initial="hidden" animate="visible">
                    <Link
                      to="/login"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-brown-600 hover:text-gold-600 hover:bg-gold-50/50 transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="w-4 h-4" />
                      Entrar
                    </Link>
                  </motion.div>

                  {/* Criar Conta */}
                  <motion.div custom={3} variants={linkVariants} initial="hidden" animate="visible">
                    <Link
                      to="/registrar"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gold-600 text-white rounded-lg text-sm font-medium hover:bg-gold-700 transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserPlus className="w-4 h-4" />
                      Criar Conta
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}