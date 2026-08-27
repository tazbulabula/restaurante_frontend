// src/pages/Auth/Login.tsx

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  Sparkles,
  ChefHat,
  ArrowRight,
  CheckCircle,
  AlertCircle
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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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
      delay: i * 0.1 + 0.3,
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

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [touched, setTouched] = useState({ email: false, password: false })
  
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const { handleError, getFieldError, clearFieldError } = useErrorHandler()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const user = await login(email, password)
      
      // Toast de sucesso com animação
      showToast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Bem-vindo de volta, {user?.username || 'usuário'}! 🎉</span>
        </div>
      )
      
      // Redirecionar após um pequeno delay para o toast ser visto
      setTimeout(() => {
        if (user?.user_type === 'admin') {
          navigate('/admin')
        } else {
          navigate('/')
        }
      }, 300)
      
    } catch (error: any) {
      console.error('Erro ao fazer login:', error)
      handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBlur = (field: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const isEmailValid = email.includes('@') && email.includes('.')
  const isPasswordValid = password.length >= 6

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
      {/* CARD DE LOGIN */}
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
          
          <CardHeader className="text-center pt-8 pb-4">
            <motion.div 
              variants={fadeUp}
              className="flex justify-center mb-4"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/30">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            
            <motion.div variants={fadeUp}>
              <CardTitle className="text-3xl font-display text-brown-800">
                Bem-vindo de <span className="text-gold-500">volta</span>
              </CardTitle>
              <p className="text-brown-500 text-sm mt-2">
                Faça login para continuar sua experiência gastronômica
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
            <CardContent className="space-y-5 pt-2">
              {/* Email */}
              <motion.div
                custom={0}
                initial="hidden"
                animate={isMounted ? "visible" : "hidden"}
                variants={inputVariants}
              >
                <label className="block text-sm font-medium text-brown-700 mb-1.5">
                  Email
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

              {/* Senha */}
              <motion.div
                custom={1}
                initial="hidden"
                animate={isMounted ? "visible" : "hidden"}
                variants={inputVariants}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-brown-700">
                    Senha
                  </label>
                  <Link 
                    to="/esqueci-senha" 
                    className="text-xs text-gold-500 hover:text-gold-600 hover:underline transition-colors"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brown-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
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
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-2 pb-8">
              <motion.div
                custom={2}
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
                >
                  <span className="flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Entrando...
                      </>
                    ) : (
                      <>
                        Entrar
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </span>
                </Button>
              </motion.div>

              <motion.p 
                custom={3}
                initial="hidden"
                animate={isMounted ? "visible" : "hidden"}
                variants={inputVariants}
                className="text-sm text-brown-500 text-center"
              >
                Não tem uma conta?{' '}
                <Link 
                  to="/registrar" 
                  className="text-gold-500 hover:text-gold-600 font-medium hover:underline transition-all duration-300"
                >
                  Criar conta grátis
                </Link>
              </motion.p>

            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}