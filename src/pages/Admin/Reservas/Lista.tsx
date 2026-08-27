// src/pages/Admin/Reservas/Lista.tsx

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Users, 
  Table, 
  User, 
  Phone, 
  MessageSquare,
  Sparkles,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  CalendarDays,
  Clock4,
  MapPin,
  Crown,
  Coffee
} from 'lucide-react'
import { Container, Card, Button, Badge, Spinner, showToast, ConfirmModal } from '@/components/ui'
import { reservasApi } from '@/api/reservas'
import { mesasApi } from '@/api/mesas'
import type { Reserva } from '@/types/reserva.types'
import type { Mesa } from '@/types/mesa.types'

// ============================================================
// CONFIGURAÇÕES DE STATUS
// ============================================================
const statusConfig: Record<string, {
  label: string
  icon: React.ReactNode
  bg: string
  text: string
  border: string
  canCancel: boolean
}> = {
  disponivel: {
    label: 'Disponível',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    canCancel: false
  },
  reservada: {
    label: '⏳ Reservada',
    icon: <Clock className="w-3.5 h-3.5" />,
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    canCancel: true
  },
  ocupada: {
    label: 'Ocupada',
    icon: <Users className="w-3.5 h-3.5" />,
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    canCancel: false
  },
  em_limpeza: {
    label: 'Em Limpeza',
    icon: <RefreshCw className="w-3.5 h-3.5" />,
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    canCancel: false
  },
  indisponivel: {
    label: 'Indisponível',
    icon: <XCircle className="w-3.5 h-3.5" />,
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    canCancel: false
  },
  confirmada: {
    label: '✅ Confirmada',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    canCancel: true
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

export function AdminReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [mesas, setMesas] = useState<Mesa[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  
  const [cancelModal, setCancelModal] = useState<{
    isOpen: boolean
    publicId: string
    id: number
    cliente: string
  }>({
    isOpen: false,
    publicId: '',
    id: 0,
    cliente: '',
  })

  useEffect(() => {
    setIsMounted(true)
    carregarDados()
  }, [])

  const carregarDados = async () => {
    setIsLoading(true)
    try {
      const [reservasData, mesasData] = await Promise.all([
        reservasApi.listar(),
        mesasApi.listar(),
      ])
      setReservas(reservasData)
      setMesas(mesasData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      showToast.error('Erro ao carregar dados')
    } finally {
      setIsLoading(false)
    }
  }

  const getMesaNumero = (mesaId: number) => {
    const mesa = mesas.find(m => m.id === mesaId)
    return mesa ? mesa.numero : 'N/A'
  }

  const getMesaLocalizacao = (mesaId: number) => {
    const mesa = mesas.find(m => m.id === mesaId)
    return mesa?.localizacao || null
  }

  const handleCancelar = (publicId: string, id: number, cliente: string) => {
    setCancelModal({ isOpen: true, publicId, id, cliente })
  }

  const handleCancelConfirm = async () => {
    const { publicId, id, cliente } = cancelModal
    try {
      await reservasApi.cancelar(publicId)
      showToast.success(
        <div className="flex items-center gap-2">
          <XCircle className="w-4 h-4" />
          <span>Reserva de <strong>{cliente}</strong> cancelada com sucesso</span>
        </div>
      )
      setCancelModal({ isOpen: false, publicId: '', id: 0, cliente: '' })
      await carregarDados()
    } catch (error: any) {
      console.error('Erro ao cancelar reserva:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao cancelar reserva')
    }
  }

  const getStatusBadge = (status: string) => {
    return statusConfig[status] || statusConfig.indisponivel
  }

  const filtered = reservas.filter(reserva => {
    const matchesStatus = filterStatus === '' || reserva.status === filterStatus
    const matchesSearch = searchTerm === '' ||
      reserva.id.toString().includes(searchTerm) ||
      reserva.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reserva.cliente_telefone.includes(searchTerm)
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
        <p className="text-brown-500 mt-4">Carregando reservas...</p>
      </Container>
    )
  }

  // ============================================================
  // SEM RESERVAS
  // ============================================================
  if (reservas.length === 0) {
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
              📅
            </motion.div>
            
            <h2 className="text-3xl font-display text-brown-800 mb-3">
              Nenhuma <span className="text-gold-500">reserva</span> encontrada
            </h2>
            <p className="text-brown-500 mb-8 max-w-sm mx-auto">
              Aguarde as primeiras reservas dos clientes.
            </p>
            <Button
              variant="gold"
              onClick={carregarDados}
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
  // LISTA DE RESERVAS
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
                  <CalendarDays className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-display text-brown-800">
                    Gerenciar <span className="text-gold-500">Reservas</span>
                  </h1>
                  <p className="text-brown-500 text-sm">
                    {reservas.length} {reservas.length === 1 ? 'reserva' : 'reservas'} no sistema
                  </p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={carregarDados}
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
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 text-brown-500"
              >
                <Calendar className="w-12 h-12 mx-auto text-brown-300 mb-3" />
                <p>Nenhuma reserva encontrada com os filtros aplicados</p>
              </motion.div>
            ) : (
              filtered.map((reserva) => {
                const status = getStatusBadge(reserva.status)
                const mesaNumero = getMesaNumero(reserva.mesa_id)
                const localizacao = getMesaLocalizacao(reserva.mesa_id)
                const canCancel = status.canCancel
                const isActive = reserva.status === 'reservada' || reserva.status === 'confirmada'

                return (
                  <motion.div
                    key={reserva.id}
                    variants={cardVariants}
                    whileHover="hover"
                    layout
                  >
                    <Card 
                      variant="bordered" 
                      className={`flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-4 md:p-5 bg-white shadow-sm shadow-brown-900/5 border ${isActive ? 'border-gold-200/50 bg-gold-50/10' : 'border-cream-200/50 hover:border-gold-400/30'} transition-all duration-300`}
                    >
                      {/* Informações da reserva */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-display text-lg text-brown-800">
                            Reserva #{reserva.id}
                          </h3>
                          <span className="text-xs text-brown-400 flex items-center gap-1">
                            <Table className="w-3.5 h-3.5" />
                            Mesa {mesaNumero}
                          </span>
                          {localizacao && (
                            <span className="text-xs text-brown-400 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {localizacao}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-brown-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {reserva.cliente_nome}
                          </span>
                          <span className="w-px h-3 bg-brown-200" />
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            {reserva.cliente_telefone}
                          </span>
                          <span className="w-px h-3 bg-brown-200" />
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {reserva.numero_pessoas} {reserva.numero_pessoas === 1 ? 'pessoa' : 'pessoas'}
                          </span>
                          <span className="w-px h-3 bg-brown-200" />
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(reserva.data_hora).toLocaleDateString('pt-AO')}
                          </span>
                          <span className="w-px h-3 bg-brown-200" />
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(reserva.data_hora).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {reserva.observacoes && (
                          <p className="text-sm text-brown-400 italic mt-1 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            "{reserva.observacoes}"
                          </p>
                        )}
                      </div>

                      {/* Ações */}
                      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        <motion.span
                          variants={badgeVariants}
                          initial="initial"
                          animate="animate"
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${status.bg} ${status.text} border ${status.border} whitespace-nowrap`}
                        >
                          {status.icon}
                          {status.label}
                        </motion.span>

                        {canCancel && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleCancelar(reserva.public_id, reserva.id, reserva.cliente_nome)}
                            className="whitespace-nowrap"
                          >
                            <span className="flex items-center gap-1.5">
                              <XCircle className="w-3.5 h-3.5" />
                              Cancelar
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
        {filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isMounted ? { opacity: 1 } : {}}
            className="mt-4 text-center text-sm text-brown-400"
          >
            Mostrando {filtered.length} de {reservas.length} reservas
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* CANCEL MODAL */}
        {/* ============================================================ */}
        <ConfirmModal
          isOpen={cancelModal.isOpen}
          onClose={() => setCancelModal({ isOpen: false, publicId: '', id: 0, cliente: '' })}
          onConfirm={handleCancelConfirm}
          title="Confirmar Cancelamento"
          message={`Tem certeza que deseja cancelar a reserva de <strong>${cancelModal.cliente}</strong> (Reserva #${cancelModal.id})?`}
          confirmText="Sim, Cancelar"
          cancelText="Voltar"
          variant="danger"
        />
      </Container>
    </div>
  )
}