// src/components/Skeletons/CardapioSkeleton.tsx

import { motion } from 'framer-motion'
import { Container } from '@/components/ui'

// ============================================================
// ANIMAÇÕES
// ============================================================
const pulseVariants = {
  initial: { opacity: 0.6 },
  animate: {
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const shimmerVariants = {
  initial: { x: '-100%' },
  animate: {
    x: '100%',
    transition: {
      duration: 1.8,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 0.3
    }
  }
}

const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.15, 1]
    }
  }
}

// ============================================================
// COMPONENTE DE SKELETON ITEM
// ============================================================
function SkeletonCard() {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-brown-900/5 border border-cream-200/50 relative"
    >
      {/* Efeito shimmer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
        />
      </div>

      {/* Imagem placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-gold-100 to-brown-100 overflow-hidden">
        <motion.div
          variants={pulseVariants}
          initial="initial"
          animate="animate"
          className="absolute inset-0 bg-gradient-to-r from-gold-200/30 via-cream-100/30 to-gold-200/30"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl opacity-30">🍽️</span>
        </div>
        
        {/* Badges skeleton */}
        <div className="absolute top-3 left-3">
          <motion.div
            variants={pulseVariants}
            initial="initial"
            animate="animate"
            className="h-6 w-16 bg-brown-900/20 rounded-full"
          />
        </div>
        <div className="absolute top-3 right-3">
          <motion.div
            variants={pulseVariants}
            initial="initial"
            animate="animate"
            className="h-6 w-20 bg-gold-500/30 rounded-full"
          />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-5 space-y-3">
        {/* Título e categoria */}
        <div className="flex justify-between items-start">
          <motion.div
            variants={pulseVariants}
            initial="initial"
            animate="animate"
            className="h-6 w-32 bg-brown-200 rounded-lg"
          />
          <motion.div
            variants={pulseVariants}
            initial="initial"
            animate="animate"
            className="h-5 w-16 bg-gold-200 rounded-full"
          />
        </div>

        {/* Descrição */}
        <div className="space-y-1.5">
          <motion.div
            variants={pulseVariants}
            initial="initial"
            animate="animate"
            className="h-3.5 w-full bg-brown-150 rounded"
          />
          <motion.div
            variants={pulseVariants}
            initial="initial"
            animate="animate"
            className="h-3.5 w-3/4 bg-brown-150 rounded"
          />
        </div>

        {/* Preço e ações */}
        <div className="flex items-center justify-between pt-4 border-t border-cream-100">
          <div className="space-y-1">
            <motion.div
              variants={pulseVariants}
              initial="initial"
              animate="animate"
              className="h-3 w-10 bg-brown-150 rounded"
            />
            <motion.div
              variants={pulseVariants}
              initial="initial"
              animate="animate"
              className="h-6 w-20 bg-gold-200 rounded"
            />
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              variants={pulseVariants}
              initial="initial"
              animate="animate"
              className="h-9 w-9 bg-brown-150 rounded-xl"
            />
            <motion.div
              variants={pulseVariants}
              initial="initial"
              animate="animate"
              className="h-9 w-24 bg-gold-200 rounded-xl"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export function CardapioSkeleton() {
  return (
    <Container className="py-8 md:py-12">
      {/* Header com animação */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.15, 1] }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            variants={pulseVariants}
            initial="initial"
            animate="animate"
            className="h-8 w-8 bg-gold-200 rounded-lg"
          />
          <motion.div
            variants={pulseVariants}
            initial="initial"
            animate="animate"
            className="h-8 w-32 bg-brown-200 rounded-lg"
          />
        </div>
        <motion.div
          variants={pulseVariants}
          initial="initial"
          animate="animate"
          className="h-4 w-64 bg-brown-150 rounded"
        />
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex flex-wrap gap-4 mb-8"
      >
        <motion.div
          variants={pulseVariants}
          initial="initial"
          animate="animate"
          className="h-10 w-72 bg-brown-150 rounded-xl"
        />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              variants={pulseVariants}
              initial="initial"
              animate="animate"
              className="h-10 w-20 bg-brown-150 rounded-xl"
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
      </motion.div>

      {/* Grid de Produtos */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </motion.div>

      {/* Contador skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="text-center mt-8"
      >
        <motion.div
          variants={pulseVariants}
          initial="initial"
          animate="animate"
          className="h-4 w-32 bg-brown-150 rounded mx-auto"
        />
      </motion.div>
    </Container>
  )
}