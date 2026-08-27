// src/pages/Reservas/MinhasReservas.tsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom' // ✅ Removido Link não usado
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  Users, 
  XCircle, 
  CheckCircle,
  AlertCircle,
  Sparkles,
  MapPin,
  Utensils,
  ChevronRight,
  ArrowRight,
  CalendarDays,
  Clock4,
  Table,
  MessageSquare,
  Trash2
} from 'lucide-react'
import { Container, Card, Badge, Button, Spinner, showToast } from '@/components/ui'
import { reservasApi } from '@/api/reservas'
import { useReservaStore } from '@/store/reservaStore'
import type { Reserva } from '@/types/reserva.types'

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
  canCancel: boolean
}> = {
  disponivel: {
    color: 'success',
    label: 'Disponível',
    icon: <CheckCircle className="w-4 h-4" />,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    canCancel: false
  },
  reservada: {
    color: 'warning',
    label: '⏳ Reservada',
    icon: <Clock className="w-4 h-4" />,
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    canCancel: true // ✅ Pode cancelar
  },
  ocupada: {
    color: 'danger',
    label: 'Ocupada',
    icon: <AlertCircle className="w-4 h-4" />,
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    canCancel: false
  },
  em_limpeza: {
    color: 'info',
    label: 'Em Limpeza',
    icon: <Clock4 className="w-4 h-4" />,
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    canCancel: false
  },
  indisponivel: {
    color: 'default',
    label: 'Indisponível',
    icon: <XCircle className="w-4 h-4" />,
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    canCancel: false
  },
  cancelada: {
    color: 'danger',
    label: '❌ Cancelada',
    icon: <XCircle className="w-4 h-4" />,
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    canCancel: false
  },
  confirmada: {
    color: 'success',
    label: '✅ Confirmada',
    icon: <CheckCircle className="w-4 h-4" />,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    canCancel: true // ✅ Também pode cancelar se ainda não passou
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
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: { duration: 0.2 }
  }
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.2 }
  }
}

export function MinhasReservas() {
  const navigate = useNavigate()
  const { reservaAtual, limparReserva } = useReservaStore()
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [cancelando, setCancelando] = useState<string | null>(null)
  const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    carregarReservas()
  }, [])

  const carregarReservas = async () => {
    setIsLoading(true)
    try {
      const data = await reservasApi.minhasReservas()
      setReservas(data)
    } catch (error) {
      console.error('Erro ao carregar reservas:', error)
      showToast.error('Erro ao carregar reservas')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelar = async (publicId: string) => {
    if (!confirm('Tem certeza que deseja cancelar esta reserva?')) return

    setCancelando(publicId)
    try {
      await reservasApi.cancelar(publicId)
      showToast.success('Reserva cancelada com sucesso! ❌')
      await carregarReservas()
      
      // ✅ Verificação segura - reservaAtual pode não ter public_id
      if (reservaAtual && 'public_id' in reservaAtual && reservaAtual.public_id === publicId) {
        limparReserva()
      }
    } catch (error: any) {
      console.error('Erro ao cancelar reserva:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao cancelar reserva')
    } finally {
      setCancelando(null)
    }
  }

  const handleVerDetalhes = (reserva: Reserva) => {
    setSelectedReserva(reserva)
    setIsModalOpen(true)
  }

  const handleNovaReserva = () => {
    navigate('/reservas/nova')
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

  // ✅ Verificar se a reserva pode ser cancelada (também verifica se a data não passou)
  const canCancelReserva = (reserva: Reserva) => {
    const status = statusConfig[reserva.status]
    if (!status || !status.canCancel) return false
    
    // Verificar se a data da reserva já passou
    const reservaDate = new Date(reserva.data_hora)
    const now = new Date()
    return reservaDate > now
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
            <Calendar className="w-6 h-6 text-gold-400" />
          </div>
        </div>
        <p className="text-brown-500 mt-4">Carregando suas reservas...</p>
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
              📅
            </motion.div>
            
            <h2 className="text-3xl font-display text-brown-800 mb-3">
              Nenhuma <span className="text-gold-500">reserva</span> ainda
            </h2>
            <p className="text-brown-500 mb-8 max-w-sm mx-auto">
              Reserve uma mesa e tenha uma experiência gastronômica única no Aurora.
            </p>
            <Button variant="gold" onClick={handleNovaReserva} className="group text-lg px-8 py-3">
              <span className="flex items-center gap-2">
                Fazer Reserva
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-brown-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                Ambiente exclusivo
              </span>
              <span className="w-px h-3 bg-brown-200" />
              <span>🍽️ Gastronomia refinada</span>
              <span className="w-px h-3 bg-brown-200" />
              <span>⭐ 4.9/5</span>
            </div>
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
          animate="visible"
          variants={fadeUp}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/25">
                  <CalendarDays className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-display text-brown-800">
                    Minhas <span className="text-gold-500">Reservas</span>
                  </h1>
                  <p className="text-brown-500 text-sm">
                    {reservas.length} {reservas.length === 1 ? 'reserva' : 'reservas'} realizadas
                  </p>
                </div>
              </div>
            </div>
            <Button variant="gold" onClick={handleNovaReserva} className="group">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Nova Reserva
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
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
          {reservas.map((reserva) => {
            const status = statusConfig[reserva.status] || statusConfig.disponivel
            const isActive = reserva.status === 'reservada' || reserva.status === 'confirmada'
            const canCancel = canCancelReserva(reserva)

            return (
              <motion.div
                key={reserva.id}
                variants={cardVariants}
                whileHover="hover"
                className="group"
              >
                <Card 
                  variant="hover" 
                  className={`bg-white shadow-lg shadow-brown-900/5 border border-cream-200/50 hover:border-gold-400/30 transition-all duration-300 overflow-hidden ${
                    isActive ? 'border-l-4 border-l-gold-500' : ''
                  }`}
                >
                  <div className={`h-1 w-full bg-gradient-to-r ${
                    isActive ? 'from-gold-400 via-gold-500 to-gold-400' : 'from-gray-200 via-gray-300 to-gray-200'
                  }`} />
                  
                  <div className="p-5 md:p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      {/* Informações da reserva */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-display text-lg text-brown-800">
                            Mesa para {reserva.numero_pessoas} {reserva.numero_pessoas === 1 ? 'pessoa' : 'pessoas'}
                          </h3>
                          <span className="text-xs text-brown-400 flex items-center gap-1">
                            <Table className="w-3 h-3" />
                            Mesa #{reserva.mesa_id}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-brown-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(reserva.data_hora)}
                          </span>
                          <span className="w-px h-3 bg-brown-200" />
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formatTime(reserva.data_hora)}
                          </span>
                          <span className="w-px h-3 bg-brown-200" />
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {reserva.numero_pessoas} {reserva.numero_pessoas === 1 ? 'pessoa' : 'pessoas'}
                          </span>
                        </div>

                        {reserva.observacoes && (
                          <p className="text-sm text-brown-400 italic mt-1.5 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            "{reserva.observacoes}"
                          </p>
                        )}
                      </div>

                      {/* Ações */}
                      <div className="flex items-center gap-3 flex-wrap w-full md:w-auto">
                        <motion.div
                          variants={statusBadgeVariants}
                          initial="initial"
                          animate="animate"
                          className={`px-3 py-1.5 rounded-full text-xs font-medium ${status.bg} ${status.text} border ${status.border} flex items-center gap-1.5 whitespace-nowrap`}
                        >
                          {status.icon}
                          {status.label}
                        </motion.div>

                        {canCancel && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleCancelar(reserva.public_id)}
                            isLoading={cancelando === reserva.public_id}
                            className="whitespace-nowrap"
                          >
                            <span className="flex items-center gap-1.5">
                              <Trash2 className="w-3.5 h-3.5" />
                              Cancelar
                            </span>
                          </Button>
                        )}

                        <button
                          onClick={() => handleVerDetalhes(reserva)}
                          className="p-2 rounded-xl text-brown-400 hover:text-gold-600 hover:bg-gold-50 transition-all duration-300"
                          aria-label="Ver detalhes"
                        >
                          <ChevronRight className="w-4 h-4" />
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
          {isModalOpen && selectedReserva && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-display text-brown-800">
                      Detalhes da Reserva
                    </h3>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 rounded-xl hover:bg-cream-50 transition-colors"
                    >
                      <XCircle className="w-5 h-5 text-brown-400" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gold-50 flex items-center justify-center">
                        <Users className="w-6 h-6 text-gold-500" />
                      </div>
                      <div>
                        <p className="text-sm text-brown-400">Pessoas</p>
                        <p className="font-medium text-brown-800">
                          {selectedReserva.numero_pessoas} {selectedReserva.numero_pessoas === 1 ? 'pessoa' : 'pessoas'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Table className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-brown-400">Mesa</p>
                        <p className="font-medium text-brown-800">
                          Mesa #{selectedReserva.mesa_id}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-sm text-brown-400">Data e Hora</p>
                        <p className="font-medium text-brown-800">
                          {formatDate(selectedReserva.data_hora)} às {formatTime(selectedReserva.data_hora)}
                        </p>
                      </div>
                    </div>

                    {selectedReserva.observacoes && (
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-sm text-brown-400">Observações</p>
                          <p className="text-brown-600 italic">
                            "{selectedReserva.observacoes}"
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="border-t border-cream-100 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-brown-400">Status</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[selectedReserva.status]?.bg} ${statusConfig[selectedReserva.status]?.text} border ${statusConfig[selectedReserva.status]?.border}`}>
                          {statusConfig[selectedReserva.status]?.label || selectedReserva.status}
                        </span>
                      </div>
                    </div>

                    {canCancelReserva(selectedReserva) && (
                      <Button
                        variant="danger"
                        fullWidth
                        onClick={() => {
                          setIsModalOpen(false)
                          handleCancelar(selectedReserva.public_id)
                        }}
                        className="mt-2"
                      >
                        <span className="flex items-center gap-2">
                          <Trash2 className="w-4 h-4" />
                          Cancelar Reserva
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