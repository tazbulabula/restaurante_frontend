// src/pages/Admin/Mesas/Lista.tsx

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Table, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  MapPin,
  Sparkles,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Crown,
  Coffee,
  Sun,
  Moon,
  LayoutGrid,
  AlertTriangle
} from 'lucide-react'
import { Container, Card, Button, Badge, Spinner, showToast, ConfirmModal } from '@/components/ui'
import { mesasApi } from '@/api/mesas'
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
}> = {
  disponivel: {
    label: 'Disponível',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200'
  },
  reservada: {
    label: 'Reservada',
    icon: <Clock className="w-3.5 h-3.5" />,
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200'
  },
  ocupada: {
    label: 'Ocupada',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200'
  },
  em_limpeza: {
    label: 'Em Limpeza',
    icon: <RefreshCw className="w-3.5 h-3.5" />,
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200'
  },
  indisponivel: {
    label: 'Indisponível',
    icon: <XCircle className="w-3.5 h-3.5" />,
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200'
  },
}

// ============================================================
// CONFIGURAÇÕES DE TIPO
// ============================================================
const tipoConfig: Record<string, {
  label: string
  icon: React.ReactNode
  bg: string
  text: string
}> = {
  padrao: {
    label: 'Padrão',
    icon: <Table className="w-3.5 h-3.5" />,
    bg: 'bg-cream-100',
    text: 'text-brown-700'
  },
  vip: {
    label: 'VIP',
    icon: <Crown className="w-3.5 h-3.5" />,
    bg: 'bg-gold-100',
    text: 'text-gold-700'
  },
  jantar: {
    label: 'Jantar',
    icon: <Moon className="w-3.5 h-3.5" />,
    bg: 'bg-indigo-100',
    text: 'text-indigo-700'
  },
  externa: {
    label: 'Externa',
    icon: <Sun className="w-3.5 h-3.5" />,
    bg: 'bg-orange-100',
    text: 'text-orange-700'
  },
  bar: {
    label: 'Bar',
    icon: <Coffee className="w-3.5 h-3.5" />,
    bg: 'bg-amber-100',
    text: 'text-amber-700'
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
      staggerChildren: 0.06,
      delayChildren: 0.1
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
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

export function AdminMesas() {
  const [mesas, setMesas] = useState<Mesa[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; publicId: string; numero: number }>({
    isOpen: false,
    publicId: '',
    numero: 0,
  })
  const [statusModal, setStatusModal] = useState<{ isOpen: boolean; publicId: string; novoStatus: string; numero: number }>({
    isOpen: false,
    publicId: '',
    novoStatus: '',
    numero: 0,
  })

  useEffect(() => {
    setIsMounted(true)
    carregarMesas()
  }, [])

  const carregarMesas = async () => {
    setIsLoading(true)
    try {
      const data = await mesasApi.listar()
      setMesas(data)
    } catch (error) {
      console.error('Erro ao carregar mesas:', error)
      showToast.error('Erro ao carregar mesas')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    const { publicId, numero } = deleteModal
    try {
      await mesasApi.deletar(publicId)
      showToast.success(
        <div className="flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          <span>Mesa {numero} removida com sucesso</span>
        </div>
      )
      setDeleteModal({ isOpen: false, publicId: '', numero: 0 })
      await carregarMesas()
    } catch (error: any) {
      console.error('Erro ao deletar mesa:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao deletar mesa')
    }
  }

  const handleStatusChange = (publicId: string, novoStatus: string, numero: number) => {
    setStatusModal({ isOpen: true, publicId, novoStatus, numero })
  }

  const handleStatusConfirm = async () => {
    const { publicId, novoStatus, numero } = statusModal
    try {
      await mesasApi.alterarStatus(publicId, novoStatus)
      const statusLabel = statusConfig[novoStatus]?.label || novoStatus
      showToast.success(
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          <span>Mesa {numero} agora está <strong>{statusLabel}</strong></span>
        </div>
      )
      setStatusModal({ isOpen: false, publicId: '', novoStatus: '', numero: 0 })
      await carregarMesas()
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      showToast.error('Erro ao alterar status')
    }
  }

  const getStatusBadge = (status: string) => {
    return statusConfig[status] || statusConfig.indisponivel
  }

  const getTipoInfo = (tipo: string) => {
    return tipoConfig[tipo] || tipoConfig.padrao
  }

  // ============================================================
  // LOADING
  // ============================================================
  if (isLoading) {
    return (
      <Container className="py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <Spinner size="lg" color="gold" />
        </div>
        <p className="text-brown-500 mt-4">Carregando mesas...</p>
      </Container>
    )
  }

  // ============================================================
  // SEM MESAS
  // ============================================================
  if (mesas.length === 0) {
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
              🪑
            </motion.div>
            
            <h2 className="text-3xl font-display text-brown-800 mb-3">
              Nenhuma <span className="text-gold-500">mesa</span> cadastrada
            </h2>
            <p className="text-brown-500 mb-8 max-w-sm mx-auto">
              Comece adicionando mesas ao restaurante para gerenciar reservas.
            </p>
            <Link to="/admin/mesas/criar">
              <Button variant="gold" className="group text-lg px-8 py-3">
                <span className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Nova Mesa
                </span>
              </Button>
            </Link>
          </Card>
        </motion.div>
      </Container>
    )
  }

  // ============================================================
  // LISTA DE MESAS
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
                  <Table className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-display text-brown-800">
                    Gerenciar <span className="text-gold-500">Mesas</span>
                  </h1>
                  <p className="text-brown-500 text-sm">
                    {mesas.length} {mesas.length === 1 ? 'mesa' : 'mesas'} no restaurante
                  </p>
                </div>
              </div>
            </div>
            <Link to="/admin/mesas/criar">
              <Button variant="gold" className="group">
                <span className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Nova Mesa
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
          animate={isMounted ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {mesas.map((mesa) => {
              const status = getStatusBadge(mesa.status)
              const tipo = getTipoInfo(mesa.tipo || 'padrao')
              const isAvailable = mesa.status === 'disponivel'

              return (
                <motion.div
                  key={mesa.id}
                  variants={cardVariants}
                  whileHover="hover"
                  layout
                >
                  <Card 
                    variant="bordered" 
                    className={`text-center p-5 bg-white shadow-sm shadow-brown-900/5 border ${isAvailable ? 'border-cream-200/50 hover:border-gold-400/30' : 'border-red-200/50 bg-red-50/10'} transition-all duration-300 h-full flex flex-col`}
                  >
                    {/* Ícone da mesa */}
                    <motion.div
                      className="text-5xl mb-3"
                      whileHover={{ rotate: -10, scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      🪑
                    </motion.div>

                    {/* Número e tipo */}
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <h3 className="text-2xl font-display text-brown-800">
                        Mesa {mesa.numero}
                      </h3>
                      <motion.span
                        variants={badgeVariants}
                        initial="initial"
                        animate="animate"
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${tipo.bg} ${tipo.text}`}
                      >
                        {tipo.icon}
                        {tipo.label}
                      </motion.span>
                    </div>

                    {/* Capacidade */}
                    <p className="text-sm text-brown-600 flex items-center justify-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      Capacidade: {mesa.capacidade} {mesa.capacidade === 1 ? 'pessoa' : 'pessoas'}
                    </p>

                    {/* Localização */}
                    {mesa.localizacao && (
                      <p className="text-sm text-brown-500 flex items-center justify-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {mesa.localizacao}
                      </p>
                    )}

                    {/* Status */}
                    <div className="mt-3">
                      <motion.span
                        variants={badgeVariants}
                        initial="initial"
                        animate="animate"
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text} border ${status.border}`}
                      >
                        {status.icon}
                        {status.label}
                      </motion.span>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-wrap justify-center items-center gap-2 mt-4 pt-4 border-t border-cream-100">
                      <select
                        value={mesa.status}
                        onChange={(e) => handleStatusChange(mesa.public_id, e.target.value, mesa.numero)}
                        className="text-sm rounded-xl border border-cream-200 px-3 py-1.5 bg-white text-brown-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition-all duration-300"
                      >
                        <option value="disponivel">✅ Disponível</option>
                        <option value="reservada">⏳ Reservada</option>
                        <option value="ocupada">🔄 Ocupada</option>
                        <option value="em_limpeza">🧹 Em Limpeza</option>
                        <option value="indisponivel">⛔ Indisponível</option>
                      </select>

                      <Link to={`/admin/mesas/editar/${mesa.public_id}`}>
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
                          publicId: mesa.public_id,
                          numero: mesa.numero,
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
            })}
          </AnimatePresence>
        </motion.div>

        {/* ============================================================ */}
        {/* FOOTER */}
        {/* ============================================================ */}
        {mesas.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isMounted ? { opacity: 1 } : {}}
            className="mt-6 text-center text-sm text-brown-400"
          >
            Total de {mesas.length} {mesas.length === 1 ? 'mesa' : 'mesas'}
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* DELETE MODAL */}
        {/* ============================================================ */}
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, publicId: '', numero: 0 })}
          onConfirm={handleDeleteConfirm}
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja excluir a Mesa ${deleteModal.numero}? Esta ação não pode ser desfeita.`}
          confirmText="Sim, Excluir"
          cancelText="Cancelar"
          variant="danger"
        />

        {/* ============================================================ */}
        {/* STATUS CHANGE MODAL */}
        {/* ============================================================ */}
        <ConfirmModal
          isOpen={statusModal.isOpen}
          onClose={() => setStatusModal({ isOpen: false, publicId: '', novoStatus: '', numero: 0 })}
          onConfirm={handleStatusConfirm}
          title="Confirmar Alteração"
          message={`Deseja realmente alterar o status da Mesa ${statusModal.numero}?`}
          confirmText="Sim, Alterar"
          cancelText="Cancelar"
          variant="warning"
        />
      </Container>
    </div>
  )
}