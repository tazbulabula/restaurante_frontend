// src/pages/Admin/Clientes/Criar.tsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Users,
  Shield,
  UserPlus,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Eye,
  EyeOff,
  Crown,
  UserCheck
} from 'lucide-react'
import { Container, Card, CardContent, CardFooter, Button, Input, showToast } from '@/components/ui'
import { usersApi } from '@/api/users'

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

export function AdminClientesCriar() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    phone: false,
  })

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    user_type: 'cliente',
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // ============================================================
  // VALIDAÇÕES
  // ============================================================
  const isUsernameValid = form.username.length >= 2
  const isEmailValid = form.email.includes('@') && form.email.includes('.')
  const isPasswordValid = form.password.length >= 6
  const isPhoneValid = form.phone.length === 0 || form.phone.replace(/\D/g, '').length >= 9

  const isFormValid = isUsernameValid && isEmailValid && isPasswordValid && isPhoneValid

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid) {
      showToast.warning('Por favor, preencha todos os campos obrigatórios corretamente')
      return
    }

    setIsLoading(true)

    try {
      await usersApi.criar(form)
      showToast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Cliente criado com sucesso! 🎉</span>
        </div>
      )
      navigate('/admin/clientes')
    } catch (error: any) {
      console.error('Erro ao criar cliente:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao criar cliente')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

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
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-display text-brown-800">
                    Novo <span className="text-gold-500">Cliente</span>
                  </h1>
                  <p className="text-brown-500 text-sm">
                    Adicione um novo cliente ao sistema
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
                    <User className="w-4 h-4 inline mr-2 text-gold-500" />
                    Nome *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brown-400" />
                    <input
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      onBlur={() => handleBlur('username')}
                      placeholder="Nome completo"
                      className={`
                        w-full pl-11 pr-4 py-3 bg-cream-50/50 border rounded-xl 
                        text-brown-800 placeholder-brown-400
                        focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                        transition-all duration-300
                        ${touched.username && !isUsernameValid && form.username.length > 0
                          ? 'border-red-400 focus:ring-red-400/50'
                          : 'border-cream-200 hover:border-gold-300'
                        }
                      `}
                      required
                    />
                  </div>
                  {touched.username && !isUsernameValid && form.username.length > 0 && (
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
                      value={form.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur('email')}
                      placeholder="cliente@email.com"
                      className={`
                        w-full pl-11 pr-4 py-3 bg-cream-50/50 border rounded-xl 
                        text-brown-800 placeholder-brown-400
                        focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                        transition-all duration-300
                        ${touched.email && !isEmailValid && form.email.length > 0
                          ? 'border-red-400 focus:ring-red-400/50'
                          : 'border-cream-200 hover:border-gold-300'
                        }
                      `}
                      required
                    />
                    {touched.email && form.email.length > 0 && (
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                        {isEmailValid ? (
                          <CheckCircle className="w-4.5 h-4.5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4.5 h-4.5 text-red-400" />
                        )}
                      </div>
                    )}
                  </div>
                  {touched.email && !isEmailValid && form.email.length > 0 && (
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
                {/* SENHA */}
                {/* ============================================================ */}
                <motion.div
                  custom={2}
                  variants={inputVariants}
                  initial="hidden"
                  animate={isMounted ? "visible" : "hidden"}
                >
                  <label className="block text-sm font-medium text-brown-700 mb-1.5">
                    <Lock className="w-4 h-4 inline mr-2 text-gold-500" />
                    Senha *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brown-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      onBlur={() => handleBlur('password')}
                      placeholder="Mínimo 6 caracteres"
                      className={`
                        w-full pl-11 pr-12 py-3 bg-cream-50/50 border rounded-xl 
                        text-brown-800 placeholder-brown-400
                        focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                        transition-all duration-300
                        ${touched.password && !isPasswordValid && form.password.length > 0
                          ? 'border-red-400 focus:ring-red-400/50'
                          : 'border-cream-200 hover:border-gold-300'
                        }
                      `}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4.5 h-4.5" />
                      ) : (
                        <Eye className="w-4.5 h-4.5" />
                      )}
                    </button>
                    {touched.password && form.password.length > 0 && (
                      <div className="absolute right-12 top-1/2 -translate-y-1/2">
                        {isPasswordValid ? (
                          <CheckCircle className="w-4.5 h-4.5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4.5 h-4.5 text-red-400" />
                        )}
                      </div>
                    )}
                  </div>
                  {touched.password && !isPasswordValid && form.password.length > 0 && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 mt-1.5 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      Senha deve ter pelo menos 6 caracteres
                    </motion.p>
                  )}
                  {touched.password && isPasswordValid && form.password.length > 0 && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-green-500 mt-1.5 flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Senha válida
                    </motion.p>
                  )}
                </motion.div>

                {/* ============================================================ */}
                {/* TELEFONE */}
                {/* ============================================================ */}
                <motion.div
                  custom={3}
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
                      value={form.phone}
                      onChange={handleChange}
                      onBlur={() => handleBlur('phone')}
                      placeholder="+244 999 999 999"
                      className={`
                        w-full pl-11 pr-4 py-3 bg-cream-50/50 border rounded-xl 
                        text-brown-800 placeholder-brown-400
                        focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                        transition-all duration-300
                        ${touched.phone && !isPhoneValid && form.phone.length > 0
                          ? 'border-red-400 focus:ring-red-400/50'
                          : 'border-cream-200 hover:border-gold-300'
                        }
                      `}
                    />
                  </div>
                  {touched.phone && !isPhoneValid && form.phone.length > 0 && (
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
                  custom={4}
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
                      value={form.user_type}
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
                  custom={5}
                  variants={inputVariants}
                  initial="hidden"
                  animate={isMounted ? "visible" : "hidden"}
                  className="p-4 bg-gold-50/50 rounded-xl border border-gold-200/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-gold-600" />
                    </div>
                    <div>
                      <p className="text-sm text-brown-700 font-medium">
                        Criando um novo cliente
                      </p>
                      <p className="text-xs text-brown-500">
                        O cliente receberá um email de boas-vindas com suas credenciais de acesso.
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
                  isLoading={isLoading}
                  disabled={!isFormValid}
                  className="py-3.5 text-lg font-semibold group"
                >
                  <span className="flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Criando...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        Criar Cliente
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