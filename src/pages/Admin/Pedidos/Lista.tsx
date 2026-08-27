// src/pages/Admin/Pedidos/Lista.tsx

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, 
  Clock, 
  CreditCard, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Users,
  Table,
  Phone,
  Mail,
  MessageSquare,
  Sparkles,
  Filter,
  Search,
  ChevronDown,
  Eye,
  Edit,
  RefreshCw,
  DollarSign,
  Wallet,
  Smartphone,
  Landmark,
  Utensils,
  Coffee,
  Crown,
  User,
  Calendar,
  ArrowRight
} from 'lucide-react'
import { Container, Card, Button, Badge, Spinner, showToast, ConfirmModal } from '@/components/ui'
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
  isSystemStatus: boolean
}> = {
  aguardando_pagamento: {
    color: 'warning',
    label: '⏳ Aguardando Pagamento',
    icon: <Clock className="w-3.5 h-3.5" />,
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    isSystemStatus: true
  },
  aguardando_confirmacao_manual: {
    color: 'warning',
    label: '⏳ Aguardando Confirmação',
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    isSystemStatus: false
  },
  pago: {
    color: 'success',
    label: '✅ Pago',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    isSystemStatus: true
  },
  preparando: {
    color: 'info',
    label: '👨‍🍳 Preparando',
    icon: <Utensils className="w-3.5 h-3.5" />,
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    isSystemStatus: false
  },
  pronto: {
    color: 'success',
    label: '✅ Pronto',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    isSystemStatus: false
  },
  entregue: {
    color: 'success',
    label: '📦 Entregue',
    icon: <Package className="w-3.5 h-3.5" />,
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
    isSystemStatus: false
  },
  cancelado: {
    color: 'danger',
    label: '❌ Cancelado',
    icon: <XCircle className="w-3.5 h-3.5" />,
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    isSystemStatus: false
  },
}

// ============================================================
// CONFIGURAÇÕES DE MÉTODO DE PAGAMENTO
// ============================================================
const METODOS_PAGAMENTO = [
  { value: 'emis', label: 'Multicaixa Express', icon: <Smartphone className="w-4 h-4" />, emoji: '📱' },
  { value: 'dinheiro', label: 'Dinheiro', icon: <DollarSign className="w-4 h-4" />, emoji: '💰' },
  { value: 'transferencia', label: 'Transferência Bancária', icon: <Landmark className="w-4 h-4" />, emoji: '🏦' },
  { value: 'pos', label: 'POS (Cartão)', icon: <CreditCard className="w-4 h-4" />, emoji: '💳' },
]

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

export function AdminPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  
  const [pagamentoModal, setPagamentoModal] = useState<{
    isOpen: boolean
    pedido: Pedido | null
    metodo: string
  }>({
    isOpen: false,
    pedido: null,
    metodo: '',
  })
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean
    publicId: string
    novoStatus: string
    pedidoId: number
  }>({
    isOpen: false,
    publicId: '',
    novoStatus: '',
    pedidoId: 0,
  })

  useEffect(() => {
    setIsMounted(true)
    carregarPedidos()
  }, [])

  const carregarPedidos = async () => {
    setIsLoading(true)
    try {
      const data = await pedidosApi.listar()
      setPedidos(data)
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
      showToast.error('Erro ao carregar pedidos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = (publicId: string, novoStatus: string, pedidoId: number) => {
    // Bloqueia alteração para status do sistema
    if (novoStatus === 'pago') {
      showToast.error('O status "Pago" é confirmado automaticamente pelo sistema')
      return
    }
    setStatusModal({ isOpen: true, publicId, novoStatus, pedidoId })
  }

  const handleStatusConfirm = async () => {
    const { publicId, novoStatus } = statusModal
    try {
      await pedidosApi.atualizarStatus(publicId, novoStatus)
      const statusLabel = statusConfig[novoStatus]?.label || novoStatus
      showToast.success(
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          <span>Status do pedido atualizado para <strong>{statusLabel}</strong></span>
        </div>
      )
      setStatusModal({ isOpen: false, publicId: '', novoStatus: '', pedidoId: 0 })
      await carregarPedidos()
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao atualizar status')
    }
  }

  const handlePagamentoManual = (pedido: Pedido) => {
    setPagamentoModal({ isOpen: true, pedido, metodo: '' })
  }

  const confirmarPagamentoManual = async () => {
    const { pedido, metodo } = pagamentoModal
    if (!pedido || !metodo) return

    try {
      await pedidosApi.pagamentoManual(pedido.public_id, metodo)
      
      const metodoLabel = METODOS_PAGAMENTO.find(m => m.value === metodo)?.label || metodo
      showToast.success(
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4" />
          <span>Pagamento via <strong>{metodoLabel}</strong> registrado com sucesso! ✅</span>
        </div>
      )
      
      setPagamentoModal({ isOpen: false, pedido: null, metodo: '' })
      await carregarPedidos()
    } catch (error: any) {
      console.error('Erro ao registrar pagamento:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao registrar pagamento')
    }
  }

  const getStatusBadge = (status: string) => {
    return statusConfig[status] || statusConfig.aguardando_pagamento
  }

  const getMetodoIcon = (metodo: string) => {
    const found = METODOS_PAGAMENTO.find(m => m.value === metodo)
    return found?.emoji || '💳'
  }

  const filteredPedidos = pedidos.filter(pedido => {
    const matchesStatus = filterStatus === '' || pedido.status === filterStatus
    const matchesSearch = searchTerm === '' || 
      pedido.id.toString().includes(searchTerm) ||
      pedido.cliente_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.cliente_telefone?.includes(searchTerm)
    return matchesStatus && matchesSearch
  })

  const statusOptions = Object.keys(statusConfig)

  // ============================================================
  // LOADING
  // ============================================================
  if (isLoading) {
    return (
      <Container className="py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <Spinner size="lg" color="gold" />
        </div>
        <p className="text-brown-500 mt-4">Carregando pedidos...</p>
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
              📦
            </motion.div>
            
            <h2 className="text-3xl font-display text-brown-800 mb-3">
              Nenhum <span className="text-gold-500">pedido</span> encontrado
            </h2>
            <p className="text-brown-500 mb-8 max-w-sm mx-auto">
              Aguarde os primeiros pedidos dos clientes.
            </p>
            <Button
              variant="gold"
              onClick={carregarPedidos}
              className="group"
            >
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Atualizar
              </span>
            </Button>
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
                    Gerenciar <span className="text-gold-500">Pedidos</span>
                  </h1>
                  <p className="text-brown-500 text-sm">
                    {pedidos.length} {pedidos.length === 1 ? 'pedido' : 'pedidos'} no sistema
                  </p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={carregarPedidos}
              className="border-gold-300 text-brown-600 hover:bg-gold-50/50"
            >
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Atualizar
              </span>
            </Button>
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
              placeholder="Buscar por ID, nome ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-cream-200 rounded-xl text-brown-800 placeholder-brown-400 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition-all duration-300"
            />
          </div>

          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-4 pr-10 py-2.5 bg-white border border-cream-200 rounded-xl text-brown-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition-all duration-300 appearance-none min-w-[180px]"
            >
              <option value="">Todos os status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {statusConfig[status]?.label || status}
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
            {filteredPedidos.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 text-brown-500"
              >
                <Package className="w-12 h-12 mx-auto text-brown-300 mb-3" />
                <p>Nenhum pedido encontrado com os filtros aplicados</p>
              </motion.div>
            ) : (
              filteredPedidos.map((pedido) => {
                const status = getStatusBadge(pedido.status)
                const isSystemStatus = status.isSystemStatus
                const isAguardandoPagamento = pedido.status === 'aguardando_pagamento'
                const isPago = pedido.status === 'pago'
                const metodoIcon = getMetodoIcon(pedido.metodo_pagamento)

                return (
                  <motion.div
                    key={pedido.id}
                    variants={cardVariants}
                    whileHover="hover"
                    layout
                  >
                    <Card 
                      variant="bordered" 
                      className={`flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-4 md:p-5 bg-white shadow-sm shadow-brown-900/5 border ${isPago ? 'border-emerald-200/50 bg-emerald-50/20' : isAguardandoPagamento ? 'border-amber-200/50 bg-amber-50/20' : 'border-cream-200/50 hover:border-gold-400/30'} transition-all duration-300`}
                    >
                      {/* Informações do pedido */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-display text-lg text-brown-800">
                            Pedido #{pedido.id}
                          </h3>
                          {pedido.metodo_pagamento && (
                            <span className="text-xs text-brown-400 flex items-center gap-1">
                              {metodoIcon}
                              {pedido.metodo_pagamento}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-brown-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {pedido.cliente_nome || 'Cliente'}
                          </span>
                          <span className="w-px h-3 bg-brown-200" />
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            {pedido.cliente_telefone || 'N/A'}
                          </span>
                          <span className="w-px h-3 bg-brown-200" />
                          <span className="flex items-center gap-1">
                            <Table className="w-3.5 h-3.5" />
                            Mesa {pedido.mesa_numero}
                          </span>
                          <span className="w-px h-3 bg-brown-200" />
                          <span className="flex items-center gap-1">
                            <Package className="w-3.5 h-3.5" />
                            {pedido.itens?.length || 0} itens
                          </span>
                          <span className="w-px h-3 bg-brown-200" />
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(pedido.created_at).toLocaleDateString('pt-AO')} {new Date(pedido.created_at).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {pedido.observacoes && (
                          <p className="text-sm text-brown-400 italic mt-1 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            "{pedido.observacoes}"
                          </p>
                        )}

                        {pedido.codigo_autorizacao && (
                          <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Autorização: {pedido.codigo_autorizacao}
                          </p>
                        )}
                      </div>

                      {/* Ações */}
                      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        <span className="font-bold text-gold-600 text-lg whitespace-nowrap">
                          {pedido.total.toLocaleString('pt-AO')} Kz
                        </span>

                        <motion.span
                          variants={badgeVariants}
                          initial="initial"
                          animate="animate"
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${status.bg} ${status.text} border ${status.border} whitespace-nowrap`}
                        >
                          {status.icon}
                          {status.label}
                        </motion.span>

                        <select
                          value={pedido.status}
                          onChange={(e) => handleStatusChange(pedido.public_id, e.target.value, pedido.id)}
                          disabled={isSystemStatus}
                          className={`text-sm rounded-xl border px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition-all duration-300 ${
                            isSystemStatus ? 'opacity-50 cursor-not-allowed border-gray-200' : 'border-cream-200 hover:border-gold-300'
                          }`}
                        >
                          {Object.keys(statusConfig).map((opt) => (
                            <option key={opt} value={opt}>
                              {statusConfig[opt]?.label || opt}
                            </option>
                          ))}
                        </select>

                        {isAguardandoPagamento && (
                          <Button
                            variant="gold"
                            size="sm"
                            onClick={() => handlePagamentoManual(pedido)}
                            className="whitespace-nowrap"
                          >
                            <span className="flex items-center gap-1.5">
                              <Wallet className="w-3.5 h-3.5" />
                              Pagar
                            </span>
                          </Button>
                        )}
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
        {filteredPedidos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isMounted ? { opacity: 1 } : {}}
            className="mt-4 text-center text-sm text-brown-400"
          >
            Mostrando {filteredPedidos.length} de {pedidos.length} pedidos
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* MODAL DE PAGAMENTO MANUAL */}
        {/* ============================================================ */}
        <ConfirmModal
          isOpen={pagamentoModal.isOpen}
          onClose={() => setPagamentoModal({ isOpen: false, pedido: null, metodo: '' })}
          onConfirm={confirmarPagamentoManual}
          title="Registrar Pagamento Manual"
          message={
            <div className="space-y-4">
              <p className="text-brown-600">
                Pedido #{pagamentoModal.pedido?.id} - <strong>{pagamentoModal.pedido?.total.toLocaleString('pt-AO')} Kz</strong>
              </p>
              <div>
                <p className="text-sm font-medium text-brown-700 mb-2">Método de Pagamento:</p>
                <div className="grid grid-cols-2 gap-2">
                  {METODOS_PAGAMENTO.map(metodo => (
                    <button
                      key={metodo.value}
                      onClick={() => setPagamentoModal(prev => ({ ...prev, metodo: metodo.value }))}
                      className={`p-3 rounded-xl border-2 text-sm transition-all duration-300 flex flex-col items-center gap-1 ${
                        pagamentoModal.metodo === metodo.value
                          ? 'border-gold-500 bg-gold-50 shadow-sm shadow-gold-500/10'
                          : 'border-cream-200 hover:border-gold-300 hover:bg-cream-50/50'
                      }`}
                    >
                      <span className="text-xl">{metodo.emoji}</span>
                      <span className="text-xs">{metodo.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          }
          confirmText="Confirmar Pagamento"
          cancelText="Cancelar"
          variant="warning"
          disabled={!pagamentoModal.metodo}
        />

        {/* ============================================================ */}
        {/* MODAL DE ALTERAÇÃO DE STATUS */}
        {/* ============================================================ */}
        <ConfirmModal
          isOpen={statusModal.isOpen}
          onClose={() => setStatusModal({ isOpen: false, publicId: '', novoStatus: '', pedidoId: 0 })}
          onConfirm={handleStatusConfirm}
          title="Confirmar Alteração"
          message={
            <div>
              <p className="text-brown-600">
                Pedido #{statusModal.pedidoId}
              </p>
              <p className="text-brown-600 mt-2">
                Deseja alterar o status para{' '}
                <strong>{statusConfig[statusModal.novoStatus]?.label || statusModal.novoStatus}</strong>?
              </p>
            </div>
          }
          confirmText="Sim, Alterar"
          cancelText="Cancelar"
          variant="warning"
        />
      </Container>
    </div>
  )
}