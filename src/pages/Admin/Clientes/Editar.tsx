// src/pages/Admin/Clientes/Editar.tsx

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  User as UserIcon,  // ✅ Renomeado para evitar conflito
  Mail, 
  Phone, 
  Shield,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Crown,
  UserCheck,
  Edit,
  Loader2
} from 'lucide-react'
import { Container, Card, CardContent, CardFooter, Button, Input, Spinner, showToast } from '@/components/ui'
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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.15
    }
  }
}

const inputVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.06 + 0.2,
      duration: 0.4,
      ease: [0.25, 0.1, 0.15, 1]
    }
  })
}

const loadingVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.15, 1]
    }
  }
}

export function AdminClientesEditar() {
  const { publicId } = useParams<{ publicId: string }>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    phone: false,
  })

  const [form, setForm] = useState<Partial<User>>({
    username: '',
    email: '',
    phone: '',
    user_type: 'cliente',
  })

  useEffect(() => {
    setIsMounted(true)
    if (publicId) {
      carregarCliente(publicId)
    }
  }, [publicId])

  const carregarCliente = async (id: string) => {
    setIsLoading(true)
    try {
      const data = await usersApi.buscarPorPublicId(id)
      setForm(data)
    } catch (error) {
      console.error('Erro ao carregar cliente:', error)
      showToast.error('Erro ao carregar cliente')
      navigate('/admin/clientes')
    } finally {
      setIsLoading(false)
    }
  }

  // ============================================================
  // VALIDAÇÕES
  // ============================================================
  const isUsernameValid = form.username?.length >= 2
  const isEmailValid = form.email?.includes('@') && form.email?.includes('.')
  const isPhoneValid = form.phone?.length === 0 || form.phone?.replace(/\D/g, '').length >= 9

  const isFormValid = isUsernameValid && isEmailValid && isPhoneValid

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicId) return

    if (!isFormValid) {
      showToast.warning('Por favor, corrija os campos inválidos')
      return
    }

    setIsSaving(true)
    try {
      await usersApi.atualizar(publicId, form)
      showToast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Cliente atualizado com sucesso! ✅</span>
        </div>
      )
      navigate('/admin/clientes')
    } catch (error: any) {
      console.error('Erro ao atualizar cliente:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao atualizar cliente')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // ============================================================
  // LOADING
  // ============================================================
  if (isLoading) {
    return (
      <Container className="py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          variants={loadingVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <div className="relative inline-block">
            <Spinner size="lg" color="gold" />
          </div>
          <p className="text-brown-500 mt-4">Carregando dados do cliente...</p>
        </motion.div>
      </Container>
    )
  }

  // ============================================================
  // FORMULÁRIO
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
                  <Edit className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-display text-brown-800">
                    Editar <span className="text-gold-500">Cliente</span>
                  </h1>
                  <p className="text-brown-500 text-sm">
                    Atualize as informações do cliente
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/clientes')}
              className="inline-flex items-center gap-2 text-brown-500 hover:text-gold-600 transition-colors duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Voltar</span>
            </button>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* CARD */}
        {/* ============================================================ */}
        <motion.div
          initial="hidden"
          animate={isMounted ? "visible" : "hidden"}
          variants={scaleIn}
          className="max-w-2xl mx-auto"
        >
          <Card variant="gold" className="shadow-2xl shadow-gold-500/10 border-2 border-gold-200/30 backdrop-blur-sm bg-white/95 overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300" />

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-5 pt-6">
                
                {/* ============================================================ */}
                {/* NOME */}
                {/* ============================================================ */}
                <motion.div
                  custom={0}
                  variants={inputVariants}
                  initial="hidden"
                  animate={isMounted ? "visible" : "hidden"}
                >
                  <label className="block text-sm font-medium text-brown-700 mb-1.5">
                    <UserIcon className="w-4 h-4 inline mr-2 text-gold-500" />
                    Nome *
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brown-400" />
                    <input
                      type="text"
                      name="username"
                      value={form.username || ''}
                      onChange={handleChange}
                      onBlur={() => handleBlur('username')}
                      placeholder="Nome completo"
                      className={`
                        w-full pl-11 pr-4 py-3 bg-cream-50/50 border rounded-xl 
                        text-brown-800 placeholder-brown-400
                        focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                        transition-all duration-300
                        ${touched.username && !isUsernameValid && form.username?.length > 0
                          ? 'border-red-400 focus:ring-red-400/50'
                          : 'border-cream-200 hover:border-gold-300'
                        }
                      `}
                      required
                    />
                  </div>
                  {touched.username && !isUsernameValid && form.username?.length > 0 && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 mt-1.5 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      Nome deve ter pelo menos 2 caracteres
                    </motion.p>
                  )}
                </motion.div>

                {/* ============================================================ */}
                {/* EMAIL */}
                {/* ============================================================ */}
                <motion.div
                  custom={1}
                  variants={inputVariants}
                  initial="hidden"
                  animate={isMounted ? "visible" : "hidden"}
                >
                  <label className="block text-sm font-medium text-brown-700 mb-1.5">
                    <Mail className="w-4 h-4 inline mr-2 text-gold-500" />
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brown-400" />
                    <input
                      type="email"
                      name="email"
                      value={form.email || ''}
                      onChange={handleChange}
                      onBlur={() => handleBlur('email')}
                      placeholder="cliente@email.com"
                      className={`
                        w-full pl-11 pr-4 py-3 bg-cream-50/50 border rounded-xl 
                        text-brown-800 placeholder-brown-400
                        focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                        transition-all duration-300
                        ${touched.email && !isEmailValid && form.email?.length > 0
                          ? 'border-red-400 focus:ring-red-400/50'
                          : 'border-cream-200 hover:border-gold-300'
                        }
                      `}
                      required
                    />
                    {touched.email && form.email?.length > 0 && (
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                        {isEmailValid ? (
                          <CheckCircle className="w-4.5 h-4.5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4.5 h-4.5 text-red-400" />
                        )}
                      </div>
                    )}
                  </div>
                  {touched.email && !isEmailValid && form.email?.length > 0 && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 mt-1.5 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      Email inválido
                    </motion.p>
                  )}
                </motion.div>

                {/* ============================================================ */}
                {/* TELEFONE */}
                {/* ============================================================ */}
                <motion.div
                  custom={2}
                  variants={inputVariants}
                  initial="hidden"
                  animate={isMounted ? "visible" : "hidden"}
                >
                  <label className="block text-sm font-medium text-brown-700 mb-1.5">
                    <Phone className="w-4 h-4 inline mr-2 text-gold-500" />
                    Telefone <span className="text-brown-400 text-xs">(opcional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brown-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone || ''}
                      onChange={handleChange}
                      onBlur={() => handleBlur('phone')}
                      placeholder="+244 999 999 999"
                      className={`
                        w-full pl-11 pr-4 py-3 bg-cream-50/50 border rounded-xl 
                        text-brown-800 placeholder-brown-400
                        focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                        transition-all duration-300
                        ${touched.phone && !isPhoneValid && form.phone?.length > 0
                          ? 'border-red-400 focus:ring-red-400/50'
                          : 'border-cream-200 hover:border-gold-300'
                        }
                      `}
                    />
                  </div>
                  {touched.phone && !isPhoneValid && form.phone?.length > 0 && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 mt-1.5 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      Telefone inválido
                    </motion.p>
                  )}
                </motion.div>

                {/* ============================================================ */}
                {/* TIPO DE USUÁRIO */}
                {/* ============================================================ */}
                <motion.div
                  custom={3}
                  variants={inputVariants}
                  initial="hidden"
                  animate={isMounted ? "visible" : "hidden"}
                >
                  <label className="block text-sm font-medium text-brown-700 mb-1.5">
                    <Shield className="w-4 h-4 inline mr-2 text-gold-500" />
                    Tipo de Usuário
                  </label>
                  <div className="relative">
                    <select
                      name="user_type"
                      value={form.user_type || 'cliente'}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-cream-50/50 border border-cream-200 rounded-xl text-brown-800 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white transition-all duration-300 appearance-none"
                    >
                      <option value="cliente">
                        <span className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4" />
                          Cliente
                        </span>
                      </option>
                      <option value="admin">
                        <span className="flex items-center gap-2">
                          <Crown className="w-4 h-4" />
                          Administrador
                        </span>
                      </option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      {form.user_type === 'admin' ? (
                        <Crown className="w-4.5 h-4.5 text-gold-500" />
                      ) : (
                        <UserCheck className="w-4.5 h-4.5 text-brown-400" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-brown-400 mt-1.5">
                    {form.user_type === 'admin' 
                      ? '👑 Administradores têm acesso ao painel de controle' 
                      : '👤 Clientes podem fazer pedidos e reservas'}
                  </p>
                </motion.div>

                {/* ============================================================ */}
                {/* DICA */}
                {/* ============================================================ */}
                <motion.div
                  custom={4}
                  variants={inputVariants}
                  initial="hidden"
                  animate={isMounted ? "visible" : "hidden"}
                  className="p-4 bg-blue-50/50 rounded-xl border border-blue-200/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 font-medium">
                        Atualizando informações
                      </p>
                      <p className="text-xs text-blue-600">
                        As alterações serão aplicadas imediatamente e o cliente será notificado por email.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </CardContent>

              <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2 pb-6">
                <Button
                  type="submit"
                  variant="gold"
                  fullWidth
                  isLoading={isSaving}
                  disabled={!isFormValid}
                  className="py-3.5 text-lg font-semibold group"
                >
                  <span className="flex items-center justify-center gap-2">
                    {isSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Atualizar Cliente
                      </>
                    )}
                  </span>
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  fullWidth
                  onClick={() => navigate('/admin/clientes')}
                  className="border-gold-300 text-brown-600 hover:bg-gold-50/50"
                >
                  Cancelar
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </Container>
    </div>
  )
}