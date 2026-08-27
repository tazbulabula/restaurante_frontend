// src/pages/Pedidos/Carrinho.tsx

import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight,
  Sparkles,
  Receipt,
  CreditCard,
  Clock,
  Package,
  X
} from 'lucide-react'
import { Container, Card, Button, showToast } from '@/components/ui'
import { useCartStore } from '@/store/cartStore'

// ============================================================
// ANIMAÇÕES
// ============================================================
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.15, 1]
    }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.15, 1]
    }
  },
  exit: {
    opacity: 0,
    x: 20,
    scale: 0.9,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.15, 1]
    }
  }
}

const summaryVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.2,
      ease: [0.25, 0.1, 0.15, 1]
    }
  }
}

const emptyVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      delay: 0.2
    }
  }
}

export function Carrinho() {
  const { items, total, removeItem, updateQuantidade, clearCart } = useCartStore()

  const handleRemoveItem = (produtoId: number, name: string) => {
    removeItem(produtoId)
    showToast.success(
      <div className="flex items-center gap-2">
        <X className="w-4 h-4" />
        <span>{name} removido do carrinho</span>
      </div>
    )
  }

  const handleUpdateQuantidade = (produtoId: number, quantidade: number, name: string) => {
    if (quantidade < 1) {
      handleRemoveItem(produtoId, name)
      return
    }
    updateQuantidade(produtoId, quantidade)
  }

  const handleClearCart = () => {
    if (items.length === 0) return
    
    const confirmed = window.confirm('Tem certeza que deseja esvaziar o carrinho?')
    if (confirmed) {
      clearCart()
      showToast.info('Carrinho esvaziado com sucesso')
    }
  }

  const taxaServico = total * 0.1
  const totalFinal = total + taxaServico
  const totalItems = items.reduce((acc, item) => acc + item.quantidade, 0)

  // ============================================================
  // CARRINHO VAZIO
  // ============================================================
  if (items.length === 0) {
    return (
      <Container className="py-16 md:py-24">
        <motion.div
          variants={emptyVariants}
          initial="hidden"
          animate="visible"
          className="max-w-md mx-auto"
        >
          <Card className="text-center py-16 px-6 bg-gradient-to-br from-cream-50 to-gold-50/30 border-2 border-gold-200/30">
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, -5, 5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-7xl mb-6"
            >
              🛒
            </motion.div>
            
            <h2 className="text-3xl font-display text-brown-800 mb-3">
              Seu carrinho está <span className="text-gold-500">vazio</span>
            </h2>
            <p className="text-brown-500 mb-8 max-w-sm mx-auto">
              Que tal explorar nosso cardápio e escolher os pratos que vão tornar sua experiência gastronômica inesquecível?
            </p>
            <Link to="/cardapio">
              <Button variant="gold" className="group text-lg px-8 py-3">
                <span className="flex items-center gap-2">
                  Ver Cardápio
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </Link>
            
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-brown-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                Pratos exclusivos
              </span>
              <span className="w-px h-3 bg-brown-200" />
              <span>🍽️ Chefs renomados</span>
              <span className="w-px h-3 bg-brown-200" />
              <span>⭐ 4.9/5</span>
            </div>
          </Card>
        </motion.div>
      </Container>
    )
  }

  // ============================================================
  // CARRINHO COM ITENS
  // ============================================================
  return (
    <div className="min-h-screen bg-cream-50 py-8 md:py-12">
      <Container>
        
        {/* ============================================================ */}
        {/* HEADER */}
        {/* ============================================================ */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-display text-brown-800 flex items-center gap-3">
                <ShoppingCart className="w-8 h-8 text-gold-500" />
                <span>Meu <span className="text-gold-500">Carrinho</span></span>
              </h1>
              <p className="text-brown-500 text-sm mt-1">
                {totalItems} {totalItems === 1 ? 'item' : 'itens'} no carrinho
              </p>
            </div>
            <Link to="/cardapio">
              <Button variant="outline" className="border-gold-300 text-brown-600 hover:bg-gold-50/50 group">
                <span className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Continuar Comprando
                </span>
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* GRID PRINCIPAL */}
        {/* ============================================================ */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* ============================================================ */}
          {/* LISTA DE ITENS */}
          {/* ============================================================ */}
          <motion.div 
            className="lg:col-span-2 space-y-4"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.produto_id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className="bg-white rounded-2xl shadow-lg shadow-brown-900/5 border border-cream-200/50 hover:border-gold-400/30 transition-all duration-300 group"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 gap-4">
                    {/* Informações do produto */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gold-50 flex items-center justify-center text-xl flex-shrink-0">
                          🍽️
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-display text-brown-800 truncate">
                            {item.name}
                          </h3>
                          <p className="text-sm text-brown-400">
                            {item.price.toLocaleString('pt-AO')} Kz / unidade
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Controles */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="flex items-center gap-1 bg-cream-50 rounded-xl border border-cream-200 p-1">
                        <button
                          onClick={() => handleUpdateQuantidade(item.produto_id, item.quantidade - 1, item.name)}
                          className="w-8 h-8 rounded-lg hover:bg-gold-50 hover:text-gold-600 transition-all duration-300 flex items-center justify-center text-brown-500"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium text-brown-800">
                          {item.quantidade}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantidade(item.produto_id, item.quantidade + 1, item.name)}
                          className="w-8 h-8 rounded-lg hover:bg-gold-50 hover:text-gold-600 transition-all duration-300 flex items-center justify-center text-brown-500"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <span className="font-bold text-gold-600 min-w-[100px] text-right">
                        {(item.price * item.quantidade).toLocaleString('pt-AO')} Kz
                      </span>

                      <button
                        onClick={() => handleRemoveItem(item.produto_id, item.name)}
                        className="w-9 h-9 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Ações rápidas */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-end"
            >
              <button
                onClick={handleClearCart}
                className="text-sm text-red-400 hover:text-red-500 transition-colors duration-300 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Esvaziar Carrinho
              </button>
            </motion.div>
          </motion.div>

          {/* ============================================================ */}
          {/* RESUMO */}
          {/* ============================================================ */}
          <motion.div
            variants={summaryVariants}
            initial="hidden"
            animate="visible"
            className="lg:sticky lg:top-24"
          >
            <Card variant="gold" className="shadow-2xl shadow-gold-500/10 border-2 border-gold-200/30 backdrop-blur-sm bg-white/95 overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300" />
              
              <div className="p-6">
                <h3 className="text-xl font-display text-brown-800 mb-4 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-gold-500" />
                  Resumo do Pedido
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-brown-600 text-sm">
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4 text-brown-400" />
                      Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'itens'})
                    </span>
                    <span className="font-medium">{total.toLocaleString('pt-AO')} Kz</span>
                  </div>
                  
                  <div className="flex justify-between text-brown-600 text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-brown-400" />
                      Taxa de serviço (10%)
                    </span>
                    <span className="font-medium">{taxaServico.toLocaleString('pt-AO')} Kz</span>
                  </div>
                  
                  <div className="border-t border-gold-200/50 pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold text-brown-800">
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-5 h-5 text-gold-500" />
                        Total
                      </span>
                      <span className="text-gold-600 text-xl">
                        {totalFinal.toLocaleString('pt-AO')} Kz
                      </span>
                    </div>
                    <p className="text-xs text-brown-400 text-right mt-1">
                      Taxa de serviço incluída
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-6">
                  <Link to="/checkout">
                    <Button variant="gold" fullWidth className="py-3.5 text-lg font-semibold group">
                      <span className="flex items-center justify-center gap-2">
                        Finalizar Pedido
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </Button>
                  </Link>
                  
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={handleClearCart}
                    className="border-red-200 text-red-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Limpar Carrinho
                    </span>
                  </Button>
                </div>

                {/* Badges de confiança */}
                <div className="mt-4 pt-4 border-t border-cream-200/50">
                  <div className="flex items-center justify-center gap-4 text-xs text-brown-400">
                    <span className="flex items-center gap-1">
                      <span className="text-emerald-500">✓</span>
                      Pagamento seguro
                    </span>
                    <span className="w-px h-3 bg-brown-200" />
                    <span className="flex items-center gap-1">
                      <span className="text-emerald-500">✓</span>
                      Entrega rápida
                    </span>
                    <span className="w-px h-3 bg-brown-200" />
                    <span className="flex items-center gap-1">
                      <span className="text-emerald-500">✓</span>
                      Suporte 24/7
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </Container>
    </div>
  )
}