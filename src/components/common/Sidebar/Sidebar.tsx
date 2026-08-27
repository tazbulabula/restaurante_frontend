// src/components/common/Sidebar/Sidebar.tsx

import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { SidebarItem } from './SidebarItem'
import { useAuthStore } from '@/store/authStore'
import { showToast } from '@/components/ui'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Utensils, 
  Table, 
  Package, 
  Calendar, 
  Users,
  LogOut,
  Lock,
  ChefHat,
  Sparkles,
  Settings,
  HelpCircle,
  ChevronRight,
  Crown
} from 'lucide-react'

// ============================================================
// ÍCONES DO MENU
// ============================================================
const menuItems = [
  { to: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
  { to: '/admin/produtos', icon: <Utensils className="w-5 h-5" />, label: 'Produtos' },
  { to: '/admin/mesas', icon: <Table className="w-5 h-5" />, label: 'Mesas' },
  { to: '/admin/pedidos', icon: <Package className="w-5 h-5" />, label: 'Pedidos' },
  { to: '/admin/reservas', icon: <Calendar className="w-5 h-5" />, label: 'Reservas' },
  { to: '/admin/clientes', icon: <Users className="w-5 h-5" />, label: 'Clientes' },
]

// ============================================================
// ANIMAÇÕES
// ============================================================
const sidebarVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.15, 1],
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.15, 1]
    }
  }
}

const logoVariants = {
  hover: {
    scale: 1.03,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
}

const userBadgeVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      delay: 0.3
    }
  }
}

interface SidebarProps {
  isMobile?: boolean
  onClose?: () => void
}

export function Sidebar({ isMobile, onClose }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    showToast.success('Logout realizado com sucesso! 👋')
    navigate('/login')
    if (onClose) onClose()
  }

  const handleVerSite = () => {
    showToast.info('👁️ Visualizando o site como cliente')
    navigate('/')
    if (onClose) onClose()
  }

  // Verificar se o link está ativo
  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
      className="flex flex-col h-full bg-white shadow-2xl shadow-brown-900/10 relative overflow-hidden"
    >
      {/* ============================================================ */}
      {/* DECORATIVE BACKGROUND */}
      {/* ============================================================ */}
      <div className="absolute inset-0 bg-luxury-pattern opacity-5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-500/5 rounded-full blur-2xl" />

      {/* ============================================================ */}
      {/* HEADER - LOGO */}
      {/* ============================================================ */}
      <div className="relative z-10 px-5 py-6 border-b border-cream-200/70">
        <motion.div
          variants={logoVariants}
          whileHover="hover"
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/25">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-brown-800">
              Aurora
            </h2>
            <p className="text-[10px] text-brown-400 font-medium uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-gold-400" />
              Painel Administrativo
            </p>
          </div>
        </motion.div>

        {/* Badge de Admin */}
        <motion.div
          variants={userBadgeVariants}
          initial="initial"
          animate="animate"
          className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-gold-50 rounded-full border border-gold-200/50 w-fit"
        >
          <Crown className="w-3.5 h-3.5 text-gold-500" />
          <span className="text-[10px] font-medium text-gold-700">
            {user?.username || 'Administrador'}
          </span>
        </motion.div>
      </div>

      {/* ============================================================ */}
      {/* MENU */}
      {/* ============================================================ */}
      <nav className="relative z-10 flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.to}
            variants={itemVariants}
            custom={index}
          >
            <SidebarItem
              to={item.to}
              icon={item.icon}
              label={item.label}
              active={isActive(item.to)}
              onClick={onClose}
            />
          </motion.div>
        ))}

        {/* Separador */}
        <div className="my-4 border-t border-cream-200/50" />

        {/* Link "Ver Site" */}
        <motion.div variants={itemVariants}>
          <button
            onClick={handleVerSite}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-brown-500 hover:text-gold-600 hover:bg-gold-50/50 transition-all duration-300 group"
          >
            <span className="text-lg">👁️</span>
            <span>Ver Site</span>
            <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </motion.div>
      </nav>

      {/* ============================================================ */}
      {/* FOOTER - LOGOUT E CONFIGURAÇÕES */}
      {/* ============================================================ */}
      <div className="relative z-10 p-4 border-t border-cream-200/70 space-y-2">
        {/* Alterar Senha */}
        <Link
          to="/alterar-senha"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-brown-600 hover:text-gold-600 hover:bg-gold-50/50 transition-all duration-300 group"
          onClick={onClose}
        >
          <Lock className="w-4 h-4" />
          <span>Alterar Senha</span>
          <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Configurações */}
        <Link
          to="/admin/configuracoes"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-brown-600 hover:text-gold-600 hover:bg-gold-50/50 transition-all duration-300 group"
          onClick={onClose}
        >
          <Settings className="w-4 h-4" />
          <span>Configurações</span>
          <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Ajuda */}
        <Link
          to="/admin/ajuda"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-brown-600 hover:text-gold-600 hover:bg-gold-50/50 transition-all duration-300 group"
          onClick={onClose}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Ajuda</span>
          <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-300 group mt-2"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span className="font-medium">Sair</span>
          <motion.span
            className="ml-auto text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ x: -5 }}
            whileHover={{ x: 0 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.span>
        </motion.button>
      </div>
    </motion.aside>
  )
}