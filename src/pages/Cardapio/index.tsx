// src/pages/Cardapio/index.tsx

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Plus, 
  Minus, 
  ShoppingBag,
  Eye,
  Sparkles,
  ChefHat,
  Clock,
  Star,
  X
} from 'lucide-react'
import { Container, Card, Button, Badge, Input, Spinner } from '@/components/ui'
import { produtosApi } from '@/api/produtos'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { showToast } from '@/components/ui'
import { CardapioSkeleton } from '@/components/Skeletons/CardapioSkeleton'
import type { Produto } from '@/types/produto.types'

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
      delayChildren: 0.2
    }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.15, 1]
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.06,
      duration: 0.5,
      ease: [0.25, 0.1, 0.15, 1]
    }
  }),
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 }
  }
}

export function Cardapio() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null)
  
  const { addItem } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-50px" })

  useEffect(() => {
    carregarProdutos()
  }, [])

  const carregarProdutos = async () => {
    setIsLoading(true)
    try {
      const data = await produtosApi.listar({ disponivel: true })
      setProdutos(data)
      // Inicializar quantidades
      const initialQty: Record<string, number> = {}
      data.forEach(p => { initialQty[p.id] = 1 })
      setQuantities(initialQty)
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
      showToast.error('Erro ao carregar cardápio')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuantityChange = (produtoId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [produtoId]: Math.max(1, (prev[produtoId] || 1) + delta)
    }))
  }

  const handleAddToCart = (produto: Produto) => {
    const quantity = quantities[produto.id] || 1
    
    for (let i = 0; i < quantity; i++) {
      addItem({ 
        id: produto.id, 
        name: produto.name, 
        price: produto.price 
      })
    }
    
    if (!isAuthenticated) {
      showToast.warning(
        `🔒 ${quantity}x "${produto.name}" adicionado! Faça login para finalizar a compra.`, 
        5000
      )
    } else {
      showToast.success(`${quantity}x ${produto.name} adicionado ao carrinho!`)
    }
  }

  const handleQuickAdd = (produto: Produto) => {
    addItem({ 
      id: produto.id, 
      name: produto.name, 
      price: produto.price 
    })
    
    if (!isAuthenticated) {
      showToast.warning(`🔒 "${produto.name}" adicionado! Faça login para finalizar a compra.`, 5000)
    } else {
      showToast.success(`${produto.name} adicionado ao carrinho!`)
    }
  }

  const filtered = produtos.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === '' || p.category === category)
  )

  const categorias = [...new Set(produtos.map(p => p.category))]

  if (isLoading) {
    return (
      <Container className="py-12">
        <CardapioSkeleton />
      </Container>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50">
      
      {/* ============================================================ */}
      {/* HEADER COM ANIMAÇÃO */}
      {/* ============================================================ */}
      <motion.div
        ref={headerRef}
        initial="hidden"
        animate={isHeaderInView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="relative bg-gradient-to-r from-brown-900 via-brown-800 to-gold-800/80 text-cream-50 py-12 md:py-16 overflow-hidden"
      >
        {/* Fundo decorativo */}
        <div className="absolute inset-0 bg-luxury-pattern opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brown-900/20" />
        
        <Container className="relative z-10">
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
            <ChefHat className="w-8 h-8 text-gold-400" />
            <span className="text-gold-400 text-sm font-semibold uppercase tracking-wider">
              Nossos Sabores
            </span>
          </motion.div>
          
          <motion.h1 
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold"
          >
            Cardápio <span className="text-gold-400">Aurora</span>
          </motion.h1>
          
          <motion.p 
            variants={fadeUp}
            className="text-cream-200/80 text-lg max-w-2xl mt-3"
          >
            Descubra uma seleção de pratos preparados com ingredientes frescos 
            e muita paixão pela gastronomia.
          </motion.p>

          {/* Badges decorativos */}
          <motion.div 
            variants={fadeUp}
            className="flex flex-wrap gap-3 mt-6"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cream-50/10 backdrop-blur-sm border border-cream-50/10 rounded-full text-xs text-cream-200/80">
              <Clock className="w-3.5 h-3.5" />
              Preparo fresco
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cream-50/10 backdrop-blur-sm border border-cream-50/10 rounded-full text-xs text-cream-200/80">
              <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
              Ingredientes selecionados
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cream-50/10 backdrop-blur-sm border border-cream-50/10 rounded-full text-xs text-cream-200/80">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              Chefs experientes
            </span>
          </motion.div>
        </Container>
      </motion.div>

      {/* ============================================================ */}
      {/* FILTROS E BUSCA */}
      {/* ============================================================ */}
      <div className="sticky top-16 z-20 bg-cream-50/95 backdrop-blur-md border-b border-cream-200/50 py-4">
        <Container>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Busca */}
            <div className="relative w-full md:w-72">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400" />
                <input
                  type="text"
                  placeholder="Buscar prato..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-cream-200 rounded-xl text-brown-800 placeholder-brown-400 focus:outline-none focus:border-gold-400 focus:shadow-lg focus:shadow-gold-500/5 transition-all duration-300"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Categorias - Scroll horizontal */}
            <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setCategory('')}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300
                  ${category === '' 
                    ? 'bg-gold-500 text-brown-900 shadow-lg shadow-gold-500/25' 
                    : 'bg-white text-brown-600 hover:bg-gold-50 hover:text-gold-600 border border-cream-200'
                  }
                `}
              >
                Todos
              </button>
              {categorias.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300
                    ${category === cat 
                      ? 'bg-gold-500 text-brown-900 shadow-lg shadow-gold-500/25' 
                      : 'bg-white text-brown-600 hover:bg-gold-50 hover:text-gold-600 border border-cream-200'
                    }
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* ============================================================ */}
      {/* LISTA DE PRODUTOS */}
      {/* ============================================================ */}
      <Container className="py-8 md:py-12">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-2xl font-display text-brown-800 mb-2">
                Nenhum prato encontrado
              </h3>
              <p className="text-brown-500">
                Tente ajustar sua busca ou filtros
              </p>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {filtered.map((produto, index) => (
                <motion.div
                  key={produto.id}
                  custom={index}
                  variants={cardVariants}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-brown-900/5 border border-cream-200/50 hover:border-gold-400/30 hover:shadow-xl hover:shadow-gold-500/10 transition-all duration-500 h-full flex flex-col">
                    
                    {/* Imagem (placeholder) */}
                    <div className="relative h-48 bg-gradient-to-br from-gold-100 to-brown-100 flex items-center justify-center overflow-hidden">
                      <span className="text-6xl opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                        {produto.category === 'Entradas' ? '🥗' :
                         produto.category === 'Pratos Principais' ? '🍖' :
                         produto.category === 'Massas' ? '🍝' :
                         produto.category === 'Sobremesas' ? '🍰' :
                         produto.category === 'Bebidas' ? '🍷' : '🍽️'}
                      </span>
                      {/* Badge de categoria na imagem */}
                      <span className="absolute top-3 left-3 px-3 py-1 bg-brown-900/80 backdrop-blur-sm text-cream-50 text-xs font-medium rounded-full">
                        {produto.category}
                      </span>
                      {/* Badge de destaque (se disponível) */}
                      {produto.destaque && (
                        <span className="absolute top-3 right-3 px-3 py-1 bg-gold-500 text-brown-900 text-xs font-bold rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Destaque
                        </span>
                      )}
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 p-5 flex flex-col">
                      <div className="flex-1">
                        <h3 className="text-lg font-display text-brown-800 mb-1 group-hover:text-gold-600 transition-colors">
                          {produto.name}
                        </h3>
                        {produto.description && (
                          <p className="text-brown-500 text-sm line-clamp-2">
                            {produto.description}
                          </p>
                        )}
                      </div>

                      {/* Preço e Ações */}
                      <div className="mt-4 pt-4 border-t border-cream-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm text-brown-400">Preço</span>
                            <p className="text-xl font-bold text-gold-600">
                              {produto.price.toLocaleString('pt-AO', {
                                style: 'currency',
                                currency: 'AOA',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                              })}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {/* Botão Detalhes */}
                            <Link to={`/produto/${produto.public_id}`}>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-xl text-brown-400 hover:text-gold-600 hover:bg-gold-50 transition-all duration-300"
                                aria-label="Ver detalhes"
                              >
                                <Eye className="w-5 h-5" />
                              </motion.button>
                            </Link>

                            {/* Botão Adicionar - com animação */}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleQuickAdd(produto)}
                              className="p-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-brown-900 font-medium transition-all duration-300 shadow-gold flex items-center gap-1.5"
                            >
                              <ShoppingBag className="w-4 h-4" />
                              <span className="text-sm font-semibold">Adicionar</span>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contador de resultados */}
        {filtered.length > 0 && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-brown-400 text-sm mt-8"
          >
            Mostrando {filtered.length} {filtered.length === 1 ? 'prato' : 'pratos'}
          </motion.p>
        )}
      </Container>
    </div>
  )
}