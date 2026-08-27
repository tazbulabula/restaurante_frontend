// src/components/common/Sidebar/SidebarItem.tsx

import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { ChevronRight, Sparkles } from 'lucide-react'

// ============================================================
// ANIMAÇÕES
// ============================================================
const itemVariants = {
  initial: { opacity: 0, x: -10 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.15, 1]
    }
  },
  hover: {
    scale: 1.02,
    x: 6,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  },
  tap: {
    scale: 0.97,
    transition: { duration: 0.1 }
  }
}

const activeIndicatorVariants = {
  initial: { scaleX: 0, opacity: 0 },
  animate: {
    scaleX: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
      delay: 0.1
    }
  },
  exit: {
    scaleX: 0,
    opacity: 0,
    transition: { duration: 0.2 }
  }
}

const iconVariants = {
  hover: {
    rotate: -5,
    scale: 1.1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
}

const badgeVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
      delay: 0.2
    }
  }
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
interface SidebarItemProps {
  to: string
  icon: React.ReactNode
  label: string
  onClick?: () => void
  badge?: string | number // Badge opcional (ex: notificações)
  isNew?: boolean // Destacar item como "Novo"
}

export function SidebarItem({ 
  to, 
  icon, 
  label, 
  onClick, 
  badge,
  isNew 
}: SidebarItemProps) {
  const location = useLocation()
  
  // Verificar se o link está ativo (suporte para sub-rotas)
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`)

  return (
    <motion.div
      variants={itemVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      className="relative"
    >
      <Link
        to={to}
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden group",
          isActive
            ? "text-gold-700 bg-gold-50 shadow-sm shadow-gold-500/10 border border-gold-200/50"
            : "text-brown-600 hover:text-gold-600 hover:bg-gold-50/50"
        )}
      >
        {/* ============================================================ */}
        {/* FUNDO DE DESTAQUE (ativo) */}
        {/* ============================================================ */}
        {isActive && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-gold-400/5 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* ============================================================ */}
        {/* ÍCONE COM ANIMAÇÃO */}
        {/* ============================================================ */}
        <motion.span
          variants={iconVariants}
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300",
            isActive
              ? "text-gold-600 bg-gold-100/50"
              : "text-brown-400 group-hover:text-gold-500 group-hover:bg-gold-50"
          )}
        >
          {icon}
        </motion.span>

        {/* ============================================================ */}
        {/* LABEL */}
        {/* ============================================================ */}
        <span className={cn(
          "flex-1 transition-colors duration-300",
          isActive ? "text-gold-700 font-semibold" : "text-brown-600"
        )}>
          {label}
        </span>

        {/* ============================================================ */}
        {/* BADGE (opcional) */}
        {/* ============================================================ */}
        {badge && (
          <motion.span
            variants={badgeVariants}
            initial="initial"
            animate="animate"
            className={cn(
              "px-2 py-0.5 text-[10px] font-bold rounded-full",
              isActive
                ? "bg-gold-500 text-white shadow-gold"
                : "bg-gold-100 text-gold-700"
            )}
          >
            {badge}
          </motion.span>
        )}

        {/* ============================================================ */}
        {/* BADGE "NOVO" (opcional) */}
        {/* ============================================================ */}
        {isNew && (
          <motion.span
            variants={badgeVariants}
            initial="initial"
            animate="animate"
            className="px-1.5 py-0.5 bg-emerald-500 text-white text-[8px] font-bold rounded-full uppercase tracking-wider"
          >
            Novo
          </motion.span>
        )}

        {/* ============================================================ */}
        {/* INDICADOR DE ATIVO (barra lateral) */}
        {/* ============================================================ */}
        {isActive && (
          <motion.span
            variants={activeIndicatorVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gold-500 rounded-full"
          />
        )}

        {/* ============================================================ */}
        {/* SETA DE NAVEGAÇÃO (hover) */}
        {/* ============================================================ */}
        <motion.span
          className={cn(
            "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            isActive ? "text-gold-400" : "text-brown-300"
          )}
          initial={{ x: -5 }}
          animate={{ x: 0 }}
        >
          <ChevronRight className="w-4 h-4" />
        </motion.span>
      </Link>

      {/* ============================================================ */}
      {/* EFEITO DE BRILLHO NO HOVER */}
      {/* ============================================================ */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gold-200/20 to-transparent rounded-xl" />
      </motion.div>
    </motion.div>
  )
}