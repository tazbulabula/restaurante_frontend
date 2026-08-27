// src/components/common/Layout/AdminLayout.tsx

import { useState, useEffect, useRef } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { Sidebar } from '../Sidebar/Sidebar'
import { useAuthStore } from '@/store/authStore'
import { showToast } from '@/components/ui'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  Eye, 
  User, 
  LogOut, 
  LayoutDashboard,
  ChevronRight,
  Bell,
  Search,
  Settings,
  HelpCircle,
  Sparkles
} from 'lucide-react'

// ============================================================
// ANIMAÇÕES
// ============================================================
const sidebarVariants = {
  open: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.3
    }
  },
  closed: {
    x: "-100%",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.3
    }
  }
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
}

const contentVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.15, 1]
    }
  }
}

const headerVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.15, 1]
    }
  }
}

const notificationBadgeVariants = {
  initial: { scale: 0.5, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  },
  hover: { 
    scale: 1.1,
    transition: { duration: 0.2 }
  }
}

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [notifications] = useState(3)
  
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const searchInputRef = useRef<HTMLInputElement>(null)

  // ============================================================
  // DETECTAR MOBILE E GERENCIAR SIDEBAR
  // ============================================================
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (!mobile) {
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // ============================================================
  // EFEITO DE SCROLL NO HEADER
  // ============================================================
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ============================================================
  // FECHAR SIDEBAR AO MUDAR DE ROTA (MOBILE)
  // ============================================================
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }, [location.pathname, isMobile])

  // ============================================================
  // FECHAR SIDEBAR COM ESC
  // ============================================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen && isMobile) {
        setIsSidebarOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSidebarOpen, isMobile])

  // ============================================================
  // FOCUS NO SEARCH
  // ============================================================
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }, [isSearchOpen])

  // ============================================================
  // VERIFICAÇÃO DE AUTENTICAÇÃO
  // ============================================================
  if (user?.user_type !== 'admin') {
    navigate('/')
    return null
  }

  // ============================================================
  // HANDLERS
  // ============================================================
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleVerSite = () => {
    showToast.info('👁️ Visualizando o site como cliente', {
      duration: 3000,
      position: 'bottom-right'
    })
    navigate('/')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    showToast.success('👋 Até logo, administrador!', {
      duration: 3000,
      position: 'bottom-right'
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const query = searchInputRef.current?.value
    if (query?.trim()) {
      showToast.info(`🔍 Buscando por: "${query}"`, {
        duration: 2000,
        position: 'bottom-right'
      })
      setIsSearchOpen(false)
    }
  }

  return (
    // ✅ Adicionado overflow-x-hidden e max-w-full
    <div className="min-h-screen bg-cream-50 flex overflow-x-hidden max-w-full">
      
      {/* ============================================================ */}
      {/* SIDEBAR */}
      {/* ============================================================ */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen || !isMobile) && (
          <motion.aside
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className={`
              fixed lg:static inset-y-0 left-0 z-50
              w-72 bg-white shadow-2xl shadow-brown-900/10
              lg:translate-x-0
              ${isMobile ? 'rounded-r-2xl' : ''}
              overflow-hidden
            `}
          >
            <Sidebar onClose={() => setIsSidebarOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* OVERLAY MOBILE */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isSidebarOpen && isMobile && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* CONTEÚDO PRINCIPAL */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden max-w-full">
        
        {/* ============================================================ */}
        {/* HEADER ADMIN */}
        {/* ============================================================ */}
        <motion.header
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className={`
            sticky top-0 z-30 
            transition-all duration-300
            ${isScrolled 
              ? 'bg-cream-50/95 backdrop-blur-md shadow-lg shadow-brown-900/5' 
              : 'bg-cream-50'
            }
            w-full max-w-full overflow-x-hidden
          `}
        >
          <div className="flex items-center justify-between px-4 py-3 lg:px-8 lg:py-4 w-full max-w-full">
            {/* Left Section */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Menu Button (Mobile) */}
              <motion.button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-lg text-brown-700 hover:text-gold-600 hover:bg-gold-50/50 transition-all duration-300 flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle sidebar"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isSidebarOpen ? 'close' : 'open'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 min-w-0"
              >
                <LayoutDashboard className="w-5 h-5 text-gold-500 hidden lg:block flex-shrink-0" />
                <h1 className="text-lg lg:text-xl font-display text-brown-800 truncate">
                  Painel Administrativo
                </h1>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 400 }}
                  className="px-2 py-0.5 bg-gold-500/10 text-gold-600 text-[10px] font-semibold rounded-full flex-shrink-0 hidden sm:inline"
                >
                  v2.0
                </motion.span>
              </motion.div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
              
              {/* Search (Desktop) */}
              <motion.div 
                className="hidden lg:flex items-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="w-48 xl:w-64 pl-10 pr-4 py-2 bg-cream-100/50 border border-cream-200 rounded-lg text-sm text-brown-700 placeholder-brown-400 focus:outline-none focus:border-gold-400 focus:bg-white transition-all duration-300"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400" />
                </form>
              </motion.div>

              {/* Search Button (Mobile) */}
              <motion.button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="lg:hidden p-2 rounded-lg text-brown-700 hover:text-gold-600 hover:bg-gold-50/50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {/* Notifications */}
              <motion.button
                className="relative p-2 rounded-lg text-brown-700 hover:text-gold-600 hover:bg-gold-50/50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  showToast.info('📬 Você tem 3 notificações', {
                    duration: 3000,
                    position: 'bottom-right'
                  })
                }}
              >
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <motion.span
                    variants={notificationBadgeVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                  >
                    {notifications}
                  </motion.span>
                )}
              </motion.button>

              {/* Help */}
              <motion.button
                className="hidden lg:flex p-2 rounded-lg text-brown-700 hover:text-gold-600 hover:bg-gold-50/50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  showToast.info('📖 Documentação disponível no menu Ajuda', {
                    duration: 3000,
                    position: 'bottom-right'
                  })
                }}
              >
                <HelpCircle className="w-5 h-5" />
              </motion.button>

              {/* Divider */}
              <div className="hidden lg:block w-px h-8 bg-cream-200" />

              {/* User */}
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-medium text-brown-800 truncate max-w-[80px]">
                    {user?.username}
                  </span>
                  <span className="text-xs text-gold-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Admin
                  </span>
                </div>

                <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white font-semibold text-sm shadow-gold flex-shrink-0">
                  {user?.username?.charAt(0).toUpperCase() || 'A'}
                </div>

                {/* Logout */}
                <motion.button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Sair"
                >
                  <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SEARCH MOBILE EXPANDED */}
          {/* ============================================================ */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden overflow-hidden px-4 pb-3"
              >
                <form onSubmit={handleSearch} className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Buscar no painel..."
                    className="w-full pl-10 pr-4 py-2.5 bg-cream-100/50 border border-cream-200 rounded-lg text-sm text-brown-700 placeholder-brown-400 focus:outline-none focus:border-gold-400 focus:bg-white transition-all duration-300"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400" />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ============================================================ */}
          {/* BREADCRUMB */}
          {/* ============================================================ */}
          <motion.div 
            className="hidden lg:flex items-center gap-2 px-8 pb-3 text-sm text-brown-400 overflow-x-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/admin" className="hover:text-gold-500 transition-colors whitespace-nowrap">
              Dashboard
            </Link>
            {location.pathname !== '/admin' && (
              <>
                <ChevronRight className="w-3 h-3 flex-shrink-0" />
                <span className="text-brown-600 font-medium capitalize whitespace-nowrap">
                  {location.pathname.split('/').pop()?.replace('-', ' ') || 'Página'}
                </span>
              </>
            )}
          </motion.div>
        </motion.header>

        {/* ============================================================ */}
        {/* CONTEÚDO PRINCIPAL COM ANIMAÇÃO */}
        {/* ============================================================ */}
        <motion.main
          variants={contentVariants}
          initial="initial"
          animate="animate"
          className="flex-1 p-4 lg:p-8 overflow-x-hidden max-w-full"
        >
          <Outlet />
        </motion.main>

        {/* ============================================================ */}
        {/* FOOTER ADMIN */}
        {/* ============================================================ */}
        <motion.footer 
          className="border-t border-cream-200/50 bg-white/50 backdrop-blur-sm py-3 px-4 lg:px-8 overflow-x-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-brown-400 overflow-x-hidden">
            <p className="text-center sm:text-left">
              © {new Date().getFullYear()} <span className="text-gold-500 font-medium">Aurora</span> - Painel Administrativo
            </p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                Sistema Online
              </span>
              <span className="hidden sm:inline">|</span>
              <span>v2.0.0</span>
              <span className="hidden sm:inline">|</span>
              <button 
                onClick={handleVerSite}
                className="text-gold-500 hover:text-gold-600 transition-colors flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                Ver Site
              </button>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}