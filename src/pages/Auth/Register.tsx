// src/pages/Auth/Register.tsx

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus, 
  Sparkles,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ChefHat,
  Shield
} from 'lucide-react'
import { Button, Input, Card, CardHeader, CardTitle, CardContent, CardFooter, showToast } from '@/components/ui'
import { useAuthStore } from '@/store/authStore'
import { useErrorHandler } from '@/hooks/useErrorHandler'

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

const inputVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.08 + 0.3,
      duration: 0.4,
      ease: [0.25, 0.1, 0.15, 1]
    }
  })
}

const floatAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut"
  }
}

const passwordStrengthVariants = {
  weak: { width: '30%', backgroundColor: '#ef4444' },
  medium: { width: '60%', backgroundColor: '#f59e0b' },
  strong: { width: '100%', backgroundColor: '#22c55e' },
}

export function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false
  })
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const navigate = useNavigate()
  const register = useAuthStore((state) => state.register)
  const { handleError, getFieldError, clearFieldError } = useErrorHandler()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // ============================================================
  // VALIDAÇÕES
  // ============================================================
  const isNameValid = name.length >= 2
  const isEmailValid = email.includes('@') && email.includes('.')
  const isPhoneValid = phone.length === 0 || phone.replace(/\D/g, '').length >= 9
  const isPasswordValid = password.length >= 6
  const doPasswordsMatch = password === confirmPassword && password.length > 0

  // Força da senha
  const getPasswordStrength = () => {
    if (password.length === 0) return null
    if (password.length < 6) return 'weak'
    if (password.length < 10) return 'medium'
    return 'strong'
  }

  const passwordStrength = getPasswordStrength()
  const strengthLabels = {
    weak: 'Fraca',
    medium: 'Média',
    strong: 'Forte'
  }

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!acceptedTerms) {
      showToast.warning('Por favor, aceite os termos e condições')
      return
    }

    if (password !== confirmPassword) {
      showToast.error('As senhas não coincidem')
      return
    }

    if (password.length < 6) {
      showToast.error('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setIsLoading(true)

    try {
      const user = await register({ 
        username: name, 
        email, 
        password, 
        phone: phone || undefined 
      })

      showToast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Conta criada com sucesso! 🎉</span>
        </div>
      )

      setTimeout(() => {
        if (user?.user_type === 'admin') {
          navigate('/admin', { replace: true })
        } else {
          navigate('/', { replace: true })
        }
      }, 300)

    } catch (error: any) {
      console.error('Erro ao registrar:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao criar conta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-cream-50 via-cream-100 to-gold-50/30 py-12 px-4 relative overflow-hidden">
      
      {/* ============================================================ */}
      {/* FUNDO DECORATIVO */}
      {/* ============================================================ */}
      <div className="absolute inset-0 bg-luxury-pattern opacity-5" />
      
      <motion.div 
        className="absolute -top-20 -right-20 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl"
        animate={floatAnimation}
      />
      <motion.div 
        className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"
        animate={{
          y: [0, 15, 0],
          transition: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }
        }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-300/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          transition: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      />

      {/* ============================================================ */}
      {/* CARD DE REGISTRO */}
      {/* ============================================================ */}
      <motion.div
        initial="hidden"
        animate={isMounted ? "visible" : "hidden"}
        variants={scaleIn}
        className="w-full max-w-md relative z-10"
      >
        <Card variant="gold" className="w-full shadow-2xl shadow-gold-500/10 border-2 border-gold-200/30 backdrop-blur-sm bg-white/95 overflow-hidden">
          
          {/* Decorative top bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300" />

          <CardHeader className="text-center pt-8 pb-2">
            <motion.div variants={fadeUp} className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/30">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <CardTitle className="text-3xl font-display text-brown-800">
                Criar <span className="text-gold-500">Conta</span>
              </CardTitle>
              <p className="text-brown-500 text-sm mt-2">
                Comece sua jornada gastronômica conosco
              </p>
            </motion.div>

            <motion.div 
              variants={fadeUp}
              className="flex items-center justify-center gap-2 mt-3"
            >
              <span className="w-12 h-0.5 bg-gold-300" />
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span className="w-12 h-0.5 bg-gold-300" />
            </motion.div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-2">
              {/* ============================================================ */}
              {/* NOME */}
              {/* ============================================================ */}
              <motion.div
                custom={0}
                initial="hidden"
                animate={isMounted ? "visible" : "hidden"}
                variants={inputVariants}
              >
                <label className="block text-sm font-medium text-brown-700 mb-1.5">
                  Nome completo *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brown-400" />
                  <input
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      clearFieldError('username')
                    }}
                    onBlur={() => handleBlur('name')}
                    className={`
                      w-full pl-11 pr-4 py-3 bg-cream-50/50 border rounded-xl 
                      text-brown-800 placeholder-brown-400
                      focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                      transition-all duration-300
                      ${getFieldError('username') || (touched.name && !isNameValid && name.length > 0)
                        ? 'border-red-400 focus:ring-red-400/50 focus:border-red-400'
                        : 'border-cream-200 hover:border-gold-300'
                      }
                    `}
                    required
                  />
                  {touched.name && name.length > 0 && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                      {isNameValid ? (
                        <CheckCircle className="w-4.5 h-4.5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4.5 h-4.5 text-red-400" />
                      )}
                    </div>
                  )}
                </div>
                {getFieldError('username') && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1.5 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {getFieldError('username')}
                  </motion.p>
                )}
              </motion.div>

              {/* ============================================================ */}
              {/* EMAIL */}
              {/* ============================================================ */}
              <motion.div
                custom={1}
                initial="hidden"
                animate={isMounted ? "visible" : "hidden"}
                variants={inputVariants}
              >
                <label className="block text-sm font-medium text-brown-700 mb-1.5">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brown-400" />
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      clearFieldError('email')
                    }}
                    onBlur={() => handleBlur('email')}
                    className={`
                      w-full pl-11 pr-4 py-3 bg-cream-50/50 border rounded-xl 
                      text-brown-800 placeholder-brown-400
                      focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                      transition-all duration-300
                      ${getFieldError('email') || (touched.email && !isEmailValid && email.length > 0)
                        ? 'border-red-400 focus:ring-red-400/50 focus:border-red-400'
                        : 'border-cream-200 hover:border-gold-300'
                      }
                    `}
                    required
                  />
                  {touched.email && email.length > 0 && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                      {isEmailValid ? (
                        <CheckCircle className="w-4.5 h-4.5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4.5 h-4.5 text-red-400" />
                      )}
                    </div>
                  )}
                </div>
                {getFieldError('email') && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1.5 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {getFieldError('email')}
                  </motion.p>
                )}
              </motion.div>

              {/* ============================================================ */}
              {/* TELEFONE */}
              {/* ============================================================ */}
              <motion.div
                custom={2}
                initial="hidden"
                animate={isMounted ? "visible" : "hidden"}
                variants={inputVariants}
              >
                <label className="block text-sm font-medium text-brown-700 mb-1.5">
                  Telefone <span className="text-brown-400 text-xs">(opcional)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brown-400" />
                  <input
                    type="tel"
                    placeholder="+244 999 999 999"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value)
                      clearFieldError('phone')
                    }}
                    onBlur={() => handleBlur('phone')}
                    className={`
                      w-full pl-11 pr-4 py-3 bg-cream-50/50 border rounded-xl 
                      text-brown-800 placeholder-brown-400
                      focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                      transition-all duration-300
                      ${getFieldError('phone') || (touched.phone && !isPhoneValid && phone.length > 0)
                        ? 'border-red-400 focus:ring-red-400/50 focus:border-red-400'
                        : 'border-cream-200 hover:border-gold-300'
                      }
                    `}
                  />
                  {touched.phone && phone.length > 0 && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                      {isPhoneValid ? (
                        <CheckCircle className="w-4.5 h-4.5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4.5 h-4.5 text-red-400" />
                      )}
                    </div>
                  )}
                </div>
                {getFieldError('phone') && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1.5 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {getFieldError('phone')}
                  </motion.p>
                )}
              </motion.div>

              {/* ============================================================ */}
              {/* SENHA */}
              {/* ============================================================ */}
              <motion.div
                custom={3}
                initial="hidden"
                animate={isMounted ? "visible" : "hidden"}
                variants={inputVariants}
              >
                <label className="block text-sm font-medium text-brown-700 mb-1.5">
                  Senha *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brown-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      clearFieldError('password')
                    }}
                    onBlur={() => handleBlur('password')}
                    className={`
                      w-full pl-11 pr-12 py-3 bg-cream-50/50 border rounded-xl 
                      text-brown-800 placeholder-brown-400
                      focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                      transition-all duration-300
                      ${getFieldError('password') || (touched.password && !isPasswordValid && password.length > 0)
                        ? 'border-red-400 focus:ring-red-400/50 focus:border-red-400'
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
                </div>

                {/* Força da senha */}
                {password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-brown-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ 
                            width: passwordStrength === 'weak' ? '30%' :
                                   passwordStrength === 'medium' ? '60%' : '100%'
                          }}
                          className={`h-full rounded-full transition-all duration-500 ${
                            passwordStrength === 'weak' ? 'bg-red-400' :
                            passwordStrength === 'medium' ? 'bg-amber-400' : 'bg-green-400'
                          }`}
                        />
                      </div>
                      <span className={`text-xs font-medium ${
                        passwordStrength === 'weak' ? 'text-red-400' :
                        passwordStrength === 'medium' ? 'text-amber-400' : 'text-green-400'
                      }`}>
                        {passwordStrength && strengthLabels[passwordStrength]}
                      </span>
                    </div>
                    <p className="text-xs text-brown-400">
                      {password.length < 6 ? 'Mínimo 6 caracteres' : 
                       password.length < 10 ? 'Adicione mais caracteres para uma senha forte' : 
                       'Senha forte! ✅'}
                    </p>
                  </motion.div>
                )}

                {getFieldError('password') && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1.5 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {getFieldError('password')}
                  </motion.p>
                )}
              </motion.div>

              {/* ============================================================ */}
              {/* CONFIRMAR SENHA */}
              {/* ============================================================ */}
              <motion.div
                custom={4}
                initial="hidden"
                animate={isMounted ? "visible" : "hidden"}
                variants={inputVariants}
              >
                <label className="block text-sm font-medium text-brown-700 mb-1.5">
                  Confirmar Senha *
                </label>
                <div className="relative">
                  <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brown-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Digite a senha novamente"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      clearFieldError('confirm_password')
                    }}
                    onBlur={() => handleBlur('confirmPassword')}
                    className={`
                      w-full pl-11 pr-12 py-3 bg-cream-50/50 border rounded-xl 
                      text-brown-800 placeholder-brown-400
                      focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                      transition-all duration-300
                      ${(getFieldError('confirm_password') || (touched.confirmPassword && !doPasswordsMatch && confirmPassword.length > 0))
                        ? 'border-red-400 focus:ring-red-400/50 focus:border-red-400'
                        : touched.confirmPassword && doPasswordsMatch
                          ? 'border-green-400 focus:ring-green-400/50 focus:border-green-400'
                          : 'border-cream-200 hover:border-gold-300'
                      }
                    `}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4.5 h-4.5" />
                    ) : (
                      <Eye className="w-4.5 h-4.5" />
                    )}
                  </button>
                </div>
                {touched.confirmPassword && confirmPassword.length > 0 && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-sm mt-1.5 flex items-center gap-1 ${
                      doPasswordsMatch ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {doPasswordsMatch ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        Senhas coincidem
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" />
                        As senhas não coincidem
                      </>
                    )}
                  </motion.p>
                )}
                {getFieldError('confirm_password') && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1.5 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {getFieldError('confirm_password')}
                  </motion.p>
                )}
              </motion.div>

              {/* ============================================================ */}
              {/* TERMOS E CONDIÇÕES */}
              {/* ============================================================ */}
              <motion.div
                custom={5}
                initial="hidden"
                animate={isMounted ? "visible" : "hidden"}
                variants={inputVariants}
                className="flex items-start gap-3 pt-2"
              >
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-cream-300 text-gold-500 focus:ring-gold-400 focus:ring-offset-0 transition-colors"
                />
                <label htmlFor="terms" className="text-sm text-brown-600 leading-relaxed">
                  Li e aceito os{' '}
                  <Link to="/termos" className="text-gold-500 hover:text-gold-600 hover:underline transition-colors">
                    Termos de Uso
                  </Link>
                  {' '}e{' '}
                  <Link to="/politica-privacidade" className="text-gold-500 hover:text-gold-600 hover:underline transition-colors">
                    Política de Privacidade
                  </Link>
                </label>
              </motion.div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-2 pb-8">
              <motion.div
                custom={6}
                initial="hidden"
                animate={isMounted ? "visible" : "hidden"}
                variants={inputVariants}
                className="w-full"
              >
                <Button
                  type="submit"
                  variant="gold"
                  fullWidth
                  isLoading={isLoading}
                  className="py-3 text-lg font-semibold group"
                  disabled={!acceptedTerms}
                >
                  <span className="flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Criando conta...
                      </>
                    ) : (
                      <>
                        Criar Conta
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </span>
                </Button>
              </motion.div>

              <motion.p
                custom={7}
                initial="hidden"
                animate={isMounted ? "visible" : "hidden"}
                variants={inputVariants}
                className="text-sm text-brown-500 text-center"
              >
                Já tem uma conta?{' '}
                <Link
                  to="/login"
                  className="text-gold-500 hover:text-gold-600 font-medium hover:underline transition-all duration-300"
                >
                  Entrar agora
                </Link>
              </motion.p>

              {/* Badge de segurança */}
              <motion.div
                custom={8}
                initial="hidden"
                animate={isMounted ? "visible" : "hidden"}
                variants={inputVariants}
                className="flex items-center justify-center gap-2 text-xs text-brown-400"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Seus dados estão seguros</span>
                <span className="w-px h-3 bg-brown-200" />
                <span>🔒 Criptografia SSL</span>
              </motion.div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}