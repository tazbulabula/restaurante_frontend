// src/pages/Produto/Detalhe.tsx

import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Sparkles,
  ChefHat,
  Clock,
  Star,
  Info,
  CheckCircle,
  XCircle,
  Utensils,
  Coffee,
  Wine,
  Cake,
  Pizza,
  Salad,
  Beef,
  Fish,
  Egg,
  Leaf,
  Heart,
  Share2
} from 'lucide-react'
import { Container, Card, Button, Badge, Spinner, showToast } from '@/components/ui'
import { produtosApi } from '@/api/produtos'
import { useCartStore } from '@/store/cartStore'
import type { Produto } from '@/types/produto.types'

// ============================================================
// ÍCONES POR CATEGORIA
// ============================================================
const categoryIcons: Record<string, React.ReactNode> = {
  'Entradas': <Utensils className="w-5 h-5" />,
  'Pratos Principais': <Beef className="w-5 h-5" />,
  'Massas': <Pizza className="w-5 h-5" />,
  'Sobremesas': <Cake className="w-5 h-5" />,
  'Bebidas': <Coffee className="w-5 h-5" />,
  'Saladas': <Salad className="w-5 h-5" />,
  'Peixes': <Fish className="w-5 h-5" />,
  'Vegano': <Leaf className="w-5 h-5" />,
  'Vinhos': <Wine className="w-5 h-5" />,
}

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

const floatAnimation = {
  y: [0, -8, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
}

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.15, 1]
    }
  }
}

const contentVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      delay: 0.1,
      ease: [0.25, 0.1, 0.15, 1]
    }
  }
}

const quantityVariants = {
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  }
}

const badgeVariants = {
  initial: { scale: 0.8, opacity: 0 },
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

export function DetalheProduto() {
  const { publicId } = useParams<{ publicId: string }>()
  const navigate = useNavigate()
  const [produto, setProduto] = useState<Produto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantidade, setQuantidade] = useState(1)
  const [isMounted, setIsMounted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  
  const { addItem } = useCartStore()
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
    if (publicId) {
      carregarProduto(publicId)
    }
  }, [publicId])

  const carregarProduto = async (id: string) => {
    setIsLoading(true)
    try {
      const data = await produtosApi.buscarPorPublicId(id)
      setProduto(data)
    } catch (error) {
      console.error('Erro ao carregar produto:', error)
      showToast.error('Produto não encontrado')
      navigate('/cardapio')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!produto) return
    
    addItem(
      { id: produto.id, name: produto.name, price: produto.price },
      quantidade
    )
    
    showToast.success(
      <div className="flex items-center gap-2">
        <ShoppingCart className="w-4 h-4" />
        <span>{quantidade}x {produto.name} adicionado ao carrinho! 🎉</span>
      </div>
    )
  }

  const handleQuantityChange = (delta: number) => {
    setQuantidade(prev => Math.max(1, prev + delta))
  }

  const getCategoryIcon = (category: string) => {
    return categoryIcons[category] || <Utensils className="w-5 h-5" />
  }

  // ============================================================
  // LOADING
  // ============================================================
  if (isLoading) {
    return (
      <Container className="py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-gold-400" />
          </div>
        </div>
        <p className="text-brown-500 mt-4">Carregando detalhes do prato...</p>
      </Container>
    )
  }

  if (!produto) {
    return (
      <Container className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-2xl font-display text-brown-800 mb-2">
            Produto não encontrado
          </h2>
          <p className="text-brown-500 mb-6">
            O prato que você procura não está disponível no momento.
          </p>
          <Link to="/cardapio">
            <Button variant="gold" className="group">
              <span className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Voltar ao Cardápio
              </span>
            </Button>
          </Link>
        </motion.div>
      </Container>
    )
  }

  const isAvailable = produto.is_available !== false
  const categoryIcon = getCategoryIcon(produto.category)

  // ============================================================
  // DETALHES DO PRODUTO
  // ============================================================
  return (
    <div className="min-h-screen bg-cream-50 py-8 md:py-12">
      <Container>
        
        {/* ============================================================ */}
        {/* BOTÃO VOLTAR */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <Link to="/cardapio" className="inline-flex items-center gap-2 text-brown-500 hover:text-gold-600 transition-colors duration-300 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Voltar ao Cardápio</span>
          </Link>
        </motion.div>

        {/* ============================================================ */}
        {/* GRID PRINCIPAL */}
        {/* ============================================================ */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          
          {/* ============================================================ */}
          {/* IMAGEM */}
          {/* ============================================================ */}
          <motion.div
            ref={imageRef}
            variants={imageVariants}
            initial="hidden"
            animate={isMounted ? "visible" : "hidden"}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gold-100 to-brown-100 shadow-2xl shadow-brown-900/10 aspect-square">
              {/* Conteúdo da imagem */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl opacity-80">🍽️</span>
              </div>
              
              {/* Overlay de gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-brown-900/20 to-transparent" />
              
              {/* Badge de categoria */}
              <div className="absolute top-4 left-4">
                <motion.span
                  variants={badgeVariants}
                  initial="initial"
                  animate="animate"
                  className="px-3 py-1.5 bg-brown-900/80 backdrop-blur-sm text-cream-50 text-xs font-medium rounded-full flex items-center gap-1.5"
                >
                  {categoryIcon}
                  {produto.category}
                </motion.span>
              </div>

              {/* Badge de disponibilidade */}
              <div className="absolute top-4 right-4">
                <motion.span
                  variants={badgeVariants}
                  initial="initial"
                  animate="animate"
                  className={`px-3 py-1.5 text-xs font-medium rounded-full flex items-center gap-1.5 backdrop-blur-sm ${
                    isAvailable
                      ? 'bg-emerald-500/90 text-white'
                      : 'bg-red-500/90 text-white'
                  }`}
                >
                  {isAvailable ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      Disponível
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      Indisponível
                    </>
                  )}
                </motion.span>
              </div>

              {/* Ícone de destaque */}
              {produto.destaque && (
                <div className="absolute bottom-4 left-4">
                  <motion.span
                    variants={badgeVariants}
                    initial="initial"
                    animate="animate"
                    className="px-3 py-1.5 bg-gold-500 text-brown-900 text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg shadow-gold-500/30"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Destaque
                  </motion.span>
                </div>
              )}
            </div>

            {/* Orbes decorativas */}
            <motion.div
              animate={floatAnimation}
              className="absolute -top-4 -right-4 w-20 h-20 bg-gold-500/10 rounded-full blur-2xl"
            />
            <motion.div
              animate={{
                y: [0, 10, 0],
                transition: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }
              }}
              className="absolute -bottom-4 -left-4 w-16 h-16 bg-amber-500/10 rounded-full blur-2xl"
            />
          </motion.div>

          {/* ============================================================ */}
          {/* INFORMAÇÕES DO PRODUTO */}
          {/* ============================================================ */}
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate={isMounted ? "visible" : "hidden"}
            className="flex flex-col"
          >
            {/* Cabeçalho */}
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-3 py-1 bg-gold-50 text-gold-600 text-xs font-medium rounded-full border border-gold-200">
                  {produto.category}
                </span>
                {produto.subcategory && (
                  <span className="px-3 py-1 bg-cream-100 text-brown-500 text-xs font-medium rounded-full">
                    {produto.subcategory}
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display text-brown-800">
                {produto.name}
              </h1>
            </div>

            {/* Descrição */}
            {produto.description && (
              <div className="mb-6">
                <p className="text-brown-600 text-lg leading-relaxed">
                  {produto.description}
                </p>
              </div>
            )}

            {/* Detalhes adicionais */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-cream-50 rounded-xl p-3 border border-cream-200">
                <p className="text-xs text-brown-400">Categoria</p>
                <p className="text-sm font-medium text-brown-700">{produto.category}</p>
              </div>
              {produto.subcategory && (
                <div className="bg-cream-50 rounded-xl p-3 border border-cream-200">
                  <p className="text-xs text-brown-400">Subcategoria</p>
                  <p className="text-sm font-medium text-brown-700">{produto.subcategory}</p>
                </div>
              )}
              <div className="bg-cream-50 rounded-xl p-3 border border-cream-200">
                <p className="text-xs text-brown-400">Status</p>
                <p className={`text-sm font-medium ${isAvailable ? 'text-emerald-600' : 'text-red-500'}`}>
                  {isAvailable ? 'Disponível' : 'Indisponível'}
                </p>
              </div>
              <div className="bg-cream-50 rounded-xl p-3 border border-cream-200">
                <p className="text-xs text-brown-400">Código</p>
                <p className="text-sm font-medium text-brown-700">#{produto.id}</p>
              </div>
            </div>

            {/* Preço */}
            <div className="mb-6">
              <p className="text-sm text-brown-400">Preço</p>
              <p className="text-4xl font-bold text-gold-600">
                {produto.price.toLocaleString('pt-AO')} Kz
              </p>
            </div>

            {/* Quantidade e Ações */}
            <div className="space-y-4 mt-auto">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-brown-700">Quantidade:</span>
                <div className="flex items-center gap-1 bg-cream-50 rounded-xl border border-cream-200 p-1">
                  <motion.button
                    variants={quantityVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={!isAvailable}
                    className="w-9 h-9 rounded-lg hover:bg-gold-50 hover:text-gold-600 transition-all duration-300 flex items-center justify-center text-brown-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <span className="w-10 text-center text-lg font-medium text-brown-800">
                    {quantidade}
                  </span>
                  <motion.button
                    variants={quantityVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => handleQuantityChange(1)}
                    disabled={!isAvailable}
                    className="w-9 h-9 rounded-lg hover:bg-gold-50 hover:text-gold-600 transition-all duration-300 flex items-center justify-center text-brown-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    variant="gold"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={!isAvailable}
                    fullWidth
                    className="py-3.5 text-lg font-semibold group"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      {isAvailable ? 'Adicionar ao Carrinho' : 'Indisponível'}
                      <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </motion.div>

                <Link to="/cardapio" className="sm:w-auto">
                  <Button variant="outline" size="lg" fullWidth className="border-gold-300 text-brown-600 hover:bg-gold-50/50">
                    <span className="flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Voltar
                    </span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Badges de confiança */}
            <div className="mt-6 pt-4 border-t border-cream-200/50">
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-brown-400">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  Ingredientes frescos
                </span>
                <span className="w-px h-3 bg-brown-200" />
                <span className="flex items-center gap-1">
                  <ChefHat className="w-3.5 h-3.5 text-gold-500" />
                  Chef premiado
                </span>
                <span className="w-px h-3 bg-brown-200" />
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-red-400" />
                  Feito com amor
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  )
}