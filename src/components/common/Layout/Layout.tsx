// src/components/common/Layout/Layout.tsx

import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Header } from './Header'
import { Footer } from './Footer'

// ============================================================
// ANIMAÇÕES DE TRANSIÇÃO ENTRE PÁGINAS
// ============================================================
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.15, 1]
    }
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.15, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.25,
      ease: [0.25, 0.1, 0.15, 1]
    }
  }
}

// Animação para o conteúdo
const contentVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      delay: 0.1,
      duration: 0.3,
      ease: [0.25, 0.1, 0.15, 1]
    }
  }
}

// Animação para o header
const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.15, 1]
    }
  }
}

export function Layout() {
  const location = useLocation()

  return (
    // ✅ Adicionado overflow-x-hidden para prevenir scroll horizontal
    <div className="min-h-screen flex flex-col bg-cream-50 overflow-x-hidden max-w-full">
      
      {/* ============================================================ */}
      {/* HEADER COM ANIMAÇÃO DE ENTRADA */}
      {/* ============================================================ */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        className="sticky top-0 z-50 w-full max-w-full"
      >
        <Header />
      </motion.div>

      {/* ============================================================ */}
      {/* CONTEÚDO PRINCIPAL COM TRANSIÇÃO */}
      {/* ============================================================ */}
      <motion.main 
        className="flex-1 relative w-full max-w-full overflow-x-hidden"
        initial="initial"
        animate="animate"
        variants={contentVariants}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full w-full max-w-full overflow-x-hidden"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </motion.main>

      {/* ============================================================ */}
      {/* FOOTER COM ANIMAÇÃO DE ENTRADA */}
      {/* ============================================================ */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        transition={{ delay: 0.2 }}
        className="w-full max-w-full overflow-x-hidden"
      >
        <Footer />
      </motion.div>
    </div>
  )
}