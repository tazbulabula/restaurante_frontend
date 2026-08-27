// src/pages/Pedidos/MeusPedidos.tsx

import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, 
  Clock, 
  CreditCard, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  ChevronRight,
  Receipt,
  Sparkles,
  Calendar,
  MapPin,
  Eye,
  ArrowRight,
  Utensils,
  ShoppingBag,
  DollarSign,
  Phone
} from 'lucide-react'
import { Container, Card, Badge, Button, Spinner, showToast, Skeleton } from '@/components/ui'
import { pedidosApi } from '@/api/pedidos'
import type { Pedido } from '@/types/pedido.types'

// ============================================================
// CONFIGURAÇÕES DE STATUS
// ============================================================
const statusConfig: Record<string, {
  color: 'success' | 'warning' | 'danger' | 'info' | 'default'
  label: string
  icon: React.ReactNode
  bg: string
  text: string
  border: string
}> = {
  aguardando_pagamento: {
    color: 'warning',
    label: '⏳ Aguardando Pagamento',
    icon: <Clock className="w-4 h-4" />,
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200'
  },
  aguardando_confirmacao_manual: {
    color: 'warning',
    label: '⏳ Aguardando Confirmação',
    icon: <AlertCircle className="w-4 h-4" />,
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200'
  },
  pago: {
    color: 'success',
    label: '✅ Pago',
    icon: <CheckCircle className="w-4 h-4" />,
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200'
  },
  preparando: {
    color: 'info',
    label: '👨‍🍳 Preparando',
    icon: <Utensils className="w-4 h-4" />,
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200'
  },
  pronto: {
    color: 'success',
    label: '✅ Pronto',
    icon: <CheckCircle className="w-4 h-4" />,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200'
  },
  entregue: {
    color: 'success',
    label: '📦 Entregue',
    icon: <Package className="w-4 h-4" />,
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200'
  },
  cancelado: {
    color: 'danger',
    label: '❌ Cancelado',
    icon: <XCircle className="w-4 h-4" />,
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200'
  },
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
      staggerChildren: 0.08,
      delayChildren: 0.15
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
    y: -4,
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

const statusBadgeVariants = {
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

export function MeusPedidos() {
  const navigate = useNavigate()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    carregarPedidos()
  }, [])

  const carregarPedidos = async () => {
    setIsLoading(true)
    try {
      const data = await pedidosApi.meusPedidos()
      setPedidos(data)
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
      showToast.error('Erro ao carregar pedidos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleIrParaPagamento = (pedido: Pedido) => {
    navigate('/pagamento', {
      state: { pedidoPublicId: pedido.public_id }
    })
  }

  const handleVerDetalhes = (pedido: Pedido) => {
    setSelectedPedido(pedido)
    setIsModalOpen(true)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('pt-AO', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // ============================================================
  // LOADING
  // ============================================================
  if (isLoading) {
    return (
      <Container className="py-12">
        <div className="mb-8">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg shadow-brown-900/5 border border-cream-200/50">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-9 w-24 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    )
  }

  // ============================================================
  // SEM PEDIDOS
  // ============================================================
  if (pedidos.length === 0) {
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
              📋
            </motion.div>
            
            <h2 className="text-3xl font-display text-brown-800 mb-3">
              Nenhum <span className="text-gold-500">pedido</span> ainda
            </h2>
            <p className="text-brown-500 mb-8 max-w-sm mx-auto">
              Você ainda não fez nenhum pedido. Que tal explorar nosso cardápio?
            </p>
            <Link to="/cardapio">
              <Button variant="gold" className="group text-lg px-8 py-3">
                <span className="flex items-center gap-2">
                  Ver Cardápio
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
            
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-brown-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                Peça online
              </span>
              <span className="w-px h-3 bg-brown-200" />
              <span>🍽️ Pratos exclusivos</span>
              <span className="w-px h-3 bg-brown-200" />
              <span>⭐ 4.9/5</span>
            </div>
          </Card>
        </motion.div>
      </Container>
    )
  }

  // ============================================================
  // LISTA DE PEDIDOS
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/25">
                  <Receipt className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-display text-brown-800">
                    Meus <span className="text-gold-500">Pedidos</span>
                  </h1>
                  <p className="text-brown-500 text-sm">
                    {pedidos.length} {pedidos.length === 1 ? 'pedido' : 'pedidos'} realizados
                  </p>
                </div>
              </div>
            </div>
            <Link to="/cardapio">
              <Button variant="outline" className="border-gold-300 text-brown-600 hover:bg-gold-50/50 group">
                <span className="flex items-center gap-2">
                  <Utensils className="w-4 h-4" />
                  Fazer Novo Pedido
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* LISTA */}
        {/* ============================================================ */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {pedidos.map((pedido, index) => {
            const status = statusConfig[pedido.status] || statusConfig.default
            const isAguardandoPagamento = pedido.status === 'aguardando_pagamento'

            return (
              <motion.div
                key={pedido.id}
                variants={cardVariants}
                whileHover="hover"
                className="group"
              >
                <Card 
                  variant="hover" 
                  className="bg-white shadow-lg shadow-brown-900/5 border border-cream-200/50 hover:border-gold-400/30 transition-all duration-300 overflow-hidden"
                >
                  <div className={`h-1 w-full bg-gradient-to-r ${isAguardandoPagamento ? 'from-amber-400 via-gold-400 to-amber-400' : 'from-gold-300 via-gold-500 to-gold-300'}`} />
                  
                  <div className="p-5 md:p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      {/* Informações do pedido */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-display text-lg text-brown-800">
                            Pedido #{pedido.id}
                          </h3>
                          <span className="text-xs text-brown-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(pedido.created_at)}
                          </span>
                          <span className="text-xs text-brown-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(pedido.created_at)}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-brown-500">
                          <span className="flex items-center gap-1">
                            <ShoppingBag className="w-3.5 h-3.5" />
                            {pedido.itens?.length || 0} itens
                          </span>
                          <span className="w-px h-3 bg-brown-200" />
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            Mesa {pedido.mesa_numero}
                          </span>
                          {pedido.cliente_telefone && (
                            <>
                              <span className="w-px h-3 bg-brown-200" />
                              <span className="flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5" />
                                {pedido.cliente_telefone}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex items-center gap-3 flex-wrap w-full md:w-auto">
                        <span className="font-bold text-gold-600 text-lg whitespace-nowrap">
                          {pedido.total.toLocaleString('pt-AO')} Kz
                        </span>

                        <motion.div
                          variants={statusBadgeVariants}
                          initial="initial"
                          animate="animate"
                          className={`px-3 py-1.5 rounded-full text-xs font-medium ${status.bg} ${status.text} border ${status.border} flex items-center gap-1.5 whitespace-nowrap`}
                        >
                          {status.icon}
                          {status.label}
                        </motion.div>

                        {isAguardandoPagamento && (
                          <Button
                            variant="gold"
                            size="sm"
                            onClick={() => handleIrParaPagamento(pedido)}
                            className="whitespace-nowrap group/btn"
                          >
                            <span className="flex items-center gap-1.5">
                              <CreditCard className="w-3.5 h-3.5" />
                              Pagar
                              <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                            </span>
                          </Button>
                        )}

                        <button
                          onClick={() => handleVerDetalhes(pedido)}
                          className="p-2 rounded-xl text-brown-400 hover:text-gold-600 hover:bg-gold-50 transition-all duration-300"
                          aria-label="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* ============================================================ */}
        {/* MODAL DE DETALHES */}
        {/* ============================================================ */}
        <AnimatePresence>
          {isModalOpen && selectedPedido && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30
                }}
                className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-display text-brown-800">
                      Pedido #{selectedPedido.id}
                    </h3>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 rounded-xl hover:bg-cream-50 transition-colors"
                    >
                      <XCircle className="w-5 h-5 text-brown-400" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-brown-500">
                      <Calendar className="w-4 h-4" />
                      {formatDate(selectedPedido.created_at)} às {formatTime(selectedPedido.created_at)}
                    </div>

                    <div className="border-t border-cream-100 pt-4">
                      <h4 className="font-medium text-brown-700 mb-2">Itens</h4>
                      <div className="space-y-2">
                        {selectedPedido.itens?.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-brown-600">
                              {item.quantidade}x {item.produto_nome || `Produto #${item.produto_id}`}
                            </span>
                            <span className="font-medium text-brown-800">
                              {(item.preco_unitario * item.quantidade).toLocaleString('pt-AO')} Kz
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-cream-100 pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-brown-500">Subtotal</span>
                        <span className="text-brown-600">
                          {selectedPedido.total.toLocaleString('pt-AO')} Kz
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-brown-500">Taxa de serviço (10%)</span>
                        <span className="text-brown-600">
                          {(selectedPedido.total * 0.1).toLocaleString('pt-AO')} Kz
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-cream-100">
                        <span className="text-brown-800">Total</span>
                        <span className="text-gold-600">
                          {(selectedPedido.total * 1.1).toLocaleString('pt-AO')} Kz
                        </span>
                      </div>
                    </div>

                    {selectedPedido.status === 'aguardando_pagamento' && (
                      <Button
                        variant="gold"
                        fullWidth
                        onClick={() => {
                          setIsModalOpen(false)
                          handleIrParaPagamento(selectedPedido)
                        }}
                        className="mt-2"
                      >
                        <span className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Ir para Pagamento
                        </span>
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  )
}