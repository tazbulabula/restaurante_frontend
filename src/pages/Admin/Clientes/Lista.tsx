// src/pages/Admin/Clientes/Lista.tsx

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User as UserIcon,  // ✅ Renomeado para evitar conflito
  Users, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  Shield,
  Crown,
  UserCheck,
  Trash2,
  RefreshCw,
  Filter,
  Eye,
  Edit,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  UserX,
  UserPlus,
  AlertTriangle
} from 'lucide-react'
import { Container, Card, Button, Badge, Input, Spinner, showToast, ConfirmModal } from '@/components/ui'
import { usersApi } from '@/api/users'
import type { User } from '@/types/auth.types'

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

export function AdminClientes() {
  const [clientes, setClientes] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [includeDeleted, setIncludeDeleted] = useState(false)
  const [total, setTotal] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [modal, setModal] = useState<{
    isOpen: boolean
    publicId: string
    username: string
    action: 'soft' | 'hard' | 'restore'
  }>({
    isOpen: false,
    publicId: '',
    username: '',
    action: 'soft',
  })

  useEffect(() => {
    setIsMounted(true)
    carregarClientes()
  }, [includeDeleted])

  const carregarClientes = async () => {
    setIsLoading(true)
    try {
      const response = await usersApi.listar({
        search: search || undefined,
        include_deleted: includeDeleted,
      })
      
      setClientes(response.users || [])
      setTotal(response.total || 0)
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
      showToast.error('Erro ao carregar clientes')
      setClientes([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      carregarClientes()
    }, 500)
  }

  const handleDelete = (publicId: string, username: string) => {
    setModal({ isOpen: true, publicId, username, action: 'soft' })
  }

  const handleHardDelete = (publicId: string, username: string) => {
    setModal({ isOpen: true, publicId, username, action: 'hard' })
  }

  const handleRestore = (publicId: string, username: string) => {
    setModal({ isOpen: true, publicId, username, action: 'restore' })
  }

  const handleModalConfirm = async () => {
    const { publicId, username, action } = modal
    try {
      if (action === 'soft') {
        await usersApi.deletar(publicId)
        showToast.success(
          <div className="flex items-center gap-2">
            <UserX className="w-4 h-4" />
            <span>Usuário "{username}" desativado com sucesso</span>
          </div>
        )
      } else if (action === 'hard') {
        await usersApi.deletarPermanentemente(publicId)
        showToast.success(
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            <span>Usuário "{username}" removido permanentemente</span>
          </div>
        )
      } else if (action === 'restore') {
        await usersApi.restaurar(publicId)
        showToast.success(
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            <span>Usuário "{username}" restaurado com sucesso</span>
          </div>
        )
      }
      
      setModal({ isOpen: false, publicId: '', username: '', action: 'soft' })
      await carregarClientes()
    } catch (error: any) {
      console.error('Erro ao processar ação:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao processar ação')
    }
  }

  const handleTipoChange = async (publicId: string, userType: string) => {
    try {
      await usersApi.alterarTipo(publicId, userType)
      showToast.success(
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          <span>Tipo alterado com sucesso! 👑</span>
        </div>
      )
      await carregarClientes()
    } catch (error: any) {
      console.error('Erro ao alterar tipo:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao alterar tipo')
    }
  }

  const getStatusBadge = (user: User) => {
    const isDeleted = user.deleted_at !== null && user.deleted_at !== undefined
    
    if (isDeleted) {
      return {
        label: 'Deletado',
        variant: 'danger' as const,
        icon: <XCircle className="w-3.5 h-3.5" />,
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200'
      }
    }
    
    return {
      label: 'Ativo',
      variant: 'success' as const,
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200'
    }
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
        <p className="text-brown-500 mt-4">Carregando clientes...</p>
      </Container>
    )
  }

  // ============================================================
  // SEM CLIENTES
  // ============================================================
  if (clientes.length === 0) {
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
              👥
            </motion.div>
            
            <h2 className="text-3xl font-display text-brown-800 mb-3">
              {search ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
            </h2>
            <p className="text-brown-500 mb-8 max-w-sm mx-auto">
              {search 
                ? 'Tente ajustar sua busca para encontrar o cliente desejado.'
                : 'Comece adicionando seu primeiro cliente ao sistema.'}
            </p>
            <Link to="/admin/clientes/criar">
              <Button variant="gold" className="group text-lg px-8 py-3">
                <span className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Novo Cliente
                </span>
              </Button>
            </Link>
          </Card>
        </motion.div>
      </Container>
    )
  }

  // ============================================================
  // LISTA DE CLIENTES
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
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-display text-brown-800">
                    Gerenciar <span className="text-gold-500">Clientes</span>
                  </h1>
                  <p className="text-brown-500 text-sm">
                    {total} {total === 1 ? 'cliente' : 'clientes'} no sistema
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/admin/clientes/criar">
                <Button variant="gold" className="group">
                  <span className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Novo Cliente
                  </span>
                </Button>
              </Link>
              <Button
                variant={includeDeleted ? 'gold' : 'outline'}
                onClick={() => setIncludeDeleted(!includeDeleted)}
                className={includeDeleted ? '' : 'border-gold-300 text-brown-600 hover:bg-gold-50/50'}
              >
                <span className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  {includeDeleted ? '✅ Incluir Deletados' : '📋 Apenas Ativos'}
                </span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* SEARCH */}
        {/* ============================================================ */}
        <motion.div
          initial="hidden"
          animate={isMounted ? "visible" : "hidden"}
          variants={fadeUp}
          className="mb-6"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brown-400" />
            <input
              type="text"
              placeholder="Buscar cliente por nome ou email..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-11 pr-4 py-3 bg-white border border-cream-200 rounded-xl text-brown-800 placeholder-brown-400 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition-all duration-300"
            />
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
            {clientes.map((cliente) => {
              const isDeleted = cliente.deleted_at !== null && cliente.deleted_at !== undefined
              const status = getStatusBadge(cliente)
              const isAdmin = cliente.user_type === 'admin'

              return (
                <motion.div
                  key={cliente.id}
                  variants={cardVariants}
                  whileHover="hover"
                  layout
                >
                  <Card 
                    variant="bordered" 
                    className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 md:p-5 bg-white shadow-sm shadow-brown-900/5 border ${isDeleted ? 'border-red-200/50 bg-red-50/30' : 'border-cream-200/50 hover:border-gold-400/30'} transition-all duration-300`}
                  >
                    {/* Informações */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display text-lg text-brown-800">
                          {cliente.username}
                        </h3>
                        <motion.span
                          variants={badgeVariants}
                          initial="initial"
                          animate="animate"
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text} border ${status.border} flex items-center gap-1`}
                        >
                          {status.icon}
                          {status.label}
                        </motion.span>
                        {isAdmin && (
                          <motion.span
                            variants={badgeVariants}
                            initial="initial"
                            animate="animate"
                            className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold-50 text-gold-700 border border-gold-200 flex items-center gap-1"
                          >
                            <Crown className="w-3 h-3" />
                            Admin
                          </motion.span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm">
                        <span className="flex items-center gap-1 text-brown-500">
                          <Mail className="w-3.5 h-3.5" />
                          {cliente.email}
                        </span>
                        {cliente.phone && (
                          <>
                            <span className="w-px h-3 bg-brown-200" />
                            <span className="flex items-center gap-1 text-brown-500">
                              <Phone className="w-3.5 h-3.5" />
                              {cliente.phone}
                            </span>
                          </>
                        )}
                      </div>

                      {isDeleted && cliente.deleted_at && (
                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Deletado em: {new Date(cliente.deleted_at).toLocaleDateString('pt-AO')} às {new Date(cliente.deleted_at).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                      {isDeleted ? (
                        // Ações para usuários deletados
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleRestore(cliente.public_id, cliente.username)}
                            className="whitespace-nowrap"
                          >
                            <span className="flex items-center gap-1.5">
                              <RefreshCw className="w-3.5 h-3.5" />
                              Restaurar
                            </span>
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleHardDelete(cliente.public_id, cliente.username)}
                            className="whitespace-nowrap"
                          >
                            <span className="flex items-center gap-1.5">
                              <Trash2 className="w-3.5 h-3.5" />
                              Remover
                            </span>
                          </Button>
                        </>
                      ) : (
                        // Ações para usuários ativos
                        <>
                          <select
                            value={cliente.user_type}
                            onChange={(e) => handleTipoChange(cliente.public_id, e.target.value)}
                            className="text-sm rounded-xl border border-cream-200 px-3 py-1.5 bg-white text-brown-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition-all duration-300"
                          >
                            <option value="cliente">👤 Cliente</option>
                            <option value="admin">👑 Admin</option>
                          </select>
                          
                          <Link to={`/admin/clientes/editar/${cliente.public_id}`}>
                            <Button variant="outline" size="sm" className="border-gold-300 text-brown-600 hover:bg-gold-50/50 whitespace-nowrap">
                              <span className="flex items-center gap-1.5">
                                <Edit className="w-3.5 h-3.5" />
                                Editar
                              </span>
                            </Button>
                          </Link>
                          
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(cliente.public_id, cliente.username)}
                            className="whitespace-nowrap"
                          >
                            <span className="flex items-center gap-1.5">
                              <UserX className="w-3.5 h-3.5" />
                              Desativar
                            </span>
                          </Button>
                        </>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>

        {/* ============================================================ */}
        {/* FOOTER DA LISTA */}
        {/* ============================================================ */}
        {clientes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isMounted ? { opacity: 1 } : {}}
            className="mt-4 text-center text-sm text-brown-400"
          >
            Mostrando {clientes.length} {clientes.length === 1 ? 'cliente' : 'clientes'}
            {includeDeleted && ' (incluindo deletados)'}
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* MODAL DE CONFIRMAÇÃO */}
        {/* ============================================================ */}
        <ConfirmModal
          isOpen={modal.isOpen}
          onClose={() => setModal({ isOpen: false, publicId: '', username: '', action: 'soft' })}
          onConfirm={handleModalConfirm}
          title={
            modal.action === 'soft' ? 'Desativar Usuário' :
            modal.action === 'hard' ? 'Remover Permanentemente' :
            'Restaurar Usuário'
          }
          message={
            modal.action === 'soft'
              ? `Tem certeza que deseja desativar o usuário "${modal.username}"? Ele pode ser restaurado depois.`
              : modal.action === 'hard'
              ? `Tem certeza que deseja remover PERMANENTEMENTE o usuário "${modal.username}"? Esta ação não pode ser desfeita!`
              : `Tem certeza que deseja restaurar o usuário "${modal.username}"?`
          }
          confirmText={
            modal.action === 'soft' ? 'Sim, Desativar' :
            modal.action === 'hard' ? 'Sim, Remover Permanentemente' :
            'Sim, Restaurar'
          }
          cancelText="Cancelar"
          variant={
            modal.action === 'soft' ? 'warning' :
            modal.action === 'hard' ? 'danger' :
            'info'
          }
        />
      </Container>
    </div>
  )
}