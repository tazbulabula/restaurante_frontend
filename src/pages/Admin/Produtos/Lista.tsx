// src/pages/Admin/Produtos/Lista.tsx

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Tag, 
  DollarSign,
  Sparkles,
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
  LayoutGrid,
  Eye,
  EyeOff,
  RefreshCw,
  Filter
} from 'lucide-react'
import { Container, Card, Button, Badge, Input, Spinner, showToast, ConfirmModal } from '@/components/ui'
import { produtosApi } from '@/api/produtos'
import type { Produto } from '@/types/produto.types'

// ============================================================
// CONFIGURAÇÕES DE CATEGORIA
// ============================================================
const categoryIcons: Record<string, React.ReactNode> = {
  'principal': <Beef className="w-3.5 h-3.5" />,
  'entrada': <Utensils className="w-3.5 h-3.5" />,
  'sobremesa': <Cake className="w-3.5 h-3.5" />,
  'bebida': <Coffee className="w-3.5 h-3.5" />,
  'refrigerante': <Coffee className="w-3.5 h-3.5" />,
  'sucos': <Leaf className="w-3.5 h-3.5" />,
  'cerveja': <Wine className="w-3.5 h-3.5" />,
  'cafe': <Coffee className="w-3.5 h-3.5" />,
  'petisco': <Utensils className="w-3.5 h-3.5" />,
  'porcoes': <Utensils className="w-3.5 h-3.5" />,
  'doces': <Cake className="w-3.5 h-3.5" />,
  'salgados': <Utensils className="w-3.5 h-3.5" />,
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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.15, 1]
    }
  },
  hover: {
    y: -2,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
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

const badgeVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
      delay: 0.1
    }
  }
}

export function AdminProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('')
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; publicId: string; name: string }>({
    isOpen: false,
    publicId: '',
    name: '',
  })

  useEffect(() => {
    setIsMounted(true)
    carregarProdutos()
  }, [])

  const carregarProdutos = async () => {
    setIsLoading(true)
    try {
      const data = await produtosApi.listar()
      setProdutos(data)
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
      showToast.error('Erro ao carregar produtos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    const { publicId, name } = deleteModal
    try {
      await produtosApi.deletar(publicId)
      showToast.success(
        <div className="flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          <span>"{name}" removido com sucesso</span>
        </div>
      )
      setDeleteModal({ isOpen: false, publicId: '', name: '' })
      await carregarProdutos()
    } catch (error) {
      console.error('Erro ao deletar produto:', error)
      showToast.error('Erro ao deletar produto')
    }
  }

  const handleToggleDisponibilidade = async (produto: Produto) => {
    try {
      const updated = await produtosApi.alternarDisponibilidade(
        produto.public_id,
        !produto.is_available
      )
      setProdutos(prev =>
        prev.map(p => p.public_id === updated.public_id ? updated : p)
      )
      showToast.success(
        <div className="flex items-center gap-2">
          {updated.is_available ? (
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          ) : (
            <XCircle className="w-4 h-4 text-red-500" />
          )}
          <span>"{updated.name}" {updated.is_available ? 'disponível' : 'indisponível'}</span>
        </div>
      )
    } catch (error) {
      console.error('Erro ao alterar disponibilidade:', error)
      showToast.error('Erro ao alterar disponibilidade')
    }
  }

  const getCategoryIcon = (category: string) => {
    return categoryIcons[category] || <LayoutGrid className="w-3.5 h-3.5" />
  }

  const filtered = produtos.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = filterCategory === '' || p.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(produtos.map(p => p.category))]

  // ============================================================
  // LOADING
  // ============================================================
  if (isLoading) {
    return (
      <Container className="py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <Spinner size="lg" color="gold" />
        </div>
        <p className="text-brown-500 mt-4">Carregando produtos...</p>
      </Container>
    )
  }

  // ============================================================
  // SEM PRODUTOS
  // ============================================================
  if (produtos.length === 0) {
    return (
      <Container className="py-16 md:py-24">
        <motion.div
          variants={emptyVariants}
          initial="hidden"
          animate={isMounted ? "visible" : "hidden"}
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
              🍽️
            </motion.div>
            
            <h2 className="text-3xl font-display text-brown-800 mb-3">
              Nenhum <span className="text-gold-500">produto</span> cadastrado
            </h2>
            <p className="text-brown-500 mb-8 max-w-sm mx-auto">
              Comece adicionando produtos ao cardápio do restaurante.
            </p>
            <Link to="/admin/produtos/criar">
              <Button variant="gold" className="group text-lg px-8 py-3">
                <span className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Novo Produto
                </span>
              </Button>
            </Link>
          </Card>
        </motion.div>
      </Container>
    )
  }

  // ============================================================
  // LISTA DE PRODUTOS
  // ============================================================
  return (
    <div className="min-h-screen bg-cream-50 py-8 md:py-12">
      <Container>
        
        {/* ============================================================ */}
        {/* HEADER */}
        {/* ============================================================ */}
        <motion.div
          initial="hidden"
          animate={isMounted ? "visible" : "hidden"}
          variants={fadeUp}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/25">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-display text-brown-800">
                    Gerenciar <span className="text-gold-500">Produtos</span>
                  </h1>
                  <p className="text-brown-500 text-sm">
                    {produtos.length} {produtos.length === 1 ? 'produto' : 'produtos'} no cardápio
                  </p>
                </div>
              </div>
            </div>
            <Link to="/admin/produtos/criar">
              <Button variant="gold" className="group">
                <span className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Novo Produto
                </span>
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* FILTROS E BUSCA */}
        {/* ============================================================ */}
        <motion.div
          initial="hidden"
          animate={isMounted ? "visible" : "hidden"}
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brown-400" />
            <input
              type="text"
              placeholder="Buscar produto por nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-cream-200 rounded-xl text-brown-800 placeholder-brown-400 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition-all duration-300"
            />
          </div>

          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-4 pr-10 py-2.5 bg-white border border-cream-200 rounded-xl text-brown-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition-all duration-300 appearance-none min-w-[160px]"
            >
              <option value="">Todas categorias</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400 pointer-events-none" />
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* LISTA */}
        {/* ============================================================ */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isMounted ? "visible" : "hidden"}
          className="space-y-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 text-brown-500"
              >
                <Package className="w-12 h-12 mx-auto text-brown-300 mb-3" />
                <p>
                  {search || filterCategory 
                    ? 'Nenhum produto encontrado com os filtros aplicados' 
                    : 'Nenhum produto cadastrado'}
                </p>
              </motion.div>
            ) : (
              filtered.map((produto) => {
                const isAvailable = produto.is_available !== false
                const categoryIcon = getCategoryIcon(produto.category)

                return (
                  <motion.div
                    key={produto.id}
                    variants={cardVariants}
                    whileHover="hover"
                    layout
                  >
                    <Card 
                      variant="bordered" 
                      className={`flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-4 md:p-5 bg-white shadow-sm shadow-brown-900/5 border ${isAvailable ? 'border-cream-200/50 hover:border-gold-400/30' : 'border-red-200/50 bg-red-50/10'} transition-all duration-300`}
                    >
                      {/* Informações do produto */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-display text-lg text-brown-800">
                            {produto.name}
                          </h3>
                          {produto.destaque && (
                            <span className="px-2 py-0.5 bg-gold-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              Destaque
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="flex items-center gap-1 text-sm font-medium text-gold-600">
                            <DollarSign className="w-3.5 h-3.5" />
                            {produto.price.toLocaleString('pt-AO')} Kz
                          </span>
                          
                          <motion.span
                            variants={badgeVariants}
                            initial="initial"
                            animate="animate"
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isAvailable
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {isAvailable ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            {isAvailable ? 'Disponível' : 'Indisponível'}
                          </motion.span>

                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            {categoryIcon}
                            {produto.category}
                          </span>

                          {produto.subcategory && (
                            <span className="text-xs text-brown-400">
                              {produto.subcategory}
                            </span>
                          )}
                        </div>

                        {produto.description && (
                          <p className="text-sm text-brown-500 mt-1 line-clamp-1">
                            {produto.description}
                          </p>
                        )}
                      </div>

                      {/* Ações */}
                      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                        <Button
                          variant={isAvailable ? 'outline' : 'outline'}
                          size="sm"
                          onClick={() => handleToggleDisponibilidade(produto)}
                          className={isAvailable ? 'border-emerald-300 text-emerald-600 hover:bg-emerald-50' : 'border-red-300 text-red-600 hover:bg-red-50'}
                        >
                          <span className="flex items-center gap-1.5">
                            {isAvailable ? (
                              <>
                                <EyeOff className="w-3.5 h-3.5" />
                                Desativar
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5" />
                                Ativar
                              </>
                            )}
                          </span>
                        </Button>

                        <Link to={`/admin/produtos/editar/${produto.public_id}`}>
                          <Button variant="outline" size="sm" className="border-gold-300 text-brown-600 hover:bg-gold-50/50">
                            <span className="flex items-center gap-1.5">
                              <Edit className="w-3.5 h-3.5" />
                              Editar
                            </span>
                          </Button>
                        </Link>

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setDeleteModal({
                            isOpen: true,
                            publicId: produto.public_id,
                            name: produto.name,
                          })}
                        >
                          <span className="flex items-center gap-1.5">
                            <Trash2 className="w-3.5 h-3.5" />
                            Remover
                          </span>
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
        </motion.div>

        {/* ============================================================ */}
        {/* FOOTER DA LISTA */}
        {/* ============================================================ */}
        {filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isMounted ? { opacity: 1 } : {}}
            className="mt-4 text-center text-sm text-brown-400"
          >
            Mostrando {filtered.length} de {produtos.length} produtos
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* DELETE MODAL */}
        {/* ============================================================ */}
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, publicId: '', name: '' })}
          onConfirm={handleDeleteConfirm}
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja excluir "${deleteModal.name}"? Esta ação não pode ser desfeita.`}
          confirmText="Sim, Excluir"
          cancelText="Cancelar"
          variant="danger"
        />
      </Container>
    </div>
  )
}