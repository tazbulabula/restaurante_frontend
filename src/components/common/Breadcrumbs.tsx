// src/components/common/Breadcrumbs.tsx

import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Home, Sparkles } from 'lucide-react'
import { cn } from '@/utils/cn'

// ============================================================
// MAPEAMENTO DE ROTAS
// ============================================================
const routeNames: Record<string, string> = {
  '/': 'Início',
  '/cardapio': 'Cardápio',
  '/carrinho': 'Carrinho',
  '/checkout': 'Checkout',
  '/pagamento': 'Pagamento',
  '/pedidos/meus': 'Meus Pedidos',
  '/reservas/nova': 'Nova Reserva',
  '/reservas/minhas': 'Minhas Reservas',
  '/admin': 'Dashboard',
  '/admin/produtos': 'Produtos',
  '/admin/mesas': 'Mesas',
  '/admin/pedidos': 'Pedidos',
  '/admin/reservas': 'Reservas',
  '/admin/usuarios': 'Usuários',
  '/admin/relatorios': 'Relatórios',
  '/admin/configuracoes': 'Configurações',
  '/sobre': 'Sobre Nós',
  '/contato': 'Contato',
  '/login': 'Entrar',
  '/registrar': 'Registrar',
  '/esqueci-senha': 'Recuperar Senha',
  '/perfil': 'Meu Perfil',
}

// ============================================================
// ANIMAÇÕES
// ============================================================
const breadcrumbVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: [0.25, 0.1, 0.15, 1]
    }
  }),
  exit: {
    opacity: 0,
    x: 10,
    transition: { duration: 0.2 }
  }
}

const separatorVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.1,
      duration: 0.3,
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
}

const homeIconVariants = {
  hover: {
    scale: 1.1,
    rotate: -5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  },
  tap: {
    scale: 0.9,
    transition: { duration: 0.1 }
  }
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export function Breadcrumbs() {
  const location = useLocation()
  const pathSegments = location.pathname.split('/').filter(Boolean)

  // Se estiver na home, não mostrar breadcrumbs
  if (pathSegments.length === 0 && location.pathname === '/') {
    return null
  }

  // Construir breadcrumbs
  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/')
    const name = routeNames[path] || segment.charAt(0).toUpperCase() + segment.slice(1)
    const isLast = index === pathSegments.length - 1

    return { name, path, isLast }
  })

  // Verificar se é admin
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.15, 1] }}
      className={cn(
        "text-sm py-3 px-4 md:px-0",
        isAdmin 
          ? "text-brown-500/70 border-b border-cream-200/50 bg-white/50 backdrop-blur-sm" 
          : "text-brown-500"
      )}
      aria-label="Breadcrumb"
    >
      <div className="max-w-7xl mx-auto">
        <ol className="flex items-center flex-wrap gap-1.5">
          {/* Home Link */}
          <motion.li
            variants={homeIconVariants}
            whileHover="hover"
            whileTap="tap"
            className="flex items-center"
          >
            <Link
              to="/"
              className={cn(
                "flex items-center gap-1 transition-all duration-300 rounded-lg px-2 py-1",
                location.pathname === '/'
                  ? 'text-gold-600 font-medium'
                  : 'text-brown-500 hover:text-gold-600 hover:bg-gold-50/50'
              )}
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs">Início</span>
            </Link>
          </motion.li>

          {/* Breadcrumbs com AnimatePresence */}
          <AnimatePresence mode="popLayout">
            {breadcrumbs.map((item, index) => (
              <motion.li
                key={item.path}
                custom={index}
                variants={breadcrumbVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex items-center gap-1.5"
              >
                {/* Separador */}
                <motion.span
                  variants={separatorVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-brown-300/60 flex items-center"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </motion.span>

                {/* Link ou Texto Atual */}
                {item.isLast ? (
                  <span className={cn(
                    "font-medium flex items-center gap-1.5",
                    isAdmin ? "text-gold-600" : "text-brown-800"
                  )}>
                    {/* Ícone decorativo para o último item */}
                    {isAdmin && (
                      <Sparkles className="w-3 h-3 text-gold-400" />
                    )}
                    {item.name}
                  </span>
                ) : (
                  <Link
                    to={item.path}
                    className={cn(
                      "transition-all duration-300 rounded-lg px-2 py-1 text-xs",
                      isAdmin
                        ? "text-brown-400 hover:text-gold-600 hover:bg-gold-50/50"
                        : "text-brown-500 hover:text-gold-600 hover:bg-gold-50/50"
                    )}
                  >
                    {item.name}
                  </Link>
                )}
              </motion.li>
            ))}
          </AnimatePresence>

          {/* Badge de Admin (se estiver no admin) */}
          {isAdmin && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="ml-2 px-2 py-0.5 bg-gold-100 text-gold-700 text-[10px] font-semibold rounded-full border border-gold-200"
            >
              Admin
            </motion.span>
          )}
        </ol>
      </div>
    </motion.nav>
  )
}